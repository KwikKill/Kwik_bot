const fs = require("fs");
const path = require('path');
const { MessageEmbed } = require('discord.js');
//const { oneLine } = require('common-tags');

module.exports = {
    name: 'resetname',
	description: "Reset le nom d'un utilisateur.",
	permission: "modo",
    type: "USER",
    async run(interaction, client) {
        user = interaction.options.getMember("user")
        user.setNickname(null).catch(err => {
            interaction.reply(`Cette personne a plus de permissions que le bot et ne peut pas être rennomée.`);
            return;
        });
        interaction.reply(`${user.user.username} a été renommé en ${user.user.username}`);
  }
}
