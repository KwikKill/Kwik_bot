const pg = require('pg');
//const packageJSON = require("../package.json");
const logger = require('../util/logger');
const { ActivityType } = require('discord.js');

module.exports = {
    name: 'ready',
    group: 'core',
    description: "listener de gestion de message",
    type: "ready",
    place: "guild",
    options: undefined,
    async run(client) {

        //const discordJSVersion = packageJSON.dependencies["discord.js"];

        logger.log(`Logged in as ${client.user.tag}! Discord.js version: ${require('discord.js').version}`);
        client.user.setActivity("with your lol stats", { type: ActivityType.Playing });

        const pgclient = new pg.Client({
            user: process.env.POSTGRES_USER,
            host: 'db',
            database: process.env.DATABASE,
            password: process.env.POSTGRES_PASSWORD,
            port: 5432,
        });
        //await client.commands.get("deploy").auto_deploy(client);
        pgclient.connect(async function (err) {
            if (err) { throw err; }
            client.pg = pgclient;
            logger.log("Database Connected!");
            await client.lol.lol_rank_manager.setup(client);
            client.timers.forEach(timer => {
                if (timer.onsetup) {
                    timer.run(client);
                }
                setInterval(timer.run, timer.timer, client);
            });
            client.pg.query("SELECT * FROM trackers").then(trackers => {
                trackers.rows.forEach(tracker => {
                    client.lol.lol_rank_manager.trackers.push(tracker.channelid);
                });
            });
        });
    }
};