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
        app.get(`/${file}`, function (req, res) {
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
        app.get(`/projects/${file}`, function (req, res) {
            res.sendFile(path.join(__dirname, `../../KwiKSite/projects/${file}`));
        });
    }


    const postsFiles = fs.readdirSync('../KwiKSite/posts/');
    for (const file of postsFiles) {
        app.get(`/posts/${file}`, function (req, res) {
            res.sendFile(path.join(__dirname, `../../KwiKSite/posts/${file}`));
        });
    }

    const jsFiles = fs.readdirSync('../KwiKSite/js/');
    for (const file of jsFiles) {
        app.get(`/js/${file}`, function (req, res) {
            res.sendFile(path.join(__dirname, `../../KwiKSite/js/${file}`));
        });
    }

    app.get("/lol/summoner", function (req, res) {
        if (req.query.discordid) {
            client.pg.query(`SELECT * FROM lol_account WHERE discordid = '${req.query.discordid}'`, (err, result) => {
                if (err) { throw err; }
                res.send(result.rows);
            });
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
        console.log("Serveur à l'écoute");
    });
}