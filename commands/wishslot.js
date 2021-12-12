const fs = require("fs");
const path = require('path');
const { MessageEmbed } = require('discord.js');
const config = require('../config.json');
const credits = require('../credits.json');
const PDFDocument = require('pdfkit');

module.exports = {
	name: 'wishslot',
	group: 'mudae',
	description: "Permet de faire une demande de contrat de location de slot de wish",
	permission: "none",
	hidden: false,
    deploy: false,
	place: "guild",
    help: [
        {
            "name": "- __wishslot__ :",
            "value": "Fait une demande de contrat de location de slot de wish."
        },
    ],
    async run(message, client, interaction=undefined) {
        msg = await message.channel.messages.fetch(message.reference.messageId)
        if(msg.embeds[0] == undefined) {
            message.reply("Ce message n'est pas un `$im` de mudae.")
            return
        }
        if(msg.channel.name == "muda-industry") {
            if(msg.embeds[0].description.includes("female") && msg.embeds[0].description.includes("Game")) {
                date = new Date();
                today = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

                perso = msg.embeds[0].author.name;
                user = message.author
                somme = parseInt(msg.embeds[0].description.split("**")[1]);

                nom = user.username;

                prix = 1000 + somme
                    
                text1 = (
                    "Le présent contrat entre la Kiwi Industry et "
                    + nom
                    + ", est un contrat de prêt de slot de wishlist régulé par plusieurs règles et conditions énumérées ci-dessous. Le non-respect des obligations de chaque partie donnera lieu à des réparations spécifiées dans le présent contrat. Ce contrat prend effet après la lecture et la signature du présent contrat par les deux partie.\n /!\\ Ce contrat ne témoigne pas de l'acceptation automatique de la Kwiwi Industry. Vous devrez attendre sa présence pour considérer ce contrat valable /!\\."
                )
                text2 = (
                    "- Condition n°1 : La Kiwi Industry s’engage à mettre dans sa wishlist "
                    + perso
                    + " en accord avec la demande du client. Le non-respect de cette condition entrainera l’annulation du contrat."
                )
                text3 = (
                    "- Condition n°2 : "
                    + nom
                    + " s’engage à payer une somme de "
                    + prix
                    + " kakera à la signature du contrat et tous les 7 jours. Le non-respect de cette condition entrainera un rappel à l'ordre ainsi qu'une amende de 100 par jour de non paiement."
                )

                text4 = (
                    "- Condition n°3 : "
                    + nom
                    + " peut à tous moment mettre fin au contrat mais la semaine en cours serra considée comme dû et payé."
                )
                text5 = (
                    "- Condition n°4 : La Kiwi Industry peut à la fin de chaques semaines mettre fin au contrat sans transmettre de raison."
                )
                text6 = (
                    "- Condition n°5 : En cas d'incapacité de payer suite à un don, "
                    + nom
                    + " s'engage à rembourser ses dettes avant ce don. En cas d'oublie ou de refus, le bénéficiare du don est chargé du remboursement des dettes sous les mêmes conditions."
                )
                text7 = (
                    "- Condition n°5 : La Kiwi Industry d'engage à donner "
                    + perso
                    + " en cas de drop. Tout manquement à cette condition se verra suivre d'un procès équitable auprès du conseil des 5."
                )
                text8 = (
                    "Signature Kiwi Industry : KwikKill (Président de la Kiwi Industry)\nSignature "
                    + nom
                    + " : répondez au message par « lu et approuvé »)"
                )
                    
                //path2 = __dirname + "/../contrats/contrat-" + today.replace("/", "-").replace("/", "-") + "-" + nom + ".pdf"

                const doc = new PDFDocument();

                let buffers = [];
                doc.on('data', buffers.push.bind(buffers));
                doc.on('end', () => {
                    let pdfData = Buffer.concat(buffers);
                    message.reply({content: "<@" + user.id + ">, voici votre contrat de location de slot de wish pour **" + perso + "**. Lisez les conditions et répondez \"lu et approuvé\" pour accepte\n /!\\ Ce contrat ne prendra effet qu'après acceptation de la Kiwi Industry /!\\ .", files: [  { attachment: pdfData, name: "contrat-" + today.replace("/", "-").replace("/", "-") + "-" + nom + ".pdf" } ]});
                });

                doc
                .fontSize(11)
                .text(today);


                doc.moveDown();
                doc
                .fontSize(15)
                .text(("CONTRAT DE WISHSLOT – KIWI INDUSTRY – " + nom + ":").toUpperCase(), {width: 450, align: 'center'});

                doc.moveDown();
                doc
                .fontSize(11)
                .text(text1, {width: 450, align: 'justify'});

                doc.moveDown();
                doc
                .fontSize(11)
                .text("Liste des conditions du contrat :", {width: 450, align: 'center'});

                doc.moveDown();
                doc
                .fontSize(11)
                .text(text2, {width: 450, align: 'justify'});

                doc.moveDown();
                doc
                .fontSize(11)
                .text(text3, {width: 450, align: 'justify'});

                doc.moveDown();
                doc
                .fontSize(11)
                .text(text4, {width: 450, align: 'justify'});

                doc.moveDown();
                doc
                .fontSize(11)
                .text(text5, {width: 450, align: 'justify'});

                doc.moveDown();
                doc
                .fontSize(11)
                .text(text6, {width: 450, align: 'justify'});

                doc.moveDown();
                doc
                .fontSize(11)
                .text(text7, {width: 450, align: 'justify'});

                doc.moveDown();
                doc
                .fontSize(11)
                .text(text8, {width: 450, align: 'justify'});

                await doc.end();
            }else {
                message.reply("KwikKill n'accepte que la location de slot de wishlist pour des personnages de type `wg`.")
            }
        }
    }
}
