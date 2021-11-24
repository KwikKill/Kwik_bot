const fs = require("fs");
const path = require('path');
const { MessageEmbed, Interaction } = require('discord.js');
const { channel } = require("diagnostics_channel");

module.exports = {
    name: 'end',
    group: 'mudae',
	description: "listener de supression de thread",
    type: "threadUpdate",
	place: "guild",
    options: undefined,
    commande_channel: true,
    async run(client, channel1, channel2) {
        if(channel2.archived == true && channel1.archived == false) {
            if(channel2.name.startsWith("[A VENDRE]")) {
                msg = await channel2.messages.fetchPinned()
                msg = msg.last()
                messages = await channel2.messages.fetch()
                messages = messages.filter(m => m.author.id == client.user.id && m.type != 'THREAD_STARTER_MESSAGE' && m.embeds[0] != undefined)
                let build = ""
                if(messages.size == 0) {
                    build = "Aucune proposition"
                }else {
                    messages.forEach(async m => {
                        build = `- ${m.embeds[0].description}\n` + build
                    })
                }

                let embed = new MessageEmbed()
                .setTitle("L'enchère pour " + channel2.name.substring(12) + " est terminée : \n")
                .setColor("#ff0000")
                .setDescription(build)
                .setTimestamp()

                msg.mentions.users.first().send({embeds: [embed]})
            }
        }
    }
}
