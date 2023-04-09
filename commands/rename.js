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
        if (interaction === undefined) {
            if (message.mentions.members.size === 1 && message.args.length === 3) {
                const user = message.mentions.members.first();
                const pseudo = message.args[2];
                if (user !== undefined) {
                    try {
                        await user.setNickname(pseudo);
                        message.channel.send(`${user.user.username} a été renommé en ${pseudo}`);
                        return;
                    } catch (e) {
                        message.channel.send(`Cette personne a plus de permissions que le bot et ne peut pas être rennomée.`);
                        return;
                    }
                }
            }
        } else {
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
