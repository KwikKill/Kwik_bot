const fs = require("fs");
const path = require('path');
const { MessageEmbed } = require('discord.js');
const config = require('../config.json');
const credits = require('../credits.json');

module.exports = {
	name: 'ntm',
	group: 'fun',
	description: "Permet de mute le bot 1h",
	permission: "none",
	hidden: false,
	serverid: ["513776796211085342", "480142959501901845", "890915473363980308"],
  deploy: true,
	place: "guild",
    help: [
        {
            "name": "- __ntm__ :",
            "value": "Mute le bot pendant 1h."
        },
    ],
    async run(message, client, interaction=undefined) {
      client.guilds.fetch("513776796211085342").then(guild => {
        console.log(guild)
      }
    }
}
