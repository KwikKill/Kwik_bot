const { Client, RichEmbed } = require('discord.js');
const fs = require("fs");
function log(message) {

  let messageArray = message.content.split(" ");
  let args = messageArray.slice(1);

  if (!message.member.hasPermission("MANAGE_MESSAGES")) {
    message.channel.send("Vous n'avez pas les permissions necessaires.");
    return;
  }
  let log = JSON.parse(fs.readFileSync("./log.json", "utf8"));

  if (!args[0]) {
		log[message.guild.id] = {
			toggle: 0
		};
		fs.writeFile("./logs.json", JSON.stringify(log), (err) => {
			if (err) console.log(err);
		});
		message.channel.send("**/" + message.guild + "/" + message.channel.name + "/** \n  " + "Les logs pour le serveur ont été désactivés.");
  }
  if (args[0]) {
			if (message.guild.channels.exists('name', 'logs')) {
		log[message.guild.id] = {
			toggle: 1
		};
		fs.writeFile("./logs.json", JSON.stringify(log), (err) => {
			if (err) console.log(err)
		});
		message.channel.send("**/" + message.guild + "/" + message.channel.name + "/** \n  " + `Les logs pour le serveur ont été activé.`);
		const helloworld = message.guild.channels.find(channel => channel.name === "logs");
		helloworld.send("**/log : /** \n  " + `Hello world!`)
		} else {
			message.channel.send("**/" + message.guild + "/" + message.channel.name + "/** \n  " + `vous devez créer un salon appellé **logs**.`)
		}

  }

}
module.exports = log;
