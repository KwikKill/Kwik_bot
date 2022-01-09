const fs = require("fs");
const path = require('path');
const { MessageEmbed, Interaction } = require('discord.js');

module.exports = {
    name: 'weekend',
    group: 'INSA',
    description: "listener d'ajout de role weekend",
    type: "messageReactionAdd",
    place: "guild",
    async run(client, message, user) {
    	role = message.message.guild.roles.cache.get("929445487138996234")
    	member = await guild.members.fetch(user.id)
        member.roles.add(role)
    }
}
