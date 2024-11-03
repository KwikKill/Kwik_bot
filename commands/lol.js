const { EmbedBuilder, AttachmentBuilder, PermissionsBitField, ApplicationCommandOptionType, ChannelType } = require('discord.js');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const logger = require('../util/logger');

const decimal = 2;
const tiers = ["unranked", "IRON", "BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND", "MASTER", "GRANDMASTER", "CHALLENGER"];
const rank = ["IV", "III", "II", "I"];

module.exports = {
    name: 'lol',
    group: 'lol',
    description: "league of legends related commands",
    hidden: false,
    place: "both",
    options: [
        {
            name: 'account',
            description: 'Manage your lol accounts',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: 'add',
                    description: 'link a lol pseudo to your discord account',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'gamename',
                            description: 'GameName of the account',
                            type: ApplicationCommandOptionType.String,
                            required: true,
                        },
                        {
                            name: 'tagline',
                            description: 'TagLine of the account',
                            type: ApplicationCommandOptionType.String,
                            required: true,
                        },
                        {
                            name: 'region',
                            description: 'Region of the account',
                            type: ApplicationCommandOptionType.String,
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
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'gamename',
                            description: 'GameName of the account',
                            type: ApplicationCommandOptionType.String,
                            required: true,
                        },
                        {
                            name: 'tagline',
                            description: 'TagLine of the account',
                            type: ApplicationCommandOptionType.String,
                            required: true,
                        },
                    ]
                },
                {
                    name: 'list',
                    description: 'List lol accounts',
                    type: ApplicationCommandOptionType.Subcommand,
                },
            ]
        },
        /*{
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
        },*/
        {
            name: 'stats',
            description: 'lol stat commands',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: 'summarized',
                    description: 'See summarized stats',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'discordaccount',
                            description: 'Discord account',
                            type: ApplicationCommandOptionType.User,
                        },
                        {
                            name: 'champion',
                            description: 'Champion',
                            type: ApplicationCommandOptionType.String,
                            autocomplete: true,
                        },
                        {
                            name: 'lane',
                            description: 'Lane',
                            type: ApplicationCommandOptionType.String,
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
                            type: ApplicationCommandOptionType.String,
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
                            description: 'account (gamename#tagline)',
                            type: ApplicationCommandOptionType.String
                        },
                        {
                            name: 'season',
                            description: 'Season',
                            type: ApplicationCommandOptionType.String,
                        }
                    ]
                },
                {
                    name: 'profile',
                    description: 'See profile stats',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'discordaccount',
                            description: 'Discord account',
                            type: ApplicationCommandOptionType.User,
                        }
                    ]
                },
                /*{
                    name: 'friends',
                    description: 'See friends stats',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'discordaccount',
                            description: 'Discord account',
                            type: ApplicationCommandOptionType.User,
                        },
                        {
                            name: 'champion',
                            description: 'Champion',
                            type: ApplicationCommandOptionType.String,
                            autocomplete: true,
                        },
                        {
                            name: 'lane',
                            description: 'Lane',
                            type: ApplicationCommandOptionType.String,
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
                            type: ApplicationCommandOptionType.String,
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
                            type: ApplicationCommandOptionType.String
                        },
                    ]
                },*/
                {
                    name: 'matchups',
                    description: 'See matchups stats',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'discordaccount',
                            description: 'Discord account',
                            type: ApplicationCommandOptionType.User,
                        },
                        {
                            name: 'champion',
                            description: 'Champion',
                            type: ApplicationCommandOptionType.String,
                            autocomplete: true,
                        },
                        {
                            name: 'lane',
                            description: 'Lane',
                            type: ApplicationCommandOptionType.String,
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
                            type: ApplicationCommandOptionType.String,
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
                            description: 'account (gamename#tagline)',
                            type: ApplicationCommandOptionType.String
                        },
                        {
                            name: 'season',
                            description: 'Season',
                            type: ApplicationCommandOptionType.String,
                        }
                    ]
                },
                {
                    name: 'champions',
                    description: 'See champions stats',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'discordaccount',
                            description: 'Discord account',
                            type: ApplicationCommandOptionType.User,
                        },
                        {
                            name: 'lane',
                            description: 'Lane',
                            type: ApplicationCommandOptionType.String,
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
                            type: ApplicationCommandOptionType.String,
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
                            description: 'account (gamename#tagline)',
                            type: ApplicationCommandOptionType.String
                        },
                        {
                            name: 'season',
                            description: 'Season',
                            type: ApplicationCommandOptionType.String,
                        }
                    ]
                },
                {
                    name: 'compare',
                    description: 'compare your stats to another player',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'discordaccount',
                            description: 'Discord account',
                            type: ApplicationCommandOptionType.User,
                            required: true
                        },
                        {
                            name: 'champion',
                            description: 'Champion',
                            type: ApplicationCommandOptionType.String,
                            autocomplete: true,
                        },
                        {
                            name: 'lane',
                            description: 'Lane',
                            type: ApplicationCommandOptionType.String,
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
                            type: ApplicationCommandOptionType.String,
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
                            name: 'season',
                            description: 'Season',
                            type: ApplicationCommandOptionType.String,
                        }
                    ]
                },
                {
                    name: 'evolution',
                    description: 'See evolution graphs',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'discordaccount',
                            description: 'Discord account',
                            type: ApplicationCommandOptionType.User,
                        },
                        {
                            name: 'champion',
                            description: 'Champion',
                            type: ApplicationCommandOptionType.String,
                            autocomplete: true,
                        },
                        {
                            name: 'lane',
                            description: 'Lane',
                            type: ApplicationCommandOptionType.String,
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
                            type: ApplicationCommandOptionType.String,
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
                            description: 'account (gamename#tagline)',
                            type: ApplicationCommandOptionType.String
                        },
                        {
                            name: 'season',
                            description: 'Season',
                            type: ApplicationCommandOptionType.String,
                        }
                    ]
                },
                /*{
                    name: 'match',
                    description: 'See matchs stats',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'id',
                            description: 'Game\'s ID',
                            type: ApplicationCommandOptionType.String
                        },
                        {
                            name: 'account',
                            description: 'account',
                            type: ApplicationCommandOptionType.String
                        },
                        {
                            name: 'gamemode',
                            description: 'GameMode',
                            type: ApplicationCommandOptionType.String,
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
                            type: ApplicationCommandOptionType.String,
                            autocomplete: true,
                        },
                        {
                            name: 'lane',
                            description: 'Lane',
                            type: ApplicationCommandOptionType.String,
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
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: 'carry',
                    description: 'ranking carry commands',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'champion',
                            description: 'Champion',
                            type: ApplicationCommandOptionType.String,
                            autocomplete: true,
                        },
                        {
                            name: 'lane',
                            description: 'Lane',
                            type: ApplicationCommandOptionType.String,
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
                            type: ApplicationCommandOptionType.Boolean
                        },
                        {
                            name: 'season',
                            description: 'Season',
                            type: ApplicationCommandOptionType.String,
                        }
                    ]
                },
                {
                    name: 'kwikscore',
                    description: 'ranking kwikscore commands',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'champion',
                            description: 'Champion',
                            type: ApplicationCommandOptionType.String,
                            autocomplete: true,
                        },
                        {
                            name: 'lane',
                            description: 'Lane',
                            type: ApplicationCommandOptionType.String,
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
                            type: ApplicationCommandOptionType.Boolean
                        },
                        {
                            name: 'season',
                            description: 'Season',
                            type: ApplicationCommandOptionType.String,
                        }
                    ]
                }
            ]
        },
        {
            name: 'tracker',
            description: 'tracker command',
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: 'add',
                    description: 'add a tracker channel',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'channel',
                            description: 'Channel',
                            type: ApplicationCommandOptionType.Channel,
                            required: true
                        }
                    ]
                },
                {
                    name: 'remove',
                    description: 'add a tracker channel',
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: 'channel',
                            description: 'Channel',
                            type: ApplicationCommandOptionType.Channel,
                            required: true
                        }
                    ]
                }
            ]
        }
    ],
    integration_types: [0, 1],
    commande_channel: true,
    async run(message, client, interaction = undefined) {
        if (interaction === undefined) {
            return;
        }
        await interaction.deferReply();
        const gamename = interaction.options.getString("gamename");
        const tagline = interaction.options.getString("tagline");

        // Check if the gamename and tagline are valid
        if ((gamename && gamename.includes("#")) || (tagline && tagline.includes("#"))) {
            return await interaction.editReply("Gamename and tagline should not contain '#', please use the format `gamename#tagline` without providing the #");
        }

        const region = interaction.options.getString("region");
        const champion = interaction.options.getString("champion");
        const role = interaction.options.getString("lane");
        const gamemode = interaction.options.getString("gamemode");
        let account = interaction.options.getString("account");
        if (account) {
            if (!account.includes("#") || account.split("#").length !== 2) {
                return await interaction.editReply("Please use the format `gamename#tagline` for the account name.");
            }
            account = account.split("#");
        }
        //const puuid = interaction.options.getString("id");
        const discordaccount = interaction.options.getUser("discordaccount");
        const season = interaction.options.getString("season");

        if (interaction.options.getSubcommandGroup() === "account") {
            if (interaction.options.getSubcommand() === "add") {
                account_add(client, interaction, gamename, tagline, region);
            } else if (interaction.options.getSubcommand() === "remove") {
                account_remove(client, interaction, gamename, tagline);
            } else if (interaction.options.getSubcommand() === "list") {
                account_list(client, interaction);
            }
        } else if (interaction.options.getSubcommandGroup() === "queue") {
            // Deprecated warning
            return await interaction.editReply("Due to recent improvements, this command is deprecated and will be removed in the next update.");
            /*if (interaction.options.getSubcommand() === "status") {
                queue(client, interaction);
            }*/
        } else if (interaction.options.getSubcommandGroup() === "stats") {
            if (interaction.options.getSubcommand() === "summarized") {
                stats_summarized(client, interaction, discordaccount, champion, role, account, season, gamemode);
            } else if (interaction.options.getSubcommand() === "matchups") {
                stats_matchups(client, interaction, discordaccount, champion, role, account, season, gamemode);
            } else if (interaction.options.getSubcommand() === "champions") {
                stats_champions(client, interaction, discordaccount, role, account, season, gamemode);
            } else if (interaction.options.getSubcommand() === "evolution") {
                stats_evolution(client, interaction, discordaccount, champion, role, account, season, gamemode);
            } else if (interaction.options.getSubcommand() === "profile") {
                stats_profile(client, interaction, discordaccount);
            } else if (interaction.options.getSubcommand() === "compare") {
                stats_compare(client, interaction, discordaccount, champion, role, season, gamemode);
            }
        } else if (interaction.options.getSubcommandGroup() === "top") {
            if (interaction.options.getSubcommand() === "carry") {
                top_carry(client, interaction, champion, role, account, season, gamemode);
            } else if (interaction.options.getSubcommand() === "kwikscore") {
                top_kwikscore(client, interaction, champion, role, account, season, gamemode);
            }
        } else if (interaction.options.getSubcommandGroup() === "tracker") {
            // If the interaction is a user installed command
            if (!interaction.guild) {
                return await interaction.editReply("This command can only be used in a guild.\n If you use it in a DM or with the user installed command, please install the app in a guild.");
            }
            // If the user has Manage channel permission or administrator permission
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels) && !interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
                return await interaction.editReply("You don't have the permission to use this command !");
            }
            // If the channel provided is not a text channel
            if (interaction.options.getChannel("channel").type !== ChannelType.GuildText) {
                return await interaction.editReply("Please provide a valid text channel !");
            }
            // If the channel does not belong to the guild
            if (interaction.options.getChannel("channel").guild.id !== interaction.guild.id) {
                return await interaction.editReply("Please provide a valid text channel in this guild !");
            }
            if (interaction.options.getSubcommand() === "add") {
                tracker_add(client, interaction);
            } else if (interaction.options.getSubcommand() === "remove") {
                tracker_remove(client, interaction);
            }
        }
    },
    async autocomplete(client, interaction) {
        const focusedValue = interaction.options.getFocused();
        const champs = [];
        for (const x of client.champions) {
            if (x.toLowerCase().startsWith(focusedValue.toLowerCase()) && champs.length < 25) {
                champs.push({
                    name: x,
                    value: x
                });
            }
        }
        return await interaction.respond(champs);
    },
    addSumoner,
    add_summoner_manual

};

// ---------------------------- SUMMONER FUNCTIONS ----------------------------

/**
 * Add a summoner to the database
 * @function addSumoner
 * @param {Client} client - bot's client
 * @param {String} name - summoner's username
 * @param {Interaction} interaction - command's interaction
 * @param {String} region - summoner's region
 * @returns {Promise<void>}
 */
async function addSumoner(client, gamename, tagline, interaction, region) {
    const route = client.lol.reverse_routes[region];

    client.lol.services[route]["queue"]["summoners"].push({ "gamename": gamename, "tagline": tagline, "discordid": interaction.user.id, "interaction": interaction, "region": region, "priority": 0, "first": true });
    await client.lol.main();
}

/**
 * Add a summoner to the database
 * @function add_summoner_manual
 * @param {Client} client - bot's client
 * @param {String} name - summoner's username
 * @param {String} discordid - summoner's discord id
 * @param {String} region - summoner's region
 * @param {Number} priority - summoner's priority
 * @returns {Promise<void>}
 */
async function add_summoner_manual(client, gamename, tagline, discordid, region, priority = 0) {
    const route = client.lol.reverse_routes[region];

    client.lol.services[route]["queue"]["summoners"].push({ "gamename": gamename, "tagline": tagline, "discordid": discordid, "interaction": undefined, "region": region, "priority": priority, "first": true });
    await client.lol.main();
}

// ---------------------------- ACCOUNT FUNCTIONS ----------------------------

/**
 * Add a summoner to the database
 * @function account_add
 * @param {Client} client - bot's client
 * @param {Interaction} interaction - command's interaction
 * @param {String} gamename - summoner's username
 * @param {String} tagline - summoner's tagline
 * @param {String} region - summoner's region
 */
async function account_add(client, interaction, gamename, tagline, region) {
    client.pg.query({
        name: "insert-logs",
        text: "INSERT INTO logs (date, discordid, command, args, serverid) VALUES ($1, $2, $3, $4, $5)",
        values: [
            new Date(),
            interaction.user.id,
            "lol/account/add",
            JSON.stringify({
                gamename: gamename,
                tagline: tagline,
                region: region
            }),
            interaction.guild ? interaction.guild.id : interaction.user.id
        ]
    });
    const route = client.lol.reverse_routes[region];

    const response = await client.pg.query("SELECT * FROM summoners where discordid=$1 AND gamename=$2 AND tagline=$3 AND region=$4;", [interaction.user.id, gamename, tagline, region]);
    if (!client.lol.services[route]["queue"]["summoners"].includes({ "gamename": gamename, "tagline": tagline, "discordid": interaction.user.id, "region": region }) && response.rows.length === 0) {
        const response2 = await client.pg.query("SELECT * FROM summoners where discordid=$1;", [interaction.user.id]);
        let number = response2.rows.length;
        for (let i = 0; i < client.lol.services[route]["queue"]["summoners"].length; i++) {
            if (client.lol.services[route]["queue"]["summoners"][i].discordid === interaction.user.id) {
                number++;
            }
        }
        const priority = await client.pg.query("SELECT priority FROM summoners WHERE discordid = $1;", [interaction.user.id]);
        if (number === 0 || priority.rows[0].priority === 0) {
            if (number === 0) {
                await interaction.editReply("The request was added to the queue, this can take several minutes. Once your account is in the database, please wait while the matchs are added. This can take several hours.");
                return await addSumoner(client, gamename, tagline, interaction, region);
            }
            return await interaction.editReply("You have reached your maximum number of linked accounts. If you want to unlock more accounts slots by supporting me, you can contact me on discord : **kwikkill**");
        }
        if (number < 3 || priority.rows[0].priority === 10) {
            await interaction.editReply("The request was added to the queue, this can take several minutes. Once your account is in the database, please wait while the matchs are added. This can take several hours.");
            return await addSumoner(client, gamename, tagline, interaction, region);
        }
        return await interaction.editReply("You have reached your maximum number of linked accounts for a premium user. If you want to unlock even more accounts slots, you can contact me on discord : **kwikkill**");
    }
    return await interaction.editReply("This account is already in the database or requested.");
}

/**
 * Remove a summoner from the database
 * @function account_remove
 * @param {Client} client - bot's client
 * @param {Interaction} interaction - command's interaction
 * @param {String} gamename - summoner's username
 * @param {String} tagline - summoner's tagline
 */
async function account_remove(client, interaction, gamename, tagline) {
    client.pg.query({
        name: "insert-logs",
        text: "INSERT INTO logs (date, discordid, command, args, serverid) VALUES ($1, $2, $3, $4, $5)",
        values: [
            new Date(),
            interaction.user.id,
            "lol/account/remove",
            JSON.stringify({
                gamename: gamename,
                tagline: tagline
            }),
            interaction.guild ? interaction.guild.id : interaction.user.id
        ]
    });
    const response = await client.pg.query("SELECT * FROM summoners where discordid=$1 AND gamename=$2 AND tagline=$3;", [interaction.user.id, gamename, tagline]);
    if (response.rows.length > 0) {
        await client.pg.query({
            name: "remove_account",
            text: "DELETE FROM summoners " +
                "WHERE discordid=$1 " +
                "AND gamename=$2 " +
                "AND tagline=$3" +
                ";",
            values: [interaction.user.id, gamename, tagline]
        });
        return await interaction.editReply("The account has been removed.");
    }
    return await interaction.editReply("This account is not in the database.");
}

/**
 * List all summoners linked to a discord account
 * @function account_list
 * @param {Client} client - bot's client
 * @param {Interaction} interaction - command's interaction
 */
async function account_list(client, interaction) {
    client.pg.query({
        name: "insert-logs",
        text: "INSERT INTO logs (date, discordid, command, args, serverid) VALUES ($1, $2, $3, $4, $5)",
        values: [
            new Date(),
            interaction.user.id,
            "lol/account/list",
            JSON.stringify({}),
            interaction.guild ? interaction.guild.id : interaction.user.id
        ],
    });
    const response = await client.pg.query("SELECT * FROM summoners where discordid=$1;", [interaction.user.id]);
    if (response.rows.length === 0) {
        return await interaction.editReply("You don't have any account linked. Please use the command `/lol account add <name>` to add an account.");
    }
    const embed = new EmbedBuilder()
        .setTitle("Your accounts")
        .setColor("#00FF00")
        .setFooter({
            text: "Requested by " + interaction.user.username,
            //iconURL: interaction.user.displayAvatarURL()
        })
        .setTimestamp();
    let accounts = "";
    for (let i = 0; i < response.rows.length; i++) {
        accounts += "-" + response.rows[i].gamename + "#" + response.rows[i].tagline + "\n";
    }
    embed.addFields(
        {
            name: "Linked Accounts :",
            value: accounts
        }
    );

    return await interaction.editReply({ embeds: [embed] });
}

// ---------------------------- QUEUE FUNCTIONS ----------------------------

/**
 * send queue status
 * @function queue
 * @param {Client} client - bot's client
 * @param {Interaction} interaction - command's interaction
 */
async function queue(client, interaction) {
    client.pg.query({
        name: "insert-logs",
        text: "INSERT INTO logs (date, discordid, command, args, serverid) VALUES ($1, $2, $3, $4, $5)",
        values: [
            new Date(),
            interaction.user.id,
            "lol/queue",
            JSON.stringify({}),
            interaction.guild ? interaction.guild.id : interaction.user.id
        ]
    });
    const embed = new EmbedBuilder()
        .setTitle("Queue status")
        .setColor("#00FF00")
        .setFooter({
            text: "Requested by " + interaction.user.username,
            //iconURL: interaction.user.displayAvatarURL()
        })
        .setTimestamp();
    let step = "";

    const queue = {
        "summoners": [],
        "updates": [],
        "add": []
    };

    for(const route in client.lol.services) {
        for (let i = 0; i < client.lol.services[route]["queue"]["summoners"].length; i++) {
            queue["summoners"].push(client.lol.services[route]["queue"]["summoners"][i]);
        }
        for (let i = 0; i < client.lol.services[route]["queue"]["updates"].length; i++) {
            queue["updates"].push(client.lol.services[route]["queue"]["updates"][i]);
        }
        for (let i = 0; i < client.lol.services[route]["queue"]["add"].length; i++) {
            queue["add"].push(client.lol.services[route]["queue"]["add"][i]);
        }
    }


    if (queue["updates"].length > 0) {
        if (queue["updates"][0]["count"] === 0) {
            step = //"- Step : 1/2 (Fetching game list)" +
                "- Current : <@" + queue["updates"][0]["discordid"] + "> (" + queue["updates"][0]["gamename"] + "#" + queue["updates"][0]["tagline"] + ") : Fetching match list";
        } else {
            step = //"- Step : 2/2 (Fetching matchs details)\n" +
                "- Current : <@" + queue["updates"][0]["discordid"] + "> (" + queue["updates"][0]["gamename"] + "#" + queue["updates"][0]["tagline"] + ") : " + queue["updates"][0]["count"] + "/" + queue["updates"][0]["total"] + " matchs";
        }
        embed.addFields(
            {
                name: "Queued updates :",
                value: "- size : " + queue["updates"].length + " Summoners\n" +
                    step + "\n"
            }
        );
        const pos = [];
        for (let i = 1; i < queue["updates"].length; i++) {
            if (queue["updates"][i]["discordid"] === interaction.user.id) {
                pos.push([i, queue["updates"][i]["gamename"] + "#" + queue["updates"][i]["tagline"]]);
                break;
            }
        }
        let text = "";
        for (let i = 0; i < pos.length; i++) {
            text += "- " + pos[i][1] + " : " + pos[i][0] + "/" + queue["updates"].length + "\n";
        }
        if (text !== "") {
            embed.addFields(
                {
                    name: "Your position in the queue :",
                    value: "" + text
                }
            );
        }
    } else {
        embed.addFields(
            {
                name: "Updates in queue :",
                value: "- 0 Matchs\n"
            }
        );
    }
    /*if (interaction.user.id === "297409548703105035") {
        embed.addFields(
            {
                name: "Api limit reached :",
                value: "" + client.lol.api_limit
            }
        );
    }*/
    return await interaction.editReply({ embeds: [embed] });
}

// ---------------------------- STATS FUNCTIONS ----------------------------

/**
 * send stats summarized message
 * @function stats_summarized
 * @param {Client} client - bot's client
 * @param {Interaction} interaction - command's interaction
 * @param {User} discordaccount - discord account to get stats from
 * @param {String} champion - champion to get stats from
 * @param {String} role - role to get stats from
 * @param {String} account - account to get stats from
 * @param {String} season - season to get stats from
 * @param {String} gamemode - gamemode to get stats from
 */
async function stats_summarized(client, interaction, discordaccount, champion, role, account, season, gamemode) {
    client.pg.query({
        name: "insert-logs",
        text: "INSERT INTO logs (date, discordid, command, args, serverid) VALUES ($1, $2, $3, $4, $5)",
        values: [
            new Date(),
            interaction.user.id,
            "lol/stats/summarized",
            JSON.stringify({
                discordaccount: discordaccount?.id,
                champion: champion,
                role: role,
                account: account ? account[0] + "#" + account[1] : null,
                season: season,
                gamemode: gamemode
            }),
            interaction.guild ? interaction.guild.id : interaction.user.id
        ]
    });
    try {
        const start = Date.now();
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
        const query_values2 = [discordaccount];

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
            "SUM(CASE WHEN (first_gold OR first_damages OR first_tanked) THEN 1 ELSE 0 END)*100.0 / count(*) as carry, " +
            "SUM(CASE WHEN first_gold THEN 1 ELSE 0 END)*100.0 / count(*) as carry_gold, " +
            "SUM(CASE WHEN first_damages THEN 1 ELSE 0 END)*100.0 / count(*) as carry_damage, " +
            "SUM(CASE WHEN first_tanked THEN 1 ELSE 0 END)*100.0 / count(*) as carry_tanked, " +
            "SUM(CASE WHEN (first_gold AND first_damages AND first_tanked) THEN 1 ELSE 0 END)*100.0 / count(*) as hard_carry, " +
            "SUM(CASE WHEN result = 'Win' THEN 1 ELSE 0 END)*100.0 /  count(*) as win_rate, " +
            "avg(score) as delta " +
            "FROM summoners LEFT JOIN (matchs LEFT JOIN score_delta ON score_delta.champion = matchs.champion) ON matchs.player = summoners.puuid";

        let query3 = "SELECT " +
            "gamemode, " +
            "count(gamemode) " +
            "FROM matchs, summoners " +
            "WHERE summoners.discordid=$1 AND matchs.player = summoners.puuid";

        i++;
        if (champion !== null) {
            query += " AND lower(matchs.champion)=$" + i;
            query3 += " AND lower(matchs.champion)=$" + i;
            query_values.push(champion.toLowerCase());
            query_values2.push(champion.toLowerCase());
            i++;
        }
        if (role !== null) {
            query += " AND matchs.lane=$" + i;
            query3 += " AND matchs.lane=$" + i;
            query_values.push(role);
            query_values2.push(role);
            i++;
        }
        let test2 = "";
        if (account !== null) {
            test2 += " AND summoners.gamename=$" + i + " AND summoners.tagline=$" + (i + 1);
            query3 += " AND summoners.gamename=$" + i + " AND summoners.tagline=$" + (i + 1);
            query_values.push(account[0], account[1]);
            query_values2.push(account[0], account[1]);
            i += 2;
        }
        if (season !== null) {
            query += " AND patch LIKE $" + i;
            query3 += " AND patch LIKE $" + i;
            query_values.push(season + "%");
            query_values2.push(season + "%");
            i++;
        }
        if (gamemode !== null) {
            query += " AND matchs.gamemode=$" + i;
            query_values.push(gamemode);
            i++;
        }
        //query += ") ON matchs.player = summoners.puuid ";
        query += test2;
        query += " WHERE summoners.discordid=$1;";
        query3 += " GROUP BY gamemode;";

        const response = await client.pg.query({
            text: query,
            values: query_values
        });

        if (response.rows.length === 0) {
            return await interaction.editReply("You don't have any matchs in the database or the filters are too restrictings.");
        }

        const response3 = await client.pg.query(query3, query_values2);
        if (response3.rows.length === 0) {
            return await interaction.editReply("You don't have any matchs in the database or the filters are too restrictings.");
        }

        // plot

        const values = [];
        const labels = [];

        for (let i = 0; i < response3.rows.length; i++) {
            values.push(response3.rows[i].count);
            labels.push(response3.rows[i].gamemode);
        }

        const width = 800; //px
        const height = 600; //px
        const backgroundColour = 'white'; // Uses https://www.w3schools.com/tags/canvas_fillstyle.asp
        const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour });

        const configuration = {
            type: 'pie',
            data: {
                datasets: [{
                    label: 'Gamemodes played',
                    //borderColor: '#36A2EB',
                    //backgroundColor: '#9BD0F5',
                    backgroundColor: ["#0074D9", "#FF4136", "#2ECC40", "#FF851B", "#7FDBFF", "#B10DC9", "#FFDC00", "#001f3f", "#39CCCC", "#01FF70", "#85144b", "#F012BE", "#3D9970", "#111111", "#AAAAAA"],
                    data: values
                }],
                labels: labels
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Gamemodes played'
                    }
                }
            }, // See https://www.chartjs.org/docs/latest/configuration
        };
        const image = await chartJSNodeCanvas.renderToBuffer(configuration);
        const attachment = new AttachmentBuilder(image, { name: 'stats.png' });

        // 1) Carry stats

        const carry_damage = Number(response.rows[0].carry_damage);
        const carry_tanked = Number(response.rows[0].carry_tanked);
        const carry_gold = Number(response.rows[0].carry_gold);
        const overall = Number(response.rows[0].carry);
        const hard_carry = Number(response.rows[0].hard_carry);
        const win = Number(response.rows[0].win_rate);
        const delta = Number(response.rows[0].delta);

        // 2) Average stats

        const length = Number(response.rows[0].avg_length);

        const average_kills = Number.parseFloat(response.rows[0].avg_kills).toFixed(decimal);
        const average_deaths = Number.parseFloat(response.rows[0].avg_deaths).toFixed(decimal);
        const average_assists = Number.parseFloat(response.rows[0].avg_assists).toFixed(decimal);
        let average_cs = Number.parseFloat(response.rows[0].avg_cs).toFixed(decimal);
        let average_gold = Number(response.rows[0].avg_gold);
        let average_damages = Number(response.rows[0].avg_damage);
        let average_tanked = Number(response.rows[0].avg_tanked_damage);
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
        // If there is no delta, fallback on normal score
        if (delta > 0) {
            score *= delta;
        }
        if (100 - response.rows[0].games_played > 0) {
            score = score * 0.99 ** (100 - Number(response.rows[0].games_played));
        }

        let title = "" + discordusername + "'s stats";
        if (champion !== null) {
            title += " with " + champion;
        }
        if (role !== null) {
            title += " in " + role;
        }
        if (account !== null) {
            title += " on \"" + account[0] + "#" + account[1] + "\"";
        }
        const end = new Date();

        // send embed
        const embed = new EmbedBuilder()
            .setTitle(title)
            .setColor("#00FF00")
            .setFooter({
                text: "Requested by " + interaction.user.username + " | took " + (end - start) + "ms",
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
        ).setImage("attachment://stats.png");

        return await interaction.editReply({ embeds: [embed], files: [attachment] });
    } catch (e) {
        logger.error(e.stack);
        client.users.fetch(client.owners[0]).then((user) => {
            const params = {
                discordaccount: discordaccount?.id,
                champion: champion,
                role: role,
                account: account ? account[0] + "#" + account[1] : null,
                gamemode: gamemode
            };
            const Js = JSON.stringify(params);
            user.send("Error with command /lol stats summarized " + Js + " from user " + interaction.user.id);

        });
        return await interaction.editReply("Error while getting stats, this error has been reported to the bot owner and will be fixed as soon as possible.");
    }
}

/**
 * send matchup's stats
 * @function stats_matchups
 * @param {Client} client - bot's client
 * @param {Interaction} interaction - command's interaction
 * @param {User} discordaccount - discord account to get stats from
 * @param {String} champion - champion to get stats from
 * @param {String} role - role to get stats from
 * @param {String} account - account to get stats from
 * @param {String} season - season to get stats from
 * @param {String} gamemode - gamemode to get stats from
 */
async function stats_matchups(client, interaction, discordaccount, champion, role, account, season, gamemode) {
    client.pg.query({
        name: "insert-logs",
        text: "INSERT INTO logs (date, discordid, command, args, serverid) VALUES ($1, $2, $3, $4, $5)",
        values: [
            new Date(),
            interaction.user.id,
            "lol/stats/matchups",
            JSON.stringify({
                discordaccount: discordaccount?.id,
                champion: champion,
                role: role,
                account: account ? account[0] + "#" + account[1] : null,
                season: season,
                gamemode: gamemode
            }),
            interaction.guild ? interaction.guild.id : interaction.user.id
        ]
    });
    try {
        const start = new Date();
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

        let query = "SELECT m2.champion AS matchup," +
            "count(*) AS count1," +
            "(cast(count(*) FILTER (WHERE m1.result = 'Win')*100 as float)/count(*)) AS winrate," +
            "(cast(count(*) FILTER (WHERE (m1.first_tanked OR m1.first_gold OR m1.first_damages))*100 as float)/count(*)) AS carry " +
            "FROM summoners, matchs m1 INNER JOIN matchs m2 ON (m1.lane = m2.lane AND m1.lane <> 'Invalid' AND m1.puuid = m2.puuid AND m1.team_id <> m2.team_id)" +
            "WHERE summoners.discordid=$1 AND m1.player = summoners.puuid";
        i++;

        if (champion !== null) {
            query += " AND lower(m1.champion)=$" + i;
            query_values.push(champion.toLowerCase());
            i++;
        }
        if (role !== null) {
            query += " AND m1.lane=$" + i;
            query_values.push(role);
            i++;
        }
        if (gamemode !== null) {
            query += " AND m1.gamemode=$" + i;
            query_values.push(gamemode);
            i++;
        }
        if (account !== null) {
            query += " AND summoners.gamename=$" + i + " AND summoners.tagline=$" + (i + 1);
            query_values.push(account[0], account[1]);
            i += 2;
        }
        if (season !== null) {
            query += " AND m1.patch LIKE $" + i;
            query_values.push(season + "%");
            i++;
        }
        query += " GROUP BY m2.champion ORDER BY count1 DESC;";

        const response = await client.pg.query(query, query_values);
        if (response.rows.length === 0) {
            return await interaction.editReply("You don't have any matchs in the database or the filters are too restrictings.");
        }

        const values1 = [];
        const values2 = [];
        const champ = [];

        const max = 17;

        const data = [];
        for (let i = 0; i < response.rows.length; i++) {
            if (response.rows[i].count1 > 4 && response.rows[i].matchup !== "" && response.rows[i].matchup !== "Invalid") {
                data.push("- " + response.rows[i].matchup + " : " + response.rows[i].count1 + " matchs (" + response.rows[i].winrate.toFixed(1) + "% winrate, " + response.rows[i].carry.toFixed(1) + "% carry)\n");
                if (i < max) {
                    values1.push(response.rows[i].winrate);
                    values2.push(response.rows[i].carry);
                    champ.push(response.rows[i].matchup);
                }
            }
        }

        if (data.length === 0) {
            return await interaction.editReply("You must have played more than 4 games against a matchup.");
        }

        const width = 1000; //px
        const height = 400; //px
        const backgroundColour = 'white'; // Uses https://www.w3schools.com/tags/canvas_fillstyle.asp
        const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour });

        const configuration = {
            type: 'bar',
            data: {
                datasets: [{
                    label: 'WinRate per champion',
                    borderColor: '#36A2EB',
                    backgroundColor: '#9BD0F5',
                    data: values1
                },
                {
                    label: 'Carry per champion',
                    borderColor: '#FF6384',
                    backgroundColor: '#FFB1C1',
                    data: values2
                }],
                labels: champ
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Champions'
                    }
                }
            }, // See https://www.chartjs.org/docs/latest/configuration
        };
        const image = await chartJSNodeCanvas.renderToBuffer(configuration);
        const attachment = new AttachmentBuilder(image, { name: 'matchup.png' });

        let title = "" + discordusername + "'s matchups";
        if (champion !== null) {
            title += " with " + champion;
        }
        if (role !== null) {
            title += " in " + role;
        }
        if (account !== null) {
            title += " on \"" + account[0] + "#" + account[1] + "\"";
        }

        const end = new Date();

        // send embed
        const embed = new EmbedBuilder()
            .setTitle(title)
            .setColor("#00FF00")
            .setFooter({
                text: "Requested by " + interaction.user.username + " | took " + (end - start) + "ms",
                //iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp();
        embed.addFields(
            {
                name: "Number of matchups :",
                value: "" + response.rows.length
            },
        )
            .setImage("attachment://matchup.png");

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

        return await interaction.editReply({ embeds: [embed], files: [attachment] });
    } catch (e) {
        logger.error(e);
        client.users.fetch(client.owners[0]).then((user) => {
            const params = {
                discordaccount: discordaccount?.id,
                champion: champion,
                role: role,
                account: account ? account[0] + "#" + account[1] : null,
                gamemode: gamemode
            };
            const Js = JSON.stringify(params);
            user.send("Error with command /lol stats matchups " + Js + " from user " + interaction.user.id);

        });
        return await interaction.editReply("Error while getting stats, this error has been reported to the bot owner and will be fixed as soon as possible.");
    }
}

/**
 * send champion's stats
 * @function stats_champions
 * @param {Client} client - bot's client
 * @param {Interaction} interaction - command's interaction
 * @param {User} discordaccount - discord account to get stats from
 * @param {String} role - role to get stats from
 * @param {String} account - account to get stats from
 * @param {String} season - season to get stats from
 * @param {String} gamemode - gamemode to get stats from
 */
async function stats_champions(client, interaction, discordaccount, role, account, season, gamemode) {
    client.pg.query({
        name: "insert-logs",
        text: "INSERT INTO logs (date, discordid, command, args, serverid) VALUES ($1, $2, $3, $4, $5)",
        values: [
            new Date(),
            interaction.user.id,
            "lol/stats/champions",
            JSON.stringify({
                discordaccount: discordaccount?.id,
                role: role,
                account: account ? account[0] + "#" + account[1] : null,
                season: season,
                gamemode: gamemode
            }),
            interaction.guild ? interaction.guild.id : interaction.user.id
        ]
    });
    try {
        const start = new Date();
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
            query += " AND summoners.gamename=$" + i + " AND summoners.tagline=$" + (i + 1);
            query_values.push(account[0], account[1]);
            i += 2;
        }
        if (season !== null) {
            query += " AND patch LIKE $" + i;
            query_values.push(season + "%");
            i++;
        }
        query += " GROUP BY champion ORDER BY count(*) DESC;";

        const response = await client.pg.query(query, query_values);
        if (response.rows.length === 0) {
            return await interaction.editReply("You don't have any matchs in the database.");
        }

        const data1 = [];
        const data2 = [];
        const labels = [];
        for (let i = 0; i < response.rows.length; i++) {
            if (response.rows[i].count > 4 && response.rows[i].champion !== "" && response.rows[i].champion !== "Invalid") {
                data1.push(response.rows[i].winrate);
                data2.push(response.rows[i].carry);
                labels.push(response.rows[i].champion);
            }
        }



        const width = 1000; //px
        const height = 400; //px
        const backgroundColour = 'white'; // Uses https://www.w3schools.com/tags/canvas_fillstyle.asp
        const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height, backgroundColour });

        const configuration = {
            type: 'bar',
            data: {
                datasets: [{
                    label: 'WinRate per champion',
                    borderColor: '#36A2EB',
                    backgroundColor: '#9BD0F5',
                    data: data1
                },
                {
                    label: 'Carry per champion',
                    borderColor: '#FF6384',
                    backgroundColor: '#FFB1C1',
                    data: data2
                }],
                labels: labels
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Champions'
                    }
                }
            }, // See https://www.chartjs.org/docs/latest/configuration
        };
        const image = await chartJSNodeCanvas.renderToBuffer(configuration);
        const attachment = new AttachmentBuilder(image, { name: 'champion.png' });


        let title = "" + discordusername + "'s champions";
        if (role !== null) {
            title += " in " + role;
        }
        if (account !== null) {
            title += " on \"" + account[0] + "#" + account[1] + "\"";
        }

        const end = new Date();

        // send embed
        const embed = new EmbedBuilder()
            .setTitle(title)
            .setColor("#00FF00")
            .setFooter({
                text: "Requested by " + interaction.user.username + " | took " + (end - start) + "ms",
                //iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp()
            .addFields(
                {
                    name: "Number of champions :",
                    value: "" + response.rows.length
                },
            )
            .setImage("attachment://champion.png");



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
        return await interaction.editReply({ embeds: [embed], files: [attachment] });
    } catch (e) {
        logger.error(e);
        client.users.fetch(client.owners[0]).then((user) => {
            const params = {
                discordaccount: discordaccount?.id,
                role: role,
                account: account ? account[0] + "#" + account[1] : null,
                gamemode: gamemode
            };
            const Js = JSON.stringify(params);
            user.send("Error with command /lol stats champions " + Js + " from user " + interaction.user.id);

        });
        return await interaction.editReply("Error while getting stats, this error has been reported to the bot owner and will be fixed as soon as possible.");
    }
}

/**
 * send match stats
 * @function stats_match
 * @param {Client} client - bot's client
 * @param {Interaction} interaction - command's interaction
 * @param {User} discordaccount - discord account to get stats from
 * @param {String} champion - champion to get stats from
 * @param {String} role - role to get stats from
 * @param {String} account - account to get stats from
 * @param {String} season - season to get stats from
 * @param {String} gamemode - gamemode to get stats from
 *
async function stats_match(client, interaction, discordaccount, champion, role, account, season, gamemode) {
    if (puuid !== null) {
        const query = "SELECT * FROM matchs WHERE puuid=$1;";
        const response = await client.pg.query(query, [puuid]);
        if (response.rows.length === 0) {
            return await interaction.editReply("This match doesn't exist.");
        }
        const match = response.rows[0];
        logger.log(match);
    } else {
        //let queryaccount = ""
        if (account !== null) {
            //queryaccount = " AND summoners.account = '" + account + "' ";
        }

    }
}*/

/**
 * send friend stats
 * @function stats_friend
 * @param {Client} client - bot's client
 * @param {Interaction} interaction - command's interaction
 * @param {User} discordaccount - discord account to get stats from
 * @param {String} champion - champion to get stats from
 * @param {String} role - role to get stats from
 * @param {String} account - account to get stats from
 * @param {String} season - season to get stats from
 * @param {String} gamemode - gamemode to get stats from
 *
async function stats_friend(client, interaction, discordaccount, champion, role, account, season, gamemode) {
    let i = 1;

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
    logger.log(query);
    const response = await client.pg.query(query, query_values);
    if (response.rows.length === 0) {
        interaction.editReply("No data found for this account");
        return;
    }
    logger.log(response.rows);
}*/

/**
 * send evolution stats
 * @function stats_evolution
 * @param {Client} client - bot's client
 * @param {Interaction} interaction - command's interaction
 * @param {User} discordaccount - discord account to get stats from
 * @param {String} champion - champion to get stats from
 * @param {String} role - role to get stats from
 * @param {String} account - account to get stats from
 * @param {String} season - season to get stats from
 * @param {String} gamemode - gamemode to get stats from
 */
async function stats_evolution(client, interaction, discordaccount, champion, role, account, season, gamemode) {
    client.pg.query({
        name: "insert-logs",
        text: "INSERT INTO logs (date, discordid, command, args, serverid) VALUES ($1, $2, $3, $4, $5)",
        values: [
            new Date(),
            interaction.user.id,
            "lol/stats/evolution",
            JSON.stringify({
                discordaccount: discordaccount?.id,
                champion: champion,
                role: role,
                account: account ? account[0] + "#" + account[1] : null,
                season: season,
                gamemode: gamemode
            }),
            interaction.guild ? interaction.guild.id : interaction.user.id
        ]
    });

    try {
        const start = Date.now();
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
            queryaccount = " AND summoners.gamename = $" + i + " AND summoners.tagline = $" + (i + 1);
            query_values.push(account[0], account[1]);
            i += 2;
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
            querychamp = " AND lower(matchs.champion)=$" + i;
            query_values.push(champion.toLowerCase());
            i++;
        }

        let queryseason = "";
        if (season !== null) {
            queryseason = " AND patch LIKE $" + i;
            query_values.push(season + "%");
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
            "(CAST(SUM(kill + assists) AS FLOAT) / CASE WHEN AVG(total_kills) = 0 THEN 1 ELSE AVG(total_kills) END)/ Count(*) AS kill_participation, " +
            "SUM(vision_score) / (SUM(length / 60) * 20) AS vision_score_per_minute, " +
            "SUM(cs) / (SUM(length / 60)) AS cs_per_minute " +
            "FROM matchs, summoners " +
            "WHERE discordid = $1" +
            " AND matchs.player = summoners.puuid" +
            " AND (result = 'Win' OR result = 'Lose')" +
            " AND matchs.gamemode != 'STRAWBERRY'" +
            queryaccount +
            querygamemode +
            queryrole +
            querychamp +
            queryseason +
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
            labels.push(i);
            data.push(response.rows[i].score);
        }

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
                }],
                labels: labels
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Evolution'
                    }
                }
            }, // See https://www.chartjs.org/docs/latest/configuration
        };
        const image = await chartJSNodeCanvas.renderToBuffer(configuration);
        const attachment = new AttachmentBuilder(image, { name: 'ks.png' });

        const end = Date.now();

        // create embed
        const embed = new EmbedBuilder()
            .setTitle("" + discordusername + "'s ks")
            .setColor("#00FF00")
            .setFooter({
                text: "Requested by " + interaction.user.username + " | took " + (end - start) + "ms",
                //iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp()
            .addFields(
                {
                    name: "Number of weeks played :",
                    value: "" + response.rows.length
                },
            )
            .setImage("attachment://ks.png");

        interaction.editReply({ embeds: [embed], files: [attachment] });
    } catch (e) {
        logger.error(e);
        client.users.fetch(client.owners[0]).then((user) => {
            const params = {
                discordaccount: discordaccount?.id,
                role: role,
                champion: champion,
                account: account ? account[0] + "#" + account[1] : null,
                gamemode: gamemode
            };
            const Js = JSON.stringify(params);
            user.send("Error with command /lol stats evolution " + Js + " from user " + interaction.user.id);

        });
        return await interaction.editReply("Error while getting stats, this error has been reported to the bot owner and will be fixed as soon as possible.");
    }
}

/**
 * send profile stats
 * @function stats_profile
 * @param {Client} client - bot's client
 * @param {Interaction} interaction - command's interaction
 * @param {User} discordaccount - discord account to get stats from
 */
async function stats_profile(client, interaction, discordaccount) {
    client.pg.query({
        name: "insert-logs",
        text: "INSERT INTO logs (date, discordid, command, args, serverid) VALUES ($1, $2, $3, $4, $5)",
        values: [
            new Date(),
            interaction.user.id,
            "lol/stats/profile",
            JSON.stringify({
                discordaccount: discordaccount?.id
            }),
            interaction.guild ? interaction.guild.id : interaction.user.id
        ]
    });
    try {
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
            accounts += row.region + " - " + row.gamename + "#" + row.tagline + "\n";

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
            best_solo_str = client.lol.lol_rank_manager.emojis[best_solo[0].toLowerCase()] + " " + best_solo[1] + " " + best_solo[2] + "LP";
        }
        if (best_flex[0] === "unranked") {
            best_flex_str = "Unranked";
        } else {
            best_flex_str = client.lol.lol_rank_manager.emojis[best_solo[0].toLowerCase()] + " " + best_solo[1] + " " + best_solo[2] + "LP";
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

        const Top_Champion = "- **" + mastery.rows[0].first_mastery_champ + "** - " + first_mastery +
            "\n- **" + mastery.rows[0].second_mastery_champ + "** - " + second_mastery +
            "\n- **" + mastery.rows[0].third_mastery_champ + "** - " + third_mastery;

        // Mastery statistics
        const Mastery_statistics = mastery.rows[0].mastery7 + "x" + client.lol.lol_rank_manager.emojis["mastery7"] + " " +
            mastery.rows[0].mastery6 + "x" + client.lol.lol_rank_manager.emojis["mastery6"] + " " +
            mastery.rows[0].mastery5 + "x" + client.lol.lol_rank_manager.emojis["mastery5"] + " \n" +
            mastery.rows[0].total_point + " **Total Points**";

        // Champion statistics
        //const response2 = await client.pg.query("SELECT * FROM matchs,summoners WHERE matchs.player = summoners.puuid AND discordid = '" + discordaccount + "' ORDER BY timestamp DESC LIMIT 3;");

        const embed = new EmbedBuilder()
            .setTitle("" + discordusername + "'s Profile :")
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
    } catch (e) {
        logger.error(e);
        client.users.fetch(client.owners[0]).then((user) => {
            const params = {
                discordaccount: discordaccount?.id
            };
            const Js = JSON.stringify(params);
            user.send("Error with command /lol stats profile " + Js + " from user " + interaction.user.id);

        });
        return await interaction.editReply("Error while getting stats, this error has been reported to the bot owner and will be fixed as soon as possible.");
    }
}

/**
 * send compare stats between 2 accounts
 * @function stats_compare
 * @param {Client} client - bot's client
 * @param {Interaction} interaction - command's interaction
 * @param {User} discordaccount - discord account to get stats from
 * @param {String} champion - champion to get stats from
 * @param {String} role - role to get stats from
 * @param {String} season - season to get stats from
 * @param {String} gamemode - gamemode to get stats from
 */
async function stats_compare(client, interaction, discordaccount, champion, role, season, gamemode) {
    client.pg.query({
        name: "insert-logs",
        text: "INSERT INTO logs (date, discordid, command, args, serverid) VALUES ($1, $2, $3, $4, $5)",
        values: [
            new Date(),
            interaction.user.id,
            "lol/stats/compare",
            JSON.stringify({
                discordaccount: discordaccount?.id,
                champion: champion,
                role: role,
                season: season,
                gamemode: gamemode
            }),
            interaction.guild ? interaction.guild.id : interaction.user.id
        ]
    });
    try {

        const start = Date.now();

        const priority = await client.pg.query("SELECT priority FROM summoners WHERE discordid = $1;", [interaction.user.id]);
        if (priority.rows.length === 0) {
            return await interaction.editReply("You need to add an account to use stats commands. You can add one with `/lol account add`");
        }
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
            query += " AND lower(matchs.champion)=$" + i;
            query2 += " AND lower(matchs.champion)=$" + i;
            query_values.push(champion.toLowerCase());
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
        if (season !== null) {
            query += " AND patch LIKE $" + i;
            query2 += " AND patch LIKE $" + i;
            query_values.push(season + "%");
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
        j++;

        if (champion !== null) {
            query3 += " AND lower(matchs.champion)=$" + j;
            query4 += " AND lower(matchs.champion)=$" + j;
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

        const end = new Date();

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setColor("#00FF00")
            .setFooter({
                text: "Requested by " + interaction.user.username + " | took " + (end - start) + "ms",
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
    } catch (e) {
        logger.error(e);
        client.users.fetch(client.owners[0]).then((user) => {
            const params = {
                discordaccount: discordaccount?.id,
                champion: champion,
                role: role,
                season: season
            };
            const Js = JSON.stringify(params);
            user.send("Error with command /lol stats compare " + Js + " from user " + interaction.user.id);

        });
        return await interaction.editReply("Error while getting stats, this error has been reported to the bot owner and will be fixed as soon as possible.");
    }
}

// ---------------------------- TOPS FUNCTIONS ----------------------------

/**
 * Get carry's ranking
 * @function top_carry
 * @param {Client} client - bot's client
 * @param {Interaction} interaction - command's interaction
 * @param {String} champion - champion to get stats from
 * @param {String} role - role to get stats from
 * @param {String} season - season to get stats from
 */
async function top_carry(client, interaction, champion, role, season) {
    client.pg.query({
        name: "insert-logs",
        text: "INSERT INTO logs (date, discordid, command, args, serverid) VALUES ($1, $2, $3, $4, $5)",
        values: [
            new Date(),
            interaction.user.id,
            "lol/top/carry",
            JSON.stringify({
                champion: champion,
                role: role,
                season: season
            }),
            interaction.guild ? interaction.guild.id : interaction.user.id
        ]
    });
    try {
        if (!interaction.guild) {
            return await interaction.editReply("This command can only be used in a guild.\n If you use it in a DM or with the user installed command, please install the app in a guild.");
        }

        const start = new Date();

        let i = 1;

        const query_values = [];

        let query2 = "";
        if (champion !== null) {
            query2 += " AND lower(matchs.champion)=$" + i;
            query_values.push(champion.toLowerCase());
            i++;
        }

        let queryrole = "";
        if (role !== null) {
            queryrole = " AND matchs.lane=$" + i;
            query_values.push(role);
            i++;
        }

        let queryseason = "";
        if (season !== null) {
            queryseason = " AND patch LIKE $" + i;
            query_values.push(season + "%");
            i++;
        }

        const all = interaction.options.getBoolean("all") === true;
        let queryall = "";
        let limit = 10;
        const memberCount = interaction.guild.memberCount;

        if (!all && memberCount <= 100) {
            // Use cache for small guilds
            const members = interaction.guild.members.cache.filter(member => !member.user.bot);
            let list = "(";
            members.forEach(member => {
                list += "'" + member.user.id + "',";
            });
            list = list.slice(0, -1);
            list += ")";
            queryall = " AND summoners.discordid IN " + list;
        } else if (!all) {
            limit = 100;
        }

        let query =
            "SELECT summoners.discordid, " +
            "count(*) as count, " +
            "(" +
            "count(*) FILTER (" +
            "WHERE (matchs.first_tanked OR first_gold OR first_damages)" +
            ")*100.0/count(*)) as carry " +
            "FROM matchs, summoners " +
            "WHERE matchs.player = summoners.puuid" +
            query2 +
            queryrole +
            queryall +
            queryseason +
            " GROUP BY summoners.discordid ORDER BY carry DESC LIMIT " +
            limit +
            ";";
        let response = await client.pg.query(query, query_values);

        let general = "";
        if (response.rows.length === 0) {
            general = "There are not enought summoners in the database or the filters are too restrictings.";
        } else {
            if(!all && memberCount > 100) {
                let nb = 0;
                for (const x of response.rows) {
                    // fetch the user and add it to the string if it exists
                    const user = await interaction.guild.members.fetch(x.discordid).catch(() => null);
                    if(user && nb < 10) {
                        general += "- <@" + x.discordid + "> : " + Number.parseFloat(x.carry).toFixed(decimal) + " % (" + x.count + " matchs)\n";
                        nb++;
                    }
                    if(nb >= 10) {
                        break;
                    }
                }
            } else {
                for (const x of response.rows) {
                    general += "- <@" + x.discordid + "> : " + Number.parseFloat(x.carry).toFixed(decimal) + " % (" + x.count + " matchs)\n";
                }
            }
        }

        // damage Carry
        query =
            "SELECT summoners.discordid, " +
            "count(*) as count, " +
            "(" +
            "count(*) FILTER (" +
            "WHERE matchs.first_damages" +
            ")*100.0/count(*)) as damage " +
            "FROM matchs, summoners " +
            "WHERE matchs.player = summoners.puuid" +
            query2 +
            queryrole +
            queryall +
            " GROUP BY summoners.discordid ORDER BY damage DESC LIMIT " +
            limit +
            ";";
        response = await client.pg.query(query, query_values);

        let damages = "";
        if (response.rows.length === 0) {
            damages = "There are not enought summoners in the database or the filters are too restrictings.";
        } else {
            if(!all && memberCount > 100) {
                let nb = 0;
                for (const x of response.rows) {
                    // fetch the user and add it to the string if it exists
                    const user = await interaction.guild.members.fetch(x.discordid).catch(() => null);
                    if(user && nb < 10) {
                        damages += "- <@" + x.discordid + "> : " + Number.parseFloat(x.damage).toFixed(decimal) + " % (" + x.count + " matchs)\n";
                        nb++;
                    }
                    if(nb >= 10) {
                        break;
                    }
                }
            } else {
                for (const x of response.rows) {
                    damages += "- <@" + x.discordid + "> : " + Number.parseFloat(x.damage).toFixed(decimal) + " % (" + x.count + " matchs)\n";
                }
            }
        }

        // tanked Carry
        query =
            "SELECT summoners.discordid, " +
            "count(*) as count, " +
            "(" +
            "count(*) FILTER (" +
            "WHERE matchs.first_tanked" +
            ")*100.0/count(*)) as tanked " +
            "FROM matchs, summoners " +
            "WHERE matchs.player = summoners.puuid" +
            query2 +
            queryrole +
            queryall +
            " GROUP BY summoners.discordid ORDER BY tanked DESC LIMIT " +
            limit +
            ";";
        response = await client.pg.query(query, query_values);

        let tanked = "";
        if (response.rows.length === 0) {
            tanked = "There are not enought summoners in the database or the filters are too restrictings.";
        } else {
            if(!all && memberCount > 100) {
                let nb = 0;
                for (const x of response.rows) {
                    // fetch the user and add it to the string if it exists
                    const user = await interaction.guild.members.fetch(x.discordid).catch(() => null);
                    if(user && nb < 10) {
                        tanked += "- <@" + x.discordid + "> : " + Number.parseFloat(x.tanked).toFixed(decimal) + " % (" + x.count + " matchs)\n";
                        nb++;
                    }
                    if(nb >= 10) {
                        break;
                    }
                }
            } else {
                for (const x of response.rows) {
                    tanked += "- <@" + x.discordid + "> : " + Number.parseFloat(x.tanked).toFixed(decimal) + " % (" + x.count + " matchs)\n";
                }
            }
        }

        // Gold carry
        query =
            "SELECT summoners.discordid, " +
            "count(*) as count, " +
            "(" +
            "count(*) FILTER (" +
            "WHERE matchs.first_gold" +
            ")*100.0/count(*)) as gold " +
            "FROM matchs, summoners " +
            "WHERE matchs.player = summoners.puuid" +
            query2 +
            queryrole +
            queryall +
            " GROUP BY summoners.discordid ORDER BY gold DESC LIMIT " +
            limit +
            ";";
        response = await client.pg.query(query, query_values);

        let gold = "";
        if (response.rows.length === 0) {
            gold = "There are not enought summoners in the database or the filters are too restrictings.";
        } else {
            if(!all && memberCount > 100) {
                let nb = 0;
                for (const x of response.rows) {
                    // fetch the user and add it to the string if it exists
                    const user = await interaction.guild.members.fetch(x.discordid).catch(() => null);
                    if(user && nb < 10) {
                        gold += "- <@" + x.discordid + "> : " + Number.parseFloat(x.gold).toFixed(decimal) + " % (" + x.count + " matchs)\n";
                        nb++;
                    }
                    if(nb >= 10) {
                        break;
                    }
                }
            } else {
                for (const x of response.rows) {
                    gold += "- <@" + x.discordid + "> : " + Number.parseFloat(x.gold).toFixed(decimal) + " % (" + x.count + " matchs)\n";
                }
            }
        }

        // Hard carry
        query =
            "SELECT summoners.discordid, " +
            "count(*) as count, " +
            "(" +
            "count(*) FILTER (" +
            "WHERE matchs.first_damages AND first_gold AND first_tanked" +
            ")*100.0/count(*)) as hardcarry " +
            "FROM matchs, summoners " +
            "WHERE matchs.player = summoners.puuid" +
            query2 +
            queryrole +
            queryall +
            " GROUP BY summoners.discordid ORDER BY hardcarry DESC LIMIT " +
            limit +
            ";";
        response = await client.pg.query(query, query_values);
        let hard = "";
        if (response.rows.length === 0) {
            hard = "There are not enought summoners in the database or the filters are too restrictings.";
        } else {
            if (!all && memberCount > 100) {
                let nb = 0;
                for (const x of response.rows) {
                    // fetch the user and add it to the string if it exists
                    const user = await interaction.guild.members.fetch(x.discordid).catch(() => null);
                    if(user && nb < 10) {
                        hard += "- <@" + x.discordid + "> : " + Number.parseFloat(x.hardcarry).toFixed(decimal) + " % (" + x.count + " matchs)\n";
                        nb++;
                    }
                    if(nb >= 10) {
                        break;
                    }
                }
            } else {
                for (const x of response.rows) {
                    hard += "- <@" + x.discordid + "> : " + Number.parseFloat(x.hardcarry).toFixed(decimal) + " % (" + x.count + " matchs)\n";
                }
            }
        }

        const end = Date.now();

        // send embed
        const embed = new EmbedBuilder()
            .setTitle("Top carry :")
            .setColor("#00FF00")
            .setFooter({
                text: "Requested by " + interaction.user.username + " | took " + (end - start) + "ms",
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
    } catch (e) {
        logger.error(e);
        client.users.fetch(client.owners[0]).then((user) => {
            const params = {
                role: role,
                champion: champion
            };
            const Js = JSON.stringify(params);
            user.send("Error with command /lol top carry " + Js + " from user " + interaction.user.id);

        });
        return await interaction.editReply("Error while getting stats, this error has been reported to the bot owner and will be fixed as soon as possible.");
    }
}

/**
 * Get KS's ranking
 * @function top_kwikscore
 * @param {Client} client - bot's client
 * @param {Interaction} interaction - command's interaction
 * @param {String} champion - champion to get stats from
 * @param {String} role - role to get stats from
 * @param {String} season - season to get stats from
 */
async function top_kwikscore(client, interaction, champion, role, season) {
    client.pg.query({
        name: "insert-logs",
        text: "INSERT INTO logs (date, discordid, command, args, serverid) VALUES ($1, $2, $3, $4, $5)",
        values: [
            new Date(),
            interaction.user.id,
            "lol/top/kwikscore",
            JSON.stringify({
                champion: champion,
                role: role,
                season: season
            }),
            interaction.guild ? interaction.guild.id : interaction.user.id
        ]
    });
    try {
        if (!interaction.guild) {
            return await interaction.editReply("This command can only be used in a guild.\n If you use it in a DM or with the user installed command, please install the app in a guild.");
        }

        const start = Date.now();

        let i = 1;
        const query_values = [];

        const all = interaction.options.getBoolean("all") === true;
        let queryall = "";
        let limit = 10;
        const memberCount = interaction.guild.memberCount;

        if (!all && memberCount <= 100) {
            const members = interaction.guild.members.cache.filter(member => !member.user.bot);
            let list = "(VALUES ";
            members.forEach(member => {
                list += "('" + member.user.id + "'),";
            });
            list = list.slice(0, -1);
            list += ")";
            queryall = " AND summoners.discordid = ANY" + list;
        } else if (!all) {
            limit = 100;
        }
        let query2 = "";
        if (champion !== null) {
            query2 += " AND lower(matchs.champion)=$" + i;
            query_values.push(champion.toLowerCase());
            i++;
        }

        let queryrole = "";
        if (role !== null) {
            queryrole = " AND matchs.lane=$" + i;
            query_values.push(role);
            i++;
        }

        let queryseason = "";
        if (season !== null) {
            queryseason = " AND patch LIKE $" + i;
            query_values.push(season + "%");
            i++;
        }

        const query = "SELECT summoners.discordid, " +
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
            ")*100 as float)/count(*)) as hardcarry, avg(score) as delta " +
            "FROM matchs, summoners, COEF " +
            "WHERE matchs.player = summoners.puuid AND COEF.champion = matchs.champion" +
            query2 +
            queryrole +
            queryall +
            queryseason +
            " GROUP BY summoners.discordid";

        const query4 = "WITH COEF AS (" +
            "SELECT champion, " +
            "count, " +
            "200/(carry+wr+kp+vs*25+10*cs) AS score " +
            "FROM (" +
            "SELECT champion, " +
            "count(*), " +
            "(cast(count(*) FILTER (WHERE result = 'Win')*100 as float)/count(*)) as WR, " +
            "(cast(count(*) FILTER (WHERE (first_gold OR first_damages OR first_tanked))*100 as float)/count(*)) as CARRY, " +
            "cast((avg(kill)+avg(assists))*100 as float)/avg(total_kills) as KP, " +
            "cast(avg(vision_score) as float)/(avg(length)/60) as VS, " +
            "cast(avg(cs) as float)/(avg(length)/60) as CS, " +
            "(cast(count(*) FILTER (WHERE first_gold AND first_damages AND first_tanked)*100 as float)/count(*)) as hardcarry " +
            "FROM matchs " +
            "GROUP BY champion " +
            ") AS t1 " +
            ")" +
            "SELECT discordid, " +
            "count, " +
            "(CASE WHEN count<100 THEN (carry+wr+kp+vs*25+10*cs)*POWER(0.99, (100-count)) " +
            "ELSE (carry+wr+kp+vs*25+10*cs) " +
            "END)*delta AS KS " +
            "FROM (" + query + ") AS t1 " +
            "ORDER BY KS DESC " +
            "LIMIT " +
            limit +
            ";";
        const response = await client.pg.query(query4, query_values);

        if (response.rowCount === 0) {
            return interaction.editReply("There are not enought summoners in the database or the filters are too restrictings.");
        }

        const end = Date.now();

        const embed = new EmbedBuilder()
            .setTitle("Top KS :")
            .setColor("#00FF00")
            .setFooter({
                text: "Requested by " + interaction.user.username + " | took " + (end - start) + "ms",
                //iconURL: interaction.user.displayAvatarURL()
            })
            .setTimestamp();

        let text = "";
        if (!all && memberCount > 100) {
            let nb = 0;
            for (const x of response.rows) {
                // fetch the user and add it to the string if it exists
                const user = await interaction.guild.members.fetch(x.discordid).catch(() => null);
                if(user && nb < 10) {
                    text += "- <@" + x.discordid + "> : " + x.ks.toFixed(0) + " (" + x.count + " Games)\n";
                    nb++;
                }
                if(nb >= 10) {
                    break;
                }
            }
        } else {
            for (const x of response.rows) {
                text += "- <@" + x.discordid + "> : " + x.ks.toFixed(0) + " (" + x.count + " Games)\n";
            }
        }

        embed.addFields({
            name: "Top 10 KwikScore : ",
            value: "" + text,
        });

        return await interaction.editReply({ embeds: [embed] });
    } catch (e) {
        logger.error(e);
        client.users.fetch(client.owners[0]).then((user) => {
            const params = {
                role: role,
                champion: champion
            };
            const Js = JSON.stringify(params);
            user.send("Error with command /lol top KwikScore " + Js + " from user " + interaction.user.id);

        });
        return await interaction.editReply("Error while getting stats, this error has been reported to the bot owner and will be fixed as soon as possible.");
    }
}

// ---------------------------- TRACKERS FUNCTIONS ----------------------------

/**
 * add a tracker channel to the database
 * @function tracker_add
 * @param {Client} client - bot's client
 * @param {Interaction} interaction - command's interaction
 */
async function tracker_add(client, interaction) {
    const channel = interaction.options.getChannel("channel");
    try {
        client.pg.query({
            name: "insert-logs",
            text: "INSERT INTO logs (date, discordid, command, args, serverid) VALUES ($1, $2, $3, $4, $5)",
            values: [
                new Date(),
                interaction.user.id,
                "lol/tracker/add",
                JSON.stringify({
                    channel: channel?.id,
                    guild: channel?.guild?.id
                }),
                interaction.guild ? interaction.guild.id : interaction.user.id
            ]
        });
        const response = await client.pg.query("SELECT * FROM trackers WHERE guildid=$1;", [channel.guild.id]);
        if (response.rowCount !== 0) {
            return await interaction.editReply("A tracker channel already exists in this guild !");
        }
        // check if the bot has send message permission
        if (!channel.permissionsFor(client.user)?.has(PermissionsBitField.Flags.SendMessages)) {
            return await interaction.editReply("The bot doesn't have the permission to send messages in this channel !");
        }

        const query = "INSERT INTO trackers (channelid, guildid) VALUES ($1, $2);";
        client.lol.lol_rank_manager.trackers.push(channel.id);
        await client.pg.query(query, [channel.id, channel.guild.id]);
        return await interaction.editReply("tracker channel added !");
    } catch (e) {
        logger.error(e);
        client.users.fetch(client.owners[0]).then((user) => {
            const params = {
                channel: channel
            };
            const Js = JSON.stringify(params);
            user.send("Error with command /lol tracker add " + Js + " from user " + interaction.user.id);
        });
        return await interaction.editReply("Error while adding tracker channel, this error has been reported to the bot owner and will be fixed as soon as possible.");
    }
}

/**
 * remove a tracker channel from the database
 * @function tracker_remove
 * @param {Client} client - bot's client
 * @param {Interaction} interaction - command's interaction
 */
async function tracker_remove(client, interaction) {
    const channel = interaction.options.getChannel("channel");
    try {
        client.pg.query({
            name: "insert-logs",
            text: "INSERT INTO logs (date, discordid, command, args, serverid) VALUES ($1, $2, $3, $4, $5)",
            values: [
                new Date(),
                interaction.user.id,
                "lol/tracker/remove",
                JSON.stringify({
                    channel: channel?.id,
                    guild: channel?.guild?.id
                }),
                interaction.guild ? interaction.guild.id : interaction.user.id
            ]
        });
        const response = await client.pg.query("SELECT * FROM trackers WHERE channelid=$1;", [channel.id]);
        if (response.rowCount === 0) {
            return await interaction.editReply("This channel is currently not a tracker channel !");
        }
        const query = "DELETE FROM trackers WHERE channelid=$1;";
        client.lol.lol_rank_manager.trackers.splice(client.lol.lol_rank_manager.trackers.indexOf(channel.id), 1);
        await client.pg.query(query, [channel.id]);
        return await interaction.editReply("tracker channel removed !");
    } catch (e) {
        logger.error(e);
        client.users.fetch(client.owners[0]).then((user) => {
            const params = {
                channel: channel
            };
            const Js = JSON.stringify(params);
            user.send("Error with command /lol remove add " + Js + " from user " + interaction.user.id);
        });
        return await interaction.editReply("Error while removing tracker channel, this error has been reported to the bot owner and will be fixed as soon as possible.");
    }
}