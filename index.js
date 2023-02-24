const { Client, Collection, Intents } = require('discord.js');
const config = require('./config.json');
const fs = require("fs");
const lol_api = require("./util/lol_api.js");
const express_server = require("./util/express.js");
const Markov = require('markov-strings').default;

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MEMBERS], partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

// -------------- LOL -----------------
const apiKey = process.env.RIOT_API_KEY;
const route = {
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
};
const language = "en_US"; // Players Language - Only Used for Champion Names
let champions = [];
const max_games = 100;
lol_api.championList(apiKey, "EUW1", language, client).then(list => {
    champions = list;
});

client.markov = new Markov({ stateSize: 3 });
client.markov.import(JSON.parse(fs.readFileSync('markov.json', 'utf8')));

const RANKED_FLEX = 440;
const RANKED_SOLO = 420;

// -------------- Commandes -----------------
client.commands = new Collection();
client.context_menu = new Collection();
client.buttons = new Collection();
client.groups = new Collection();

client.timers = new Collection();

client.listeners = new Collection();

client.amonglegends = new Collection();

client.owners = config["owner"];

client.requests = { "summoners": [], "updates": [] };
client.running = false;
client.queue_length = 0;
client.api_limit = false;

const ListenerFiles = fs.readdirSync('./listeners').filter(file => file.endsWith('.js'));
for (const file of ListenerFiles) {
    const listener = require(`./listeners/${file}`);
    client.listeners.set(listener.name, listener);
}

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

const contextFiles = fs.readdirSync('./context-menu').filter(file => file.endsWith('.js'));
for (const file of contextFiles) {
    const context = require(`./context-menu/${file}`);
    client.context_menu.set(context.name, context);
}

const buttonFiles = fs.readdirSync('./buttons').filter(file => file.endsWith('.js'));
for (const file of buttonFiles) {
    const button = require(`./buttons/${file}`);
    client.buttons.set(button.name, button);
}

const TimersFiles = fs.readdirSync('./timers').filter(file => file.endsWith('.js'));
for (const file of TimersFiles) {
    const timer = require(`./timers/${file}`);
    client.timers.set(timer.name, timer);
}

client.commands.forEach((item) => {
    if (!client.groups.has(item.group)) {
        const a = {
            name: item.group,
            commands: new Collection()
        };
        client.groups.set(item.group, a);
    }
    client.groups.get(item.group).commands.set(item.name, item);
});

client.isOwner = function (user) {
    return client.owners.includes(user.id);
};

// init trackers as undefined
client.trackers = [];

// -------------- Express -----------------

express_server.register(client);

// -------------- Utils -----------------
if (!String.prototype.format) {
    String.prototype.format = function () {
        const args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] !== 'undefined'
                ? args[number]
                : match;
        });
    };
}

// -------------- Events -----------------
client.listeners.forEach((item) => {
    client.on(item.type, async (args1, args2, args3, args4) => {
        item.run(client, args1, args2, args3, args4);
    });
});

// -------------- Functions -----------------
/**
 * Check if the command can be run
 * @function canRunCommande
 * @param  {*} message      message send by the user
 * @param  {*} commande     commande to run
 * @param  {*} interaction  interaction send by the user
 * @return {Boolean}        return true if the command can be run
 */
client.canRunCommande = function (message, commande, interaction = undefined) {
    if (interaction === undefined) {
        //if(commande.commande_channel === true && !message.channel.name.toLowerCase().includes("commande")) return false
        if (!checkpermission(message, commande.permission)) { return "perm"; }
        if (commande.place === "dm" && message.channel.type !== "DM") { return false; }
        if (commande.place === "guild" && message.channel.type !== "GUILD_TEXT") { return false; }
        return true;
    }
    //if(commande.commande_channel === true && !interaction.channel.name.toLowerCase().includes("commande")) return false;
    if (!checkpermission(interaction, commande.permission)) { return "perm"; }
    return true;

};

/**
 * Check if the user has the given permission
 * @function checkpermission
 * @param {*} message    message send by the user
 * @param {*} perm       permission to check
 * @returns {Boolean}    return true if the user has the permission
 */
function checkpermission(message, perm) {
    const id = message.author !== undefined ? message.author.id : message.user.id;
    if (client.owners.includes(id)) {
        return true;
    }
    if (perm === "none") {
        return true;
    } if (perm === "modo") {
        if (message.member.permissions.any("MANAGE_MESSAGES")) {
            return true;
        }
    }
    return false;

}

/**
 * Fetch summoner game list
 * @function set_update
 * @param {*} number  id of the summoner in client.requests["updates"]
 */
async function set_update(number) {
    const puuid = number["puuid"];
    const region = number["region"];

    if (config.verbose) {
        console.log("- lol (update 1) : " + puuid);
    }

    const matchs = [];
    const matchIds = [];
    let indexed = 0;
    let gamesToIndex = true;
    let listOfMatches = {};
    //console.log(x)

    let start = (Date.now() - 31536000000).toString();
    start = start.substring(0, start.length - 3);
    const response = await client.pg.query("SELECT timestamp FROM matchs WHERE player = $1 ORDER BY timestamp DESC LIMIT 1", [puuid]);
    if (response.rowCount !== 0) {
        start = Math.floor(response.rows[0].timestamp / 1000);
    }

    do {
        const options = "?startTime=" + start + "&start=" + indexed + "&count=100";
        listOfMatches = { 'matches': await lol_api.matchlistsByAccount(apiKey, route[region], puuid, options, client) };
        // If there are less than 100 matches in the object, then this is the last match list
        if (listOfMatches['matches'].length < max_games) {
            gamesToIndex = false;
        }

        //console.log(listOfMatches)
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


    //console.log(matchIds)
    const al = await client.pg.query('SELECT matchs.puuid FROM matchs WHERE player = \'' + puuid + '\'');
    const already = [];
    for (const y of al.rows) {
        already.push(y["puuid"]);
    }
    for (const y of number["matchs"]) {
        already.push(y);
    }
    for (const y of matchIds) {
        if (!already.includes(y)) {
            matchs.push(y);
        }
    }
    if (matchs.length === 0) {
        number["total"] = "none";
        return number;
    }
    number["matchs"] = number["matchs"].concat(matchs);
    client.queue_length += matchs.length;
    number["total"] = number["matchs"].length;
    return number;

}

/**
 * Update rank of user in the database
 * @function update_rank
 * @param {*} summoner_id  summoner id
 */
client.update_rank = async function (summoner_id, region) {
    const response = await lol_api.leaguesBySummoner(apiKey, region, summoner_id, client);

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
};

/**
 * Update mastery data of user in the database
 * @function update_mastery
 * @param {*} discordid  discord id
 */
client.update_mastery = async function (discordid, region) {

    const masteries = {};
    const query = await client.pg.query("SELECT * FROM summoners WHERE discordid = '" + discordid + "'");
    for (const x of query.rows) {
        const response = await lol_api.championmasteriesBySummoner(apiKey, region, x.id, client);
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
            data["first_mastery_champ"] = champions[masteries[x].championId].replaceAll("'", "");
        }
        else if (masteries[x].championPoints > data["second_mastery"]) {
            data["third_mastery"] = data["second_mastery"];
            data["third_mastery_champ"] = data["second_mastery_champ"].replaceAll("'", "");
            data["second_mastery"] = masteries[x].championPoints;
            data["second_mastery_champ"] = champions[masteries[x].championId].replaceAll("'", "");
        }
        else if (masteries[x].championPoints > data["third_mastery"]) {
            data["third_mastery"] = masteries[x].championPoints;
            data["third_mastery_champ"] = champions[masteries[x].championId].replaceAll("'", "");
        }
    }
    return data;
};


/**
 * Fetch summoner game list and add games to the database
 * @function lol
 */
client.lol = async function () {
    //console.log(client.running, client.requests)
    if (client.running === true) { return; }
    client.running = true;
    while (client.requests["summoners"].length > 0) {
        const x = client.requests["summoners"].shift();
        if (config.verbose) {
            console.log("- lol (summoner) : " + x["username"], x["discordid"]);
        }
        const username = x["username"];
        const interaction = x["interaction"];
        const discordid = x["discordid"];
        const region = x["region"];
        const summonerObject = await lol_api.summonersByName(apiKey, region, username, client);
        if (summonerObject === null) {
            try {
                await interaction.editReply("<@" + discordid + ">, Account " + username + " not found.");
            } catch {

            }
        } else {
            const id = summonerObject['id'];
            const accountId = summonerObject['accountId'];
            const puuid = summonerObject['puuid'];

            const rank = await client.update_rank(id, region);

            await client.pg.query('INSERT INTO summoners(' +
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
                "0" +
                ')'
            );

            const response = await client.pg.query("SELECT * FROM mastery WHERE discordid = '" + discordid + "'");
            if (response.rowCount === 0) {
                const mastery = await client.update_mastery(discordid, region);
                await client.pg.query("INSERT INTO mastery(" +
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
            client.requests["updates"].push({ "puuid": puuid, "id": id, "username": username, "discordid": discordid, "matchs": [], "total": 0, "count": 0, "region": region });
        }
    }
    while (client.requests["updates"].length > 0) {
        if (client.requests["summoners"].length > 0) {
            client.running = false;
            return client.lol();
        }
        let current = client.requests["updates"].shift();
        /*for (let i = 0; i < client.requests["updates"].length; i++) {
            if (client.requests["updates"][i]["matchs"].length === 0 && client.requests["updates"][i]["total"] !== "none") {
                await set_update(i);
            }
        }*/
        current = await set_update(current);

        const puuid = current["puuid"];
        const discordid = current["discordid"];
        const region = current["region"];

        if (current["matchs"].length > 0) {
            //console.log("- lol (update 1) : " + puuid, client.requests["updates"][0]["matchs"].length);
            while (current["matchs"].length > 0) {
                const matchId = current["matchs"].shift();
                if (config.verbose) {
                    console.log("- lol (update 2) : " + puuid, matchId);
                }
                client.queue_length -= 1;
                lol_api.matchesById(apiKey, route[region], matchId, client).then(match => {

                    if (match?.status?.status_code !== 404) {
                        const exit = matchHistoryOutput(match);
                        if (exit !== null) {
                            current["count"] = current["count"] + 1;
                            for (const summary of exit) {
                                try {
                                    client.pg.query("INSERT INTO matchs(" +
                                        "puuid, " +
                                        "player, " +
                                        "gamemode, " +
                                        "champion, " +
                                        "matchup, " +
                                        "support, " +
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
                                        "$44," +
                                        "$45," +
                                        "$46" +
                                        ") ON CONFLICT (puuid, player) DO NOTHING;",
                                        [
                                            matchId,
                                            summary["summonerpuuid"],
                                            summary["queueName"],
                                            summary["champion"],
                                            summary["matchup"],
                                            summary["support"],
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
                                    );
                                } catch (e) {
                                    //console.log(e);
                                }
                            }
                        }
                    }
                });
            }
            //console.log("- lol (update 2) : rank");
            const rank = await client.update_rank(current["id"], current["region"]);
            // read current rank and send message if rank changed
            const current_rank = await client.pg.query("SELECT * FROM summoners WHERE id = '" + current["id"] + "'");
            for (const x of client.trackers) {
                const channel = await client.channels.fetch(x);
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
                        await client.pg.query("UPDATE summoners SET rank_solo = '" + rank["RANKED_SOLO_5x5"]["rank"] + "', tier_solo = '" + rank["RANKED_SOLO_5x5"]["tier"] + "', LP_solo = " + rank["RANKED_SOLO_5x5"]["leaguePoints"] + ", rank_flex = '" + rank["RANKED_FLEX_SR"]["rank"] + "', tier_flex = '" + rank["RANKED_FLEX_SR"]["tier"] + "', LP_flex = " + rank["RANKED_FLEX_SR"]["leaguePoints"] + " WHERE id = '" + current["id"] + "'");
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
                            channel.send("Rank Solo/Duo update for " +
                                current["username"] +
                                " : " + rank["RANKED_SOLO_5x5"]["tier"] +
                                " " + rank["RANKED_SOLO_5x5"]["rank"] +
                                " " + rank["RANKED_SOLO_5x5"]["leaguePoints"] +
                                " LP (" + LP_change(current_rank.rows[0].rank_solo, current_rank.rows[0].tier_solo, current_rank.rows[0].lp_solo, rank["RANKED_SOLO_5x5"]["rank"], rank["RANKED_SOLO_5x5"]["tier"], rank["RANKED_SOLO_5x5"]["leaguePoints"]) + "LP)");
                        } else if (
                            (
                                current_rank.rows[0].rank_flex !== rank["RANKED_FLEX_SR"]["rank"] ||
                                current_rank.rows[0].tier_flex !== rank["RANKED_FLEX_SR"]["tier"] ||
                                current_rank.rows[0].lp_flex !== rank["RANKED_FLEX_SR"]["leaguePoints"]
                            )
                            && rank["RANKED_FLEX_SR"]["tier"] !== "unranked"
                        ) {
                            channel.send("Rank Flex update for " +
                                current["username"] +
                                " : " + rank["RANKED_FLEX_SR"]["tier"] +
                                " " + rank["RANKED_FLEX_SR"]["rank"] +
                                " " + rank["RANKED_FLEX_SR"]["leaguePoints"] +
                                " LP (" + LP_change(current_rank.rows[0].rank_flex, current_rank.rows[0].tier_flex, current_rank.rows[0].lp_flex, rank["RANKED_FLEX_SR"]["rank"], rank["RANKED_FLEX_SR"]["tier"], rank["RANKED_FLEX_SR"]["leaguePoints"]) + "LP)");
                        }
                    }

                }


            }

            if (discordid !== "503109625772507136") {
                //console.log("- lol (update 3): mastery");
                client.update_mastery(current["discordid"], current["region"]).then(mastery => {
                    client.pg.query("UPDATE mastery " +
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
            //console.log("- lol (done): " + puuid);
        }

    }
    client.running = false;
    if (client.requests["summoners"].length > 0 || client.requests["updates"].length > 0) {
        return await client.lol();
    }
    //await client.channels.cache.get("991052056657793124").send("Finished updating");
};

/**
 * Return stats from a match
 * @function matchHistoryOutput
 * @param {*} match   Match data
 * @param {*} puuid   Puuid of the summoner
 * @returns {Object}  Stats of the match
 */
function matchHistoryOutput(match) {
    if (match === null || match === undefined || match["info"] === undefined || match["info"]["gameMode"] === "PRACTICETOOL" || match["info"]["gameType"] === "CUSTOM_GAME" || match["metadata"]["participants"].length !== 10) {
        return null;
    }

    const exit = [];

    for (let participantId = 0; participantId < 10; participantId++) {

        let teamKills = 0;
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

        let support = "None";

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
            if (lanePlayed === "ADC") {
                const lane2 = match['info']['participants'][member]['teamPosition'];
                let lanePlayed2 = "";
                switch (lane2) {
                    case "TOP":
                        lanePlayed2 = "TOP";
                        break;
                    case "JUNGLE":
                        lanePlayed2 = "JUNGLE";
                        break;
                    case "Middle":
                        lanePlayed2 = "MIDDLE";
                        break;
                    case "BOTTOM":
                        lanePlayed2 = "ADC";
                        break;
                    case "UTILITY":
                        lanePlayed2 = "SUPPORT";
                        break;
                    default:
                        if (match['info']['participants'][member]["individualPosition"] !== undefined) {
                            lanePlayed2 = match['info']['participants'][member]["individualPosition"];
                        } else {
                            lanePlayed2 = "Invalid";
                        }
                        break;

                }
                if (lanePlayed2 === "SUPPORT") {
                    support = match['info']['participants'][member]['championId'];
                }
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

        let matchupId = "None";
        let x = 0;
        while (x < 10) {
            if (match['info']['participants'][x]["teamPosition"] === lane) {
                if (participantId !== x) {
                    matchupId = match['info']['participants'][x]['championId'];
                }
            }
            x++;
        }

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
        const inactivity = (kills + deaths + assists) + dealt + taken + laneCS + jungleCS;
        // if the match was less than 6 minutes and the player was active, then set the result to remake
        const ff_duration = 360;
        if (duration < ff_duration && inactivity > 0) {
            result = "Remake";
            // If the match was less than 6 minutes and the player was AFK, then set the result to LEAVE
        } else if (duration < ff_duration && inactivity === 0) {
            result = "LEAVE";
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
        if (match["info"]["queueId"] === RANKED_FLEX) {
            queueName = "RANKED_FLEX";
        } else if (match["info"]["queueId"] === RANKED_SOLO) {
            queueName = "RANKED_SOLO";
        }

        const champname = champions[championId];
        let matchupname;
        if (matchupId === "None") {
            matchupname = "None";
        } else {
            matchupname = champions[matchupId];
        }

        let supportname;
        if (support === "None") {
            supportname = "None";
        } else {
            supportname = champions[support];
        }

        const rune_0_perk = match['info']['participants'][participantId]['perks']['styles'][0]['selections'][0]['perk'];
        const rune_0_var1 = match['info']['participants'][participantId]['perks']['styles'][0]['selections'][0]['var1'];
        const rune_0_var2 = match['info']['participants'][participantId]['perks']['styles'][0]['selections'][0]['var2'];
        const rune_0_var3 = match['info']['participants'][participantId]['perks']['styles'][0]['selections'][0]['var3'];


        // Create Output Array
        exit.push({
            "matchId": matchId,
            "summonerpuuid": puuid,
            "queueName": queueName,
            "champion": champname,
            "matchup": matchupname,
            "support": supportname,
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
}

function LP_change(old_rank, old_tier, old_LP, rank, tier, LP) {
    const value = ["IRON", "BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND", "MASTER", "GRANDMASTER", "CHALLENGER"].indexOf(tier) * 400
        + ["IV", "III", "II", "I"].indexOf(rank) * 100
        + LP;
    const old_value = ["IRON", "BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND", "MASTER", "GRANDMASTER", "CHALLENGER"].indexOf(old_tier) * 400
        + ["IV", "III", "II", "I"].indexOf(old_rank) * 100
        + old_LP;

    return value - old_value;
}

// -------------- Login -----------------
client.login(process.env.DISCORD_TOKEN);
