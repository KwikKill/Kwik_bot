const logger = require('./logger.js');
const sharp = require('sharp');
const axios = require('axios');

const { EmbedBuilder } = require('discord.js');

class LolRankManager {
    rank_list = ["IRON", "BRONZE", "SILVER", "GOLD", "PLATINUM", "EMERALD", "DIAMOND", "MASTER", "GRANDMASTER", "CHALLENGER"];
    emojis = {
        "unranked": "unranked",
    };
    trackers= [];
    champions = {};
    version = "";
    set_up = false;

    async setup(client) {
        this.client = client;

        // deploy rank emojis to guild "513776796211085342"
        for (let i = 0; i < this.rank_list.length; i++) {
            const name = this.rank_list[i].toLowerCase();

            await client.application.emojis.fetch();

            const emoji = client.application.emojis.cache.find(emoji => emoji.name === name);
            if (!emoji) {
                const imageUrl = "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-static-assets/global/default/images/ranked-emblem/emblem-" + name + ".png";

                // Download the image
                const response = await axios.get(imageUrl, {
                    responseType: 'arraybuffer'
                });

                // Zoom in the middle of the image to get the 256x256 version
                const imageBuffer = response.data;
                const imageMetadata = await sharp(imageBuffer).metadata();
                const imageWidth = imageMetadata.width;
                const imageHeight = imageMetadata.height;
                const zoomedImage = await sharp(imageBuffer)
                    .extract({
                        left: imageWidth / 2 - imageWidth / 10,
                        top: imageHeight / 2 - imageWidth / 10,
                        width: imageWidth / 5,
                        height: imageWidth / 5
                    })
                    .toBuffer();

                // reduce image size to 256x256
                const resizedImage = await sharp(zoomedImage).resize(256, 256).toBuffer();

                // Create the emoji using the zoomed image file
                client.application.emojis.create(
                    { attachment: resizedImage, name: name }
                ).then(createdEmoji => {
                    this.emojis[name] = "<:" + createdEmoji.name + ":" + createdEmoji.id + ">";
                }).catch(console.error);
            } else {
                this.emojis[name] = "<:" + emoji.name + ":" + emoji.id + ">";
            }
        }

        //deploy mastery emojis to guild "513776796211085342"
        for (let i = 1; i <= 7; i++) {
            const name = "mastery" + i;

            const emoji = client.application.emojis.cache.find(emoji => emoji.name === name);
            if (!emoji) {
                const imageUrl = "https://raw.communitydragon.org/latest/plugins/rcp-fe-lol-postgame/global/default/mastery-" + i + ".png";

                // Download the image
                const response = await axios.get(imageUrl, {
                    responseType: 'arraybuffer'
                });

                // Create the emoji using the image file
                client.application.emojis.create(
                    { attachment: response.data, name: name }
                ).then(createdEmoji => {
                    this.emojis[name] = "<:" + createdEmoji.name + ":" + createdEmoji.id + ">";
                }).catch(console.error);

            } else {
                this.emojis[name] = "<:" + emoji.name + ":" + emoji.id + ">";
            }
        }

        // Upload every champion icon as emoji
        for (const x in client.lol.champions) {
            const name = client.lol.champions[x].toLowerCase().replaceAll(" ", "").replaceAll("'", "").replaceAll(".", "").replaceAll(":", "").replaceAll("!", "").replaceAll("?", "").replaceAll("-", "").replaceAll("(", "").replaceAll(")", "").replaceAll("/", "").replaceAll("\\", "").replaceAll("’", "").replaceAll("é", "e").replaceAll("ö", "o").replaceAll("ü", "u").replaceAll("ç", "c").replaceAll("à", "a").replaceAll("è", "e").replaceAll("ê", "e").replaceAll("â", "a").replaceAll("ô", "o").replaceAll("î", "i").replaceAll("û", "u").replaceAll("ë", "e").replaceAll("ï", "i").replaceAll("ü", "u").replaceAll("ö", "o").replaceAll("ä", "a").replaceAll(" ", "").replaceAll("'", "").replaceAll(".", "").replaceAll(":", "").replaceAll("!", "").replaceAll("?", "").replaceAll("&", "");

            const emoji = client.application.emojis.cache.find(emoji => emoji.name === name);
            if (!emoji) {
                const imageUrl = "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/" + x + ".png";

                // Download the image
                const response = await axios.get(imageUrl, {
                    responseType: 'arraybuffer'
                });

                // Create the emoji using the image file
                client.application.emojis.create(
                    { attachment: response.data, name: name }
                ).then(createdEmoji => {
                    this.emojis[name] = "<:" + createdEmoji.name + ":" + createdEmoji.id + ">";
                }).catch(console.error);

            } else {
                this.emojis[name] = "<:" + emoji.name + ":" + emoji.id + ">";
            }
        }

        // Get the current version of League of Legends
        this.champions = await client.lol.lol_api.getChampsId("EUW1", client);
        const versions = await client.lol.lol_api.getCurrentPatch("EUW1", client);
        this.version = versions["n"]["champion"];

        // every 10 minutes, refresh the version and champions list
        setInterval(async () => {
            this.champions = await client.lol.lol_api.getChampsId("EUW1", client);
            const versions = await client.lol.lol_api.getCurrentPatch("EUW1", client);
            this.version = versions["n"]["champion"];
        }, 10 * 60 * 1000);

        this.set_up = true;
    }

    /**
     * Update rank of user in the database
     * @function send_tracker_message
     * @param {object} current current summoner data
     * @param {object} last_game last game data
     */
    async send_tracker_message(puuid, old_rank, new_rank, last_game) {
        if (!this.set_up) {
            logger.error("LolRankManager not set up yet, cannot send tracker message");
            return;
        }

        // If the new rank is the same as the old rank, return
        if (JSON.stringify(old_rank) === JSON.stringify(new_rank)) {
            return;
        }

        // read current rank and send message if rank changed
        const embeds = await this.build_trackers(old_rank, new_rank, last_game);
        const sendPromises = [];

        for (const x of this.trackers) {
            const channelid = x.channel;

            for (const discordid of new_rank.discordid) {
                const embedData = embeds[discordid];
                if (!embedData) continue;

                const { embed, files } = embedData;

                // check if the user is muted
                if (
                    this.client.lol.player_mute_for_guild[x.guild] !== undefined
                    && this.client.lol.player_mute_for_guild[x.guild].includes(discordid)
                ) {
                    continue;
                }

                try {
                    const channel = await this.client.channels.fetch(channelid);
                    let user = false;
                    try {
                        user = await channel.guild.members.fetch(discordid);
                    } catch (e) {
                        user = false;
                    }
                    if (user || channelid === "1036963873422589972" || channelid === "991052056657793124") {
                        if (embed !== undefined) {
                            // check if the bot has permission to send messages in the channel
                            if (!channel.permissionsFor(this.client.user).has("SendMessages")) {
                                logger.error("Channel " + x + " not found or invalid permissions, deleting from database");
                                await this.client.pg.query("DELETE FROM trackers WHERE channelid = $1", [channelid]);
                                const index = this.trackers.indexOf(x);
                                this.trackers.splice(index, 1);
                                continue;
                            }

                            // send concurrently and handle per-send errors so we don't block the loop
                            const messagePayload = { embeds: [embed] };
                            if (files && files.length > 0) {
                                messagePayload.files = files;
                            }
                            
                            sendPromises.push(
                                channel.send(messagePayload).catch(async (e) => {
                                    if (e && (e.code === 10003 || e.code === 50001)) {
                                        logger.error("Channel " + x + " not found or invalid permissions, deleting from database");
                                        try {
                                            await this.client.pg.query("DELETE FROM trackers WHERE channelid = $1", [channelid]);
                                        } catch (dbErr) {
                                            logger.error("Failed to delete tracker for channel " + channelid + ": " + dbErr);
                                        }
                                        const index = this.trackers.indexOf(x);
                                        if (index !== -1) this.trackers.splice(index, 1);
                                    } else {
                                        logger.error("Unknown error while sending tracker message (" + channelid + "): " + e);
                                    }
                                })
                            );
                        } else {
                            logger.error("Error while building tracker embed for " + new_rank.gamename + "#" + new_rank.tagline);
                            logger.error("Current SOLO rank : " + old_rank["RANKED_SOLO_5x5"]["tier"] + " " + old_rank["RANKED_SOLO_5x5"]["rank"] + " " + old_rank["RANKED_SOLO_5x5"]["leaguePoints"] + " LP");
                            logger.error("New SOLO rank : " + new_rank["RANKED_SOLO_5x5"]["tier"] + " " + new_rank["RANKED_SOLO_5x5"]["rank"] + " " + new_rank["RANKED_SOLO_5x5"]["leaguePoints"] + " LP");
                            logger.error("Current FLEX rank : " + old_rank["RANKED_FLEX_SR"]["tier"] + " " + old_rank["RANKED_FLEX_SR"]["rank"] + " " + old_rank["RANKED_FLEX_SR"]["leaguePoints"] + " LP");
                            logger.error("New FLEX rank : " + new_rank["RANKED_FLEX_SR"]["tier"] + " " + new_rank["RANKED_FLEX_SR"]["rank"] + " " + new_rank["RANKED_FLEX_SR"]["leaguePoints"] + " LP");
                        }
                    }
                } catch (e) {
                    // if bot can't fetch the discord channel
                    if (e.code === 10003 || e.code === 50001) {
                        // delete the channel from the database
                        logger.error("Channel " + x + " not found or invalid permissions, deleting from database");
                        await this.client.pg.query("DELETE FROM trackers WHERE channelid = $1", [channelid]);
                        const index = this.trackers.indexOf(x);
                        this.trackers.splice(index, 1);
                    } else {
                        logger.error("Unknown error while sending tracker message (" + channelid + "): " + e);
                    }
                }
            }
        }
        
        if (sendPromises.length) {
            try {
                await Promise.allSettled(sendPromises);
            } catch (e) {
                logger.error("Error while awaiting send promises: " + e);
            }
        }
    }

    /**
     * Get the LP change of a match
     * @function LP_change
     * @param {String} old_rank - Old rank of the player
     * @param {String} old_tier - Old tier of the player
     * @param {Number} old_LP - Old LP of the player
     * @param {String} rank - New rank of the player
     * @param {String} tier - New tier of the player
     * @param {Number} LP - New LP of the player
     * @returns {Number} The LP change
     */
    LP_change(old_rank, old_tier, old_LP, rank, tier, LP) {
        const value = this.rank_list.indexOf(tier) * 400
            + ["IV", "III", "II", "I"].indexOf(rank) * 100
            + LP;
        const old_value = this.rank_list.indexOf(old_tier) * 400
            + ["IV", "III", "II", "I"].indexOf(old_rank) * 100
            + old_LP;

        return value - old_value;
    }

    /**
     * Build tracker embed
     * @function build_trackers
     * @param {string} data user data
     * @param {object} current_rank current summoner rank data
     * @param {object} last_game last game data
     * @param {*} rank rank data
     * @returns {Promise<Object>} embeds with attachments
     */
    async build_trackers(data, rank, last_game) {
        const embeds = {};
        for (const discordid of data.discordid) {
            const embed = new EmbedBuilder();
            let files = [];

            // If the last game is not in the database or was skipped
            if (last_game === "none" || last_game === null) {
                // If the user just finished a games in solo/duo
                if ((
                    data["RANKED_SOLO_5x5"]["rank"] !== rank["RANKED_SOLO_5x5"]["rank"] ||
                    data["RANKED_SOLO_5x5"]["tier"] !== rank["RANKED_SOLO_5x5"]["tier"] ||
                    data["RANKED_SOLO_5x5"]["leaguePoints"] !== rank["RANKED_SOLO_5x5"]["leaguePoints"]
                ) && rank["RANKED_SOLO_5x5"]["tier"] !== "unranked") {
                    const LP_change = this.LP_change(
                        data["RANKED_SOLO_5x5"]["rank"],
                        data["RANKED_SOLO_5x5"]["tier"],
                        data["RANKED_SOLO_5x5"]["leaguePoints"],
                        rank["RANKED_SOLO_5x5"]["rank"],
                        rank["RANKED_SOLO_5x5"]["tier"],
                        rank["RANKED_SOLO_5x5"]["leaguePoints"]
                    );
                    embed.setTitle(
                        "Rank Solo/Duo update for " + data.gamename + "#" + data.tagline
                    );
                    embed.setDescription(
                        "<@" + discordid + "> just played some games in Solo/Duo queue."
                    );
                    embed.setColor(
                        "#77767b"
                    );
                    embed.addFields(
                        {
                            name: rank["RANKED_SOLO_5x5"]["tier"] + " " + rank["RANKED_SOLO_5x5"]["rank"] + " " + rank["RANKED_SOLO_5x5"]["leaguePoints"] + " LP",
                            value: LP_change > 0 ? "+" + LP_change + " LP" : LP_change + " LP",
                        }
                    );
                    embeds[discordid] = { embed, files };
                }
                // If the user just finished a games in flex
                else if ((
                    data["RANKED_FLEX_SR"]["rank"] !== rank["RANKED_FLEX_SR"]["rank"] ||
                    data["RANKED_FLEX_SR"]["tier"] !== rank["RANKED_FLEX_SR"]["tier"] ||
                    data["RANKED_FLEX_SR"]["leaguePoints"] !== rank["RANKED_FLEX_SR"]["leaguePoints"]
                ) && rank["RANKED_FLEX_SR"]["tier"] !== "unranked") {
                    const LP_change = this.LP_change(
                        data["RANKED_FLEX_SR"]["rank"],
                        data["RANKED_FLEX_SR"]["tier"],
                        data["RANKED_FLEX_SR"]["leaguePoints"],
                        rank["RANKED_FLEX_SR"]["rank"],
                        rank["RANKED_FLEX_SR"]["tier"],
                        rank["RANKED_FLEX_SR"]["leaguePoints"]
                    );
                    embed.setTitle(
                        "Rank Flex update for " + data.gamename + "#" + data.tagline
                    );
                    embed.setDescription(
                        "<@" + discordid + "> just played some games in Flex queue."
                    );
                    embed.setColor("#77767b");
                    embed.addFields(
                        {
                            name: rank["RANKED_FLEX_SR"]["tier"] + " " + rank["RANKED_FLEX_SR"]["rank"] + " " + rank["RANKED_FLEX_SR"]["leaguePoints"] + " LP",
                            value: LP_change > 0 ? "+" + LP_change + " LP" : LP_change + " LP",
                        }
                    );
                    embeds[discordid] = { embed, files };
                }
            } else {
                // Generate images if last_game data is available
                const badgeText = last_game["result"] === "Win" ? "MVP" : "ACE";
                const championImageBuffer = last_game["isMvp"] 
                    ? await this.create_mvp_champion_image(last_game["champion"], badgeText)
                    : null;

                const teamCompBuffer = last_game["all_players"] 
                    ? await this.create_team_composition_image(last_game["all_players"])
                    : null;

                // Attach images
                if (championImageBuffer) {
                    files.push({
                        attachment: championImageBuffer,
                        name: 'champion.png'
                    });
                    embed.setThumbnail('attachment://champion.png');
                } else {
                    embed.setThumbnail(this.get_champion_url(last_game["champion"]));
                }

                if (teamCompBuffer) {
                    files.push({
                        attachment: teamCompBuffer,
                        name: 'teamcomp.png'
                    });
                    embed.setImage('attachment://teamcomp.png');
                }

                // set embed URL
                embed.setURL(this.get_league_of_graph(last_game["matchId"]));

                const KDA = (last_game["kills"] + last_game["assists"]) / (last_game["deaths"] || 1)
                const emoji = KDA < 1 ?
                    "🗑️"
                    : KDA < 2 ?
                        "🎮"
                        : KDA < 5 ?
                            "📸"
                            : KDA < 10 ?
                                "⚡"
                                : "🔥";

                // If the user just finished his placement games in solo/duo
                if (
                    data["RANKED_SOLO_5x5"]["tier"] === 'unranked'
                    && rank["RANKED_SOLO_5x5"]["tier"] !== 'unranked'
                ) {
                    embed.setTitle(
                        "Placement Solo/Duo completed for " + data.gamename + "#" + data.tagline
                    );
                    embed.setDescription(
                        "<@" + discordid + "> just finished his placement games in Solo/Duo queue."
                    );
                    embed.setColor("#ff7800");
                    embed.addFields(
                        // KDA
                        {
                            name: ((last_game["kills"] + last_game["assists"]) / (last_game["deaths"] || 1)).toFixed(2) + " KDA",
                            value: last_game["kills"] + "/" + last_game["deaths"] + "/" + last_game["assists"],
                            inline: true,
                        },
                        // Rank
                        {
                            name: rank["RANKED_SOLO_5x5"]["tier"] + " " + rank["RANKED_SOLO_5x5"]["rank"] + " " + rank["RANKED_SOLO_5x5"]["leaguePoints"] + " LP",
                            value: "placement",
                            inline: true,
                        }
                    );
                    embeds[discordid] = { embed, files };
                }
                // If the user just finished his placement games in flex
                else if (
                    data["RANKED_FLEX_SR"]["tier"] === 'unranked'
                    && rank["RANKED_FLEX_SR"]["tier"] !== 'unranked'
                ) {
                    embed.setTitle(
                        "Placement Flex completed for " + data.gamename + "#" + data.tagline
                    );
                    embed.setDescription(
                        "<@" + discordid + "> just finished his placement games in Flex queue."
                    );
                    embed.setColor("#ff7800");
                    embed.addFields(
                        // KDA
                        {
                            name: ((last_game["kills"] + last_game["assists"]) / (last_game["deaths"] || 1)).toFixed(2) + " KDA",
                            value: last_game["kills"] + "/" + last_game["deaths"] + "/" + last_game["assists"],
                            inline: true,
                        },
                        // Rank
                        {
                            name: rank["RANKED_FLEX_SR"]["tier"] + " " + rank["RANKED_FLEX_SR"]["rank"] + " " + rank["RANKED_FLEX_SR"]["leaguePoints"] + " LP",
                            value: "placement",
                            inline: true,
                        }
                    );
                    embeds[discordid] = { embed, files };
                }
                // If the user just finished a game in solo/duo
                else if (
                    (
                        data["RANKED_SOLO_5x5"]["rank"] !== rank["RANKED_SOLO_5x5"]["rank"] ||
                        data["RANKED_SOLO_5x5"]["tier"] !== rank["RANKED_SOLO_5x5"]["tier"] ||
                        data["RANKED_SOLO_5x5"]["leaguePoints"] !== rank["RANKED_SOLO_5x5"]["leaguePoints"]
                    )
                    && rank["RANKED_SOLO_5x5"]["tier"] !== "unranked"
                ) {
                    const LP_change = this.LP_change(
                        data["RANKED_SOLO_5x5"]["rank"],
                        data["RANKED_SOLO_5x5"]["tier"],
                        data["RANKED_SOLO_5x5"]["leaguePoints"],
                        rank["RANKED_SOLO_5x5"]["rank"],
                        rank["RANKED_SOLO_5x5"]["tier"],
                        rank["RANKED_SOLO_5x5"]["leaguePoints"]
                    );

                    embed.setTitle(
                        "Rank Solo/Duo update for " + data.gamename + "#" + data.tagline
                    );
                    embed.setDescription(
                        "<@" + discordid + "> just " + (LP_change > 0 ? "won" : "lost") + " a game in Solo/Duo queue."
                    );
                    embed.setColor(LP_change > 0 ? "#33d17a" : "#c01c28");
                    embed.addFields(
                        // KDA
                        {
                            name: emoji + " " + KDA.toFixed(2) + " KDA",
                            value: last_game["kills"] + "/" + last_game["deaths"] + "/" + last_game["assists"],
                            inline: true,
                        },
                        // Rank
                        {
                            name: rank["RANKED_SOLO_5x5"]["tier"] + " " + rank["RANKED_SOLO_5x5"]["rank"] + " " + rank["RANKED_SOLO_5x5"]["leaguePoints"] + " LP",
                            value: LP_change > 0 ? "+" + LP_change + " LP" : LP_change + " LP",
                            inline: true,
                        }
                    );
                    embeds[discordid] = { embed, files };
                }
                // If the user just finished a game in flex
                else if (
                    (
                        data["RANKED_FLEX_SR"]["rank"] !== rank["RANKED_FLEX_SR"]["rank"] ||
                        data["RANKED_FLEX_SR"]["tier"] !== rank["RANKED_FLEX_SR"]["tier"] ||
                        data["RANKED_FLEX_SR"]["leaguePoints"] !== rank["RANKED_FLEX_SR"]["leaguePoints"]
                    )
                    && rank["RANKED_FLEX_SR"]["tier"] !== "unranked"
                ) {
                    const LP_change = this.LP_change(
                        data["RANKED_FLEX_SR"]["rank"],
                        data["RANKED_FLEX_SR"]["tier"],
                        data["RANKED_FLEX_SR"]["leaguePoints"],
                        rank["RANKED_FLEX_SR"]["rank"],
                        rank["RANKED_FLEX_SR"]["tier"],
                        rank["RANKED_FLEX_SR"]["leaguePoints"]
                    );

                    embed.setTitle(
                        "Rank Flex update for " + data.gamename + "#" + data.tagline
                    );
                    embed.setDescription(
                        "<@" + discordid + "> just " + (LP_change > 0 ? "won" : "lost") + " a game in Flex queue."
                    );
                    embed.setColor(LP_change > 0 ? "#33d17a" : "#c01c28");
                    embed.addFields(
                        // KDA
                        {
                            name: emoji + " " + KDA.toFixed(2) + " KDA",
                            value: last_game["kills"] + "/" + last_game["deaths"] + "/" + last_game["assists"],
                            inline: true,
                        },
                        // Rank
                        {
                            name: rank["RANKED_FLEX_SR"]["tier"] + " " + rank["RANKED_FLEX_SR"]["rank"] + " " + rank["RANKED_FLEX_SR"]["leaguePoints"] + " LP",
                            value: LP_change > 0 ? "+" + LP_change + " LP" : LP_change + " LP",
                            inline: true,
                        }
                    );
                    embeds[discordid] = { embed, files };
                }
            }
        }
        return embeds;
    }

    /**
     * Get champion URL from name
     * @function get_champion_url
     * @param {string} name champion name
     * @returns {string} champion URL
     */
    get_champion_url(name) {
        //return "https://cdn.communitydragon.org/latest/champion/" + this.get_champion_id(name) + "/square";
        if (this.champions[name] === undefined) {
            return "";
        }
        return "http://ddragon.leagueoflegends.com/cdn/" + this.version + "/img/champion/" + this.champions[name] + ".png";
    }

    /**
     * Get champion icon URL by ID
     * @function get_champion_icon_by_id
     * @param {number} championId champion ID
     * @returns {string} champion icon URL
     */
    get_champion_icon_by_id(championId) {
        return "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-icons/" + championId + ".png";
    }

    /**
     * Create champion image with MVP/ACE badge
     * @function create_mvp_champion_image
     * @param {string} championName champion name
     * @param {string} badgeText badge text ("MVP" or "ACE")
     * @returns {Promise<Buffer>} image buffer with badge
     */
    async create_mvp_champion_image(championName, badgeText = "MVP") {
        try {
            const championUrl = this.get_champion_url(championName);
            if (!championUrl) {
                return null;
            }

            // Download champion image
            const response = await axios.get(championUrl, {
                responseType: 'arraybuffer'
            });
            
            const championImage = sharp(response.data);
            const metadata = await championImage.metadata();
            
            // Create elongated badge with appropriate colors
            const badgeWidth = Math.floor(metadata.width * 0.55);
            const badgeHeight = Math.floor(metadata.width * 0.28);
            const borderRadius = badgeHeight / 2;
            const isAce = badgeText === "ACE";
            const gradientId = isAce ? "redGradient" : "goldGradient";
            const gradientColors = isAce 
                ? "<stop offset='0%' style='stop-color:#DC143C;stop-opacity:1' /><stop offset='50%' style='stop-color:#B22222;stop-opacity:1' /><stop offset='100%' style='stop-color:#8B0000;stop-opacity:1' />"
                : "<stop offset='0%' style='stop-color:#FFD700;stop-opacity:1' /><stop offset='50%' style='stop-color:#FFA500;stop-opacity:1' /><stop offset='100%' style='stop-color:#FF8C00;stop-opacity:1' />";
            
            const badgeSvg = `
                <svg width="${badgeWidth}" height="${badgeHeight}">
                    <defs>
                        <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
                            ${gradientColors}
                        </linearGradient>
                    </defs>
                    <rect x="2" y="2" width="${badgeWidth - 4}" height="${badgeHeight - 4}" rx="${borderRadius}" ry="${borderRadius}" fill="url(#${gradientId})" stroke="#000000" stroke-width="3"/>
                    <text x="${badgeWidth/2}" y="${badgeHeight/2 + badgeHeight/6}" 
                          font-family="Arial, sans-serif" 
                          font-size="${badgeHeight * 0.55}" 
                          font-weight="bold" 
                          fill="#000000" 
                          text-anchor="middle">${badgeText}</text>
                </svg>
            `;
            
            const badgeBuffer = Buffer.from(badgeSvg);
            
            // Composite badge on top-right corner
            const compositeImage = await championImage
                .composite([{
                    input: badgeBuffer,
                    top: 5,
                    left: metadata.width - badgeWidth - 5
                }])
                .png()
                .toBuffer();
            
            return compositeImage;
        } catch (error) {
            logger.error("Error creating MVP champion image: " + error);
            return null;
        }
    }

    /**
     * Create team composition image (5 champions + VS + 5 champions) with MVP/ACE badges
     * @function create_team_composition_image
     * @param {Array} allPlayers array of all players with championId, teamId, isMvp, and result
     * @returns {Promise<Buffer>} team composition image buffer
     */
    async create_team_composition_image(allPlayers) {
        try {
            // Group players by team and sort
            const teamGroups = {};
            for (const player of allPlayers) {
                if (!teamGroups[player.teamId]) {
                    teamGroups[player.teamId] = [];
                }
                teamGroups[player.teamId].push(player);
            }

            // Get the two teams
            const teamIds = Object.keys(teamGroups).map(Number).sort();
            if (teamIds.length !== 2) {
                return null;
            }

            const team1 = teamGroups[teamIds[0]].slice(0, 5);
            const team2 = teamGroups[teamIds[1]].slice(0, 5);
            
            // If not standard 5v5, just return null
            if (team1.length !== 5 || team2.length !== 5) {
                return null;
            }

            const iconSize = 80;
            const spacing = 5;
            const vsWidth = 60;
            const totalWidth = (iconSize * 5) + (spacing * 4) + vsWidth + (spacing * 2) + (iconSize * 5) + (spacing * 4);
            const totalHeight = iconSize;

            // Download all champion icons (without badges - we'll add them later)
            const downloadIcon = async (championId) => {
                const url = this.get_champion_icon_by_id(championId);
                const response = await axios.get(url, { responseType: 'arraybuffer' });
                return await sharp(response.data).resize(iconSize, iconSize).toBuffer();
            };

            const team1Icons = await Promise.all(team1.map(p => downloadIcon(p.championId)));
            const team2Icons = await Promise.all(team2.map(p => downloadIcon(p.championId)));

            // Create elongated badges for MVP/ACE players (larger for team comp)
            const createBadge = (badgeText) => {
                const badgeWidth = Math.floor(iconSize * 0.70);
                const badgeHeight = Math.floor(iconSize * 0.30);
                const borderRadius = badgeHeight / 2;
                const isAce = badgeText === "ACE";
                const gradientId = isAce ? "redGradient" : "goldGradient";
                const gradientColors = isAce 
                    ? "<stop offset='0%' style='stop-color:#DC143C;stop-opacity:1' /><stop offset='50%' style='stop-color:#B22222;stop-opacity:1' /><stop offset='100%' style='stop-color:#8B0000;stop-opacity:1' />"
                    : "<stop offset='0%' style='stop-color:#FFD700;stop-opacity:1' /><stop offset='50%' style='stop-color:#FFA500;stop-opacity:1' /><stop offset='100%' style='stop-color:#FF8C00;stop-opacity:1' />";
                
                return Buffer.from(`
                    <svg width="${badgeWidth}" height="${badgeHeight}">
                        <defs>
                            <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
                                ${gradientColors}
                            </linearGradient>
                        </defs>
                        <rect x="1" y="1" width="${badgeWidth - 2}" height="${badgeHeight - 2}" rx="${borderRadius}" ry="${borderRadius}" fill="url(#${gradientId})" stroke="#000000" stroke-width="2"/>
                        <text x="${badgeWidth/2}" y="${badgeHeight/2 + badgeHeight/5.5}" 
                              font-family="Arial, sans-serif" 
                              font-size="${badgeHeight * 0.55}" 
                              font-weight="bold" 
                              fill="#000000" 
                              text-anchor="middle">${badgeText}</text>
                    </svg>
                `);
            };

            // Create VS text SVG
            const vsSvg = `
                <svg width="${vsWidth}" height="${iconSize}">
                    <rect width="${vsWidth}" height="${iconSize}" fill="#1a1a1a"/>
                    <text x="${vsWidth/2}" y="${iconSize/2 + 10}" 
                          font-family="Arial, sans-serif" 
                          font-size="28" 
                          font-weight="bold" 
                          fill="#FFD700" 
                          text-anchor="middle">VS</text>
                </svg>
            `;
            const vsBuffer = Buffer.from(vsSvg);

            // Build composite array
            const composites = [];
            let currentLeft = 0;

            // Team 1 icons with badges
            for (let i = 0; i < team1Icons.length; i++) {
                composites.push({
                    input: team1Icons[i],
                    top: 0,
                    left: currentLeft
                });

                // Add badge if this player is MVP/ACE
                if (team1[i].isMvp) {
                    const badgeText = team1[i].result === "Win" ? "MVP" : "ACE";
                    const badge = createBadge(badgeText);
                    const badgeWidth = Math.floor(iconSize * 0.70);
                    const badgeHeight = Math.floor(iconSize * 0.30);
                    composites.push({
                        input: badge,
                        top: iconSize - badgeHeight - 2,
                        left: currentLeft + (iconSize - badgeWidth) / 2
                    });
                }

                currentLeft += iconSize + spacing;
            }

            // VS text
            composites.push({
                input: vsBuffer,
                top: 0,
                left: currentLeft
            });
            currentLeft += vsWidth + spacing;

            // Team 2 icons with badges
            for (let i = 0; i < team2Icons.length; i++) {
                composites.push({
                    input: team2Icons[i],
                    top: 0,
                    left: currentLeft
                });

                // Add badge if this player is MVP/ACE
                if (team2[i].isMvp) {
                    const badgeText = team2[i].result === "Win" ? "MVP" : "ACE";
                    const badge = createBadge(badgeText);
                    const badgeWidth = Math.floor(iconSize * 0.70);
                    const badgeHeight = Math.floor(iconSize * 0.30);
                    composites.push({
                        input: badge,
                        top: iconSize - badgeHeight - 2,
                        left: currentLeft + (iconSize - badgeWidth) / 2
                    });
                }

                currentLeft += iconSize + spacing;
            }

            // Create base image and composite all elements
            const finalImage = await sharp({
                create: {
                    width: totalWidth,
                    height: totalHeight,
                    channels: 4,
                    background: { r: 26, g: 26, b: 26, alpha: 1 }
                }
            })
            .composite(composites)
            .png()
            .toBuffer();

            return finalImage;
        } catch (error) {
            logger.error("Error creating team composition image: " + error);
            return null;
        }
    }

    /**
     * Get champion URL from name
     * @function get_champion_url
     * @param {string} name champion name
     * @returns {string} champion URL
     */
    get_champion_url(name) {
        //return "https://cdn.communitydragon.org/latest/champion/" + this.get_champion_id(name) + "/square";
        if (this.champions[name] === undefined) {
            return "";
        }
        return "http://ddragon.leagueoflegends.com/cdn/" + this.version + "/img/champion/" + this.champions[name] + ".png";
    }

    /**
     * Get champion ID from name
     * @function get_champion_id
     * @param {string} name champion name
     * @returns {Number} champion id
     */
    get_champion_id(name) {
        for (const x in this.client.lol.champions) {
            if (this.client.lol.champions[x] === name) {
                return x;
            }
        }
        return null;
    }

    /**
     * Get the league of graph url from a game ID
     * @function get_league_of_graph
     * @param {String} game_id - ID of the game
     */
    get_league_of_graph(game_id) {
        const base_url = "https://www.leagueofgraphs.com/match/";

        // convert game_id to leagueofgraphs url (EUW1_1234567890 -> EUW/1234567890)
        const region = game_id.split("_")[0];
        const id = game_id.split("_")[1];
        const url = base_url + this.client.lol.region_to_name[region] + "/" + id;

        return url;
    }

    async add_summoner(current) {
        const rank = await this.update_rank(current["puuid"], current["region"]);

        if (this.rank_cache[current["puuid"]] !== undefined) {
            // If the summoner is already in the cache, update the discordid
            this.rank_cache[current["puuid"]]["discordid"].push(current["discordid"]);
        } else {
            // If the summoner is not in the cache, add it
            this.rank_cache[current["puuid"]] = {
                "RANKED_SOLO_5x5": {
                    "tier": rank["RANKED_SOLO_5x5"]["tier"],
                    "rank": rank["RANKED_SOLO_5x5"]["rank"],
                    "leaguePoints": rank["RANKED_SOLO_5x5"]["leaguePoints"],
                },
                "RANKED_FLEX_SR": {
                    "tier": rank["RANKED_FLEX_SR"]["tier"],
                    "rank": rank["RANKED_FLEX_SR"]["rank"],
                    "leaguePoints": rank["RANKED_FLEX_SR"]["leaguePoints"],
                },
                "discordid": [current["discordid"]],
                "region": current["region"],
                "gamename": current["gamename"],
                "tagline": current["tagline"],
                "id": current["id"],
            };
        }

        return rank;
    }

    async feedback_summoner_added(channel_id, message_id, message) {
        try {
            const channel = await this.client.channels.fetch(channel_id);
            if (!channel) {
                logger.error("Error while sending summoner added feedback: Channel not found");
                return;
            }
            const message_obj = await channel.messages.fetch(message_id);
            if (!message_obj) {
                logger.error("Error while sending summoner added feedback: Message not found");
                return;
            }
            await message_obj.edit(message);
        } catch (e) {
            logger.error("Channel Id: " + channel_id + " Message Id: " + message_id);
            logger.error("Error while sending summoner added feedback: " + e);
        }
    }
}

module.exports = {
    LolRankManager,
};