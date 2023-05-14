module.exports = {
    name: 'guildCreate',
    group: 'core',
    description: "listener d'ajout à une guild",
    type: "guildCreate",
    place: "guild",
    options: undefined,
    async run(client, guild) {
        await client.commands.get("deploy").deploy(client, guild);
    }
};