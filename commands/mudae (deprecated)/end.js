module.exports = {
    name: 'end',
    group: 'mudae',
    description: "Commande de fin d'enchère",
    permission: "none",
    hidden: false,
    serverid: ["513776796211085342", "480142959501901845"],
    help: [
        {
            "name": "- __end__ :",
            "value": "Termine l'enchère en cours."
        }
    ],
    place: "guild",
    options: undefined,
    commande_channel: true,
    async run(message, client, interaction=undefined) {
        if(interaction === undefined) return;
        if(interaction.channel.type === "GUILD_PUBLIC_THREAD") {
            if(interaction.channel.name.startsWith("[A VENDRE]")) {
                let msg = await interaction.channel.messages.fetchPinned();
                msg = msg.last();
                if(interaction.member.user.id === msg.mentions.users.first().id) {
                    interaction.channel.setArchived(true, "fin de l'enchère");
                }
            }
        }else{
            interaction.reply("Cette commande n'est pas disponible dans ce channel.");
        }
    }
};
