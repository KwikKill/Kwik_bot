const fetch = require('node-fetch');
const config = require('../config.json');
const logger = require('./logger.js');

const delay_time = 10000;
const delay = ms => new Promise(res => setTimeout(res, ms));

class LolApi {
    /**
     * Get the current patch version
     * @function getCurrentPatch
     * @param {*} region   region of the player
     * @returns {Boolean}  return the current patch version
     */
    async getCurrentPatch(region, client) {
        // Region Correction
        switch (region) {
            // These regions just need thier numbers removed
            case "NA1": case "EUW1": case "TR1": case "BR1": case "JP1":
                region = region.slice(0, -1).toLowerCase();
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

        const url = "https://ddragon.leagueoflegends.com/realms/" + region + ".json";
        return await this.apiCall(url, client);
    }

    /**
     * Get a dict with champion name and champion id
     * @function getChampsId
     * @param {*} region   region of the player
     * @returns {Boolean}  return the current patch version
     */
    async getChampsId(region, client) {
        // Region Correction
        const version = await this.getCurrentPatch(region, client);
        const url = "http://ddragon.leagueoflegends.com/cdn/" + version['v'] + "/data/en_US/champion.json";
        const raw = await this.apiCall(url, client);
        const data = {};
        for (const champ in raw['data']) {
            data[raw['data'][champ]['name']] = raw['data'][champ]['id'];
        }
        return data;
    }

    /**
     * Get the summoner data from the API by name
     * @function summonersByName
     * @param {*} apiKey        Riot API key
     * @param {*} region        region of the player
     * @param {*} summonerName  name of the summoner
     * @returns {Object}        summoner's data
     */
    async summonersByName(apiKey, region, summonerName, client) {
        this.checkRegion(region, client);
        const url = "https://" + region + ".api.riotgames.com/lol/summoner/v4/summoners/by-name/" + summonerName + "?api_key=" + apiKey;
        return await this.apiCall(url, client);
    }

    /**
     * Get the summoner data from the API by name
     * @function summonersByPuuid
     * @param {*} apiKey         Riot API key
     * @param {*} region         region of the player
     * @param {*} summonerPuuid  name of the summoner
     * @returns {Object}         summoner's data
     */
    async summonerByPuuid(apiKey, region, summonerPuuid, client) {
        this.checkRegion(region, client);
        const url = "https://" + region + ".api.riotgames.com/lol/summoner/v4/summoners/by-puuid/" + summonerPuuid + "?api_key=" + apiKey;
        return await this.apiCall(url, client);
    }

    /**
     * Get Challenge data from the API
     * @function challenge
     * @param {*} apiKey   Riot API key
     * @param {*} region   region of the player
     * @returns {Object}   Challenge's data
     */
    async challenge(apiKey, region, client) {
        this.checkRegion(region, client);
        const url = "https://" + region + ".api.riotgames.com/lol/challenges/v1/challenges/percentiles?api_key=" + apiKey;
        return await this.apiCall(url, client);
    }

    /**
     * Get ChallengeConfig data from the API
     * @function challenge
     * @param {*} apiKey   Riot API key
     * @param {*} region   region of the player
     * @returns {Object}   ChallengeConfig
     */
    async challengeconfig(apiKey, region, client) {
        this.checkRegion(region, client);
        const url = "https://" + region + ".api.riotgames.com/lol/challenges/v1/challenges/config?api_key=" + apiKey;
        return await this.apiCall(url, client);
    }

    /**
     * Get Challenge data of a player by puuid from the API
     * @function challengebypuuid
     * @param {*} apiKey   Riot API key
     * @param {*} region   region of the player
     * @param {*} puuid    puuid of the player
     * @returns {Object}   Challenge data of the player
     */
    async challengebypuuid(apiKey, region, puuid, client) {
        this.checkRegion(region, client);
        const url = "https://" + region + ".api.riotgames.com/lol/challenges/v1/player-data/" + puuid + "?api_key=" + apiKey;
        return await this.apiCall(url, client);
    }

    /**
     * get the leagues of a summoner by summoner id
     * @function leaguesBySummoner
     * @param {*} apiKey      Riot API key
     * @param {*} region      region of the player
     * @param {*} summonerId  summoner id of the player
     * @returns {Object}      leagues of the player
     */
    async leaguesBySummoner(apiKey, region, summonerId, client) {
        this.checkRegion(region, client);
        const url = "https://" + region + ".api.riotgames.com/lol/league/v4/entries/by-summoner/" + summonerId + "?api_key=" + apiKey;
        return await this.apiCall(url, client);
    }

    /**
     * get challenger league
     * @function challengerLeagues
     * @param {*} apiKey      Riot API key
     * @param {*} region      region of the player
     * @param {*} queue       queue of the league
     * @returns {Object}      challenger league
     */
    async challengerLeagues(apiKey, region, queue, client) {
        this.checkRegion(region, client);
        const url = "https://" + region + ".api.riotgames.com/lol/league/v4/challengerleagues/by-queue/" + queue + "?api_key=" + apiKey;
        return await this.apiCall(url, client);
    }

    /**
     * get grandmaster league
     * @function grandmasterLeagues
     * @param {*} apiKey      Riot API key
     * @param {*} region      region of the player
     * @param {*} queue       queue of the league
     * @returns {Object}      grandmaster league
     */
    async grandmasterLeagues(apiKey, region, queue, client) {
        this.checkRegion(region, client);
        const url = "https://" + region + ".api.riotgames.com/lol/league/v4/grandmasterleagues/by-queue/" + queue + "?api_key=" + apiKey;
        return await this.apiCall(url, client);
    }

    /**
     * get master league
     * @function masterLeagues
     * @param {*} apiKey      Riot API key
     * @param {*} region      region of the player
     * @param {*} queue       queue of the league
     * @returns {Object}      master league
     */
    async masterLeagues(apiKey, region, queue, client) {
        this.checkRegion(region, client);
        const url = "https://" + region + ".api.riotgames.com/lol/league/v4/masterleagues/by-queue/" + queue + "?api_key=" + apiKey;
        return await this.apiCall(url, client);
    }

    /**
     * get the leagues of a summoner by league id
     * @function leaguesByLeagueId
     * @param {*} apiKey      Riot API key
     * @param {*} region      region of the player
     * @param {*} leagueId    league id
     * @returns {Object}      league data
     */
    async leaguesByLeagueId(apiKey, region, leagueId, client) {
        this.checkRegion(region, client);
        const url = "https://" + region + ".api.riotgames.com/lol/league/v4/leagues/" + leagueId + "?api_key=" + apiKey;
        return await this.apiCall(url, client);
    }

    /**
     * get match by match id
     * @function matchesById
     * @param {*} apiKey      Riot API key
     * @param {*} route       route of the match
     * @param {*} matchId     match id
     * @returns {Object}      match data
     */
    async matchesById(apiKey, route, matchId, client) {
        const url = "https://" + route + ".api.riotgames.com/lol/match/v5/matches/" + matchId + "?api_key=" + apiKey;
        const result = await this.apiCall(url, client);
        if (result === null) {
            logger.error("error while fetching match " + matchId);
        }
        return result;
    }

    /**
     * get match by match id
     * @function matchlistsByAccount
     * @param {*} apiKey      Riot API key
     * @param {*} route       route of the match
     * @param {*} matchId     match id
     * @returns {Object}      match data
     */
    async matchlistsByAccount(apiKey, route, puuid, options, client) {
        const url = "https://" + route + ".api.riotgames.com/lol/match/v5/matches/by-puuid/" + puuid + "/ids" + options + "&api_key=" + apiKey;
        return await this.apiCall(url, client);
    }

    /**
     * get timeline by match id
     * @function timelinesByMatchId
     * @param {*} apiKey      Riot API key
     * @param {*} route       route of the match
     * @param {*} matchId     match id
     * @returns {Object}      timeline data
     */
    async timelinesByMatchId(apiKey, route, matchId, client) {
        const url = "https://" + route + ".api.riotgames.com/lol/match/v5/matches/" + matchId + "/timeline" + "?api_key=" + apiKey;
        return await this.apiCall(url, client);
    }

    /**
    * get champion mastery by summoner id
    * @function championmasteriesBySummoner
    * @param {*} apiKey      Riot API key
    * @param {*} region      region of the player
    * @param {*} summonerId  summoner id
    * @returns {Object}      champion mastery data
    */
    async championmasteriesBySummoner(apiKey, region, summonerId, client) {
        this.checkRegion(region, client);
        const url = "https://" + region + ".api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/" + summonerId + "?api_key=" + apiKey;
        return await this.apiCall(url, client);
    }

    /**
     * Fetch the data from the API
     * @function apiCall
     * @param {*} url     url to fetch
     * @returns {Object}  data from the API
     */
    async apiCall(url, client) {
        try {
            if (config.verbose) {
                logger.log("API CALL: " + url);
            }
            // Fetch Data from provided URL & Options
            const responsefetch = await fetch(url);
            const data = await responsefetch.json();
            let statut = await responsefetch;
            statut = statut.status;
            switch (statut) {
                case 200:
                    client.lol.api_limit = false;
                    return data;
                case 429:
                    // Special Handling here - 429 is Rate Limit Reached.
                    // Alert the User
                    if (config.verbose) {
                        logger.error("Limite d'appel de l'API atteinte.  Mise pause du script et reprise dans 10 secondes.", "429");
                    }
                    client.lol.api_limit = true;
                    // Wait the time specified by the reponse header
                    //await client.
                    await delay(delay_time);
                    // Retry
                    return await this.apiCall(url, client);
                case 404:
                    logger.error("La ressource demandée n'existe pas. " + url, "404");
                    return null;
                case 400:
                    logger.error("La requête est invalide." + url, "400");
                    return null;
                case 403:
                    logger.error("La clé API n'est pas valide." + url, "403");
                    return null;
                case 503:
                    logger.error("Le service est temporairement indisponible. Mise en pause. " + url, "503");
                    await delay(60000);
                    return await this.apiCall(url, client);
                default:
                    logger.error("Erreur inconnue: " + statut + " " + url);
                    if (data) {
                        return data;
                    }
                    return null;
            }
        } catch (error) {
            // catch Invalid JSON
            if (error.type === 'invalid-json') {
                throw error;
            }
            logger.error(error.name + " : " + url);
            console.log(error);
            await delay(1000);
            return await this.apiCall(url, client);
        }
    }

    /**
    * get champion stats
    * @function championStaticData
    * @param {*} apiKey    Riot API key
    * @param {*} language  language of the data
    * @param {*} patch     patch version
    * @returns {Object}    champion stats
    */
    async championStaticData(apiKey, language, patch, client) {
        // If language isn't Set - Default to English
        if (language === "") {
            language = "en_US";
        }

        try {
            const url = "https://ddragon.leagueoflegends.com/cdn/" + patch + "/data/" + language + "/champion.json" + "?api_key=" + apiKey;
            //Logger.log(url)
            return this.apiCall(url, client);
        } catch (error) {
            logger.error(error);
        }

        try {
            const url = "https://ddragon.leagueoflegends.com/cdn/10.9.1/data/" + language + "/champion.json" + "?api_key=" + apiKey;
            return await this.apiCall(url, client);
        } catch (error) {
            logger.error(error);
        }
    }

    /**
    * get champion list
    * @function championList
    * @param {*} region    region of the server
    * @param {*} language  language of the data
    * @returns {Object}    champion list
    */
    async championList(api_key, region, language, client) {

        // Get New Champion List from Data Dragon
        const patch = await this.getCurrentPatch(region, client);
        const championList = await this.championStaticData(api_key, language, patch['v'], client);

        //Logger.log(championList['data'])

        // Champions Array
        const champions = [];

        // Add Champion Names & IDs to the array
        for (const champion in championList['data']) {
            champions[championList['data'][champion]['key']] = championList['data'][champion]['name'];
        }

        return champions;
    }

    /**
    * Check region validity
    * @function checkRegion
    * @param {*} region    region of the server
    * @param {*} client    discord client
    * @returns {Boolean}   true if region is valid
    * @throws {Error}      if region is invalid
    */
    checkRegion(region, client) {
        // Check if region is valid
        if (client.lol.route[region] !== undefined) {
            return true;
        }
        throw new Error("Invalid Region");

    }
}

module.exports = {
    LolApi
};