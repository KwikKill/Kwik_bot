//const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'lol',
    group: 'lol',
    description: "Commande lol",
    permission: "none",
    serverid: ["513776796211085342"],
    hidden: false,
    help: [
        {
            "name": "- __lol__ :",
            "value": "Test lol."
        },
    ],
    options: [
        {
            name: 'update',
            description: 'update all lol accounts',
            type: 'SUB_COMMAND_GROUP',
            options: [
                {
                    name: 'all',
                    description: 'update all lol accounts',
                    type: 'SUB_COMMAND'
                }
            ]
        }
    ],
    async execute(message, client, interaction = undefined) {
        if (interaction !== undefined) {
            await interaction.deferReply();
            if (interaction.options.getSubcommandGroup() === "update") {
                if (interaction.options.getSubcommand() === "all") {
                    await update(client, interaction);
                    await interaction.editReply("Update all lol accounts");
                }
            }
        }
    }
};

async function update(client, interaction) {
    const query = "SELECT discordid FROM summoners;";
    const result = await client.db.query(query);
    for (let i = 0; i < result.rows.length; i++) {
        client.requests["updates"].push({ "discordid": result.rows[i], "interaction": interaction, "matchs": [], "total": 0, "count": 0 });
    }
    await client.lol();
}