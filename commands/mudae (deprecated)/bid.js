const fs = require("fs");
const path = require('path');
const config = require('../../config.json');
const credits = require('../../credits.json');

module.exports = {
    name: 'bid',
    group: 'mudae',
    description: "Permet de démarrer une enchère",
    permission: "none",
    hidden: false,
    serverid: ["513776796211085342", "480142959501901845"],
    deploy: false,
    place: "guild",
    help: [
        {
            "name": "- __bid__ :",
            "value": "Lance une enchère sur le personnage sélectionné."
        },
    ],
    async run(message) {
        const msg = await message.channel.messages.fetch(message.reference.messageId);
        if(msg !== undefined) {
            if(msg.channel.name === "mudatrade") {
                if(msg.embeds[0] !== undefined) {
                    if(msg.embeds[0].footer.text.startsWith("Appartient à " + message.author.username)) {
                        if(config["credit"] === false) {
                            msg.startThread({name: "[A VENDRE] : " + msg.embeds[0].author.name}).then(thread =>{
                                const first = thread.send("Ce personnage est à vendre. Pour enchérir, mettez simplement le prix dans le salon. Il n'est pas possible d'annuler une offre. L'enchère se termine au bout de 24h sans message. Vous pouvez ping <@" + message.author.id + "> si les enchères sont finis. \nEnchère minimume : dernière enchère + 50");
                                first.then(fs => {
                                    fs.pin();
                                });
                                message.reply("Vous avez créé une enchère sur " + msg.embeds[0].author.name + ".");
                            });
                        }else {
                            if(credits[message.author.id] !== undefined && credits[message.author.id] >= 1) {
                                credits[message.author.id] = credits[message.author.id] - 1;
                                await fs.writeFile(path.join(__dirname, "..", "credits.json"), JSON.stringify(credits,null,4), (err) => {
                                    if (err) console.log(err);
                                });

                                msg.startThread({name: "[A VENDRE] : " + msg.embeds[0].author.name}).then(thread =>{
                                    const first = thread.send("Ce personnage est à vendre. Pour enchérir, mettez simplement le prix dans le salon. Il n'est pas possible d'annuler une offre. L'enchère se termine au bout de 24h sans message. Vous pouvez ping <@" + message.author.id + "> si les enchères sont finis. \nEnchère minimume : dernière enchère + 50");
                                    first.then(fs => {
                                        fs.pin();
                                    });
                                    message.reply("Vous avez créé une enchère sur " + msg.embeds[0].author.name + ".");
                                });
                            }else {
                                message.reply("Vous n'avez pas assez de crédits pour créer une enchère, pour en obtenir plus, contactez <@297409548703105035>.");
                            }
                        }
                    }else {
                        message.reply("Vous devez être dans le salon #mudatrade pour lancer une enchère.");
                    }
                }else {
                    message.reply("Vous devez être dans le salon #mudatrade pour lancer une enchère.");
                }
            }else {
                message.reply("Vous devez être dans le salon #mudatrade pour lancer une enchère.");
            }
        }else {
            message.reply("Vous devez être dans le salon #mudatrade pour lancer une enchère.");
        }
    }
};
