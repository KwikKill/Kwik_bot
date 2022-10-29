module.exports = {
    name: 'setminprice',
    group: 'mudae',
    description: "Permet de définir l'enchère minimum au dessus du dernière prix",
    permission: "none",
    serverid: ["513776796211085342", "480142959501901845"],
    hidden: false,
    place: "guild",
    help: [
        {
            "name": "- __/setminprice <somme>__ :",
            "value": "définie l'enchère minimum au dessus du dernière prix à <somme>",
        },
    ],
    options: [
        {
            name: 'somme',
            description: 'somme à enchérir',
            type: 'INTEGER',
            required: true,
        },
    ],
    async run(message, client, interaction=undefined) {
        if(interaction !== undefined) {
            if(interaction.channel.type === "GUILD_PUBLIC_THREAD") {
                if(interaction.channel.name.startsWith("[A VENDRE]")) {
                    const somme = interaction.options.getInteger('somme');
                    if(somme < 1000) {

                        let msg = await interaction.channel.messages.fetchPinned();
                        msg = msg.last();
                        //const prix_min = msg.content.split(" ")[45];
                        const content = msg.content.split(" ");
                        let msssg = content.slice(0, 45).join(" ");
                        msssg += " " + somme;
                        msg.edit(msssg);
                        interaction.channel.send("enchère minimum au dessus du dernier prix définie à " + somme);
                    }
                }
            }
        }
    }
};
