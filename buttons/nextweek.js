const fs = require("fs");
const path = require('path');
const { MessageEmbed } = require('discord.js');
//const { oneLine } = require('common-tags');

module.exports = {
    name: 'nextclass',
	description: "change l'edt pour la classe suivante.",
	permission: "all",
	serverid: ["513776796211085342", "890915473363980308"],
    async run(interaction, client) {
        interaction.reply({content: "a...", ephemeral: true});
        console.log(interaction.message.embeds[0])
        
  }
}
