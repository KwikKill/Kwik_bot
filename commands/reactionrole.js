const fs = require("fs");
const path = require('path');
const { MessageEmbed } = require('discord.js');


module.exports = {
    name: 'reactionrole',
    group: 'moderation',
	  description: "Commande de déploiement du message de reaction",
	  permission: "owner",
    hidden: false,
    serverid: ["513776796211085342", "890915473363980308"],
    help: [
        {
            "name": "- __reactionrole__ :",
            "value": "Envoie le message de réaction."
          }
    ],
	  place: "guild",
    options: undefined,
    async run(message, client, interaction=undefined, mssg=true) {
      if(interaction != undefined) {
        let embed1 = new MessageEmbed()
	.setColor("0xffe402")
    	.setTitle("Role week-end")
    	.setAuthor("KwikBot", client.user.avatarURL())//, 'https://github.com/KwikKill/Gab_bot')
    	.setDescription(
		"Réagissez sur la réaction ✅ pour vous mettre ou enlever le rôle week end."
	)
	.setTimestamp()
	
	interaction.reply({embeds:[embed1]}).then(msg => {
		console.log(msg)
		msg.react("✅")
	})
	
      }
    }
}
