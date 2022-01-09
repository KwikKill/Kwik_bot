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
        if(message.embeds[0].description == "Réagissez sur la réaction ✅ pour vous mettre ou enlever le rôle week end.") {
            role = message.message.guild.roles.cache.get("929445487138996234")
            member = await message.message.guild.members.fetch(user.id)
            member.roles.add(role)   
        }
    }
}
