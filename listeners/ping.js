const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ping',
    group: 'fun',
    description: "gestionnaire de pings",
    type: "messageCreate",
    place: "guild",
    options: undefined,
    commande_channel: true,
    async run(client, msg) {
        if (msg.content.includes("<@!297409548703105035>")) {

            const embed = new MessageEmbed()
                .setColor(msg.author.hexAccentColor)
                .setTitle("Vous avez été ping dans " + msg.guild.name + " :")
                .setAuthor(msg.author.username, msg.author.displayAvatarURL(), "https://discord.com/channels/" + msg.guild.id + "/" + msg.channel.id + "/" + msg.id)
                .setDescription(
                    msg.content
                )
                .setTimestamp();

            msg.guild.members.cache.get("297409548703105035").send({ embeds: [embed] });
        }
    }
};
