const fs = require("fs");
const path = require('path');
const { MessageEmbed, Interaction } = require('discord.js');
const credits = require('../credits.json');


module.exports = {
    name: 'credits',
    group: 'mudae',
	description: "listener d'ajout de crédits",
    type: "messageCreate",
	place: "guild",
    options: undefined,
    commande_channel: true,
    async run(client, msg) {
        if(msg.author.id == "432610292342587392") {
            if(msg.content.includes(" vient de donner ")) {
                if(msg.mentions.users.has(client.user.id) && msg.mentions.users.get(client.user.id).id == client.user.id) {
                    if(credits[msg.mentions.users.first().id] == undefined) {
                        credits[msg.mentions.users.first().id] = 0
                    }
                    credits[msg.mentions.users.first().id] += Math.floor(msg.content.split(" ")[4].split("**")[1] / 10)
                    await fs.writeFile(path.join(__dirname, "..", "credits.json"), JSON.stringify(credits,null,4), (err) => {
                        if (err) console.log(err)
                    });
                    msg.reply("<@" + msg.mentions.users.first().id + ">, Vous avez bien reçu " + Math.floor(msg.content.split(" ")[4].split("**")[1] / 10) + " crédits.")
                }
            }
        }
    }
}
