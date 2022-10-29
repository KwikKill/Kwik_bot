const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ntm',
    group: 'fun',
    description: "Permet de mute le bot 1h",
    permission: "none",
    hidden: false,
    serverid: ["513776796211085342", "480142959501901845", "890915473363980308"],
    deploy: true,
    place: "guild",
    help: [
        {
            "name": "- __ntm__ :",
            "value": "Mute le bot pendant 1h."
        },
    ],
    async run(message, client, interaction=undefined) {
        client.channels.fetch("948352104769151047").then(channel => {
            channel.messages.fetch().then(message => {
                if(message.first().embeds[0].description === interaction.channel.guild.id) {
                    const date = new Date(message.first().embeds[0].timestamp);
			        const now = new Date();
                    if(((now - date)/1000/60/60) < 1) {
                        const embed = new MessageEmbed()
                            .setColor("0xffe402")
                            .setTitle("mute")
                            .setDescription("undefined")
                            .setTimestamp();
                        channel.send({embeds: [embed]});
                        interaction.reply("Le bot a été démute");
                    }else {
                        const embed = new MessageEmbed()
                            .setColor("0xffe402")
                            .setTitle("mute")
                            .setDescription(interaction.channel.guild.id)
                            .setTimestamp();
                        channel.send({embeds: [embed]});
                        interaction.reply("Le bot a été mute une heure");
                    }
                }else {
                    const embed = new MessageEmbed()
                        .setColor("0xffe402")
                        .setTitle("mute")
                        .setDescription(interaction.channel.guild.id)
                        .setTimestamp();
                    channel.send({embeds: [embed]});
                    interaction.reply("Le bot a été mute une heure");
                }
            });
        });
    }
};
