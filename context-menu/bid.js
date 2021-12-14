const fs = require("fs");
const path = require('path');
const { MessageEmbed } = require('discord.js');
const config = require('../config.json');
const credits = require('../credits.json');

module.exports = {
    name: 'bid',
	description: "créé une enchère sur ce perso.",
	permission: "none",
    type: "MESSAGE",
    async run(interaction, client) {
        message = await interaction.options.getMessage("message")
        if(message.channel.name == "mudatrade") {
            if(message.embeds[0] != undefined) {
                if(message.embeds[0].footer.text.startsWith("Appartient à " + interaction.member.user.username)) {
                    if(config["credit"] == false) {			    
                        thread = await message.startThread({name: "[A VENDRE] : " + message.embeds[0].author.name})
		        console.log(thread)
			first = await thread.send("Ce personnage est à vendre. Pour enchérir, mettez simplement le prix dans le salon. Il n'est pas possible d'annuler une offre. L'enchère se termine au bout de 24h sans message. Vous pouvez ping <@" + interaction.member.user.id + "> si les enchères sont finis. \nEnchère minimum : dernière enchère + 50")
                        console.log("a")
			console.log(first)
			return;
			await first.pin()
			await interaction.reply({content: "Vous avez créé une enchère sur " + message.embeds[0].author.name + ".", ephemeral: true})
                    }else {
                        if(credits[interaction.user.id] != undefined && credits[interaction.user.id] >= 1) {
                            credits[interaction.user.id] = credits[interaction.user.id] - 1
                            await fs.writeFile(path.join(__dirname, "..", "credits.json"), JSON.stringify(credits,null,4), (err) => {
                                if (err) console.log(err)
                            });

                            message.startThread({name: "[A VENDRE] : " + message.embeds[0].author.name}).then(thread =>{
                                first = thread.send(message.embeds[0].author.name + " à vendre. Pour enchérir, mettez simplement le prix dans le salon. Il n'est pas possible d'annuler une offre. L'enchère se termine au bout de 24h sans message. Vous pouvez ping <@" + interaction.member.user.id + "> si les enchères sont finis. \nEnchère minimum : denière enchère + 50")
                                first.then(fs => {
                                    fs.pin()
                                })
                                interaction.reply({content: "Vous avez créé une enchère sur " + message.embeds[0].author.name + ".", ephemeral: true})
                            })
                        }else {
                            interaction.reply({content: "Vous n'avez pas assez de crédits pour créer une enchère, pour en obtenir plus, contactez <@297409548703105035>.", ephemeral: true})
                        }
                    }
                }else {
		            interaction.reply({content: "Vous ne pouvez pas démarrer d'enchère à partir de ce message.", ephemeral: true})
	    	    }
            }else {
		        interaction.reply({content: "Vous ne pouvez pas démarrer d'enchère à partir de ce message.", ephemeral: true})
	        }
        }else {
            interaction.reply({content: "Vous devez être dans le salon #mudatrade pour utiliser cette commande.", ephemeral: true})
        }
  }
}
