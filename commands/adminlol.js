//const { MessageEmbed } = require('discord.js');
const parse = require('node-html-parser');

module.exports = {
    name: 'adminlol',
    group: 'lol',
    description: "admin league of legends related commands",
    permission: "none",
    serverid: ["513776796211085342"],
    hidden: false,
    options: [
        {
            name: 'update',
            description: 'update all lol accounts',
            type: 'SUB_COMMAND_GROUP',
            options: [
                {
                    name: 'all',
                    description: 'update all lol accounts',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'first',
                            description: 'first',
                            type: 'BOOLEAN',
                            required: true
                        }
                    ]
                },
                {
                    name: 'swain',
                    description: 'add swain main summoners to the database',
                    type: 'SUB_COMMAND'
                },
                {
                    name: 'add',
                    description: 'add more summoners to the database',
                    type: 'SUB_COMMAND'
                },
                {
                    name: 'transition',
                    description: 'transition to the new database',
                    type: 'SUB_COMMAND'
                },
                {
                    name: 'populate',
                    description: 'populate the database',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'limit',
                            description: 'limit',
                            type: 'INTEGER',
                            required: true
                        },
                        {
                            name: 'account',
                            description: 'account',
                            type: 'BOOLEAN',
                            required: true
                        }
                    ]
                }
            ]
        },
        {
            name: 'analyze',
            description: 'analyze a game comp post launch',
            type: 'SUB_COMMAND_GROUP',
            options: [
                {
                    name: 'test',
                    description: 'update all lol accounts',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'top',
                            description: 'allied TOP laner',
                            type: 'STRING',
                            autocomplete: true,
                        },
                        {
                            name: 'jungle',
                            description: 'allied JUNGLE laner',
                            type: 'STRING',
                            autocomplete: true,
                        },
                        {
                            name: 'mid',
                            description: 'allied MID laner',
                            type: 'STRING',
                            autocomplete: true,
                        },
                        {
                            name: 'adc',
                            description: 'allied ADC laner',
                            type: 'STRING',
                            autocomplete: true,
                        },
                        {
                            name: 'supp',
                            description: 'allied SUPPORT laner',
                            type: 'STRING',
                            autocomplete: true,
                        },
                        {
                            name: 'entop',
                            description: 'enemy TOP laner',
                            type: 'STRING',
                            autocomplete: true,
                        },
                        {
                            name: 'enjungle',
                            description: 'enemy JUNGLE laner',
                            type: 'STRING',
                            autocomplete: true,
                        },
                        {
                            name: 'enmid',
                            description: 'enemy MID laner',
                            type: 'STRING',
                            autocomplete: true,
                        },
                        {
                            name: 'enadc',
                            description: 'enemy ADC laner',
                            type: 'STRING',
                            autocomplete: true,
                        },
                        {
                            name: 'ensupp',
                            description: 'enemy SUPPORT laner',
                            type: 'STRING',
                            autocomplete: true,
                        }
                    ]
                }
            ]
        },
        {
            name: 'add',
            description: 'add a summoner to the database',
            type: 'SUB_COMMAND_GROUP',
            options: [
                {
                    name: 'summoner',
                    description: 'add a summoner to the database',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'summonerid',
                            description: 'summoner id',
                            type: 'STRING',
                            required: true,
                        },
                        {
                            name: 'region',
                            description: 'region',
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
                        },
                        {
                            name: 'discordid',
                            description: 'discord id',
                            type: 'STRING',
                            required: true,
                        },
                        {
                            name: 'priority',
                            description: 'priority',
                            type: 'INTEGER',
                            required: true,
                        }
                    ]
                },
                {
                    name: 'game',
                    description: 'add a game to the database',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'gameid',
                            description: 'game id',
                            type: 'STRING',
                            required: true,
                        },
                        {
                            name: 'region',
                            description: 'region',
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
                        },
                        {
                            name: 'debug',
                            description: 'debug',
                            type: 'BOOLEAN',
                            required: true
                        }
                    ]
                }
            ]
        },
        {
            name: 'status',
            description: 'check the status of the bot',
            type: 'SUB_COMMAND_GROUP',
            options: [
                {
                    name: 'summarized',
                    description: 'summarized status',
                    type: 'SUB_COMMAND',
                },
                {
                    name: 'maintenance',
                    description: 'send a maintenance message',
                    type: 'SUB_COMMAND',
                },
            ]
        }
    ],
    async run(message, client, interaction = undefined) {
        if (interaction !== undefined) {
            await interaction.deferReply();
            if (interaction.options.getSubcommandGroup() === "update") {
                if (interaction.options.getSubcommand() === "all") {
                    await interaction.editReply("Processing.");
                    const start = Date.now();
                    await update(client, true, interaction.options.getBoolean("first"));
                    const end = Date.now();
                    const time = (end - start) / 1000;
                    try {
                        await interaction.editReply("All lol accounts updated in " + time + "s.");
                    } catch {
                        try {
                            await interaction.followUp("All lol accounts updated in " + time + "s.");
                        } catch {
                            await interaction.channel.send("All lol accounts updated in " + time + "s.");
                        }
                    }
                } else if (interaction.options.getSubcommand() === "swain") {
                    await interaction.editReply("done");
                    const sums = [
                        ["원픽스웨인", "503109625772507136", "KR"],
                        ["obluda", "503109625772507136", "KR"],
                        ["쫠 메", "503109625772507136", "KR"],
                        ["sa1", "503109625772507136", "JP1"],
                        ["채팅욕설비방금지", "503109625772507136", "KR"],
                        ["ekkoike", "503109625772507136", "EUW1"],
                        ["KodyKensei", "503109625772507136", "EUW1"],
                        ["배꼽맞추까", "503109625772507136", "KR"],
                        ["시밤쾅쾅쾅", "503109625772507136", "KR"],
                        ["롤처음하노", "503109625772507136", "KR"],
                        ["Aitch3", "503109625772507136", "NA1"],
                        ["알테라", "503109625772507136", "KR"],
                        ["꽃총각스웨인", "503109625772507136", "KR"],
                        ["TheAfricanDream", "503109625772507136", "EUW1"],
                        ["성라대연", "503109625772507136", "KR"],
                        ["Fishlord", "503109625772507136", "NA1"],
                        ["병진이형은 나가", "503109625772507136", "KR"],
                        ["ABEGEN", "503109625772507136", "JP1"],
                        ["전라인스웨인만함", "503109625772507136", "KR"],
                        ["Etiopp", "503109625772507136", "EUW1"],
                        ["Yarmo", "503109625772507136", "LA1"],
                        ["Amillio88", "503109625772507136", "NA1"],
                        ["Sportbong", "503109625772507136", "EUW1"],
                        ["Fluentes", "503109625772507136", "EUN1"],
                        ["Laaemel", "503109625772507136", "NA1"],
                        ["so4ke", "503109625772507136", "EUW1"],
                        ["sippinsoju", "503109625772507136", "NA1"],
                        ["파워빅뱅", "503109625772507136", "KR"],
                        ["Obεron", "503109625772507136", "EUW1"],
                        ["About Swain", "503109625772507136", "KR"],
                        ["더블킬맛있어", "503109625772507136", "KR"],
                        ["GilGodMed", "503109625772507136", "LA1"],
                        ["ptiteface", "503109625772507136", "NA1"],
                        ["Make Me Lucky", "503109625772507136", "KR"],
                        ["Demoniac Swain", "503109625772507136", "EUW1"],
                        ["01003443492", "503109625772507136", "KR"],
                        ["스웨인89", "503109625772507136", "KR"],
                        ["Sadam HusSwain", "503109625772507136", "EUW1"],
                        ["Wilde Wind", "503109625772507136", "NA1"],
                        ["까막눈 까마긔", "503109625772507136", "KR"],
                        ["Ξ Cąz Ξ", "503109625772507136", "EUN1"],
                        ["MarryingMaryJane", "503109625772507136", "EUW1"],
                        ["derswainler", "503109625772507136", "EUW1"],
                        ["허경영 각하", "503109625772507136", "KR"],
                        ["나도뭘하는지모름", "503109625772507136", "KR"],
                        ["Одинокий Гей", "503109625772507136", "RU"],
                        ["Krzysiekp4", "503109625772507136", "EUN1"],
                        ["WishmasteR87", "503109625772507136", "LA2"],
                        ["dgindex1", "503109625772507136", "KR"],
                        ["아마추어수학", "503109625772507136", "KR"],
                        ["TEAMup Will Dive", "503109625772507136", "EUW1"],
                        ["Kellersen", "503109625772507136", "EUW1"],
                        ["시라소니 아들", "503109625772507136", "KR"],
                        ["MataRatas 23", "503109625772507136", "LA2"],
                        ["파찬이", "503109625772507136", "KR"],
                        ["HoLy21", "503109625772507136", "TR1"],
                        ["예 래", "503109625772507136", "KR"],
                        ["WhiteDelight", "503109625772507136", "NA1"],
                        ["McDumy2", "503109625772507136", "EUN1"],
                        ["SellMyDrugs", "503109625772507136", "NA1"],
                        ["BulutShen", "503109625772507136", "TR1"],
                        ["Cerlitzi", "503109625772507136", "EUW1"],
                        ["one shot are fun", "503109625772507136", "EUW1"],
                        ["fiazyy", "503109625772507136", "EUN1"],
                        ["강약약강원조", "503109625772507136", "KR"],
                        ["Lab", "503109625772507136", "NA1"],
                        ["다이애나 겨울", "503109625772507136", "KR"],
                        ["AndryEagle", "503109625772507136", "EUW1"],
                        ["ttittuttitt", "503109625772507136", "TR1"],
                        ["Uncultured Swain", "503109625772507136", "EUN1"],
                        ["BIaming", "503109625772507136", "EUW1"],
                        ["에이 피가 없어요", "503109625772507136", "KR"],
                        ["joonsama07", "503109625772507136", "KR"],
                        ["FoxKillaa", "503109625772507136", "EUN1"],
                        ["twin222", "503109625772507136", "EUW1"],
                        ["제2막", "503109625772507136", "KR"],
                        ["유리구슬", "503109625772507136", "KR"],
                        ["XanTi", "503109625772507136", "OC1"],
                        ["pooop66", "503109625772507136", "EUN1"],
                        ["PONEY du ghetto", "503109625772507136", "EUW1"],
                        ["Lokipaly", "503109625772507136", "NA1"],
                        ["Aballonn", "503109625772507136", "BR1"],
                        ["Spraakmeneer", "503109625772507136", "EUW1"],
                        ["AlisyO", "503109625772507136", "EUW1"],
                        ["Alamander", "503109625772507136", "NA1"],
                        ["AnulusLeDevoreur", "503109625772507136", "EUW1"],
                        ["피태혁", "503109625772507136", "KR"],
                        ["꽃중년 스웨인", "503109625772507136", "KR"],
                        ["정수웨인", "503109625772507136", "KR"],
                        ["Milda7711", "503109625772507136", "EUN1"],
                        ["cabezathebest", "503109625772507136", "EUW1"],
                        ["금곧휴", "503109625772507136", "KR"],
                        ["5às6", "503109625772507136", "BR1"],
                        ["Emperσr Time", "503109625772507136", "EUW1"],
                        ["소년가장 상묵", "503109625772507136", "KR"],
                        ["벌레 터뜨리는 새", "503109625772507136", "KR"],
                        ["kosa091", "503109625772507136", "EUN1"],
                        ["PB Fireman", "503109625772507136", "EUW1"],
                        ["MILLION DOLLAR", "503109625772507136", "EUW1"],
                        ["정반2", "503109625772507136", "KR"],
                        ["Vlloviano", "503109625772507136", "EUN1"],
                        ["blurryfac", "503109625772507136", "EUN1"],
                        ["VànNìstèlròòy10", "503109625772507136", "EUW1"],
                        ["legato86", "503109625772507136", "EUW1"],
                        ["c0sette", "503109625772507136", "NA1"],
                        ["HEALING PIG", "503109625772507136", "EUW1"],
                        ["Dongburger", "503109625772507136", "KR"],
                        ["럴도사", "503109625772507136", "KR"],
                        ["Rcenala", "503109625772507136", "EUW1"],
                        ["dogland", "503109625772507136", "EUW1"],
                        ["McMickey", "503109625772507136", "EUW1"],
                        ["Broo Swain", "503109625772507136", "EUW1"],
                        ["GetsiT", "503109625772507136", "EUW1"],
                        ["멀리서 통통", "503109625772507136", "KR"],
                        ["İvârTheBoneless", "503109625772507136", "TR1"],
                        ["Elephant Gang", "503109625772507136", "KR"],
                        ["Miarzch", "503109625772507136", "EUW1"],
                        ["Ordàlium", "503109625772507136", "EUW1"],
                        ["JerichoNoxianG", "503109625772507136", "NA1"],
                        ["Stonky Bonk", "503109625772507136", "NA1"],
                        ["GEORGEFLOYD1337", "503109625772507136", "EUN1"],
                        ["beglula", "503109625772507136", "EUW1"],
                        ["차 슘", "503109625772507136", "KR"],
                        ["GG e a s y XD", "503109625772507136", "EUN1"],
                        ["Steedthehorse", "503109625772507136", "BR1"],
                        ["녹색스웨인", "503109625772507136", "KR"],
                        ["Banette", "503109625772507136", "TR1"],
                        ["SERDARLAYAN", "503109625772507136", "TR1"],
                        ["찐찌버거토핑추가", "503109625772507136", "KR"],
                        ["robertcrg", "503109625772507136", "NA1"],
                        ["플레이보이인직", "503109625772507136", "KR"],
                        ["TreeLeef", "503109625772507136", "NA1"],
                        ["BDJE31", "503109625772507136", "EUW1"],
                        ["LAROYE EXU", "503109625772507136", "BR1"],
                        ["꾸러기쩡미니", "503109625772507136", "KR"],
                        ["전설의니니요", "503109625772507136", "KR"],
                        ["영훈아그만던져", "503109625772507136", "KR"],
                        ["Knαx", "503109625772507136", "EUW1"],
                        ["o카페라떼o", "503109625772507136", "KR"],
                        ["Exotics", "503109625772507136", "EUW1"],
                        ["LuaniHunter", "503109625772507136", "LA1"],
                        ["킹 스웬", "503109625772507136", "KR"],
                        ["ToXwain", "503109625772507136", "EUW1"],
                        ["빵댕이씨", "503109625772507136", "KR"],
                        ["iNego of BordeL", "503109625772507136", "BR1"],
                        ["PuleaSpataru", "503109625772507136", "EUN1"],
                        ["Il Mr BRÓCOLI lI", "503109625772507136", "LA1"],
                        ["Old Things", "503109625772507136", "KR"],
                        ["Manos Swain Main", "503109625772507136", "EUN1"],
                        ["뚜루루아기상어", "503109625772507136", "KR"],
                        ["스웨인97", "503109625772507136", "KR"],
                        ["jkpwn", "503109625772507136", "NA1"],
                        ["xXxLoliHuntxXx", "503109625772507136", "EUW1"],
                        ["Saltriver77", "503109625772507136", "EUW1"],
                        ["MaxiMonnaie09", "503109625772507136", "EUW1"],
                        ["GNG ORBAY", "503109625772507136", "TR1"],
                        ["Enemy Swain", "503109625772507136", "NA1"]
                    ];
                    for (const summoner of sums) {
                        const resp = await client.pg.query("SELECT puuid FROM summoners WHERE username = $1 AND region = $2 AND discord_id = $3", [summoner[0], summoner[2], summoner[1]]);
                        if (resp.rows.length === 0) {
                            client.commands.get('lol').add_summoner_manual(client, summoner[0], summoner[1], summoner[2]);
                        }
                    }
                    await client.lol.main();
                } else if (interaction.options.getSubcommand() === "add") {
                    await interaction.editReply("loading summoners...");
                    const resp = await client.pg.query("SELECT player, SPLIT_PART(puuid, '_', 1) AS region FROM matchs WHERE player IN (SELECT player FROM matchs GROUP BY player ORDER BY count(*) ASC, RANDOM() LIMIT 30)");

                    for (const summoner of resp.rows) {
                        const route = client.lol.reverse_routes[summoner.region];
                        if (route !== undefined && client.lol.services[route] !== undefined) {
                            client.lol.services[route]["queue"]["updates"].push({
                                "type": "sum",
                                "puuid": summoner.player,
                                "region": summoner.region,
                                "matchs": []
                            });
                        }
                    }
                    interaction.editReply("Adding " + resp.rows.length + " summoners to the queue, please wait");
                    await client.lol.main();
                } else if (interaction.options.getSubcommand() === "transition") {
                    client.lol.full_transition_from_puuid_to_gametag();
                    await interaction.editReply("done");
                } else if (interaction.options.getSubcommand() === "populate") {
                    const limit = interaction.options.getInteger("limit");
                    const account = interaction.options.getBoolean("account");
                    const start = Date.now();
                    await interaction.editReply("Populating the database, please wait");

                    const champs = await client.lol.lol_api.getChampsId("EUW1", client);

                    const summoners = [];

                    // for values in champs dict
                    for (const champ of Object.values(champs)) {
                        const currents = [];
                        let j = 1;

                        while (currents.length < limit) {
                            const url = "https://www.leagueofgraphs.com/rankings/summoners/" + champ.toLowerCase() + "/page-" + j;
                            const response = await fetch(url);
                            const html = await response.text();
                            const node = parse.parse(html);
                            const price_text = node.querySelectorAll(".txt");

                            for (let i = 0; i < price_text.length; i++) {
                                const node2 = price_text[i].querySelector(".name");
                                const node3 = price_text[i].querySelector("i");
                                if (node2 === null || node3 === null) {
                                    continue;
                                }
                                const username = node2.text;
                                let region = node3.text;
                                switch (region) {
                                    case "EUW":
                                        region = "EUW1";
                                        break;
                                    case "EUNE":
                                        region = "EUN1";
                                        break;
                                    case "NA":
                                        region = "NA1";
                                        break;
                                    case "OCE":
                                        region = "OC1";
                                        break;
                                    case "LAN":
                                        region = "LA1";
                                        break;
                                    case "LAS":
                                        region = "LA2";
                                        break;
                                    case "RU":
                                        region = "RU";
                                        break;
                                    case "BR":
                                        region = "BR1";
                                        break;
                                    case "TR":
                                        region = "TR1";
                                        break;
                                    case "JP":
                                        region = "JP1";
                                        break;
                                    case "KR":
                                        region = "KR";
                                        break;
                                    default:
                                        region = undefined;
                                        continue;
                                }
                                if (username !== undefined && region !== "null" && username !== "null" && username !== null && region !== undefined && region !== null && username.includes("#") && currents.length < limit) {
                                    const resp = await client.pg.query("SELECT puuid FROM summoners WHERE gamename = $1 AND tagline = $2 AND region = $3", [username.split("#")[0], username.split("#")[1], region]);
                                    if (resp.rows.length === 0) {
                                        // If not already in the two arrays
                                        for (const current of currents) {
                                            if (current[0] === username && current[1] === region) {
                                                continue;
                                            }
                                        }
                                        for (const summoner of summoners) {
                                            if (summoner[0] === username && summoner[1] === region) {
                                                continue;
                                            }
                                        }
                                        summoners.push([username, region]);
                                        currents.push([username, region]);
                                    }
                                }
                            }
                            j++;
                        }
                    }

                    for (const summoner of summoners) {
                        const route = client.lol.reverse_routes[summoner[1]];
                        if (route !== undefined && client.lol.services[route] !== undefined) {
                            client.lol.services[route]["queue"]["updates"].push({
                                "type": "population",
                                "region": summoner[1],
                                "gamename": summoner[0].split("#")[0],
                                "tagline": summoner[0].split("#")[1],
                                "add": account,
                                "discordid": "503109625772507136"
                            });
                        }
                    }

                    const end = Date.now();
                    const time = (end - start) / 1000;
                    await interaction.editReply(summoners.length + " summoners added to the queue in " + time + "s");

                    await client.lol.main(true);
                }
            } else if (interaction.options.getSubcommandGroup() === "analyze") {
                const TOP = interaction.options.getString("top");
                const JUNGLE = interaction.options.getString("jungle");
                const MID = interaction.options.getString("mid");
                const ADC = interaction.options.getString("adc");
                const SUPPORT = interaction.options.getString("supp");

                const ENEMY_TOP = interaction.options.getString("entop");
                const ENEMY_JUNGLE = interaction.options.getString("enjungle");
                const ENEMY_MID = interaction.options.getString("enmid");
                const ENEMY_ADC = interaction.options.getString("enadc");
                const ENEMY_SUPPORT = interaction.options.getString("ensupp");

                const picks = [[TOP, "TOP"], [JUNGLE, "JUNGLE"], [MID, "MIDDLE"], [ADC, "ADC"], [SUPPORT, "SUPPORT"]];
                const enemy_picks = [[ENEMY_TOP, "TOP"], [ENEMY_JUNGLE, "JUNGLE"], [ENEMY_MID, "MIDDLE"], [ENEMY_ADC, "ADC"], [ENEMY_SUPPORT, "SUPPORT"]];

                let confidence = 0;

                for (const pick of picks) {
                    if (pick[0] !== null) {
                        const query = "SELECT (CASE WHEN count(*) > 0 THEN CAST(count(*) FILTER (WHERE result = 'Win')*100 AS FLOAT)/count(*) ELSE 0 END) AS winrate," +
                            "count(*) " +
                            "FROM matchs m " +
                            "WHERE puuid IN (" +
                            "SELECT matchs.puuid " +
                            "FROM matchs, " +
                            "summoners " +
                            "WHERE player = summoners.puuid " +
                            "AND discordid = '297409548703105035' " +
                            "AND lane = 'MIDDLE' " +
                            "AND (result = 'Win' OR result = 'Lose') " +
                            ") AND team_id = (" +
                            "SELECT m2.team_id " +
                            "FROM matchs m2, summoners WHERE m2.player = summoners.puuid AND discordid = '297409548703105035' AND m2.puuid = m.puuid" +
                            ") AND player not IN (SELECT puuid FROM summoners WHERE discordid = '297409548703105035') AND champion = $1 AND lane = $2;";
                        const result = await client.pg.query(query, [pick[0], pick[1]]);
                        if (result.rows[0] !== undefined) {
                            if (result.rows[0].count >= 5) {
                                console.log(pick[0], pick[1], result.rows[0].winrate, result.rows[0].count);
                                confidence += result.rows[0].winrate / 100;
                            } else {
                                confidence += 0.5;
                            }
                        } else {
                            confidence += 0.5;
                        }

                    } else {
                        confidence += 0.5;
                    }
                }

                for (const pick of enemy_picks) {
                    const query = "SELECT (CASE WHEN count(*) > 0 THEN CAST(count(*) FILTER (WHERE result = 'Win')*100 AS FLOAT)/count(*) ELSE 0 END) AS winrate," +
                        "count(*) " +
                        "FROM matchs m " +
                        "WHERE puuid IN (" +
                        "SELECT matchs.puuid " +
                        "FROM matchs, " +
                        "summoners " +
                        "WHERE player = summoners.puuid " +
                        "AND discordid = '297409548703105035' " +
                        "AND lane = 'MIDDLE' " +
                        "AND (result = 'Win' OR result = 'Lose') " +
                        ") AND team_id <> (" +
                        "SELECT m2.team_id " +
                        "FROM matchs m2, summoners WHERE m2.player = summoners.puuid AND discordid = '297409548703105035' AND m2.puuid = m.puuid" +
                        ") AND player not IN (SELECT puuid FROM summoners WHERE discordid = '297409548703105035') AND champion = $1 AND lane = $2;";
                    const result = await client.pg.query(query, [pick[0], pick[1]]);
                    if (result.rows[0] !== undefined) {
                        if (result.rows[0].count >= 5) {
                            console.log(pick[0], pick[1], result.rows[0].winrate, result.rows[0].count);
                            confidence += result.rows[0].winrate / 100;
                        } else {
                            confidence += 0.5;
                        }
                    } else {
                        confidence += 0.5;
                    }
                }

                await interaction.editReply({ content: "Confidence: " + confidence / 10, ephemeral: true });
            } else if (interaction.options.getSubcommandGroup() === "add") {
                if (interaction.options.getSubcommand() === "summoner") {
                    const summoner = interaction.options.getString("summoner");
                    const region = interaction.options.getString("region");
                    const priority = interaction.options.getInteger("priority");
                    const discordid = interaction.options.getString("discordid");
                    await client.commands.get('lol').add_summoner_manual(client, summoner, discordid, region, priority);
                    await interaction.editReply({ content: "Summoner added!", ephemeral: true });
                } else if (interaction.options.getSubcommand() === "game") {
                    const matchid = interaction.options.getString("gameid");
                    const region = interaction.options.getString("region");

                    const debug = interaction.options.getBoolean("debug");

                    const route = client.lol.reverse_routes[region];
                    if (route !== undefined && client.lol.services[route] !== undefined) {
                        client.lol.services[route]["queue"]["updates"].push({
                            "type": "match",
                            "matchid": matchid,
                            "region": region,
                            "puuid": "noone",
                            "first": true,
                            "debug": debug
                        });
                    }

                    await interaction.editReply({ content: "Match added!", ephemeral: true });
                    client.lol.main();
                }
            } else if (interaction.options.getSubcommandGroup() === "status") {
                if (interaction.options.getSubcommand() === "summarized") {
                    const responses = await client.pg.query("SELECT count(*) FROM summoners WHERE priority = 0 AND discordid <> '503109625772507136';");
                    const count = responses.rows[0].count;

                    const responses2 = await client.pg.query("SELECT count(*) FROM summoners;");
                    const count2 = responses2.rows[0].count;

                    const responses3 = await client.pg.query("SELECT count(*) FROM matchs;");
                    const number = responses3.rows[0].count;

                    const responses4 = await client.pg.query("SELECT pg_size_pretty( pg_database_size('lol_database') );");
                    const size = responses4.rows[0].pg_size_pretty;

                    const servers = client.guilds.cache.filter(g => g.id !== '480142959501901845' &&
                        g.id !== '513776796211085342' &&
                        g.id !== '671289237982806026' &&
                        g.id !== "890915473363980308" &&
                        g.id !== "768786745931333634" &&
                        g.id !== "717475578176864277" &&
                        g.id !== "960284706073612379" &&
                        g.id !== "962329252550807592" &&
                        g.id !== "1030883669491069099" &&
                        g.id !== "1071211787707494452"
                    ).size;

                    await interaction.editReply({ content: "There are " + count + " real users in the database out of " + count2 + " total summoners. There are " + number + " matchs in the database. The database is " + size + " in size. The bot is on " + servers + " servers.", ephemeral: false });
                } else if (interaction.options.getSubcommand() === "maintenance") {
                    client.lol.trackers.forEach(ch => {
                        client.channels.fetch(ch).then(chs => {
                            chs.send("an unexpected error has occurred, game fetching and tracker messages will be disabled until more investigations");
                        });
                    });
                }
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
    update
};

async function update(client, debug = false, first = false) {
    const query = "SELECT DISTINCT puuid, id, gamename, tagline, discordid, region, priority FROM summoners ORDER BY priority DESC;";
    const result = await client.pg.query(query);

    const prio = {};

    for (let i = 0; i < result.rows.length; i++) {
        const route = client.lol.reverse_routes[result.rows[i].region];
        if (client.lol.services[route]["running"] === true) {
            continue;
        }

        if (!prio[route]) {
            prio[route] = [];
        }

        if (route !== undefined && client.lol.services[route] !== undefined) {
            let found = false;
            for (let j = 0; j < client.lol.services[route]["queue"]["updates"].length; j++) {
                if (client.lol.services[route]["queue"]["updates"][j].puuid === result.rows[i].puuid) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                client.lol.services[route]["queue"]["updates"].push({ "puuid": result.rows[i].puuid, "discordid": result.rows[i].discordid, "id": result.rows[i].id, "gamename": result.rows[i].gamename, "tagline": result.rows[i].tagline, "matchs": [], "total": 0, "count": 0, "region": result.rows[i].region, "first": first, "rank": false });
            }
        }
    }
    await client.lol.main(debug);
}