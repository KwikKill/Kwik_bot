const lolapi = require('../util/lol_api');
const { describe, it, expect, beforeEach } = require('@jest/globals');

describe('getChampsId', () => {
    let client;

    beforeEach(() => {
        client = {
            'lol': {
                "api_limit": false
            }
        }; // mock client object
    });

    it('should return an object with champion names as keys and IDs as values', async () => {
        const champs = await lolapi.getChampsId('NA1', client);
        expect(champs).toHaveProperty('Aatrox', 'Aatrox');
        expect(champs).toHaveProperty('Ahri', 'Ahri');
        expect(champs).toHaveProperty('Zyra', 'Zyra');
        expect(champs).toHaveProperty('Swain', 'Swain');
        expect(champs).toHaveProperty('Renata Glasc', 'Renata');
    });

    it('should throw an error when given an invalid region', async () => {
        await expect(lolapi.getChampsId('invalid', client)).rejects.toThrow();
    });

    it('should throw an error when the API call fails', async () => {
        const error = new Error('API call failed');
        lolapi.apiCall = jest.fn().mockRejectedValue(error);
        await expect(lolapi.getChampsId('NA1', client)).rejects.toThrow(error);
    });

    it('should throw an error when the API call fails', async () => {
        const error = new Error('API call failed');
        lolapi.apiCall = jest.fn().mockRejectedValue(error);
        await expect(lolapi.getChampsId('NA1', client)).rejects.toThrow(error);
    });
});

describe('summonersByName', () => {
    let client;

    beforeEach(() => {
        client = {
            'lol': {
                "api_limit": false
            }
        }; // mock client object
    });

    it('should return a summoner object when given valid input', async () => {
        const summoner = await lolapi.summonersByName(process.env.RIOT_API_KEY, 'EUW1', 'KwikKill', client);
        console.log(summoner);
        expect(summoner).toHaveProperty('id');
        expect(summoner).toHaveProperty('accountId');
        expect(summoner).toHaveProperty('puuid');
        expect(summoner).toHaveProperty('name', 'SummonerName');
        expect(summoner).toHaveProperty('profileIconId');
        expect(summoner).toHaveProperty('revisionDate');
        expect(summoner).toHaveProperty('summonerLevel');
    });

    it('should throw an error when given an invalid region', async () => {
        await expect(lolapi.summonersByName(process.env.RIOT_API_KEY, 'invalid', 'SummonerName', client)).rejects.toThrow();
    });

    it('should throw an error when the API call fails', async () => {
        const error = new Error('API call failed');
        lolapi.apiCall = jest.fn().mockRejectedValue(error);
        await expect(lolapi.summonersByName(process.env.RIOT_API_KEY, 'EUW1', 'KwikKill', client)).rejects.toThrow(error);
    });
});