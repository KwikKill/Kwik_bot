const path = require('path');
const express = require('express');
const fs = require("fs");
const { request } = require('undici');
const cookieParser = require('cookie-parser');
const lol_api = require("./lol_api.js");

const delay = ms => new Promise(res => setTimeout(res, ms));

// -------------- Express -----------------
module.exports = {
    register
};

function register(client) {
    const app = express();

    app.use(cookieParser());
    app.use(require('body-parser').urlencoded());

    app.use((err, req, res, next) => {
        if (err && err.code === 'ECONNABORTED') {
            res.status(400).end(); // Don't process this error any further to avoid its logging
        } else {
            next(err);
        }
    });

    app.get('/', function (req, res) {
        return res.render('../Site/index');
    });

    app.set('view engine', 'ejs');

    const indexFiles = fs.readdirSync('Site/');
    for (const file of indexFiles) {
        if (!fs.lstatSync(`Site/${file}`).isDirectory()) {
            app.get(`/${file.replace(".ejs", "")}`, function (req, res) {
                return res.render(`../Site/${file}`);
            });
        }
    }

    const cssFiles = fs.readdirSync('Site/css/');
    for (const file of cssFiles) {
        app.get(`/css/${file}`, function (req, res) {
            return res.sendFile(path.join(__dirname, `../Site/css/${file}`));
        });
    }

    const imagesFiles = fs.readdirSync('Site/images/');
    for (const file of imagesFiles) {
        app.get(`/images/${file}`, function (req, res) {
            return res.sendFile(path.join(__dirname, `../Site/images/${file}`));
        });
    }

    const jsFiles = fs.readdirSync('Site/js/');
    for (const file of jsFiles) {
        app.get(`/js/${file}`, function (req, res) {
            return res.sendFile(path.join(__dirname, `../Site/js/${file}`));
        });
    }

    const projetsFiles = fs.readdirSync('Site/projects/');
    for (const file of projetsFiles) {
        app.get(`/projects/${file.replace(".ejs", "")}`, function (req, res) {
            return res.render(`../Site/projects/${file}`);
        });
    }


    const postsFiles = fs.readdirSync('Site/posts/');
    for (const file of postsFiles) {
        app.get(`/posts/${file.replace(".ejs", "")}`, function (req, res) {
            return res.render(`../Site/posts/${file}`);
        });
    }

    app.get("/lol/", function (req, res) {
        return res.render("../Site/lol/index");
    });

    app.get("/lol/register", function (req, res) {
        if (!req.cookies['token']) {
            return res.redirect("/lol/profile");
        }
        request('https://discord.com/api/users/@me', {
            method: 'GET',
            headers: {
                Authorization: "Bearer " + req.cookies['token']
            }
        }).then(tokenResponseData => {
            tokenResponseData.body.json().then(data => {
                console.log("[GET] /lol/register", data.username);
                client.pg.query('SELECT * FROM summoners WHERE discordid = $1', [data.id], (err, result) => {
                    if (err) {
                        return res.redirect("/404");
                    }
                    if (result.rows.length === 0) {
                        return res.render("../Site/lol/register", { username: data.username, discordid: data.id });
                    }
                    return res.redirect("/lol/profile");
                });
            });
        });
    });

    app.post("/lol/register", function (req, res) {
        console.log("[POST] /lol/register", req.body);
        if (req.body.username && req.body.discordid) {
            client.pg.query('SELECT * FROM summoners WHERE discordid = $1', [req.body.discordid], (err, result) => {
                if (err) {
                    console.error(err);
                    res.statusCode(500);
                    return res.render("../Site/lol/message", { text: "Internal server error" });
                }
                if (result.rows.length >= 3) {
                    return res.render("../Site/lol/message", { text: "You already have 3 accounts registered" });
                }
                let al = false;
                result.rows.forEach(element => {
                    if (element.username === req.body.username) {
                        al = true;
                    }
                });
                if (al) {
                    return res.render("../Site/lol/message", { text: "This account is already registered" });
                }
                client.commands.get("lol").add_summoner_manual(client, req.body.username, req.body.discordid);
                delay(1800).then(() => {
                    return res.redirect("/lol/queue");
                });
            });
        }
    });

    app.get("/lol/profile", function (req, res) {
        if (!req.cookies['token']) {
            return res.redirect("/login");
        }
        request('https://discord.com/api/users/@me', {
            method: 'GET',
            headers: {
                Authorization: "Bearer " + req.cookies['token']
            }
        }).then(tokenResponseData => {
            tokenResponseData.body.json().then(data => {
                console.log("[GET] /lol/profile", data.username);
                client.pg.query('SELECT * FROM summoners WHERE discordid = $1', [data.id], (err, result) => {
                    if (err) {
                        return res.redirect("/404");
                    }
                    if (result.rows.length > 0) {
                        client.pg.query('SELECT * FROM matchs, summoners WHERE player = summoners.puuid AND discordid = $1', [data.id], (err2, result2) => {
                            return res.render('../Site/lol/profile', { summoners: result.rows, username: data.username, discriminator: data.discriminator, avatar: data.avatar, games: result2.rows, discordid: data.id });
                        });
                    } else {
                        return res.redirect("/lol/register");
                    }
                });
            });
        });
    });

    app.get("/lol/remove", function (req, res) {
        if (!req.query.pseudo) {
            return res.sendStatus(403);
        }
        if (!req.cookies['token']) {
            return res.sendStatus(403);
        }
        request('https://discord.com/api/users/@me', {
            method: 'GET',
            headers: {
                Authorization: "Bearer " + req.cookies['token']
            }
        }).then(tokenResponseData => {
            tokenResponseData.body.json().then(data => {
                console.log("[GET] /lol/remove", data.username);
                client.pg.query('SELECT * FROM summoners WHERE discordid = $1', [data.id], (err, result) => {
                    if (err) {
                        return res.sendStatus(403);
                    }
                    if (result.rows.length > 0) {
                        client.pg.query("DELETE FROM matchs " +
                            "WHERE player IN (" +
                            "SELECT puuid " +
                            "FROM summoners " +
                            "WHERE username=$1 " +
                            "AND discordid=$2 " +
                            ");",
                            [req.query.pseudo, data.id],
                            (err2, result2) => {
                                if (err2) {
                                    console.error(err2);
                                    return res.sendStatus(403);
                                }
                                client.pg.query("DELETE FROM summoners " +
                                    "WHERE discordid=$1 " +
                                    "AND username=$2" +
                                    ";",
                                    [data.id, req.query.pseudo],
                                    (err3) => {
                                        if (err3) {
                                            console.error(err3);
                                            return res.sendStatus(403);
                                        }
                                        return res.render("../Site/lol/message", { text: "The account " + req.query.pseudo + " has been removed. You can go back to the profile page with the navbar." });

                                    }
                                );

                            }
                        );
                    } else {
                        return res.sendStatus(403);
                    }
                });
            });
        });

    });

    app.get("/lol/among", function (req, res) {
        if (!req.cookies['token']) {
            return res.redirect("/login");
        }
        request('https://discord.com/api/users/@me', {
            method: 'GET',
            headers: {
                Authorization: "Bearer " + req.cookies['token']
            }
        }).then(tokenResponseData => {
            tokenResponseData.body.json().then(data => {
                console.log("[GET] /lol/among", data.username);
                client.pg.query('SELECT * FROM summoners WHERE discordid = $1', [data.id], (err, result) => {
                    if (err) {
                        return res.redirect("/404");
                    }
                    if (result.rows.length > 0) {
                        return res.render('../Site/lol/among', { discordclient: client, summoners: result.rows, username: data.username, discriminator: data.discriminator, avatar: data.avatar, discordid: data.id });
                    }
                    return res.redirect("/lol/register");
                });
            });
        });
    });

    app.get("/lol/among/join", function (req, res) {
        if (!req.query.game || client.amonglegends.get(req.query.game) === undefined || client.amonglegends.get(req.query.game).started) {
            return res.redirect("/404");
        }
        if (!req.cookies['token']) {
            return res.redirect("/login");
        }
        request('https://discord.com/api/users/@me', {
            method: 'GET',
            headers: {
                Authorization: "Bearer " + req.cookies['token']
            }
        }).then(tokenResponseData => {
            tokenResponseData.body.json().then(data => {
                console.log("[GET] /lol/among/join", data.username, req.query.game);
                client.pg.query('SELECT * FROM summoners WHERE discordid = $1', [data.id], (err, result) => {
                    if (err) {
                        return res.redirect("/404");
                    }
                    if (result.rows.length > 0) {
                        if (client.amonglegends.get(req.query.game).players[data.id] === undefined) {
                            console.log(client.amonglegends.get(req.query.game).players);
                            if (client.amonglegends.get(req.query.game).players.length < 5) {
                                client.amonglegends.get(req.query.game).players[data.id] = {
                                    username: data.username,
                                    role: "",
                                    vote: undefined,
                                    score: 0,
                                    admin: false
                                };
                                return res.render('../Site/lol/among-game', { discordclient: client, summoners: result.rows, username: data.username, discriminator: data.discriminator, avatar: data.avatar, discordid: data.id, game: req.query.game });
                            }
                            return res.redirect("/lol/among");
                        }
                        return res.render('../Site/lol/among-game', { discordclient: client, summoners: result.rows, username: data.username, discriminator: data.discriminator, avatar: data.avatar, discordid: data.id, game: req.query.game });
                    }
                    return res.redirect("/lol/register");
                });
            });
        });
    });

    app.post('/lol/among/create', function (req, res) {
        if (!req.cookies['token']) {
            return res.redirect("/login");
        }
        request('https://discord.com/api/users/@me', {
            method: 'GET',
            headers: {
                Authorization: "Bearer " + req.cookies['token']
            }
        }).then(tokenResponseData => {
            tokenResponseData.body.json().then(data => {
                console.log("[POST] /lol/among/create", data.username, req.body);
                client.pg.query('SELECT * FROM summoners WHERE discordid = $1', [data.id], (err, result) => {
                    if (err) {
                        return res.redirect("/404");
                    }
                    if (result.rows.length > 0) {
                        if (client.amonglegends.get(data.id) === undefined) {
                            let df;
                            if (Math.random() > 0.5) {
                                df = "victoire";
                            } else {
                                df = "defaite";
                            }
                            client.amonglegends.set(data.id, {
                                name: data.username + "'s Game",
                                started: false,
                                id: data.id,
                                finish: false,
                                public: false,
                                players: {
                                    [data.id]: {
                                        username: data.username,
                                        role: "",
                                        vote: undefined,
                                        score: 0,
                                        admin: true
                                    }
                                },
                                interval1: undefined,
                                interval2: undefined,
                                stats: {
                                    status: undefined,
                                    kills: undefined,
                                    assists: undefined,
                                    damages: undefined,
                                    deaths: undefined,
                                },
                                doubleface: df
                            });
                        }
                        return res.redirect("/lol/among/join?game=" + data.id);
                    }
                    return res.redirect("/lol/register");
                });
            });
        });
    });

    app.get('/lol/among/kick', function (req, res) {
        if (!req.query.game && !req.query.player) {
            return res.redirect("/404");
        }
        if (!req.cookies['token']) {
            return res.redirect("/login");
        }
        request('https://discord.com/api/users/@me', {
            method: 'GET',
            headers: {
                Authorization: "Bearer " + req.cookies['token']
            }
        }).then(tokenResponseData => {
            tokenResponseData.body.json().then(data => {
                console.log("[POST] /lol/among/kick", data.username, req.query);
                client.pg.query('SELECT * FROM summoners WHERE discordid = $1', [data.id], (err, result) => {
                    if (err) {
                        return res.redirect("/404");
                    }
                    if (result.rows.length > 0) {
                        if (client.amonglegends.get(req.query.game) !== undefined) {
                            if (client.amonglegends.get(req.query.game).players[data.id].admin === true) {
                                if (client.amonglegends.get(req.query.game).players[req.query.player] !== undefined && client.amonglegends.get(req.query.game).players[req.query.player].admin === false) {
                                    delete client.amonglegends.get(req.query.game).players[req.query.player];
                                }
                            }
                            return res.redirect("/lol/among/join?game=" + data.id);
                        }
                        return res.redirect("/lol/among");
                    }
                    return res.redirect("/lol/register");
                });
            });
        });
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

    app.get("/lol/who", function (req, res) {
        lol_api.getCurrentPatch("EUW1", client).then(version => {
            lol_api.getChampsId("EUW1", client).then(champs => {
                return res.render("../Site/lol/who", { champs: champs, version: version['v'] });
            });
        });
    });

    app.get("/lol/matchs", function (req, res) {
        if (!req.cookies['token']) {
            return res.sendStatus(403);
        }
        request('https://discord.com/api/users/@me', {
            method: 'GET',
            headers: {
                Authorization: "Bearer " + req.cookies['token']
            }
        }).then(tokenResponseData => {
            tokenResponseData.body.json().then(data => {
                console.log("[GET] /lol/matchs", data.username, req.query);
                client.pg.query('SELECT * FROM summoners WHERE discordid = $1', [data.id], (err, result) => {
                    if (err) {
                        return res.sendStatus(403);
                    }
                    if (result.rows.length > 0) {
                        let query = 'SELECT matchs.puuid, matchs.champion, matchs.result, matchs.gamemode, matchs.kill, matchs.deaths, matchs.assists, matchs.cs, matchs.total_kills FROM matchs, summoners WHERE matchs.player = summoners.puuid AND discordid = $1';
                        const values = [data.id];
                        if (req.query.last) {
                            query += ' AND matchs.puuid < $2';
                            values.push(req.query.last);
                        } else if (req.query.champion) {
                            query += ' AND matchs.champion = $2';
                            values.push(req.query.champion);
                        }
                        query += ' ORDER BY timestamp DESC LIMIT 10;';
                        client.pg.query(query, values, (err2, result2) => {
                            if (err2) {
                                throw err2;
                            }
                            lol_api.getCurrentPatch("EUW1", client).then(version => {
                                lol_api.getChampsId("EUW1", client).then(dict => {
                                    return res.render('../Site/lol/matchs', {
                                        username: data.username,
                                        discriminator: data.discriminator,
                                        avatar: data.avatar,
                                        games: result2.rows,
                                        version: version,
                                        dict: dict
                                    });
                                });
                            });
                        });
                    } else {
                        return res.sendStatus(403);
                    }
                });
            });
        });

    });

    app.get("/admin", function (req, res) {
        if (!req.cookies['token']) {
            return res.redirect("https://discord.com/api/oauth2/authorize?client_id=559371363035381777&redirect_uri=http%3A%2F%2Falbert.blaisot.org%3A8080%2Flogin&response_type=code&scope=identify");
        }
        console.log(req.cookies['token']);
        request('https://discord.com/api/users/@me', {
            method: 'GET',
            headers: {
                Authorization: "Bearer " + req.cookies['token']
            }
        }).then(tokenResponseData => {
            tokenResponseData.body.json().then(data => {
                if (data.id === client.owners[0]) {
                    //const data = fs.readFileSync('/var/log/syslog', 'utf8');
                    return res.render(`../Site/admin/admin`, { discordclient: client, log: data });
                }
                return res.redirect("/404");
            });
        });
    });

    app.get("/lol/queue", function (req, res) {
        if (!req.cookies['token']) {
            return res.render('../Site/lol/queue', { jsclient: client, data: undefined });
        }
        console.log("/lol/queue", req.cookies['token']);
        request('https://discord.com/api/users/@me', {
            method: 'GET',
            headers: {
                Authorization: "Bearer " + req.cookies['token']
            }
        }).then(tokenResponseData => {
            tokenResponseData.body.json().then(data => {
                console.log("[GET] /lol/queue", data.username);
                return res.render('../Site/lol/queue', { jsclient: client, data: data });
            });
        });
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
                        return res.redirect("/lol/profile");
                    });
                });
            } catch (error) {
                console.error(error);
                return res.redirect("/404");
            }
        } else {
            if (!req.cookies['token']) {
                return res.redirect("https://discord.com/api/oauth2/authorize?client_id=559371363035381777&redirect_uri=http%3A%2F%2Falbert.blaisot.org%3A8080%2Flogin&response_type=code&scope=identify");
            }
            console.log(req.cookies['token']);
            return res.redirect("/lol/profile");
        }
    });

    app.get('*', function (req, res) {
        return res.render('../Site/404.ejs');
    });

    app.post('/contact', function (req, res) {
        if (req.body.mail && req.body.text) {
            if (req.body.topic === "Topic :") {
                client.channels.cache.get("1043317491113414728").send(`**${req.body.name}** (${req.body.mail}) ${req.body.tel} : \`\`\`\n${req.body.text}\n\`\`\``);
            } else {
                client.channels.cache.get("1043317491113414728").send(`**${req.body.name}** (${req.body.mail}) ${req.body.tel} ${req.body.topic} : \`\`\`\n${req.body.text}\n\`\`\``);
            }
        }
        return res.redirect("/");
    });

    app.listen(8080, () => {
        console.log("Express server started");
    });
}