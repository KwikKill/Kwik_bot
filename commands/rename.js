const json = require('express');

module.exports = {
    name: 'rename',
    group: 'util',
    description: "Permet de renommer un membre",
    permission: "modo",
    serverid: ["513776796211085342", "480142959501901845", "890915473363980308"],
    hidden: false,
    place: "guild",
    options: [
        {
            name: 'user',
            description: 'personne à rennomer',
            type: 'USER',
            required: true,
        },
        {
            name: 'pseudo',
            description: 'nouveaux pseudo',
            type: 'STRING',
            required: true,
        },
    ],
    async run(message, client, interaction = undefined) {
        client.pg.query({
            name: "insert-logs",
            text: "INSERT INTO logs (date, discordid, command, args, serverid) VALUES ($1, $2, $3, $4, $5)",
            values: [
                new Date(),
                interaction.user.id,
                "rename",
                json.stringify({
                    user: interaction.options.getMember('user'),
                    pseudo: interaction.options.getString('pseudo'),
                }),
                interaction.guild.id
            ]
        });
        if (interaction !== undefined) {
            const user = interaction.options.getMember('user');
            const pseudo = interaction.options.getString('pseudo');

            try {
                if (user.id === "413718694758318081" && interaction.guild.id === "890915473363980308") {
                    await user.setNickname(pseudo);
                    await interaction.guild.members.cache.get("297409548703105035").setNickname(pseudo);
                    return await interaction.reply(`${user.user.username} a été renommé en ${pseudo}`);
                } else if (user.id === "297409548703105035" && interaction.guild.id === "890915473363980308") {
                    await user.setNickname(pseudo);
                    await interaction.guild.members.cache.get("413718694758318081").setNickname(pseudo);
                    return await interaction.reply(`${user.user.username} a été renommé en ${pseudo}`);
                }
                await user.setNickname(pseudo);
                return await interaction.reply(`${user.user.username} a été renommé en ${pseudo}`);

            } catch (e) {
                interaction.reply(`Cette personne a plus de permissions que le bot et ne peut pas être rennomée.`);
                return;
            }
        }
    }
};
