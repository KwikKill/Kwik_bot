const config = require('../config.json');

module.exports = {
    name: 'messageCreate',
    group: 'core',
    description: "listener de gestion de message",
    type: "messageCreate",
    place: "guild",
    options: undefined,
    async run(client, message) {
        //config = JSON.parse(fs.readFileSync(path.join(__dirname, "config.json"), "utf8"));
        if (message.partial) {
            message = await message.fetch();
        }

        if (message.author.bot) return;
        const args = message.content.split(/ |\n/);
        if (message.content.charAt(0) === config["prefix"]) {
            args[0] = args[0].slice(1);
            const commande = await client.commands.get(args[0]);
            if (commande !== undefined) {
                message.command = commande;
                message.args = args;
                if (client.canRunCommande(message, commande)) {
                    await commande.run(message, client).catch(err => {
                        console.log(err);
                        message.channel.send("Une erreur inattendue s'est produite lors de l'exécution de la commande.\nCette erreur a été transmise et sera réglée au plus vite.");
                        const owner = client.users.cache.get(client.owners[0]);
                        owner.send("Une erreur inattendue s'est produite lors de l'exécution de la commande `" + message.content.toString() + "` par <@" + message.author.id.toString() + "> :\n```" + err.stack.toString() + "```");
                    });
                    return;
                }
            }
        } else {
            message.command = undefined;
        }
    }
};