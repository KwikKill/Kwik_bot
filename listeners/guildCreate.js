module.exports = {
    name: 'guildCreate',
    group: 'core',
    description: "listener d'ajout à une guild",
    type: "guildCreate",
    place: "guild",
    options: undefined,
    async run(client, guild) {
        const first_channel = guild.channels.cache.find(channel => channel.type === "GUILD_TEXT" && channel.permissionsFor(guild.me).has("SEND_MESSAGES"));
        let message;
        if (first_channel) {
            message = await first_channel.send({ content: "Deploying commands,..." });
        }
        await client.commands.get("deploy").deploy(client, guild);
        if (message) {
            await message.edit("Deployed !");
        }
    }
};