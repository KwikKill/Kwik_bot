/* eslint-disable no-undef */
const { LolApi } = require('../util/lol_api');
const { describe, it, expect, beforeEach } = require('@jest/globals');

const api_key = process.env.RIOT_API_KEY;
const client_preset = {
    'lol': {
        "api_limit": false,
        "route": {
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
        "routes": [
            "EUROPE",
            "AMERICAS",
            "ASIA",
            "SEA"
        ],
    }
};
let matchId = null;

describe('getChampsId', () => {
    let client;

    beforeEach(() => {
        client = client_preset; // mock client object
    });

    it('should return an object with champion names as keys and IDs as values', async () => {
        const lolapi = new LolApi();
        const champs = await lolapi.getChampsId('NA1', client);
        expect(champs).toHaveProperty('Aatrox', 'Aatrox');
        expect(champs).toHaveProperty('Ahri', 'Ahri');
        expect(champs).toHaveProperty('Zyra', 'Zyra');
        expect(champs).toHaveProperty('Swain', 'Swain');
        expect(champs).toHaveProperty('Renata Glasc', 'Renata');
    });

    it('should throw an error when given an invalid region', async () => {
        const lolapi = new LolApi();
        await expect(lolapi.getChampsId('invalid', client)).rejects.toThrow();
    });

    it('should throw an error when the API call fails', async () => {
        const lolapi = new LolApi();
        const error = new Error('API call failed');
        lolapi.apiCall = jest.fn().mockRejectedValue(error);
        await expect(lolapi.getChampsId('NA1', client)).rejects.toThrow(error);
    });

});

describe('summonersByName', () => {
    let client;

    beforeEach(() => {
        client = client_preset; // mock client object
    });

    it('should return a summoner object when given valid input', async () => {
        const lolapi = new LolApi();
        const summoner = await lolapi.summonersByName(api_key, 'EUW1', 'KwikKill#Swain', client);
        expect(summoner).toHaveProperty('id');
        expect(summoner).toHaveProperty('accountId');
        expect(summoner).toHaveProperty('puuid');
        expect(summoner).toHaveProperty('name', 'KwikKill');
        expect(summoner).toHaveProperty('profileIconId');
        expect(summoner).toHaveProperty('revisionDate');
        expect(summoner).toHaveProperty('summonerLevel');
    });

    it('should throw an error when given an invalid region', async () => {
        const lolapi = new LolApi();
        await expect(lolapi.summonersByName(api_key, 'invalid', 'SummonerName', client)).rejects.toThrow();
    });

    it('should throw an error when the API call fails', async () => {
        const lolapi = new LolApi();
        const error = new Error('API call failed');
        lolapi.apiCall = jest.fn().mockRejectedValue(error);
        await expect(lolapi.summonersByName(api_key, 'EUW1', 'KwikKill#Swain', client)).rejects.toThrow(error);
    });
});

describe('summonerByPuuid', () => {
    let client;

    beforeEach(() => {
        client = client_preset; // mock client object
    });

    it('should return a summoner object when given valid input', async () => {
        const api = new LolApi();
        const summoner = await api.summonerByPuuid(api_key, 'EUW1', '4NrXpmBZPs961u7WfD2_BJ922QBAn8eTgtKKIbpcG1W_wbGIeEwTQfdkAzGb6dBp11JNHhCgWcEaRA', client);
        expect(summoner).toHaveProperty('id');
        expect(summoner).toHaveProperty('accountId');
        expect(summoner).toHaveProperty('puuid', '4NrXpmBZPs961u7WfD2_BJ922QBAn8eTgtKKIbpcG1W_wbGIeEwTQfdkAzGb6dBp11JNHhCgWcEaRA');
        expect(summoner).toHaveProperty('name');
        expect(summoner).toHaveProperty('profileIconId');
        expect(summoner).toHaveProperty('revisionDate');
        expect(summoner).toHaveProperty('summonerLevel');
    });

    it('should throw an error when given an invalid region', async () => {
        const api = new LolApi();
        await expect(api.summonerByPuuid(api_key, '4NrXpmBZPs961u7WfD2_BJ922QBAn8eTgtKKIbpcG1W_wbGIeEwTQfdkAzGb6dBp11JNHhCgWcEaRA', client)).rejects.toThrow();
    });

    it('should throw an error when the API call fails', async () => {
        const api = new LolApi();
        const error = new Error('API call failed');
        api.apiCall = jest.fn().mockRejectedValue(error);
        await expect(api.summonerByPuuid(api_key, 'EUW1', '4NrXpmBZPs961u7WfD2_BJ922QBAn8eTgtKKIbpcG1W_wbGIeEwTQfdkAzGb6dBp11JNHhCgWcEaRA', client)).rejects.toThrow(error);
    });
});

describe('challenge', () => {
    let client;

    beforeEach(() => {
        client = client_preset; // mock client object
    });

    it('should return a challenge object when given valid input', async () => {
        const api = new LolApi();
        const challenge = await api.challenge(api_key, 'EUW1', client);
        // check if challenge is a dictionary
        expect(typeof challenge).toBe('object');
    });

    it('should throw an error when given an invalid region', async () => {
        const api = new LolApi();
        await expect(api.challenge(api_key, 'invalid', client)).rejects.toThrow();
    });

    it('should throw an error when the API call fails', async () => {
        const api = new LolApi();
        const error = new Error('API call failed');
        api.apiCall = jest.fn().mockRejectedValue(error);
        await expect(api.challenge(api_key, 'EUW1', client)).rejects.toThrow(error);
    });
});

describe('challengeconfig', () => {
    let client;

    beforeEach(() => {
        client = client_preset; // mock client object
    });

    it('should return a challenge config object when given valid input', async () => {
        const api = new LolApi();
        const challengeConfig = await api.challengeconfig(api_key, 'EUW1', client);
        expect(challengeConfig).toBeInstanceOf(Array);
        expect(challengeConfig[0]).toHaveProperty('id');
    });

    it('should throw an error when given an invalid region', async () => {
        const api = new LolApi();
        await expect(api.challengeconfig(api_key, 'invalid', client)).rejects.toThrow();
    });

    it('should throw an error when the API call fails', async () => {
        const api = new LolApi();
        const error = new Error('API call failed');
        api.apiCall = jest.fn().mockRejectedValue(error);
        await expect(api.challengeconfig(api_key, 'EUW1', client)).rejects.toThrow(error);
    });
});

describe('challengebypuuid', () => {
    let client;

    beforeEach(() => {
        client = client_preset; // mock client object
    });

    it('should return a challenge object when given valid input', async () => {
        const api = new LolApi();
        const challenge = await api.challengebypuuid(api_key, 'EUW1', '4NrXpmBZPs961u7WfD2_BJ922QBAn8eTgtKKIbpcG1W_wbGIeEwTQfdkAzGb6dBp11JNHhCgWcEaRA', client);
        expect(challenge).toHaveProperty('totalPoints');
    });

    it('should throw an error when given an invalid region', async () => {
        const api = new LolApi();
        await expect(api.challengebypuuid(api_key, 'invalid', '4NrXpmBZPs961u7WfD2_BJ922QBAn8eTgtKKIbpcG1W_wbGIeEwTQfdkAzGb6dBp11JNHhCgWcEaRA', client)).rejects.toThrow();
    });

    it('should throw an error when the API call fails', async () => {
        const api = new LolApi();
        const error = new Error('API call failed');
        api.apiCall = jest.fn().mockRejectedValue(error);
        await expect(api.challengebypuuid(api_key, 'EUW1', '4NrXpmBZPs961u7WfD2_BJ922QBAn8eTgtKKIbpcG1W_wbGIeEwTQfdkAzGb6dBp11JNHhCgWcEaRA', client)).rejects.toThrow(error);
    });
});

describe('leaguesBySummoner', () => {
    let client;

    beforeEach(() => {
        client = client_preset; // mock client object
    });

    it('should return an array of league objects when given valid input', async () => {
        const api = new LolApi();
        const leagues = await api.leaguesBySummoner(api_key, 'EUW1', 'yI0NOe4UFxaxmSIKSROeKLaw51_6fhrc8Fxh0C7q__ii_TJ2', client);
        expect(Array.isArray(leagues)).toBe(true);
        expect(leagues.length).toBeGreaterThan(0);
        expect(leagues[0]).toHaveProperty('queueType');
        expect(leagues[0]).toHaveProperty('tier');
        expect(leagues[0]).toHaveProperty('rank');
        expect(leagues[0]).toHaveProperty('leaguePoints');
        expect(leagues[0]).toHaveProperty('wins');
        expect(leagues[0]).toHaveProperty('losses');
        expect(leagues[0]).toHaveProperty('hotStreak');
        expect(leagues[0]).toHaveProperty('veteran');
        expect(leagues[0]).toHaveProperty('freshBlood');
        expect(leagues[0]).toHaveProperty('inactive');
    });

    it('should throw an error when given an invalid region', async () => {
        const api = new LolApi();
        await expect(api.leaguesBySummoner(api_key, 'invalid', 'yI0NOe4UFxaxmSIKSROeKLaw51_6fhrc8Fxh0C7q__ii_TJ2', client)).rejects.toThrow();
    });

    it('should throw an error when the API call fails', async () => {
        const api = new LolApi();
        const error = new Error('API call failed');
        api.apiCall = jest.fn().mockRejectedValue(error);
        await expect(api.leaguesBySummoner(api_key, 'EUW1', 'yI0NOe4UFxaxmSIKSROeKLaw51_6fhrc8Fxh0C7q__ii_TJ2', client)).rejects.toThrow(error);
    });
});

describe('challengerLeagues', () => {
    let client;

    beforeEach(() => {
        client = client_preset; // mock client object
    });

    it('should return an array of league entries when given valid input', async () => {
        const api = new LolApi();
        const leagues = await api.challengerLeagues(api_key, 'EUW1', 'RANKED_SOLO_5x5', client);
        expect(leagues).toHaveProperty('tier', 'CHALLENGER');
        expect(Array.isArray(leagues["entries"])).toBe(true);
        expect(leagues["entries"].length).toBeGreaterThan(0);
        expect(leagues["entries"][0]).toHaveProperty('summonerId');
        expect(leagues["entries"][0]).toHaveProperty('summonerName');
        expect(leagues["entries"][0]).toHaveProperty('leaguePoints');
        expect(leagues["entries"][0]).toHaveProperty('rank');
        expect(leagues["entries"][0]).toHaveProperty('wins');
        expect(leagues["entries"][0]).toHaveProperty('losses');
        expect(leagues["entries"][0]).toHaveProperty('hotStreak');
        expect(leagues["entries"][0]).toHaveProperty('veteran');
        expect(leagues["entries"][0]).toHaveProperty('freshBlood');
        expect(leagues["entries"][0]).toHaveProperty('inactive');
    });

    it('should throw an error when given an invalid region', async () => {
        const api = new LolApi();
        await expect(api.challengerLeagues(api_key, 'invalid', 'RANKED_SOLO_5x5', client)).rejects.toThrow();
    });

    it('should throw an error when the API call fails', async () => {
        const api = new LolApi();
        const error = new Error('API call failed');
        api.apiCall = jest.fn().mockRejectedValue(error);
        await expect(api.challengerLeagues(api_key, 'EUW1', 'RANKED_SOLO_5x5', client)).rejects.toThrow(error);
    });
});

describe('grandmasterLeagues', () => {
    let client;

    beforeEach(() => {
        client = client_preset; // mock client object
    });

    it('should return an array of league entries when given valid input', async () => {
        const api = new LolApi();
        const leagues = await api.grandmasterLeagues(api_key, 'EUW1', 'RANKED_SOLO_5x5', client);
        expect(leagues).toHaveProperty('tier', 'GRANDMASTER');
        expect(Array.isArray(leagues["entries"])).toBe(true);
        expect(leagues["entries"].length).toBeGreaterThan(0);
        expect(leagues["entries"][0]).toHaveProperty('summonerId');
        expect(leagues["entries"][0]).toHaveProperty('summonerName');
        expect(leagues["entries"][0]).toHaveProperty('leaguePoints');
        expect(leagues["entries"][0]).toHaveProperty('rank');
        expect(leagues["entries"][0]).toHaveProperty('wins');
        expect(leagues["entries"][0]).toHaveProperty('losses');
        expect(leagues["entries"][0]).toHaveProperty('hotStreak');
        expect(leagues["entries"][0]).toHaveProperty('veteran');
        expect(leagues["entries"][0]).toHaveProperty('freshBlood');
        expect(leagues["entries"][0]).toHaveProperty('inactive');
    });

    it('should throw an error when given an invalid region', async () => {
        const api = new LolApi();
        await expect(api.grandmasterLeagues(api_key, 'invalid', 'RANKED_SOLO_5x5', client)).rejects.toThrow();
    });

    it('should throw an error when the API call fails', async () => {
        const api = new LolApi();
        const error = new Error('API call failed');
        api.apiCall = jest.fn().mockRejectedValue(error);
        await expect(api.grandmasterLeagues(api_key, 'EUW1', 'RANKED_SOLO_5x5', client)).rejects.toThrow(error);
    });
});

describe('masterLeagues', () => {
    let client;

    beforeEach(() => {
        client = client_preset; // mock client object
    });

    it('should return an array of league entries when given valid input', async () => {
        const api = new LolApi();
        const leagues = await api.masterLeagues(api_key, 'EUW1', 'RANKED_SOLO_5x5', client);
        expect(leagues).toHaveProperty('tier', 'MASTER');
        expect(Array.isArray(leagues["entries"])).toBe(true);
        expect(leagues["entries"].length).toBeGreaterThan(0);
        expect(leagues["entries"][0]).toHaveProperty('summonerId');
        expect(leagues["entries"][0]).toHaveProperty('summonerName');
        expect(leagues["entries"][0]).toHaveProperty('leaguePoints');
        expect(leagues["entries"][0]).toHaveProperty('rank');
        expect(leagues["entries"][0]).toHaveProperty('wins');
        expect(leagues["entries"][0]).toHaveProperty('losses');
        expect(leagues["entries"][0]).toHaveProperty('hotStreak');
        expect(leagues["entries"][0]).toHaveProperty('veteran');
        expect(leagues["entries"][0]).toHaveProperty('freshBlood');
        expect(leagues["entries"][0]).toHaveProperty('inactive');
    });

    it('should throw an error when given an invalid region', async () => {
        const api = new LolApi();
        await expect(api.masterLeagues(api_key, 'invalid', 'RANKED_SOLO_5x5', client)).rejects.toThrow();
    });

    it('should throw an error when the API call fails', async () => {
        const api = new LolApi();
        const error = new Error('API call failed');
        api.apiCall = jest.fn().mockRejectedValue(error);
        await expect(api.masterLeagues(api_key, 'EUW1', 'RANKED_SOLO_5x5', client)).rejects.toThrow(error);
    });
});

describe('matchlistsByAccount', () => {
    let client;

    beforeEach(() => {
        client = client_preset; // mock client object
    });

    it('should return an array of match IDs when given valid input', async () => {
        const api = new LolApi();
        const matchIds = await api.matchlistsByAccount(api_key, client.lol.route['EUW1'], '4NrXpmBZPs961u7WfD2_BJ922QBAn8eTgtKKIbpcG1W_wbGIeEwTQfdkAzGb6dBp11JNHhCgWcEaRA', '?start=0&count=10', client);
        expect(Array.isArray(matchIds)).toBe(true);
        expect(matchIds.length).toBeGreaterThan(0);
        expect(typeof matchIds[0]).toBe('string');
        matchId = matchIds[0];
    });

    it('should throw an error when given an invalid region', async () => {
        const api = new LolApi();
        await expect(api.matchlistsByAccount(api_key, 'invalid', '4NrXpmBZPs961u7WfD2_BJ922QBAn8eTgtKKIbpcG1W_wbGIeEwTQfdkAzGb6dBp11JNHhCgWcEaRA', '?start=0&count=10', client)).rejects.toThrow();
    });

    it('should throw an error when the API call fails', async () => {
        const api = new LolApi();
        const error = new Error('API call failed');
        api.apiCall = jest.fn().mockRejectedValue(error);
        await expect(api.matchlistsByAccount(api_key, client.lol.route['EUW1'], '4NrXpmBZPs961u7WfD2_BJ922QBAn8eTgtKKIbpcG1W_wbGIeEwTQfdkAzGb6dBp11JNHhCgWcEaRA', '?start=0&count=10', client)).rejects.toThrow(error);
    });
});

describe('matchesById', () => {
    let client;

    beforeEach(() => {
        client = client_preset; // mock client object
    });

    it('should return a match object when given valid input', async () => {
        const api = new LolApi();
        const match = await api.matchesById(api_key, client.lol.route['EUW1'], matchId, client);
        expect(typeof match).toBe('object');
        expect(match).toHaveProperty('metadata');
        expect(match).toHaveProperty('info');
    });

    it('should throw an error when given an invalid region', async () => {
        const api = new LolApi();
        await expect(api.matchesById(api_key, 'invalid', matchId, client)).rejects.toThrow();
    });

    it('should throw an error when the API call fails', async () => {
        const api = new LolApi();
        const error = new Error('API call failed');
        api.apiCall = jest.fn().mockRejectedValue(error);
        await expect(api.matchesById(api_key, client.lol.route['EUW1'], matchId, client)).rejects.toThrow(error);
    });
});

describe('timelinesByMatchId', () => {
    let client;

    beforeEach(() => {
        client = client_preset; // mock client object
    });

    it('should return a timeline object when given valid input', async () => {
        const api = new LolApi();
        const timeline = await api.timelinesByMatchId(api_key, client.lol.route['EUW1'], matchId, client);
        expect(typeof timeline).toBe('object');
        expect(timeline).toHaveProperty('metadata');
        expect(timeline).toHaveProperty('info');
    });

    it('should throw an error when given an invalid region', async () => {
        const api = new LolApi();
        await expect(api.timelinesByMatchId(api_key, 'invalid', matchId, client)).rejects.toThrow();
    });

    it('should throw an error when the API call fails', async () => {
        const api = new LolApi();
        const error = new Error('API call failed');
        api.apiCall = jest.fn().mockRejectedValue(error);
        await expect(api.timelinesByMatchId(api_key, client.lol.route['EUW1'], matchId, client)).rejects.toThrow(error);
    });
});

describe('championmasteriesBySummoner', () => {
    let client;

    beforeEach(() => {
        client = client_preset; // mock client object
    });

    it('should return an array of champion mastery objects when given valid input', async () => {
        const api = new LolApi();
        const championMasteries = await api.championmasteriesBySummoner(api_key, 'EUW1', 'yI0NOe4UFxaxmSIKSROeKLaw51_6fhrc8Fxh0C7q__ii_TJ2', client);
        expect(Array.isArray(championMasteries)).toBe(true);
        expect(championMasteries.length).toBeGreaterThan(0);
        expect(typeof championMasteries[0]).toBe('object');
        expect(championMasteries[0]).toHaveProperty('championId');
        expect(championMasteries[0]).toHaveProperty('championLevel');
        expect(championMasteries[0]).toHaveProperty('championPoints');
    });

    it('should throw an error when given an invalid region', async () => {
        const api = new LolApi();
        await expect(api.championmasteriesBySummoner(api_key, 'invalid', 'yI0NOe4UFxaxmSIKSROeKLaw51_6fhrc8Fxh0C7q__ii_TJ2', client)).rejects.toThrow();
    });

    it('should throw an error when the API call fails', async () => {
        const api = new LolApi();
        const error = new Error('API call failed');
        api.apiCall = jest.fn().mockRejectedValue(error);
        await expect(api.championmasteriesBySummoner(api_key, 'EUW1', 'yI0NOe4UFxaxmSIKSROeKLaw51_6fhrc8Fxh0C7q__ii_TJ2', client)).rejects.toThrow(error);
    });
});

describe('championList', () => {
    let client;

    beforeEach(() => {
        client = client_preset; // mock client object
    });

    it('should return an array of champion names indexed by ID when given valid input', async () => {
        const api = new LolApi();
        const championList = await api.championList(api_key, 'EUW1', 'en_US', client);
        expect(Array.isArray(championList)).toBe(true);
        expect(championList.length).toBeGreaterThan(0);
    });

    it('should throw an error when given an invalid region', async () => {
        const api = new LolApi();
        await expect(api.championList(api_key, 'invalid', 'en_US', client)).rejects.toThrow();
    });

    it('should throw an error when the API call fails', async () => {
        const api = new LolApi();
        const error = new Error('API call failed');
        api.getCurrentPatch = jest.fn().mockRejectedValue(error);
        await expect(api.championList(api_key, 'EUW1', 'en_US', client)).rejects.toThrow(error);
    });
});