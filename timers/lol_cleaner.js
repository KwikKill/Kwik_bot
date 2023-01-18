const config = require('../config.json');

module.exports = {
    name: 'lol_cleaner',
    group: 'lol',
    onsetup: false,
    timer: 86400000,
    description: "Clean up matchs older than 1 year",
    async run(client) {
        const timestamp = Date.now();
        const timestamp1 = timestamp - 31536000000;
        const timestamp2 = timestamp - 7884000000;
        await client.pg.query("DELETE FROM matchs WHERE timestamp < $1", [timestamp1]);
        await client.pg.query("DELETE FROM matchs WHERE player in (SELECT puuid FROM summoners WHERE discordid IN (SELECT DISTINCT discordid FROM summoners EXCEPT SELECT discordid FROM matchs, summoners WHERE matchs.player = summoners.puuid AND timestamp > $1 GROUP BY summoners.discordid));", [timestamp2]);
        await client.pg.query("DELETE FROM summoners WHERE discordid in (SELECT DISTINCT discordid FROM summoners EXCEPT SELECT discordid FROM matchs, summoners WHERE matchs.player = summoners.puuid AND timestamp > $1 GROUP BY summoners.discordid)", [timestamp2]);
        if (config.verbose) {
            console.log("lol cleaner done");
        }
    }
};