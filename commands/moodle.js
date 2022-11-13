const https = require('https');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'moodle',
    group: 'INSA',
    description: "Vérifie si moodle marche",
    permission: "none",
    hidden: false,
    serverid: ["513776796211085342", "480142959501901845", "890915473363980308"],
    deploy: true,
    place: "guild",
    help: [
        {
            "name": "- __moodle__ :",
            "value": "Vérifie si moodle marche."
        },
    ],
    async run(message, client, interaction = undefined) {
        if (interaction.user.bot) { return; }
        if (interaction === undefined) { return await message.reply("Utilise les commandes slash"); }

        https.get('https://wayf.insa-rennes.fr/wayf/WAYF?entityID=https%3A%2F%2Fmoodleng.insa-rennes.fr&return=https%3A%2F%2Fmoodleng.insa-rennes.fr%2FShibboleth.sso%2FLogin%3FSAMLDS%3D1%26target%3Dss%253Amem%253A83d8b2e30427a46ea9d50fe11c120e97969cc7dfbcb27c4daed0e8c23076b928', (res) => {
            if (res.statusCode !== 200) {
                const embed = new MessageEmbed()
                    .setColor("0xffe402")
                    .setTitle("Shibboleth")
                    .setDescription("Shibboleth ne marche pas (" + res.statusCode + ")")
                    .setTimestamp();
                return interaction.reply({ embeds: [embed] });
            }
            https.get('https://moodleng.insa-rennes.fr/', (res) => {
                if (res.statusCode === 200) {
                    const embed = new MessageEmbed()
                        .setColor("0xffe402")
                        .setTitle("Moodle")
                        .setDescription("Moodle marche")
                        .setTimestamp();
                    return interaction.reply({ embeds: [embed] });
                }
                const embed = new MessageEmbed()
                    .setColor("0xffe402")
                    .setTitle("Moodle")
                    .setDescription("Moodle ne marche pas <:503:1034543332283650169>")
                    .setTimestamp();
                return interaction.reply({ embeds: [embed] });
            });
        });
    }
};
