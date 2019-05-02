const { Client, RichEmbed } = require('discord.js');
const fs = require("fs");
function prefix(message) {

  let messageArray = message.content.split(" ");
  let args = messageArray.slice(1);

  if (!message.member.hasPermission("MANAGE_MESSAGES")) {
    message.channel.send("Vous n'avez pas les permissions necessaires.");
    return;
  }

  try {

    let prefix = JSON.parse(fs.readFileSync("./prefix.json", "utf8"));

    if (!args[0]) {
  		prefix[message.guild.id] = {
  			prefix: "*"
  		};
  		fs.writeFile("./prefix.json", JSON.stringify(log), (err) => {
  			if (err) console.log(err);
  		});
  		message.channel.send("**/" + message.guild + "/" + message.channel.name + "/** \n  " + "Le préfix pour le serveur a été réinitialisé.");
    }

    if (args[0]) {
    	prefix[message.guild.id] = {
    		prefix: args[0]
    	};
    	fs.writeFile("./prefix.json", JSON.stringify(prefix), (err) => {
    		if (err) console.log(err)
    	});
    	message.channel.send("**/" + message.guild + "/" + message.channel.name + "/** \n  " + `Le préfix du serveur a été changé à .` + args[0]);
  	}

  }catch(err) {
    if (err.code === 'ENOENT') {
      console.log('le fichier n\'existe pas');

      fs.appendFile('./prefix.json', "{\n}", function (err) {
        if (err) throw err;
        console.log('fichier créé !');
      });

    }
    console.log(err)
  }

}
module.exports = prefix;
