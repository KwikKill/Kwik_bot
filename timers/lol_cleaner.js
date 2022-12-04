const config = require('../config.json');

module.exports = {
    name: 'lol_cleaner',
    group: 'lol',
    onsetup: false,
    timer: 86400000,
    description: "Clean up matchs older than 1 year",
    async run(client) {
        let timestamp = Date.now();
        timestamp = timestamp - 31536000000;
        await client.pg.query("DELETE FROM matchs WHERE timestamp < $1", [timestamp]);
        if (config.verbose) {
            console.log("lol cleaner done");
        }
    }
};