const config = require('../config.json');

module.exports = {
    name: 'lol_cleaner',
    group: 'lol',
    onsetup: true,
    timer: 86400000,
    description: "Clean up matchs older than 1 year",
    async run(client) {
        const timestamp = Date.now();
        const timestamp1 = timestamp - 31536000000;
        const timestamp2 = timestamp - 15768000000;
        // clean matchs older than 1 year
        await client.pg.query("DELETE FROM matchs WHERE timestamp < $1", [timestamp1]);
        // clean summoners without matchs since 6 months
        await client.pg.query("DELETE FROM summoners WHERE discordid in (SELECT DISTINCT discordid FROM summoners EXCEPT SELECT discordid FROM matchs, summoners WHERE matchs.player = summoners.puuid AND timestamp > $1 GROUP BY summoners.discordid)", [timestamp2]);
        if (config.verbose) {
            console.log("lol cleaner done");
        }
    }
};