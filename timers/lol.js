module.exports = {
    name: 'lol',
    group: 'lol',
    onsetup: true,
    timer: 300000,
    description: "Fetch des utilisateurs toutes les heures",
    async run(client) {
        await client.channels.cache.get("1100720550923489280").send("- lol timer started at " + new Date().toLocaleString());
        await client.commands.get("adminlol").update(client);
        if (process.env.VERBOSE === "true") {
            console.log("lol timer done");
        }
    }
};