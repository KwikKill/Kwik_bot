const config = require('../config.json');

module.exports = {
    name: 'lol',
    group: 'lol',
    onsetup: false,
    timer: 86400000,
    description: "Fetch des utilisateurs toutes les heures",
    async run(client) {
        let timestamp = Date.now();
        timestamp = timestamp - 31536000000;
        await client.pg.query("DELETE FROM matchs WHERE timestamp < $1", [timestamp]);
        if (config.verbose) {
            console.log("lol cleaner done");
        }
    }
};