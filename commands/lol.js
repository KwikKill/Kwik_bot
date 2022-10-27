const fs = require("fs");
const path = require('path');
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
    async run(message, client, interaction=undefined, mssg=true) {
        if(interaction != undefined) {
            await interaction.deferReply()
            if(interaction.options.getSubcommandGroup() == "account") {
                if(interaction.options.getSubcommand() == "add") {
                    summoner_name = interaction.options.getString("name");
                    response = await client.pg.query("SELECT * FROM summoners where discordid='" + interaction.user.id + "' AND LOWER(username)=LOWER('" + summoner_name + "');")
                    if(!client.requests["summoners"].includes({"username": summoner_name, "discordid":interaction.user.id }) && response.rows.length == 0) {
                        await interaction.editReply("The request was added to the queue, this can take several minutes.");
                        return await addSumoner(client, interaction.user.id, summoner_name);
                    }else {
                        return await interaction.editReply("This account is already in the database or requested.");
                    }
                }else if(interaction.options.getSubcommand() == "remove") {
                    summoner_name = interaction.options.getString("name");
                    response = await client.pg.query("SELECT * FROM summoners where discordid='" + interaction.user.id + "' AND username='" + summoner_name + "';")
                    if(response.rows.length > 0) {
                        await client.pg.query("DELETE FROM matchs "+
                                              "WHERE player IN ("+
                                                "SELECT puuid "+
                                                "FROM summoners "+
                                                "WHERE username='" + summoner_name + "'" +
                                              ");"
                                            );
                        await client.pg.query("DELETE FROM summoners "+
                                              "WHERE discordid='" + interaction.user.id + "' "+
                                                "AND username='" + summoner_name + "'" +
                                              ";"
                                            )
                        return await interaction.editReply("The account has been removed.");
                    }
                    return await interaction.editReply("This account is not in the database.");
                }else if(interaction.options.getSubcommand() == "list") {
                    response = await client.pg.query("SELECT * FROM summoners where discordid='" + interaction.user.id + "';")
                    if(response.rows.length == 0) {
                        return await interaction.editReply("You don't have any account linked. Please use the command `/lol account add <name>` to add an account.");
                    }else {
                        embed = new MessageEmbed()
                        .setTitle("Your accounts")
                        .setColor("#00FF00")
                        .setFooter({
                            text: "Requested by " + interaction.user.username,
                            //iconURL: interaction.user.displayAvatarURL()
                        })
                        .setTimestamp();
                        accounts = "";
                        for(i=0; i<response.rows.length; i++) {
                            accounts += "-" + response.rows[i].username + "\n";
                        }
                        embed.addFields(
                            {
                                name: "Linked Accounts :", 
                                value: accounts
                            }
                        );

                        return await interaction.editReply({embeds: [embed]});
                    }
                }
            }else if(interaction.options.getSubcommandGroup() == "matchs") {
                if(interaction.options.getSubcommand() == "update") {
                    if(!client.requests["update"].includes(interaction.user.id)) {
                        await interaction.editReply("The request was added to the queue, this can take several minutes.");
                        return await update(client, interaction, interaction.user.id);
                    }else {
                        return await interaction.editReply("This request is already in the queue.");
                    }
                }
            }else if(interaction.options.getSubcommandGroup() == "queue") {
                if(interaction.options.getSubcommand() == "status") {
                    embed = new MessageEmbed()
                    .setTitle("Queue status")
                    .setColor("#00FF00")
                    .setFooter({
                        text: "Requested by " + interaction.user.username,
                        //iconURL: interaction.user.displayAvatarURL()
                    })
                    .setTimestamp();
                    embed.addFields(
                        {
                            name: "Requested Summoners :", 
                            value: "Number : " + client.requests["summoners"].length
                        },
                        {
                            name: "Requested Update :", 
                            value: "Number : " + client.requests["update"].length
                        },
                        {
                            name: "Matchs in queue :",
                            value: "Number : " + client.requests["matchs"].length
                        }
                    );
                    return await interaction.editReply({embeds: [embed]});
                }
            }else if(interaction.options.getSubcommandGroup() == "stats") {
                if(interaction.options.getSubcommand() == "summarized") {
                    champion = interaction.options.getString("champion");
                    role = interaction.options.getString("lane");
                    gamemode = interaction.options.getString("gamemode");
                    account = interaction.options.getString("account");
                    discordaccount = interaction.options.getUser("discordaccount");
                    discordusername = ""
                    if(discordaccount == undefined) {
                        discordaccount = interaction.user.id;
                        discordusername = interaction.user.username;
                    }else {
                        discordusername = discordaccount.username;
                        discordaccount = discordaccount.id;
                    }
                    
                    query = "SELECT * " + 
                            "FROM matchs, summoners " +
                            "WHERE summoners.discordid='" + discordaccount + "' " +
                                "AND matchs.player = summoners.puuid";
                    if(champion != undefined) {
                        query += " AND matchs.champion='" + champion + "'";
                    }
                    if(role != undefined) {
                        query += " AND matchs.lane='" + role + "'";
                    }
                    if(gamemode != undefined) {
                        query += " AND matchs.gamemode='" + gamemode + "'";
                    }
                    if(account != undefined) {
                        query += " AND summoners.username='" + account + "'";
                    }
                    query += ";"
                    response = await client.pg.query(query);
                    if(response.rows.length == 0) {
                        return await interaction.editReply("You don't have any matchs in the database or the filters are too restrictings.");
                    }

                    // Query 2
                    query2 = "SELECT " + 
                                "avg(length) as duration, "+
                                "avg(kill) as kill, "+
                                "avg(deaths) as deaths, "+
                                "avg(assists) as assists, "+
                                "avg(total_damage) as damage, "+
                                "avg(tanked_damage) as damage_taken, "+
                                "avg(heal) as heal, "+
                                "avg(cs) as cs, "+
                                "avg(gold) as gold, "+
                                "avg(vision_score) as vision_score, "+
                                "avg(pinks) as pinks, "+
                                "avg(total_kills) as total_kills " +
                            "FROM matchs, summoners "+
                            "WHERE summoners.discordid='" + discordaccount + "' AND matchs.player = summoners.puuid";
                    if(champion != undefined) {
                        query2 += " AND matchs.champion='" + champion + "'";
                    }
                    if(role != undefined) {
                        query2 += " AND matchs.lane='" + role + "'";
                    }
                    if(gamemode != undefined) {
                        query2 += " AND matchs.gamemode='" + gamemode + "'";
                    }
                    if(account != undefined) {
                        query2 += " AND summoners.username='" + account + "'";
                    }
                    query2 += ";"
                    response2 = await client.pg.query(query2);

                    // query 3
                    query3 = "SELECT " + 
                                "gamemode, "+
                                "count(gamemode) " + 
                            "FROM matchs, summoners "+
                            "WHERE summoners.discordid='" + discordaccount + "' AND matchs.player = summoners.puuid";
                    if(champion != undefined) {
                        query3 += " AND matchs.champion='" + champion + "'";
                    }
                    if(role != undefined) {
                        query3 += " AND matchs.lane='" + role + "'";
                    }
                    if(account != undefined) {
                        query3 += " AND summoners.username='" + account + "'";
                    }
                    query3 += " GROUP BY gamemode;"
                    response3 = await client.pg.query(query3);
                    if(response3.rows.length == 0) {
                        return await interaction.editReply("You don't have any matchs in the database or the filters are too restrictings.");
                    }

                    // plot

                    url = "https://chart.googleapis.com/chart?cht=p&chs=500x300&chd=t:"
                    
                    values = ""
                    labels = ""

                    for(i = 0; i < response3.rows.length; i++) {
                        values += response3.rows[i].count + ",";
                        labels += response3.rows[i].gamemode + "|";
                    }
                    values = values.substring(0, values.length - 1);
                    labels = labels.substring(0, labels.length - 1);
                    
                    url2 = url + values + "&chl=" + labels + "&chco=FFC6A5|FFFF42|DEF3BD|00A5C6|DEBDDE|FF0000|0000CC|660033|66FF66";


                    // 1) Carry stats

                    carry_damage = 0;
                    carry_tanked = 0;
                    carry_gold = 0;
                    overall = 0;
                    hard_carry = 0;
                    win = 0;
                    

                    for(i=0; i<response.rows.length; i++) {
                        if(response.rows[i].result == "Win") {
                            win += 1;
                        }
                        if(response.rows[i].first_gold) {
                            carry_gold += 1;
                        }
                        if(response.rows[i].first_damages) {
                            carry_damage += 1;
                        }
                        if(response.rows[i].first_tanked) {
                            carry_tanked += 1;
                        }
                        if(response.rows[i].first_damages && response.rows[i].first_tanked && response.rows[i].first_gold) {
                            hard_carry += 1;
                        }
                        if(response.rows[i].first_damages || response.rows[i].first_tanked || response.rows[i].first_gold) {
                            overall += 1;
                        }
                    }

                    // 2) Average stats

                    length = response2.rows[0].duration;

                    average_kills = Number.parseFloat(response2.rows[0].kill).toFixed(2);
                    average_deaths = Number.parseFloat(response2.rows[0].deaths).toFixed(2);
                    average_assists = Number.parseFloat(response2.rows[0].assists).toFixed(2);
                    average_cs = Number.parseFloat(response2.rows[0].cs).toFixed(2);
                    average_gold = response2.rows[0].gold;
                    average_damages = response2.rows[0].damage;
                    average_tanked = response2.rows[0].damage_taken;
                    average_pinks = Number.parseFloat(response2.rows[0].pinks).toFixed(2);
                    average_vision_score = Number.parseFloat(response2.rows[0].vision_score).toFixed(2);
                    average_total_kills = Number.parseFloat(response2.rows[0].total_kills).toFixed(2);

                    average_cs = (average_cs / (length/60)).toFixed(2);
                    average_gold = (average_gold / (length/60)).toFixed(2);
                    average_damages = (average_damages / (length/60)).toFixed(2);
                    average_tanked = (average_tanked / (length/60)).toFixed(2);

                    // KwikScore

                    score = 0;
                    score += overall/response.rows.length*100
                    score += win/response.rows.length*100
                    score += (Number.parseFloat(average_kills) + Number.parseFloat(average_assists))/average_total_kills*100
                    score += 5*(((Number.parseFloat(average_vision_score))/(length/60))/0.2)
                    score += 10*average_cs
                    if(100 - response.rows.length > 0) {
                        score = score * 0.99**(100 - response.rows.length);
                    }
                    
                    // send embed
                    embed = new MessageEmbed()
                    .setTitle("" + discordusername + "'s stats")
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
                            value: "" + (win/response.rows.length*100).toFixed(2) + " %",
                            inline: true,
                        },
                        {
                            name: "KillParticipation :",
                            value: "" + ((Number.parseFloat(average_kills) + Number.parseFloat(average_assists))/average_total_kills*100).toFixed(2) + " %",
                            inline: true,
                        },
                        {
                            name: "Carry stats :",
                            value: "Overall : " + (overall/response.rows.length*100).toFixed(2) + " %\nHard Carry : " + (hard_carry/response.rows.length*100).toFixed(2) + " %\nDamage : " + (carry_damage/response.rows.length*100).toFixed(2) + " %\nTanked : " + (carry_tanked/response.rows.length*100).toFixed(2) + " %\nGold : " + (carry_gold/response.rows.length*100).toFixed(2) + " %",
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
                    return await interaction.editReply({embeds: [embed]});
                }else if(interaction.options.getSubcommand() == "matchups") {
                    champion = interaction.options.getString("champion");
                    role = interaction.options.getString("lane");
                    gamemode = interaction.options.getString("gamemode");
                    account = interaction.options.getString("account");
                    querychamp = ""
                    querychamp2 = ""
                    if(champion != undefined) {
                        querychamp = " AND matchs.champion='" + champion + "'";
                        querychamp2 = " AND m2.champion='" + champion + "'";
                    }
                    queryrole = ""
                    queryrole2 = ""
                    if(role != undefined) {
                        queryrole = " AND matchs.lane='" + role + "'";
                        queryrole2 = " AND m2.lane='" + role + "'";
                    }
                    querygamemode = ""
                    querygamemode2 = ""
                    if(gamemode != undefined) {
                        querygamemode = " AND matchs.gamemode='" + gamemode + "'";
                        querygamemode2 = " AND m2.gamemode='" + gamemode + "'";
                    }
                    queryaccount = ""
                    queryaccount2 = ""
                    if(account != undefined) {
                        queryaccount = " AND summoners.username='" + account + "'";
                        queryaccount2 = " AND s2.username='" + account + "'";
                    }

                    discordaccount = interaction.options.getUser("discordaccount");
                    discordusername = ""
                    if(discordaccount == undefined) {
                        discordaccount = interaction.user.id;
                        discordusername = interaction.user.username;
                    }else {
                        discordusername = discordaccount.username;
                        discordaccount = discordaccount.id;
                    }


                    query = "SELECT matchs.matchup, count(*) AS count1, (cast(" + 
                                "count(*) FILTER ("+
                                    "WHERE result = 'Win'" +
                                ")*100 as float)/count(*)) AS winrate, (cast(" + 
                                "count(*) FILTER ("+
                                    "WHERE (first_tanked OR first_gold OR first_damages)" +
                                ")*100 as float)/count(*)) AS carry " +
                            "FROM matchs, summoners " + 
                            "WHERE summoners.discordid='" + discordaccount + "' AND matchs.player = summoners.puuid";
                    query += querychamp;
                    query += queryrole;
                    query += querygamemode;
                    query += queryaccount;
                    query += " GROUP BY matchs.matchup ORDER BY count1 DESC;"
                    response = await client.pg.query(query);
                    if(response.rows.length == 0) {
                        return await interaction.editReply("You don't have any matchs in the database or the filters are too restrictings.");
                    }

                    url = "https://chart.googleapis.com/chart?cht=bvg&chs=1000x300&chxt=x,y&chd=t:"

                    values1 = ""
                    values2 = ""
                    champ = ""

                    data = []
                    for(i=0; i<response.rows.length; i++) {
                        if(response.rows[i].count1 > 4 && response.rows[i].matchup != "" && response.rows[i].matchup != "Invalid") {
                            data.push("- " + response.rows[i].matchup + " : " + response.rows[i].count1 + " matchs (" + response.rows[i].winrate.toFixed(1) + "% winrate, " + response.rows[i].carry.toFixed(1) + "% carry)\n");
                            if(i < 17) {
                                values1 += response.rows[i].winrate + ",";
                                values2 += response.rows[i].carry + ",";
                                champ += response.rows[i].matchup + "|";
                            }
                        }
                    }
                    values1 = values1.substring(0, values1.length - 1);
                    values2 = values2.substring(0, values2.length - 1);
                    champ = champ.substring(0, champ.length - 1);

                    if(data.length == 0) {
                        return await interaction.editReply("You don't have any matchs in the database or the filters are too restrictings.");
                    }

                    url2 = (url + values1 + "|" + values2 + "&chl=" + champ + "&chco=FF0000,00FF00");

                    // send embed
                    embed = new MessageEmbed()
                    .setTitle("" + discordusername + "'s matchups")
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

                    for(i=0; i<5; i++) {
                        text = ""
                        if(data[i*5] != undefined) {
                            text += data[i*5];
                        }
                        if(data[i*5+1] != undefined) {
                            text += data[i*5+1];
                        }
                        if(data[i*5+2] != undefined) {
                            text += data[i*5+2];
                        }
                        if(data[i*5+3] != undefined) {
                            text += data[i*5+3];
                        }
                        if(data[i*5+4] != undefined) {
                            text += data[i*5+4];
                        }
                        if(text != "") {
                            embed.addFields(
                                {
                                    name: "Matchup " + (i+1) + " :",
                                    value: text
                                }
                            );
                        }
                    }

                    return await interaction.editReply({embeds: [embed]});
                }else if(interaction.options.getSubcommand() == "champions") {
                    role = interaction.options.getString("lane");
                    gamemode = interaction.options.getString("gamemode");
                    account = interaction.options.getString("account");
                    queryrole = ""
                    queryrole2 = ""
                    if(role != undefined) {
                        queryrole = " AND matchs.lane='" + role + "'";
                        queryrole2 = " AND m2.lane='" + role + "'";
                    }
                    querygamemode = ""
                    querygamemode2 = ""
                    if(gamemode != undefined) {
                        querygamemode = " AND matchs.gamemode='" + gamemode + "'";
                        querygamemode2 = " AND m2.gamemode='" + gamemode + "'";
                    }
                    queryaccount = ""
                    queryaccount2 = ""
                    if(account != undefined) {
                        queryaccount = " AND summoners.username='" + account + "'";
                        queryaccount2 = " AND s2.username='" + account + "'";
                    }

                    discordaccount = interaction.options.getUser("discordaccount");
                    discordusername = ""
                    if(discordaccount == undefined) {
                        discordaccount = interaction.user.id;
                        discordusername = interaction.user.username;
                    }else {
                        discordusername = discordaccount.username;
                        discordaccount = discordaccount.id;
                    }

                    query = "SELECT champion, "+
                                "count(*) AS count, ("+
                                "cast((SELECT count(*) " +
                                    "FROM matchs m2, summoners s2 " +
                                    "WHERE m2.player = s2.puuid " +
                                        "AND s2.discordid ='" + discordaccount + "' " +
                                        "AND m2.result = 'Win' " +
                                        "AND m2.champion = matchs.champion" +
                                        queryrole2 +
                                        querygamemode2 + 
                                        queryaccount2 +
                                ") as float)*100/("+
                                    "SELECT count(*) " +
                                    "FROM matchs m2, summoners s2 " +
                                    "WHERE m2.player = s2.puuid " +
                                        "AND s2.discordid ='" + discordaccount + "' " +
                                        "AND m2.champion = matchs.champion" +
                                        queryrole2 +
                                        querygamemode2 +
                                        queryaccount2 +
                                    ")"+
                                ") AS winrate, (" +
                                "cast((SELECT count(*) " +
                                    "FROM matchs m2, summoners s2 " +
                                    "WHERE m2.player = s2.puuid " +
                                        "AND s2.discordid ='" + discordaccount + "' " +
                                        "AND ("+
                                            "m2.first_gold " +
                                            "OR m2.first_damages " +
                                            "OR m2.first_tanked" +
                                        ") " +
                                        "AND m2.champion = matchs.champion" +
                                        queryrole2 +
                                        querygamemode2 +
                                        queryaccount2 +
                                ") as float)*100/("+
                                    "SELECT count(*) " +
                                    "FROM matchs m2, summoners s2 " +
                                    "WHERE m2.player = s2.puuid " +
                                        "AND s2.discordid ='" + discordaccount + "' " +
                                        "AND m2.champion = matchs.champion" +
                                        queryrole2 +
                                        querygamemode2 +
                                        queryaccount2 +
                                    ")"+
                                ") AS carry " +
                            "FROM matchs, summoners "+
                            "WHERE summoners.discordid='" + discordaccount + "' "+
                                "AND matchs.player = summoners.puuid"+
                                queryrole +
                                querygamemode +
                                queryaccount +
                            " GROUP BY champion "+
                            "ORDER BY count(*) DESC;";
                    response = await client.pg.query(query);
                    if(response.rows.length == 0) {
                        return await interaction.editReply("You don't have any matchs in the database.");
                    }

                    url = "https://chart.googleapis.com/chart?cht=bvg&chs=1000x300&chxt=x,y&chd=t:"

                    values1 = ""
                    values2 = ""
                    champ = ""

                    for(i=0; i<response.rows.length; i++) {
                        if(response.rows[i].count > 4 && response.rows[i].champion != "" && response.rows[i].champion != "Invalid") {
                            if(i < 17) {
                                values1 += response.rows[i].winrate + ",";
                                values2 += response.rows[i].carry + ",";
                                champ += response.rows[i].champion + "|";
                            }
                        }
                    }
                    values1 = values1.substring(0, values1.length - 1);
                    values2 = values2.substring(0, values2.length - 1);
                    champ = champ.substring(0, champ.length - 1);
                    url2 = (url + values1 + "|" + values2 + "&chl=" + champ + "&chco=FF0000,00FF00");

                    // send embed
                    embed = new MessageEmbed()
                    .setTitle("" + discordusername + "'s champions")
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

                    for(i=0; i<5; i++) {
                        text = ""
                        if(response.rows[i*5] != undefined && response.rows[i*5].champion != "" && response.rows[i*5].count > 4) {
                            text += "- " + response.rows[i*5].champion + " : " + response.rows[i*5].count + " matchs (" + response.rows[i*5].winrate.toFixed(1) + "% winrate, " + response.rows[i*5].carry.toFixed(1) + "% carry)\n";
                        }
                        if(response.rows[i*5+1] != undefined && response.rows[i*5+1].champion != "" && response.rows[i*5+1].count > 4) {
                            text += "- " + response.rows[i*5+1].champion + " : " + response.rows[i*5+1].count + " matchs (" + response.rows[i*5+1].winrate.toFixed(1) + "% winrate, " + response.rows[i*5+1].carry.toFixed(1) + "% carry)\n";
                        }
                        if(response.rows[i*5+2] != undefined && response.rows[i*5+2].champion != "" && response.rows[i*5+2].count > 4) {
                            text += "- " + response.rows[i*5+2].champion + " : " + response.rows[i*5+2].count + " matchs (" + response.rows[i*5+2].winrate.toFixed(1) + "% winrate, " + response.rows[i*5+2].carry.toFixed(1) + "% carry)\n";
                        }
                        if(response.rows[i*5+3] != undefined && response.rows[i*5+3].champion != "" && response.rows[i*5+3].count > 4) {
                            text += "- " + response.rows[i*5+3].champion + " : " + response.rows[i*5+3].count + " matchs (" + response.rows[i*5+3].winrate.toFixed(1) + "% winrate, " + response.rows[i*5+3].carry.toFixed(1) + "% carry)\n";
                        }
                        if(response.rows[i*5+4] != undefined && response.rows[i*5+4].champion != "" && response.rows[i*5+4].count > 4) {
                            text += "- " + response.rows[i*5+4].champion + " : " + response.rows[i*5+4].count + " matchs (" + response.rows[i*5+4].winrate.toFixed(1) + "% winrate, " + response.rows[i*5+4].carry.toFixed(1) + "% carry)\n";
                        }
                        if(text != "") {
                            embed.addFields(
                                {
                                    name: "Champion " + (i+1) + " :",
                                    value: text
                                }
                            );
                        }
                    }

                    return await interaction.editReply({embeds: [embed]});
                }else if(interaction.options.getSubcommand() == "match") {
                    puuid = interaction.options.getString("id");
                    if(puuid != undefined) {
                        query = "SELECT * FROM matchs WHERE puuid='" + puuid + "';";
                        response = await client.pg.query(query);
                        if(response.rows.length == 0) {
                            return await interaction.editReply("This match doesn't exist.");
                        }
                        match = response.rows[0];
                        console.log(match)
                    }else {
                        account = interaction.options.getString("account");
                        queryaccount = ""
                        if(account != undefined) {
                            queryaccount = " AND summoners.account = '" + account + "' ";
                        }

                    }
                }else if(interaction.options.getSubcommand() == "ks") {
                    discordaccount = interaction.options.getUser("discordaccount");
                    discordusername = ""
                    if(discordaccount == undefined) {
                        discordaccount = interaction.user.id;
                        discordusername = interaction.user.username;
                    }else {
                        discordusername = discordaccount.username;
                        discordaccount = discordaccount.id;
                    }

                    account = interaction.options.getString("account");
                    queryaccount = ""
                    queryaccount2 = ""
                    if(account != undefined) {
                        queryaccount = " AND summoners.account = '" + account + "'";
                        queryaccount2 = " AND s2.account = '" + account + "'";
                    }

                    gamemode = interaction.options.getString("gamemode");
                    querygamemode = ""
                    querygamemode2 = ""
                    if(gamemode != undefined) {
                        querygamemode = " AND matchs.gamemode = '" + gamemode + "'";
                        querygamemode2 = " AND m2.gamemode = '" + gamemode + "'";
                    }

                    role = interaction.options.getString("role");
                    queryrole = ""
                    queryrole2 = ""
                    if(role != undefined) {
                        queryrole = " AND matchs.lane = '" + role + "'";
                        queryrole2 = " AND m2.lane = '" + role + "'";
                    }

                    champion = interaction.options.getString("champion");
                    querychamp = ""
                    querychamp2 = ""
                    if(champion != undefined) {
                        querychamp = " AND matchs.champion='" + champion + "'";
                        querychamp2 = " AND m2.champion='" + champion + "'";
                    }

                    query = "SELECT timestamp*86400000 as time, " +
                                "count(*) as daily, (" +
                                    "SELECT count(*) " +
                                    "FROM matchs m2, summoners s2 " +
                                    "WHERE m2.player = s2.puuid " +
                                        "AND s2.discordid = '" + discordaccount + "' " +
                                        "AND m2.timestamp <= (matchs.timestamp+1)*86400000" +
                                        querychamp2 +
                                        queryrole2 +
                                        querygamemode2 +
                                        queryaccount2 + 
                                ") as total, cast((" +
                                    "SELECT count(*) " +
                                    "FROM matchs m2, summoners s2 " +
                                    "WHERE m2.player = s2.puuid " +
                                        "AND s2.discordid = '" + discordaccount + "' " +
                                        "AND m2.timestamp <= (matchs.timestamp+1)*86400000" +
                                        " AND (m2.first_tanked OR first_gold OR first_damages)" + 
                                        querychamp2 +
                                        queryrole2 +
                                        querygamemode2 +
                                        queryaccount2 + 
                                ")*100 as float)/(" + 
                                    "SELECT count(*) " +
                                    "FROM matchs m2, summoners s2 " +
                                    "WHERE m2.player = s2.puuid " +
                                        "AND s2.discordid = '" + discordaccount + "' " +
                                        "AND m2.timestamp <= (matchs.timestamp+1)*86400000" +
                                        querychamp2 +
                                        queryrole2 +
                                        querygamemode2 +
                                        queryaccount2 + 
                                ") as carry, cast((" +
                                    "SELECT count(*) " +
                                    "FROM matchs m2, summoners s2 " +
                                    "WHERE m2.player = s2.puuid " +
                                        "AND s2.discordid = '" + discordaccount + "' " +
                                        "AND m2.timestamp <= (matchs.timestamp+1)*86400000" +
                                        " AND m2.result = 'Win'" + 
                                        querychamp2 +
                                        queryrole2 +
                                        querygamemode2 +
                                        queryaccount2 + 
                                ")*100 as float)/(" + 
                                    "SELECT count(*) " +
                                    "FROM matchs m2, summoners s2 " +
                                    "WHERE m2.player = s2.puuid " +
                                        "AND s2.discordid = '" + discordaccount + "' " +
                                        "AND m2.timestamp <= (matchs.timestamp+1)*86400000" +
                                        querychamp2 +
                                        queryrole2 +
                                        querygamemode2 +
                                        queryaccount2 + 
                                ") as wr, (" +
                                    "SELECT cast((avg(m2.kill)+avg(m2.assists))*100 as float)/avg(m2.total_kills) " +
                                    "FROM matchs m2, summoners s2 " +
                                    "WHERE m2.player = s2.puuid " +
                                        "AND s2.discordid = '" + discordaccount + "' " +
                                        "AND m2.timestamp <= (matchs.timestamp+1)*86400000" + 
                                        querychamp2 +
                                        queryrole2 +
                                        querygamemode2 +
                                        queryaccount2 + 
                                ") as kp, (" +
                                    "SELECT (avg(m2.vision_score))/(avg(m2.length)/60) " +
                                    "FROM matchs m2, summoners s2 " +
                                    "WHERE m2.player = s2.puuid " +
                                        "AND s2.discordid = '" + discordaccount + "' " +
                                        "AND m2.timestamp <= (matchs.timestamp+1)*86400000" + 
                                        querychamp2 +
                                        queryrole2 +
                                        querygamemode2 +
                                        queryaccount2 + 
                                ") as vs, (" +
                                    "SELECT (avg(m2.cs))/(avg(m2.length)/60) " +
                                    "FROM matchs m2, summoners s2 " +
                                    "WHERE m2.player = s2.puuid " +
                                        "AND s2.discordid = '" + discordaccount + "' " +
                                        "AND m2.timestamp <= (matchs.timestamp+1)*86400000" + 
                                        querychamp2 +
                                        queryrole2 +
                                        querygamemode2 +
                                        queryaccount2 + 
                                ") as cs, cast((" +
                                    "SELECT count(*) " +
                                    "FROM matchs m2, summoners s2 " +
                                    "WHERE m2.player = s2.puuid " +
                                        "AND s2.discordid = '" + discordaccount + "' " +
                                        "AND m2.timestamp <= (matchs.timestamp+1)*86400000" +
                                        " AND m2.first_tanked AND first_gold AND first_damages" + 
                                        querychamp2 +
                                        queryrole2 +
                                        querygamemode2 +
                                        queryaccount2 + 
                                ")*100 as float)/(" + 
                                    "SELECT count(*) " +
                                    "FROM matchs m2, summoners s2 " +
                                    "WHERE m2.player = s2.puuid " +
                                        "AND s2.discordid = '" + discordaccount + "' " +
                                        "AND m2.timestamp <= (matchs.timestamp+1)*86400000" +
                                        querychamp2 +
                                        queryrole2 +
                                        querygamemode2 +
                                        queryaccount2 + 
                                ") as hardcarry " + 
                            "FROM (" +
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
                            "GROUP BY timestamp;"
                    response = await client.pg.query(query);
                    //console.log(response.rows)

                    if(response.rows.length == 0){
                        interaction.editReply("No data found for this account");
                        return;
                    }

                    ks = []
                    for(i=0; i<response.rows.length; i++){
                        score = 0;
                        score += response.rows[i].carry
                        score += response.rows[i].wr
                        score += response.rows[i].kp
                        score += 5*response.rows[i].vs
                        score += 10*response.rows[i].cs
                        if(100 - response.rows[i].total > 0) {
                            score = score * 0.99**(100 - response.rows[i].total);
                        }
                        ks.push({x: response.rows[i].time, y: score})
                    }
                    //console.log(ks)

                    url = "https://chart.googleapis.com/chart?cht=lc&chs=600x300&chco=FFC6A5&chxt=y&chxr=0,0,500&chdl=ks&chd=t:"
                    values = ""
                    for(i=0; i<ks.length; i++){
                        values += (ks[i].y/5).toFixed(0) + ","
                    }
                    values = values.slice(0, -1)
                    url += values
                    //console.log(url)


                    // create embed
                    embed = new MessageEmbed()
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
                    
                    interaction.editReply({embeds: [embed]});

                }
            }else if(interaction.options.getSubcommandGroup() == "top") {
                if(interaction.options.getSubcommand() == "carry") {
                    champion = interaction.options.getString("champion");
                    query2 = ""
                    query3 = ""
                    if(champion != undefined) {
                        query2 += " AND matchs.champion='" + champion + "'";
                        query3 = " AND m2.champion='" + champion + "'";
                    }

                    role = interaction.options.getString("lane");
                    queryrole = ""
                    queryrole2 = ""
                    if(role != undefined) {
                        queryrole = " AND matchs.lane='" + role + "'";
                        queryrole2 = " AND m2.lane='" + role + "'";
                    }

                    all = interaction.options.getBoolean("all") == true
                    queryall = ""
                    queryall2 = ""
                    if(!all) {
                        members = await interaction.guild.members.fetch();
                        members = members.filter(member => !member.user.bot);
                        list = "("
                        members.forEach(member => {
                            list += "'" + member.user.id + "',"
                        })
                        list = list.slice(0, -1);
                        list += ")"
                        queryall = " AND summoners.discordid IN " + list
                        queryall2 = " AND s2.discordid IN " + list
                    }

                    // general Carry
                    query = "SELECT summoners.discordid, "+
                                "("+
                                    "SELECT count(*) "+
                                    "FROM summoners s2, matchs m2 "+
                                    "WHERE s2.puuid = m2.player AND s2.discordid = summoners.discordid" + 
                                        query3 +
                                        queryrole2 +
                                        queryall2 +
                                "),"+
                                " count(*)/(cast(("+
                                    "SELECT count(*) "+
                                    "FROM summoners s2, matchs m2 "+
                                    "WHERE s2.puuid = m2.player AND s2.discordid = summoners.discordid" + 
                                    query3 + 
                                    queryrole2 +
                                    queryall2 +
                                ") as float)/100) AS carry "+
                            "FROM matchs, summoners "+
                            "WHERE matchs.player = summoners.puuid AND (matchs.first_damages=true OR matchs.first_tanked=true OR matchs.first_gold=true)";
                    query += query2
                    query += queryrole
                    query += queryall
                    query += " GROUP BY summoners.discordid ORDER BY carry DESC LIMIT 10;"
                    response = await client.pg.query(query);
                    general = "";
                    if(response.rows.length == 0) {
                        general = "There are not enought summoners in the database or the filters are too restrictings.";
                    }else {
                        for(var x of response.rows) {
                            general += "- <@" + x.discordid + "> : " + x.carry.toFixed(2) + " % (" + x.count + " matchs)\n";
                        }
                    }

                    // damage Carry
                    query = "SELECT summoners.discordid, (SELECT count(*) FROM summoners s2, matchs m2 WHERE s2.puuid = m2.player AND s2.discordid = summoners.discordid" + query3 + queryrole2 + queryall2 + "), count(*)/(cast((SELECT count(*) FROM summoners s2, matchs m2 WHERE s2.puuid = m2.player AND s2.discordid = summoners.discordid" + query3 + queryrole2 + queryall2 + ") as float)/100) AS carry FROM matchs, summoners WHERE matchs.player = summoners.puuid AND (matchs.first_damages=true)";
                    query += query2
                    query += queryrole
                    query += queryall
                    query += " GROUP BY summoners.discordid ORDER BY carry DESC LIMIT 10;"
                    response = await client.pg.query(query);
                    damages = "";
                    if(response.rows.length == 0) {
                        damages = "There are not enought summoners in the database or the filters are too restrictings.";
                    }else {
                        for(var x of response.rows) {
                            damages += "- <@" + x.discordid + "> : " + x.carry.toFixed(2) + " % (" + x.count + " matchs)\n";
                        }
                    }

                    // tanked Carry
                    query = "SELECT summoners.discordid, (SELECT count(*) FROM summoners s2, matchs m2 WHERE s2.puuid = m2.player AND s2.discordid = summoners.discordid" + query3 + queryrole2 + queryall2 + "), count(*)/(cast((SELECT count(*) FROM summoners s2, matchs m2 WHERE s2.puuid = m2.player AND s2.discordid = summoners.discordid" + query3 + queryrole2 + queryall2 + ") as float)/100) AS carry FROM matchs, summoners WHERE matchs.player = summoners.puuid AND (matchs.first_tanked=true)";
                    query += query2
                    query += queryrole
                    query += queryall
                    query += " GROUP BY summoners.discordid ORDER BY carry DESC LIMIT 10;"
                    response = await client.pg.query(query);
                    tanked = "";
                    if(response.rows.length == 0) {
                        tanked = "There are not enought summoners in the database or the filters are too restrictings.";
                    }else {
                        for(var x of response.rows) {
                            tanked += "- <@" + x.discordid + "> : " + x.carry.toFixed(2) + " % (" + x.count + " matchs)\n";
                        }
                    }

                    // Gold carry
                    query = "SELECT summoners.discordid, (SELECT count(*) FROM summoners s2, matchs m2 WHERE s2.puuid = m2.player AND s2.discordid = summoners.discordid" + query3 + queryrole2 + queryall2 + "), count(*)/(cast((SELECT count(*) FROM summoners s2, matchs m2 WHERE s2.puuid = m2.player AND s2.discordid = summoners.discordid" + query3 + queryrole2 + queryall2 + ") as float)/100) AS carry FROM matchs, summoners WHERE matchs.player = summoners.puuid AND (matchs.first_gold=true)";
                    query += query2
                    query += queryrole
                    query += queryall
                    query += " GROUP BY summoners.discordid ORDER BY carry DESC LIMIT 10;"
                    response = await client.pg.query(query);
                    gold = "";
                    if(response.rows.length == 0) {
                        gold = "There are not enought summoners in the database or the filters are too restrictings.";
                    }else {
                        for(var x of response.rows) {
                            gold += "- <@" + x.discordid + "> : " + x.carry.toFixed(2) + " % (" + x.count + " matchs)\n";
                        }
                    }

                    // Hard carry
                    query = "SELECT summoners.discordid, (SELECT count(*) FROM summoners s2, matchs m2 WHERE s2.puuid = m2.player AND s2.discordid = summoners.discordid" + query3 + queryrole2 + queryall2 + "), count(*)/(cast((SELECT count(*) FROM summoners s2, matchs m2 WHERE s2.puuid = m2.player AND s2.discordid = summoners.discordid" + query3 + queryrole2 + queryall2 + ") as float)/100) AS carry FROM matchs, summoners WHERE matchs.player = summoners.puuid AND (matchs.first_damages=true AND matchs.first_tanked=true AND matchs.first_gold=true)";
                    query += query2
                    query += queryrole
                    query += queryall
                    query += " GROUP BY summoners.discordid ORDER BY carry DESC LIMIT 10;"
                    response = await client.pg.query(query);
                    hard = "";
                    if(response.rows.length == 0) {
                        hard = "There are not enought summoners in the database or the filters are too restrictings.";
                    }else {
                        for(var x of response.rows) {
                            hard += "- <@" + x.discordid + "> : " + x.carry.toFixed(2) + " % (" + x.count + " matchs)\n";
                        }
                    }

                    // send embed
                    embed = new MessageEmbed()
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
                    return await interaction.editReply({embeds: [embed]});
                }else if(interaction.options.getSubcommand() == "kwikscore") {
                    all = interaction.options.getBoolean("all") == true
                    queryall = ""
                    queryall2 = ""
                    if(!all) {
                        members = await interaction.guild.members.fetch();
                        members = members.filter(member => !member.user.bot);
                        list = "("
                        members.forEach(member => {
                            list += "'" + member.user.id + "',"
                        })
                        list = list.slice(0, -1);
                        list += ")"
                        queryall = " AND summoners.discordid IN " + list
                        queryall2 = " AND s2.discordid IN " + list
                    }
                    champion = interaction.options.getString("champion");
                    query2 = ""
                    query3 = ""
                    if(champion != undefined) {
                        query2 += " AND matchs.champion='" + champion + "'";
                        query3 = " AND m2.champion='" + champion + "'";
                    }

                    role = interaction.options.getString("lane");
                    queryrole = ""
                    queryrole2 = ""
                    if(role != undefined) {
                        queryrole = " AND matchs.lane='" + role + "'";
                        queryrole2 = " AND m2.lane='" + role + "'";
                    }

                    query = "SELECT summoners.discordid, "+
                                "count(*), ("+
                                    "cast(("+
                                        "SELECT count(*) " +
                                        "FROM matchs m2, summoners s2 " +
                                        "WHERE m2.player = s2.puuid " +
                                            "AND s2.discordid = summoners.discordid " +
                                            "AND (m2.first_gold OR m2.first_damages OR m2.first_tanked)" +
                                            query3 +
                                            queryrole2 +
                                            queryall2 +
                                    ") * 100 AS FLOAT) / "+
                                    "("+
                                        "SELECT count(*) " +
                                        "FROM matchs m2, summoners s2 " +
                                        "WHERE m2.player = s2.puuid " +
                                            "AND s2.discordid = summoners.discordid " +
                                            query3 +
                                            queryrole2 +
                                            queryall2 +
                                    ")"+
                                ") AS CARRY, (" +
                                    "cast(("+
                                        "SELECT count(*) " +
                                        "FROM matchs m2, summoners s2 " +
                                        "WHERE m2.player = s2.puuid " +
                                            "AND s2.discordid = summoners.discordid " +
                                            "AND m2.result = 'Win'" +
                                            query3 +
                                            queryrole2 +
                                            queryall2 +
                                    ") * 100 AS FLOAT) / "+
                                    "("+
                                        "SELECT count(*) " +
                                        "FROM matchs m2, summoners s2 " +
                                        "WHERE m2.player = s2.puuid " +
                                            "AND s2.discordid = summoners.discordid " +
                                            query3 +
                                            queryrole2 +
                                            queryall2 +
                                    ")"+
                                ") AS WR, (" +
                                    "cast(("+
                                        "SELECT (avg(m2.kill)+avg(m2.assists)) " +
                                        "FROM matchs m2, summoners s2 " +
                                        "WHERE m2.player = s2.puuid " +
                                            "AND s2.discordid = summoners.discordid " +
                                            query3 +
                                            queryrole2 +
                                            queryall2 +
                                    ") * 100 AS FLOAT) / "+
                                    "("+
                                        "SELECT avg(m2.total_kills) " +
                                        "FROM matchs m2, summoners s2 " +
                                        "WHERE m2.player = s2.puuid " +
                                            "AND s2.discordid = summoners.discordid " +
                                            query3 +
                                            queryrole2 +
                                            queryall2 +
                                    ")"+
                                ") AS KP, (" +
                                    "cast(("+
                                        "SELECT avg(m2.vision_score) " +
                                        "FROM matchs m2, summoners s2 " +
                                        "WHERE m2.player = s2.puuid " +
                                            "AND s2.discordid = summoners.discordid " +
                                            query3 +
                                            queryrole2 +
                                            queryall2 +
                                    ") AS FLOAT) / "+
                                    "("+
                                        "SELECT avg(m2.length)/60 " +
                                        "FROM matchs m2, summoners s2 " +
                                        "WHERE m2.player = s2.puuid " +
                                            "AND s2.discordid = summoners.discordid " +
                                            query3 +
                                            queryrole2 +
                                            queryall2 +
                                    ")"+
                                ") AS VS, (" +
                                    "cast(("+
                                        "SELECT avg(m2.cs) " +
                                        "FROM matchs m2, summoners s2 " +
                                        "WHERE m2.player = s2.puuid " +
                                            "AND s2.discordid = summoners.discordid " +
                                            query3 +
                                            queryrole2 +
                                            queryall2 +
                                    ") AS FLOAT) / "+
                                    "("+
                                        "SELECT avg(m2.length)/60 " +
                                        "FROM matchs m2, summoners s2 " +
                                        "WHERE m2.player = s2.puuid " +
                                            "AND s2.discordid = summoners.discordid " +
                                            query3 +
                                            queryrole2 +
                                            queryall2 +
                                    ")"+
                                ") AS CS, ("+
                                    "cast(("+
                                        "SELECT count(*) " +
                                        "FROM matchs m2, summoners s2 " +
                                        "WHERE m2.player = s2.puuid " +
                                            "AND s2.discordid = summoners.discordid " +
                                            "AND (m2.first_gold AND m2.first_damages AND m2.first_tanked)" +
                                            query3 +
                                            queryrole2 +
                                            queryall2 +
                                    ") * 100 AS FLOAT) / "+
                                    "("+
                                        "SELECT count(*) " +
                                        "FROM matchs m2, summoners s2 " +
                                        "WHERE m2.player = s2.puuid " +
                                            "AND s2.discordid = summoners.discordid " +
                                            query3 +
                                            queryrole2 +
                                            queryall2 +
                                    ")"+
                                ") AS hardcarry " +
                            "FROM matchs, summoners " +
                            "WHERE matchs.player = summoners.puuid "
                    query += query2
                    query += queryrole
                    query += queryall
                    query += " GROUP BY summoners.discordid"
                    query4 = "SELECT discordid, " +
                                "count, " +
                                "CASE WHEN count<100 THEN (carry+wr+kp+vs*25+10*cs)*POWER(0.99, (100-count)) "+
                                    "ELSE (carry+wr+kp+vs*25+10*cs) "+
                                "END AS KS " +
                            "FROM (" + query + ") AS t1 "+
                            "ORDER BY KS DESC "+
                            "LIMIT 10;"
                    response = await client.pg.query(query4);
                    
                    if(response.rowCount == 0) {
                        return message.channel.send("No data found");
                    }

                    embed = new MessageEmbed()
                    .setTitle("Top KS :")
                    .setColor("#00FF00")
                    .setFooter({
                        text: "Requested by " + interaction.user.username,
                        //iconURL: interaction.user.displayAvatarURL()
                    })
                    .setTimestamp();

                    text = ""
                    for(i=0; i<response.rowCount; i++) {
                        text += "- <@" + response.rows[i].discordid + "> : " + response.rows[i].ks.toFixed(0) + " (" + response.rows[i].count + " Games)\n"
                    }

                    embed.addFields({
                        name: "Top 10 KwikScore : ",
                        value: "" + text,
                    })
                    
                    return await interaction.editReply({embeds: [embed]});
                }
            }
        }
    },
    async autocomplete(client, interaction) {
        const focusedValue = interaction.options.getFocused();
        query = "SELECT DISTINCT champion " +
                "FROM matchs " +
                "WHERE champion LIKE '" + focusedValue + "%'" +
                    "AND champion <> 'Invalid' " +
                "ORDER BY champion " +
                "LIMIT 15;"
        response = await client.pg.query(query);
        var champs = [];
        for(var x of response.rows) {
            champs.push({
                name: x.champion,
                value: x.champion
            });
        }
        return await interaction.respond(champs);
    },
    addSumoner,
    update

}

async function addSumoner(client, id, name) {
    client.requests["summoners"].push({"username":name, "discordid":id});
    await client.lol();
}

async function update(client, interaction, discordid) {
    client.requests["update"].push(discordid);
    await client.lol();
}