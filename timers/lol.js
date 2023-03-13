const config = require('../config.json');

module.exports = {
    name: 'lol',
    group: 'lol',
    onsetup: true,
    timer: 300000,
    description: "Fetch des utilisateurs toutes les heures",
    async run(client) {
        if (client.running) {
            console.log("[Rank Up] skipped update, already running");
            return;
        }
        await client.commands.get("adminlol").update(client);
        if (config.verbose) {
            console.log("lol timer done");
        }
    }
};