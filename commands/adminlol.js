//const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'adminlol',
    group: 'lol',
    description: "Commande lol",
    permission: "none",
    serverid: ["513776796211085342"],
    hidden: false,
    help: [
        {
            "name": "- __lol__ :",
            "value": "Test lol."
        },
    ],
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
                }
            ]
        },
        {
            name: 'swain',
            description: 'swain',
            type: 'SUB_COMMAND'
        }
    ],
    async run(message, client, interaction = undefined) {
        if (interaction !== undefined) {
            await interaction.deferReply();
            if (interaction.options.getSubcommandGroup() === "update") {
                if (interaction.options.getSubcommand() === "all") {
                    await interaction.editReply("Processing.");
                    await update(client, interaction);
                    try {
                        await interaction.editReply("All lol accounts updated.");
                    } catch {
                        try {
                            await interaction.followUp("All lol accounts updated.");
                        } catch {
                            await interaction.channel.send("All lol accounts updated.");
                        }
                    }
                }
            } else if (interaction.options.getSubcommand() === "swain") {
                await interaction.editReply("done");
                client.commands.get('lol').add_summoner_manual(client, "원픽스웨인", "503109625772507136", "KR");
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
                client.commands.get('lol').add_summoner_manual(client, "AnulusLeDevoreur", "503109625772507136", "EUW1");
                await client.lol();
            }
        }
    },
    update
};

async function update(client) {
    const query = "SELECT DISTINCT puuid, id, username, discordid, region FROM summoners;";
    const result = await client.pg.query(query);
    for (let i = 0; i < result.rows.length; i++) {
        client.requests["updates"].push({ "puuid": result.rows[i].puuid, "discordid": result.rows[i].discordid, "id": result.rows[i].id, "username": result.rows[i].username, "matchs": [], "total": 0, "count": 0, "region": result.rows[i].region });
    }
    await client.lol();
}