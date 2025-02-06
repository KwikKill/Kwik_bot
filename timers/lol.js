const logger = require('../util/logger');

module.exports = {
    name: 'lol',
    group: 'lol',
    onsetup: true,
    timer: 150000, // 2.5 minutes
    description: "Fetch des utilisateurs",
    async run(client) {
        await client.channels.cache.get("1100720550923489280").send("- lol timer started at " + new Date().toLocaleString());
        await client.commands.get("adminlol").update(client);
        if (process.env.VERBOSE === "true") {
            logger.log("lol timer done");
        }
    }
};