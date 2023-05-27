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
        }
    }
};

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
        const summoner = await lolapi.summonersByName(api_key, 'EUW1', 'KwikKill', client);
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
        await expect(lolapi.summonersByName(api_key, 'EUW1', 'KwikKill', client)).rejects.toThrow(error);
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
        expect(challenge).toHaveProperty('percentiles');
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
        expect(challengeConfig).toHaveProperty('gameModeToConfig');
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
        expect(challenge).toHaveProperty('percentiles');
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