const { EmbedBuilder, AttachmentBuilder, PermissionsBitField, ApplicationCommandOptionType, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'accept_guild_request',
    async run(interaction, client) {

        const lastEmbed = interaction.message.embeds[0];

        // Get the gamename, tagline and region
        const gamename = lastEmbed.fields.find(field => field.name === "Game Name").value;
        const tagline = lastEmbed.fields.find(field => field.name === "Tagline").value;
        const region = lastEmbed.fields.find(field => field.name === "Region").value;
        if (!gamename || !tagline || ! region) {
            return interaction.reply({ content: "The account infos were not found in the embed message. You can use `/lol account add` to manually add your account", ephemeral: true });
        }

        // Edit the last embed message and remove the action row
        const newEmbed = new EmbedBuilder()
        .setTitle(lastEmbed.title)
        .setDescription(lastEmbed.description)
        .setColor("#A9A9A9") // Darker grey color
        .addFields(lastEmbed.fields)
        .setFooter({ text: "Request Accepted" });
        

        await interaction.message.edit({ embeds: [newEmbed], components: [] });

        // Send a message to the user
        const embed = new EmbedBuilder()
        .setTitle("Account Link Request")
        .setDescription(`You've accepted the request. This message will be edited once the account is found`)
        .setColor("#00FF00");

        await interaction.reply({ embeds: [embed] });

        // Add the account
        client.commands.get('lol').account_add(client, interaction, gamename, tagline, region);
    },
}