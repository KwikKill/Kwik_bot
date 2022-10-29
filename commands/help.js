const fs = require("fs");
const path = require('path');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'help',
    group: 'help',
    description: "Fournit la liste des commandes et l'aide correspondante",
    permission: "none",
    hidden: false,
    serverid: ["513776796211085342", "480142959501901845"],
    place: "both",
    help: [
        {
            "name": "- __help__ :",
            "value": "Affiche les commandes disponibles."
        },
        {
            "name": "- __help [commande]__ :",
            "value": "Affiche l'aide de la commande spécifiée'."
        }
    ],
    options: [
        {
            name: 'commande',
            description: 'Nom de la commande',
            type: 'STRING',
            required: false,
        },
    ],
    async run(message, client, interaction = undefined) {
        const config = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "config.json"), "utf8"));

        if ((interaction === undefined && message.args[1] === undefined) || (interaction === undefined && message.args[1] === "help") || (interaction.options.getString('commande') === null) || (interaction.options.getString('commande') === "help")) {

            const embed1 = new MessageEmbed()
                .setColor("0xffe402")
                .setTitle("1️⃣Commandes :")
                .setAuthor("KwikBot", client.user.avatarURL(), 'https://github.com/KwikKill/Gab_bot')
                .setDescription(
                    "Pour avoir plus d'information sur une commande, utiliser la commande `help` suivie de la commande voulue.\n" +
                    '__Exemple__ : `' + config["prefix"] + 'help setup`\n' +
                    "Le préfix est `" + config["prefix"] + '` ou `@mention`\n' +
                    '__Exemple__ : `' + config["prefix"] + 'help` ou `@Gab_bot help`\n'
                )
                .setTimestamp();

            const embed2 = new MessageEmbed()
                .setColor("0xffe402")
                .setTitle("2️⃣Commands Owner :")
                .setAuthor("KwikBot", client.user.avatarURL(), 'https://github.com/KwikKill/Gab_bot')
                .setTimestamp();


            client.groups.each(group => {
                let commands = "";
                //if(group.guarded === false) {
                group.commands.each(cmd => {
                    if (cmd.permission !== "owner") {
                        if (commands !== "") {
                            commands = commands + ", ";
                        }
                        commands = commands + "`" + cmd.name + "`";
                    } else {
                        embed2.addFields({ name: "- __" + cmd.name + "__:", value: cmd.description });
                    }
                });
                if (commands !== "") {
                    embed1.addFields({ name: "- __" + group.name + "__: ", value: commands });
                }
                //}else {
                //	group.commands.each(cmd => {
                //		embed3.addFields({name: "- __" + cmd.name + "__:" , value: cmd.description})
                //	})
                //}
            });
            if (interaction === undefined) {
                message.channel.send({ embeds: [embed1], reply: { messageReference: message.id }, allowedMentions: { repliedUser: false } });
                if (client.isOwner(message.author)) {
                    message.author.send({ embeds: [embed2] });
                }
            } else {
                interaction.reply({ embeds: [embed1] });

                if (client.isOwner(interaction.user)) {
                    interaction.user.send({ embeds: [embed2] });
                }
            }
        } else {
            let cmd;
            if (interaction === undefined) {
                cmd = client.commands.get(message.args[1]);
            } else {
                cmd = client.commands.get(interaction.options.getString('commande'));
            }
            if (cmd) {
                if (cmd.help !== undefined) {
                    /*if(await checkpermission(this.client, message, message.author, this.cmd.name) === true || (message.member !== undefined && message.member.hasPermission("ADMINISTRATOR"))) {
                        message.author.send("__" + this.cmd.name + "__ :\n" + premessages[this.cmd.name]["help"])
                    }*/
                    const embed = new MessageEmbed()
                        .setColor("0xffe402")
                        .setTitle(cmd.name + " :")
                        .setDescription("`[]` : paramètre optionel\n`<>` : paramètre requis\n`<thing1 | thing2>` : sélectionnez une de ces options")
                        .setAuthor("KwikBot", client.user.avatarURL(), 'https://github.com/KwikKill/Gab_bot')
                        .addFields(cmd.help)
                        .setTimestamp();
                    if (interaction === undefined) {
                        message.channel.send({ embeds: [embed], reply: { messageReference: message.id }, allowedMentions: { repliedUser: false } });
                    } else {
                        interaction.reply({ embeds: [embed] });
                    }
                }
            } else {
                if (interaction === undefined) {
                    message.channel.send({ content: "Cette commande n'existe pas. Pour voir la liste complete des commandes, utilisez la commande **help**", reply: { messageReference: message.id }, allowedMentions: { repliedUser: false } });
                } else {
                    interaction.reply({ content: "La commande `" + interaction.options.getString('commande') + "` n'existe pas." });
                }
            }
        }
    }
};
