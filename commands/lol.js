const { MessageEmbed, MessageAttachment } = require('discord.js');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

const decimal = 2;
const tiers = ["unranked", "IRON", "BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND", "MASTER", "GRANDMASTER", "CHALLENGER"];
const rank = ["IV", "III", "II", "I"];
const emojis = {
    "unranked": "",
    "IRON": "<:Iron:519953534356160532>",
    "BRONZE": "<:Bronze:519953533517299722>",
    "SILVER": "<:Silver:519953533315973123>",
    "GOLD": "<:Gold:519953533152526337>",
    "PLATINUM": "<:Platinum:519953533500391445>",
    "DIAMOND": "<:Diamond:519953533769089044>",
    "MASTER": "<:Master:519953533588471828>",
    "GRANDMASTER": "<:Grandmaster:519953533798187028>",
    "CHALLENGER": "<:Challenger:518405038671134720>"
};

module.exports = {
    name: 'lol',
    group: 'lol',
    description: "league of legends related commands",
    permission: "none",
    hidden: false,
    place: "guild",
    options: [
        {
            name: 'account',
            description: 'Manage your lol accounts',
            type: 'SUB_COMMAND_GROUP',
            options: [
                {
                    name: 'add',
                    description: 'link a lol pseudo to your discord account',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'name',
                            description: 'Name of the account',
                            type: 'STRING',
                            required: true,
                        },
                        {
                            name: 'region',
                            description: 'Region of the account',
                            type: 'STRING',
                            required: true,
                            choices: [
                                {
                                    name: 'EUW',
                                    value: 'EUW1',
                                },
                                {
                                    name: 'EUNE',
                                    value: 'EUN1',
                                },
                                {
                                    name: 'NA',
                                    value: 'NA1',
                                },
                                {
                                    name: 'OCE',
                                    value: 'OC1',
                                },
                                {
                                    name: 'LAN',
                                    value: 'LA1',
                                },
                                {
                                    name: 'LAS',
                                    value: 'LA2',
                                },
                                {
                                    name: 'RU',
                                    value: 'RU',
                                },
                                {
                                    name: 'TR',
                                    value: 'TR1',
                                },
                                {
                                    name: 'JP',
                                    value: 'JP1',
                                },
                                {
                                    name: 'KR',
                                    value: 'KR',
                                },
                                {
                                    name: 'BR',
                                    value: 'BR1',
                                }
                            ]
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
            name: 'queue',
            description: 'Get information about summoner\'s queue',
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
            description: 'lol stat commands',
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
                    name: 'profile',
                    description: 'See profile stats',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'discordaccount',
                            description: 'Discord account',
                            type: 'USER',
                        },
                    ]
                },
                /*{
                    name: 'friends',
                    description: 'See friends stats',
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
                },*/
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
                },
                {
                    name: 'compare',
                    description: 'compare your stats to another player',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'discordaccount',
                            description: 'Discord account',
                            type: 'USER',
                            required: true
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
                },
                {
                    name: 'evolution',
                    description: 'See evolution graphs',
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
                },
                /*{
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
            description: 'ranking commands',
            type: 'SUB_COMMAND_GROUP',
            options: [
                {
                    name: 'carry',
                    description: 'ranking carry commands',
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
                    description: 'ranking kwikscore commands',
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
        },
        {
            name: 'tracker',
            description: 'tracker command',
            type: 'SUB_COMMAND_GROUP',
            options: [
                {
                    name: 'add',
                    description: 'add a tracker channel',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'channel',
                            description: 'Channel',
                            type: 'CHANNEL'
                        }
                    ]
                },
                {
                    name: 'remove',
                    description: 'add a tracker channel',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'channel',
                            description: 'Channel',
                            type: 'CHANNEL'
                        }
                    ]
                }
            ]
        }
    ],
    commande_channel: true,
    async run(message, client, interaction = undefined) {
        if (interaction === undefined) {
            return;
        }
        const summoner_name = interaction.options.getString("name");
        const region = interaction.options.getString("region");
        const champion = interaction.options.getString("champion");
        const role = interaction.options.getString("lane");
        const gamemode = interaction.options.getString("gamemode");
        const account = interaction.options.getString("account");
        //const puuid = interaction.options.getString("id");
        let discordaccount = interaction.options.getUser("discordaccount");

        await interaction.deferReply();
        if (interaction.options.getSubcommandGroup() === "account") {
            if (interaction.options.getSubcommand() === "add") {
                const response = await client.pg.query("SELECT * FROM summoners where discordid=$1 AND LOWER(username)=LOWER($2) AND region=$3;", [interaction.user.id, summoner_name, region]);
                if (!client.requests["summoners"].includes({ "username": summoner_name, "discordid": interaction.user.id, "region": region }) && response.rows.length === 0) {
                    const response2 = await client.pg.query("SELECT * FROM summoners where discordid=$1;", [interaction.user.id]);
                    let number = response2.rows.length;
                    for (let i = 0; i < client.requests["summoners"].length; i++) {
                        if (client.requests["summoners"][i].discordid === interaction.user.id) {
                            number++;
                        }
                    }
                    const priority = await client.pg.query("SELECT priority FROM summoners WHERE discordid = $1;", [interaction.user.id]);
                    if (priority.rows[0].priority === 0) {
                        if (number === 0) {
                            await interaction.editReply("The request was added to the queue, this can take several minutes. Once your account is in the database, please wait while the matchs are added. This can take several hours.");
                            return await addSumoner(client, summoner_name, interaction, region);
                        }
                        return await interaction.editReply("You have reached your maximum number of linked accounts. If you want to unlock more accounts slots by supporting me, you can contact me on discord : **KwikKill#6123**");
                    }
                    if (number < 3) {
                        await interaction.editReply("The request was added to the queue, this can take several minutes. Once your account is in the database, please wait while the matchs are added. This can take several hours.");
                        return await addSumoner(client, summoner_name, interaction, region);
                    }
                    return await interaction.editReply("You have reached your maximum number of linked accounts for a premium user. If you want to unlock even more accounts slots, you can contact me on discord : **KwikKill#6123**");


                }
                return await interaction.editReply("This account is already in the database or requested.");
            } else if (interaction.options.getSubcommand() === "remove") {
                const response = await client.pg.query("SELECT * FROM summoners where discordid=$1 AND username=$2;", [interaction.user.id, summoner_name]);
                if (response.rows.length > 0) {
                    await client.pg.query("DELETE FROM matchs " +
                        "WHERE player IN (" +
                        "SELECT puuid " +
                        "FROM summoners " +
                        "WHERE username=$1" +
                        ");",
                        [summoner_name]
                    );
                    await client.pg.query("DELETE FROM summoners " +
                        "WHERE discordid=$1 " +
                        "AND username=$2" +
                        ";",
                        [interaction.user.id, summoner_name]
                    );
                    return await interaction.editReply("The account has been removed.");
                }
                return await interaction.editReply("This account is not in the database.");
            } else if (interaction.options.getSubcommand() === "list") {
                const response = await client.pg.query("SELECT * FROM summoners where discordid=$1;", [interaction.user.id]);
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
                let step = "";
                if (client.requests["updates"].length > 0) {
                    if (client.requests["updates"][0]["count"] === 0) {
                        step = "- Step : 1/2 (Fetching game list)" +
                            "";
                    } else {
                        step = "- Step : 2/2 (Fetching matchs details)\n" +
                            "- Current : <@" + client.requests["updates"][0]["discordid"] + "> : " + client.requests["updates"][0]["count"] + "/" + client.requests["updates"][0]["total"] + " Games";
                    }
                    embed.addFields(
                        {
                            name: "Updates in queue :",
                            value: "- Length : " + client.requests["updates"].length + " Summoners | " + client.queue_length + " Matchs\n" +
                                step + "\n"
                        }
                    );
                } else {
                    embed.addFields(
                        {
                            name: "Updates in queue :",
                            value: "- 0 Matchs\n"
                        }
                    );
                }
                embed.addFields(
                    {
                        name: "Api limit reached :",
                        value: "" + client.api_limit
                    }
                );
                return await interaction.editReply({ embeds: [embed] });
            }
        } else if (interaction.options.getSubcommandGroup() === "stats") {
            if (interaction.options.getSubcommand() === "summarized") {
                let i = 1;

                let discordusername = "";
                if (discordaccount === null) {
                    discordaccount = interaction.user.id;
                    discordusername = interaction.user.username;
                } else {
                    discordusername = discordaccount.username;
                    discordaccount = discordaccount.id;
                }
                const query_values = [discordaccount];

                let query = "SELECT " +
                    "AVG(gold) as avg_gold, " +
                    "AVG(kill) as avg_kills, " +
                    "AVG(deaths) as avg_deaths, " +
                    "AVG(assists) as avg_assists, " +
                    "AVG(total_damage) as avg_damage, " +
                    "AVG(tanked_damage) as avg_tanked_damage, " +
                    "AVG(heal) as avg_heal, " +
                    "AVG(neutral_objectives) as avg_neutral_objectives, " +
                    "AVG(wards) as avg_wards, " +
                    "AVG(pinks) as avg_pinks, " +
                    "AVG(vision_score) as avg_vision_score, " +
                    "AVG(cs) as avg_cs, " +
                    "AVG(length) as avg_length, " +
                    "AVG(total_kills) as avg_total_kills, " +
                    "AVG(time_spent_dead) as avg_time_spent_dead, " +
                    "count(*) as games_played, " +
                    "CAST(SUM(CASE WHEN (first_gold OR first_damages OR first_tanked) THEN 1 ELSE 0 END) AS FLOAT)*100 / count(*) as carry, " +
                    "CAST(SUM(CASE WHEN first_gold THEN 1 ELSE 0 END) AS FLOAT)*100 / count(*) as carry_gold, " +
                    "CAST(SUM(CASE WHEN first_damages THEN 1 ELSE 0 END) AS FLOAT)*100 / count(*) as carry_damage, " +
                    "CAST(SUM(CASE WHEN first_tanked THEN 1 ELSE 0 END) AS FLOAT)*100 / count(*) as carry_tanked, " +
                    "CAST(SUM(CASE WHEN (first_gold AND first_damages AND first_tanked) THEN 1 ELSE 0 END)*100 AS FLOAT) / count(*) as hard_carry, " +
                    "CAST(SUM(CASE WHEN result = 'Win' THEN 1 ELSE 0 END) AS FLOAT)*100 / count(*) as win_rate " +
                    "FROM matchs, summoners " +
                    "WHERE summoners.discordid=$" + i + " " +
                    "AND matchs.player = summoners.puuid";

                let query3 = "SELECT " +
                    "gamemode, " +
                    "count(gamemode) " +
                    "FROM matchs, summoners " +
                    "WHERE summoners.discordid=$1 AND matchs.player = summoners.puuid";

                i++;
                if (champion !== null) {
                    query += " AND matchs.champion=$" + i;
                    query3 += " AND matchs.champion=$" + i;
                    query_values.push(champion);
                    i++;
                }
                if (role !== null) {
                    query += " AND matchs.lane=$" + i;
                    query3 += " AND matchs.lane=$" + i;
                    query_values.push(role);
                    i++;
                }
                if (gamemode !== null) {
                    query += " AND matchs.gamemode=$" + i;
                    query_values.push(gamemode);
                    i++;
                }
                if (account !== null) {
                    query += " AND summoners.username=$" + i;
                    query3 += " AND summoners.username=$" + (i - 1);
                    query_values.push(account);
                    i++;
                }
                query += ";";
                query3 += " GROUP BY gamemode;";

                const response = await client.pg.query(query, query_values);
                if (response.rows.length === 0) {
                    return await interaction.editReply("You don't have any matchs in the database or the filters are too restrictings.");
                }

                const response3 = await client.pg.query(query3, query_values);
                if (response3.rows.length === 0) {
                    return await interaction.editReply("You don't have any matchs in the database or the filters are too restrictings.");
                }

                // plot

                const url = "https://chart.googleapis.com/chart?cht=p&chs=500x300&chd=t:";

                let values = "";
                let labels = "";

                for (let i = 0; i < response3.rows.length; i++) {
                    values += response3.rows[i].count + ",";
                    labels += response3.rows[i].gamemode.replaceAll(" ", "").replaceAll("&", "") + "|";
                }
                values = values.substring(0, values.length - 1);
                labels = labels.substring(0, labels.length - 1);

                const url2 = url + values + "&chl=" + labels + "&chco=FFC6A5|FFFF42|DEF3BD|00A5C6|DEBDDE|FF0000|0000CC|660033|66FF66&chf=bg,s,00000a00";


                // 1) Carry stats

                const carry_damage = response.rows[0].carry_damage;
                const carry_tanked = response.rows[0].carry_tanked;
                const carry_gold = response.rows[0].carry_gold;
                const overall = response.rows[0].carry;
                const hard_carry = response.rows[0].hard_carry;
                const win = response.rows[0].win_rate;

                // 2) Average stats

                const length = response.rows[0].avg_length;

                const average_kills = Number.parseFloat(response.rows[0].avg_kills).toFixed(decimal);
                const average_deaths = Number.parseFloat(response.rows[0].avg_deaths).toFixed(decimal);
                const average_assists = Number.parseFloat(response.rows[0].avg_assists).toFixed(decimal);
                let average_cs = Number.parseFloat(response.rows[0].avg_cs).toFixed(decimal);
                let average_gold = response.rows[0].avg_gold;
                let average_damages = response.rows[0].avg_damage;
                let average_tanked = response.rows[0].avg_tanked_damage;
                const average_pinks = Number.parseFloat(response.rows[0].avg_pinks).toFixed(decimal);
                const average_vision_score = Number.parseFloat(response.rows[0].avg_vision_score).toFixed(decimal);
                const average_total_kills = Number.parseFloat(response.rows[0].avg_total_kills).toFixed(decimal);

                average_cs = (average_cs / (length / 60)).toFixed(decimal);
                average_gold = (average_gold / (length / 60)).toFixed(decimal);
                average_damages = (average_damages / (length / 60)).toFixed(decimal);
                average_tanked = (average_tanked / (length / 60)).toFixed(decimal);

                // KwikScore

                let score = 0;
                score += overall;
                score += win;
                score += (Number.parseFloat(average_kills) + Number.parseFloat(average_assists)) / average_total_kills * 100;
                score += 5 * (((Number.parseFloat(average_vision_score)) / (length / 60)) / 0.2);
                score += 10 * average_cs;
                if (100 - response.rows[0].games_played > 0) {
                    score = score * 0.99 ** (100 - response.rows[0].games_played);
                }

                let title = "" + discordusername + "'s stats";
                if (champion !== null) {
                    title += " with " + champion;
                }
                if (role !== null) {
                    title += " in " + role;
                }
                if (account !== null) {
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
                        value: "" + response.rows[0].games_played,
                        inline: true
                    },
                    {
                        name: "WR :",
                        value: "" + (win).toFixed(decimal) + " %",
                        inline: true,
                    },
                    {
                        name: "KillParticipation :",
                        value: "" + ((Number.parseFloat(average_kills) + Number.parseFloat(average_assists)) / average_total_kills * 100).toFixed(decimal) + " %",
                        inline: true,
                    },
                    {
                        name: "Carry stats :",
                        value: "Overall : " + (overall).toFixed(decimal) + " %\nHard Carry : " + (hard_carry).toFixed(decimal) + " %\nDamage : " + (carry_damage).toFixed(decimal) + " %\nTanked : " + (carry_tanked).toFixed(decimal) + " %\nGold : " + (carry_gold).toFixed(decimal) + " %",
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
                let i = 1;

                let discordusername = "";
                if (discordaccount === null) {
                    discordaccount = interaction.user.id;
                    discordusername = interaction.user.username;
                } else {
                    discordusername = discordaccount.username;
                    discordaccount = discordaccount.id;
                }
                const query_values = [discordaccount];

                let query = "SELECT matchs.matchup, count(*) AS count1, (cast(" +
                    "count(*) FILTER (" +
                    "WHERE result = 'Win'" +
                    ")*100 as float)/count(*)) AS winrate, (cast(" +
                    "count(*) FILTER (" +
                    "WHERE (first_tanked OR first_gold OR first_damages)" +
                    ")*100 as float)/count(*)) AS carry " +
                    "FROM matchs, summoners " +
                    "WHERE summoners.discordid=$1 AND matchs.player = summoners.puuid";
                i++;

                if (champion !== null) {
                    query += " AND matchs.champion=$" + i;
                    query_values.push(champion);
                    i++;
                }
                if (role !== null) {
                    query += " AND matchs.lane=$" + i;
                    query_values.push(role);
                    i++;
                }
                if (gamemode !== null) {
                    query += " AND matchs.gamemode=$" + i;
                    query_values.push(gamemode);
                    i++;
                }
                if (account !== null) {
                    query += " AND summoners.username=$" + i;
                    query_values.push(account);
                    i++;
                }
                query += " GROUP BY matchs.matchup ORDER BY count1 DESC;";

                const response = await client.pg.query(query, query_values);
                if (response.rows.length === 0) {
                    return await interaction.editReply("You don't have any matchs in the database or the filters are too restrictings.");
                }

                const url = "https://chart.googleapis.com/chart?cht=bvg&chs=1000x300&chxt=x,y&chd=t:";

                let values1 = "";
                let values2 = "";
                let champ = "";

                const max = 17;

                const data = [];
                for (let i = 0; i < response.rows.length; i++) {
                    if (response.rows[i].count1 > 4 && response.rows[i].matchup !== "" && response.rows[i].matchup !== "Invalid") {
                        data.push("- " + response.rows[i].matchup + " : " + response.rows[i].count1 + " matchs (" + response.rows[i].winrate.toFixed(1) + "% winrate, " + response.rows[i].carry.toFixed(1) + "% carry)\n");
                        if (i < max) {
                            values1 += response.rows[i].winrate + ",";
                            values2 += response.rows[i].carry + ",";
                            champ += response.rows[i].matchup.replaceAll(" ", "").replaceAll("&", "") + "|";
                        }
                    }
                }
                values1 = values1.substring(0, values1.length - 1);
                values2 = values2.substring(0, values2.length - 1);
                champ = champ.substring(0, champ.length - 1);

                if (data.length === 0) {
                    return await interaction.editReply("You must have played more than 4 games against a matchup.");
                }

                const url2 = (url + values1 + "|" + values2 + "&chl=" + champ + "&chco=FF0000,00FF00&chf=bg,s,00000a00");

                let title = "" + discordusername + "'s matchups";
                if (champion !== null) {
                    title += " with " + champion;
                }
                if (role !== null) {
                    title += " in " + role;
                }
                if (account !== null) {
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
                let i = 1;

                let discordusername = "";
                if (discordaccount === null) {
                    discordaccount = interaction.user.id;
                    discordusername = interaction.user.username;
                } else {
                    discordusername = discordaccount.username;
                    discordaccount = discordaccount.id;
                }
                const query_values = [discordaccount];

                let query = "SELECT champion, " +
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
                    "WHERE summoners.discordid=$1 " +
                    "AND matchs.player = summoners.puuid";
                i++;

                if (role !== null) {
                    query += " AND matchs.lane=$" + i;
                    query_values.push(role);
                    i++;
                }
                if (gamemode !== null) {
                    query += " AND matchs.gamemode=$" + i;
                    query_values.push(gamemode);
                    i++;
                }
                if (account !== null) {
                    query += " AND summoners.username=$" + i;
                    query_values.push(account);
                    i++;
                }
                query += " GROUP BY champion ORDER BY count(*) DESC;";

                const response = await client.pg.query(query, query_values);
                if (response.rows.length === 0) {
                    return await interaction.editReply("You don't have any matchs in the database.");
                }

                const url = "https://chart.googleapis.com/chart?cht=bvg&chs=1000x300&chxt=x,y&chd=t:";

                let values1 = "";
                let values2 = "";
                let champ = "";

                const max = 17;

                for (let i = 0; i < response.rows.length; i++) {
                    if (response.rows[i].count > 4 && response.rows[i].champion !== "" && response.rows[i].champion !== "Invalid") {
                        if (i < max) {
                            values1 += response.rows[i].winrate + ",";
                            values2 += response.rows[i].carry + ",";
                            champ += response.rows[i].champion.replaceAll(" ", "").replaceAll("&", "") + "|";
                        }
                    }
                }
                values1 = values1.substring(0, values1.length - 1);
                values2 = values2.substring(0, values2.length - 1);
                champ = champ.substring(0, champ.length - 1);
                const url2 = (url + values1 + "|" + values2 + "&chl=" + champ + "&chco=FF0000,00FF00&chf=bg,s,00000a00");

                let title = "" + discordusername + "'s champions";
                if (role !== null) {
                    title += " in " + role;
                }
                if (account !== null) {
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
                /*if (puuid !== null) {
                    const query = "SELECT * FROM matchs WHERE puuid=$1;";
                    const response = await client.pg.query(query, [puuid]);
                    if (response.rows.length === 0) {
                        return await interaction.editReply("This match doesn't exist.");
                    }
                    const match = response.rows[0];
                    console.log(match);
                } else {
                    //let queryaccount = ""
                    if (account !== null) {
                        //queryaccount = " AND summoners.account = '" + account + "' ";
                    }

                }*/
            } else if (interaction.options.getSubcommand() === "evolution") {
                let i = 1;

                let discordusername = "";
                if (discordaccount === null) {
                    discordaccount = interaction.user.id;
                    discordusername = interaction.user.username;
                } else {
                    discordusername = discordaccount.username;
                    discordaccount = discordaccount.id;
                }
                const query_values = [discordaccount];
                i++;

                let queryaccount = "";
                if (account !== null) {
                    queryaccount = " AND summoners.account = $" + i;
                    query_values.push(account);
                    i++;
                }

                let querygamemode = "";
                if (gamemode !== null) {
                    querygamemode = " AND matchs.gamemode = $" + i;
                    query_values.push(gamemode);
                    i++;
                }

                let queryrole = "";
                if (role !== null) {
                    queryrole = " AND matchs.lane = $" + i;
                    query_values.push(role);
                    i++;
                }

                let querychamp = "";
                if (champion !== null) {
                    querychamp = " AND matchs.champion=$" + i;
                    query_values.push(champion);
                    i++;
                }

                const query =
                    "WITH weekly_matches AS (" +
                    "SELECT " +
                    "date_trunc('week', to_timestamp(timestamp / 1000)) AS week, " +
                    "Count(*) AS total_games, " +
                    "CAST(SUM(CASE WHEN result = 'Win' THEN 1 ELSE 0 END) AS FLOAT)/ Count(*) AS win_rate, " +
                    "CAST(SUM(CASE WHEN (first_gold OR first_damages OR first_tanked) THEN 1 ELSE 0 END) AS FLOAT) / Count(*) AS first_gold_or_damages_or_tanked, " +
                    "CAST(SUM(CASE WHEN first_gold AND first_damages AND first_tanked THEN 1 ELSE 0 END) AS FLOAT) / Count(*) AS first_gold_and_damages_and_tanked, " +
                    "(CAST(SUM(kill + assists) AS FLOAT) / AVG(total_kills))/ Count(*) AS kill_participation, " +
                    "SUM(vision_score) / (SUM(length / 60) * 20) AS vision_score_per_minute, " +
                    "SUM(cs) / (SUM(length / 60)) AS cs_per_minute " +
                    "FROM matchs, summoners " +
                    "WHERE discordid = $1" +
                    " AND matchs.player = summoners.puuid" +
                    " AND (result = 'Win' OR result = 'Lose')" +
                    queryaccount +
                    querygamemode +
                    queryrole +
                    querychamp +
                    " GROUP BY week " +
                    ")" +
                    "SELECT " +
                    "week, " +
                    "total_games, " +
                    "win_rate, " +
                    "100 * first_gold_or_damages_or_tanked + 100 * win_rate + 100 * kill_participation + 5 * vision_score_per_minute + 10 * cs_per_minute + 50 * first_gold_and_damages_and_tanked  AS score " +
                    "FROM weekly_matches ORDER BY week ASC;";

                const response = await client.pg.query(query, query_values);
                if (response.rows.length === 0) {
                    interaction.editReply("No data found for this account");
                    return;
                }

                const labels = [];
                const data = [];
                for (let i = 0; i < response.rows.length; i++) {
                    labels.push(response.rows[i].week);
                    data.push(response.rows[i].score);
                    //ks.push({ x: response.rows[i].week, y: response.rows[i].score });
                }
                //console.log(ks)

                //let url = "https://chart.googleapis.com/chart?cht=lc&chs=600x300&chco=FFC6A5&chxt=y&chxr=0,0,500&chf=bg,s,00000a00&chdl=ks&chd=t:";
                //let values = "";
                //for (let i = 0; i < ks.length; i++) {
                //    values += (ks[i].y / 5).toFixed(0) + ",";
                //}
                //values = values.slice(0, -1);
                //url += values;
                //console.log(url)

                console.log(data);

                const width = 1500; //px
                const height = 1000; //px
                const backgroundColour = 'white'; // Uses https://www.w3schools.com/tags/canvas_fillstyle.asp
                const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour });

                const configuration = {
                    type: 'line',
                    data: {
                        datasets: [{
                            label: 'Ks evolution',
                            data: data,
                            borderColor: '#36A2EB',
                            backgroundColor: '#9BD0F5'
                        }]//,
                        //labels: labels
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Chart.js Line Chart'
                            }
                        }
                    }, // See https://www.chartjs.org/docs/latest/configuration
                };
                const image = await chartJSNodeCanvas.renderToBuffer(configuration);
                const attachment = new MessageAttachment(image, 'ks.png');

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
                    .setImage("attachment://ks.png");

                interaction.editReply({ embeds: [embed], files: [attachment] });
            } else if (interaction.options.getSubcommand() === "friends") {
                /*let i = 1;

                //let discordusername = "";
                if (discordaccount === null) {
                    discordaccount = interaction.user.id;
                    //discordusername = interaction.user.username;
                } else {
                    //discordusername = discordaccount.username;
                    discordaccount = discordaccount.id;
                }

                const query_values = [discordaccount];
                i++;

                let queryaccount = "";
                if (account !== null) {
                    queryaccount = " AND summoners.account = $" + i;
                    query_values.push(account);
                    i++;
                }

                let querygamemode = "";
                if (gamemode !== null) {
                    querygamemode = " AND matchs.gamemode = $" + i;
                    query_values.push(gamemode);
                    i++;
                }

                let queryrole = "";
                if (role !== null) {
                    queryrole = " AND matchs.lane = $" + i;
                    query_values.push(role);
                    i++;
                }

                let querychamp = "";
                if (champion !== null) {
                    querychamp = " AND matchs.champion=$" + i;
                    query_values.push(champion);
                    i++;
                }

                const query = "" +
                    "SELECT " +

                    "mate, " +
                    "count(*), " +
                    "(cast(count(*) FILTER (WHERE result = 'Win')*100 as float)/count(*)) as WR, " +
                    "(cast(count(*) FILTER (WHERE (first_gold OR first_damages OR first_tanked))*100 as float)/count(*)) as CARRY, " +
                    "CASE WHEN avg(total_kills) > 0 THEN cast((avg(kill)+avg(assists))*100 as float)/avg(total_kills) ELSE cast((avg(kill)+avg(assists))*100 as float)/1 END as KP, " +
                    "cast(avg(vision_score) as float)/(avg(length)/60) as VS, " +
                    "cast(avg(cs) as float)/(avg(length)/60) as CS, " +
                    "(cast(count(*) FILTER (WHERE first_gold AND first_damages AND first_tanked)*100 as float)/count(*)) as hardcarry " +

                    "FROM (" +
                    "SELECT champion, result, kill, assists, deaths, gold, lane, support, total_damage, tanked_damage, heal, wards, pinks, vision_score, cs, length, total_kills, first_gold, first_damages, first_tanked, time_spent_dead, timestamp, player2 as mate " +
                    "FROM matchs, summoners " +
                    //"WHERE discordid = '297409548703105035'" +
                    "WHERE summoners.discordid = $1" +
                    " AND matchs.player = summoners.puuid" +
                    queryaccount +
                    querygamemode +
                    queryrole +
                    querychamp +
                    " UNION " +
                    "SELECT champion, result, kill, assists, deaths, gold, lane, support, total_damage, tanked_damage, heal, wards, pinks, vision_score, cs, length, total_kills, first_gold, first_damages, first_tanked, time_spent_dead, timestamp, player3 as mate " +
                    "FROM matchs, summoners " +
                    "WHERE summoners.discordid = $1" +
                    //"WHERE discordid = '297409548703105035'" +
                    " AND matchs.player = summoners.puuid" +
                    queryaccount +
                    querygamemode +
                    queryrole +
                    querychamp +
                    " UNION " +
                    "SELECT champion, result, kill, assists, deaths, gold, lane, support, total_damage, tanked_damage, heal, wards, pinks, vision_score, cs, length, total_kills, first_gold, first_damages, first_tanked, time_spent_dead, timestamp, player4 as mate " +
                    "FROM matchs, summoners " +
                    "WHERE summoners.discordid = $1" +
                    //"WHERE discordid = '297409548703105035'" +
                    " AND matchs.player = summoners.puuid" +
                    queryaccount +
                    querygamemode +
                    queryrole +
                    querychamp +
                    " UNION " +
                    "SELECT champion, result, kill, assists, deaths, gold, lane, support, total_damage, tanked_damage, heal, wards, pinks, vision_score, cs, length, total_kills, first_gold, first_damages, first_tanked, time_spent_dead, timestamp, player5 as mate " +
                    "FROM matchs, summoners " +
                    "WHERE summoners.discordid = $1" +
                    //"WHERE discordid = '297409548703105035'" +
                    " AND matchs.player = summoners.puuid" +
                    queryaccount +
                    querygamemode +
                    queryrole +
                    querychamp +
                    ") AS SUB GROUP BY mate HAVING count(*) > 1 ORDER BY COUNT(*) DESC;";
                console.log(query);
                const response = await client.pg.query(query, query_values);
                if (response.rows.length === 0) {
                    interaction.editReply("No data found for this account");
                    return;
                }
                console.log(response.rows);
                */
            } else if (interaction.options.getSubcommand() === "profile") {
                let discordusername = "";
                if (discordaccount === null) {
                    discordaccount = interaction.user.id;
                    discordusername = interaction.user.username;
                } else {
                    discordusername = discordaccount.username;
                    discordaccount = discordaccount.id;
                }
                const query_values = [discordaccount];

                const response = await client.pg.query("SELECT * FROM summoners WHERE discordid = $1;", query_values);
                if (response.rows.length === 0) {
                    return await interaction.editReply("No data found. Try adding your account with /account add");
                }

                let accounts = "";
                let best_solo = ["unranked", "", 0];
                let best_flex = ["unranked", "", 0];
                for (const row of response.rows) {
                    accounts += "EUW - " + row.username + "\n";

                    if (tiers.indexOf(row.tier_solo) > tiers.indexOf(best_solo[0])) {
                        best_solo = [row.tier_solo, row.rank_solo, row.lp_solo];
                    } else if (tiers.indexOf(row.tier_solo) === tiers.indexOf(best_solo[0])) {
                        if (rank.indexOf(row.rank_solo) > rank.indexOf(best_solo[1])) {
                            best_solo = [row.tier_solo, row.rank_solo, row.lp_solo];
                        } else if (rank.indexOf(row.rank_solo) === rank.indexOf(best_solo[1])) {
                            if (row.lp_solo > best_solo[2]) {
                                best_solo = [row.tier_solo, row.rank_solo, row.lp_solo];
                            }
                        }
                    }

                    if (tiers.indexOf(row.tier_flex) > tiers.indexOf(best_flex[0])) {
                        best_flex = [row.tier_flex, row.rank_flex, row.lp_flex];
                    } else if (tiers.indexOf(row.tier_flex) === tiers.indexOf(best_flex[0])) {
                        if (rank.indexOf(row.rank_flex) > rank.indexOf(best_flex[1])) {
                            best_flex = [row.tier_flex, row.rank_flex, row.lp_flex];
                        } else if (rank.indexOf(row.rank_flex) === rank.indexOf(best_flex[1])) {
                            if (row.lp_flex > best_flex[2]) {
                                best_flex = [row.tier_flex, row.rank_flex, row.lp_flex];
                            }
                        }
                    }

                }

                let best_solo_str;
                let best_flex_str;

                if (best_solo[0] === "unranked") {
                    best_solo_str = "Unranked";
                } else {
                    best_solo_str = emojis[best_solo[0]] + " " + best_solo[1] + " " + best_solo[2] + "LP";
                }
                if (best_flex[0] === "unranked") {
                    best_flex_str = "Unranked";
                } else {
                    best_flex_str = emojis[best_solo[0]] + " " + best_solo[1] + " " + best_solo[2] + "LP";
                }

                // mastery
                const mastery = await client.pg.query("SELECT * FROM mastery WHERE discordid = '" + discordaccount + "';");

                let first_mastery;
                if (mastery.rows[0].first_mastery < 10000) {
                    first_mastery = mastery.rows[0].first_mastery;
                } else {
                    first_mastery = Math.floor(mastery.rows[0].first_mastery / 1000) + "k";
                }

                let second_mastery;
                if (mastery.rows[0].second_mastery < 10000) {
                    second_mastery = mastery.rows[0].second_mastery;
                } else {
                    second_mastery = Math.floor(mastery.rows[0].second_mastery / 1000) + "k";
                }

                let third_mastery;
                if (mastery.rows[0].third_mastery < 10000) {
                    third_mastery = mastery.rows[0].third_mastery;
                } else {
                    third_mastery = Math.floor(mastery.rows[0].third_mastery / 1000) + "k";
                }

                const Top_Champion = " - **" + mastery.rows[0].first_mastery_champ + "** - " + first_mastery +
                    "\n - **" + mastery.rows[0].second_mastery_champ + "** - " + second_mastery +
                    "\n - **" + mastery.rows[0].third_mastery_champ + "** - " + third_mastery;

                // Mastery statistics
                const Mastery_statistics = mastery.rows[0].mastery7 + "x<:Level_7:411977489707958282> " +
                    mastery.rows[0].mastery6 + "x<:Level_6:411977489351704587> " +
                    mastery.rows[0].mastery5 + "x<:Level_5:411977803144364032> \n" +
                    mastery.rows[0].total_point + " **Total Points**";

                // Champion statistics
                //const response2 = await client.pg.query("SELECT * FROM matchs,summoners WHERE matchs.player = summoners.puuid AND discordid = '" + discordaccount + "' ORDER BY timestamp DESC LIMIT 3;");

                const embed = new MessageEmbed()
                    .setTitle("📖" + discordusername + "'s Profile :")
                    .setColor("#00FF00")
                    .setFooter({
                        text: "Requested by " + interaction.user.username,
                        //iconURL: interaction.user.displayAvatarURL()
                    })
                    .setTimestamp();
                embed.addFields(
                    {
                        name: "**Top Champions :**",
                        value: "" + Top_Champion,
                        inline: true
                    },
                    {
                        name: "**Mastery Statistics :**",
                        value: "" + Mastery_statistics,
                        inline: true
                    },/*
                    {
                        name: "**Recently Played :**",
                        value: "" + tanked,
                        inline: true
                    },*/
                    {
                        name: "**Ranked Tiers :**",
                        value: "Ranked Solo : **" + best_solo_str + "**\nRanked Flex : **" + best_flex_str + "**",
                        inline: true
                    },
                    {
                        name: "**Accounts :**",
                        value: "" + accounts,
                        inline: true
                    },

                );
                //.setURL(url);
                return await interaction.editReply({ embeds: [embed] });

            } else if (interaction.options.getSubcommand() === "compare") {
                const priority = await client.pg.query("SELECT priority FROM summoners WHERE discordid = $1;", [interaction.user.id]);
                if (priority.rows[0].priority === 0) {
                    return await interaction.editReply("This feature is not available for the moment. If you want to support me, you can contact me on discord : **KwikKill#6123**");
                }

                let i = 1;

                const discordusername = discordaccount.username;
                discordaccount = discordaccount.id;
                const query_values = [discordaccount];

                let query = "SELECT * " +
                    "FROM matchs, summoners " +
                    "WHERE summoners.discordid=$1 " +
                    "AND matchs.player = summoners.puuid";
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
                    "WHERE summoners.discordid=$1 AND matchs.player = summoners.puuid";
                i++;

                if (champion !== null) {
                    query += " AND matchs.champion=$" + i;
                    query2 += " AND matchs.champion=$" + i;
                    query_values.push(champion);
                    i++;
                }
                if (role !== null) {
                    query += " AND matchs.lane=$" + i;
                    query2 += " AND matchs.lane=$" + i;
                    query_values.push(role);
                    i++;
                }
                if (gamemode !== null) {
                    query += " AND matchs.gamemode=$" + i;
                    query2 += " AND matchs.gamemode=$" + i;
                    query_values.push(gamemode);
                    i++;
                }
                query += ";";
                query2 += ";";

                const response = await client.pg.query(query, query_values);
                if (response.rows.length === 0) {
                    return await interaction.editReply("This person does not have any matchs in the database or the filters are too restrictings.");
                }

                const response2 = await client.pg.query(query2, query_values);

                // 1) Carry stats

                let oponent_carry_damage = 0;
                let oponent_carry_tanked = 0;
                let oponent_carry_gold = 0;
                let oponent_overall = 0;
                let oponent_hard_carry = 0;
                let oponent_win = 0;


                for (let i = 0; i < response.rows.length; i++) {
                    if (response.rows[i].result === "Win") {
                        oponent_win += 1;
                    }
                    if (response.rows[i].first_gold) {
                        oponent_carry_gold += 1;
                    }
                    if (response.rows[i].first_damages) {
                        oponent_carry_damage += 1;
                    }
                    if (response.rows[i].first_tanked) {
                        oponent_carry_tanked += 1;
                    }
                    if (response.rows[i].first_damages && response.rows[i].first_tanked && response.rows[i].first_gold) {
                        oponent_hard_carry += 1;
                    }
                    if (response.rows[i].first_damages || response.rows[i].first_tanked || response.rows[i].first_gold) {
                        oponent_overall += 1;
                    }
                }

                // 2) Average stats

                const oponent_length = response2.rows[0].duration;

                const oponent_average_kills = Number.parseFloat(response2.rows[0].kill).toFixed(decimal);
                const oponent_average_deaths = Number.parseFloat(response2.rows[0].deaths).toFixed(decimal);
                const oponent_average_assists = Number.parseFloat(response2.rows[0].assists).toFixed(decimal);
                let oponent_average_cs = Number.parseFloat(response2.rows[0].cs).toFixed(decimal);
                let oponent_average_gold = response2.rows[0].gold;
                let oponent_average_damages = response2.rows[0].damage;
                let oponent_average_tanked = response2.rows[0].damage_taken;
                const oponent_average_pinks = Number.parseFloat(response2.rows[0].pinks).toFixed(decimal);
                const oponent_average_vision_score = Number.parseFloat(response2.rows[0].vision_score).toFixed(decimal);
                const oponent_average_total_kills = Number.parseFloat(response2.rows[0].total_kills).toFixed(decimal);

                oponent_average_cs = (oponent_average_cs / (oponent_length / 60)).toFixed(decimal);
                oponent_average_gold = (oponent_average_gold / (oponent_length / 60)).toFixed(decimal);
                oponent_average_damages = (oponent_average_damages / (oponent_length / 60)).toFixed(decimal);
                oponent_average_tanked = (oponent_average_tanked / (oponent_length / 60)).toFixed(decimal);

                // KwikScore

                let oponent_score = 0;
                oponent_score += oponent_overall / response.rows.length * 100;
                oponent_score += oponent_win / response.rows.length * 100;
                oponent_score += (Number.parseFloat(oponent_average_kills) + Number.parseFloat(oponent_average_assists)) / oponent_average_total_kills * 100;
                oponent_score += 5 * (((Number.parseFloat(oponent_average_vision_score)) / (oponent_length / 60)) / 0.2);
                oponent_score += 10 * oponent_average_cs;
                if (100 - response.rows.length > 0) {
                    oponent_score = oponent_score * 0.99 ** (100 - response.rows.length);
                }

                oponent_carry_damage = oponent_carry_damage / response.rows.length * 100;
                oponent_carry_tanked = oponent_carry_tanked / response.rows.length * 100;
                oponent_carry_gold = oponent_carry_gold / response.rows.length * 100;
                oponent_overall = oponent_overall / response.rows.length * 100;
                oponent_hard_carry = oponent_hard_carry / response.rows.length * 100;
                oponent_win = oponent_win / response.rows.length * 100;

                // Your stats

                let j = 1;

                query_values[0] = interaction.user.id;

                let query3 = "SELECT * " +
                    "FROM matchs, summoners " +
                    "WHERE summoners.discordid=$1 " +
                    "AND matchs.player = summoners.puuid";
                let query4 = "SELECT " +
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
                    "WHERE summoners.discordid=$1 AND matchs.player = summoners.puuid";
                i++;

                if (champion !== null) {
                    query3 += " AND matchs.champion=$" + j;
                    query4 += " AND matchs.champion=$" + j;
                    j++;
                }
                if (role !== null) {
                    query3 += " AND matchs.lane=$" + j;
                    query4 += " AND matchs.lane=$" + j;
                    j++;
                }
                if (gamemode !== null) {
                    query3 += " AND matchs.gamemode=$" + j;
                    query4 += " AND matchs.gamemode=$" + j;
                    j++;
                }
                query3 += ";";
                query4 += ";";

                const response4 = await client.pg.query(query3, query_values);
                if (response4.rows.length === 0) {
                    return await interaction.editReply("You dont have any matchs in the database or the filters are too restrictings.");
                }

                const response5 = await client.pg.query(query4, query_values);

                // 1) Carry stats

                let carry_damage = 0;
                let carry_tanked = 0;
                let carry_gold = 0;
                let overall = 0;
                let hard_carry = 0;
                let win = 0;


                for (let i = 0; i < response4.rows.length; i++) {
                    if (response4.rows[i].result === "Win") {
                        win += 1;
                    }
                    if (response4.rows[i].first_gold) {
                        carry_gold += 1;
                    }
                    if (response4.rows[i].first_damages) {
                        carry_damage += 1;
                    }
                    if (response4.rows[i].first_tanked) {
                        carry_tanked += 1;
                    }
                    if (response4.rows[i].first_damages && response4.rows[i].first_tanked && response4.rows[i].first_gold) {
                        hard_carry += 1;
                    }
                    if (response4.rows[i].first_damages || response4.rows[i].first_tanked || response4.rows[i].first_gold) {
                        overall += 1;
                    }
                }

                // 2) Average stats

                const length = response5.rows[0].duration;

                const average_kills = Number.parseFloat(response5.rows[0].kill).toFixed(decimal);
                const average_deaths = Number.parseFloat(response5.rows[0].deaths).toFixed(decimal);
                const average_assists = Number.parseFloat(response5.rows[0].assists).toFixed(decimal);
                let average_cs = Number.parseFloat(response5.rows[0].cs).toFixed(decimal);
                let average_gold = response5.rows[0].gold;
                let average_damages = response5.rows[0].damage;
                let average_tanked = response5.rows[0].damage_taken;
                const average_pinks = Number.parseFloat(response5.rows[0].pinks).toFixed(decimal);
                const average_vision_score = Number.parseFloat(response5.rows[0].vision_score).toFixed(decimal);
                const average_total_kills = Number.parseFloat(response5.rows[0].total_kills).toFixed(decimal);

                average_cs = (average_cs / (length / 60)).toFixed(decimal);
                average_gold = (average_gold / (length / 60)).toFixed(decimal);
                average_damages = (average_damages / (length / 60)).toFixed(decimal);
                average_tanked = (average_tanked / (length / 60)).toFixed(decimal);

                // KwikScore

                let score = 0;
                score += overall / response4.rows.length * 100;
                score += win / response4.rows.length * 100;
                score += (Number.parseFloat(average_kills) + Number.parseFloat(average_assists)) / average_total_kills * 100;
                score += 5 * (((Number.parseFloat(average_vision_score)) / (length / 60)) / 0.2);
                score += 10 * average_cs;
                if (100 - response4.rows.length > 0) {
                    score = score * 0.99 ** (100 - response4.rows.length);
                }

                carry_damage = carry_damage / response4.rows.length * 100;
                carry_tanked = carry_tanked / response4.rows.length * 100;
                carry_gold = carry_gold / response4.rows.length * 100;
                overall = overall / response4.rows.length * 100;
                hard_carry = hard_carry / response4.rows.length * 100;
                win = win / response4.rows.length * 100;

                let title = "Stats comparaison with " + discordusername + "";
                if (champion !== null) {
                    title += " on " + champion;
                }
                if (role !== null) {
                    title += " in " + role;
                }

                let text = "```" +
                    "─────────────────────┬──────────────────────────────\n";
                text += "Average Kills        │ " + Number.parseFloat(average_kills).toFixed(2) + " ".repeat(8 - Number.parseFloat(average_kills).toFixed(2).length);
                text += (Number.parseFloat(average_kills) >= Number.parseFloat(oponent_average_kills)) ? " ▲ " : " ▼ ";
                text += Number.parseFloat(oponent_average_kills).toFixed(2) + " ".repeat(7 - Number.parseFloat(oponent_average_kills).toFixed(2).length);
                text += " (";
                text += (Number.parseFloat(average_kills) >= Number.parseFloat(oponent_average_kills)) ? "+" : "-";
                text += Number.parseFloat(average_kills - oponent_average_kills).toFixed(2) + ")\n";

                text += "Average Deaths       │ " + Number.parseFloat(average_deaths).toFixed(2) + " ".repeat(8 - Number.parseFloat(average_deaths).toFixed(2).length);
                text += (Number.parseFloat(average_deaths) >= Number.parseFloat(oponent_average_deaths)) ? " ▲ " : " ▼ ";
                text += Number.parseFloat(oponent_average_deaths).toFixed(2) + " ".repeat(7 - Number.parseFloat(oponent_average_deaths).toFixed(2).length);
                text += " (";
                text += (Number.parseFloat(average_deaths) >= Number.parseFloat(oponent_average_deaths)) ? "+" : "-";
                text += Number.parseFloat(average_deaths - oponent_average_deaths).toFixed(2) + ")\n";

                text += "Average Assists      │ " + Number.parseFloat(average_assists).toFixed(2) + " ".repeat(8 - Number.parseFloat(average_assists).toFixed(2).length);
                text += (Number.parseFloat(average_assists) >= Number.parseFloat(oponent_average_assists)) ? " ▲ " : " ▼ ";
                text += Number.parseFloat(oponent_average_assists).toFixed(2) + " ".repeat(7 - Number.parseFloat(oponent_average_assists).toFixed(2).length);
                text += " (";
                text += (Number.parseFloat(average_assists) >= Number.parseFloat(oponent_average_assists)) ? "+" : "";
                text += Number.parseFloat(average_assists - oponent_average_assists).toFixed(2) + ")\n";

                text += "Average CS           │ " + Number.parseFloat(average_cs).toFixed(2) + " ".repeat(8 - Number.parseFloat(average_cs).toFixed(2).length);
                text += (Number.parseFloat(average_cs) >= Number.parseFloat(oponent_average_cs)) ? " ▲ " : " ▼ ";
                text += Number.parseFloat(oponent_average_cs).toFixed(2) + " ".repeat(7 - Number.parseFloat(oponent_average_cs).toFixed(2).length);
                text += " (";
                text += (Number.parseFloat(average_cs) >= Number.parseFloat(oponent_average_cs)) ? "+" : "";
                text += Number.parseFloat(average_cs - oponent_average_cs).toFixed(2) + ")\n";

                text += "Average Gold         │ " + Number.parseFloat(average_gold).toFixed(2) + " ".repeat(8 - Number.parseFloat(average_gold).toFixed(2).length);
                text += (Number.parseFloat(average_gold) >= Number.parseFloat(oponent_average_gold)) ? " ▲ " : " ▼ ";
                text += Number.parseFloat(oponent_average_gold).toFixed(2) + " ".repeat(7 - Number.parseFloat(oponent_average_gold).toFixed(2).length);
                text += " (";
                text += (Number.parseFloat(average_gold) >= Number.parseFloat(oponent_average_gold)) ? "+" : "";
                text += Number.parseFloat(average_gold - oponent_average_gold).toFixed(2) + ")\n";

                text += "Average Damages      │ " + Number.parseFloat(average_damages).toFixed(2) + " ".repeat(8 - Number.parseFloat(average_damages).toFixed(2).length);
                text += (Number.parseFloat(average_damages) >= Number.parseFloat(oponent_average_damages)) ? " ▲ " : " ▼ ";
                text += Number.parseFloat(oponent_average_damages).toFixed(2) + " ".repeat(7 - Number.parseFloat(oponent_average_damages).toFixed(2).length);
                text += " (";
                text += (Number.parseFloat(average_damages) >= Number.parseFloat(oponent_average_damages)) ? "+" : "";
                text += Number.parseFloat(average_damages - oponent_average_damages).toFixed(2) + ")\n";

                text += "Average Tanked       │ " + Number.parseFloat(average_tanked).toFixed(2) + " ".repeat(8 - Number.parseFloat(average_tanked).toFixed(2).length);
                text += (Number.parseFloat(average_tanked) >= Number.parseFloat(oponent_average_tanked)) ? " ▲ " : " ▼ ";
                text += Number.parseFloat(oponent_average_tanked).toFixed(2) + " ".repeat(7 - Number.parseFloat(oponent_average_tanked).toFixed(2).length);
                text += " (";
                text += (Number.parseFloat(average_tanked) >= Number.parseFloat(oponent_average_tanked)) ? "+" : "";
                text += Number.parseFloat(average_tanked - oponent_average_tanked).toFixed(2) + ")\n";

                text += "Average Pinks        │ " + Number.parseFloat(average_pinks).toFixed(2) + " ".repeat(8 - Number.parseFloat(average_pinks).toFixed(2).length);
                text += (Number.parseFloat(average_pinks) >= Number.parseFloat(oponent_average_pinks)) ? " ▲ " : " ▼ ";
                text += Number.parseFloat(oponent_average_pinks).toFixed(2) + " ".repeat(7 - Number.parseFloat(oponent_average_pinks).toFixed(2).length);
                text += " (";
                text += (Number.parseFloat(average_pinks) >= Number.parseFloat(oponent_average_pinks)) ? "+" : "";
                text += Number.parseFloat(average_pinks - oponent_average_pinks).toFixed(2) + ")\n";

                text += "Average Vision Score │ " + Number.parseFloat(average_vision_score).toFixed(2) + " ".repeat(8 - Number.parseFloat(average_vision_score).toFixed(2).length);
                text += (Number.parseFloat(average_vision_score) >= Number.parseFloat(oponent_average_vision_score)) ? " ▲ " : " ▼ ";
                text += Number.parseFloat(oponent_average_vision_score).toFixed(2) + " ".repeat(7 - Number.parseFloat(oponent_average_vision_score).toFixed(2).length);
                text += " (";
                text += (Number.parseFloat(average_vision_score) >= Number.parseFloat(oponent_average_vision_score)) ? "+" : "";
                text += Number.parseFloat(average_vision_score - oponent_average_vision_score).toFixed(2) + ")\n";

                text += "Average KP           │ " + Number.parseFloat((Number.parseFloat(average_kills) + Number.parseFloat(average_assists)) * 100 / average_total_kills).toFixed(2) + " ".repeat(8 - Number.parseFloat((Number.parseFloat(average_kills) + Number.parseFloat(average_assists)) * 100 / average_total_kills).toFixed(2).length);
                text += (Number.parseFloat((Number.parseFloat(average_kills) + Number.parseFloat(average_assists)) * 100 / average_total_kills) >= Number.parseFloat((Number.parseFloat(oponent_average_kills) + Number.parseFloat(oponent_average_assists)) * 100 / oponent_average_total_kills)) ? " ▲ " : " ▼ ";
                text += Number.parseFloat((Number.parseFloat(oponent_average_kills) + Number.parseFloat(oponent_average_assists)) * 100 / oponent_average_total_kills).toFixed(2) + " ".repeat(7 - Number.parseFloat((Number.parseFloat(oponent_average_kills) + Number.parseFloat(oponent_average_assists)) * 100 / oponent_average_total_kills).toFixed(2).length);
                text += " (";
                text += (Number.parseFloat((Number.parseFloat(average_kills) + Number.parseFloat(average_assists)) * 100 / average_total_kills) >= Number.parseFloat((Number.parseFloat(oponent_average_kills) + Number.parseFloat(oponent_average_assists)) * 100 / oponent_average_total_kills)) ? "+" : "";
                text += Number.parseFloat((Number.parseFloat(average_kills) + Number.parseFloat(average_assists)) * 100 / average_total_kills - (Number.parseFloat(oponent_average_kills) + Number.parseFloat(oponent_average_assists)) * 100 / oponent_average_total_kills).toFixed(2) + ")\n";

                text += "KwikScore            │ " + Number.parseFloat(score).toFixed(2) + " ".repeat(8 - Number.parseFloat(score).toFixed(2).length);
                text += (Number.parseFloat(score) >= Number.parseFloat(oponent_score)) ? " ▲ " : " ▼ ";
                text += Number.parseFloat(oponent_score).toFixed(2) + " ".repeat(7 - Number.parseFloat(oponent_score).toFixed(2).length);
                text += " (";
                text += (Number.parseFloat(score) >= Number.parseFloat(oponent_score)) ? "+" : "";
                text += Number.parseFloat(score - oponent_score).toFixed(2) + ")\n";

                text += "Carry Gold           │ " + Number.parseFloat(carry_gold).toFixed(2) + " ".repeat(8 - Number.parseFloat(carry_gold).toFixed(2).length);
                text += (Number.parseFloat(carry_gold) >= Number.parseFloat(oponent_carry_gold)) ? " ▲ " : " ▼ ";
                text += Number.parseFloat(oponent_carry_gold).toFixed(2) + " ".repeat(7 - Number.parseFloat(oponent_carry_gold).toFixed(2).length);
                text += " (";
                text += (Number.parseFloat(carry_gold) >= Number.parseFloat(oponent_carry_gold)) ? "+" : "";
                text += Number.parseFloat(carry_gold - oponent_carry_gold).toFixed(2) + ")\n";

                text += "Carry Damage         │ " + Number.parseFloat(carry_damage).toFixed(2) + " ".repeat(8 - Number.parseFloat(carry_damage).toFixed(2).length);
                text += (Number.parseFloat(carry_damage) >= Number.parseFloat(oponent_carry_damage)) ? " ▲ " : " ▼ ";
                text += Number.parseFloat(oponent_carry_damage).toFixed(2) + " ".repeat(7 - Number.parseFloat(oponent_carry_damage).toFixed(2).length);
                text += " (";
                text += (Number.parseFloat(carry_damage) >= Number.parseFloat(oponent_carry_damage)) ? "+" : "";
                text += Number.parseFloat(carry_damage - oponent_carry_damage).toFixed(2) + ")\n";

                text += "Carry Tanked         │ " + Number.parseFloat(carry_tanked).toFixed(2) + " ".repeat(8 - Number.parseFloat(carry_tanked).toFixed(2).length);
                text += (Number.parseFloat(carry_tanked) >= Number.parseFloat(oponent_carry_tanked)) ? " ▲ " : " ▼ ";
                text += Number.parseFloat(oponent_carry_tanked).toFixed(2) + " ".repeat(7 - Number.parseFloat(oponent_carry_tanked).toFixed(2).length);
                text += " (";
                text += (Number.parseFloat(carry_tanked) >= Number.parseFloat(oponent_carry_tanked)) ? "+" : "";
                text += Number.parseFloat(carry_tanked - oponent_carry_tanked).toFixed(2) + ")\n";

                text += "Hard Carry           │ " + Number.parseFloat(hard_carry).toFixed(2) + " ".repeat(8 - Number.parseFloat(hard_carry).toFixed(2).length);
                text += (Number.parseFloat(hard_carry) >= Number.parseFloat(oponent_hard_carry)) ? " ▲ " : " ▼ ";
                text += Number.parseFloat(oponent_hard_carry).toFixed(2) + " ".repeat(7 - Number.parseFloat(oponent_hard_carry).toFixed(2).length);
                text += " (";
                text += (Number.parseFloat(hard_carry) >= Number.parseFloat(oponent_hard_carry)) ? "+" : "";
                text += Number.parseFloat(hard_carry - oponent_hard_carry).toFixed(2) + ")\n";

                text += "Overall Carry        │ " + Number.parseFloat(overall).toFixed(2) + " ".repeat(8 - Number.parseFloat(overall).toFixed(2).length);
                text += (Number.parseFloat(overall) >= Number.parseFloat(oponent_overall)) ? " ▲ " : " ▼ ";
                text += Number.parseFloat(oponent_overall).toFixed(2) + " ".repeat(7 - Number.parseFloat(oponent_overall).toFixed(2).length);
                text += " (";
                text += (Number.parseFloat(overall) >= Number.parseFloat(oponent_overall)) ? "+" : "";
                text += Number.parseFloat(overall - oponent_overall).toFixed(2) + ")\n";

                text += "```";

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
                            name: "Comparaison :",
                            value: text
                        }
                    );

                await interaction.editReply({ embeds: [embed] });

            }
        } else if (interaction.options.getSubcommandGroup() === "top") {
            if (interaction.options.getSubcommand() === "carry") {
                let i = 1;

                const query_values = [];

                let query2 = "";
                if (champion !== null) {
                    query2 += " AND matchs.champion=$" + i;
                    query_values.push(champion);
                    i++;
                }

                let queryrole = "";
                if (role !== null) {
                    queryrole = " AND matchs.lane=$" + i;
                    query_values.push(role);
                    i++;
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
                let response = await client.pg.query(query, query_values);

                let general = "";
                if (response.rows.length === 0) {
                    general = "There are not enought summoners in the database or the filters are too restrictings.";
                } else {
                    for (const x of response.rows) {
                        general += "- <@" + x.discordid + "> : " + x.carry.toFixed(decimal) + " % (" + x.count + " matchs)\n";
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
                response = await client.pg.query(query, query_values);

                let damages = "";
                if (response.rows.length === 0) {
                    damages = "There are not enought summoners in the database or the filters are too restrictings.";
                } else {
                    for (const x of response.rows) {
                        damages += "- <@" + x.discordid + "> : " + x.damage.toFixed(decimal) + " % (" + x.count + " matchs)\n";
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
                response = await client.pg.query(query, query_values);

                let tanked = "";
                if (response.rows.length === 0) {
                    tanked = "There are not enought summoners in the database or the filters are too restrictings.";
                } else {
                    for (const x of response.rows) {
                        tanked += "- <@" + x.discordid + "> : " + x.tanked.toFixed(decimal) + " % (" + x.count + " matchs)\n";
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
                response = await client.pg.query(query, query_values);

                let gold = "";
                if (response.rows.length === 0) {
                    gold = "There are not enought summoners in the database or the filters are too restrictings.";
                } else {
                    for (const x of response.rows) {
                        gold += "- <@" + x.discordid + "> : " + x.gold.toFixed(decimal) + " % (" + x.count + " matchs)\n";
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
                response = await client.pg.query(query, query_values);
                let hard = "";
                if (response.rows.length === 0) {
                    hard = "There are not enought summoners in the database or the filters are too restrictings.";
                } else {
                    for (const x of response.rows) {
                        hard += "- <@" + x.discordid + "> : " + x.hardcarry.toFixed(decimal) + " % (" + x.count + " matchs)\n";
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
                let i = 1;
                const query_values = [];

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
                if (champion !== null) {
                    query2 += " AND matchs.champion=$" + i;
                    query_values.push(champion);
                    i++;
                }

                let queryrole = "";
                if (role !== null) {
                    queryrole = " AND matchs.lane=$" + i;
                    query_values.push(role);
                    i++;
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
                const response = await client.pg.query(query4, query_values);

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
        } else if (interaction.options.getSubcommandGroup() === "tracker") {
            // permission verification
            if (!interaction.member.permissions.has("ADMINISTRATOR")) {
                return await interaction.editReply("You don't have the permission to use this command !");
            }
            if (interaction.options.getSubcommand() === "add") {
                const channel = interaction.options.getChannel("channel");
                const response = await client.pg.query("SELECT * FROM trackers WHERE guildid=$1;", [channel.guild.id]);
                if (response.rowCount !== 0) {
                    return await interaction.editReply("A tracker channel already exists in this guild !");
                }
                const query = "INSERT INTO trackers (channelid, guildid) VALUES ($1, $2);";
                client.trackers.push(channel.id);
                await client.pg.query(query, [channel.id, channel.guild.id]);
                return await interaction.editReply("tracker channel added !");
            } else if (interaction.options.getSubcommand() === "remove") {
                const channel = interaction.options.getChannel("channel");
                const response = await client.pg.query("SELECT * FROM trackers WHERE channelid=$1;", [channel.id]);
                if (response.rowCount === 0) {
                    return await interaction.editReply("This channel is currently not a tracker channel !");
                }
                const query = "DELETE FROM trackers WHERE channelid=$1;";
                client.trackers.splice(client.trackers.indexOf(channel.id), 1);
                await client.pg.query(query, [channel.id]);
                return await interaction.editReply("tracker channel removed !");
            }
        }
    },
    async autocomplete(client, interaction) {
        const focusedValue = interaction.options.getFocused().replaceAll("'", "");
        const query = "SELECT DISTINCT champion " +
            "FROM matchs " +
            "WHERE lower(champion) LIKE '" + focusedValue.toLowerCase() + "%'" +
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
    add_summoner_manual

};

async function addSumoner(client, name, interaction, region) {
    client.requests["summoners"].push({ "username": name, "discordid": interaction.user.id, "interaction": interaction, "region": region });
    await client.lol();
}

async function add_summoner_manual(client, name, discordid, region) {
    client.requests["summoners"].push({ "username": name, "discordid": discordid, "interaction": undefined, "region": region });
    await client.lol();
}