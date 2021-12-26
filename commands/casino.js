const fs = require("fs");
const path = require('path');
const { MessageEmbed } = require('discord.js');
const config = require('../config.json');
const credits = require('../credits.json');
const rewards = require('../rewards.json');

module.exports = {
	name: 'casino',
	group: 'mudae',
	description: "Permet de jouer au Casino officiel de la Kiwi Industry",
	permission: "none",
	hidden: false,
        deploy: false,
	place: "guild",
    help: [
        {
            "name": "- __casino balance__ :",
            "value": "Permet de consulter son nombre de jetons du casino."
        },
        {
            "name": "- __casino play [nombre]__ :",
            "value": "Permet de jouer contre [nombre] jetons."
        },
        {
            "name": "- __casino rewards__ :",
            "value": "Permet de voir les récompenses disponibles dans le casino."
        },
        {
            "name": "- __casino claim__ :",
            "value": "Permet de récupérer ses récompenses."
        },
    ],
    options: [
        {
            name: "balance",
            description: "Permet de consulter son nombre de jetons du casino.",
            type: "SUB_COMMAND"
        },
        {
            name: "rewards",
            description: "Permet de voir les récompenses disponibles dans le casino.",
            type: "SUB_COMMAND"
        },
        {
            name: "play",
            description: "Permet de jouer contre [nombre] jetons.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "nombre",
                    description: "Nombre de jetons à jouer.",
                    type: "INTEGER",
                    required: false,
                }
            ]
        },
    ],
    async run(message, client, interaction=undefined) {
        if(interaction != undefined) {
            if(interaction.channel.name == "casino") {
                if(interaction.options.getSubcommand() == "balance") {
                    if(credits[interaction.user.id] == undefined) {
                        interaction.reply("Vous avez actuellement **0** jetons. Contactez KwikKill pour en acquérir")
                    }else {
                        interaction.reply("Vous avez actuellement **" + credits[interaction.user.id] + "** jetons.")
                    }
                }else if(interaction.options.getSubcommand() == "rewards") {
                    prob = 10000
                    rw = ""
                    rewards.forEach(reward => {
                        prob = prob - reward[1]
                        rw = rw + " - \"" + reward[0] + "\"\n"
                    });
                    rw = rw + " - \"Et c'est perdu !\""

                    embed = new MessageEmbed()
                    .setTitle("Liste des récompenses disponibles :")
                    .setDescription(rw)
                    .setColor("0xffe402")

                    interaction.reply({embeds: [embed]})
                }else if(interaction.options.getSubcommand() == "play") {
                    nombre = interaction.options.getInteger("nombre")
                    if(nombre == undefined) {
                        nombre = 1
                    }
                    if(credits[interaction.user.id] == undefined) {
                        interaction.reply("Vous avez actuellement **0** jetons. Contactez KwikKill pour en acquérir")
                    }else if(credits[interaction.user.id] < nombre) {
                        interaction.reply("Vous n'avez pas assez de jetons pour jouer.")
                    }else {
                        credits[interaction.user.id] = credits[interaction.user.id] - nombre
                        fs.writeFileSync(path.resolve(__dirname, '../credits.json'), JSON.stringify(credits, null, 4))

                        if(nombre == 1) {                            
                            nb = getRandomInt(10000)
                            act = 0
                            for(reward of rewards){
                                if(nb <= reward[1] + act) {
                                    interaction.reply("Vous avez gagné " + reward[0] + ". Ce message fait office de preuve et vous permettra de retirer votre lot auprès de KwikKill (validation : " + nb + "/" + (reward[1] + act) + ").")
                                    return;
                                }
                                act = act + reward[1]
                            }
                            interaction.reply("Vous n'avez rien gagné.")
                            return;
                        }else {
                            await interaction.deferReply()
                            rws = []
                            for(i = 0; i < nombre; i++) {
                                nb = getRandomInt(10000)
                                act = 0
                                all = false
                                for(reward of rewards){
                                    if(nb <= reward[1] + act && all == false) {
                                        //console.log(nb, reward[1], act)
                                        all = true
                                        rws.push(reward[0])
                                    }
                                    act = act + reward[1]
                                }
                                
                            }
                            if(rws.length == 0) {
                                interaction.editReply("Vous n'avez rien gagné.")   
                            }else {
                                resultat = {}
                                rws.forEach(rw => {
                                    if(resultat[rw] == undefined) {
                                        resultat[rw] = 1
                                    }else {
                                        resultat[rw] = resultat[rw] + 1
                                    }
                                });

                                mssg = ""
                                for(rw in resultat) {
                                    mssg = mssg + " - " + rw + " x" + resultat[rw] + "\n"
                                }   
                                interaction.editReply("Vous avez gagné :\n" + mssg + "Ce message fait office de preuve et vous permettra de retirer votre lot auprès de KwikKill.")
                            }
                        }
                    }
                }
            }
        }
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
