const fs = require("fs");
const path = require('path');
const { MessageEmbed, Interaction } = require('discord.js');

module.exports = {
    name: 'weekend2',
    group: 'INSA',
    description: "listener de supression de role weekend",
    type: "messageReactionRemove",
    place: "guild",
    async run(client, message, user) {
    	role = message.message.guild.roles.cache.get("929445487138996234")
    	member = await message.message.guild.members.fetch(user.id)
        member.roles.remove(role)
    }
}
