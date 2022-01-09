const fs = require("fs");
const path = require('path');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'setbid',
	group: 'mudae',
	description: "Permet de définir l'enchère actuelle",
	permission: "modo",
	hidden: false,
	serverid: ["513776796211085342", "480142959501901845"],
	place: "guild",
    help: [
        {
            "name": "- __/set <@user> <somme>__ :",
            "value": "définie l'enchère en cours à <somme> pour <@user>."
        },
    ],
	options: [
		{
			name: 'user',
			description: 'personne qui enchérie',
			type: 'USER',
			required: true,
		},
        {
			name: 'somme',
			description: 'somme à enchérir',
			type: 'INTEGER',
			required: true,
		},
	],
    async run(message, client, interaction=undefined) {
        if(interaction != undefined) {
            user = interaction.options.getUser('user');
            somme = interaction.options.getInteger('somme');

            let embed = new MessageEmbed()
            .setTitle("Enchère")
            .setColor("#00FF00")
            .setDescription(`<@` + user.id + `> a proposé ${somme} kakera pour ce personnage.`)
            .setFooter(`${user.username}#${user.discriminator}`, user.avatarURL())
            .setTimestamp();
            interaction.reply({content: "L'enchère a bien été changé", ephemeral: true})
            msg = await interaction.channel.send({embeds: [embed]});
        }
    }
}
