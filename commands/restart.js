const fs = require("fs");
const path = require('path');
const { MessageEmbed } = require('discord.js');
const roles = require('../roles.json');
const child_process = require('child_process');

module.exports = {
    name: 'restart',
    group: 'moderation',
    deploy: false,
	  description: "Commande de restart du bot",
	  permission: "owner",
    hidden: false,
    help: [
        {
            "name": "- __restart__ :",
            "value": "Redémarre le bot."
          }
    ],
	  place: "dm",
    options: undefined,
    async run(message, client, interaction=undefined, mssg=true) {
    	console.log("a")
        let ls_process = child_process.exec("sudo update-gab_bot.sh");
	    
	ls_process.stdout.on('data', (data) => {
	  console.log(`stdout: ${data}`);
	});
    }
}
