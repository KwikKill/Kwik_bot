const fs = require("fs");
const path = require('path');
const config = require('../../config.json');
const credits = require('../../credits.json');

module.exports = {
    name: 'credit',
    group: 'mudae',
    description: "Commande de gestion de crédit",
    permission: "owner",
    hidden: true,
    serverid: ["513776796211085342", "480142959501901845"],
    place: "guild",
    help: [
        {
            "name": "- __credit activate <true/false>__ :",
            "value": "Active ou désactive la fonctionnalité de crédit."
        },
        {
            "name": "- __credit add <user> <number>__ :",
            "value": "Ajoute <number> de crédit à <user>."
        },
        {
            "name": "- __credit remove <user> <number>__ :",
            "value": "supprime <number> de crédit à <user>."
        },
        {
            "name": "- __credit set <user> <number>__ :",
            "value": "met <number> crédit à <user>."
        },
        {
            "name": "- __credit view <user> __ :",
            "value": "affiche le nombre de crédit de <user>."
        },
    ],
    options: [
        {
            name: 'activate',
            description: 'Active la fonctionnalité de crédit',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'value',
                    description: 'true/false',
                    type: 'STRING',
                    required: true,
                    autocomplete: true,
                    choice: [
                        {
                            name: 'true',
                            value: 'true'
                        },
                        {
                            name: 'false',
                            value: 'false'
                        }
                    ]
                }
            ]
        },
        {
            name: 'add',
            description: 'Permet d\'ajouter des crédits',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'user',
                    description: 'user',
                    type: 'USER',
                    required: true,
                },
                {
                    name: 'somme',
                    description: 'somme',
                    type: 'INTEGER',
                    required: true,
                }
            ]
        },
        {
            name: 'remove',
            description: 'Permet de retirer des crédits',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'user',
                    description: 'user',
                    type: 'USER',
                    required: true,
                },
                {
                    name: 'somme',
                    description: 'somme',
                    type: 'INTEGER',
                    required: true,
                }
            ]
        },
        {
            name: 'set',
            description: 'Permet de définir les crédits d\'un utilisateur',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'user',
                    description: 'user',
                    type: 'USER',
                    required: true,
                },
                {
                    name: 'somme',
                    description: 'somme',
                    type: 'INTEGER',
                    required: true,
                }
            ]
        },
        {
            name: 'view',
            description: 'Permet de voir les crédits d\'un utilisateur',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'user',
                    description: 'user',
                    type: 'USER',
                    required: true,
                }
            ]
        },
    ],
    async run(message, client, interaction=undefined) {
        if(interaction !== undefined) {
            if(interaction.options.getSubcommand() === "activate") {
                const value = interaction.options.getString("value");
                if(value === "true") {
                    config.credit = true;
                    await fs.writeFile(path.join(__dirname, "..", "config.json"), JSON.stringify(config,null,4), (err) => {
                        if (err) console.log(err);
                    });
                    interaction.reply("La fonctionnalité de crédit est activée.");
                } else if(value === "false") {
                    config.credit = false;
                    await fs.writeFile(path.join(__dirname, "..", "config.json"), JSON.stringify(config,null,4), (err) => {
                        if (err) console.log(err);
                    });
                    interaction.reply("La fonctionnalité de crédit est désactivée.");
                }else {
                    console.log(value);
                }
            }else if(interaction.options.getSubcommand() === "add") {
                const user = interaction.options.getUser("user");
                const somme = interaction.options.getInteger("somme");
                if(credits[user.id] === undefined) {
                    credits[user.id] = 0;
                }
                credits[user.id] += somme;
                await fs.writeFile(path.join(__dirname, "..", "credits.json"), JSON.stringify(credits,null,4), (err) => {
                    if (err) console.log(err);
                });
                interaction.reply("**"+user.username+"** a bien reçu **"+somme+"** crédit(s).");
            }else if(interaction.options.getSubcommand() === "view") {
                const user = interaction.options.getUser("user");
                if(credits[user.id] === undefined) {
                    credits[user.id] = 0;
                }
                interaction.reply("**"+user.username+"** a **"+credits[user.id]+"** crédit(s).");
            }else if(interaction.options.getSubcommand() === "remove") {
                const user = interaction.options.getUser("user");
                const somme = interaction.options.getInteger("somme");
                if(credits[user.id] === undefined) {
                    credits[user.id] = 0;
                }
                credits[user.id] -= somme;
                await fs.writeFile(path.join(__dirname, "..", "credits.json"), JSON.stringify(credits,null,4), (err) => {
                    if (err) console.log(err);
                });
                interaction.reply("**"+user.username+"** a bien perdu **"+somme+"** crédit(s).");
            }else if(interaction.options.getSubcommand() === "set") {
                const user = interaction.options.getUser("user");
                const somme = interaction.options.getInteger("somme");
                if(credits[user.id] === undefined) {
                    credits[user.id] = 0;
                }
                credits[user.id] = somme;
                await fs.writeFile(path.join(__dirname, "..", "credits.json"), JSON.stringify(credits,null,4), (err) => {
                    if (err) console.log(err);
                });
                interaction.reply("**"+user.username+"** a bien **"+somme+"** crédit(s).");
            }
        }
    }
};
