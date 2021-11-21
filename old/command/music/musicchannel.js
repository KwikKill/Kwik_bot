const { Client, RichEmbed } = require('discord.js');
const fs = require("fs");
function musicchannel(message) {

  let messageArray = message.content.split(" ");
  let args = messageArray.slice(1);

  if (!message.member.hasPermission("MANAGE_MESSAGES")) {
    message.channel.send("Vous n'avez pas les permissions necessaires.");
    return;
  }

  try {

    let musicchannel = JSON.parse(fs.readFileSync("./musicchannel.json", "utf8"));

    if (!args[0]) {
  		musicchannel[message.guild.id] = {
  			musicchannel: ""
  		};
  		fs.writeFile("./musicchannel.json", JSON.stringify(musicchannel), (err) => {
  			if (err) console.log(err);
  		});
  		message.channel.send("**/" + message.guild + "/" + message.channel.name + "/** \n  " + "Le salon pour la musique pour le serveur a été désactivé.");
    }

    if (args[0]) {

      var channel  = message.guild.channels.find(channel => channel.id === args[0]);
      if(channel) {
      	musicchannel[message.guild.id] = {
      		musicchannel: args[0]
      	};
      	fs.writeFile("./musicchannel.json", JSON.stringify(musicchannel), (err) => {
      		if (err) console.log(err)
      	});
      	message.channel.send("**/" + message.guild + "/" + message.channel.name + "/** \n  " + `Le salon pour la musique a été changé à : ` + args[0] + " (" + channel.name + ")");
    	}
    }

  }catch(err) {
    if (err.code === 'ENOENT') {
      console.log('le fichier n\'existe pas');

      fs.appendFile('./musicchannel.json', "{\n}", function (err) {
        if (err) throw err;
        console.log('fichier créé !');
      });

    }
    console.log(err)
  }

}
module.exports = musicchannel;
