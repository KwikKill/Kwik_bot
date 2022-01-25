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
      guilds = ["513776796211085342", "890915473363980308", "480142959501901845"]
      
      if(guilds.includes(msg.channel.guild.id) && !msg.author.bot) {
        content = msg.content
	content = content.replaceAll(/[.,\/#!$%\^&\*;:{}=?\-_`~()]"/g,"")
	content = content.trim()
	content = content.toLowerCase()
	      
	arr = content.split(" ")
	for(x in arr) {
	  if(arr[x].startsWith("di") || arr[x].startsWith("dy")) {
	     if(arr[x].substring(2).length > 1) {
		msg.reply(arr[x].substring(2))
	        return;
	     }
	  }
	}
	
	arr = content.split(" ")
	for(x in arr) {
	  if(arr[x].startsWith("cri") || arr[x].startsWith("cry")) {
	     if(arr[x].substring(3).length > 1) {
		msg.reply(arr[x].substring(3).toUpperCase())
	        return;
	     }
	  }
	}
	      
	      
	last = arr[arr.length - 1]
	if(last.substr(last.length - 4) == "quoi" || last.substr(last.length - 3) == "koi" || last.substr(last.length - 7) == "quoient" || last.substr(last.length - 3) == "coi") {
		msg.reply("feur")
		return;
	}
	      
      }
    }
}
