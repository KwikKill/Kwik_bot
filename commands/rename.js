module.exports = {
    name: 'rename',
    group: 'util',
    description: "Permet de renommer un membre",
    permission: "modo",
    serverid: ["513776796211085342", "480142959501901845", "890915473363980308"],
    hidden: false,
    place: "guild",
    help: [
        {
            "name": "- __rename <@user> <pseudo>__ :",
            "value": "Rennome <@user> en <pseudo>."
        },
    ],
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
    async run(message, client, interaction=undefined) {
        if(interaction === undefined) {
            if(message.mentions.members.size === 1 && message.args.length === 3) {
                const user = message.mentions.members.first();
                const pseudo = message.args[2];
                if(user !== undefined) {
                    user.setNickname(pseudo).catch(() => {
                        message.channel.send(`Cette personne a plus de permissions que le bot et ne peut pas être rennomée.`);
                        return;
                    });
                    message.channel.send(`${user.user.username} a été renommé en ${pseudo}`);
                }
            }
        }else {
            const user = interaction.options.getMember('user');
            const pseudo = interaction.options.getString('pseudo');

            user.setNickname(pseudo).catch(() => {
                interaction.reply(`Cette personne a plus de permissions que le bot et ne peut pas être rennomée.`);
                return;
            });
            interaction.reply(`${user.user.username} a été renommé en ${pseudo}`);

        }
    }
};
