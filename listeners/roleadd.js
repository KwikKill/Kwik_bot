const roles = require('../roles.json');

module.exports = {
    name: 'roleadd',
    group: 'INSA',
    description: "listener d'ajout de roles",
    type: "messageReactionAdd",
    place: "guild",
    async run(client, message, user) {
        if (user.bot) {
            return;
        }
        const ch = await message.message.guild.channels.fetch(message.message.channelId);
        const msg = await ch.messages.fetch(message.message.id);
        if (msg.embeds[0] !== undefined) {
            if (msg.embeds[0].description === "Réagissez sur un émoji pour avoir le rôle correspondant." && user.id !== client.user.id) {
                for (const role in roles) {
                    if (roles[role]["emoji"] === message.emoji.name) {
                        const roletoadd = message.message.guild.roles.cache.get(roles[role]["role"]);
                        const member = await message.message.guild.members.fetch(user.id);
                        member.roles.add(roletoadd);
                    }
                }
            }
        }
    }
};
