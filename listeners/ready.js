const config = require('../config.json');
const fs = require("fs");
const path = require('path');
const packageJSON = require("../package.json");
const { MessageEmbed, Interaction } = require('discord.js');

module.exports = {
    name: 'ready',
    group: 'core',
	description: "listener de gestion de message",
    type: "ready",
	place: "guild",
    options: undefined,
    async run(client, args) {
        console.log(discordJSVersion);
        console.log('Le bot est démarré !');
        client.user.setActivity("[insert savun twomp]", { type: 'LISTENING' });
    }
}