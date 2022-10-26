const fs = require("fs");
const path = require('path');
const { MessageEmbed, Interaction } = require('discord.js');

module.exports = {
    name: 'warn',
    group: 'core',
	description: "listener de gestion de warn discord",
    type: "warn",
	place: "guild",
    options: undefined,
    commande_channel: true,
    async run(client, args) {
        console.warn
    }
}