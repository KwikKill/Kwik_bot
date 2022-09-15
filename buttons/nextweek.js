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
        await interaction.reply({content: "a...", ephemeral: true});
        today = new Date()
        a2 = new Date(today)
        a2.setDate(a2.getDate() + 7)
        a3 = new Date(a2)
		a3 = new Date(a3.setDate(a3.getDate() + 4));
        client.commands.get("edt").create_di_raph(client, a2, a3, interaction, "raph");
        console.log(interaction.message.embeds[0].title.replace("Emploi du temp de la classe : ", ''));
        console.log(interaction.message.embeds[0].description.replace("Semaine du ", ''));
        
  }
}
