const config = require('../config.json');

module.exports = {
    name: 'lol',
    group: 'lol',
    onsetup: true,
    timer: 300000,
    description: "Fetch des utilisateurs toutes les heures",
    async run(client) {
        await client.channels.cache.get("1100720550923489280").send("- lol timer started at " + new Date().toLocaleString());
        if (client.lol.running) {
            await client.channels.cache.get("1100720550923489280").send("[Rank Up] skipped update, already running");
            console.log("[Rank Up] skipped update, already running");
            return;
        }
        await client.commands.get("adminlol").update(client);
        if (config.verbose) {
            console.log("lol timer done");
        }
    }
};