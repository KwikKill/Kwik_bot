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
      guilds = ["513776796211085342"]
      
      if(guilds.includes(msg.channel.guild.id)) {
        content = msg.content
	content = content.replaceAll(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
	content = content.trim()
	      
	say = []
	      
	arr = content.split(" ")
	for(x in arr) {
	  if(arr[x].startsWith("di")) {
	     if(arr[x].substring(2) != "") {
		say.push(arr[x].substring(2))
	     }
	  }
	}
	console.log(say)
	      
      }
    }
}