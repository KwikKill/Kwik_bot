const config = require('../config.json');

module.exports = {
    name: 'deploy',
    group: 'moderation',
    description: "Commande de déploiement des commandes slash",
    permission: "owner",
    hidden: false,
    help: [
        {
            "name": "- __deploy__ :",
            "value": "Déploie les commandes slash."
        }
    ],
    place: "guild",
    options: undefined,
    commande_channel: true,
    async run(message, client, interaction = undefined, mssg = true) {

        let number;

        if (interaction === undefined) {
            number = await deploy(client, message.guild);
        } else {
            number = await deploy(client, interaction.guild);
        }

        if (interaction === undefined) {

            if (mssg === true) {
                message.channel.send({ content: "Les " + number + " commandes slash et menus contextuels ont bien été déployées", reply: { messageReference: message.id }, allowedMentions: { repliedUser: false } });
            }
        } else {
            if (mssg === true) {
                await interaction.reply({ content: "Les " + number + " commandes slash et menus contextuels ont bien été déployées", ephemeral: true });
            }
        }


    },
    auto_deploy,
    deploy
};

async function auto_deploy(client) {
    for (const guild of client.guilds.cache.values()) {
        const number = await deploy(client, guild);
        if (config.verbose) {
            console.log("- auto-deploy for guild " + guild.id + " : " + number);
        }
    }
}

async function deploy(client, guild) {
    const commands = [];

    const permission = {};

    permission["none"] = [];
    permission["modo"] = [];
    permission["owner"] = client.owners;

    /*let roles = guild.roles.cache;
    roles.forEach(role => {
        if (role.permissions.has("ADMINISTRATOR") && !role.managed) {
            permission["modo"].push(role.id);
        }
    });
    */

    client.commands.forEach((item) => {
        if (item.deploy !== false && (item.serverid === undefined || item.serverid !== undefined && item.serverid.includes(guild.id))) {
            if (item.name === "help") {
                const choices = [];
                client.commands.forEach((item2) => {
                    choices.push({
                        name: item2.name,
                        value: item2.name,
                        defaultPermission: item2.permission === "none",
                    });
                });
                const options = item.options;
                options[0]["choices"] = choices;
                commands.push({
                    name: item.name,
                    description: item.description,
                    options: options,
                    defaultPermission: item.permission === "none",
                });
            } else {
                if (item.options !== undefined) {
                    commands.push({
                        name: item.name,
                        description: item.description,
                        options: item.options,
                        defaultPermission: item.permission === "none",
                    });
                } else {
                    commands.push({
                        name: item.name,
                        description: item.description,
                        defaultPermission: item.permission === "none",
                    });
                }
            }
        }
    });

    client.context_menu.forEach((item) => {
        if (item.serverid === undefined || item.serverid !== undefined && item.serverid.includes(guild.id)) {
            commands.push({
                name: item.name,
                type: item.type,
                defaultPermission: item.permission === "none",
            });
        }
    });

    await guild.commands.set(commands);
    return commands.length.toString();

    /*
    command.forEach((commande) => {
        if (commande.type === "CHAT_INPUT") {
            const perms = [];
            const perm = client.commands.get(commande.name).permission;
            for (const x in permission[perm]) {
                if (interaction === undefined) {
                    if (message.guild.roles.cache.get(permission[perm][x]) !== undefined) {
                        perms.push({
                            id: permission[perm][x],
                            type: "ROLE",
                            permission: true,
                        });
                    } else {
                        perms.push({
                            id: permission[perm][x],
                            type: "USER",
                            permission: true,
                        });
                    }
                } else {
                    if (interaction.guild.roles.cache.get(permission[perm][x]) !== undefined) {
                        perms.push({
                            id: permission[perm][x],
                            type: "ROLE",
                            permission: true,
                        });
                    } else {
                        perms.push({
                            id: permission[perm][x],
                            type: "USER",
                            permission: true,
                        });
                    }
                }
            }
            if (perms.length !== 0) {
                //console.log(commande.name, {permissions: perms})
                //commande.permissions.set({permissions: perms})
            }
        } else {
            const perms = [];
            const perm = client.context_menu.get(commande.name).permission;
            for (const x in permission[perm]) {
                if (interaction === undefined) {
                    if (message.guild.roles.cache.get(permission[perm][x]) !== undefined) {
                        perms.push({
                            id: permission[perm][x],
                            type: "ROLE",
                            permission: true,
                        });
                    } else {
                        perms.push({
                            id: permission[perm][x],
                            type: "USER",
                            permission: true,
                        });
                    }
                } else {
                    if (interaction.guild.roles.cache.get(permission[perm][x]) !== undefined) {
                        perms.push({
                            id: permission[perm][x],
                            type: "ROLE",
                            permission: true,
                        });
                    } else {
                        perms.push({
                            id: permission[perm][x],
                            type: "USER",
                            permission: true,
                        });
                    }
                }
            }
            if (perms.length !== 0) {
                //console.log(commande.name, {permissions: perms})
                //console.log(perms)
                //commande.permissions.set({permissions: perms})
            }
        }
    });*/
}