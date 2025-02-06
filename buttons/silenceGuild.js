const { EmbedBuilder, AttachmentBuilder, PermissionsBitField, ApplicationCommandOptionType, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'silence_guild',
    async run(interaction, client) {

        await interaction.deferReply();

        const lastEmbed = interaction.message.embeds[0];

        // Get the guild id (Field[x].name === "Guild Id")
        const guildId = lastEmbed.fields.find(field => field.name === "Guild Id").value;
        if (!guildId) {
            return interaction.reply({ content: "The guild id was not found in the embed message.", ephemeral: true });
        }

        // Mute the guild
        client.commands.get('lol').account_silence_guild(client, interaction, guildId);

        // Edit the last embed message and remove the action row
        const newEmbed = new EmbedBuilder()
        .setTitle(lastEmbed.title)
        .setDescription(lastEmbed.description)
        .setColor("#A9A9A9")
        .addFields(lastEmbed.fields)
        .setFooter({ text: "Guild silenced" });
        
        await interaction.message.edit({ embeds: [newEmbed], components: [] });


    },
}