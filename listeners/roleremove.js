const fs = require("fs");
const path = require('path');
const { MessageEmbed, Interaction } = require('discord.js');

module.exports = {
    name: 'roleremove',
    group: 'INSA',
    description: "listener de supression de roles",
    type: "messageReactionRemove",
    place: "guild",
    async run(client, message, user) {
        ch = await message.message.guild.channels.fetch(message.message.channelId)
        msg = await ch.messages.fetch(message.message.id)
        
        if(msg.embeds[0].description == "Réagissez sur un émoji pour avoir le rôle correspondant." && user.id != client.user.id) {
            for(const role in roles) {
                if(roles[role]["emoji"] == message.emoji.name) {
                    role = message.message.guild.roles.cache.get(roles[role]["role"])
                    member = await message.message.guild.members.fetch(user.id)
                    member.roles.remove(role)   
                }
            }
        }
    }
}
