const fs = require("fs");
const path = require('path');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'bid',
	description: "créé une enchère sur ce perso.",
	permission: "none",
    type: "MESSAGE",
    async run(interaction, client) {
        message = interaction.options.getMessage("message")
        if(message.channel.name == "mudatrade") {
            if(message.embeds != []) {
                if(message.embeds[0].footer.text.startsWith("Appartient à " + interaction.member.user.username)) {
                    message.startThread({name: "[A VENDRE] : " + message.embeds[0].author.name}).then(thread =>{
                        first = thread.send(message.embeds[0].author.name + " à vendre. Pour enchérir, mettez simplement le prix dans le salon. Il n'est pas possible d'annuler une offre. L'enchère se termine au bout de 24h sans message. Vous pouvez ping <@" + interaction.member.user.id + "> si les enchères sont finis.")
                        first.then(fs => {
                            fs.pin()
                        })
                        interaction.reply({content: "Vous avez créé une enchère sur " + message.embeds[0].author.name + ".", ephemeral: true})
                    })
                }
            }
        }else {
            interaction.reply({content: "Vous devez être dans le salon #mudatrade pour utiliser cette commande.", ephemeral: true})
        }
  }
}
