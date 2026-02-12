const { EmbedBuilder, AttachmentBuilder, PermissionsBitField, ApplicationCommandOptionType, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'announcement',
    async run(interaction, client) {

        // Get the infos from the modal
        const title = interaction.fields.getTextInputValue('title');
        const description = interaction.fields.getTextInputValue('description');
        const thumbnail = interaction.fields.getTextInputValue('thumbnail');
        const color = interaction.fields.getTextInputValue('color');
        const footer = interaction.fields.getTextInputValue('footer');

        // check if color is a valid hex color
        if (!/^#[0-9A-F]{6}$/i.test(color)) {
            await interaction.reply({ content: "Please provide a valid hex color", ephemeral: true });
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setColor(color);
        
        if (thumbnail) embed.setThumbnail(thumbnail);
        if (footer) {
            const footer_data = {
                text: footer,
                iconURL: client.user.avatarURL()
            }

            embed.setFooter(footer_data);
        }

        // Send the announcement
        client.lol.lol_rank_manager.trackers.forEach(ch => {
            client.channels.fetch(ch.channel).then(chs => {
                chs.send({ embeds: [embed] }).catch(err => {
                    console.error("Error sending announcement to channel " + ch.channel + ": " + err);
                });
            }).catch(err => {
                console.error("Error fetching channel " + ch.channel + ": " + err);
            });
        });

        // Send a message to the user
        const embed2 = new EmbedBuilder()
            .setTitle("Announcement")
            .setDescription(`The announcement has been sent to all the trackers`)
            .setColor("#00FF00");

        await interaction.reply({ embeds: [embed2] });
    },
}