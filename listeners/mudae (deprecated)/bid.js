const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'bid',
    group: 'mudae',
    description: "listener d'enchère",
    type: "messageCreate",
    place: "guild",
    options: undefined,
    commande_channel: true,
    async run(client, args) {
        if (args.channel.type === "GUILD_PUBLIC_THREAD") {
            if (args.channel.name.startsWith("[A VENDRE]")) {
                const message = args.content.split(" ");
                const price_str = message[0];

                const price = parseInt(price_str);
                if (!isNaN(price)) {

                    let msg = await args.channel.messages.fetchPinned();
                    msg = msg.last();
                    const prix_min = msg.content.split(" ")[45];

                    args.channel.messages.fetch().then(async messages => {
                        const mssg = messages.filter(message => message.author.id === client.user.id && message.type !== 'THREAD_STARTER_MESSAGE' && message.embeds[0] !== undefined).first();
                        if (mssg) {
                            if (parseInt(mssg.embeds[0].description.split(" ")[3]) + parseInt(prix_min) <= price) {
                                const embed = new MessageEmbed()
                                    .setTitle("Enchère")
                                    .setColor("#00FF00")
                                    .setDescription(`<@` + args.author.id + `> a proposé ${price} kakera pour ce personnage.`)
                                    .setFooter(`${args.member.user.username}#${args.member.user.discriminator}`, args.member.user.avatarURL())
                                    .setTimestamp();
                                msg = await args.channel.send({ embeds: [embed] });
                            } else {
                                msg = await args.channel.send("Vous avez proposé un prix trop bas.");
                            }
                        } else {
                            const embed = new MessageEmbed()
                                .setTitle("Enchère")
                                .setColor("#00FF00")
                                .setDescription(`<@` + args.author.id + `> a proposé ${price} kakera pour ce personnage.`)
                                .setFooter(`${args.member.user.username}#${args.member.user.discriminator}`, args.member.user.avatarURL())
                                .setTimestamp();
                            msg = await args.channel.send({ embeds: [embed] });
                        }
                    });
                }
            }
        }
    }
};
