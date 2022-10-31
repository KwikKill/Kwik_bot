const fetch = require('node-fetch');
const config = require('../config.json');

const delay_time = 10000;
const delay = ms => new Promise(res => setTimeout(res, ms));

module.exports = {
    /**
     * Get the current patch version
     * @function getCurrentPatch
     * @param {*} region   region of the player
     * @returns {Boolean}  return the current patch version
     */
    async getCurrentPatch(region) {
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
        return await this.apiCall(url);
    },

    /**
     * Get the summoner data from the API by name
     * @function summonersByName
     * @param {*} apiKey        Riot API key
     * @param {*} region        region of the player
     * @param {*} summonerName  name of the summoner
     * @returns {Object}        summoner's data
     */
    async summonersByName(apiKey, region, summonerName) {
        const url = "https://" + region + ".api.riotgames.com/lol/summoner/v4/summoners/by-name/" + summonerName + "?api_key=" + apiKey;
        return await this.apiCall(url);
    },

    /**
     * Get Challenge data from the API
     * @function challenge
     * @param {*} apiKey   Riot API key
     * @param {*} region   region of the player
     * @returns {Object}   Challenge's data
     */
    async challenge(apiKey, region) {
        const url = "https://" + region + ".api.riotgames.com/lol/challenges/v1/challenges/percentiles?api_key=" + apiKey;
        return await this.apiCall(url);
    },

    /**
     * Get ChallengeConfig data from the API
     * @function challenge
     * @param {*} apiKey   Riot API key
     * @param {*} region   region of the player
     * @returns {Object}   ChallengeConfig
     */
    async challengeconfig(apiKey, region) {
        const url = "https://" + region + ".api.riotgames.com/lol/challenges/v1/challenges/config?api_key=" + apiKey;
        return await this.apiCall(url);
    },

    /**
     * Get Challenge data of a player by puuid from the API
     * @function challengebypuuid
     * @param {*} apiKey   Riot API key
     * @param {*} region   region of the player
     * @param {*} puuid    puuid of the player
     * @returns {Object}   Challenge data of the player
     */
    async challengebypuuid(apiKey, region, puuid) {
        const url = "https://" + region + ".api.riotgames.com/lol/challenges/v1/player-data/" + puuid + "?api_key=" + apiKey;
        return await this.apiCall(url);
    },

    /**
     * get the leagues of a summoner by summoner id
     * @function leaguesBySummoner
     * @param {*} apiKey      Riot API key
     * @param {*} region      region of the player
     * @param {*} summonerId  summoner id of the player
     * @returns {Object}      leagues of the player
     */
    async leaguesBySummoner(apiKey, region, summonerId) {
        const url = "https://" + region + ".api.riotgames.com/lol/league/v4/entries/by-summoner/" + summonerId + "?api_key=" + apiKey;
        return await this.apiCall(url);
    },

    /**
     * get challenger league
     * @function challengerLeagues
     * @param {*} apiKey      Riot API key
     * @param {*} region      region of the player
     * @param {*} queue       queue of the league
     * @returns {Object}      challenger league
     */
    async challengerLeagues(apiKey, region, queue) {
        const url = "https://" + region + ".api.riotgames.com/lol/league/v4/challengerleagues/by-queue/" + queue + "?api_key=" + apiKey;
        return await this.apiCall(url);
    },

    /**
     * get grandmaster league
     * @function grandmasterLeagues
     * @param {*} apiKey      Riot API key
     * @param {*} region      region of the player
     * @param {*} queue       queue of the league
     * @returns {Object}      grandmaster league
     */
    async grandmasterLeagues(apiKey, region, queue) {
        const url = "https://" + region + ".api.riotgames.com/lol/league/v4/grandmasterleagues/by-queue/" + queue + "?api_key=" + apiKey;
        return await this.apiCall(url);
    },

    /**
     * get master league
     * @function masterLeagues
     * @param {*} apiKey      Riot API key
     * @param {*} region      region of the player
     * @param {*} queue       queue of the league
     * @returns {Object}      master league
     */
    async masterLeagues(apiKey, region, queue) {
        const url = "https://" + region + ".api.riotgames.com/lol/league/v4/masterleagues/by-queue/" + queue + "?api_key=" + apiKey;
        return await this.apiCall(url);
    },

    /**
     * get the leagues of a summoner by league id
     * @function leaguesByLeagueId
     * @param {*} apiKey      Riot API key
     * @param {*} region      region of the player
     * @param {*} leagueId    league id
     * @returns {Object}      league data
     */
    async leaguesByLeagueId(apiKey, region, leagueId) {
        const url = "https://" + region + ".api.riotgames.com/lol/league/v4/leagues/" + leagueId + "?api_key=" + apiKey;
        return await this.apiCall(url);
    },

    /**
     * get match by match id
     * @function matchesById
     * @param {*} apiKey      Riot API key
     * @param {*} route       route of the match
     * @param {*} matchId     match id
     * @returns {Object}      match data
     */
    async matchesById(apiKey, route, matchId) {
        const url = "https://" + route + ".api.riotgames.com/lol/match/v5/matches/" + matchId + "?api_key=" + apiKey;
        return await this.apiCall(url);
    },

    /**
     * get match by match id
     * @function matchlistsByAccount
     * @param {*} apiKey      Riot API key
     * @param {*} route       route of the match
     * @param {*} matchId     match id
     * @returns {Object}      match data
     */
    async matchlistsByAccount(apiKey, route, puuid, options) {
        const url = "https://" + route + ".api.riotgames.com/lol/match/v5/matches/by-puuid/" + puuid + "/ids" + options + "&api_key=" + apiKey;
        return await this.apiCall(url);
    },

    /**
     * get timeline by match id
     * @function timelinesByMatchId
     * @param {*} apiKey      Riot API key
     * @param {*} route       route of the match
     * @param {*} matchId     match id
     * @returns {Object}      timeline data
     */
    async timelinesByMatchId(apiKey, route, matchId) {
        const url = "https://" + route + ".api.riotgames.com/lol/match/v5/matches/" + matchId + "/timeline" + "?api_key=" + apiKey;
        return await this.apiCall(url);
    },

    /**
    * get champion mastery by summoner id
    * @function championmasteriesBySummoner
    * @param {*} apiKey      Riot API key
    * @param {*} region      region of the player
    * @param {*} summonerId  summoner id
    * @returns {Object}      champion mastery data
    */
    async championmasteriesBySummoner(apiKey, region, summonerId) {
        const url = "https://" + region + ".api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/" + summonerId + "?api_key=" + apiKey;
        return await this.apiCall(url);
    },

    /**
     * Fetch the data from the API
     * @function apiCall
     * @param {*} url     url to fetch
     * @returns {Object}  data from the API
     */
    async apiCall(url) {
        if (config.verbose) {
            console.log("API CALL: " + url);
        }
        // Fetch Data from provided URL & Options
        const responsefetch = await fetch(url);
        const data = await responsefetch.json();
        let statut = await responsefetch;
        statut = statut.status;
        switch (statut) {
            case 200:
                return data;
            case 429:
                // Special Handling here - 429 is Rate Limit Reached.
                // Alert the User
                if (config.verbose) {
                    console.log("429: Limite d'appel de l'API atteinte.  Mise pause du script et reprise dans 10 secondes.");
                }
                // Wait the time specified by the reponse header
                //await client.
                await delay(delay_time);
                // Retry
                return await this.apiCall(url);
            case 404:
                console.warn("404: La ressource demandée n'existe pas.", url);
                return null;
            case 400:
                console.warn("400: La requête est invalide.", url);
                return null;
        }
        return data;

    },

    /**
    * get champion stats
    * @function championStaticData
    * @param {*} apiKey    Riot API key
    * @param {*} language  language of the data
    * @param {*} patch     patch version
    * @returns {Object}    champion stats
    */
    async championStaticData(apiKey, language, patch) {
        // If language isn't Set - Default to English
        if (language === "") {
            language = "en_US";
        }

        try {
            const url = "https://ddragon.leagueoflegends.com/cdn/" + patch + "/data/" + language + "/champion.json" + "?api_key=" + apiKey;
            //Logger.log(url)
            return this.apiCall(url);
        } catch (error) {
            console.warn(error);
        }

        try {
            const url = "https://ddragon.leagueoflegends.com/cdn/10.9.1/data/" + language + "/champion.json" + "?api_key=" + apiKey;
            return await this.apiCall(url);
        } catch (error) {
            console.warn(error);
        }
    },

    /**
    * get champion list
    * @function championList
    * @param {*} region    region of the server
    * @param {*} language  language of the data
    * @returns {Object}    champion list
    */
    async championList(api_key, region, language) {

        // Get New Champion List from Data Dragon
        const patch = await this.getCurrentPatch(region);
        const championList = await this.championStaticData(api_key, language, patch['v']);

        //Logger.log(championList['data'])

        // Champions Array
        const champions = [];

        // Add Champion Names & IDs to the array
        for (const champion in championList['data']) {
            champions[championList['data'][champion]['key']] = championList['data'][champion]['name'];
        }

        return champions;
    }
};