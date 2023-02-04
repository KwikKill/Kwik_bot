const { MessageEmbed } = require('discord.js');

const Roles = [
    "Serpentin",
    "Droide",
    "Double Face",
    "Super Héro",
    "Roméo",
    "Escroc"
];
const Description = {
    "Imposteur": "Doit absolument perdre la game sans se faire remarquer.",
    "Serpentin": "Doit gagner la game en ayant le plus de mort et de dégats de son équipe.",
    "Droide": "Doit gagner la game en suivant les instructions reçues en mp toutes les 5 minutes.",
    "Double Face": "Démarre la game gentil ou méchant, puis change de camp de manière aléatoire. Il doit gagner ou perdre la game en fonction de son allégeance au moment donné.",
    "Super Héro": "Doit absolument gagner la game, grosse pénalité en cas de défaite. Il doit avoir le plus de kills, d'assist et de dégats à la fin de la game. Il n'a pas de malus si il est démasqué.",
    "Roméo": "Roméo se lie à une Juliette choisie aléatoirement (allié ou ennemi), à chaque fois qu'elle meurt, il a une minute pour mettre fin à ses jours. Si Juliette est une adversaire il n'a pas le droit de la tuer, si c'est une allié il ne doit pas prendre de kill si elle participe au fight.",
    "Escroc": "L'escroc doit absolument gagner la game ET être voté en tant qu'imposteur, s'il obtient la majorité des votes les autres rôles ne gagnent pas les points de la victoire."
};
// funny things to do when playing lol
const Droide = [
    "On t'attaque ! Flash sur place !",
    "Dance pendant 15s sur la mid lane (plus loin que la T3)",
    "Il ne serait pas le temps de faire un drake ? Insister sur le fait de faire le drake ou de jouer autour",
    "Build un item qui n'a rien à voir avec le rôle du champion et dit que cela est une bonne idée",
    "Vole un camp à ton jungler. Si tu es jungler, tu doit smite le canon d'un allié",
    "N'utilise pas ton Q spell pendant 30s",
    "N'utilise pas ton W spell pendant 30s",
    "N'utilise pas ton E spell pendant 30s",
    "Tu te fais gank utilise ton R maintenant !",
    "Tu dois aller a l'opposer de la map a pied (Top to Bot ou Bot to TOP)",
    "Vend tes bottes et fais en des différentes",
    "inverse ton clavier et ta souris de main pendant 30s",
    "Tu es un guerrier, ne pas back avant ta prochaine mort",
    "Fait un ALT+F4",
    "Il faut backdoor ! Pose une ward dans la base adverse",
    "Tu ne dois plus utiliser ton clavier pour lancer des compétences pendant 1 minutes",
    "Tu dois donner des fausses informations ( faux SS, faux ping, Et cetera ",
    "AFK à la base pendant 20s ou jusqu'à ce qu'un allié le remarque",
    "Ignore ton midlaner pendant 30s",
    "Soft int le prochain teamfight et dit à ton équipe qu'ils sont pas foutu capable de toucher leurs sorts",
    "Change de type de ward",
    "Achete une potion au prochain back",
    "Vante toi d'avoir solo carry le prochain teamfight",
    "Ne prend pas de cs pendant 20s",
    "KS le prochain kill ou le blue/red",
    "Campe dans un bush ennemi pendant 45s ou jusqu'à ce qu'on ennemi te tue/tu le tue",
    "INT le prochain fight et accuse la connexion ( ping ta connexion )",
    "Raconte une blague pendant le prochain teamfight",
    "Tu dois rp le champion que tu joues pendant 1m",
    "N'achète que des potions au prochain back",
    "Lance une discussion sur le climat",
    "Deveniens le duo de quelqu'un et suit le pendant 1m",
    "Fait un podcast sur un champion présent dans la game au prochain teamfight",
    "Lance un débat sur une question existencielle",
    "Flash out le prochain sort qui se dirige vers toi (ciblé ou non)",
    "Au prochain teamfight, ne focus que ton vis à vis (top: focus top,...) avec interdiction de taper les autres ennemis",
    "Back à ta base à pied",
    "Demande à swap avec le toplaner (le midlaner si tu es top)",
    "Si tu le peut, pose deux wards au même endroit",
    "Demande le red ou le blue mais ne va pas le prendre",
    "Over react lors du prochain kill/mort",
    "Fait le nashor instant",
    "Éternue a cause du pollen",
    "Fait un call aram au mid",
    "Encense celui qui a le plus de mort",
    "Fait l'Hérald mais ne le pose pas !",
    "Demande a celui qui a le moins de KP de grouper",
    "Chante une chanson pendant 10/15s",
    "Crie lors de la prochaine mort"

];

module.exports = {
    name: 'among',
    group: 'amonglegends',
    description: "Permet de gérer des parties d'amonglegends",
    permission: "none",
    hidden: false,
    serverid: ["513776796211085342", "890915473363980308", "960284706073612379"],
    deploy: true,
    place: "guild",
    options: [
        {
            name: 'create',
            description: 'créé une partie d\'among legends',
            type: 'SUB_COMMAND'
        },
        {
            name: 'join',
            description: 'permet de rejoindre une partie d\'among legends',
            type: 'SUB_COMMAND'
        },
        {
            name: 'leave',
            description: 'permet de quitter une partie d\'among legends',
            type: 'SUB_COMMAND'
        },
        {
            name: 'role',
            description: 'permet d\'assigner les rôles par la partie d\'among legends',
            type: 'SUB_COMMAND'
        },
        {
            name: 'start',
            description: 'permet de démarrer la partie d\'among legends',
            type: 'SUB_COMMAND'
        },
        {
            name: 'stop',
            description: 'permet d\'arreter la partie d\'among legends',
            type: 'SUB_COMMAND'
        },
        {
            name: 'vote',
            description: 'permet de voter à la fin de la partie d\'among legends',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'imposteur',
                    description: 'choisissez l\'imposteur',
                    type: 'USER'
                },
                {
                    name: 'serpentin',
                    description: 'choisissez le serpentin',
                    type: 'USER'
                },
                {
                    name: 'droide',
                    description: 'choisissez le droide',
                    type: 'USER'
                },
                {
                    name: 'doubleface',
                    description: 'choisissez le double face',
                    type: 'USER'
                },
                {
                    name: 'superhero',
                    description: 'choisissez le super hero',
                    type: 'USER'
                },
                {
                    name: 'roméo',
                    description: 'choisissez le roméo',
                    type: 'USER'
                },
                {
                    name: 'escroc',
                    description: 'choisissez l\'escroc',
                    type: 'USER'
                }
            ]
        },
        {
            name: 'stats',
            description: 'permet d\'enregistrer les stats de la partie d\'among legends',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'status',
                    description: 'Victoire/défaite',
                    type: 'STRING',
                    required: true,
                    choices: [
                        {
                            name: 'victoire',
                            value: 'victoire'
                        },
                        {
                            name: 'defaite',
                            value: 'defaite'
                        }
                    ],
                },
                {
                    name: 'kills',
                    description: 'joueur avec le plus de kills',
                    type: 'USER',
                    required: true,
                },
                {
                    name: 'assist',
                    description: 'joueur avec le plus d\'assist',
                    type: 'USER',
                    required: true,
                },
                {
                    name: 'damages',
                    description: 'joueur avec le plus de dégats',
                    type: 'USER',
                    required: true,
                },
                {
                    name: "deaths",
                    description: "joueur avec le plus de morts",
                    type: "USER",
                    required: true,
                },
            ]
        },
    ],
    async run(message, client, interaction = undefined) {
        if (interaction !== undefined) {
            switch (interaction.options.getSubcommand()) {
                case 'create':
                    if (interaction.channel.type === "GUILD_TEXT") {
                        interaction.reply("Une partie d'among legends viens d'être créé, rejoignez le thread pour interragir avec.");
                        const reply = await interaction.fetchReply();
                        const thread = await reply.startThread({
                            name: "Among Legends - Partie de " + interaction.user.username,
                            invitable: true,
                        });
                        //thread.send("Ce Thread est un salon pour une partie d'amonglegend. Les commandes disponibles sont :\n```- amonglegends join : commande pour rejoindre la partie.\n- amonglegends stop : arrête la partie. Supprime le salon si la partie n'est pas lancée.\n- amonglegends role : assigne les rôles. Chaques éxécution de la commande redistribue les rôles.\n- amonglegends start : démarre la partie.\n- amonglegends stats : enregistre les stats de la partie.```")
                        thread.send("Ce Thread est un salon pour une partie d'amonglegend. Les commandes disponibles sont :\n```- amonglegends join : commande pour rejoindre la partie.\n- amonglegends stop : arrête la partie. Supprime le salon si la partie n'est pas lancée.\n- amonglegends role : assigne les rôles. Chaques éxécution de la commande redistribue les rôles.\n- amonglegends start : démarre la partie.\n- amonglegends stats : enregistre les stats de la partie.\n- amonglegends vote : permet de voter à la fin d'une partie.```");

                        let df;
                        if (Math.random() > 0.5) {
                            df = "victoire";
                        } else {
                            df = "defaite";
                        }

                        client.amonglegends.set(thread.id, {
                            players: {},
                            started: false,
                            finish: false,
                            doubleface: df,
                            stats: {
                                status: undefined,
                                kills: undefined,
                                assists: undefined,
                                damages: undefined,
                                deaths: undefined,
                            },
                            interval1: undefined,
                            interval2: undefined,
                        });
                        client.amonglegends.get(thread.id).players[interaction.user.id] = {
                            role: "",
                            vote: undefined,
                            score: 0,
                        };
                        //console.log(client.amonglegends)
                    } else {
                        interaction.reply("Vous ne pouvez pas créer une partie d'among legends dans ce salon.");
                    }
                    break;
                case 'join':
                    if (interaction.channel.type === "GUILD_PUBLIC_THREAD") {
                        if (interaction.channel.name.includes("Among Legends - Partie de")) {
                            if (client.amonglegends.get(interaction.channel.id).players[interaction.user.id] !== undefined) {
                                interaction.reply("Vous êtes déjà dans la partie.");
                            } else {
                                client.amonglegends.get(interaction.channel.id).players[interaction.user.id] = {
                                    role: "",
                                    vote: undefined,
                                    score: 0,
                                };
                                interaction.reply("Vous avez rejoint la partie.");
                            }
                        } else {
                            interaction.reply("Ce salon n'est pas un salon de partie d'among legends.");
                        }
                    } else {
                        interaction.reply("Ce salon n'est pas un salon de partie d'among legends.");
                    }
                    break;
                case 'leave':
                    if (interaction.channel.type === "GUILD_PUBLIC_THREAD") {
                        if (interaction.channel.name.includes("Among Legends - Partie de")) {
                            if (interaction.channel.name.includes(interaction.user.username)) {
                                interaction.reply("Vous ne pouvez pas quitter la partie.");
                            } else {
                                if (client.amonglegends.get(interaction.channel.id).players[interaction.user.id] !== undefined) {
                                    delete client.amonglegends.get(interaction.channel.id).players[interaction.user.id];
                                    interaction.reply("Vous avez quitté la partie.");
                                } else {
                                    interaction.reply("Vous n'êtes pas dans la partie.");
                                }
                            }
                        } else {
                            interaction.reply("Ce salon n'est pas un salon de partie d'among legends.");
                        }
                    } else {
                        interaction.reply("Ce salon n'est pas un salon de partie d'among legends.");
                    }
                    break;
                case 'role':
                    if (interaction.channel.type === "GUILD_PUBLIC_THREAD") {
                        if (interaction.channel.name.includes("Among Legends - Partie de")) {
                            if (client.amonglegends.get(interaction.channel.id).players[interaction.user.id] !== undefined) {
                                if (client.amonglegends.get(interaction.channel.id).started === false && client.amonglegends.get(interaction.channel.id).finish === false) {
                                    if (interaction.channel.name.includes(interaction.user.username)) {
                                        clearInterval(client.amonglegends.get(interaction.channel.id).interval1);
                                        clearInterval(client.amonglegends.get(interaction.channel.id).interval2);
                                        // build an array from role with one imposteur and other roles with the same number of players
                                        const roles = [];
                                        roles.push("Imposteur");
                                        // shuffle Roles
                                        shuffle(Roles);
                                        for (let i = 0; i < Object.keys(client.amonglegends.get(interaction.channel.id).players).length - 1; i++) {
                                            roles.push(Roles[i]);
                                        }
                                        shuffle(roles);
                                        // for the roméo, choose two randoms roles betwen "Top", "Jungle", "Mid", "ADC" and "Support"
                                        const pos = ["Top", "Jungle", "Mid", "ADC", "Support"];
                                        const romeo = pos[Math.round(Math.random() * 4)];

                                        // choose betwen allie or ennemy
                                        let allie;
                                        if (Math.random() > 0.5) {
                                            allie = "Allié";
                                        } else {
                                            allie = "Ennemi";
                                        }
                                        // Get throught every players and assign role from roles and dm the role + the description to the player
                                        let i = 0;
                                        //console.log(client.amonglegends.get(interaction.channel.id))
                                        for (const player in client.amonglegends.get(interaction.channel.id).players) {
                                            // assigne role
                                            const role = roles[i];
                                            client.amonglegends.get(interaction.channel.id).players[player].role = role;
                                            // send a dm with the role and the description :
                                            const user = await client.users.fetch(player);
                                            await user.send("Vous êtes " + role + " : " + Description[role]);
                                            if (role === "Roméo") {
                                                await user.send("Votre juliette est " + romeo + " " + allie + ".");
                                            } else if (role === "Double Face") {
                                                // start a cooldown, change double face side every 5 minutes and send a message to the player informing him
                                                const interval1 = setInterval(function (pl) {
                                                    if (client.amonglegends.get(interaction.channel.id).started === true) {
                                                        client.users.fetch(pl).then(user => {
                                                            if (client.amonglegends.get(interaction.channel.id).doubleface === "victoire") {
                                                                client.amonglegends.get(interaction.channel.id).doubleface = "defaite";
                                                                user.send("Vous devez maintenant perdre la partie.");
                                                            } else {
                                                                client.amonglegends.get(interaction.channel.id).doubleface = "victoire";
                                                                user.send("Vous devez maintenant perdre la partie.");
                                                            }
                                                        });
                                                    }
                                                }, 300000, player);
                                                client.amonglegends.get(interaction.channel.id).interval1 = interval1;
                                                if (client.amonglegends.get(interaction.channel.id).doubleface === "victoire") {
                                                    user.send("Vous devez gagner la partie.");
                                                } else {
                                                    user.send("Vous devez perdre la partie.");
                                                }
                                            } else if (role === "Droide") {
                                                const interval2 = setInterval(function (pl) {
                                                    const rand = Math.round(Math.random() * 6);
                                                    if (rand === 2) {
                                                        console.log("a");
                                                        if (client.amonglegends.get(interaction.channel.id).started === true) {
                                                            console.log("b");
                                                            console.log(pl);
                                                            client.users.fetch(pl).then(user => {
                                                                const random = Math.round(Math.random() * (Droide.length - 1));
                                                                console.log(user, random);
                                                                user.send(Droide[random]);
                                                            });
                                                        }
                                                    }
                                                    console.log(rand);
                                                }, 60000, player);
                                                client.amonglegends.get(interaction.channel.id).interval2 = interval2;
                                            }
                                            i++;
                                        }
                                        interaction.reply("Les rôles ont été assignés.");
                                    } else {
                                        interaction.reply("Vous ne pouvez pas assigner de rôle.");
                                    }
                                } else {
                                    interaction.reply("Vous ne pouvez pas assigner de rôle pendant la partie. Finissez la partie et votez pour pouvoir recommencer une partie.");
                                }
                            } else {
                                interaction.reply("Vous n'êtes pas dans la partie.");
                            }
                        } else {
                            interaction.reply("Ce salon n'est pas un salon de partie d'among legends.");
                        }
                    } else {
                        interaction.reply("Ce salon n'est pas un salon de partie d'among legends.");
                    }
                    break;
                case 'stop':
                    if (interaction.channel.type === "GUILD_PUBLIC_THREAD") {
                        if (interaction.channel.name.includes("Among Legends - Partie de")) {
                            if (interaction.channel.name.includes(interaction.user.username)) {
                                if (client.amonglegends.get(interaction.channel.id).started === true) {
                                    client.amonglegends.get(interaction.channel.id).finish = true;
                                    client.amonglegends.get(interaction.channel.id).started = false;
                                    // stop the timer
                                    clearInterval(client.amonglegends.get(interaction.channel.id).interval1);
                                    clearInterval(client.amonglegends.get(interaction.channel.id).interval2);
                                    await interaction.reply("La partie est terminée, Vous pouvez maintenant renseigner les stats avec la commande amongelegends stats.");
                                    //console.log(client.amonglegends)
                                } else {
                                    interaction.channel.delete();
                                }
                            } else {
                                interaction.reply("Vous ne pouvez pas arrêter la partie.");
                            }
                        } else {
                            interaction.reply("Ce salon n'est pas un salon de partie d'among legends.");
                        }
                    } else {
                        interaction.reply("Ce salon n'est pas un salon de partie d'among legends.");
                    }
                    break;
                case 'start':
                    if (interaction.channel.type === "GUILD_PUBLIC_THREAD") {
                        if (interaction.channel.name.includes("Among Legends - Partie de")) {
                            if (interaction.channel.name.includes(interaction.user.username)) {
                                if (client.amonglegends.get(interaction.channel.id).started === false) {
                                    // check if every players has a role :
                                    for (const player in client.amonglegends.get(interaction.channel.id).players) {
                                        if (client.amonglegends.get(interaction.channel.id).players[player].role === "") {
                                            interaction.reply("Vous n'avez pas assigné les rôles.");
                                            return;
                                        }
                                    }
                                    client.amonglegends.get(interaction.channel.id).started = true;
                                    client.amonglegends.get(interaction.channel.id).finish = false;
                                    interaction.reply("La partie a démarré.");
                                } else {
                                    interaction.reply("La partie est déjà en cours.");
                                }
                            } else {
                                interaction.reply("Vous ne pouvez pas démarrer la partie.");
                            }
                        } else {
                            interaction.reply("Ce salon n'est pas un salon de partie d'among legends.");
                        }
                    } else {
                        interaction.reply("Ce salon n'est pas un salon de partie d'among legends.");
                    }
                    break;
                case 'stats':
                    //console.log("//////////////////////////////")
                    if (interaction.channel.type === "GUILD_PUBLIC_THREAD") {
                        if (interaction.channel.name.includes("Among Legends - Partie de")) {
                            // check if the player is the admin (name of the channel includes the name of the admin)
                            if (!interaction.channel.name.includes(interaction.user.username)) {
                                interaction.reply("Vous n'êtes pas l'admin de la partie.");
                                return;
                            }
                            // check if the stats are already registered :
                            //if(client.amonglegends.get(interaction.channel.id).stats.deaths !== undefined) {
                            //    interaction.reply("Les stats de la partie sont déjà enregistrées.")
                            //    return;
                            //}
                            if (client.amonglegends.get(interaction.channel.id).players[interaction.user.id] !== undefined) {
                                if (client.amonglegends.get(interaction.channel.id).started === false) {
                                    if (client.amonglegends.get(interaction.channel.id).finish === false) {
                                        interaction.reply("La partie n'est pas terminée.");
                                    } else {
                                        // get the stats from the command arguments
                                        const statuss = interaction.options.getString('status');
                                        const kills = interaction.options.getUser("kills");
                                        const deaths = interaction.options.getUser('deaths');
                                        const assists = interaction.options.getUser('assist');
                                        const damages = interaction.options.getUser('damages');
                                        //console.log(statuss, kills, deaths, assists, damages)
                                        // check if all the stats are valid :
                                        if (client.amonglegends.get(interaction.channel.id).players[kills.id] !== undefined && client.amonglegends.get(interaction.channel.id).players[deaths.id] !== undefined && client.amonglegends.get(interaction.channel.id).players[assists.id] !== undefined && client.amonglegends.get(interaction.channel.id).players[damages.id] !== undefined) {
                                            // register the stats
                                            client.amonglegends.get(interaction.channel.id).stats.status = statuss;
                                            client.amonglegends.get(interaction.channel.id).stats.kills = kills.id;
                                            client.amonglegends.get(interaction.channel.id).stats.deaths = deaths.id;
                                            client.amonglegends.get(interaction.channel.id).stats.assists = assists.id;
                                            client.amonglegends.get(interaction.channel.id).stats.damages = damages.id;
                                            // calculate each player stats :
                                            // description is visible at https://amonglegends.gg/roles
                                            for (const player in client.amonglegends.get(interaction.channel.id).players) {
                                                if (client.amonglegends.get(interaction.channel.id).players[player].role === "Imposteur") {
                                                    // check satus :
                                                    if (statuss === "defaite") {
                                                        client.amonglegends.get(interaction.channel.id).players[player].score += 4;
                                                    } else {
                                                        client.amonglegends.get(interaction.channel.id).players[player].score += -4;
                                                    }
                                                } else if (client.amonglegends.get(interaction.channel.id).players[player].role === "Serpentin") {
                                                    // check satus :
                                                    if (statuss === "victoire") {
                                                        client.amonglegends.get(interaction.channel.id).players[player].score += 1;
                                                    } else {
                                                        client.amonglegends.get(interaction.channel.id).players[player].score -= 1;
                                                    }
                                                    // check deaths :
                                                    if (deaths.id === player) {
                                                        client.amonglegends.get(interaction.channel.id).players[player].score += 1;
                                                    } else {
                                                        client.amonglegends.get(interaction.channel.id).players[player].score -= 1;
                                                    }
                                                    // check damages :
                                                    if (damages.id === player) {
                                                        client.amonglegends.get(interaction.channel.id).players[player].score += 1;
                                                    } else {
                                                        client.amonglegends.get(interaction.channel.id).players[player].score -= 1;
                                                    }
                                                } else if (client.amonglegends.get(interaction.channel.id).players[player].role === "Droide") {
                                                    // check satus :
                                                    if (statuss === "victoire") {
                                                        client.amonglegends.get(interaction.channel.id).players[player].score += 2;
                                                    } else {
                                                        client.amonglegends.get(interaction.channel.id).players[player].score -= 1;
                                                    }
                                                } else if (client.amonglegends.get(interaction.channel.id).players[player].role === "Double Face") {
                                                    // check satus :
                                                    if (statuss === client.amonglegends.get(interaction.channel.id).doubleface) {
                                                        client.amonglegends.get(interaction.channel.id).players[player].score += 3;
                                                    } else {
                                                        client.amonglegends.get(interaction.channel.id).players[player].score -= 2;
                                                    }
                                                } else if (client.amonglegends.get(interaction.channel.id).players[player].role === "SuperHéro") {
                                                    // check satus :
                                                    if (statuss === "victoire") {
                                                        client.amonglegends.get(interaction.channel.id).players[player].score += 2;
                                                    } else {
                                                        client.amonglegends.get(interaction.channel.id).players[player].score -= 3;
                                                    }
                                                    // check deaths :
                                                    if (deaths.id === player) {
                                                        client.amonglegends.get(interaction.channel.id).players[player].score += 1;
                                                    } else {
                                                        client.amonglegends.get(interaction.channel.id).players[player].score -= 1;
                                                    }
                                                    // check damages :
                                                    if (damages.id === player) {
                                                        client.amonglegends.get(interaction.channel.id).players[player].score += 1;
                                                    } else {
                                                        client.amonglegends.get(interaction.channel.id).players[player].score -= 1;
                                                    }
                                                    // check assists :
                                                    if (assists.id === player) {
                                                        client.amonglegends.get(interaction.channel.id).players[player].score += 1;
                                                    } else {
                                                        client.amonglegends.get(interaction.channel.id).players[player].score -= 1;
                                                    }
                                                } else if (client.amonglegends.get(interaction.channel.id).players[player].role === "Roméo") {
                                                    // check satus :
                                                    if (statuss === "victoire") {
                                                        client.amonglegends.get(interaction.channel.id).players[player].score += 2;
                                                    } else {
                                                        client.amonglegends.get(interaction.channel.id).players[player].score -= 2;
                                                    }
                                                } else if (client.amonglegends.get(interaction.channel.id).players[player].role === "Escroc") {
                                                    // check satus :
                                                    if (statuss === "victoire") {
                                                        client.amonglegends.get(interaction.channel.id).players[player].score += 2;
                                                    } else {
                                                        client.amonglegends.get(interaction.channel.id).players[player].score -= 2;
                                                    }
                                                }
                                            }

                                            interaction.reply("Les stats ont été enregistrées, Vous pouvez maintenant voter avec la commande amonglegends vote.");
                                        } else {
                                            interaction.reply("Un des joueurs spécifiés ne participe pas à la partie.");
                                        }


                                    }
                                } else {
                                    interaction.reply("Vous n'avez pas encore fini la partie.");
                                }
                            } else {
                                interaction.reply("Vous n'êtes pas dans la partie.");
                            }
                        } else {
                            interaction.reply("Ce salon n'est pas un salon de partie d'among legends.");
                        }
                    } else {
                        interaction.reply("Ce salon n'est pas un salon de partie d'among legends.");
                    }
                    //console.log(client.amonglegends.get(interaction.channel.id))
                    break;
                case "vote":
                    //console.log("//////////////////////////////")
                    if (interaction.channel.type === "GUILD_PUBLIC_THREAD") {
                        if (interaction.channel.name.includes("Among Legends - Partie de")) {
                            if (client.amonglegends.get(interaction.channel.id).players[interaction.user.id] !== undefined) {
                                // if stats are not registered, return
                                if (client.amonglegends.get(interaction.channel.id).stats.deaths === undefined) {
                                    interaction.reply("Les stats n'ont pas été enregistrées.");
                                    return;
                                }
                                if (client.amonglegends.get(interaction.channel.id).players[interaction.user.id].vote === undefined) {
                                    // check if every role in the game is in the commend options :
                                    const roles = [];
                                    for (const player in client.amonglegends.get(interaction.channel.id).players) {
                                        roles.push(client.amonglegends.get(interaction.channel.id).players[player].role);
                                    }
                                    // grab command options :
                                    const vote = {
                                        "imposteur": interaction.options.getUser("imposteur"),
                                        "serpentin": interaction.options.getUser("serpentin"),
                                        "droide": interaction.options.getUser("droide"),
                                        "doubleface": interaction.options.getUser("doubleface"),
                                        "superhero": interaction.options.getUser("superhero"),
                                        "roméo": interaction.options.getUser("roméo"),
                                        "escroc": interaction.options.getUser("escroc")
                                    };
                                    // check if a player was voted two times
                                    for (const role in vote) {
                                        for (const role2 in vote) {
                                            if (vote[role] === vote[role2] && role !== role2 && vote[role] !== undefined) {
                                                interaction.reply("Vous ne pouvez voter qu'une seule fois pour chaque joueurs.");
                                                return;
                                            }
                                        }
                                    }
                                    // voted
                                    const voted = {};
                                    for (const role in vote) {
                                        if (vote[role] !== undefined) {
                                            voted[vote[role].id] = role;
                                        }
                                    }
                                    //console.log(voted)
                                    // check if every player in voted is playing :
                                    for (const player in voted) {
                                        if (client.amonglegends.get(interaction.channel.id).players[player] === undefined) {
                                            interaction.reply("Un des joueurs spécifiés ne participe pas à la partie.");
                                            return;
                                        }
                                    }
                                    //console.log(client.amonglegends)

                                    // check if every player are in voted except the one who voted :
                                    for (const player in client.amonglegends.get(interaction.channel.id).players) {
                                        if (Object.keys(voted).includes(player) && player === interaction.user.id) {
                                            interaction.reply("Vous ne pouvez pas voter pour vous même.");
                                            return;
                                        }
                                    }
                                    for (const player in client.amonglegends.get(interaction.channel.id).players) {
                                        if (!Object.keys(voted).includes(player) && player !== interaction.user.id) {
                                            interaction.reply("Vous n'avez pas voté pour tous les joueurs.");
                                            return;
                                        }
                                    }
                                    // validate each votes
                                    client.amonglegends.get(interaction.channel.id).players[interaction.user.id].vote = voted;
                                    // assign points to each vote. If vote is right, +1 for the player and -1 for the voted, else -1 for the player and +1 for the voted :
                                    for (const player in client.amonglegends.get(interaction.channel.id).players) {
                                        if (player !== interaction.user.id) {
                                            // if role of voted player is escroc :
                                            if (client.amonglegends.get(interaction.channel.id).players[player].role === "Escroc") {
                                                if (voted[player].toLowerCase() === "imposteur") {
                                                    client.amonglegends.get(interaction.channel.id).players[player].score += 2;
                                                    client.amonglegends.get(interaction.channel.id).players[interaction.user.id].score -= 1;
                                                } else if (client.amonglegends.get(interaction.channel.id).players[player].role === voted[player].toLowerCase()) {
                                                    client.amonglegends.get(interaction.channel.id).players[player].score -= 1;
                                                    client.amonglegends.get(interaction.channel.id).players[interaction.user.id].score += 1;
                                                } else {
                                                    client.amonglegends.get(interaction.channel.id).players[player].score -= 1;
                                                    client.amonglegends.get(interaction.channel.id).players[interaction.user.id].score -= 1;
                                                }
                                            } else {
                                                if (client.amonglegends.get(interaction.channel.id).players[player].role.toLowerCase() === voted[player].toLowerCase()) {
                                                    client.amonglegends.get(interaction.channel.id).players[player].score -= 1;
                                                    client.amonglegends.get(interaction.channel.id).players[interaction.user.id].score += 1;
                                                } else {
                                                    client.amonglegends.get(interaction.channel.id).players[player].score += 1;
                                                    client.amonglegends.get(interaction.channel.id).players[interaction.user.id].score -= 1;
                                                }
                                            }
                                        }
                                    }
                                    // if every player have voted, make a score recap :
                                    for (const player in client.amonglegends.get(interaction.channel.id).players) {
                                        if (client.amonglegends.get(interaction.channel.id).players[player].vote === undefined) {
                                            interaction.reply("Votre vote a été pris en compte, certains joueurs n'ont pas encore votés.");
                                            return;
                                        }
                                    }
                                    // make a recap with an embed:
                                    const embed = new MessageEmbed()
                                        .setTitle("Résultat des votes")
                                        .setColor("#0099ff")
                                        .setDescription("Voici le résultat des votes :");
                                    //for(player in client.amonglegends.get(interaction.channel.id).players) {
                                    //    embed.addField({name: client.amonglegends.get(interaction.channel.id).players[player].name, value: client.amonglegends.get(interaction.channel.id).players[player].score})
                                    //}
                                    // addFields for every player with their role, their score and what other players voted :
                                    //console.log(client.amonglegends.get(interaction.channel.id).players)
                                    for (const player in client.amonglegends.get(interaction.channel.id).players) {
                                        // build a string with the other players voted :
                                        let wasvoted = "role : " + client.amonglegends.get(interaction.channel.id).players[player].role + "\n";
                                        wasvoted += "score : " + client.amonglegends.get(interaction.channel.id).players[player].score + "\n";
                                        for (const votedPlayer in client.amonglegends.get(interaction.channel.id).players) {
                                            if (player !== votedPlayer) {
                                                //console.log(player, votedPlayer, client.amonglegends.get(interaction.channel.id).players[player])
                                                if (client.amonglegends.get(interaction.channel.id).players[votedPlayer].vote[player].toLowerCase() === client.amonglegends.get(interaction.channel.id).players[player].role.toLowerCase()) {
                                                    wasvoted += "- <@" + votedPlayer + "> : " + client.amonglegends.get(interaction.channel.id).players[votedPlayer].vote[player] + "\n";
                                                } else {
                                                    wasvoted += "- <@" + votedPlayer + "> : ~~" + client.amonglegends.get(interaction.channel.id).players[votedPlayer].vote[player] + "~~\n";
                                                }
                                            }
                                        }
                                        const pl = await client.users.fetch(player);
                                        embed.addFields({ name: "" + pl.username + "", value: wasvoted });
                                    }
                                    interaction.reply({ embeds: [embed] });


                                    //reset the game :
                                    const players = {};
                                    for (const player in client.amonglegends.get(interaction.channel.id).players) {
                                        players[player] = {
                                            role: "",
                                            vote: undefined,
                                            score: 0,
                                        };
                                    }

                                    let df;
                                    if (Math.random() > 0.5) {
                                        df = "victoire";
                                    } else {
                                        df = "defaite";
                                    }

                                    client.amonglegends.set(interaction.channel.id, {
                                        players: players,
                                        started: false,
                                        finish: false,
                                        doubleface: df,
                                        stats: {
                                            status: undefined,
                                            kills: undefined,
                                            assists: undefined,
                                            damages: undefined,
                                            deaths: undefined,
                                        },
                                        interval1: undefined,
                                        interval2: undefined,
                                    });
                                } else {
                                    interaction.reply("Vous avez déjà voté.");
                                }
                            } else {
                                interaction.reply("Vous n'êtes pas dans la partie.");
                            }
                        } else {
                            interaction.reply("Ce salon n'est pas un salon de partie d'among legends.");
                        }
                    } else {
                        interaction.reply("Ce salon n'est pas un salon de partie d'among legends.");
                    }
                    break;
            }
        }
    }
};


function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}
