const fs = require("fs");
const path = require('path');
const { MessageEmbed, Interaction } = require('discord.js');

module.exports = {
    name: 'phrases',
    group: 'fun',
	  description: "listener de phrases",
    type: "messageCreate",
	  place: "guild",
    options: undefined,
    commande_channel: true,
    async run(client, msg) {
      guilds = ["513776796211085342", "890915473363980308"]
      
      if(guilds.includes(msg.channel.guild.id)) {
        content = msg.content
	content = content.replaceAll(/[.,\/#!$%\^&\*;:{}=?\-_`~()]/g,"")
	content = content.trim()
	content = content.toLowerCase()
	      
	arr = content.split(" ")
	for(x in arr) {
	  if(arr[x].startsWith("di") || arr[x].startsWith("dy")) {
	     if(arr[x].substring(2) != "") {
		msg.reply(arr[x].substring(2))
	        return;
	     }
	  }
	}
	last = arr[arr.length - 1]
	if(last.substr(last.length - 4) == "quoi" || last.substr(last.length - 3) == "koi" || last.substr(last.length - 7) == "quoient" || last.substr(last.length - 3) == "coi") {
		msg.reply("feur")
	}
	      
      }
    }
}
