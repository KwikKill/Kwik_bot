const path = require('path');
const express = require('express');
const fs = require("fs");
const { request } = require('undici');
const cookieParser = require('cookie-parser');

// -------------- Express -----------------
module.exports = {
    register
};

function register(client) {
    const app = express();

    app.use(cookieParser());
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

    app.get("/admin", function (req, res) {
        if (!req.cookies['token']) {
            res.redirect("https://discord.com/api/oauth2/authorize?client_id=559371363035381777&redirect_uri=http%3A%2F%2Falbert.blaisot.org%3A8080%2Flogin&response_type=code&scope=identify");
        } else {
            console.log(req.cookies['token']);
            request('https://discord.com/api/users/@me', {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + req.cookies['token']
                }
            }).then(({ body }) => {
                console.log("Bearer " + req.cookies['token'])
                console.log(body);
                res.send(body);
            });
            if (false) {
                res.sendFile(path.join(__dirname, `../../KwiKSite/admin/admin.html`));
            }
        }
    });

    app.get("/login", function (req, res) {
        const code = req.query.code;
        if (code) {
            try {
                request('https://discord.com/api/oauth2/token', {
                    method: 'POST',
                    body: new URLSearchParams({
                        client_id: process.env.DISCORD_CLIENT_ID,
                        client_secret: process.env.DISCORD_CLIENT_SECRET,
                        code,
                        grant_type: 'authorization_code',
                        redirect_uri: `http://albert.blaisot.org:8080/login`,
                        scope: 'identify',
                    }).toString(),
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }).then(tokenResponseData => {
                    tokenResponseData.body.json().then(oauthData => {
                        res.cookie("token", oauthData.access_token, { maxAge: oauthData.expires_in * 1000, httpOnly: true });
                        res.redirect("/lol/profile");
                    });

                });
            } catch (error) {
                console.error(error);
                res.redirect("/404");
            }
        } else {
            if (!req.cookies['token']) {
                res.redirect("https://discord.com/api/oauth2/authorize?client_id=559371363035381777&redirect_uri=http%3A%2F%2Falbert.blaisot.org%3A8080%2Flogin&response_type=code&scope=identify");
            } else {
                console.log(req.cookies['token']);
                res.redirect("/lol/profile");
            }
        }
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