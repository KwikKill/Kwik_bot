const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const config = require('./config.json');
const fs = require("fs");
const lol_api = require("./util/lol_api.js");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MEMBERS], partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

// -------------- LOL -----------------
const apiKey = process.env.RIOT_API_KEY;
const region = "EUW1"; // Players Region
const route = "EUROPE"; // Regions Route
const language = "en_US"; // Players Language - Only Used for Champion Names
const startDate = "1641528000";
let champions = [];
const max_games = 100;
lol_api.championList(apiKey, region, language).then(list => {
    champions = list;
});

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
    const puuid = client.requests["updates"][number]["puuid"];

    if (config.verbose) {
        console.log("- lol (update 1) : " + puuid);
    }

    const matchs = [];
    const matchIds = [];
    let indexed = 0;
    let gamesToIndex = true;
    let listOfMatches = {};
    //console.log(x)

    let start = startDate;
    const response = await client.pg.query("SELECT timestamp FROM matchs WHERE player = '" + puuid + "' ORDER BY timestamp DESC LIMIT 1");
    if (response.rowCount !== 0) {
        start = Math.floor(response.rows[0].timestamp / 1000);
    }

    do {
        const options = "?startTime=" + start + "&start=" + indexed + "&count=100";
        listOfMatches = { 'matches': await lol_api.matchlistsByAccount(apiKey, route, puuid, options) };
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
    for (const y of client.requests["updates"][number]["matchs"]) {
        already.push(y);
    }
    for (const y of matchIds) {
        if (!already.includes(y)) {
            matchs.push(y);
        }
    }
    client.requests["updates"][number]["matchs"] = client.requests["updates"][number]["matchs"].concat(matchs);
    client.queue_length += matchs.length;
    client.requests["updates"][number]["total"] = client.requests["updates"][number]["matchs"].length;
    return;
}

/**
 * Update rank of user in the database
 * @function update_rank
 * @param {*} summoner_id  summoner id
 */
client.update_rank = async function (summoner_id) {
    const response = await lol_api.leaguesBySummoner(apiKey, region, summoner_id);

    const data = {
        "RANKED_SOLO_5x5": {
            "tier": "unranked",
            "rank": "unranked",
            "leaguePoints": 0,
        },
        "RANKED_FLEX_SR": {
            "tier": "unranked",
            "rank": "unranked",
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
        const summonerObject = await lol_api.summonersByName(apiKey, region, username);
        if (summonerObject === null) {
            try {
                await interaction.editReply("<@" + discordid + ">, Account " + username + " not found.");
            } catch {

            }
        } else {
            const id = summonerObject['id'];
            const accountId = summonerObject['accountId'];
            const puuid = summonerObject['puuid'];

            const rank = await client.update_rank(id);

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
                'LP_flex' +
                ') ' +
                'VALUES(\'' +
                puuid + '\', \'' +
                username + '\', ' + '\'' +
                accountId + '\', \'' +
                id + '\', \'' +
                discordid + '\', \'' +
                rank["RANKED_SOLO_5x5"]["rank"] + '\', \'' +
                rank["RANKED_SOLO_5x5"]["tier"] + '\', \'' +
                rank["RANKED_SOLO_5x5"]["leaguePoints"] + '\', \'' +
                rank["RANKED_FLEX_SR"]["rank"] + '\', \'' +
                rank["RANKED_FLEX_SR"]["tier"] + '\', \'' +
                rank["RANKED_FLEX_SR"]["leaguePoints"] +
                '\')'
            );
            try {
                await interaction.editReply("<@" + discordid + ">, Account " + username + " has been added to the database.");
            } catch {

            }
            client.requests["updates"].push({ "puuid": puuid, "id": id, "matchs": [], "total": 0, "count": 0 });
        }
    }
    while (client.requests["updates"].length > 0) {
        if (client.requests["summoners"].length > 0) {
            client.running = false;
            return client.lol();
        }

        await set_update(0);

        const puuid = client.requests["updates"][0]["puuid"];

        while (client.requests["updates"][0]["matchs"].length > 0) {
            for (let i = 0; i < client.requests["updates"].length; i++) {
                if (client.requests["updates"][i]["matchs"].length === 0) {
                    await set_update(i);
                }
            }
            const matchId = client.requests["updates"][0]["matchs"].shift();
            if (config.verbose) {
                console.log("- lol (update 2) : " + puuid, matchId);
            }
            client.queue_length -= 1;
            const match = await lol_api.matchesById(apiKey, route, matchId);

            if (match?.status?.status_code !== 404) {
                const exit = await matchHistoryOutput(match, puuid);
                if (exit !== null) {
                    client.requests["updates"][0]["count"] = client.requests["updates"][0]["count"] + 1;
                    try {
                        await client.pg.query("INSERT INTO matchs(" +
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
                            "player2, " +
                            "player3, " +
                            "player4, " +
                            "player5 " +
                            ") VALUES (" +
                            "'" + matchId + "'," +
                            "'" + exit["summonerpuuid"] + "'," +
                            "'" + exit["queueName"] + "'," +
                            "'" + exit["champion"] + "'," +
                            "'" + exit["matchup"] + "'," +
                            "'" + exit["support"] + "'," +
                            "'" + exit["lane"] + "'," +
                            "'" + exit["gold"] + "'," +
                            "" + exit["kills"] + "," +
                            "" + exit["deaths"] + "," +
                            "" + exit["assists"] + "," +
                            "'" + exit["result"] + "'," +
                            "" + exit["dealt"] + "," +
                            "" + exit["taken"] + "," +
                            "" + exit["healed"] + "," +
                            "" + exit["objectifs"] + "," +
                            "" + exit["wardsPlaced"] + "," +
                            "" + exit["pinkPlaced"] + "," +
                            "" + exit["visionScore"] + "," +
                            "" + exit["CS"] + "," +
                            "" + exit["duration"] + "," +
                            "" + exit["teamKills"] + "," +
                            "" + exit["firstGold"] + "," +
                            "" + exit["firstDamage"] + "," +
                            "" + exit["firstTanked"] + "," +
                            "" + exit["doubles"] + "," +
                            "" + exit["triples"] + "," +
                            "" + exit["quadras"] + "," +
                            "" + exit["penta"] + "," +
                            "" + exit["totalTimeSpentDead"] + "," +
                            "" + exit["date"] + "," +
                            "'" + exit["player2"] + "'," +
                            "'" + exit["player3"] + "'," +
                            "'" + exit["player4"] + "'," +
                            "'" + exit["player5"] + "'" +
                            ")"
                        );
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
        }
        const rank = await client.update_rank(client.requests["updates"][0]["id"]);

        // read current rank and send message if rank changed
        const current_rank = await client.pg.query("SELECT * FROM summoners WHERE id = '" + client.requests["updates"][0]["id"] + "'");
        if (current_rank.rows[0].rank_solo !== rank["RANKED_SOLO_5x5"]["rank"] || current_rank.rows[0].tier_solo !== rank["RANKED_SOLO_5x5"]["tier"] || current_rank.rows[0].LP_solo !== rank["RANKED_SOLO_5x5"]["leaguePoints"] || current_rank.rows[0].rank_flex !== rank["RANKED_FLEX_SR"]["rank"] || current_rank.rows[0].tier_flex !== rank["RANKED_FLEX_SR"]["tier"] || current_rank.rows[0].LP_flex !== rank["RANKED_FLEX_SR"]["leaguePoints"]) {
            await client.pg.query("UPDATE summoners SET rank_solo = '" + rank["RANKED_SOLO_5x5"]["rank"] + "', tier_solo = '" + rank["RANKED_SOLO_5x5"]["tier"] + "', LP_solo = " + rank["RANKED_SOLO_5x5"]["leaguePoints"] + ", rank_flex = '" + rank["RANKED_FLEX_SR"]["rank"] + "', tier_flex = '" + rank["RANKED_FLEX_SR"]["tier"] + "', LP_flex = " + rank["RANKED_FLEX_SR"]["leaguePoints"] + " WHERE id = '" + client.requests["updates"][0]["id"] + "'");
            const embed = new MessageEmbed()
                .setColor("#0099ff")
                .setTitle("Rank update")
                .addFields(
                    {
                        name: "Solo/Duo",
                        value: rank["RANKED_SOLO_5x5"]["tier"] + " " + rank["RANKED_SOLO_5x5"]["rank"] + " " + rank["RANKED_SOLO_5x5"]["leaguePoints"] + "LP",
                    },
                    {
                        name: "Flex",
                        value: rank["RANKED_FLEX_SR"]["tier"] + " " + rank["RANKED_FLEX_SR"]["rank"] + " " + rank["RANKED_FLEX_SR"]["leaguePoints"] + "LP",
                    }
                );

            await client.channels.cache.get("1034981867205697557").send({ embeds: embed });
        }

        client.requests["updates"].shift();
    }
    client.running = false;
    /*if(client.requests["summoners"].length > 0 || client.requests["update"].length > 0) {
        return await client.lol();
    }*/
    await client.channels.cache.get("991052056657793124").send("Finished updating");
};

/**
 * Return stats from a match
 * @function matchHistoryOutput
 * @param {*} match   Match data
 * @param {*} puuid   Puuid of the summoner
 * @returns {Object}  Stats of the match
 */
async function matchHistoryOutput(match, puuid) {
    if (match === undefined || match["info"] === undefined || match["info"]["gameMode"] === "PRACTICETOOL" || match["info"]["gameType"] === "CUSTOM_GAME" || match["metadata"]["participants"].length !== 10) {
        return null;
    }

    // Get Participant Id
    let participantId = 0;
    let foundParticipant = false;
    while (foundParticipant === false & participantId < 10) {
        if (match['metadata']['participants'][participantId] === puuid) {
            foundParticipant = true;
        } else {
            participantId++;
        }
    }

    const participants = [];
    for (const x of match["info"]["participants"]) {
        if (x.summonerName !== match["info"]["participants"][participantId].summonerName) {
            participants.push(x.summonerName);
        }
    }

    //{ Team Stats - For Participation & Percent Share Stats
    // Variables
    //let teamVisionScore = 0;
    let teamKills = 0;
    //let teamDeaths = 0;
    //let teamDamage = 0;
    //let teamHealed = 0;
    //let teamTaken = 0;
    //let teamMitigated = 0;
    //let teamGold = 0;

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
                support = match['info']['participants'][member]['championName'];
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

    let matchup = "";
    let x = 0;
    while (x < 10) {
        if (match['info']['participants'][x]["teamPosition"] === lane) {
            if (participantId !== x) {
                matchup = match['info']['participants'][x]['championName'];
            }
        }
        x++;
    }
    //Logger.log(matchup)
    //return;

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
    // Summoner Spells
    const ssACasts = match['info']['participants'][participantId]['summoner1Casts'];
    const ssAId = match['info']['participants'][participantId]['summoner1Id'];
    const ssBCasts = match['info']['participants'][participantId]['summoner2Casts'];
    const ssBId = match['info']['participants'][participantId]['summoner2Id'];
    //}
    */

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


    let queueName = match['info']['gameMode'];
    if (match["info"]["queueId"] === RANKED_FLEX) {
        queueName = "RANKED_FLEX";
    } else if (match["info"]["queueId"] === RANKED_SOLO) {
        queueName = "RANKED_SOLO";
    }

    // Create Output Array
    const output = {
        "matchId": matchId,
        "summonerpuuid": puuid,
        "queueName": queueName,
        "champion": champions[championId].replaceAll("'", "").replaceAll(" ", ""),
        "matchup": matchup.replaceAll("'", "").replaceAll(" ", ""),
        "support": support,
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
        "player2": participants[0],
        "player3": participants[1],
        "player4": participants[2],
        "player5": participants[3],
    };
    return output;
}

// -------------- Login -----------------
client.login(process.env.DISCORD_TOKEN);
