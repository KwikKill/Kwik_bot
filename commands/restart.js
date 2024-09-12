const child_process = require('child_process');
const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'restart',
    group: 'moderation',
    deploy: false,
    description: "Commande de restart du bot",
    permission: PermissionsBitField.Flags.Administrator,
    owner: true,
    hidden: false,
    place: "dm",
    options: undefined,
    async run() {
        console.log("Restarting...");
        child_process.exec("update-gab_bot.sh");
        process.exit(1);
    }
};
