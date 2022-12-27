const fs = require("fs");

module.exports = {
    name: 'guildMemberAdd',
    group: 'core',
    description: "listener de gestion de nouveau membre",
    type: "guildMemberAdd",
    place: "guild",
    options: undefined,
    async run(client, member) {
        try {
            const welcome = JSON.parse(fs.readFileSync("./welcome.json", "utf8"));
            if (welcome[member.guild.id] === undefined) {
                return;
            }
            if (welcome[member?.guild?.id].channel) {
                const welcomechannel = member.guild.channels.cache.get(welcome[member.guild.id].channel);

                if (!welcomechannel) {
                    return undefined;
                }
                welcomechannel.send(welcome[member.guild.id].message + ` ${member}`);
            }
        } catch (err) {
            console.log(err);
        }
    }
};