module.exports = {
    name: 'resetname',
    description: "Reset le nom d'un utilisateur.",
    permission: "modo",
    serverid: ["513776796211085342", "480142959501901845"],
    type: "USER",
    async run(interaction) {
        const user = interaction.options.getMember("user");
        user.setNickname(null).catch(() => {
            interaction.reply(`Cette personne a plus de permissions que le bot et ne peut pas être rennomée.`);
            return;
        });
        interaction.reply(`${user.user.username} a été renommé en ${user.user.username}`);
    }
};
