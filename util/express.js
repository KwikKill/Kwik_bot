const path = require('path');
const express = require('express');
const fs = require("fs");

// -------------- Express -----------------
module.exports = {
    register
};

function register(client) {
    const app = express();

    app.use(require('body-parser').urlencoded());
    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, '../../KwiKSite/index.html'));
    });

    const indexFiles = fs.readdirSync('../KwiKSite/');
    for (const file of indexFiles) {
        app.get(`/${file.replace(".html", "")}`, function (req, res) {
            res.sendFile(path.join(__dirname, `../../KwiKSite/${file}`));
        });
    }

    const cssFiles = fs.readdirSync('../KwiKSite/css/');
    for (const file of cssFiles) {
        app.get(`/css/${file}`, function (req, res) {
            res.sendFile(path.join(__dirname, `../../KwiKSite/css/${file}`));
        });
    }

    const imagesFiles = fs.readdirSync('../KwiKSite/images/');
    for (const file of imagesFiles) {
        app.get(`/images/${file}`, function (req, res) {
            res.sendFile(path.join(__dirname, `../../KwiKSite/images/${file}`));
        });
    }

    const projetsFiles = fs.readdirSync('../KwiKSite/projects/');
    for (const file of projetsFiles) {
        app.get(`/projects/${file.replace(".html", "")}`, function (req, res) {
            res.sendFile(path.join(__dirname, `../../KwiKSite/projects/${file}`));
        });
    }


    const postsFiles = fs.readdirSync('../KwiKSite/posts/');
    for (const file of postsFiles) {
        app.get(`/posts/${file.replace(".html", "")}`, function (req, res) {
            res.sendFile(path.join(__dirname, `../../KwiKSite/posts/${file}`));
        });
    }

    const jsFiles = fs.readdirSync('../KwiKSite/js/');
    for (const file of jsFiles) {
        app.get(`/js/${file}`, function (req, res) {
            res.sendFile(path.join(__dirname, `../../KwiKSite/js/${file}`));
        });
    }

    const lolFiles = fs.readdirSync('../KwiKSite/lol/');
    for (const file of lolFiles) {
        app.get(`/lol/${file.replace(".html", "")}`, function (req, res) {
            res.sendFile(path.join(__dirname, `../../KwiKSite/lol/${file}`));
        });
    }

    app.get("/lol/summoner", function (req, res) {
        if (req.query.discordid) {
            client.pg.query('SELECT * FROM summoners WHERE discordid = $1', [req.query.discordid], (err, result) => {
                if (err) { throw err; }
                if (result.rows.length > 0) {
                    return res.send(result.rows);
                }
                return res.sendStatus(400);
            });
        }
    });

    /*app.get("/lol/summoners", function (req, res) {
        client.pg.query(`SELECT * FROM summoners`, (err, result) => {
            if (err) { throw err; }
            if (result.rows.length > 0) {
                return res.send(result.rows);
            }
            return res.sendStatus(400);
        });
    });*/

    app.get("/lol/matchs", function (req, res) {
        console.log(req.query);
        if (req.query.discordid) {
            client.pg.query('SELECT matchs.puuid, player, gamemode, champion, matchup, support, gold, lane, kill, deaths, assists, result, total_damage, tanked_damage, heal, neutral_objectives, wards, pinks, vision_score, cs, length, total_kills, first_gold, first_damages, first_tanked, double, tripple, quadra, penta, time_spent_dead, timestamp, player2, player3, player4, player5 FROM matchs, summoners WHERE player = summoners.puuid AND discordid = $1', [req.query.discordid], (err, result) => {
                if (err) { throw err; }
                if (result.rows.length > 0) {
                    return res.send(result.rows);
                }
                return res.sendStatus(400);
            });
        } else {
            if (req.query.puuid) {
                client.pg.query('SELECT * FROM matchs WHERE player = $1', [req.query.puuid], (err, result) => {
                    if (err) { throw err; }
                    if (result.rows.length > 0) {
                        return res.send(result.rows);
                    }
                    return res.sendStatus(400);
                });
            }
        }
        return res.sendStatus(400);

    });

    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, '../../KwiKSite/404.html'));
    });

    app.post('/contact.html', function (req, res) {
        console.log(req.body);
        if (req.body.mail && req.body.text) {
            if (req.body.topic === "Topic :") {
                client.channels.cache.get("1043317491113414728").send(`**${req.body.name}** (${req.body.mail}) ${req.body.tel} : \`\`\`\n${req.body.text}\n\`\`\``);
            } else {
                client.channels.cache.get("1043317491113414728").send(`**${req.body.name}** (${req.body.mail}) ${req.body.tel} ${req.body.topic} : \`\`\`\n${req.body.text}\n\`\`\``);
            }
        }
        res.redirect("/");
    });

    app.listen(8080, () => {
        console.log("Express server started");
    });
}