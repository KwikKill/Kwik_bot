const { Client, RichEmbed } = require('discord.js');
const fs = require("fs");
function welcome(message) {

  let messageArray = message.content.split(" ");
  let args = messageArray.slice(1);

  if (!message.member.hasPermission("MANAGE_MESSAGES")) {
    message.channel.send("Vous n'avez pas les permissions necessaires.");
    return;
  }
  try {


    let welcome = JSON.parse(fs.readFileSync("./welcome.json", "utf8"));

    if (!args[0]) {
      welcome[message.guild.id] = {
        channel: 0
      };
      fs.writeFile("./welcome.json", JSON.stringify(welcome), (err) => {
        if (err) console.log(err);
      });
      message.channel.send("**/" + message.guild + "/" + message.channel.name + "/** \n  " + "Les messages de bienvenue pour le serveur ont été désactivés.");
    }
    if (args[0]) {
      if (message.guild.channels.exist('id', arg[0])) {
        console.log(args[0]);
        welcome[message.guild.id] = {
          channel: arg[0]
        };
        fs.writeFile("./welcome.json", JSON.stringify(welcome), (err) => {
          if (err) console.log(err)
        });
        message.channel.send("**/" + message.guild + "/" + message.channel.name + "/** \n  " + `Les messages de bienvenue pour le serveur ont été activé dans le salon avec l'id : ` + arg[0] + ".");
        //const helloworld = message.guild.channels.find(channel => channel.name === "logs");
        //helloworld.send("**/log : /** \n  " + `Hello world!`)
      } else {
        message.channel.send("**/" + message.guild + "/" + message.channel.name + "/** \n  " + `salon introuvable.`)
      }

    }


  }catch(err) {
    if (err.code === 'ENOENT') {
      console.log('fichier existe pas');

      fs.appendFile('./welcome.json', "{\n}", function (err) {
        if (err) throw err;
        console.log('Saved!');
      });

    }
  }

}
module.exports = welcome;
