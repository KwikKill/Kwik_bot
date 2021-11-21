const fs = require("fs");
const path = require('path');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'rename',
	group: 'util',
	description: "Permet de renommer un membre",
	permission: "modo",
	hidden: false,
	place: "guild",
    help: [
        {
            "name": "- __rename <@user> <pseudo>__ :",
            "value": "Rennome <@user> en <pseudo>."
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
        if(interaction === undefined) {
            if(message.mentions.members.size == 1 && message.args.length == 3) {
                var user = message.mentions.members.first();
                var pseudo = message.args[2];
                if(user != undefined) {
                    user.setNickname(pseudo).catch(err => {
                        message.channel.send(`Cette personne a plus de permissions que le bot et ne peut pas être rennomée.`);
                        return;
                    });
                    message.channel.send(`${user.user.username} a été renommé en ${pseudo}`);
                }
            }
        }else {
            user = interaction.options.getMember('user');
            pseudo = interaction.options.getString('pseudo');

            user.setNickname(pseudo).catch(err => {
                interaction.reply(`Cette personne a plus de permissions que le bot et ne peut pas être rennomée.`);
                return;
            });
            interaction.reply(`${user.user.username} a été renommé en ${pseudo}`);
            
        }
    }
}
