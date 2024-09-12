const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'info',
    group: 'help',
    description: "Gives information about the bot",
    hidden: false,
    place: "both",
    integration_types: [0, 1],
    async run(message, client, interaction = undefined) {
        client.pg.query({
            name: "insert-logs",
            text: "INSERT INTO logs (date, discordid, command, args, serverid) VALUES ($1, $2, $3, $4, $5)",
            values: [
                new Date(),
                interaction.user.id,
                "info",
                JSON.stringify({
                }),
                interaction.guild ? interaction.guild.id : interaction.user.id
            ]
        });
        if (interaction !== undefined) {
            await interaction.deferReply();

            const embed = new EmbedBuilder()
                .setColor(0xffe402)
                .setAuthor({ name: "RankUpLoL", iconURL: client.user.avatarURL() })
                .setTitle("Information about the Bot")
                .addFields(
                    {
                        name: " - Description",
                        value:
                            "RankUpLoL is a bot that allows you to see your league of legends stats.\n" +
                            "It is possible to filter your games by champion, role, queue and more.\n" +
                            "The bot can also send a message when someone played a ranked.\n" +
                            "RankUpLoL is still in development, so there may be bugs.\n" +
                            "If you find a bug, please report it on the [support server](https://discord.gg/bGmbQPMpVj)\n" +
                            "If you have any suggestions, I will be happy to hear them on the [support server](https://discord.gg/bGmbQPMpVj)\n" +
                            "If you want to support the bot, please vote for it on [top.gg](https://top.gg/bot/559371363035381777)\n"
                    },
                    {
                        name: " - Commands",
                        value: "You can see all the commands with `/help`"
                    }
                )
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        }
    }
};