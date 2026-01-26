const logger = require('./logger');
const { EmbedBuilder } = require('discord.js');
const GuildsEnabled = [
    //"513776796211085342", // KwiK Bot Dev
    //"890915473363980308", // Crew YY
    //"962329252550807592" // Chisakouille
    "all"
]

/**
 * Weekly leaderboard poster
 * - Runs a once-per-week job (Monday 08:00 server time)
 * - For each tracker channel in `client.lol.lol_rank_manager.trackers` posts a Top 10 KwikScore
 */
function initWeeklyLeaderboards(client) {
    if (!client || !client.pg || !client.lol || !client.lol.lol_rank_manager) return;

    const CHECK_INTERVAL_MS = 5 * 60 * 1000; // check every 5 minutes

    async function runForTracker(tracker, rows) {
        logger.log('[WeeklyLeaderboards] running "runForTracker" for tracker: ' + JSON.stringify(tracker));
        try {
            const channelId = tracker.channel;
            const guildId = tracker.guild;

            // Fetch channel and guild
            const channel = await client.channels.fetch(channelId).catch(() => null);
            if (!channel) {
                logger.error(`Channel ${channelId} not found, removing tracker`);
                await client.pg.query('DELETE FROM trackers WHERE channelid = $1', [channelId]).catch(() => null);
                // remove from runtime trackers
                const idx = client.lol.lol_rank_manager.trackers.indexOf(tracker);
                if (idx !== -1) client.lol.lol_rank_manager.trackers.splice(idx, 1);
                return;
            }

            const guild = channel.guild ?? await client.guilds.fetch(guildId).catch(() => null);
            if (!guild) return;

            if (!rows || rows.length === 0) return;

            // Build top 10 for this guild by checking membership
            const lines = [];
            for (const row of rows) {
                if (lines.length >= 10) break;
                const discordId = row.discordid;
                // try to fetch member in guild
                const member = await guild.members.fetch(discordId).catch(() => null);
                if (!member || member.user.bot) continue;
                lines.push(`- <@${discordId}> : ${Math.round(row.ks)} (${row.count} Games)`);
            }

            if (lines.length === 0) {
                // nothing to post for this guild
                return;
            }

            const embed = new EmbedBuilder()
                .setTitle('Weekly Score Top 10')
                .setDescription(`Top players for **${guild.name}**`)
                .setColor('#00FF00')
                .addFields({ name: 'Top 10 Score :', value: lines.join('\n') })
                .setTimestamp();

            logger.log('[WeeklyLeaderboards] Sending weekly leaderboard to channel ' + channelId);
            await channel.send({ embeds: [embed] }).catch(async (e) => {
                logger.error('Error sending weekly leaderboard to ' + channelId + ' : ' + e);
                if (e.code === 10003 || e.code === 50001) {
                    // channel not found or missing permissions: remove tracker
                    await client.pg.query('DELETE FROM trackers WHERE channelid = $1', [channelId]).catch(() => null);
                    const idx = client.lol.lol_rank_manager.trackers.indexOf(tracker);
                    if (idx !== -1) client.lol.lol_rank_manager.trackers.splice(idx, 1);
                }
            });

        } catch (e) {
            logger.error('Error in weekly leaderboard for tracker ' + JSON.stringify(tracker) + ' : ' + e);
        }
    }

    async function checkAndRun() {
        const now = new Date();
        // Monday is 1 in getDay()
        if (now.getDay() !== 1) return;
        if (now.getHours() !== 8) return;
        if (now.getMinutes() >= 30) return;

        // Check global lock FIRST to prevent duplicate runs
        const globalKey = 'weekly_leaderboard:globalLock';
        const today = new Date().toISOString().slice(0, 10);

        try {
            if (client.redisPubClient && client.redisPubClient.get) {
                const lastGlobalRun = await client.redisPubClient.get(globalKey).catch(() => null);
                if (lastGlobalRun === today) {
                    // Already ran today, skip
                    return;
                }
            }
        } catch (e) {
            logger.error('[WeeklyLeaderboards] Error checking global lock: ' + e);
            return; // Fail safe: don't run if we can't check
        }

        // Set the global lock immediately to prevent concurrent runs
        try {
            if (client.redisPubClient && client.redisPubClient.set) {
                await client.redisPubClient.set(globalKey, today).catch(() => null);
            }
        } catch (e) {
            logger.error('[WeeklyLeaderboards] Error setting global lock: ' + e);
            return;
        }

        logger.log('[WeeklyLeaderboards] Checking trackers for weekly leaderboard posting');

        // Run the heavy query once per check
        const query = `WITH COEF AS (
                SELECT champion, count, 200/(carry+wr+kp+vs*25+10*cs) AS score FROM (
                    SELECT champion, count(*),
                        (cast(count(*) FILTER (WHERE result = 'Win')*100 as float)/count(*)) as WR,
                        (cast(count(*) FILTER (WHERE (first_gold OR first_damages OR first_tanked))*100 as float)/count(*)) as CARRY,
                        cast((avg(kill)+avg(assists))*100 as float)/avg(total_kills) as KP,
                        cast(avg(vision_score) as float)/(avg(length)/60) as VS,
                        cast(avg(cs) as float)/(avg(length)/60) as CS,
                        (cast(count(*) FILTER (WHERE first_gold AND first_damages AND first_tanked)*100 as float)/count(*)) as hardcarry
                    FROM matchs GROUP BY champion
                ) AS t1
            )
            SELECT discordid, count, (CASE WHEN count<100 THEN (carry+wr+kp+vs*25+10*cs) ELSE (carry+wr+kp+vs*25+10*cs) END)*delta AS ks
            FROM (
            SELECT summoners.discordid, count(*),
                (cast(count(*) FILTER (WHERE result = 'Win')*100 as float)/count(*)) as WR,
                (cast(count(*) FILTER (WHERE (first_gold OR first_damages OR first_tanked))*100 as float)/count(*)) as CARRY,
                cast((avg(kill)+avg(assists))*100 as float)/avg(total_kills) as KP,
                cast(avg(vision_score) as float)/(avg(length)/60) as VS,
                cast(avg(cs) as float)/(avg(length)/60) as CS,
                (cast(count(*) FILTER (WHERE first_gold AND first_damages AND first_tanked)*100 as float)/count(*)) as hardcarry, avg(score) as delta
            FROM matchs, summoners, COEF
            WHERE matchs.player = summoners.puuid
              AND COEF.champion = matchs.champion
              AND matchs.gamemode IN ('CLASSIC','RANKED_FLEX','RANKED_SOLO')
              AND to_timestamp(matchs.timestamp::double precision / 1000) BETWEEN (now() - interval '7 days') AND now()
              AND summoners.discordid <> '503109625772507136'
            GROUP BY summoners.discordid
            ) AS t1
            WHERE count >= 5
            ORDER BY ks DESC
            LIMIT 1000;`;

        const globalRes = await client.pg.query(query).catch(err => { logger.error(err); return null; });
        const rows = globalRes && globalRes.rows ? globalRes.rows : [];

        for (const tracker of client.lol.lol_rank_manager.trackers || []) {
            logger.log('[WeeklyLeaderboards] Processing tracker for channel ' + tracker.channel);
            try {
                const guildId = tracker.guild;
                if (
                    !GuildsEnabled.includes(guildId)
                    && !GuildsEnabled.includes("all")
                ) {
                    continue;
                }
                logger.log('[WeeklyLeaderboards] Building leaderboard for guild ' + guildId);
                await runForTracker(tracker, rows);
            } catch (e) {
                logger.error('Error checking tracker ' + JSON.stringify(tracker) + ' : ' + e);
            }
        }
    }

    // Start periodic check
    setInterval(checkAndRun, CHECK_INTERVAL_MS);
    logger.log('[WeeklyLeaderboards] Initialized weekly leaderboard scheduler');
}

module.exports = {
    initWeeklyLeaderboards, // run an immediate check (useful for testing)
    postNowForAllTrackers: async (client) => {
        if (!client || !client.lol || !client.lol.lol_rank_manager) return;
        // reuse the check logic by calling init then invoking the checker once
        try {
            const { initWeeklyLeaderboards } = require('./weekly_leaderboard');
            // init ensures helper functions exist; call checkAndRun by invoking a fresh interval
            initWeeklyLeaderboards(client);
            // run check immediately by waiting a short time for the interval to schedule and run
            await new Promise(res => setTimeout(res, 1500));
        } catch (e) {
            logger.error('Error in postNowForAllTrackers: ' + e);
        }
    }
};
