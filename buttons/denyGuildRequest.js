const { EmbedBuilder, AttachmentBuilder, PermissionsBitField, ApplicationCommandOptionType, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'deny_guild_request',
    async run(interaction, client) {

        // Edit the last embed message and remove the action row
        const lastEmbed = interaction.message.embeds[0];
        const newEmbed = new EmbedBuilder()
        .setTitle(lastEmbed.title)
        .setDescription(lastEmbed.description)
        .setColor("#A9A9A9")
        .addFields(lastEmbed.fields)
        .setFooter({ text: "Request denied" });
        

        await interaction.message.edit({ embeds: [newEmbed], components: [] });

        // Send a message to the user
        const embed = new EmbedBuilder()
        .setTitle("Account Link Request")
        .setDescription(`You've denied the request. \nYou can always link your account later with the command \`/lol account add\``)
        .setColor("#FF0000");

        await interaction.reply({ embeds: [embed] });
    },
}