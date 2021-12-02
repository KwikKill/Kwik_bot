const fs = require("fs");
const path = require('path');
const { MessageEmbed } = require('discord.js');

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
                        msg.startThread({name: "[A VENDRE] : " + msg.embeds[0].author.name}).then(thread =>{
                            first = thread.send(msg.embeds[0].author.name + " à vendre. Pour enchérir, mettez simplement le prix dans le salon. Il n'est pas possible d'annuler une offre. L'enchère se termine au bout de 24h sans message. Vous pouvez ping <@" + message.author.id + "> si les enchères sont finis. \nEnchère minimume : denière enchère + 50")
                            first.then(fs => {
                                fs.pin()
                            })
                            message.reply("Vous avez créé une enchère sur " + msg.embeds[0].author.name + ".")
                        })
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
