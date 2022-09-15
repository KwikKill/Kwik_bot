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
        // parameters
        classs = interaction.message.embeds[0].title.replace("Emploi du temp de la classe : ", '')
        date1 = new Date(interaction.message.embeds[0].description.replace("Semaine du ", '').split(" ")[0])
        date2 = new Date(interaction.message.embeds[0].description.replace("Semaine du ", '').split(" ")[2])
        date1.setDate(date1.getDate() + 7)
        date2.setDate(date2.getDate() + 7)
        // edit
        if(classs == "raph") {
            client.commands.get("edt").create_di_raph(client, date1, date2, interaction, "raph");
        }else {
            client.commands.get("edt").classic(client, date1, date2, interaction, classs);
        }
        interaction.deferUpdate()
          
        //await interaction.reply({content: "Le message a été update", ephemeral: true});

  }
}
