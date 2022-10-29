const PDFDocument = require('pdfkit');

module.exports = {
    name: 'pret',
    group: 'mudae',
    description: "Commande de création de contrat d'emprunt",
    permission: "owner",
    serverid: ["513776796211085342", "480142959501901845"],
    hidden: false,
    help: [
        {
            "name": "- __prêt <@user> <somme> <interet>__ :",
            "value": "Permet de génerer un contrat d'emprunt."
        }
    ],
    place: "guild",
    options: [
        {
            name: 'user',
            description: 'utilisateur qui emprunte',
            type: 'USER',
            required: true,
        },
        {
            name: 'somme',
            description: 'somme a emprunter',
            type: 'INTEGER',
            required: true,
        },
        {
            name: 'interet',
            description: 'interêt de l\'emprunt',
            type: 'INTEGER',
            required: true,
        },
    ],
    async run(message, client, interaction = undefined) {
        if (interaction === undefined) return;
        if (interaction.channel.name !== "muda-industry") return;

        const date = new Date();
        const today = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

        const user = interaction.options.getMember("user");
        const somme = parseInt(interaction.options.getInteger("somme"));
        const interet = parseInt(interaction.options.getInteger("interet"));

        const nom = user.user.username;

        let somme_interet = interet / 100 * somme;
        let time;
        if (somme <= 1000) {
            time = 1;
        } else {
            time = 1.9 * Math.log(somme / 1000) + Math.exp(somme / 11000);
        }
        if (somme_interet === 0) {
            somme_interet = 1;
        }

        const text1 = (
            "Le présent contrat entre la Kiwi Industry et "
            + nom
            + ", est un contrat de prêt régulé par plusieurs règles et conditions énumérées ci-dessous. Le non-respect des obligations de chaque partie donnera lieu à des réparations spécifiées dans le présent contrat. Ce contrat prend effet après la lecture et la signature du présent contrat par les deux partie."
        );
        const text2 = (
            "- Condition n°1 : La Kiwi Industry s’engage à envoyer sans délai la somme de "
            + somme
            + " kakeras en accord avec la valeur des besoins du client et sur laquelle les deux parties sont tombées d’accord. Le non-respect de cette condition entrainera l’annulation du contrat."
        );
        let text3;
        if (somme >= 200) {
            text3 = (
                "- Condition n°2 : "
                + nom
                + " s’engage à rembourser une somme de "
                + somme
                + " kakera dans les délais précisé en condition 4. Le non-respect de cette condition entrainera une augmentation du délai d’une semaine, des intérêts de 5% jusqu’à une date maximum correspondant au délai initial plus 4 semaine. La Kiwi Industry ne fera aucun rappel de date et ne tolèrera aucun dépassement de date, quelle qu’en soit la raison. Le remboursement de la somme avant la fin du délai met fin au contrat."
            );
        } else {
            text3 = (
                "- Condition n°2 : "
                + nom
                + " s’engage à rembourser une somme de "
                + somme
                + " kakera dans les délais précisé en condition 4. Le non-respect de cette condition entrainera une augmentation du délai d’une semaine, de la somme à rembourser de 100 jusqu’à une date maximum correspondant au délai initial plus 4 semaine. La Kiwi Industry ne fera aucun rappel de date et ne tolèrera aucun dépassement de date, quelle qu’en soit la raison. Le remboursement de la somme avant la fin du délai met fin au contrat."
            );
        }

        const text4 = (
            "- Condition n°3 : "
            + nom
            + " s’engage à payer, en plus de la somme empruntée une somme correspondant à "
            + Math.floor(interet)
            + "% d’intérêt soit "
            + Math.floor(somme_interet)
            + " kakeras. Le non-respect de cette condition entrainera une augmentation du délai d’une semaine, des intérêts de 5% jusqu’à un délai maximum correspondant au délai initial plus 4 semaine."
        );
        const text5 = (
            "- Condition n°4 : "
            + nom
            + " s’engage à rembourser la somme dû dans un délai légal de "
            + Math.floor(time)
            + " semaines, calculé selon la taille de l’emprunt. Le non-respect de cette condition entrainera une augmentation du délai d’une semaine, des intérêts de 5% jusqu’à un maximum correspondant au délai initial plus 4 semaine. "
        );
        const text6 = (
            "- Condition n°5 : "
            + nom
            + " s’engage à rembourser la somme dû dans un délai maximum de "
            + Math.floor(time + 4)
            + " semaines. Le non-respect de cette condition entrainera une saisie de la totalité de l’argent du client ainsi qu’un nombre au choix de personnage du harem du client."
        );
        const text7 = (
            "- Condition n°6 : En cas de don de plus de la majorité de son capital en kakera à quelqu'un ou de don de plus de la moitié de ses personnages ou en cas d'impossibilité de remboursement suite à un don, "
            + nom
            + " s'engage à rembourser son prêt avant ce don. En cas d'oublie ou de refus, le bénéficiare du don est chargé du remboursement du prêt sous les mêmes conditions."
        );
        const text8 = (
            "Signature Kiwi Industry : KwikKill (Président de la Kiwi Industry)\nSignature "
            + nom
            + " : répondez au message par « lu et approuvé »)"
        );

        //path2 = __dirname + "/../contrats/contrat-" + today.replace("/", "-").replace("/", "-") + "-" + nom + ".pdf"

        const doc = new PDFDocument();

        const buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {

            const pdfData = Buffer.concat(buffers);
            interaction.reply({ content: "<@" + user.user.id + ">, voici votre contrat d'emprunt de " + somme + " kakera à " + interet + "% d'interêts. Lisez les conditions et répondez \"lu et approuvé\" pour accepter.", files: [{ attachment: pdfData, name: "contrat-" + today.replace("/", "-").replace("/", "-") + "-" + nom + ".pdf" }] });


        });

        doc
            .fontSize(11)
            .text(today);


        doc.moveDown();
        doc
            .fontSize(15)
            .text(("CONTRAT DE PRÊT – KIWI INDUSTRY – " + nom + ":").toUpperCase(), { width: 450, align: 'center' });

        doc.moveDown();
        doc
            .fontSize(11)
            .text(text1, { width: 450, align: 'justify' });

        doc.moveDown();
        doc
            .fontSize(11)
            .text("Liste des conditions du contrat :", { width: 450, align: 'center' });

        doc.moveDown();
        doc
            .fontSize(11)
            .text(text2, { width: 450, align: 'justify' });

        doc.moveDown();
        doc
            .fontSize(11)
            .text(text3, { width: 450, align: 'justify' });

        doc.moveDown();
        doc
            .fontSize(11)
            .text(text4, { width: 450, align: 'justify' });

        doc.moveDown();
        doc
            .fontSize(11)
            .text(text5, { width: 450, align: 'justify' });

        doc.moveDown();
        doc
            .fontSize(11)
            .text(text6, { width: 450, align: 'justify' });

        doc.moveDown();
        doc
            .fontSize(11)
            .text(text7, { width: 450, align: 'justify' });

        doc.moveDown();
        doc
            .fontSize(11)
            .text(text8, { width: 450, align: 'justify' });

        await doc.end();

    }
};
