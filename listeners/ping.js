const fs = require("fs");
const path = require('path');
const { MessageEmbed, Interaction } = require('discord.js');

module.exports = {
    name: 'ping',
    group: 'fun',
	  description: "gestionnaire de pings",
    type: "messageCreate",
	  place: "guild",
    options: undefined,
    commande_channel: true,
    async run(client, msg) {
      if(msg.content.includes("<@!297409548703105035>")) {
	      
	let embed = new MessageEmbed()
	.setColor("0xffe402")
	.setTitle("Gestionnaire de Ping :")
	.setAuthor(msg.author.username, msg.author.displayAvatarURL())
	.setDescription(
	msg.content
	)
	.setTimestamp()
	
	msg.guild.members.cache.get("297409548703105035").send({embeds: [embed]})
      }
    }
}
