const fs = require("fs");
const path = require('path');
const { MessageEmbed } = require('discord.js');

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
    async run(message, client, interaction=undefined, mssg=true) {
        commands = []
        
        permission = {}

        permission["none"] = []
        permission["modo"] = []
        permission["owner"] = client.owners

        if(interaction == undefined) {
            roles = message.guild.roles.cache
        }else{
            roles = interaction.guild.roles.cache
        }
        roles.forEach(role => {
            if(role.permissions.has("ADMINISTRATOR") && !role.managed) {
                permission["modo"].push(role.id)
            }
        })

        client.commands.forEach((item, i) => {
        if(item.deploy != false && ((item.serverid != undefined && interaction != undefined && interaction.guild.id == item.serverid) || (item.serverid != undefined && message.guild.id == item.serverid))) {
            if(item.name == "help") {
                choices = []
                client.commands.forEach((item2, i) => {
                    choices.push({
                        name: item2.name,
                        value: item2.name,
                        defaultPermission: item2.permission == "none",
                    })
                });
                options = item.options
                options[0]["choices"] = choices
                commands.push({
                    name: item.name,
                    description: item.description,
                    options: options,
                    defaultPermission: item.permission == "none",
                })
            }else {
                if(item.options != undefined) {
                    commands.push({
                    name: item.name,
                    description: item.description,
                    options: item.options,
                    defaultPermission: item.permission == "none",
                    })
                }else {
                    commands.push({
                    name: item.name,
                    description: item.description,
                    defaultPermission: item.permission == "none",
                    })
                }
            }
        }
        });

        client.context_menu.forEach((item, i) => {
        commands.push({
            name: item.name,
            type: item.type,
            defaultPermission: item.permission == "none",
        })
        });

        let command

        if(interaction == undefined) {
        command = await message.guild.commands.set(commands)
        if(mssg == true) {
            message.channel.send({content: "Les " + commands.length.toString() + " commandes slash et menus contextuels ont bien été déployées", reply: { messageReference: message.id }, allowedMentions: { repliedUser: false }})
        }
        }else {
        command = await interaction.guild.commands.set(commands)
        if(mssg == true) {
            await interaction.reply({content: "Les " + commands.length.toString() + " commandes slash et menus contextuels ont bien été déployées", ephemeral: true})
        }
        }

        command.forEach((commande, i) => {
        if(commande.type == "CHAT_INPUT") {
            perms = []
            perm = client.commands.get(commande.name).permission
            for(const x in permission[perm]) {
            if(interaction == undefined) {
                if(message.guild.roles.cache.get(permission[perm][x]) != undefined) {
                perms.push({
                    id: permission[perm][x],
                    type: "ROLE",
                    permission: true,
                })
                }else {
                perms.push({
                    id: permission[perm][x],
                    type: "USER",
                    permission: true,
                })
                }
            }else {
                if(interaction.guild.roles.cache.get(permission[perm][x]) != undefined) {
                perms.push({
                    id: permission[perm][x],
                    type: "ROLE",
                    permission: true,
                })
                }else {
                perms.push({
                    id: permission[perm][x],
                    type: "USER",
                    permission: true,
                })
                }
            }
            }
            if(perms.length != 0) {
            //console.log(commande.name, {permissions: perms})
            commande.permissions.set({permissions: perms})
            }
        }else {
            perms = []
            perm = client.context_menu.get(commande.name).permission
            for(const x in permission[perm]) {
            if(interaction == undefined) {
                if(message.guild.roles.cache.get(permission[perm][x]) != undefined) {
                perms.push({
                    id: permission[perm][x],
                    type: "ROLE",
                    permission: true,
                })
                }else {
                perms.push({
                    id: permission[perm][x],
                    type: "USER",
                    permission: true,
                })
                }
            }else {
                if(interaction.guild.roles.cache.get(permission[perm][x]) != undefined) {
                perms.push({
                    id: permission[perm][x],
                    type: "ROLE",
                    permission: true,
                })
                }else {
                perms.push({
                    id: permission[perm][x],
                    type: "USER",
                    permission: true,
                })
                }
            }
            }
            if(perms.length != 0) {
            //console.log(commande.name, {permissions: perms})
            //console.log(perms)
            commande.permissions.set({permissions: perms})
            }
        }
        });


  }
}
