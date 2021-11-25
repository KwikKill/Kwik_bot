const fs = require("fs");
const path = require('path');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'setminprice',
	group: 'mudae',
	description: "Permet de définir l'enchère minimum au dessus du dernière prix",
	permission: "none",
	hidden: false,
	place: "guild",
    help: [
        {
            "name": "- __/setminprice <somme>__ :",
            "value": "définie l'enchère minimum au dessus du dernière prix à <somme>",
        },
    ],
	options: [
        {
			name: 'somme',
			description: 'somme à enchérir',
			type: 'INTEGER',
			required: true,
		},
	],
    async run(message, client, interaction=undefined) {
        if(interaction != undefined) {
            if(interaction.channel.type == "GUILD_PUBLIC_THREAD") {
                if(interaction.channel.name.startsWith("[A VENDRE]")) {
                    somme = interaction.options.getInteger('somme');
                    if(somme < 1000) {
                        
                        msg = await interaction.channel.messages.fetchPinned()
                        msg = msg.last()
                        prix_min = msg.content.split(" ")[44]
                        content = msg.content.split(" ")
                        msssg = content.slice(0, 43).join(" ")
                        msssg += " " + somme
                        msg.edit(msssg)
                        interaction.channel.send("enchère minimum au dessus du dernière prix définie à " + somme)
                    }
                }
            }
        }
    }
}
