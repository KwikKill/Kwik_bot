const logger = require('./logger.js');
const sharp = require('sharp');
const axios = require('axios');

const { EmbedBuilder } = require('discord.js');

class LolRankManager {
    rank_cache = {};
    rank_list = ["IRON", "BRONZE", "SILVER", "GOLD", "PLATINUM", "EMERALD", "DIAMOND", "MASTER", "GRANDMASTER", "CHALLENGER"];
    emojis = {
        "unranked": "unranked",
    };
    trackers= [];

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

        // Get every summoner rank from the database
        const data = await this.client.pg.query("SELECT * FROM summoners");
        for (const x of data.rows) {
            const rank = {
                "RANKED_SOLO_5x5": {
                    "tier": x.tier_solo,
                    "rank": x.rank_solo,
                    "leaguePoints": x.lp_solo,
                },
                "RANKED_FLEX_SR": {
                    "tier": x.tier_flex,
                    "rank": x.rank_flex,
                    "leaguePoints": x.lp_flex,
                },
                "discordid": x.discordid,
                "region": x.region,
                "gamename": x.gamename,
                "tagline": x.tagline,
                "id": x.id,
            };
            this.rank_cache[x.puuid] = rank;
        }
    }

    /**
     * Update rank of user in the database
     * @function send_tracker_message
     * @param {object} current current summoner data
     * @param {object} last_game last game data
     */
    async send_tracker_message(puuid, last_game) {

        if (!(puuid in this.rank_cache)) {
            return;
        }
        const rank = await this.update_rank(this.rank_cache[puuid].id, this.rank_cache[puuid].region);

        const data = this.rank_cache[puuid];
        const new_rank = {
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
            "discordid": data.discordid,
            "region": data.region,
            "gamename": data.gamename,
            "tagline": data.tagline,
            "id": data.id,
        };

        // If the new rank is the same as the old rank, return
        if (JSON.stringify(this.rank_cache[puuid]) === JSON.stringify(new_rank)) {
            return;
        }

        // update rank cache
        this.rank_cache[puuid] = new_rank;

        // read current rank and send message if rank changed
        if (
            (
                data["RANKED_SOLO_5x5"]["rank"] !== rank["RANKED_SOLO_5x5"]["rank"] ||
                data["RANKED_SOLO_5x5"]["tier"] !== rank["RANKED_SOLO_5x5"]["tier"] ||
                data["RANKED_SOLO_5x5"]["leaguePoints"] !== rank["RANKED_SOLO_5x5"]["leaguePoints"] ||
                data["RANKED_FLEX_SR"]["rank"] !== rank["RANKED_FLEX_SR"]["rank"] ||
                data["RANKED_FLEX_SR"]["tier"] !== rank["RANKED_FLEX_SR"]["tier"] ||
                data["RANKED_FLEX_SR"]["leaguePoints"] !== rank["RANKED_FLEX_SR"]["leaguePoints"]
            )
        ) {
            await this.client.pg.query("UPDATE summoners SET rank_solo = $1, tier_solo = $2, LP_solo = $3, rank_flex = $4, tier_flex = $5, LP_flex = $6 WHERE id = $7", [
                rank["RANKED_SOLO_5x5"]["rank"],
                rank["RANKED_SOLO_5x5"]["tier"],
                rank["RANKED_SOLO_5x5"]["leaguePoints"],
                rank["RANKED_FLEX_SR"]["rank"],
                rank["RANKED_FLEX_SR"]["tier"],
                rank["RANKED_FLEX_SR"]["leaguePoints"],
                data.id,
            ]);
            const embed = this.build_tracker(data, rank, last_game);
            for (const x of this.trackers) {
                const channelid = x.channel;

                // check if the user is muted
                if (this.client.lol.player_mute_for_guild[x.guild] !== undefined && this.client.lol.player_mute_for_guild[x.guild].includes(data.discordid)) {
                    continue;
                }

                try {
                    const channel = await this.client.channels.fetch(channelid);
                    let user = false;
                    try {
                        user = await channel.guild.members.fetch(data.discordid);
                    } catch (e) {
                        user = false;
                    }
                    if (user || channelid === "1036963873422589972" || channelid === "991052056657793124") {
                        if (embed !== undefined) {
                            channel.send({ embeds: [embed] });
                        } else {
                            logger.error("Error while building tracker embed for " + data.gamename + "#" + data.tagline);
                            logger.error("Current SOLO rank : " + data["RANKED_SOLO_5x5"]["tier"] + " " + data["RANKED_SOLO_5x5"]["rank"] + " " + data["RANKED_SOLO_5x5"]["leaguePoints"] + " LP");
                            logger.error("New SOLO rank : " + rank["RANKED_SOLO_5x5"]["tier"] + " " + rank["RANKED_SOLO_5x5"]["rank"] + " " + rank["RANKED_SOLO_5x5"]["leaguePoints"] + " LP");
                            logger.error("Current FLEX rank : " + data["RANKED_FLEX_SR"]["tier"] + " " + data["RANKED_FLEX_SR"]["rank"] + " " + data["RANKED_FLEX_SR"]["leaguePoints"] + " LP");
                            logger.error("New FLEX rank : " + rank["RANKED_FLEX_SR"]["tier"] + " " + rank["RANKED_FLEX_SR"]["rank"] + " " + rank["RANKED_FLEX_SR"]["leaguePoints"] + " LP");
                        }
                    }
                } catch (e) {
                    // if bot can't fetch the discord channel
                    if (e.code === 10003 || e.code === 50001) {
                        // delete the channel from the database
                        logger.error("Channel " + x + " not found, deleting from database");
                        await this.client.pg.query("DELETE FROM trackers WHERE channelid = $1", [channelid]);
                        const index = this.trackers.indexOf(x);
                        this.trackers.splice(index, 1);
                    } else {
                        logger.error("Unknown error while sending tracker message (" + channelid + "): " + e);
                    }
                }
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
     * @function build_tracker
     * @param {string} data user data
     * @param {object} current_rank current summoner rank data
     * @param {object} last_game last game data
     * @param {*} rank rank data
     */
    build_tracker(data, rank, last_game) {
        const embed = new EmbedBuilder();

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
                    "<@" + data.discordid + "> just played some games in Solo/Duo queue."
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
                return embed;
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
                    "<@" + data.discordid + "> just played some games in Flex queue."
                );
                embed.setColor("#77767b");
                embed.addFields(
                    {
                        name: rank["RANKED_FLEX_SR"]["tier"] + " " + rank["RANKED_FLEX_SR"]["rank"] + " " + rank["RANKED_FLEX_SR"]["leaguePoints"] + " LP",
                        value: LP_change > 0 ? "+" + LP_change + " LP" : LP_change + " LP",
                    }
                );
                return embed;
            }
        } else {
            // set embed URL and thumbnail
            embed.setURL(this.get_league_of_graph(last_game["matchId"]));
            embed.setThumbnail(this.get_champion_url(last_game["champion"]));

            // If the user just finished his placement games in solo/duo
            if (
                data["RANKED_SOLO_5x5"]["tier"] === 'unranked'
                && rank["RANKED_SOLO_5x5"]["tier"] !== 'unranked'
            ) {
                embed.setTitle(
                    "Placement Solo/Duo completed for " + data.gamename + "#" + data.tagline
                );
                embed.setDescription(
                    "<@" + data.discordid + "> just finished his placement games in Solo/Duo queue."
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
                return embed;
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
                    "<@" + data.discordid + "> just finished his placement games in Flex queue."
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
                return embed;
            }
            // If the user just finished a game in solo/duo
            if (
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
                    "<@" + data.discordid + "> just " + (LP_change > 0 ? "won" : "lost") + " a game in Solo/Duo queue."
                );
                embed.setColor(LP_change > 0 ? "#33d17a" : "#c01c28");
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
                        value: LP_change > 0 ? "+" + LP_change + " LP" : LP_change + " LP",
                        inline: true,
                    }
                );
                return embed;
            }
            // If the user just finished a game in flex
            if (
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
                    "<@" + data.discordid + "> just " + (LP_change > 0 ? "won" : "lost") + " a game in Flex queue."
                );
                embed.setColor(LP_change > 0 ? "#33d17a" : "#c01c28");
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
                        value: LP_change > 0 ? "+" + LP_change + " LP" : LP_change + " LP",
                        inline: true,
                    }
                );
                return embed;
            }
        }
        return undefined;
    }

    /**
     * Get champion URL from name
     * @function get_champion_url
     * @param {string} name champion name
     * @returns {string} champion URL
     */
    get_champion_url(name) {
        return "https://cdn.communitydragon.org/latest/champion/" + this.get_champion_id(name) + "/square";
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
     * Update rank of user in the database
     * @function update_rank_pseudo
     * @param {string} puuid puuid of the user
     * @param {string} gamename gamename of the user
     * @param {string} tagline tagline of the user
     */
    update_rank_pseudo(puuid, gamename, tagline) {
        if (!(puuid in this.rank_cache)) {
            return;
        }
        this.rank_cache[puuid]["gamename"] = gamename;
        this.rank_cache[puuid]["tagline"] = tagline;
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

    /**
     * Update rank of user in the database
     * @function update_rank
     * @param {*} summoner_id summoner id
     * @param {*} region region of the summoner
     * @returns {Object} rank data
     */
    async update_rank(summoner_id, region) {
        const response = await this.client.lol.lol_api.leaguesBySummoner(this.client.lol.apiKey, region, summoner_id, this.client);

        const data = {
            "RANKED_SOLO_5x5": {
                "tier": "unranked",
                "rank": "",
                "leaguePoints": 0,
            },
            "RANKED_FLEX_SR": {
                "tier": "unranked",
                "rank": "",
                "leaguePoints": 0,
            }
        };
        if (response === undefined) {
            return undefined;
        }
        for (const x of response) {
            data[x.queueType] = {
                "tier": x.tier,
                "rank": x.rank,
                "leaguePoints": x.leaguePoints,
            };
        }

        return data;
    }

    async add_summoner(current) {
        const rank = await this.update_rank(current["id"], current["region"]);

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
            "discordid": current["discordid"],
            "region": current["region"],
            "gamename": current["gamename"],
            "tagline": current["tagline"],
            "id": current["id"],
        };

        return rank;
    }
}

module.exports = {
    LolRankManager,
};