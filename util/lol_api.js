const logger = require('./logger.js');
const axios = require('axios');

const delay = ms => new Promise(res => setTimeout(res, ms));

class LolApi {
    rate_limits = {};

    /**
     * Get the current patch version
     * @function getCurrentPatch
     * @param {*} region   region of the player
     * @returns {Boolean}  return the current patch version
     */
    async getCurrentPatch(region, client) {
        let region_short = region;
        // Region Correction
        switch (region) {
            // These regions just need thier numbers removed
            case "NA1": case "EUW1": case "TR1": case "BR1": case "JP1":
                region_short = region.slice(0, -1).toLowerCase();
                break;
            case "RU":
                region_short = "ru";
                break;
            case "KR":
                region_short = "kr";
                break;
            case "EUN1":
                region_short = "eune";
                break;
            case "OC1":
                region_short = "oce";
                break;
            case "LA1":
                region_short = "lan";
                break;
            case "LA2":
                region_short = "las";
                break;
        }

        const url = "https://ddragon.leagueoflegends.com/realms/" + region_short + ".json";
        return await this.apiCall(url, client, client.lol.reverse_routes[region]);
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
        return await this.apiCall(url, client, client.lol.reverse_routes[region]);
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
        return await this.apiCall(url, client, client.lol.reverse_routes[region]);
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
        return await this.apiCall(url, client, client.lol.reverse_routes[region]);
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
        return await this.apiCall(url, client, client.lol.reverse_routes[region]);
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
        return await this.apiCall(url, client, client.lol.reverse_routes[region]);
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
        return await this.apiCall(url, client, client.lol.reverse_routes[region]);
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
        return await this.apiCall(url, client, client.lol.reverse_routes[region]);
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
        return await this.apiCall(url, client, client.lol.reverse_routes[region]);
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
        return await this.apiCall(url, client, client.lol.reverse_routes[region]);
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
        return await this.apiCall(url, client, client.lol.reverse_routes[region]);
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
        this.checkRoute(route, client);
        const url = "https://" + route + ".api.riotgames.com/lol/match/v5/matches/" + matchId + "?api_key=" + apiKey;
        const result = await this.apiCall(url, client, route);
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
        this.checkRoute(route, client);
        const url = "https://" + route + ".api.riotgames.com/lol/match/v5/matches/by-puuid/" + puuid + "/ids" + options + "&api_key=" + apiKey;
        return await this.apiCall(url, client, route);
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
        this.checkRoute(route, client);
        const url = "https://" + route + ".api.riotgames.com/lol/match/v5/matches/" + matchId + "/timeline" + "?api_key=" + apiKey;
        return await this.apiCall(url, client, route);
    }

    /**
    * get champion mastery by summoner id
    * @function championmasteriesBySummoner
    * @param {*} apiKey      Riot API key
    * @param {*} region      region of the player
    * @param {*} summonerId  summoner id
    * @returns {Object}      champion mastery data
    */
    async championmasteriesBySummoner(apiKey, region, puuid, client) {
        this.checkRegion(region, client);
        const url = "https://" + region + ".api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/" + puuid + "?api_key=" + apiKey;
        return await this.apiCall(url, client);
    }

    /**
     * Fetch the data from the API
     * @function apiCall
     * @param {*} url     url to fetch
     * @returns {Object}  data from the API
     */
    async apiCall(url, client, route=undefined) {
        if (route !== undefined) {
            // If there is a rate limit, wait for the delay
            if (this.rate_limits[route] !== undefined && this.rate_limits[route] > 0) {
                if (process.env.VERBOSE === "true") {
                    logger.log("DELAYING (ratelimit): " + url);
                }
                await delay(this.rate_limits[route]);
            }
        }
        try {
            if (process.env.VERBOSE === "true") {
                logger.log("API CALL: " + url);
            }
            // Fetch Data from provided URL & Options
            const responsefetch = await axios.get(url);
            const data = responsefetch.data;
            if (route && client.lol.services[route] !== undefined) {
                client.lol.services[route].api_limit = false;
            }
            return data;
        } catch (error) {
            if (error.response?.status === 429) {
                const delay_time = error.response.headers['Retry-After'] * 1000;
                // Save the rate limit
                this.rate_limits[route] = delay_time;

                // Special Handling here - 429 is Rate Limit Reached.
                if (process.env.VERBOSE === "true") {
                    logger.error("API call limit reached. Pausing the script and resuming in 10 seconds.", "429");
                }
                if (route && client.lol.services[route] !== undefined) {
                    client.lol.services[route].api_limit = true;
                    client.lol.services[route].nb_rate_limit += 1;
                }
                await delay(delay_time);
                this.rate_limits[route] = 0;
                // Retry
                return await this.apiCall(url, client, route);
            } else if (error.response?.status === 404) {
                logger.error("Ressource not found. " + url, "404");
                return null;
            } else if (error.response?.status === 400) {
                logger.error("The request is invalid." + url, "400");
                return null;
            } else if (error.response?.status === 403) {
                logger.error("Invalid API key." + url, "403");
                return null;
            } else if (error.response?.status === 503) {
                logger.error("The service is temporarily unavailable. Pausing. " + url, "503");
                await delay(60000);
                return await this.apiCall(url, client);
            } else if (error.response?.status !== undefined) {
                logger.error("Unknown error: " + error.response?.status + " " + url);
                return null;
            }
            // catch Invalid JSON
            if (error.type === 'invalid-json') {
                throw error;
            }
            logger.error(error.name + ", " + error.code + " : " + url);
            //console.log(error);
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
            logger.log(url);
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
    * get champion list from https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json
    * @function championList
    * @param {*} region    region of the server
    * @param {*} language  language of the data
    * @returns {Object}    champion list
    */
    async championList() {
        try {
            // Get New Champion List from Data Dragon
            const championList = await axios.get("https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json");

            // Champions Array
            const champions = [];

            // Add Champion Names & IDs to the array
            for (const champion in championList["data"]) {
                if (championList["data"][champion]['id'] === -1) {
                    continue;
                }
                champions[championList["data"][champion]['id']] = championList["data"][champion]['name'];
            }

            return champions;
        } catch (error) {
            logger.error(error);
            return [];
        }
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
        if (client.lol.reverse_routes[region] !== undefined) {
            return true;
        }
        throw new Error("Invalid Region");

    }

    /**
    * Check route validity
    * @function checkRoute
    * @param {*} route    route of the server
    * @param {*} client    discord client
    * @returns {Boolean}   true if route is valid
    * @throws {Error}      if route is invalid
    */
    checkRoute(route, client) {
        // Check if region is valid
        if (client.lol.routes[route] !== undefined) {
            return true;
        }
        throw new Error("Invalid Route");

    }

    /**
     * Get account by puuid
     * @function account_by_puuid
     * @param {*} api_key   Riot API key
     * @param {*} puuid     puuid of the player
     * @returns {Object}    account data
     */
    account_by_puuid(api_key, puuid, client) {
        const url = "https://europe.api.riotgames.com/riot/account/v1/accounts/by-puuid/" + puuid + "?api_key=" + api_key;
        return this.apiCall(url, client, "europe");
    }

    /**
     * Get account by riot id
     * @function account_by_riotid
     * @param {*} api_key   Riot API key
     * @param {*} gamename  gamename of the player
     * @param {*} tagline   tagline of the player
     * @returns {Object}    account data
     */
    account_by_riotid(api_key, gamename, tagline, client, route) {
        const url = "https://" + route + ".api.riotgames.com/riot/account/v1/accounts/by-riot-id/" + gamename + "/" + tagline + "?api_key=" + api_key;
        return this.apiCall(url, client, route);
    }
}

module.exports = {
    LolApi
};