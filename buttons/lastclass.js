const fs = require("fs");
const path = require('path');
const { MessageEmbed } = require('discord.js');
//const { oneLine } = require('common-tags');

module.exports = {
    name: 'lastclass',
	description: "Change la classe pour la précédante.",
	permission: "all",
	serverid: ["513776796211085342", "890915473363980308"],
    async run(interaction, client) {
        classs = interaction.message.embeds[0].title.replace("Emploi du temp de la classe : ", '')
        date1 = new Date(interaction.message.embeds[0].description.replace("Semaine du ", '').split(" ")[0])
        date2 = new Date(interaction.message.embeds[0].description.replace("Semaine du ", '').split(" ")[2])

        test = JSON.parse(JSON.stringify(client.commands.get("edt").codes))
        delete test["raph"]
        keys = Object.keys(test)
        if(keys.indexOf(classs) == 0) {
            classs = keys[keys.length - 1]
        }else {
            classs = keys[(keys.indexOf(classs) - 1) % keys.length]
        }
        
        // edit
        if(classs == "raph") {
            client.commands.get("edt").create_di_raph(client, date1, date2, interaction, "raph");
        }else {
            client.commands.get("edt").classic(client, date1, date2, interaction, classs);
        }
        interaction.deferUpdate()
  }
}