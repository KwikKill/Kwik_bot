const fs = require("fs");
const path = require('path');
const { MessageEmbed } = require('discord.js');
const roles = require('../roles.json');

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
    }
}
