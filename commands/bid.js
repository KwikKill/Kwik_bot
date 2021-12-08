const fs = require("fs");
const path = require('path');
const { MessageEmbed } = require('discord.js');
const config = require('../config.json');
const credits = require('../credits.json');

module.exports = {
	name: 'bid',
	group: 'mudae',
	description: "Permet de démarrer une enchère",
	permission: "nonz",
	hidden: false,
    deploy: false,
	place: "guild",
    help: [
        {
            "name": "- __bid__ :",
            "value": "Lance une enchère sur le personnage sélectionné."
        },
    ],
	options: [
		{
			name: 'user',
			description: 'personne à rennomer',
			type: 'USER',
			required: true,
		},
        {
			name: 'pseudo',
			description: 'nouveaux pseudo',
			type: 'STRING',
			required: true,
		},
	],
    async run(message, client, interaction=undefined) {
        msg = await message.channel.messages.fetch(message.reference.messageId)
        if(msg != undefined) {
            if(msg.channel.name == "mudatrade") {
                if(msg.embeds[0] != undefined) {
                    if(msg.embeds[0].footer.text.startsWith("Appartient à " + message.author.username)) {
                        if(config["credit"] == false) {
                            msg.startThread({name: "[A VENDRE] : " + msg.embeds[0].author.name}).then(thread =>{
                                first = thread.send("Ce personnage est à vendre. Pour enchérir, mettez simplement le prix dans le salon. Il n'est pas possible d'annuler une offre. L'enchère se termine au bout de 24h sans message. Vous pouvez ping <@" + message.author.id + "> si les enchères sont finis. \nEnchère minimum : dernière enchère + 50")
                                first.then(fs => {
                                    fs.pin()
                                })
                                message.reply("Vous avez créé une enchère sur " + msg.embeds[0].author.name + ".")
                            })
                        }else {
                            if(credits[message.author.id] != undefined && credits[message.author.id] >= 1) {
                                credits[message.author.id] = credits[message.author.id] - 1
                                await fs.writeFile(path.join(__dirname, "..", "credits.json"), JSON.stringify(credits,null,4), (err) => {
                                    if (err) console.log(err)
                                });
    
                                msg.startThread({name: "[A VENDRE] : " + msg.embeds[0].author.name}).then(thread =>{
                                    first = thread.send("Ce personnage est à vendre. Pour enchérir, mettez simplement le prix dans le salon. Il n'est pas possible d'annuler une offre. L'enchère se termine au bout de 24h sans message. Vous pouvez ping <@" + message.author.id + "> si les enchères sont finis. \nEnchère minimum : dernière enchère + 50")
                                    first.then(fs => {
                                        fs.pin()
                                    })
                                    message.reply("Vous avez créé une enchère sur " + msg.embeds[0].author.name + ".")
                                })
                            }else {
                                message.reply("Vous n'avez pas assez de crédits pour créer une enchère, pour en obtenir plus, contactez <@297409548703105035>.")
                            }
                        }
                    }else {
                        message.reply("Vous devez être dans le salon #mudatrade pour lancer une enchère.")
                    }
                }else {
                    message.reply("Vous devez être dans le salon #mudatrade pour lancer une enchère.")
                }
            }else {
                message.reply("Vous devez être dans le salon #mudatrade pour lancer une enchère.")
            }
        }else {
            message.reply("Vous devez être dans le salon #mudatrade pour lancer une enchère.")
        }
    }
}
