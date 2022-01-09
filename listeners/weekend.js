const fs = require("fs");
const path = require('path');
const { MessageEmbed, Interaction } = require('discord.js');

module.exports = {
    name: 'weekend',
    group: 'INSA',
	  description: "listener d'ajout de role weekend",
    type: "messageReactionAdd",
	  place: "guild",
    async run(client, args) {
      console.log("a")
    }
}
