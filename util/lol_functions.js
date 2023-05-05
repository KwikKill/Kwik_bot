const logger = require("./logger.js");
const lol_api = require("./lol_api.js");


module.exports = {
    RANKED_FLEX: 440,
    RANKED_SOLO: 420,
    route: {
        "EUW1": "EUROPE",
        "NA1": "AMERICAS",
        "KR": "ASIA",
        "EUN1": "EUROPE",
        "BR1": "AMERICAS",
        "JP1": "ASIA",
        "LA1": "AMERICAS",
        "LA2": "AMERICAS",
        "OC1": "SEA",
        "TR1": "EUROPE",
        "RU": "EUROPE"
    },
    max_games: 100,
    champions: [],
    language: "en_US", // Players Language - Only Used for Champion Names

    apiKey: process.env.RIOT_API_KEY,
    client: [],

    last: null,

    queue: { "summoners": [], "updates": [], "add": [] },
    running: false,
    queue_length: 0,
    api_limit: false,

    trackers: [],

    /**
     * setup champion list
     * @function setup
     * @param {*} client discord client
     */
    async setup(client) {
        this.client = client;
        this.champions = [];
        lol_api.championList(this.apiKey, "EUW1", this.language, client).then(list => {
            this.champions = list;
            this.client.champions = [];
            for (let i = 0; i < list.length; i++) {
                if (list[i] !== undefined) {
                    this.client.champions.push(list[i]);
                }
            }
            this.client.champions.sort();
        });
    },

    /**
     * Fetch summoner game list
     * @function update_step_1
     * @param {*} number  id of the summoner in client.requests["updates"]
     * @returns {Number}  timestamp of the last game
     */
    async update_step_1(number) {
        const puuid = number["puuid"];
        let start;

        if (number["first"] !== true) {
            const response = await this.client.pg.query({
                name: "get_date",
                text: "SELECT DISTINCT timestamp FROM matchs WHERE puuid IN (SELECT max(puuid) FROM matchs WHERE player = $1)",
                values: [puuid]
            });
            if (response.rowCount !== 0) {
                start = Math.floor(response.rows[0].timestamp / 1000 + 1);
            }
        } else {
            start = (Date.now() - 31536000000).toString();
            start = start.substring(0, start.length - 3);
        }
        return start;
    },

    /**
     * Fetch summoner game list
     * @function update_step_2
     * @param {*} number  id of the summoner in client.requests["updates"]
     * @param {*} start   timestamp of the last game
     * @returns {Object}  list of match ids
     */
    async update_step_2(number, start) {
        const puuid = number["puuid"];
        const region = number["region"];

        let indexed = 0;
        let gamesToIndex = true;
        let listOfMatches = {};

        const matchIds = [];

        do {
            const options = "?startTime=" + start + "&start=" + indexed + "&count=100";
            listOfMatches = { 'matches': [] };
            const list = await lol_api.matchlistsByAccount(this.apiKey, this.route[region], puuid, options, this.client);
            if (list === null || (list["status_code"] !== undefined && list["status_code"] !== 200)) {
                logger.error("Error while fetching match list for " + puuid + " in " + region, list["status_code"]);
            } else {
                listOfMatches['matches'] = list;
            }
            // If there are less than 100 matches in the object, then this is the last match list
            if (listOfMatches['matches'].length < this.max_games) {
                gamesToIndex = false;
            }

            //logger.log(listOfMatches)
            // Populate matchIds Array
            for (const match in listOfMatches['matches']) {
                matchIds[indexed] = listOfMatches['matches'][match];
                indexed++;
            }

            // Fail Safe
            if (listOfMatches['matches'][0] === undefined) {
                gamesToIndex = false;
                indexed = 0;
            }
        } while (gamesToIndex);

        return matchIds;
    },

    /**
     * Fetch summoner game list
     * @function update_step_3
     * @param {*} number  id of the summoner in client.requests["updates"]
     * @param {*} matchIds  list of match ids
     * @returns {Object}  list of match ids
     */
    async update_step_3(number, matchIds) {
        const puuid = number["puuid"];

        const matchs = [];

        if (number["first"] !== true) {
            matchIds.pop();
        }

        if (matchIds.length === 0) {
            number["total"] = "none";
            return null;
        }

        let puuids = "(";
        for (const y of matchIds) {
            puuids += "'" + y + "',";
        }
        puuids = puuids.substring(0, puuids.length - 1);
        puuids += ")";

        //logger.log(matchIds)
        const al = await this.client.pg.query({
            //name: 'get_matchs',
            text: 'SELECT matchs.puuid FROM matchs WHERE player = $1 AND matchs.puuid IN ' + puuids + ';',
            values: [puuid]
        });
        const already = [];
        for (const x of al.rows) {
            already.push(x.puuid);
        }
        for (const x of matchIds) {
            if (!already.includes(x)) {
                matchs.push(x);
            }
        }

        return matchs;

    },

    /**
    * Fetch summoner and update the username
    * @function update_pseudo
    * @param {*} number  summoner in client.requests["updates"]
    */
    async update_pseudo(number, summonerName) {
        const puuid = number["puuid"];
        const username = number["username"];

        const pseudo = summonerName;
        if (pseudo.toLowerCase() !== username.toLowerCase()) {
            //console.log("Pseudo changed for " + puuid + " : " + username.toLowerCase() + " -> " + pseudo["name"].toLowerCase());
            await this.client.pg.query({
                name: "update_pseudo",
                text: "UPDATE summoners SET username = $1 WHERE puuid = $2",
                values: [pseudo.toLowerCase(), puuid]
            });
            number["username"] = pseudo.toLowerCase();
        }
    },

    /**
     * Fetch summoner game list
     * @function set_update
     * @param {*} current summoner data
     * @param {Boolean} debug  if true, print debug log
     * @returns {Object} summoner data with list of match ids
     */
    async set_update(current, debug = false) {
        const timer1 = Date.now();

        const start = await this.update_step_1(current);

        const timer2 = Date.now();

        const matchIds = await this.update_step_2(current, start);

        const timer3 = Date.now();

        const matchs = await this.update_step_3(current, matchIds);
        if (matchs !== null) {
            current["matchs"] = current["matchs"].concat(matchs);
            this.queue_length += matchs.length;
            current["total"] = current["matchs"].length;
            current["last_id"] = current["matchs"][current["matchs"].length - 1];
        }
        const timer4 = Date.now();
        if (debug) {
            logger.log(timer2 - timer1);
            logger.log(timer3 - timer2);
            logger.log(timer4 - timer3);
        }

        return current;
    },

    /**
     * Update rank of user in the database
     * @function update_rank
     * @param {*} summoner_id summoner id
     * @param {*} region region of the summoner
     * @returns {Object} rank data
     */
    async update_rank(summoner_id, region) {
        const response = await lol_api.leaguesBySummoner(this.apiKey, region, summoner_id, this.client);

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
        for (const x of response) {
            data[x.queueType] = {
                "tier": x.tier,
                "rank": x.rank,
                "leaguePoints": x.leaguePoints,
            };
        }

        return data;
    },

    /**
     * Update mastery data of user in the database
     * @function update_mastery
     * @param {*} discordid  discord id
     * @param {*} region  region of the summoner
     * @returns {Object} mastery data
     */
    async update_mastery(discordid, region) {

        const masteries = {};
        const query = await this.client.pg.query("SELECT * FROM summoners WHERE discordid = '" + discordid + "'");
        for (const x of query.rows) {
            const response = await lol_api.championmasteriesBySummoner(this.apiKey, region, x.id, this.client);
            for (const y of response) {
                if (masteries[y.championId] === undefined) {
                    masteries[y.championId] = y;
                } else {
                    masteries[y.championId]["championPoints"] += y.championPoints;
                    if (y.lastPlayTime > masteries[y.championId]["lastPlayTime"]) {
                        masteries[y.championId]["lastPlayTime"] = y.lastPlayTime;
                    }
                    if (y.championLevel > masteries[y.championId]["championLevel"]) {
                        masteries[y.championId]["championLevel"] = y.championLevel;
                    }
                }

            }
        }

        const data = { "first_mastery_champ": "", "first_mastery": 0, "second_mastery_champ": "", "second_mastery": 0, "third_mastery_champ": "", "third_mastery": 0, "total_point": 0, "mastery7": 0, "mastery6": 0, "mastery5": 0 };
        for (const x in masteries) {
            data["total_point"] += masteries[x].championPoints;
            if (masteries[x].championLevel === 7) {
                data["mastery7"]++;
            }
            if (masteries[x].championLevel === 6) {
                data["mastery6"]++;
            }
            if (masteries[x].championLevel === 5) {
                data["mastery5"]++;
            }
            if (masteries[x].championPoints > data["first_mastery"]) {
                data["third_mastery"] = data["second_mastery"];
                data["third_mastery_champ"] = data["second_mastery_champ"].replaceAll("'", "");
                data["second_mastery"] = data["first_mastery"];
                data["second_mastery_champ"] = data["first_mastery_champ"].replaceAll("'", "");
                data["first_mastery"] = masteries[x].championPoints;
                data["first_mastery_champ"] = this.champions[masteries[x].championId].replaceAll("'", "");
            }
            else if (masteries[x].championPoints > data["second_mastery"]) {
                data["third_mastery"] = data["second_mastery"];
                data["third_mastery_champ"] = data["second_mastery_champ"].replaceAll("'", "");
                data["second_mastery"] = masteries[x].championPoints;
                data["second_mastery_champ"] = this.champions[masteries[x].championId].replaceAll("'", "");
            }
            else if (masteries[x].championPoints > data["third_mastery"]) {
                data["third_mastery"] = masteries[x].championPoints;
                data["third_mastery_champ"] = this.champions[masteries[x].championId].replaceAll("'", "");
            }
        }
        return data;
    },

    /**
     * mark a user as updated
     * @function update_rank
     * @param {*} puuid puuid of the user
     */
    async set_rank(puuid, match) {
        for (let i = 0; i < this.queue["updates"].length; i++) {
            if (this.queue["updates"][i]["puuid"] === puuid) {
                this.queue["updates"][i]["rank"] = match;
            }
        }
    },

    /**
     * Update rank of user in the database
     * @function send_tracker_message
     * @param {object} current current summoner data
     * @param {object} last_game last game data
     */
    async send_tracker_message(current, last_game) {
        const discordid = current["discordid"];
        const rank = await this.update_rank(current["id"], current["region"]);

        let game;
        if (last_game === "none") {
            game = "1+ games";
        } else {
            game = last_game["champion"] + " (" + last_game["kills"] + "/" + last_game["deaths"] + "/" + last_game["assists"] + ")";
        }

        // read current rank and send message if rank changed
        const current_rank = await this.client.pg.query("SELECT * FROM summoners WHERE id = '" + current["id"] + "'");
        if (current_rank.rows[0] !== undefined) {
            for (const x of this.trackers) {
                const channel = await this.client.channels.fetch(x);
                let user = false;
                try {
                    user = await channel.guild.members.fetch(discordid);
                } catch (e) {
                    user = false;
                }
                if (user || x === "1036963873422589972") {
                    if (
                        current_rank.rows[0].rank_solo !== rank["RANKED_SOLO_5x5"]["rank"] ||
                        current_rank.rows[0].tier_solo !== rank["RANKED_SOLO_5x5"]["tier"] ||
                        current_rank.rows[0].lp_solo !== rank["RANKED_SOLO_5x5"]["leaguePoints"] ||
                        current_rank.rows[0].rank_flex !== rank["RANKED_FLEX_SR"]["rank"] ||
                        current_rank.rows[0].tier_flex !== rank["RANKED_FLEX_SR"]["tier"] ||
                        current_rank.rows[0].lp_flex !== rank["RANKED_FLEX_SR"]["leaguePoints"]
                    ) {
                        await this.client.pg.query("UPDATE summoners SET rank_solo = '" + rank["RANKED_SOLO_5x5"]["rank"] + "', tier_solo = '" + rank["RANKED_SOLO_5x5"]["tier"] + "', LP_solo = " + rank["RANKED_SOLO_5x5"]["leaguePoints"] + ", rank_flex = '" + rank["RANKED_FLEX_SR"]["rank"] + "', tier_flex = '" + rank["RANKED_FLEX_SR"]["tier"] + "', LP_flex = " + rank["RANKED_FLEX_SR"]["leaguePoints"] + " WHERE id = '" + current["id"] + "'");
                        if (current_rank.rows[0].tier_solo === 'unranked' && rank["RANKED_SOLO_5x5"]["tier"] !== 'unranked') {
                            channel.send("Placement Solo/Duo completed for " + current["username"] + " : " + rank["RANKED_SOLO_5x5"]["tier"] + " " + rank["RANKED_SOLO_5x5"]["rank"] + " " + rank["RANKED_SOLO_5x5"]["leaguePoints"] + " LP");
                        }
                        else if (current_rank.rows[0].tier_flex === 'unranked' && rank["RANKED_FLEX_SR"]["tier"] !== 'unranked') {
                            channel.send("Placement Flex completed for " + current["username"] + " : " + rank["RANKED_FLEX_SR"]["tier"] + " " + rank["RANKED_FLEX_SR"]["rank"] + " " + rank["RANKED_FLEX_SR"]["leaguePoints"] + " LP");
                        }
                        else if (
                            (
                                current_rank.rows[0].rank_solo !== rank["RANKED_SOLO_5x5"]["rank"] ||
                                current_rank.rows[0].tier_solo !== rank["RANKED_SOLO_5x5"]["tier"] ||
                                current_rank.rows[0].lp_solo !== rank["RANKED_SOLO_5x5"]["leaguePoints"]
                            )
                            && rank["RANKED_SOLO_5x5"]["tier"] !== "unranked"
                        ) {
                            if (last_game !== null) {
                                channel.send("Rank Solo/Duo update for " +
                                    current["username"] +
                                    " : " + rank["RANKED_SOLO_5x5"]["tier"] +
                                    " " + rank["RANKED_SOLO_5x5"]["rank"] +
                                    " " + rank["RANKED_SOLO_5x5"]["leaguePoints"] +
                                    " LP (" + this.LP_change(current_rank.rows[0].rank_solo, current_rank.rows[0].tier_solo, current_rank.rows[0].lp_solo, rank["RANKED_SOLO_5x5"]["rank"], rank["RANKED_SOLO_5x5"]["tier"], rank["RANKED_SOLO_5x5"]["leaguePoints"]) + "LP)" +
                                    " | " + game);
                            } else {
                                channel.send("Rank Solo/Duo update for " +
                                    current["username"] +
                                    " : " + rank["RANKED_SOLO_5x5"]["tier"] +
                                    " " + rank["RANKED_SOLO_5x5"]["rank"] +
                                    " " + rank["RANKED_SOLO_5x5"]["leaguePoints"] +
                                    " LP (" + this.LP_change(current_rank.rows[0].rank_solo, current_rank.rows[0].tier_solo, current_rank.rows[0].lp_solo, rank["RANKED_SOLO_5x5"]["rank"], rank["RANKED_SOLO_5x5"]["tier"], rank["RANKED_SOLO_5x5"]["leaguePoints"]) + "LP)");
                            }

                        } else if (
                            (
                                current_rank.rows[0].rank_flex !== rank["RANKED_FLEX_SR"]["rank"] ||
                                current_rank.rows[0].tier_flex !== rank["RANKED_FLEX_SR"]["tier"] ||
                                current_rank.rows[0].lp_flex !== rank["RANKED_FLEX_SR"]["leaguePoints"]
                            )
                            && rank["RANKED_FLEX_SR"]["tier"] !== "unranked"
                        ) {
                            if (last_game !== null) {
                                channel.send("Rank Flex update for " +
                                    current["username"] +
                                    " : " + rank["RANKED_FLEX_SR"]["tier"] +
                                    " " + rank["RANKED_FLEX_SR"]["rank"] +
                                    " " + rank["RANKED_FLEX_SR"]["leaguePoints"] +
                                    " LP (" + this.LP_change(current_rank.rows[0].rank_flex, current_rank.rows[0].tier_flex, current_rank.rows[0].lp_flex, rank["RANKED_FLEX_SR"]["rank"], rank["RANKED_FLEX_SR"]["tier"], rank["RANKED_FLEX_SR"]["leaguePoints"]) + "LP)" +
                                    " | " + game);
                            } else {
                                channel.send("Rank Flex update for " +
                                    current["username"] +
                                    " : " + rank["RANKED_FLEX_SR"]["tier"] +
                                    " " + rank["RANKED_FLEX_SR"]["rank"] +
                                    " " + rank["RANKED_FLEX_SR"]["leaguePoints"] +
                                    " LP (" + this.LP_change(current_rank.rows[0].rank_flex, current_rank.rows[0].tier_flex, current_rank.rows[0].lp_flex, rank["RANKED_FLEX_SR"]["rank"], rank["RANKED_FLEX_SR"]["tier"], rank["RANKED_FLEX_SR"]["leaguePoints"]) + "LP)");
                            }
                        }
                    }

                }
            }
        }
    },

    /**
     * Save match in the database
     * @function save_matchs
     * @param {object} current Current match
     */
    async save_matchs(current) {
        const puuid = current["puuid"];

        while (current["matchs"].length > 0) {
            const matchId = current["matchs"].shift();
            this.queue_length -= 1;
            lol_api.matchesById(this.apiKey, this.route[current["region"]], matchId, this.client).then(match => {

                if (match?.status?.status_code !== 404) {
                    const exit = this.matchHistoryOutput(match);
                    if (exit !== null) {
                        current["count"] = current["count"] + 1;
                        for (const summary of exit) {
                            if (current["type"] !== "sum" && current["last_id"] === exit[0]["matchId"]) {
                                if (summary["summonerpuuid"] === puuid) {
                                    if (current["total"] > 1) {
                                        this.send_tracker_message(current, "none");
                                    } else {
                                        this.send_tracker_message(current, summary);
                                    }
                                    this.update_pseudo(current, summary["summonerName"]);
                                }
                            }
                            try {
                                this.client.pg.query({
                                    name: "insert_match",
                                    text: "INSERT INTO matchs(" +
                                        "puuid, " +
                                        "player, " +
                                        "gamemode, " +
                                        "champion, " +
                                        "lane, " +
                                        "gold, " +
                                        "kill, " +
                                        "deaths, " +
                                        "assists, " +
                                        "result, " +
                                        "total_damage, " +
                                        "tanked_damage, " +
                                        "heal, " +
                                        "neutral_objectives, " +
                                        " wards, " +
                                        "pinks, " +
                                        "vision_score, " +
                                        "cs, " +
                                        "length, " +
                                        "total_kills, " +
                                        "first_gold, " +
                                        "first_damages, " +
                                        "first_tanked, " +
                                        "double, " +
                                        "tripple, " +
                                        "quadra, " +
                                        "penta, " +
                                        "time_spent_dead, " +
                                        "timestamp, " +
                                        "summoner1Id, " +
                                        "summoner2Id, " +
                                        "item0, " +
                                        "item1, " +
                                        "item2, " +
                                        "item3, " +
                                        "item4, " +
                                        "item5, " +
                                        "item6, " +
                                        "patch, " +
                                        "rune_0_perk, " +
                                        "rune_0_var1, " +
                                        "rune_0_var2, " +
                                        "rune_0_var3, " +
                                        "team_id " +
                                        ") VALUES (" +
                                        "$1," +
                                        "$2," +
                                        "$3," +
                                        "$4," +
                                        "$5," +
                                        "$6," +
                                        "$7," +
                                        "$8," +
                                        "$9," +
                                        "$10," +
                                        "$11," +
                                        "$12," +
                                        "$13," +
                                        "$14," +
                                        "$15," +
                                        "$16," +
                                        "$17," +
                                        "$18," +
                                        "$19," +
                                        "$20," +
                                        "$21," +
                                        "$22," +
                                        "$23," +
                                        "$24," +
                                        "$25," +
                                        "$26," +
                                        "$27," +
                                        "$28," +
                                        "$29," +
                                        "$30," +
                                        "$31," +
                                        "$32," +
                                        "$33," +
                                        "$34," +
                                        "$35," +
                                        "$36," +
                                        "$37," +
                                        "$38," +
                                        "$39," +
                                        "$40," +
                                        "$41," +
                                        "$42," +
                                        "$43," +
                                        "$44" +
                                        ") ON CONFLICT (puuid, player) DO NOTHING;",
                                    values: [
                                        summary["matchId"],
                                        summary["summonerpuuid"],
                                        summary["queueName"],
                                        summary["champion"],
                                        summary["lane"],
                                        summary["gold"],
                                        summary["kills"],
                                        summary["deaths"],
                                        summary["assists"],
                                        summary["result"],
                                        summary["dealt"],
                                        summary["taken"],
                                        summary["healed"],
                                        summary["objectifs"],
                                        summary["wardsPlaced"],
                                        summary["pinkPlaced"],
                                        summary["visionScore"],
                                        summary["CS"],
                                        summary["duration"],
                                        summary["teamKills"],
                                        summary["firstGold"],
                                        summary["firstDamage"],
                                        summary["firstTanked"],
                                        summary["doubles"],
                                        summary["triples"],
                                        summary["quadras"],
                                        summary["penta"],
                                        summary["totalTimeSpentDead"],
                                        summary["date"],
                                        summary["summoner1Id"],
                                        summary["summoner2Id"],
                                        summary["item0"],
                                        summary["item1"],
                                        summary["item2"],
                                        summary["item3"],
                                        summary["item4"],
                                        summary["item5"],
                                        summary["item6"],
                                        summary["patch"],
                                        summary["rune_0_perk"],
                                        summary["rune_0_var1"],
                                        summary["rune_0_var2"],
                                        summary["rune_0_var3"],
                                        summary["team_id"]
                                    ]
                                }
                                );
                                if (current["type"] !== "sum") {
                                    this.set_rank(summary["summonerpuuid"], summary);
                                }
                            } catch (e) {
                                //logger.log(e);
                            }
                        }
                    }
                }
            });
        }
    },

    /**
     * update summoner info
     * @function update_summoner
     * @param {*} current current summoner
     */
    async update_summoner(current) {
        const username = current["username"];
        const interaction = current["interaction"];
        const discordid = current["discordid"];
        const region = current["region"];
        const priority = current["priority"];
        const summonerObject = await lol_api.summonersByName(this.apiKey, region, username, this.client);
        if (summonerObject === null) {
            try {
                await interaction.editReply("<@" + discordid + ">, Account " + username + " not found.");
            } catch {

            }
        } else {
            const id = summonerObject['id'];
            const accountId = summonerObject['accountId'];
            const puuid = summonerObject['puuid'];

            const rank = await this.update_rank(id, region);

            await this.client.pg.query('INSERT INTO summoners(' +
                'puuid, ' +
                'username, ' +
                'accountid, ' +
                'id, ' +
                'discordid, ' +
                'rank_solo, ' +
                'tier_solo, ' +
                'LP_solo, ' +
                'rank_flex, ' +
                'tier_flex, ' +
                'LP_flex, ' +
                'region, ' +
                'priority' +
                ') ' +
                'VALUES(\'' +
                puuid + '\', \'' +
                username.toLowerCase() + '\', ' + '\'' +
                accountId + '\', \'' +
                id + '\', \'' +
                discordid + '\', \'' +
                rank["RANKED_SOLO_5x5"]["rank"] + '\', \'' +
                rank["RANKED_SOLO_5x5"]["tier"] + '\', \'' +
                rank["RANKED_SOLO_5x5"]["leaguePoints"] + '\', \'' +
                rank["RANKED_FLEX_SR"]["rank"] + '\', \'' +
                rank["RANKED_FLEX_SR"]["tier"] + '\', \'' +
                rank["RANKED_FLEX_SR"]["leaguePoints"] + '\', \'' +
                region + '\', ' +
                priority +
                ')'
            );

            const response = await this.client.pg.query("SELECT * FROM mastery WHERE discordid = '" + discordid + "'");
            if (response.rowCount === 0) {
                const mastery = await this.update_mastery(discordid, region);
                await this.client.pg.query("INSERT INTO mastery(" +
                    "discordid, " +
                    "first_mastery_champ, " +
                    "first_mastery, " +
                    "second_mastery_champ, " +
                    "second_mastery, " +
                    "third_mastery_champ, " +
                    "third_mastery, " +
                    "total_point, " +
                    "mastery7, " +
                    "mastery6, " +
                    "mastery5" +
                    ") " +
                    "VALUES('" +
                    discordid + "', '" +
                    mastery["first_mastery_champ"] + "', " +
                    mastery["first_mastery"] + ", '" +
                    mastery["second_mastery_champ"] + "', " +
                    mastery["second_mastery"] + ", '" +
                    mastery["third_mastery_champ"] + "', " +
                    mastery["third_mastery"] + ", " +
                    mastery["total_point"] + ", " +
                    mastery["mastery7"] + ", " +
                    mastery["mastery6"] + ", " +
                    mastery["mastery5"] +
                    ")"
                );
            }



            try {
                await interaction.editReply("<@" + discordid + ">, Account " + username + " has been added to the database.");
            } catch {

            }
            this.queue["updates"].push({ "puuid": puuid, "id": id, "username": username, "discordid": discordid, "matchs": [], "total": 0, "count": 0, "region": region, "first": true, "rank": false });
        }
    },

    /**
     * Fetch summoner game list and add games to the database
     * @function main
     * @param {*} debug debug mode
     */
    async main(debug = false) {
        //logger.log(client.running, client.requests)
        if (this.running === true) { return; }
        this.running = true;
        const start = Date.now();
        while (this.queue["summoners"].length > 0) {
            const timer1 = Date.now();

            const current = this.queue["summoners"].shift();
            await this.update_summoner(current);

            if (debug) {
                const timer2 = Date.now();
                logger.log("lol (summoner) : [" + current["username"] + "] " + (timer2 - timer1) + " ms");
            }
        }
        const checkpoint1 = Date.now();
        if (debug) {
            logger.log("lol (summoner) : total took " + (checkpoint1 - start) + " ms");
        }
        while (this.queue["updates"].length > 0) {
            const timer1 = Date.now();
            if (this.queue["summoners"].length > 0) {
                this.running = false;
                return this.main();
            }
            let current = this.queue["updates"].shift();
            if (current["type"] === "match") {
                const region = current["region"];
                const matchId = current["matchid"];

                lol_api.matchesById(this.apiKey, this.route[region], matchId, this.client).then(match => {

                    if (match?.status?.status_code !== 404) {
                        const exit = this.matchHistoryOutput(match);
                        if (exit !== null) {
                            for (const summary of exit) {
                                try {
                                    this.client.pg.query({
                                        name: "insert_match",
                                        text: "INSERT INTO matchs(" +
                                            "puuid, " +
                                            "player, " +
                                            "gamemode, " +
                                            "champion, " +
                                            "lane, " +
                                            "gold, " +
                                            "kill, " +
                                            "deaths, " +
                                            "assists, " +
                                            "result, " +
                                            "total_damage, " +
                                            "tanked_damage, " +
                                            "heal, " +
                                            "neutral_objectives, " +
                                            " wards, " +
                                            "pinks, " +
                                            "vision_score, " +
                                            "cs, " +
                                            "length, " +
                                            "total_kills, " +
                                            "first_gold, " +
                                            "first_damages, " +
                                            "first_tanked, " +
                                            "double, " +
                                            "tripple, " +
                                            "quadra, " +
                                            "penta, " +
                                            "time_spent_dead, " +
                                            "timestamp, " +
                                            "summoner1Id, " +
                                            "summoner2Id, " +
                                            "item0, " +
                                            "item1, " +
                                            "item2, " +
                                            "item3, " +
                                            "item4, " +
                                            "item5, " +
                                            "item6, " +
                                            "patch, " +
                                            "rune_0_perk, " +
                                            "rune_0_var1, " +
                                            "rune_0_var2, " +
                                            "rune_0_var3, " +
                                            "team_id " +
                                            ") VALUES (" +
                                            "$1," +
                                            "$2," +
                                            "$3," +
                                            "$4," +
                                            "$5," +
                                            "$6," +
                                            "$7," +
                                            "$8," +
                                            "$9," +
                                            "$10," +
                                            "$11," +
                                            "$12," +
                                            "$13," +
                                            "$14," +
                                            "$15," +
                                            "$16," +
                                            "$17," +
                                            "$18," +
                                            "$19," +
                                            "$20," +
                                            "$21," +
                                            "$22," +
                                            "$23," +
                                            "$24," +
                                            "$25," +
                                            "$26," +
                                            "$27," +
                                            "$28," +
                                            "$29," +
                                            "$30," +
                                            "$31," +
                                            "$32," +
                                            "$33," +
                                            "$34," +
                                            "$35," +
                                            "$36," +
                                            "$37," +
                                            "$38," +
                                            "$39," +
                                            "$40," +
                                            "$41," +
                                            "$42," +
                                            "$43," +
                                            "$44" +
                                            ") ON CONFLICT (puuid, player) DO NOTHING;",
                                        values: [
                                            matchId,
                                            summary["summonerpuuid"],
                                            summary["queueName"],
                                            summary["champion"],
                                            summary["lane"],
                                            summary["gold"],
                                            summary["kills"],
                                            summary["deaths"],
                                            summary["assists"],
                                            summary["result"],
                                            summary["dealt"],
                                            summary["taken"],
                                            summary["healed"],
                                            summary["objectifs"],
                                            summary["wardsPlaced"],
                                            summary["pinkPlaced"],
                                            summary["visionScore"],
                                            summary["CS"],
                                            summary["duration"],
                                            summary["teamKills"],
                                            summary["firstGold"],
                                            summary["firstDamage"],
                                            summary["firstTanked"],
                                            summary["doubles"],
                                            summary["triples"],
                                            summary["quadras"],
                                            summary["penta"],
                                            summary["totalTimeSpentDead"],
                                            summary["date"],
                                            summary["summoner1Id"],
                                            summary["summoner2Id"],
                                            summary["item0"],
                                            summary["item1"],
                                            summary["item2"],
                                            summary["item3"],
                                            summary["item4"],
                                            summary["item5"],
                                            summary["item6"],
                                            summary["patch"],
                                            summary["rune_0_perk"],
                                            summary["rune_0_var1"],
                                            summary["rune_0_var2"],
                                            summary["rune_0_var3"],
                                            summary["team_id"]
                                        ]
                                    }
                                    );
                                    this.set_rank(summary["summonerpuuid"], summary);
                                } catch (e) {
                                    //logger.log(e);
                                }
                            }
                        }
                    }
                });
            } else if (current["type"] === "sum") {
                current = await this.set_update(current);

                if (current["matchs"].length > 0 || current["rank"] !== false) {
                    this.save_matchs(current);
                }
            } else {
                current = await this.set_update(current);//, debug);
                const timer2 = Date.now();

                const discordid = current["discordid"];
                const nb = current["matchs"].length;

                if (current["rank"] !== false && current["matchs"].length === 0) {
                    this.send_tracker_message(current, current["rank"]);
                }

                if (current["matchs"].length > 0 || current["rank"] !== false) {
                    //logger.log("- lol (update 1) : " + puuid, client.requests["updates"][0]["matchs"].length);
                    this.save_matchs(current);
                    const timer4 = Date.now();

                    if (discordid !== "503109625772507136") {
                        //logger.log("- lol (update 3): mastery");
                        this.update_mastery(current["discordid"], current["region"]).then(mastery => {
                            this.client.pg.query("UPDATE mastery " +
                                "SET first_mastery_champ = '" + mastery["first_mastery_champ"] + "', " +
                                "first_mastery = " + mastery["first_mastery"] + ", " +
                                "second_mastery_champ = '" + mastery["second_mastery_champ"] + "', " +
                                "second_mastery = " + mastery["second_mastery"] + ", " +
                                "third_mastery_champ = '" + mastery["third_mastery_champ"] + "', " +
                                "third_mastery = " + mastery["third_mastery"] + ", " +
                                "mastery7 = " + mastery["mastery7"] + ", " +
                                "mastery6 = " + mastery["mastery6"] + ", " +
                                "mastery5 = " + mastery["mastery5"] + ", " +
                                "total_point = " + mastery["total_point"] + " " +
                                "WHERE discordid = '" + current["discordid"] + "'"
                            );
                        });
                    }
                    const timer7 = new Date();

                    if (debug) {
                        logger.log("- lol (update 4): " + (timer7 - timer4) + "ms");
                        logger.log("- lol (update 7): " + (timer4 - timer2) + "ms");
                    }
                    //logger.log("- lol (done): " + puuid);
                }
                if (debug) {
                    const timer3 = new Date();
                    logger.log("lol (update) : [" + current["puuid"] + "] " + (timer3 - timer1) + "ms for " + nb + " games. " + (timer2 - timer1) + "ms for update.");
                }
            }
        }
        const end = new Date();
        if (debug) {
            logger.log("lol (total) : " + (end - start) + "ms");
        }
        this.running = false;
        if (this.queue["summoners"].length > 0 || this.queue["updates"].length > 0) {
            return await this.main();
        }
        //await client.channels.cache.get("991052056657793124").send("Finished updating");
    },

    /**
     * Return stats from a match
     * @function matchHistoryOutput
     * @param {*} match   Match data
     * @returns {Object}  Stats of the match
     */
    matchHistoryOutput(match) {
        if (match === null || match === undefined || match["info"] === undefined || match["info"]["gameMode"] === "PRACTICETOOL" || match["info"]["gameType"] === "CUSTOM_GAME" || match["metadata"]["participants"].length !== 10 || match["info"]["participants"].length !== 10) {
            return null;
        }

        const exit = [];

        for (let participantId = 0; participantId < 10; participantId++) {

            let teamKills = 0;
            if (match['info']['participants'][participantId] === undefined) {
                logger.error("error : " + participantId);
            }
            const puuid = match['info']['participants'][participantId]['puuid'];

            // Lane
            const lane = match['info']['participants'][participantId]['teamPosition'];
            let lanePlayed = "";
            switch (lane) {
                case "TOP":
                    lanePlayed = "TOP";
                    break;
                case "JUNGLE":
                    lanePlayed = "JUNGLE";
                    break;
                case "Middle":
                    lanePlayed = "MIDDLE";
                    break;
                case "BOTTOM":
                    lanePlayed = "ADC";
                    break;
                case "UTILITY":
                    lanePlayed = "SUPPORT";
                    break;
                default:
                    if (match['info']['participants'][participantId]["individualPosition"] !== undefined) {
                        lanePlayed = match['info']['participants'][participantId]["individualPosition"];
                    } else {
                        lanePlayed = "Invalid";
                    }
                    break;

            }

            if (lanePlayed === "UTLITY" || lanePlayed === "BOTTOM") {
                lanePlayed = "MIDDLE";
            }

            const summonerName = match['info']['participants'][participantId]['summonerName'];

            // Players Team Id - 100 for Blue or 200 for Red
            const teamId = match['info']['participants'][participantId]['teamId'];
            let firstgold = 1;
            let firstdegats = 1;
            let firsttanked = 1;
            // "team" is used to loop through the players team
            const team = (teamId === 100) ? 5 : 10;

            for (let member = team - 5; member < team; member++) {
                //teamVisionScore += match['info']['participants'][member]['visionScore'];
                teamKills += match['info']['participants'][member]['kills'];
                //teamDeaths += match['info']['participants'][member]['deaths'];
                //teamDamage += match['info']['participants'][member]['totalDamageDealtToChampions'];
                //teamHealed += match['info']['participants'][member]['totalHeal'];
                //teamTaken += match['info']['participants'][member]['totalDamageTaken'];
                //teamMitigated += match['info']['participants'][member]['damageSelfMitigated'];
                //teamGold += match['info']['participants'][member]['goldEarned'];
                if (match['info']['participants'][member]['goldEarned'] > match['info']['participants'][participantId]['goldEarned']) {
                    firstgold = 0;
                }
                if (match['info']['participants'][member]['totalDamageDealtToChampions'] > match['info']['participants'][participantId]['totalDamageDealtToChampions']) {
                    firstdegats = 0;
                }
                if (match['info']['participants'][member]['totalDamageTaken'] > match['info']['participants'][participantId]['totalDamageTaken']) {
                    firsttanked = 0;
                }
            }
            //let cary = 0;
            if (firstgold === 1 || firstdegats === 1 || firsttanked === 1) {
                //cary = 1;
            }
            //}

            //{ Played As
            // Champion Id and Name
            const championId = match['info']['participants'][participantId]['championId'];
            //const championName = match['info']['participants'][participantId]['championName'];

            //}

            //{ Performance
            // Score
            const kills = match['info']['participants'][participantId]['kills'];
            const deaths = match['info']['participants'][participantId]['deaths'];
            const assists = match['info']['participants'][participantId]['assists'];

            //const kda = kills + " / " + deaths + " / " + assists;
            /*let killParticipation = (kills + assists) / teamKills;
            if (teamKills === 0){
                killParticipation = 0;
            }*/


            // Calculate KDA Ratio
            // Default is Kills + Assists
            // If Deaths > 0 then (Kills + Assists) / Deaths
            /*
            let kdaRatio = kills + assists;
            if (deaths > 0){
                kdaRatio /= deaths;
            }*/

            // Gold & Farm
            const gold = match['info']['participants'][participantId]['goldEarned'];
            const laneCS = match['info']['participants'][participantId]['totalMinionsKilled'];
            const jungleCS = match['info']['participants'][participantId]['neutralMinionsKilled'];

            // Damage
            const dealt = match['info']['participants'][participantId]['totalDamageDealtToChampions'];
            const healed = match['info']['participants'][participantId]['totalHeal'];
            const taken = match['info']['participants'][participantId]['totalDamageTaken'];
            //const mitigated = match['info']['participants'][participantId]['damageSelfMitigated'];

            //const turrets = match['info']['participants'][participantId]['damageDealtToTurrets'];
            //const objectives = match['info']['participants'][participantId]['damageDealtToObjectives'];

            // Support Stats
            //const allyHealing = match['info']['participants'][participantId]['totalHealsOnTeammates'];
            //const allyShielding = match['info']['participants'][participantId]['totalDamageShieldedOnTeammates'];
            //const supportItemQuestA = supportItemQuestB = "";

            // Vision
            const wardsPlaced = match['info']['participants'][participantId]['wardsPlaced'];
            //const denied = match['info']['participants'][participantId]['wardsKilled'];
            //const pinksPurchased = match['info']['participants'][participantId]['visionWardsBoughtInGame'];
            const pinksPlaced = match['info']['participants'][participantId]['detectorWardsPlaced'];
            const visionScore = match['info']['participants'][participantId]['visionScore'];
            //const visionShare = visionScore / teamVisionScore;
            //}

            /*
            //{ Spell Casts
            const qCasts = match['info']['participants'][participantId]['spell1Casts'];
            const wCasts = match['info']['participants'][participantId]['spell2Casts'];
            const eCasts = match['info']['participants'][participantId]['spell3Casts'];
            const rCasts = match['info']['participants'][participantId]['spell4Casts'];
            */
            // Summoner Spells
            //const ssACasts = match['info']['participants'][participantId]['summoner1Casts'];
            const ssAId = match['info']['participants'][participantId]['summoner1Id'];
            //const ssBCasts = match['info']['participants'][participantId]['summoner2Casts'];
            const ssBId = match['info']['participants'][participantId]['summoner2Id'];
            //}


            //{ Multi-Kills
            const doubles = match['info']['participants'][participantId]['doubleKills'];
            const triples = match['info']['participants'][participantId]['tripleKills'];
            const quadras = match['info']['participants'][participantId]['quadraKills'];
            const pentas = match['info']['participants'][participantId]['pentaKills'];
            //const highestmulti = match['info']['participants'][participantId]['largestMultiKill'];
            //}

            //{ Objective Play
            let dragonKills;
            let baronKills;
            let heraldKills;
            try {
                dragonKills = match['info']['participants'][participantId]['challenges']['dragonTakedowns'];
                baronKills = match['info']['participants'][participantId]['challenges']['teamBaronKills'];
                heraldKills = match['info']['participants'][participantId]['challenges']['teamRiftHeraldKills'];
            } catch (error) {
                dragonKills = match['info']['participants'][participantId]['dragonKills'];
                baronKills = match['info']['participants'][participantId]['baronKills'];
                heraldKills = 0;
            }


            /*
            const turretKills = match['info']['participants'][participantId]['turretKills'];
            const turretAssists = match['info']['participants'][participantId]['turretTakedowns'];

            const inhibitorKills = match['info']['participants'][participantId]['inhibitorKills'];
            const inhibitorAssists = match['info']['participants'][participantId]['inhibitorTakedowns'];

            const nexusKills = match['info']['participants'][participantId]['nexusKills'];
            const nexusAssists = match['info']['participants'][participantId]['nexusTakedowns'];
            //}
            */

            /*
            //{ First Blood & First Brick
            const firstBloodKill = match['info']['participants'][participantId]['firstBloodKill'];
            const firstBloodAssist = match['info']['participants'][participantId]['firstBloodAssist'];

            const firstBrickKill = match['info']['participants'][participantId]['firstTowerKill'];
            const firstBrickAssist = match['info']['participants'][participantId]['firstTowerAssist'];
            //}

            //{ Champion Exp & Level
            const level = match['info']['participants'][participantId]['champLevel'];
            const experience = match['info']['participants'][participantId]['champExperience'];
            //}
            */

            //{ Match Details
            const duration = match['info']['gameDuration'];
            const patch = match['info']['gameVersion'];
            //const creation = match['info']['gameCreation'];
            const matchId = match['metadata']['matchId'];
            let result = (match['info']['participants'][participantId]['win']) ? "Win" : "Lose";

            const totalTimeSpentDead = match['info']['participants'][participantId]['totalTimeSpentDead'];

            // Remake Check
            // if the match was less than 6 minutes and the player was active, then set the result to remake
            const ff_duration = 360;
            if (duration < ff_duration) {
                result = "Remake";
                // If the match was less than 6 minutes and the player was AFK, then set the result to LEAVE
            }
            //}

            const item0 = match['info']['participants'][participantId]['item0'];
            const item1 = match['info']['participants'][participantId]['item1'];
            const item2 = match['info']['participants'][participantId]['item2'];
            const item3 = match['info']['participants'][participantId]['item3'];
            const item4 = match['info']['participants'][participantId]['item4'];
            const item5 = match['info']['participants'][participantId]['item5'];
            const item6 = match['info']['participants'][participantId]['item6'];


            let queueName = match['info']['gameMode'];
            if (match["info"]["queueId"] === this.RANKED_FLEX) {
                queueName = "RANKED_FLEX";
            } else if (match["info"]["queueId"] === this.RANKED_SOLO) {
                queueName = "RANKED_SOLO";
            }

            const champname = this.champions[championId];
            if (champname === undefined || champname === null) {
                logger.error("Champion ID: " + championId + " is not in the champion list. Fetching new champion list.");
                this.champions = lol_api.championList(this.apiKey, "EUW1", this.language, this.client);
                const champname = this.champions[championId];
                if (champname === undefined || champname === null) {
                    logger.error("Champion ID: " + championId + " is still not in the champion list. Skipping match " + matchId + ".");
                    return null;
                }
            }

            const rune_0_perk = match['info']['participants'][participantId]['perks']['styles'][0]['selections'][0]['perk'];
            const rune_0_var1 = match['info']['participants'][participantId]['perks']['styles'][0]['selections'][0]['var1'];
            const rune_0_var2 = match['info']['participants'][participantId]['perks']['styles'][0]['selections'][0]['var2'];
            const rune_0_var3 = match['info']['participants'][participantId]['perks']['styles'][0]['selections'][0]['var3'];


            // Create Output Array
            exit.push({
                "matchId": matchId,
                "summonerName": summonerName,
                "summonerpuuid": puuid,
                "queueName": queueName,
                "champion": champname,
                "gold": gold,
                "lane": lanePlayed,
                "kills": kills,
                "deaths": deaths,
                "assists": assists,
                "result": result,
                "dealt": dealt,
                "taken": taken,
                "healed": healed,
                "objectifs": (dragonKills + baronKills + heraldKills),
                "wardsPlaced": wardsPlaced,
                "pinkPlaced": pinksPlaced,
                "visionScore": visionScore,
                "CS": laneCS + jungleCS,
                "duration": duration,
                "teamKills": teamKills,
                "firstGold": firstgold === 1,
                "firstDamage": firstdegats === 1,
                "firstTanked": firsttanked === 1,
                "doubles": doubles,
                "triples": triples,
                "quadras": quadras,
                "penta": pentas,
                "totalTimeSpentDead": totalTimeSpentDead,
                "date": match['info']['gameCreation'],
                "summoner1Id": ssAId,
                "summoner2Id": ssBId,
                "item0": item0,
                "item1": item1,
                "item2": item2,
                "item3": item3,
                "item4": item4,
                "item5": item5,
                "item6": item6,
                "patch": patch,
                "rune_0_perk": rune_0_perk,
                "rune_0_var1": rune_0_var1,
                "rune_0_var2": rune_0_var2,
                "rune_0_var3": rune_0_var3,
                "team_id": teamId
            });

        }
        return exit;
    },

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
        const value = ["IRON", "BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND", "MASTER", "GRANDMASTER", "CHALLENGER"].indexOf(tier) * 400
            + ["IV", "III", "II", "I"].indexOf(rank) * 100
            + LP;
        const old_value = ["IRON", "BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND", "MASTER", "GRANDMASTER", "CHALLENGER"].indexOf(old_tier) * 400
            + ["IV", "III", "II", "I"].indexOf(old_rank) * 100
            + old_LP;

        return value - old_value;
    }
};