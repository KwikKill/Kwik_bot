const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'lol',
    group: 'lol',
    description: "Commande lol",
    permission: "none",
    serverid: ["513776796211085342", "962329252550807592", "890915473363980308"],
    hidden: false,
    help: [
        {
            "name": "- __lol__ :",
            "value": "Test lol."
        },
    ],
    place: "guild",
    options: [
        {
            name: 'account',
            description: 'Manage lol accounts',
            type: 'SUB_COMMAND_GROUP',
            options: [
                {
                    name: 'add',
                    description: 'Add a lol account',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'name',
                            description: 'Name of the account',
                            type: 'STRING',
                            required: true,
                        }
                    ]
                },
                {
                    name: 'remove',
                    description: 'Remove a lol account',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'name',
                            description: 'Name of the account',
                            type: 'STRING',
                            required: true,
                        }
                    ]
                },
                {
                    name: 'list',
                    description: 'List lol accounts',
                    type: 'SUB_COMMAND',
                },
            ]
        },
        {
            name: 'matchs',
            description: 'Manage lol matchs',
            type: 'SUB_COMMAND_GROUP',
            options: [
                {
                    name: 'update',
                    description: 'Update matchs',
                    type: 'SUB_COMMAND',
                }
            ]
        },
        {
            name: 'queue',
            description: 'manage queue',
            type: 'SUB_COMMAND_GROUP',
            options: [
                {
                    name: 'status',
                    description: 'see queue status',
                    type: 'SUB_COMMAND',
                }
            ]
        },
        {
            name: 'stats',
            description: 'stat command',
            type: 'SUB_COMMAND_GROUP',
            options: [
                {
                    name: 'summarized',
                    description: 'See summarized stats',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'discordaccount',
                            description: 'Discord account',
                            type: 'USER',
                        },
                        {
                            name: 'champion',
                            description: 'Champion',
                            type: 'STRING',
                            autocomplete: true,
                        },
                        {
                            name: 'lane',
                            description: 'Lane',
                            type: 'STRING',
                            choices: [
                                {
                                    name: 'Top',
                                    value: 'TOP'
                                },
                                {
                                    name: 'Jungle',
                                    value: 'JUNGLE'
                                },
                                {
                                    name: 'Mid',
                                    value: 'MIDDLE'
                                },
                                {
                                    name: 'ADC',
                                    value: 'ADC'
                                },
                                {
                                    name: 'Support',
                                    value: 'SUPPORT'
                                },
                            ]
                        },
                        {
                            name: 'gamemode',
                            description: 'GameMode',
                            type: 'STRING',
                            choices: [
                                {
                                    name: 'normal',
                                    value: 'CLASSIC'
                                },
                                {
                                    name: 'Ranked Solo/Duo',
                                    value: 'RANKED_SOLO'
                                },
                                {
                                    name: 'Ranked Flex',
                                    value: 'RANKED_FLEX'
                                },
                                {
                                    name: 'ARAM',
                                    value: 'ARAM'
                                },
                                {
                                    name: 'URF',
                                    value: 'URF'
                                },
                                {
                                    name: 'One for All',
                                    value: 'ONEFORALL'
                                },
                                {
                                    name: 'Ultimate spellbook',
                                    value: 'ULTBOOK'
                                }
                            ]
                        },
                        {
                            name: 'account',
                            description: 'account',
                            type: 'STRING'
                        },
                    ]
                },
                {
                    name: 'matchups',
                    description: 'See matchups stats',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'discordaccount',
                            description: 'Discord account',
                            type: 'USER',
                        },
                        {
                            name: 'champion',
                            description: 'Champion',
                            type: 'STRING',
                            autocomplete: true,
                        },
                        {
                            name: 'lane',
                            description: 'Lane',
                            type: 'STRING',
                            choices: [
                                {
                                    name: 'Top',
                                    value: 'TOP'
                                },
                                {
                                    name: 'Jungle',
                                    value: 'JUNGLE'
                                },
                                {
                                    name: 'Mid',
                                    value: 'MIDDLE'
                                },
                                {
                                    name: 'ADC',
                                    value: 'ADC'
                                },
                                {
                                    name: 'Support',
                                    value: 'SUPPORT'
                                },
                            ]
                        },
                        {
                            name: 'gamemode',
                            description: 'GameMode',
                            type: 'STRING',
                            choices: [
                                {
                                    name: 'normal',
                                    value: 'CLASSIC'
                                },
                                {
                                    name: 'Ranked Solo/Duo',
                                    value: 'RANKED_SOLO'
                                },
                                {
                                    name: 'Ranked Flex',
                                    value: 'RANKED_FLEX'
                                },
                                {
                                    name: 'ARAM',
                                    value: 'ARAM'
                                },
                                {
                                    name: 'URF',
                                    value: 'URF'
                                },
                                {
                                    name: 'One for All',
                                    value: 'ONEFORALL'
                                },
                                {
                                    name: 'Ultimate spellbook',
                                    value: 'ULTBOOK'
                                }
                            ]
                        },
                        {
                            name: 'account',
                            description: 'account',
                            type: 'STRING'
                        },
                    ]
                },
                {
                    name: 'champions',
                    description: 'See champions stats',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'discordaccount',
                            description: 'Discord account',
                            type: 'USER',
                        },
                        {
                            name: 'lane',
                            description: 'Lane',
                            type: 'STRING',
                            choices: [
                                {
                                    name: 'Top',
                                    value: 'TOP'
                                },
                                {
                                    name: 'Jungle',
                                    value: 'JUNGLE'
                                },
                                {
                                    name: 'Mid',
                                    value: 'MIDDLE'
                                },
                                {
                                    name: 'ADC',
                                    value: 'ADC'
                                },
                                {
                                    name: 'Support',
                                    value: 'SUPPORT'
                                },
                            ]
                        },
                        {
                            name: 'gamemode',
                            description: 'GameMode',
                            type: 'STRING',
                            choices: [
                                {
                                    name: 'normal',
                                    value: 'CLASSIC'
                                },
                                {
                                    name: 'Ranked Solo/Duo',
                                    value: 'RANKED_SOLO'
                                },
                                {
                                    name: 'Ranked Flex',
                                    value: 'RANKED_FLEX'
                                },
                                {
                                    name: 'ARAM',
                                    value: 'ARAM'
                                },
                                {
                                    name: 'URF',
                                    value: 'URF'
                                },
                                {
                                    name: 'One for All',
                                    value: 'ONEFORALL'
                                },
                                {
                                    name: 'Ultimate spellbook',
                                    value: 'ULTBOOK'
                                }
                            ]
                        },
                        {
                            name: 'account',
                            description: 'account',
                            type: 'STRING'
                        }
                    ]
                }/*,
                {
                    name: 'compare',
                    description: 'compare stats',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'discordaccount',
                            description: 'Discord account',
                        },
                        {
                            name: 'champion',
                            description: 'Champion',
                            type: 'STRING',
                            autocomplete: true,
                        },
                        {
                            name: 'lane',
                            description: 'Lane',
                            type: 'STRING',
                            choices: [
                                {
                                    name: 'Top',
                                    value: 'TOP'
                                },
                                {
                                    name: 'Jungle',
                                    value: 'JUNGLE'
                                },
                                {
                                    name: 'Mid',
                                    value: 'MIDDLE'
                                },
                                {
                                    name: 'ADC',
                                    value: 'ADC'
                                },
                                {
                                    name: 'Support',
                                    value: 'SUPPORT'
                                },
                            ]
                        },
                        {
                            name: 'gamemode',
                            description: 'GameMode',
                            type: 'STRING',
                            choices: [
                                {
                                    name: 'normal',
                                    value: 'CLASSIC'
                                },
                                {
                                    name: 'Ranked Solo/Duo',
                                    value: 'RANKED_SOLO'
                                },
                                {
                                    name: 'Ranked Flex',
                                    value: 'RANKED_FLEX'
                                },
                                {
                                    name: 'ARAM',
                                    value: 'ARAM'
                                },
                                {
                                    name: 'URF',
                                    value: 'URF'
                                },
                                {
                                    name: 'One for All',
                                    value: 'ONEFORALL'
                                },
                                {
                                    name: 'Ultimate spellbook',
                                    value: 'ULTBOOK'
                                }
                            ]
                        }
                    ]
                }*/,
                {
                    name: 'ks',
                    description: 'See ks stats',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'discordaccount',
                            description: 'Discord account',
                            type: 'USER',
                        },
                        {
                            name: 'champion',
                            description: 'Champion',
                            type: 'STRING',
                            autocomplete: true,
                        },
                        {
                            name: 'lane',
                            description: 'Lane',
                            type: 'STRING',
                            choices: [
                                {
                                    name: 'Top',
                                    value: 'TOP'
                                },
                                {
                                    name: 'Jungle',
                                    value: 'JUNGLE'
                                },
                                {
                                    name: 'Mid',
                                    value: 'MIDDLE'
                                },
                                {
                                    name: 'ADC',
                                    value: 'ADC'
                                },
                                {
                                    name: 'Support',
                                    value: 'SUPPORT'
                                },
                            ]
                        },
                        {
                            name: 'gamemode',
                            description: 'GameMode',
                            type: 'STRING',
                            choices: [
                                {
                                    name: 'normal',
                                    value: 'CLASSIC'
                                },
                                {
                                    name: 'Ranked Solo/Duo',
                                    value: 'RANKED_SOLO'
                                },
                                {
                                    name: 'Ranked Flex',
                                    value: 'RANKED_FLEX'
                                },
                                {
                                    name: 'ARAM',
                                    value: 'ARAM'
                                },
                                {
                                    name: 'URF',
                                    value: 'URF'
                                },
                                {
                                    name: 'One for All',
                                    value: 'ONEFORALL'
                                },
                                {
                                    name: 'Ultimate spellbook',
                                    value: 'ULTBOOK'
                                }
                            ]
                        },
                        {
                            name: 'account',
                            description: 'account',
                            type: 'STRING'
                        }
                    ]
                }/*,
                {
                    name: 'match',
                    description: 'See matchs stats',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'id',
                            description: 'Game\'s ID',
                            type: 'STRING'
                        },
                        {
                            name: 'account',
                            description: 'account',
                            type: 'STRING'
                        },
                        {
                            name: 'gamemode',
                            description: 'GameMode',
                            type: 'STRING',
                            choices: [
                                {
                                    name: 'normal',
                                    value: 'CLASSIC'
                                },
                                {
                                    name: 'Ranked Solo/Duo',
                                    value: 'RANKED_SOLO'
                                },
                                {
                                    name: 'Ranked Flex',
                                    value: 'RANKED_FLEX'
                                },
                                {
                                    name: 'ARAM',
                                    value: 'ARAM'
                                },
                                {
                                    name: 'URF',
                                    value: 'URF'
                                },
                                {
                                    name: 'One for All',
                                    value: 'ONEFORALL'
                                },
                                {
                                    name: 'Ultimate spellbook',
                                    value: 'ULTBOOK'
                                }
                            ]
                        },
                        {
                            name: 'champion',
                            description: 'Champion',
                            type: 'STRING',
                            autocomplete: true,
                        },
                        {
                            name: 'lane',
                            description: 'Lane',
                            type: 'STRING',
                            choices: [
                                {
                                    name: 'Top',
                                    value: 'TOP'
                                },
                                {
                                    name: 'Jungle',
                                    value: 'JUNGLE'
                                },
                                {
                                    name: 'Mid',
                                    value: 'MIDDLE'
                                },
                                {
                                    name: 'ADC',
                                    value: 'ADC'
                                },
                                {
                                    name: 'Support',
                                    value: 'SUPPORT'
                                }
                            ]
                        }
                    ]
                }*/
            ]
        },
        {
            name: 'top',
            description: 'top command',
            type: 'SUB_COMMAND_GROUP',
            options: [
                {
                    name: 'carry',
                    description: 'See top carry',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'champion',
                            description: 'Champion',
                            type: 'STRING',
                            autocomplete: true,
                        },
                        {
                            name: 'lane',
                            description: 'Lane',
                            type: 'STRING',
                            choices: [
                                {
                                    name: 'Top',
                                    value: 'TOP'
                                },
                                {
                                    name: 'Jungle',
                                    value: 'JUNGLE'
                                },
                                {
                                    name: 'Mid',
                                    value: 'MIDDLE'
                                },
                                {
                                    name: 'ADC',
                                    value: 'ADC'
                                },
                                {
                                    name: 'Support',
                                    value: 'SUPPORT'
                                },
                            ]
                        },
                        {
                            name: 'all',
                            description: 'All',
                            type: 'BOOLEAN'
                        }
                    ]
                },
                {
                    name: 'kwikscore',
                    description: 'See top kwikscore',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'champion',
                            description: 'Champion',
                            type: 'STRING',
                            autocomplete: true,
                        },
                        {
                            name: 'lane',
                            description: 'Lane',
                            type: 'STRING',
                            choices: [
                                {
                                    name: 'Top',
                                    value: 'TOP'
                                },
                                {
                                    name: 'Jungle',
                                    value: 'JUNGLE'
                                },
                                {
                                    name: 'Mid',
                                    value: 'MIDDLE'
                                },
                                {
                                    name: 'ADC',
                                    value: 'ADC'
                                },
                                {
                                    name: 'Support',
                                    value: 'SUPPORT'
                                },
                            ]
                        },
                        {
                            name: 'all',
                            description: 'All',
                            type: 'BOOLEAN'
                        }
                    ]
                }
            ]
        }
    ],
    commande_channel: true,
    async run(message, client, interaction = undefined) {
        if (interaction !== undefined) {
            const summoner_name = interaction.options.getString('name')?.replaceAll("'", "\\'");
            const champion = interaction.options.getString("champion")?.replaceAll("'", "\\'");
            const role = interaction.options.getString("lane")?.replaceAll("'", "\\'");
            const gamemode = interaction.options.getString("gamemode")?.replaceAll("'", "\\'");
            const account = interaction.options.getString("account")?.replaceAll("'", "\\'");
            const puuid = interaction.options.getString("id")?.replaceAll("'", "\\'");
            let discordaccount = interaction.options.getUser("discordaccount");

            await interaction.deferReply();
            if (interaction.options.getSubcommandGroup() === "account") {
                if (interaction.options.getSubcommand() === "add") {
                    const summoner_name = interaction.options.getString("name");
                    const response = await client.pg.query("SELECT * FROM summoners where discordid='" + interaction.user.id + "' AND LOWER(username)=LOWER('" + summoner_name + "');");
                    if (!client.requests["summoners"].includes({ "username": summoner_name, "discordid": interaction.user.id }) && response.rows.length === 0) {
                        await interaction.editReply("The request was added to the queue, this can take several minutes.");
                        return await addSumoner(client, summoner_name, interaction);
                    }
                    return await interaction.editReply("This account is already in the database or requested.");
                } else if (interaction.options.getSubcommand() === "remove") {
                    const response = await client.pg.query("SELECT * FROM summoners where discordid='" + interaction.user.id + "' AND username='" + summoner_name + "';");
                    if (response.rows.length > 0) {
                        await client.pg.query("DELETE FROM matchs " +
                            "WHERE player IN (" +
                            "SELECT puuid " +
                            "FROM summoners " +
                            "WHERE username='" + summoner_name + "'" +
                            ");"
                        );
                        await client.pg.query("DELETE FROM summoners " +
                            "WHERE discordid='" + interaction.user.id + "' " +
                            "AND username='" + summoner_name + "'" +
                            ";"
                        );
                        return await interaction.editReply("The account has been removed.");
                    }
                    return await interaction.editReply("This account is not in the database.");
                } else if (interaction.options.getSubcommand() === "list") {
                    const response = await client.pg.query("SELECT * FROM summoners where discordid='" + interaction.user.id + "';");
                    if (response.rows.length === 0) {
                        return await interaction.editReply("You don't have any account linked. Please use the command `/lol account add <name>` to add an account.");
                    }
                    const embed = new MessageEmbed()
                        .setTitle("Your accounts")
                        .setColor("#00FF00")
                        .setFooter({
                            text: "Requested by " + interaction.user.username,
                            //iconURL: interaction.user.displayAvatarURL()
                        })
                        .setTimestamp();
                    let accounts = "";
                    for (let i = 0; i < response.rows.length; i++) {
                        accounts += "-" + response.rows[i].username + "\n";
                    }
                    embed.addFields(
                        {
                            name: "Linked Accounts :",
                            value: accounts
                        }
                    );

                    return await interaction.editReply({ embeds: [embed] });
                }
            } else if (interaction.options.getSubcommandGroup() === "matchs") {
                if (interaction.options.getSubcommand() === "update") {
                    for (const x of client.requests["updates"]) {
                        if (x["discordid"] === interaction.user.id) {
                            return interaction.editReply("You already have a request in the queue.");
                        }
                    }
                    await interaction.editReply("The request was added to the queue, this can take several minutes.");
                    return await update(client, interaction);
                }
            } else if (interaction.options.getSubcommandGroup() === "queue") {
                if (interaction.options.getSubcommand() === "status") {
                    const embed = new MessageEmbed()
                        .setTitle("Queue status")
                        .setColor("#00FF00")
                        .setFooter({
                            text: "Requested by " + interaction.user.username,
                            //iconURL: interaction.user.displayAvatarURL()
                        })
                        .setTimestamp();
                    embed.addFields(
                        {
                            name: "Updates in queue :",
                            value: "- Length : " + client.requests["updates"].length + "\n" + "- Current : " + (client.requests["updates"].length > 0 ? "<@" + client.requests["updates"][0]["discordid"] + "> : " + client.requests["updates"][0]["count"] + "/" + client.requests["updates"][0]["total"] + " Games" : "None")
                        }
                    );
                    return await interaction.editReply({ embeds: [embed] });
                }
            } else if (interaction.options.getSubcommandGroup() === "stats") {
                if (interaction.options.getSubcommand() === "summarized") {
                    let discordusername = "";
                    if (discordaccount === undefined) {
                        discordaccount = interaction.user.id;
                        discordusername = interaction.user.username;
                    } else {
                        discordusername = discordaccount.username;
                        discordaccount = discordaccount.id;
                    }

                    let query = "SELECT * " +
                        "FROM matchs, summoners " +
                        "WHERE summoners.discordid='" + discordaccount + "' " +
                        "AND matchs.player = summoners.puuid";
                    if (champion !== undefined) {
                        query += " AND matchs.champion='" + champion + "'";
                    }
                    if (role !== undefined) {
                        query += " AND matchs.lane='" + role + "'";
                    }
                    if (gamemode !== undefined) {
                        query += " AND matchs.gamemode='" + gamemode + "'";
                    }
                    if (account !== undefined) {
                        query += " AND summoners.username='" + account + "'";
                    }
                    query += ";";
                    const response = await client.pg.query(query);
                    if (response.rows.length === 0) {
                        return await interaction.editReply("You don't have any matchs in the database or the filters are too restrictings.");
                    }

                    // Query 2
                    let query2 = "SELECT " +
                        "avg(length) as duration, " +
                        "avg(kill) as kill, " +
                        "avg(deaths) as deaths, " +
                        "avg(assists) as assists, " +
                        "avg(total_damage) as damage, " +
                        "avg(tanked_damage) as damage_taken, " +
                        "avg(heal) as heal, " +
                        "avg(cs) as cs, " +
                        "avg(gold) as gold, " +
                        "avg(vision_score) as vision_score, " +
                        "avg(pinks) as pinks, " +
                        "avg(total_kills) as total_kills " +
                        "FROM matchs, summoners " +
                        "WHERE summoners.discordid='" + discordaccount + "' AND matchs.player = summoners.puuid";
                    if (champion !== undefined) {
                        query2 += " AND matchs.champion='" + champion + "'";
                    }
                    if (role !== undefined) {
                        query2 += " AND matchs.lane='" + role + "'";
                    }
                    if (gamemode !== undefined) {
                        query2 += " AND matchs.gamemode='" + gamemode + "'";
                    }
                    if (account !== undefined) {
                        query2 += " AND summoners.username='" + account + "'";
                    }
                    query2 += ";";
                    const response2 = await client.pg.query(query2);

                    // query 3
                    let query3 = "SELECT " +
                        "gamemode, " +
                        "count(gamemode) " +
                        "FROM matchs, summoners " +
                        "WHERE summoners.discordid='" + discordaccount + "' AND matchs.player = summoners.puuid";
                    if (champion !== undefined) {
                        query3 += " AND matchs.champion='" + champion + "'";
                    }
                    if (role !== undefined) {
                        query3 += " AND matchs.lane='" + role + "'";
                    }
                    if (account !== undefined) {
                        query3 += " AND summoners.username='" + account + "'";
                    }
                    query3 += " GROUP BY gamemode;";
                    const response3 = await client.pg.query(query3);
                    if (response3.rows.length === 0) {
                        return await interaction.editReply("You don't have any matchs in the database or the filters are too restrictings.");
                    }

                    // plot

                    const url = "https://chart.googleapis.com/chart?cht=p&chs=500x300&chd=t:";

                    let values = "";
                    let labels = "";

                    for (let i = 0; i < response3.rows.length; i++) {
                        values += response3.rows[i].count + ",";
                        labels += response3.rows[i].gamemode + "|";
                    }
                    values = values.substring(0, values.length - 1);
                    labels = labels.substring(0, labels.length - 1);

                    const url2 = url + values + "&chl=" + labels + "&chco=FFC6A5|FFFF42|DEF3BD|00A5C6|DEBDDE|FF0000|0000CC|660033|66FF66";


                    // 1) Carry stats

                    let carry_damage = 0;
                    let carry_tanked = 0;
                    let carry_gold = 0;
                    let overall = 0;
                    let hard_carry = 0;
                    let win = 0;


                    for (let i = 0; i < response.rows.length; i++) {
                        if (response.rows[i].result === "Win") {
                            win += 1;
                        }
                        if (response.rows[i].first_gold) {
                            carry_gold += 1;
                        }
                        if (response.rows[i].first_damages) {
                            carry_damage += 1;
                        }
                        if (response.rows[i].first_tanked) {
                            carry_tanked += 1;
                        }
                        if (response.rows[i].first_damages && response.rows[i].first_tanked && response.rows[i].first_gold) {
                            hard_carry += 1;
                        }
                        if (response.rows[i].first_damages || response.rows[i].first_tanked || response.rows[i].first_gold) {
                            overall += 1;
                        }
                    }

                    // 2) Average stats

                    const length = response2.rows[0].duration;

                    const average_kills = Number.parseFloat(response2.rows[0].kill).toFixed(2);
                    const average_deaths = Number.parseFloat(response2.rows[0].deaths).toFixed(2);
                    const average_assists = Number.parseFloat(response2.rows[0].assists).toFixed(2);
                    let average_cs = Number.parseFloat(response2.rows[0].cs).toFixed(2);
                    let average_gold = response2.rows[0].gold;
                    let average_damages = response2.rows[0].damage;
                    let average_tanked = response2.rows[0].damage_taken;
                    const average_pinks = Number.parseFloat(response2.rows[0].pinks).toFixed(2);
                    const average_vision_score = Number.parseFloat(response2.rows[0].vision_score).toFixed(2);
                    const average_total_kills = Number.parseFloat(response2.rows[0].total_kills).toFixed(2);

                    average_cs = (average_cs / (length / 60)).toFixed(2);
                    average_gold = (average_gold / (length / 60)).toFixed(2);
                    average_damages = (average_damages / (length / 60)).toFixed(2);
                    average_tanked = (average_tanked / (length / 60)).toFixed(2);

                    // KwikScore

                    let score = 0;
                    score += overall / response.rows.length * 100;
                    score += win / response.rows.length * 100;
                    score += (Number.parseFloat(average_kills) + Number.parseFloat(average_assists)) / average_total_kills * 100;
                    score += 5 * (((Number.parseFloat(average_vision_score)) / (length / 60)) / 0.2);
                    score += 10 * average_cs;
                    if (100 - response.rows.length > 0) {
                        score = score * 0.99 ** (100 - response.rows.length);
                    }

                    let title = "" + discordusername + "'s stats";
                    if (champion !== undefined) {
                        title += " with " + champion;
                    }
                    if (role !== undefined) {
                        title += " in " + role;
                    }
                    if (account !== undefined) {
                        title += " on \"" + account + "\"";
                    }

                    // send embed
                    const embed = new MessageEmbed()
                        .setTitle(title)
                        .setColor("#00FF00")
                        .setFooter({
                            text: "Requested by " + interaction.user.username,
                            //iconURL: interaction.user.displayAvatarURL()
                        })
                        .setTimestamp();
                    embed.addFields(
                        {
                            name: "Number of matchs :",
                            value: "" + response.rows.length,
                            inline: true
                        },
                        {
                            name: "WR :",
                            value: "" + (win / response.rows.length * 100).toFixed(2) + " %",
                            inline: true,
                        },
                        {
                            name: "KillParticipation :",
                            value: "" + ((Number.parseFloat(average_kills) + Number.parseFloat(average_assists)) / average_total_kills * 100).toFixed(2) + " %",
                            inline: true,
                        },
                        {
                            name: "Carry stats :",
                            value: "Overall : " + (overall / response.rows.length * 100).toFixed(2) + " %\nHard Carry : " + (hard_carry / response.rows.length * 100).toFixed(2) + " %\nDamage : " + (carry_damage / response.rows.length * 100).toFixed(2) + " %\nTanked : " + (carry_tanked / response.rows.length * 100).toFixed(2) + " %\nGold : " + (carry_gold / response.rows.length * 100).toFixed(2) + " %",
                            inline: true
                        },
                        {
                            name: "KS (KwikScore) :",
                            value: "" + score.toFixed(0) + " / 500",
                            inline: true
                        },
                        {
                            name: "Average stats :",
                            value: "Kills : " + average_kills +
                                "\nDeaths : " + average_deaths +
                                "\nAssists : " + average_assists +
                                "\nCS/min : " + average_cs +
                                "\nDamages/min : " + average_damages +
                                "\nTanked/min : " + average_tanked +
                                "\nPinks : " + average_pinks +
                                "\nVision Score : " + average_vision_score +
                                "\nGold/min : " + average_gold,
                            inline: true
                        }
                    ).setImage(url2);
                    return await interaction.editReply({ embeds: [embed] });
                } else if (interaction.options.getSubcommand() === "matchups") {
                    let querychamp = "";
                    if (champion !== undefined) {
                        querychamp = " AND matchs.champion='" + champion + "'";
                    }
                    let queryrole = "";
                    if (role !== undefined) {
                        queryrole = " AND matchs.lane='" + role + "'";
                    }
                    let querygamemode = "";
                    if (gamemode !== undefined) {
                        querygamemode = " AND matchs.gamemode='" + gamemode + "'";
                    }
                    let queryaccount = "";
                    if (account !== undefined) {
                        queryaccount = " AND summoners.username='" + account + "'";
                    }

                    let discordusername = "";
                    if (discordaccount === undefined) {
                        discordaccount = interaction.user.id;
                        discordusername = interaction.user.username;
                    } else {
                        discordusername = discordaccount.username;
                        discordaccount = discordaccount.id;
                    }


                    let query = "SELECT matchs.matchup, count(*) AS count1, (cast(" +
                        "count(*) FILTER (" +
                        "WHERE result = 'Win'" +
                        ")*100 as float)/count(*)) AS winrate, (cast(" +
                        "count(*) FILTER (" +
                        "WHERE (first_tanked OR first_gold OR first_damages)" +
                        ")*100 as float)/count(*)) AS carry " +
                        "FROM matchs, summoners " +
                        "WHERE summoners.discordid='" + discordaccount + "' AND matchs.player = summoners.puuid";
                    query += querychamp;
                    query += queryrole;
                    query += querygamemode;
                    query += queryaccount;
                    query += " GROUP BY matchs.matchup ORDER BY count1 DESC;";
                    const response = await client.pg.query(query);
                    if (response.rows.length === 0) {
                        return await interaction.editReply("You don't have any matchs in the database or the filters are too restrictings.");
                    }

                    const url = "https://chart.googleapis.com/chart?cht=bvg&chs=1000x300&chxt=x,y&chd=t:";

                    let values1 = "";
                    let values2 = "";
                    let champ = "";

                    const data = [];
                    for (let i = 0; i < response.rows.length; i++) {
                        if (response.rows[i].count1 > 4 && response.rows[i].matchup !== "" && response.rows[i].matchup !== "Invalid") {
                            data.push("- " + response.rows[i].matchup + " : " + response.rows[i].count1 + " matchs (" + response.rows[i].winrate.toFixed(1) + "% winrate, " + response.rows[i].carry.toFixed(1) + "% carry)\n");
                            if (i < 17) {
                                values1 += response.rows[i].winrate + ",";
                                values2 += response.rows[i].carry + ",";
                                champ += response.rows[i].matchup + "|";
                            }
                        }
                    }
                    values1 = values1.substring(0, values1.length - 1);
                    values2 = values2.substring(0, values2.length - 1);
                    champ = champ.substring(0, champ.length - 1);

                    if (data.length === 0) {
                        return await interaction.editReply("You don't have any matchs in the database or the filters are too restrictings.");
                    }

                    const url2 = (url + values1 + "|" + values2 + "&chl=" + champ + "&chco=FF0000,00FF00");

                    let title = "" + discordusername + "'s matchups";
                    if (champion !== undefined) {
                        title += " with " + champion;
                    }
                    if (role !== undefined) {
                        title += " in " + role;
                    }
                    if (account !== undefined) {
                        title += " on \"" + account + "\"";
                    }

                    // send embed
                    const embed = new MessageEmbed()
                        .setTitle(title)
                        .setColor("#00FF00")
                        .setFooter({
                            text: "Requested by " + interaction.user.username,
                            //iconURL: interaction.user.displayAvatarURL()
                        })
                        .setTimestamp();
                    embed.addFields(
                        {
                            name: "Number of matchups :",
                            value: "" + response.rows.length
                        },
                    )
                        .setImage(url2);

                    for (let i = 0; i < 5; i++) {
                        let text = "";
                        if (data[i * 5] !== undefined) {
                            text += data[i * 5];
                        }
                        if (data[i * 5 + 1] !== undefined) {
                            text += data[i * 5 + 1];
                        }
                        if (data[i * 5 + 2] !== undefined) {
                            text += data[i * 5 + 2];
                        }
                        if (data[i * 5 + 3] !== undefined) {
                            text += data[i * 5 + 3];
                        }
                        if (data[i * 5 + 4] !== undefined) {
                            text += data[i * 5 + 4];
                        }
                        if (text !== "") {
                            embed.addFields(
                                {
                                    name: "Matchup " + (i + 1) + " :",
                                    value: text
                                }
                            );
                        }
                    }

                    return await interaction.editReply({ embeds: [embed] });
                } else if (interaction.options.getSubcommand() === "champions") {
                    let queryrole = "";
                    if (role !== undefined) {
                        queryrole = " AND matchs.lane='" + role + "'";
                    }
                    let querygamemode = "";
                    if (gamemode !== undefined) {
                        querygamemode = " AND matchs.gamemode='" + gamemode + "'";
                    }
                    let queryaccount = "";
                    if (account !== undefined) {
                        queryaccount = " AND summoners.username='" + account + "'";
                    }

                    let discordusername = "";
                    if (discordaccount === undefined) {
                        discordaccount = interaction.user.id;
                        discordusername = interaction.user.username;
                    } else {
                        discordusername = discordaccount.username;
                        discordaccount = discordaccount.id;
                    }

                    const query = "SELECT champion, " +
                        "count(*) AS count, " +
                        "(cast(" +
                        "count(*) FILTER (" +
                        "WHERE result = 'Win'" +
                        ")*100 as float)/count(*)) as winrate, " +
                        "(cast(" +
                        "count(*) FILTER (" +
                        "WHERE (first_tanked OR first_gold OR first_damages)" +
                        ")*100 as float)/count(*)) AS carry " +
                        "FROM matchs, summoners " +
                        "WHERE summoners.discordid='" + discordaccount + "' " +
                        "AND matchs.player = summoners.puuid" +
                        queryrole +
                        querygamemode +
                        queryaccount +
                        " GROUP BY champion " +
                        "ORDER BY count(*) DESC;";
                    const response = await client.pg.query(query);
                    if (response.rows.length === 0) {
                        return await interaction.editReply("You don't have any matchs in the database.");
                    }

                    const url = "https://chart.googleapis.com/chart?cht=bvg&chs=1000x300&chxt=x,y&chd=t:";

                    let values1 = "";
                    let values2 = "";
                    let champ = "";

                    for (let i = 0; i < response.rows.length; i++) {
                        if (response.rows[i].count > 4 && response.rows[i].champion !== "" && response.rows[i].champion !== "Invalid") {
                            if (i < 17) {
                                values1 += response.rows[i].winrate + ",";
                                values2 += response.rows[i].carry + ",";
                                champ += response.rows[i].champion + "|";
                            }
                        }
                    }
                    values1 = values1.substring(0, values1.length - 1);
                    values2 = values2.substring(0, values2.length - 1);
                    champ = champ.substring(0, champ.length - 1);
                    const url2 = (url + values1 + "|" + values2 + "&chl=" + champ + "&chco=FF0000,00FF00");

                    let title = "" + discordusername + "'s champions";
                    if (role !== undefined) {
                        title += " in " + role;
                    }
                    if (account !== undefined) {
                        title += " on \"" + account + "\"";
                    }

                    // send embed
                    const embed = new MessageEmbed()
                        .setTitle(title)
                        .setColor("#00FF00")
                        .setFooter({
                            text: "Requested by " + interaction.user.username,
                            //iconURL: interaction.user.displayAvatarURL()
                        })
                        .setTimestamp()
                        .addFields(
                            {
                                name: "Number of champions :",
                                value: "" + response.rows.length
                            },
                        )
                        .setImage(url2);

                    for (let i = 0; i < 5; i++) {
                        let text = "";
                        if (response.rows[i * 5] !== undefined && response.rows[i * 5].champion !== "" && response.rows[i * 5].count > 4) {
                            text += "- " + response.rows[i * 5].champion + " : " + response.rows[i * 5].count + " matchs (" + response.rows[i * 5].winrate.toFixed(1) + "% winrate, " + response.rows[i * 5].carry.toFixed(1) + "% carry)\n";
                        }
                        if (response.rows[i * 5 + 1] !== undefined && response.rows[i * 5 + 1].champion !== "" && response.rows[i * 5 + 1].count > 4) {
                            text += "- " + response.rows[i * 5 + 1].champion + " : " + response.rows[i * 5 + 1].count + " matchs (" + response.rows[i * 5 + 1].winrate.toFixed(1) + "% winrate, " + response.rows[i * 5 + 1].carry.toFixed(1) + "% carry)\n";
                        }
                        if (response.rows[i * 5 + 2] !== undefined && response.rows[i * 5 + 2].champion !== "" && response.rows[i * 5 + 2].count > 4) {
                            text += "- " + response.rows[i * 5 + 2].champion + " : " + response.rows[i * 5 + 2].count + " matchs (" + response.rows[i * 5 + 2].winrate.toFixed(1) + "% winrate, " + response.rows[i * 5 + 2].carry.toFixed(1) + "% carry)\n";
                        }
                        if (response.rows[i * 5 + 3] !== undefined && response.rows[i * 5 + 3].champion !== "" && response.rows[i * 5 + 3].count > 4) {
                            text += "- " + response.rows[i * 5 + 3].champion + " : " + response.rows[i * 5 + 3].count + " matchs (" + response.rows[i * 5 + 3].winrate.toFixed(1) + "% winrate, " + response.rows[i * 5 + 3].carry.toFixed(1) + "% carry)\n";
                        }
                        if (response.rows[i * 5 + 4] !== undefined && response.rows[i * 5 + 4].champion !== "" && response.rows[i * 5 + 4].count > 4) {
                            text += "- " + response.rows[i * 5 + 4].champion + " : " + response.rows[i * 5 + 4].count + " matchs (" + response.rows[i * 5 + 4].winrate.toFixed(1) + "% winrate, " + response.rows[i * 5 + 4].carry.toFixed(1) + "% carry)\n";
                        }
                        if (text !== "") {
                            embed.addFields(
                                {
                                    name: "Champion " + (i + 1) + " :",
                                    value: text
                                }
                            );
                        }
                    }

                    return await interaction.editReply({ embeds: [embed] });
                } else if (interaction.options.getSubcommand() === "match") {
                    if (puuid !== undefined) {
                        const query = "SELECT * FROM matchs WHERE puuid='" + puuid + "';";
                        const response = await client.pg.query(query);
                        if (response.rows.length === 0) {
                            return await interaction.editReply("This match doesn't exist.");
                        }
                        const match = response.rows[0];
                        console.log(match);
                    } else {
                        const account = interaction.options.getString("account");
                        //let queryaccount = ""
                        if (account !== undefined) {
                            //queryaccount = " AND summoners.account = '" + account + "' ";
                        }

                    }
                } else if (interaction.options.getSubcommand() === "ks") {
                    let discordusername = "";
                    if (discordaccount === undefined) {
                        discordaccount = interaction.user.id;
                        discordusername = interaction.user.username;
                    } else {
                        discordusername = discordaccount.username;
                        discordaccount = discordaccount.id;
                    }

                    let queryaccount = "";
                    let queryaccount2 = "";
                    if (account !== undefined) {
                        queryaccount = " AND summoners.account = '" + account + "'";
                        queryaccount2 = " AND s2.account = '" + account + "'";
                    }

                    let querygamemode = "";
                    let querygamemode2 = "";
                    if (gamemode !== undefined) {
                        querygamemode = " AND matchs.gamemode = '" + gamemode + "'";
                        querygamemode2 = " AND m2.gamemode = '" + gamemode + "'";
                    }

                    let queryrole = "";
                    let queryrole2 = "";
                    if (role !== undefined) {
                        queryrole = " AND matchs.lane = '" + role + "'";
                        queryrole2 = " AND m2.lane = '" + role + "'";
                    }

                    let querychamp = "";
                    let querychamp2 = "";
                    if (champion !== undefined) {
                        querychamp = " AND matchs.champion='" + champion + "'";
                        querychamp2 = " AND m2.champion='" + champion + "'";
                    }

                    const query =
                        "SELECT timestamp*86400000 as time, " +
                        "count(*) as daily, " +
                        "(" +
                        "SELECT ARRAY[" +
                        "count(*), " +
                        "cast(count(*) FILTER (WHERE first_tanked OR first_gold OR first_damages)*100 as float)/count(*), " +
                        "cast(count(*) FILTER (WHERE result = 'Win')*100 as float)/count(*), " +
                        "cast((avg(m2.kill)+avg(m2.assists))*100 as float)/avg(m2.total_kills), " +
                        "(avg(m2.vision_score))/(avg(m2.length)/60), " +
                        "(avg(m2.cs))/(avg(m2.length)/60), " +
                        "cast(count(*) FILTER (WHERE first_tanked AND first_gold AND first_damages)*100 as float)/count(*) " +
                        "] as stats " +
                        "FROM matchs m2, summoners s2 " +
                        "WHERE m2.player = s2.puuid " +
                        "AND s2.discordid = '" + discordaccount + "'" +
                        queryaccount2 +
                        querygamemode2 +
                        queryrole2 +
                        querychamp2 +
                        " AND m2.timestamp <= (matchs.timestamp+1)*86400000 " +
                        ")" +
                        "FROM " +
                        "(" +
                        "SELECT puuid, " +
                        "champion, " +
                        "lane, " +
                        "gamemode, " +
                        "player, " +
                        "cast((matchs.timestamp)/86400000 as bigint) as timestamp " +
                        "FROM matchs " +
                        ") as matchs, summoners " +
                        "WHERE matchs.player = summoners.puuid " +
                        "AND summoners.discordid = '" + discordaccount + "'" +
                        queryaccount +
                        querygamemode +
                        queryrole +
                        querychamp +
                        " GROUP BY timestamp;";

                    const response = await client.pg.query(query);
                    if (response.rows.length === 0) {
                        interaction.editReply("No data found for this account");
                        return;
                    }

                    const ks = [];
                    for (let i = 0; i < response.rows.length; i++) {
                        let score = 0;
                        score += response.rows[i].stats[1];
                        score += response.rows[i].stats[2];
                        score += response.rows[i].stats[3];
                        score += 5 * response.rows[i].stats[4];
                        score += 10 * response.rows[i].stats[5];
                        if (100 - response.rows[i].stats[0] > 0) {
                            score = score * 0.99 ** (100 - response.rows[i].stats[0]);
                        }
                        ks.push({ x: response.rows[i].time, y: score });
                    }
                    //console.log(ks)

                    let url = "https://chart.googleapis.com/chart?cht=lc&chs=600x300&chco=FFC6A5&chxt=y&chxr=0,0,500&chdl=ks&chd=t:";
                    let values = "";
                    for (let i = 0; i < ks.length; i++) {
                        values += (ks[i].y / 5).toFixed(0) + ",";
                    }
                    values = values.slice(0, -1);
                    url += values;
                    //console.log(url)


                    // create embed
                    const embed = new MessageEmbed()
                        .setTitle("" + discordusername + "'s ks")
                        .setColor("#00FF00")
                        .setFooter({
                            text: "Requested by " + interaction.user.username,
                            //iconURL: interaction.user.displayAvatarURL()
                        })
                        .setTimestamp()
                        .addFields(
                            {
                                name: "Number of days played :",
                                value: "" + response.rows.length
                            },
                        )
                        .setImage(url);

                    interaction.editReply({ embeds: [embed] });

                }
            } else if (interaction.options.getSubcommandGroup() === "top") {
                if (interaction.options.getSubcommand() === "carry") {
                    let query2 = "";
                    if (champion !== undefined) {
                        query2 += " AND matchs.champion='" + champion + "'";
                    }

                    let queryrole = "";
                    if (role !== undefined) {
                        queryrole = " AND matchs.lane='" + role + "'";
                    }

                    const all = interaction.options.getBoolean("all") === true;
                    let queryall = "";
                    if (!all) {
                        let members = await interaction.guild.members.fetch();
                        members = members.filter(member => !member.user.bot);
                        let list = "(";
                        members.forEach(member => {
                            list += "'" + member.user.id + "',";
                        });
                        list = list.slice(0, -1);
                        list += ")";
                        queryall = " AND summoners.discordid IN " + list;
                    }

                    let query =
                        "SELECT summoners.discordid, " +
                        "count(*) as count, " +
                        "(cast(" +
                        "count(*) FILTER (" +
                        "WHERE (matchs.first_tanked OR first_gold OR first_damages)" +
                        ")*100 as float)/count(*)) as carry " +
                        "FROM matchs, summoners " +
                        "WHERE matchs.player = summoners.puuid" +
                        query2 +
                        queryrole +
                        queryall +
                        " GROUP BY summoners.discordid ORDER BY carry DESC LIMIT 10;";
                    let response = await client.pg.query(query);

                    let general = "";
                    if (response.rows.length === 0) {
                        general = "There are not enought summoners in the database or the filters are too restrictings.";
                    } else {
                        for (const x of response.rows) {
                            general += "- <@" + x.discordid + "> : " + x.carry.toFixed(2) + " % (" + x.count + " matchs)\n";
                        }
                    }

                    // damage Carry
                    query =
                        "SELECT summoners.discordid, " +
                        "count(*) as count, " +
                        "(cast(" +
                        "count(*) FILTER (" +
                        "WHERE matchs.first_damages" +
                        ")*100 as float)/count(*)) as damage " +
                        "FROM matchs, summoners " +
                        "WHERE matchs.player = summoners.puuid" +
                        query2 +
                        queryrole +
                        queryall +
                        " GROUP BY summoners.discordid ORDER BY damage DESC LIMIT 10;";
                    response = await client.pg.query(query);

                    let damages = "";
                    if (response.rows.length === 0) {
                        damages = "There are not enought summoners in the database or the filters are too restrictings.";
                    } else {
                        for (const x of response.rows) {
                            damages += "- <@" + x.discordid + "> : " + x.damage.toFixed(2) + " % (" + x.count + " matchs)\n";
                        }
                    }

                    // tanked Carry
                    query =
                        "SELECT summoners.discordid, " +
                        "count(*) as count, " +
                        "(cast(" +
                        "count(*) FILTER (" +
                        "WHERE matchs.first_tanked" +
                        ")*100 as float)/count(*)) as tanked " +
                        "FROM matchs, summoners " +
                        "WHERE matchs.player = summoners.puuid" +
                        query2 +
                        queryrole +
                        queryall +
                        " GROUP BY summoners.discordid ORDER BY tanked DESC LIMIT 10;";
                    response = await client.pg.query(query);

                    let tanked = "";
                    if (response.rows.length === 0) {
                        tanked = "There are not enought summoners in the database or the filters are too restrictings.";
                    } else {
                        for (const x of response.rows) {
                            tanked += "- <@" + x.discordid + "> : " + x.tanked.toFixed(2) + " % (" + x.count + " matchs)\n";
                        }
                    }

                    // Gold carry
                    query =
                        "SELECT summoners.discordid, " +
                        "count(*) as count, " +
                        "(cast(" +
                        "count(*) FILTER (" +
                        "WHERE matchs.first_gold" +
                        ")*100 as float)/count(*)) as gold " +
                        "FROM matchs, summoners " +
                        "WHERE matchs.player = summoners.puuid" +
                        query2 +
                        queryrole +
                        queryall +
                        " GROUP BY summoners.discordid ORDER BY gold DESC LIMIT 10;";
                    response = await client.pg.query(query);

                    let gold = "";
                    if (response.rows.length === 0) {
                        gold = "There are not enought summoners in the database or the filters are too restrictings.";
                    } else {
                        for (const x of response.rows) {
                            gold += "- <@" + x.discordid + "> : " + x.gold.toFixed(2) + " % (" + x.count + " matchs)\n";
                        }
                    }

                    // Hard carry
                    query =
                        "SELECT summoners.discordid, " +
                        "count(*) as count, " +
                        "(cast(" +
                        "count(*) FILTER (" +
                        "WHERE matchs.first_damages AND first_gold AND first_tanked" +
                        ")*100 as float)/count(*)) as hardcarry " +
                        "FROM matchs, summoners " +
                        "WHERE matchs.player = summoners.puuid" +
                        query2 +
                        queryrole +
                        queryall +
                        " GROUP BY summoners.discordid ORDER BY hardcarry DESC LIMIT 10;";
                    response = await client.pg.query(query);
                    let hard = "";
                    if (response.rows.length === 0) {
                        hard = "There are not enought summoners in the database or the filters are too restrictings.";
                    } else {
                        for (const x of response.rows) {
                            hard += "- <@" + x.discordid + "> : " + x.hardcarry.toFixed(2) + " % (" + x.count + " matchs)\n";
                        }
                    }

                    // send embed
                    const embed = new MessageEmbed()
                        .setTitle("Top carry :")
                        .setColor("#00FF00")
                        .setFooter({
                            text: "Requested by " + interaction.user.username,
                            //iconURL: interaction.user.displayAvatarURL()
                        })
                        .setTimestamp();
                    embed.addFields(
                        {
                            name: "General carry :",
                            value: "" + general
                        },
                        {
                            name: "Damage carry :",
                            value: "" + damages
                        },
                        {
                            name: "Tanked carry :",
                            value: "" + tanked
                        },
                        {
                            name: "Gold carry :",
                            value: "" + gold
                        },
                        {
                            name: "Hard carry :",
                            value: "" + hard
                        },

                    );
                    return await interaction.editReply({ embeds: [embed] });
                } else if (interaction.options.getSubcommand() === "kwikscore") {
                    const all = interaction.options.getBoolean("all") === true;
                    let queryall = "";
                    if (!all) {
                        let members = await interaction.guild.members.fetch();
                        members = members.filter(member => !member.user.bot);
                        let list = "(";
                        members.forEach(member => {
                            list += "'" + member.user.id + "',";
                        });
                        list = list.slice(0, -1);
                        list += ")";
                        queryall = " AND summoners.discordid IN " + list;
                    }
                    let query2 = "";
                    if (champion !== undefined) {
                        query2 += " AND matchs.champion='" + champion + "'";
                    }

                    let queryrole = "";
                    if (role !== undefined) {
                        queryrole = " AND matchs.lane='" + role + "'";
                    }

                    const query =
                        "SELECT summoners.discordid, " +
                        "count(*), " +
                        "(cast(" +
                        "count(*) FILTER (" +
                        "WHERE result = 'Win'" +
                        ")*100 as float)/count(*)) as WR, " +
                        "(cast(" +
                        "count(*) FILTER (" +
                        "WHERE (first_gold OR first_damages OR first_tanked)" +
                        ")*100 as float)/count(*)) as CARRY, " +
                        "cast((avg(kill)+avg(assists))*100 as float)/avg(total_kills) as KP, " +
                        "cast(avg(vision_score) as float)/(avg(length)/60) as VS, " +
                        "cast(avg(cs) as float)/(avg(length)/60) as CS, " +
                        "(cast(" +
                        "count(*) FILTER (" +
                        "WHERE first_gold AND first_damages AND first_tanked" +
                        ")*100 as float)/count(*)) as hardcarry " +
                        "FROM matchs, summoners " +
                        "WHERE matchs.player = summoners.puuid" +
                        query2 +
                        queryrole +
                        queryall +
                        " GROUP BY summoners.discordid";

                    const query4 = "SELECT discordid, " +
                        "count, " +
                        "CASE WHEN count<100 THEN (carry+wr+kp+vs*25+10*cs)*POWER(0.99, (100-count)) " +
                        "ELSE (carry+wr+kp+vs*25+10*cs) " +
                        "END AS KS " +
                        "FROM (" + query + ") AS t1 " +
                        "ORDER BY KS DESC " +
                        "LIMIT 10;";
                    const response = await client.pg.query(query4);

                    if (response.rowCount === 0) {
                        return message.channel.send("No data found");
                    }

                    const embed = new MessageEmbed()
                        .setTitle("Top KS :")
                        .setColor("#00FF00")
                        .setFooter({
                            text: "Requested by " + interaction.user.username,
                            //iconURL: interaction.user.displayAvatarURL()
                        })
                        .setTimestamp();

                    let text = "";
                    for (let i = 0; i < response.rowCount; i++) {
                        text += "- <@" + response.rows[i].discordid + "> : " + response.rows[i].ks.toFixed(0) + " (" + response.rows[i].count + " Games)\n";
                    }

                    embed.addFields({
                        name: "Top 10 KwikScore : ",
                        value: "" + text,
                    });

                    return await interaction.editReply({ embeds: [embed] });
                }
            }
        }
    },
    async autocomplete(client, interaction) {
        const focusedValue = interaction.options.getFocused().replaceAll("'", "\\'");
        const query = "SELECT DISTINCT champion " +
            "FROM matchs " +
            "WHERE champion LIKE '" + focusedValue + "%'" +
            "AND champion <> 'Invalid' " +
            "ORDER BY champion " +
            "LIMIT 15;";
        const response = await client.pg.query(query);
        const champs = [];
        for (const x of response.rows) {
            champs.push({
                name: x.champion,
                value: x.champion
            });
        }
        return await interaction.respond(champs);
    },
    addSumoner,
    add_summoner_manual,
    update

};

async function addSumoner(client, name, interaction) {
    client.requests["summoners"].push({ "username": name, "discordid": interaction.user.id, "interaction": interaction });
    await client.lol();
}

async function update(client, interaction) {
    client.requests["updates"].push({ "discordid": interaction.user.id, "interaction": interaction, "matchs": [], "total": 0, "count": 0 });
    await client.lol();
}

async function add_summoner_manual(client, name, discordid) {
    client.requests["summoners"].push({ "username": name, "discordid": discordid, "interaction": undefined });
    await client.lol();
}