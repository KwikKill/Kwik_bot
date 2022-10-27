const { Client, MessageEmbed, Collection, Intents } = require('discord.js');
const config = require('./config.json');
const fs = require("fs");
const path = require('path');
const pg = require('pg')
const https = require('https');
const fetch = require('node-fetch');
const packageJSON = require("./package.json");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS], partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

// -------------- LOL -----------------
var apiKey = process.env.RIOT_API_KEY //documentProperties.getProperty('API_KEY'); // Riot Games API Key
var region = "EUW1"; // Players Region
var route = "EUROPE"; // Regions Route
var language = "en_US"; // Players Language - Only Used for Champion Names
var	timezone = 7200000; // Players Timezone - If Blank defaults to Server Timezone
var startDate = "1641528000";
var champions = []
championList(region, language).then(list => {
  champions = list
  console.log(champions)
})

const delay = ms => new Promise(res => setTimeout(res, ms));

// -------------- Commandes -----------------
client.commands = new Collection();
client.context_menu = new Collection();
client.buttons = new Collection();
client.groups = new Collection();
client.owners = config["owner"]

client.listeners = new Collection();

client.amonglegends = new Collection();

client.requests = {"summoners": [], "matchs": [], "update": []};
client.running = false

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

client.commands.forEach((item, i) => {
	if(!client.groups.has(item.group)) {
		a = {
			name: item.group,
			commands: new Collection()
		}
		client.groups.set(item.group, a)
	}
	client.groups.get(item.group).commands.set(item.name, item)
});

client.isOwner = function (user) {
	return client.owners.includes(user.id)
}

// -------------- Utils -----------------
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

// -------------- Events -----------------
client.listeners.forEach((item, i) => {
  client.on(item.type, async (args1, args2, args3, args4) => {
    item.run(client, args1, args2, args3, args4)
  })
});

// -------------- Functions -----------------
client.canRunCommande = function(message, commande, interaction=undefined) {
	if(interaction == undefined) {
		//if(commande.commande_channel == true && !message.channel.name.toLowerCase().includes("commande")) return false
		if(!checkpermission(message, commande.permission)) return "perm";
		if(commande.place == "dm" && message.channel.type != "DM") return false;
		if(commande.place == "guild" && message.channel.type != "GUILD_TEXT") return false;
		return true;
	}else {
		//if(commande.commande_channel == true && !interaction.channel.name.toLowerCase().includes("commande")) return false;
		if(!checkpermission(interaction, commande.permission)) return "perm";
		return true;
	}
}

function checkpermission(message, perm) {
	id = message.author != undefined ? message.author.id : message.user.id
  if(client.owners.includes(id)) {
    return true
  }
	if(perm == "none") {
		return true
	}if(perm == "modo") {
    if(message.member.permissions.any("MANAGE_MESSAGES")) {
      return true
    }
  }
  return false

}

async function currentPatch(region){
	// Region Correction
	switch (region){
		// These regions just need thier numbers removed
		case "NA1":case "EUW1":case "TR1":case "BR1":case "JP1":
			region = region.slice(0,-1).toLowerCase();
			break;
		case "RU":
			region = "ru";
			break;
		case "KR":
			region = "kr";
			break;
		case "EUN1":
			region = "eune";
			break;
		case "OC1":
			region = "oce";
			break;
		case "LA1":
			region = "lan";
			break;
		case "LA2":
			region = "las";
			break;
	}
	
	var url = "https://ddragon.leagueoflegends.com/realms/"+region+".json";
	return await apiCall(url);
}

async function summonersByName(apiKey,region,summonerName){
	var url = "https://"+region+".api.riotgames.com/lol/summoner/v4/summoners/by-name/"+summonerName + "?api_key=" + apiKey;
	return await apiCall(url);
}

async function challenge(apiKey, region) {
  var url = "https://"+region+".api.riotgames.com/lol/challenges/v1/challenges/percentiles?api_key=" + apiKey;
	return await apiCall(url);
}

async function challengeconfig(apiKey, region) {
  var url = "https://"+region+".api.riotgames.com/lol/challenges/v1/challenges/config?api_key=" + apiKey;
	return await apiCall(url);
}

async function challengebypuuid(apiKey, region, puuid) {
  var url = "https://"+region+".api.riotgames.com/lol/challenges/v1/player-data/" + puuid + "?api_key=" + apiKey;
	return await apiCall(url);
}

async function leaguesBySummoner(apiKey,region,summonerId){
	var url = "https://"+region+".api.riotgames.com/lol/league/v4/entries/by-summoner/"+summonerId + "?api_key=" + apiKey;
	return await apiCall(url);
}

async function challengerLeagues(apiKey,region,queue){
	var url = "https://"+region+".api.riotgames.com/lol/league/v4/challengerleagues/by-queue/"+queue + "?api_key=" + apiKey;
	return await apiCall(url);
}

async function grandmasterLeagues(apiKey,region,queue){
	var url = "https://"+region+".api.riotgames.com/lol/league/v4/grandmasterleagues/by-queue/"+queue + "?api_key=" + apiKey;
	return await apiCall(url);
}

async function masterLeagues(apiKey,region,queue){
	var url = "https://"+region+".api.riotgames.com/lol/league/v4/masterleagues/by-queue/"+queue + "?api_key=" + apiKey;
	return await apiCall(url);
}

async function leaguesByLeagueId(apiKey,region,leagueId){
	var url = "https://"+region+".api.riotgames.com/lol/league/v4/leagues/"+leagueId + "?api_key=" + apiKey;
	return await apiCall(url);
}

async function matchesById(apiKey,route,matchId){
	var url = "https://"+route+".api.riotgames.com/lol/match/v5/matches/"+matchId + "?api_key=" + apiKey;
	return await apiCall(url);
}

async function matchlistsByAccount(apiKey,route,puuid,options){
	var url = "https://"+route+".api.riotgames.com/lol/match/v5/matches/by-puuid/"+puuid+"/ids"+options + "&api_key=" + apiKey;
	return await apiCall(url);
}

async function timelinesByMatchId(apiKey,route,matchId){
	var url = "https://"+route+".api.riotgames.com/lol/match/v5/matches/"+matchId+"/timeline" + "?api_key=" + apiKey;
	return await apiCall(url);
}

async function championmasteriesBySummoner(apiKey,region,summonerId){
	var url = "https://"+region+".api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/"+summonerId + "?api_key=" + apiKey;
	return await apiCall(url)
}

async function apiCall(url){
	// Fetch Data from provided URL & Options
	const responses = []
	response = await fetch(url)
	let data = await response.json();
	statut = await response
	statut = statut.status
	switch(statut) {
		case 200:
			return data;
			break;
		case 429:
			// Special Handling here - 429 is Rate Limit Reached.
			// Alert the User
			/*try {
				console.log("429: Limite d'appel de l'API atteinte.  Mise pause du script et reprise dans 10 secondes. N'annulez pas l'éxecution, veuillez patienter.");
			}catch(error) {
	
			}*/
			// Wait the time specified by the reponse header
      //await client.
			await delay(10000);
			// Retry
			return await apiCall(url);
			break;
    case 404:
      console.log("404: La ressource demandée n'existe pas.", url);
      return null
    case 400:
      console.log("400: La requête est invalide.", url);
      return null
	}
  return data;
    
}

async function championStaticData(language,patch){
	// If language isn't Set - Default to English
	if (language == ""){
		language="en_US";
	}
	
	try{
		var url = "https://ddragon.leagueoflegends.com/cdn/"+patch+"/data/"+language+"/champion.json" + "?api_key=" + apiKey;
    //Logger.log(url)
		return apiCall(url);
	}catch(error){
    Logger.log(error)
  }
	
	try{
		var url = "https://ddragon.leagueoflegends.com/cdn/10.9.1/data/"+language+"/champion.json" + "?api_key=" + apiKey;
		return await apiCall(url);
	}catch(error){
    Logger.log(error)
  }
}

async function championList(region, language){
	
	// Get New Champion List from Data Dragon
	var patch = await currentPatch(region);
	var championList = await championStaticData(language, patch['v']);

  //Logger.log(championList['data'])
	
	// Champions Array
	var champions = [];
	
	// Add Champion Names & IDs to the array
	for (var champion in championList['data']){
		champions[championList['data'][champion]['key']] = championList['data'][champion]['name'];
	}

	return champions;
}

// -------------- Functions -----------------
function canRunCommande(message, commande, interaction=undefined) {
	if(interaction == undefined) {
		//if(commande.commande_channel == true && !message.channel.name.toLowerCase().includes("commande")) return false
		if(!checkpermission(message, commande.permission)) return "perm";
		if(commande.place == "dm" && message.channel.type != "DM") return false;
		if(commande.place == "guild" && message.channel.type != "GUILD_TEXT") return false;
		return true;
	}else {
		//if(commande.commande_channel == true && !interaction.channel.name.toLowerCase().includes("commande")) return false;
		if(!checkpermission(interaction, commande.permission)) return "perm";
		return true;
	}
}

function checkpermission(message, perm) {
	id = message.author != undefined ? message.author.id : message.user.id
  if(client.owners.includes(id)) {
    return true
  }
	if(perm == "none") {
		return true
	}if(perm == "modo") {
    if(message.member.permissions.any("MANAGE_MESSAGES")) {
      return true
    }
  }
  return false

}

client.lol = async function() {
  //console.log(client.running, client.requests)
  if(client.running == true) return;
  client.running = true;
  while(client.requests["summoners"].length > 0) {
    x = client.requests["summoners"].shift()
    username = x["username"]
		  var summonerObject = await summonersByName(apiKey,region,username);
      if(summonerObject == null) {

      }else {
        id = summonerObject['id'];
        accountId = summonerObject['accountId'];
        puuid = summonerObject['puuid'];
        discordid = x["discordid"]

        await client.pg.query('INSERT INTO summoners(puuid, username, accountid, id, discordid) VALUES(\'' + puuid + '\', \'' + username +'\', \'' + accountId +'\', \'' + id +'\', \'' + discordid +'\')')
      }
  }
  while(client.requests["update"].length > 0) {
    if(client.requests["summoners"].length > 0) {
      client.running = false;
      return client.lol();
    }
    discordId = client.requests["update"].shift()
    //console.log(discordId)
    ids = await client.pg.query('SELECT * FROM summoners WHERE discordid = \'' + discordId + '\'')
    matchs = [];
    for(var x of ids.rows) {
      var matchIds = [];
      var indexed = 0;
      var gamesToIndex = true;
      var listOfMatches = {};
      //console.log(x)

      do{
        var options = "?startTime="+startDate+"&start="+indexed+"&count=100";
        listOfMatches = {'matches':await matchlistsByAccount(apiKey,route,x["puuid"],options)};
        // If there are less than 100 matches in the object, then this is the last match list
        if (listOfMatches['matches'].length < 100){
          gamesToIndex = false;
        }
        
        //console.log(listOfMatches)
        // Populate matchIds Array
        for (var match in listOfMatches['matches']){
          matchIds[indexed] = listOfMatches['matches'][match];
          indexed++;
        }
        
        // Fail Safe
        if (listOfMatches['matches'][0]==undefined){
          gamesToIndex = false;
          indexed = 0;
        }
      }while(gamesToIndex);

      //console.log(matchIds)
      al = await client.pg.query('SELECT matchs.puuid FROM matchs,summoners WHERE matchs.player = summoners.puuid AND summoners.discordid = \'' + discordId + '\'')
      already = []
      for(var y of al.rows) {
        already.push(y["puuid"])
      }
      for(var y of matchIds) {
        if(!already.includes(y)) {
          matchs.push([y, x["puuid"]])
        }
      }
    }
    client.requests["matchs"] = client.requests["matchs"].concat(matchs)
  }
  if(client.requests["matchs"].length > 0) {
    await client.channels.cache.get("991052056657793124").send("Update Started, " + client.requests["matchs"].length + " matchs to update");
  }
  while(client.requests["matchs"].length > 0) {
    if(client.requests["summoners"].length > 0) {
      client.running = false;
      return client.lol();
    }
    if(client.requests["update"].length > 0) {
      client.running = false;
      return client.lol();
    }
    matchId = client.requests["matchs"].shift()
    var match = await matchesById(apiKey,route,matchId[0]);
    if(match?.status?.status_code != 404) {
      var exit = await matchHistoryOutput(match, matchId[1]);
      if(exit != null) {
        await client.pg.query("INSERT INTO matchs(\
puuid, \
player, \
gamemode, \
champion, \
matchup, \
support, \
lane, \
gold, \
kill, \
deaths, \
assists, \
result, \
total_damage, \
tanked_damage, \
heal, \
neutral_objectives, \
wards, \
pinks, \
vision_score, \
cs, \
length, \
total_kills, \
first_gold, \
first_damages, \
first_tanked, \
double, \
tripple, \
quadra, \
penta, \
time_spent_dead, \
timestamp \
) VALUES (\
'" + matchId[0] + "',\
'" + exit["summonerpuuid"] + "',\
'" + exit["queueName"] + "',\
'" + exit["champion"] + "',\
'" + exit["matchup"] + "',\
'" + exit["support"] + "',\
'" + exit["lane"] + "',\
'" + exit["gold"] + "',\
" + exit["kills"] + ",\
" + exit["deaths"] + ",\
" + exit["assists"] + ",\
'" + exit["result"] + "',\
" + exit["dealt"] + ",\
" + exit["taken"] + ",\
" + exit["healed"] + ",\
" + exit["objectifs"] + ",\
" + exit["wardsPlaced"] + ",\
" + exit["pinkPlaced"] + ",\
" + exit["visionScore"] + ",\
" + exit["CS"] + ",\
" + exit["duration"] + ",\
" + exit["teamKills"] + ",\
" + exit["firstGold"] + ",\
" + exit["firstDamage"] + ",\
" + exit["firstTanked"] + ",\
" + exit["doubles"] + ",\
" + exit["triples"] + ",\
" + exit["quadras"] + ",\
" + exit["penta"] + ",\
" + exit["totalTimeSpentDead"] + ",\
" + exit["date"] + "\
)")
      }
    }
  }
  client.running = false;
  if(client.requests["summoners"].length > 0 || client.requests["update"].length > 0 || client.requests["matchs"].length > 0) {
    return await client.lol();
  }
  await client.channels.cache.get("991052056657793124").send("Finished updating");
}

async function matchHistoryOutput(match, puuid){
  if(match == undefined || match["info"] == undefined || match["info"]["gameMode"] == "PRACTICETOOL" || match["info"]["gameType"] == "CUSTOM_GAME" || match["metadata"]["participants"].length != 10) {
    return null
  }
	
	// Get Participant Id
	var participantId = 0;
	var foundParticipant = false;
	while (foundParticipant==false & participantId < 10){
		if (match['metadata']['participants'][participantId] == puuid){
			foundParticipant = true;
		}else{
			participantId++;
		}
	}

	//{ Team Stats - For Participation & Percent Share Stats
	// Variables
	var teamVisionScore = teamKills = teamDeaths = teamDamage = teamHealed = teamTaken = teamMitigated = teamGold = 0;

  	// Lane
	var lane = match['info']['participants'][participantId]['teamPosition'];
	var lanePlayed = "";
	switch (lane){
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
      if(match['info']['participants'][participantId]["individualPosition"] != undefined) {
        lanePlayed = match['info']['participants'][participantId]["individualPosition"]
      }else {
        lanePlayed = "Invalid";
      }
      break;
			
	}

  var support = "None"

	// Players Team Id - 100 for Blue or 200 for Red
	var teamId = match['info']['participants'][participantId]['teamId'];
  var firstgold = 1
  var firstdegats = 1
  var firsttanked = 1
	// "team" is used to loop through the players team
	var team = (teamId==100)?5:10;
	for (var member = team-5; member<team; member++){
		teamVisionScore += match['info']['participants'][member]['visionScore'];
		teamKills += match['info']['participants'][member]['kills'];
		teamDeaths += match['info']['participants'][member]['deaths'];
		teamDamage += match['info']['participants'][member]['totalDamageDealtToChampions'];
		teamHealed += match['info']['participants'][member]['totalHeal'];
		teamTaken += match['info']['participants'][member]['totalDamageTaken'];
		teamMitigated += match['info']['participants'][member]['damageSelfMitigated'];
		teamGold += match['info']['participants'][member]['goldEarned'];
    if(match['info']['participants'][member]['goldEarned'] > match['info']['participants'][participantId]['goldEarned']) {
      firstgold = 0
    }
    if(match['info']['participants'][member]['totalDamageDealtToChampions'] > match['info']['participants'][participantId]['totalDamageDealtToChampions']) {
      firstdegats = 0
    }
    if(match['info']['participants'][member]['totalDamageTaken'] > match['info']['participants'][participantId]['totalDamageTaken']) {
      firsttanked = 0
    }
    if(lanePlayed == "ADC") {
      var lane2 = match['info']['participants'][member]['teamPosition'];
      var lanePlayed2 = "";
      switch (lane2){
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
          if(match['info']['participants'][member]["individualPosition"] != undefined) {
            lanePlayed2 = match['info']['participants'][member]["individualPosition"]
          }else {
            lanePlayed2 = "Invalid";
          }
          break;
          
      }
      if(lanePlayed2 == "SUPPORT") {
        support = match['info']['participants'][member]['championName']
      }
    }
	}
  var cary = 0
  if(firstgold == 1 || firstdegats == 1 || firsttanked == 1) {
    cary = 1
  }
	//}
	
	//{ Played As
	// Champion Id and Name
	var championId = match['info']['participants'][participantId]['championId'];
	var championName = match['info']['participants'][participantId]['championName'];
	
	//}
	
	//{ Performance
	// Score
	var kills = match['info']['participants'][participantId]['kills'];
	var deaths = match['info']['participants'][participantId]['deaths'];
	var assists = match['info']['participants'][participantId]['assists'];

  matchup = ""
  x = 0
  while(x <= 9) {
    if(match['info']['participants'][x]["teamPosition"] == lane) {
      if(participantId != x) {
        matchup = match['info']['participants'][x]['championName']
      }
    }
    x++;
  }
  //Logger.log(matchup)
  //return;
	
	var kda = kills + " / " + deaths + " / " + assists;
	var killParticipation = (kills + assists) / teamKills;
	if (teamKills == 0){
		killParticipation = 0;
	}
	// Calculate KDA Ratio
	// Default is Kills + Assists
	// If Deaths > 0 then (Kills + Assists) / Deaths
	var kdaRatio = kills + assists;
	if (deaths > 0){
		kdaRatio /= deaths;
	}
	
	// Gold & Farm
	var gold = match['info']['participants'][participantId]['goldEarned'];
	var laneCS = match['info']['participants'][participantId]['totalMinionsKilled'];
	var jungleCS = match['info']['participants'][participantId]['neutralMinionsKilled'];
	
	// Damage
	var dealt = match['info']['participants'][participantId]['totalDamageDealtToChampions'];
	var healed = match['info']['participants'][participantId]['totalHeal'];
	var taken = match['info']['participants'][participantId]['totalDamageTaken'];
	var mitigated = match['info']['participants'][participantId]['damageSelfMitigated'];
	
	var turrets = match['info']['participants'][participantId]['damageDealtToTurrets'];
	var objectives = match['info']['participants'][participantId]['damageDealtToObjectives'];
	
	// Support Stats
	var allyHealing = match['info']['participants'][participantId]['totalHealsOnTeammates'];
	var allyShielding = match['info']['participants'][participantId]['totalDamageShieldedOnTeammates'];
	var supportItemQuestA = supportItemQuestB = "";
	
	// Vision
	var wardsPlaced = match['info']['participants'][participantId]['wardsPlaced'];
	var denied = match['info']['participants'][participantId]['wardsKilled'];
	var pinksPurchased = match['info']['participants'][participantId]['visionWardsBoughtInGame'];
	var pinksPlaced = match['info']['participants'][participantId]['detectorWardsPlaced'];
	var visionScore = match['info']['participants'][participantId]['visionScore'];
	var visionShare = visionScore / teamVisionScore;
	//}
	
	//{ Spell Casts
	var qCasts = match['info']['participants'][participantId]['spell1Casts'];
	var wCasts = match['info']['participants'][participantId]['spell2Casts'];
	var eCasts = match['info']['participants'][participantId]['spell3Casts'];
	var rCasts = match['info']['participants'][participantId]['spell4Casts'];
	// Summoner Spells
	var ssACasts = match['info']['participants'][participantId]['summoner1Casts'];
	var ssAId = match['info']['participants'][participantId]['summoner1Id'];
	var ssBCasts = match['info']['participants'][participantId]['summoner2Casts'];
	var ssBId = match['info']['participants'][participantId]['summoner2Id'];
	//}
	
	//{ Multi-Kills
	var doubles = match['info']['participants'][participantId]['doubleKills'];
	var triples = match['info']['participants'][participantId]['tripleKills'];
	var quadras = match['info']['participants'][participantId]['quadraKills'];
	var pentas = match['info']['participants'][participantId]['pentaKills'];
	var highestmulti = match['info']['participants'][participantId]['largestMultiKill'];
	//}
	
	//{ Objective Play
  try {
    var dragonKills = match['info']['participants'][participantId]['challenges']['dragonTakedowns'];
    var baronKills = match['info']['participants'][participantId]['challenges']['teamBaronKills'];
    var heraldKills = match['info']['participants'][participantId]['challenges']['teamRiftHeraldKills']
  }catch(error) {
    var dragonKills = match['info']['participants'][participantId]['dragonKills'];
    var baronKills = match['info']['participants'][participantId]['baronKills'];
    var heraldKills = 0
  }
	
	var turretKills = match['info']['participants'][participantId]['turretKills'];
	var turretAssists = match['info']['participants'][participantId]['turretTakedowns'];
	
	var inhibitorKills = match['info']['participants'][participantId]['inhibitorKills'];
	var inhibitorAssists = match['info']['participants'][participantId]['inhibitorTakedowns'];
	
	var nexusKills = match['info']['participants'][participantId]['nexusKills'];
	var nexusAssists = match['info']['participants'][participantId]['nexusTakedowns'];
	//}
	
	//{ First Blood & First Brick
	var firstBloodKill = match['info']['participants'][participantId]['firstBloodKill'];
	var firstBloodAssist = match['info']['participants'][participantId]['firstBloodAssist'];
	
	var firstBrickKill = match['info']['participants'][participantId]['firstTowerKill'];
	var firstBrickAssist = match['info']['participants'][participantId]['firstTowerAssist'];
	//}
	
	//{ Champion Exp & Level
	var level = match['info']['participants'][participantId]['champLevel'];
	var experience = match['info']['participants'][participantId]['champExperience'];
	//}
	
	//{ Match Details
	var duration = match['info']['gameDuration'];
	var creation = match['info']['gameCreation'];
	var matchId = match['metadata']['matchId'];
	var result = (match['info']['participants'][participantId]['win'])?"Win":"Lose";

  var totalTimeSpentDead = match['info']['participants'][participantId]['totalTimeSpentDead'];
	
	// Remake Check
	var inactivity = (kills + deaths + assists) + dealt + taken + laneCS + jungleCS;
	// if the match was less than 6 minutes and the player was active, then set the result to remake
	if ( duration<360 && inactivity>0){
		result = "Remake"
	// If the match was less than 6 minutes and the player was AFK, then set the result to LEAVE
	}else if (duration<360 && inactivity==0){
		result = "LEAVE";
	}
	//}
	

  queueName = match['info']['gameMode']
  if(match["info"]["queueId"] == 440) {
    queueName = "RANKED_FLEX"
  }else if(match["info"]["queueId"] == 420) {
    queueName = "RANKED_SOLO"
  }
	
  // Create Output Array
  var output = {
    "matchId": matchId,
    //"username": summoner["username"],
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
    "CS": laneCS+jungleCS,
    "duration": duration,
    "teamKills": teamKills,
    "firstGold": firstgold == 1,
    "firstDamage": firstdegats == 1,
    "firstTanked": firsttanked == 1,
    "doubles": doubles,
    "triples": triples,
    "quadras": quadras,
    "penta": pentas,
    "totalTimeSpentDead": totalTimeSpentDead,
    "date": match['info']['gameCreation'],

  //(last-14+outputRow),
  
  //championId,
  
  

  //kdaRatio,
  
  //killParticipation,
  
  //dealt/(duration/60),
  
  //taken/(duration/60),
  
  //healed/(duration/60),
  
  
  
  //(laneCS+jungleCS)/(duration/60),
  //gold/(duration/60),
  //duration/60,
  //visionScore/(duration/60),
  //cary,
	/*gold,laneCS+jungleCS,(laneCS+jungleCS)/(duration/60),farmA,farmB,farmC,
	dealt,healed,taken,mitigated,turrets,objectives,
	allyHealing,allyShielding,supportItemQuestA,supportItemQuestB,
	wardsPlaced,denied,pinksPurchased,pinksPlaced,visionScore,visionShare,
	(duration/86400),(creation/86400000)+25569,result,
	rank['beforeLP'],rank['afterLP'],rank['afterLP']-rank['beforeLP'],rank['tier'],rank['division'],
	'',rank['series'][0],rank['series'][1],rank['series'][2],rank['series'][3],rank['series'][4],
	'DNG','','','','','','','','',
	rank['ran'],"gpa",matchId,teamId,
	kills,deaths,assists,laneCS,jungleCS,qCasts,wCasts,eCasts,rCasts,ssAId,ssACasts,ssBId,ssBCasts,
	doubles,triples,quadras,pentas,highestmulti,
	turretKills,inhibitorKills,dragonKills,baronKills,nexusKills,turretAssists,inhibitorAssists,nexusAssists,
	firstBloodKill,firstBloodAssist,firstBrickKill,firstBrickAssist,
	'','','','','','','','','','',
	teamDamage,teamHealed,teamTaken,teamMitigated,teamKills,teamDeaths,teamGold,teamVisionScore*/
    };
	return output;
}

// -------------- Login -----------------
client.login(process.env.DISCORD_TOKEN);
