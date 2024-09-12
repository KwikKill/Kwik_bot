const { EmbedBuilder, ApplicationCommandOptionType, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'help',
    group: 'help',
    description: "Provides list of commands and corresponding help",
    hidden: false,
    place: "both",
    options: [
        {
            name: 'commande',
            description: 'Provides list of commands and corresponding help',
            type: ApplicationCommandOptionType.String,
            required: false,
            autocomplete: true
        },
    ],
    integration_types: [0, 1],
    async run(message, client, interaction = undefined) {
        if ((interaction === undefined && message.args[1] === undefined) || (interaction === undefined && message.args[1] === "help") || (interaction.options.getString('commande') === null) || (interaction.options.getString('commande') === "help")) {

            const embed1 = new EmbedBuilder()
                .setColor(0xffe402)
                .setAuthor({ name: "RankUpLoL", iconURL: client.user.avatarURL() })
                .setTitle("1️⃣ Commands :")
                .setDescription(
                    "To get more information about a command, use the `help` command followed by the desired command.\n" +
                    '__Example__ : `/help [command]`\n'
                )
                .setTimestamp();

            const embed2 = new EmbedBuilder()
                .setColor(0xffe402)
                .setAuthor({ name: "RankUpLoL", iconURL: client.user.avatarURL() })
                .setTitle("2️⃣ Owner Commands :")
                .setTimestamp();


            client.groups.each(group => {
                let commands = "";
                //if(group.guarded === false) {
                group.commands.each(cmd => {
                    if (cmd.owner !== true) {
                        if (client.canRunCommande(undefined, cmd, interaction) && (cmd.serverid === undefined || (interaction.guild && cmd.serverid?.includes(interaction.guild.id)))) {
                            if (commands !== "") {
                                commands = commands + ", ";
                            }
                            commands = commands + "`" + cmd.name + "`";
                        }
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
                /*if(await checkpermission(this.client, message, message.author, this.cmd.name) === true || (message.member !== undefined && message.member.hasPermission("ADMINISTRATOR"))) {
                    message.author.send("__" + this.cmd.name + "__ :\n" + premessages[this.cmd.name]["help"])
                }*/
                const embed = new EmbedBuilder()
                    .setColor(0xffe402)
                    .setAuthor({ name: "RankUpLoL", iconURL: client.user.avatarURL() })
                    .setTitle(cmd.name + " :")
                    .setDescription("`[]` : optional parameter\n`<>` : required parameter\n`<thing1 | thing2>` : select one of these options")
                    //.addFields(cmd.help)
                    .setTimestamp();
                if (cmd.options !== undefined) {
                    let optt = "";
                    cmd.options.forEach(option => {
                        if (option.type === "SUB_COMMAND_GROUP") {
                            for (const value2 of option.options) {
                                if (value2.options === undefined) {
                                    embed.addFields({ name: "- " + cmd.name + " " + option.name + " " + value2.name + " :", value: value2.description });
                                } else {
                                    let opt = "";
                                    for (const key2 of value2.options) {
                                        if (key2.required) {
                                            opt = opt + " <" + key2.name + ">";
                                        } else {
                                            opt = opt + " [" + key2.name + "]";
                                        }
                                    }
                                    embed.addFields({ name: "- " + cmd.name + " " + option.name + " " + value2.name + opt + " :", value: value2.description });
                                }
                            }
                        } else if (option.type === "SUB_COMMAND") {
                            if (option.options === undefined) {
                                embed.addFields({ name: "- " + cmd.name + " " + option.name + " :", value: option.description });
                            } else {
                                let opt = "";
                                for (const key2 of option.options) {
                                    if (key2.required) {
                                        opt = opt + " <" + key2.name + ">";
                                    } else {
                                        opt = opt + " [" + key2.name + "]";
                                    }
                                }
                                embed.addFields({ name: "- " + cmd.name + " " + option.name + opt + " :", value: option.description });
                            }
                        } else {
                            if (option.required) {
                                optt = optt + " <" + option.name + ">";
                            } else {
                                optt = optt + " [" + option.name + "]";
                            }

                        }
                    });
                    if (optt !== "") {
                        embed.addFields({ name: "- __" + cmd.name + " " + optt + "__ :", value: cmd.description });
                    }
                } else {
                    embed.addFields({ name: "- __" + cmd.name + "__ :", value: cmd.description });
                }

                if (interaction === undefined) {
                    message.channel.send({ embeds: [embed], reply: { messageReference: message.id }, allowedMentions: { repliedUser: false } });
                } else {
                    interaction.reply({ embeds: [embed] });
                }
            } else {
                if (interaction === undefined) {
                    message.channel.send({ content: "This command does not exist. To see the complete list of commands, use the command **help**", reply: { messageReference: message.id }, allowedMentions: { repliedUser: false } });
                } else {
                    interaction.reply({ content: "The `" + interaction.options.getString('commande') + "` command does not exist." });
                }
            }
        }
    },
    async autocomplete(client, interaction) {
        const focusedValue = interaction.options.getFocused();
        let cmds = [];
        // if the interaction is not in a guild, we return only the global commands
        if (interaction.guild === null) {
            client.commands.filter(cmd => cmd.name.startsWith(focusedValue) && (cmd.place === "dm" || cmd.place === "both") && (!cmd.serverid) && cmd.permission === PermissionsBitField.Flags.SendMessages).forEach(cmd => {
                cmds.push({ name: cmd.name, value: cmd.name });
            });
        } else {
            client.commands.filter(cmd => client.canRunCommande(undefined, cmd, interaction) && cmd.name.startsWith(focusedValue) && (cmd.place === "guild" || cmd.place === "both") && (cmd.serverid === undefined || cmd.serverid?.includes(interaction.guild.id))).forEach(cmd => {
                cmds.push({ name: cmd.name, value: cmd.name });
            });
        }
        if (cmds.length > 15) {
            cmds = cmds.slice(0, 15);
        }
        return await interaction.respond(cmds);
    },
};
