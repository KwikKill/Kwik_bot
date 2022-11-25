const pg = require('pg');
const packageJSON = require("../package.json");

module.exports = {
    name: 'ready',
    group: 'core',
    description: "listener de gestion de message",
    type: "ready",
    place: "guild",
    options: undefined,
    async run(client) {

        const discordJSVersion = packageJSON.dependencies["discord.js"];

        console.log(discordJSVersion);
        console.log('Le bot est démarré !');
        client.user.setActivity("[insert savun twomp]", { type: 'LISTENING' });

        const pgclient = new pg.Client({
            user: 'postgres',
            host: 'localhost',
            database: 'lol_database',
            password: '.',
            port: 5432,
        });
        pgclient.connect(function (err) {
            if (err) { throw err; }
            client.pg = pgclient;
            console.log("Connected!");
        });

        /*
        client.champions = []
        champions = await client.championList(region, language);

        for(var x of champions) {
            if(x != undefined) {
                client.champions.push(x)

            }
        }
        */


        client.timers.forEach(timer => {
            if (timer.onsetup) {
                timer.run(client);
            }
            setInterval(timer.run, timer.timer, client);
        });

        await client.commands.get("deploy").auto_deploy(client);

        client.lol();
    }
};