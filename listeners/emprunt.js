const fs = require("fs");
const path = require('path');
const { MessageEmbed, Interaction } = require('discord.js');

module.exports = {
    name: 'emprunt',
    group: 'mudae',
	description: "listener d'emprunt",
    type: "messageCreate",
	place: "guild",
    options: undefined,
    commande_channel: true,
    async run(client, args) {
        if(args.reference != undefined){
            if(args.reference.messageId != undefined){
		console.log("a")
                msg = await args.channel.messages.fetch(args.reference.messageId)
                if(msg.author.id == client.user.id) {
                    if(msg.content.includes("Lisez les conditions et répondez \"lu et approuvé\" pour accepter.")) {
                        if(msg.mentions.users.first() == args.author) {
                            args.reply("Vous avez accepté le contrat, le contrat n'est pas annulable et serra mis en fonctionnement dès que <@297409548703105035> sera connecté.")
                        }
                    }
                }
            }
        }
    }
}
