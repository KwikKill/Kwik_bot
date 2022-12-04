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
        res.render('../Site/index');
    });

    app.set('view engine', 'ejs');

    const indexFiles = fs.readdirSync('Site/');
    for (const file of indexFiles) {
        if (!fs.lstatSync(`Site/${file}`).isDirectory()) {
            app.get(`/${file.replace(".ejs", "")}`, function (req, res) {
                res.render(`../Site/${file}`);
            });
        }
    }

    const cssFiles = fs.readdirSync('Site/css/');
    for (const file of cssFiles) {
        app.get(`/css/${file}`, function (req, res) {
            res.sendFile(path.join(__dirname, `../Site/css/${file}`));
        });
    }

    const imagesFiles = fs.readdirSync('Site/images/');
    for (const file of imagesFiles) {
        app.get(`/images/${file}`, function (req, res) {
            res.sendFile(path.join(__dirname, `../Site/images/${file}`));
        });
    }

    const jsFiles = fs.readdirSync('Site/js/');
    for (const file of jsFiles) {
        app.get(`/js/${file}`, function (req, res) {
            res.sendFile(path.join(__dirname, `../Site/js/${file}`));
        });
    }

    const projetsFiles = fs.readdirSync('Site/projects/');
    for (const file of projetsFiles) {
        app.get(`/projects/${file.replace(".ejs", "")}`, function (req, res) {
            res.render(`../Site/projects/${file}`);
        });
    }


    const postsFiles = fs.readdirSync('Site/posts/');
    for (const file of postsFiles) {
        app.get(`/posts/${file.replace(".ejs", "")}`, function (req, res) {
            res.render(`../Site/posts/${file}`);
        });
    }

    /*const lolFiles = fs.readdirSync('Site/lol/');
    for (const file of lolFiles) {
        app.get(`/lol/${file.replace(".ejs", "")}`, function (req, res) {
            res.render(`../Site/lol/${file}`);
        });
    }*/

    app.get("/lol/profile", function (req, res) {
        if (!req.cookies['token']) {
            res.redirect("/login");
        } else {
            console.log(req.cookies['token']);
            request('https://discord.com/api/users/@me', {
                method: 'GET',
                headers: {
                    Authorization: "Bearer " + req.cookies['token']
                }
            }).then(tokenResponseData => {
                tokenResponseData.body.json().then(data => {
                    client.pg.query('SELECT * FROM summoners WHERE discordid = $1', [data.id], (err, result) => {
                        if (err) {
                            res.redirect("/404");
                            throw err;
                        }
                        if (result.rows.length > 0) {
                            return res.render('../Site/lol/profile', { summoners: result.rows, username: data.username, discriminator: data.discriminator, avatar: data.avatar });
                        }
                        return res.redirect("/lol/register");
                    });
                });
            });
        }
    });

    /*app.get("/lol/summoner", function (req, res) {
        if (req.query.discordid) {
            client.pg.query('SELECT * FROM summoners WHERE discordid = $1', [req.query.discordid], (err, result) => {
                if (err) { throw err; }
                if (result.rows.length > 0) {
                    return res.send(result.rows);
                }
                return res.sendStatus(400);
            });
        }
    });*/

    /*app.get("/lol/summoners", function (req, res) {
        client.pg.query(`SELECT * FROM summoners`, (err, result) => {
            if (err) { throw err; }
            if (result.rows.length > 0) {
                return res.send(result.rows);
            }
            return res.sendStatus(400);
        });
    });*/

    /*app.get("/lol/matchs", function (req, res) {
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

    });*/

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
            }).then(tokenResponseData => {
                tokenResponseData.body.json().then(data => {
                    if (data.id === client.owners[0]) {
                        return res.render(`../Site/admin/admin`);
                    }
                    return res.redirect("/404");
                });
            });
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
        res.render('../Site/404.ejs');
    });

    app.post('/contact', function (req, res) {
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