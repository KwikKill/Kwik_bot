//const { MessageEmbed } = require('discord.js');

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
                    type: 'SUB_COMMAND'
                },
                {
                    name: 'swain',
                    description: 'add swain main summoners to the database',
                    type: 'SUB_COMMAND'
                }
            ]
        },
        {
            name: 'analyze',
            description: 'analyze a game comp post launch',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'TOP',
                    description: 'allied TOP laner',
                    type: 'STRING'
                },
                {
                    name: 'JUNGLE',
                    description: 'allied JUNGLE laner',
                    type: 'STRING'
                },
                {
                    name: 'MID',
                    description: 'allied MID laner',
                    type: 'STRING'
                },
                {
                    name: 'ADC',
                    description: 'allied ADC laner',
                    type: 'STRING'
                },
                {
                    name: 'SUPPORT',
                    description: 'allied SUPPORT laner',
                    type: 'STRING'
                },
                {
                    name: 'ENEMY_TOP',
                    description: 'enemy TOP laner',
                    type: 'STRING',
                    required: true
                },
                {
                    name: 'ENEMY_JUNGLE',
                    description: 'enemy JUNGLE laner',
                    type: 'STRING',
                    required: true
                },
                {
                    name: 'ENEMY_MID',
                    description: 'enemy MID laner',
                    type: 'STRING',
                    required: true
                },
                {
                    name: 'ENEMY_ADC',
                    description: 'enemy ADC laner',
                    type: 'STRING',
                    required: true
                },
                {
                    name: 'ENEMY_SUPPORT',
                    description: 'enemy SUPPORT laner',
                    type: 'STRING',
                    required: true
                }
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
                    await update(client, interaction);
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
                    /*client.commands.get('lol').add_summoner_manual(client, "원픽스웨인", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "obluda", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "쫠 메", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "sa1", "503109625772507136", "JP1");
                    client.commands.get('lol').add_summoner_manual(client, "채팅욕설비방금지", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "ekkoike", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "KodyKensei", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "배꼽맞추까", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "시밤쾅쾅쾅", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "롤처음하노", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "Aitch3", "503109625772507136", "NA1");
                    client.commands.get('lol').add_summoner_manual(client, "알테라", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "꽃총각스웨인", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "TheAfricanDream", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "성라대연", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "Fishlord", "503109625772507136", "NA1");
                    client.commands.get('lol').add_summoner_manual(client, "병진이형은 나가", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "ABEGEN", "503109625772507136", "JP1");
                    client.commands.get('lol').add_summoner_manual(client, "전라인스웨인만함", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "Etiopp", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "Yarmo", "503109625772507136", "LA1");
                    client.commands.get('lol').add_summoner_manual(client, "Amillio88", "503109625772507136", "NA1");
                    client.commands.get('lol').add_summoner_manual(client, "Sportbong", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "Fluentes", "503109625772507136", "EUN1");
                    client.commands.get('lol').add_summoner_manual(client, "Laaemel", "503109625772507136", "NA1");
                    client.commands.get('lol').add_summoner_manual(client, "so4ke", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "sippinsoju", "503109625772507136", "NA1");
                    client.commands.get('lol').add_summoner_manual(client, "파워빅뱅", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "Obεron", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "About Swain", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "더블킬맛있어", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "GilGodMed", "503109625772507136", "LA1");
                    client.commands.get('lol').add_summoner_manual(client, "ptiteface", "503109625772507136", "NA1");
                    client.commands.get('lol').add_summoner_manual(client, "Make Me Lucky", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "Demoniac Swain", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "01003443492", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "스웨인89", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "Sadam HusSwain", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "Wilde Wind", "503109625772507136", "NA1");
                    client.commands.get('lol').add_summoner_manual(client, "까막눈 까마긔", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "Ξ Cąz Ξ", "503109625772507136", "EUN1");
                    client.commands.get('lol').add_summoner_manual(client, "MarryingMaryJane", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "derswainler", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "허경영 각하", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "나도뭘하는지모름", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "Одинокий Гей", "503109625772507136", "RU");
                    client.commands.get('lol').add_summoner_manual(client, "Krzysiekp4", "503109625772507136", "EUN1");
                    client.commands.get('lol').add_summoner_manual(client, "WishmasteR87", "503109625772507136", "LA2");
                    client.commands.get('lol').add_summoner_manual(client, "dgindex1", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "아마추어수학", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "TEAMup Will Dive", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "Kellersen", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "시라소니 아들", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "MataRatas 23", "503109625772507136", "LA2");
                    client.commands.get('lol').add_summoner_manual(client, "파찬이", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "HoLy21", "503109625772507136", "TR1");
                    client.commands.get('lol').add_summoner_manual(client, "예 래", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "WhiteDelight", "503109625772507136", "NA1");
                    client.commands.get('lol').add_summoner_manual(client, "McDumy2", "503109625772507136", "EUN1");
                    client.commands.get('lol').add_summoner_manual(client, "SellMyDrugs", "503109625772507136", "NA1");
                    client.commands.get('lol').add_summoner_manual(client, "BulutShen", "503109625772507136", "TR1");
                    client.commands.get('lol').add_summoner_manual(client, "Cerlitzi", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "one shot are fun", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "fiazyy", "503109625772507136", "EUN1");
                    client.commands.get('lol').add_summoner_manual(client, "강약약강원조", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "Lab", "503109625772507136", "NA1");
                    client.commands.get('lol').add_summoner_manual(client, "다이애나 겨울", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "AndryEagle", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "ttittuttitt", "503109625772507136", "TR1");
                    client.commands.get('lol').add_summoner_manual(client, "Uncultured Swain", "503109625772507136", "EUN1");
                    client.commands.get('lol').add_summoner_manual(client, "BIaming", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "에이 피가 없어요", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "joonsama07", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "FoxKillaa", "503109625772507136", "EUN1");
                    client.commands.get('lol').add_summoner_manual(client, "twin222", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "제2막", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "유리구슬", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "XanTi", "503109625772507136", "OC1");
                    client.commands.get('lol').add_summoner_manual(client, "pooop66", "503109625772507136", "EUN1");
                    client.commands.get('lol').add_summoner_manual(client, "PONEY du ghetto", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "Lokipaly", "503109625772507136", "NA1");
                    client.commands.get('lol').add_summoner_manual(client, "Aballonn", "503109625772507136", "BR1");
                    client.commands.get('lol').add_summoner_manual(client, "Spraakmeneer", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "AlisyO", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "Alamander", "503109625772507136", "NA1");
                    client.commands.get('lol').add_summoner_manual(client, "AnulusLeDevoreur", "503109625772507136", "EUW1");*/
                    client.commands.get('lol').add_summoner_manual(client, "피태혁", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "꽃중년 스웨인", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "정수웨인", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "Milda7711", "503109625772507136", "EUN1");
                    client.commands.get('lol').add_summoner_manual(client, "cabezathebest", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "금곧휴", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "5às6", "503109625772507136", "BR1");
                    client.commands.get('lol').add_summoner_manual(client, "Emperσr Time", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "소년가장 상묵", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "벌레 터뜨리는 새", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "kosa091", "503109625772507136", "EUN1");
                    client.commands.get('lol').add_summoner_manual(client, "PB Fireman", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "MILLION DOLLAR", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "정반2", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "Vlloviano", "503109625772507136", "EUN1");
                    client.commands.get('lol').add_summoner_manual(client, "blurryfac", "503109625772507136", "EUN1");
                    client.commands.get('lol').add_summoner_manual(client, "VànNìstèlròòy10", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "legato86", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "c0sette", "503109625772507136", "NA1");
                    client.commands.get('lol').add_summoner_manual(client, "HEALING PIG", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "Dongburger", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "럴도사", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "Rcenala", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "dogland", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "McMickey", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "Broo Swain", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "GetsiT", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "멀리서 통통", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "İvârTheBoneless", "503109625772507136", "TR1");
                    client.commands.get('lol').add_summoner_manual(client, "Elephant Gang", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "Miarzch", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "Ordàlium", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "JerichoNoxianG", "503109625772507136", "NA1");
                    client.commands.get('lol').add_summoner_manual(client, "Stonky Bonk", "503109625772507136", "NA1");
                    client.commands.get('lol').add_summoner_manual(client, "GEORGEFLOYD1337", "503109625772507136", "EUN1");
                    client.commands.get('lol').add_summoner_manual(client, "beglula", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "차 슘", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "GG e a s y XD", "503109625772507136", "EUN1");
                    client.commands.get('lol').add_summoner_manual(client, "Steedthehorse", "503109625772507136", "BR1");
                    client.commands.get('lol').add_summoner_manual(client, "녹색스웨인", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "Banette", "503109625772507136", "TR1");
                    client.commands.get('lol').add_summoner_manual(client, "SERDARLAYAN", "503109625772507136", "TR1");
                    client.commands.get('lol').add_summoner_manual(client, "찐찌버거토핑추가", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "robertcrg", "503109625772507136", "NA1");
                    client.commands.get('lol').add_summoner_manual(client, "플레이보이인직", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "TreeLeef", "503109625772507136", "NA1");
                    client.commands.get('lol').add_summoner_manual(client, "BDJE31", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "LAROYE EXU", "503109625772507136", "BR1");
                    client.commands.get('lol').add_summoner_manual(client, "꾸러기쩡미니", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "전설의니니요", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "영훈아그만던져", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "Knαx", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "o카페라떼o", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "Exotics", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "LuaniHunter", "503109625772507136", "LA1");
                    client.commands.get('lol').add_summoner_manual(client, "킹 스웬", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "ToXwain", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "빵댕이씨", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "iNego of BordeL", "503109625772507136", "BR1");
                    client.commands.get('lol').add_summoner_manual(client, "PuleaSpataru", "503109625772507136", "EUN1");
                    client.commands.get('lol').add_summoner_manual(client, "Il Mr BRÓCOLI lI", "503109625772507136", "LA1");
                    client.commands.get('lol').add_summoner_manual(client, "Old Things", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "Manos Swain Main", "503109625772507136", "EUN1");
                    client.commands.get('lol').add_summoner_manual(client, "뚜루루아기상어", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "스웨인97", "503109625772507136", "KR");
                    client.commands.get('lol').add_summoner_manual(client, "jkpwn", "503109625772507136", "NA1");
                    client.commands.get('lol').add_summoner_manual(client, "xXxLoliHuntxXx", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "Saltriver77", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "MaxiMonnaie09", "503109625772507136", "EUW1");
                    client.commands.get('lol').add_summoner_manual(client, "GNG ORBAY", "503109625772507136", "TR1");
                    client.commands.get('lol').add_summoner_manual(client, "Enemy Swain", "503109625772507136", "NA1");
                    await client.lol();
                }
            } else if (interaction.options.getSubcommandGroup() === "analyze") {
                const TOP = interaction.options.getString("TOP");
                const JUNGLE = interaction.options.getString("JUNGLE");
                const MID = interaction.options.getString("MID");
                const ADC = interaction.options.getString("ADC");
                const SUPPORT = interaction.options.getString("SUPPORT");

                const ENEMY_TOP = interaction.options.getString("ENEMY_TOP");
                const ENEMY_JUNGLE = interaction.options.getString("ENEMY_JUNGLE");
                const ENEMY_MID = interaction.options.getString("ENEMY_MID");
                const ENEMY_ADC = interaction.options.getString("ENEMY_ADC");
                const ENEMY_SUPPORT = interaction.options.getString("ENEMY_SUPPORT");

                picks = [[TOP, "TOP"], [JUNGLE, "JUNGLE"], [MID, "MIDDLE"], [ADC, "BOTTOM"], [SUPPORT, "BOTTOM"]];
                enemy_picks = [[ENEMY_TOP, "TOP"], [ENEMY_JUNGLE, "JUNGLE"], [ENEMY_MID, "MIDDLE"], [ENEMY_ADC, "BOTTOM"], [ENEMY_SUPPORT, "BOTTOM"]];

                confidence = 1;

                for (const pick of picks) {
                    if (pick === null) {
                        query = "SELECT CAST(count(*) FILTER (WHERE result = 'Win')*100 AS FLOAT)/count(*) AS winrate," +
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
                        result = client.pg.query(query, [pick[0], pick[1]]);
                        confidence *= result.rows[0].winrate;
                    }
                }

                for (const pick of enemy_picks) {
                    query = "SELECT CAST(count(*) FILTER (WHERE result = 'Win')*100 AS FLOAT)/count(*) AS winrate," +
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
                    result = client.pg.query(query, [pick[0], pick[1]]);
                    confidence *= result.rows[0].winrate;
                }

                await interaction.reply({ content: "Confidence: " + confidence, ephemeral: true });
            }
        }
    },
    update
};

async function update(client) {
    const query = "SELECT DISTINCT puuid, id, username, discordid, region, priority FROM summoners ORDER BY priority DESC;";
    const result = await client.pg.query(query);

    const prio = [];

    for (let i = 0; i < result.rows.length; i++) {
        let found = false;
        for (let j = 0; j < client.requests["updates"].length; j++) {
            if (client.requests["updates"][j].puuid === result.rows[i].puuid) {
                found = true;
                break;
            }
        }
        if (!found) {
            if (result.rows[i].priority > 0) {
                // insert in position 1
                prio.push({ "puuid": result.rows[i].puuid, "discordid": result.rows[i].discordid, "id": result.rows[i].id, "username": result.rows[i].username, "matchs": [], "total": 0, "count": 0, "region": result.rows[i].region, "first": false, "rank": false });
            } else {
                client.requests["updates"].push({ "puuid": result.rows[i].puuid, "discordid": result.rows[i].discordid, "id": result.rows[i].id, "username": result.rows[i].username, "matchs": [], "total": 0, "count": 0, "region": result.rows[i].region, "first": false, "rank": false });
            }
        }
    }
    for (let i = prio.length - 1; i >= 0; i--) {
        client.requests["updates"].splice(1, 0, prio[i]);
    }
    await client.lol();
}