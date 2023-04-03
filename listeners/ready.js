const pg = require('pg');
const packageJSON = require("../package.json");
const logger = require('../util/logger');

module.exports = {
    name: 'ready',
    group: 'core',
    description: "listener de gestion de message",
    type: "ready",
    place: "guild",
    options: undefined,
    async run(client) {

        const discordJSVersion = packageJSON.dependencies["discord.js"];

        logger.log(`Logged in as ${client.user.tag}! Discord.js version: ${discordJSVersion}`);
        client.user.setActivity("with your lol stats", { type: 'PLAYING' });

        const pgclient = new pg.Client({
            user: 'postgres',
            host: 'localhost',
            database: 'lol_database',
            password: process.env.PSQL,
            port: 5432,
        });
        pgclient.connect(function (err) {
            if (err) { throw err; }
            client.pg = pgclient;
            logger.log("Database Connected!");
            client.timers.forEach(timer => {
                if (timer.onsetup) {
                    timer.run(client);
                }
                setInterval(timer.run, timer.timer, client);
            });
            client.pg.query("SELECT * FROM trackers").then(trackers => {
                trackers.rows.forEach(tracker => {
                    client.trackers.push(tracker.channelid);
                });
            });
        });

        await client.commands.get("deploy").auto_deploy(client);
    }
};