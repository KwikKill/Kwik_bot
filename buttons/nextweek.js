const fs = require("fs");
const path = require('path');
const { MessageEmbed } = require('discord.js');
//const { oneLine } = require('common-tags');

module.exports = {
    name: 'nextweek',
	description: "change l'edt pour la classe suivante.",
	permission: "all",
	serverid: ["513776796211085342", "890915473363980308"],
    async run(interaction, client) {
        interaction.reply({content: "a...", ephemeral: true});
        console.log(interaction.message.embeds[0].title.replace("Emploi du temp de la classe : ", ''));
        console.log(interaction.message.embeds[0].description.replace("Semaine du ", ''));
        
  }
}
