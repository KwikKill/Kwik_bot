const logger = require("./logger.js");
const { LolApi } = require("./lol_api.js");
const { LolRankManager } = require("./lol_rank_manager.js");

module.exports = {
    lol_api: new LolApi(),
    lol_rank_manager: new LolRankManager(),

    RANKED_FLEX: 440,
    RANKED_SOLO: 420,
    region_to_name: {
        "EUW1": "euw",
        "NA1": "na",
        "KR": "kr",
        "EUN1": "eune",
        "BR1": "br",
        "JP1": "jp",
        "LA1": "lan",
        "LA2": "las",
        "OC1": "oce",
        "TR1": "tr",
        "RU": "ru"
    },
    routes: {
        "EUROPE": ["EUW1", "EUN1", "TR1", "RU"],
        "AMERICAS": ["NA1", "BR1", "LA1", "LA2"],
        "ASIA": ["KR", "JP1"],
        "SEA": ["OC1"]
    },
    reverse_routes: {
        "EUW1": "EUROPE",
        "EUN1": "EUROPE",
        "TR1": "EUROPE",
        "RU": "EUROPE",
        "NA1": "AMERICAS",
        "BR1": "AMERICAS",
        "LA1": "AMERICAS",
        "LA2": "AMERICAS",
        "KR": "ASIA",
        "JP1": "ASIA",
        "OC1": "SEA"
    },

    max_games: 100,
    champions: [],
    language: "en_US", // Players Language - Only Used for Champion Names

    apiKey: process.env.RIOT_API_KEY,
    client: {},

    scores: {},
    score_timestamp: 0,

    guild_mute_for_player: {},
    player_mute_for_guild: {},

    /**
     * setup champion list
     * /!\ client.pg is not set up yet, database interaction should be written in @update_data function
     * @function setup
     * @param {*} client discord client
     */
    async setup(client) {
        this.client = client;
        this.champions = [];
        const list = await this.lol_api.championList();
        if (list.length === 0) {
            throw new Error("Error while fetching champion list");
        }
        this.champions = list;
        this.client.champions = [];
        for (let i = 0; i < list.length; i++) {
            if (list[i] !== undefined) {
                this.client.champions.push(list[i]);
            }
        }
        this.client.champions.sort();
    },

    async update_data() {
        // load mute lists
        const response = await this.client.pg.query("SELECT * FROM guild_muted;");
        for (const x of response.rows) {
            const player = x.discordid;
            const guildid = x.guildid;
            
            if (this.guild_mute_for_player[player] === undefined) {
                this.guild_mute_for_player[player] = [];
            }
            this.guild_mute_for_player[player].push(guildid);
        }

        const response2 = await this.client.pg.query("SELECT * FROM player_muted;");
        for (const x of response2.rows) {
            const guild = x.guildid;
            const player = x.discordid;

            if (this.player_mute_for_guild[guild] === undefined) {
                this.player_mute_for_guild[guild] = [];
            }
            this.player_mute_for_guild[guild].push(player);
        }
    },

};