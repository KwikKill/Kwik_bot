const fs = require("fs");
const path = require('path');
const { MessageEmbed, Interaction } = require('discord.js');

module.exports = {
    name: 'le',
    group: 'util',
	description: "gestion des messages dans le salon le",
    type: "messageCreate",
	place: "guild",
    options: undefined,
    commande_channel: true,
    async run(client, msg) {
        // rule not respected 
        phrases = [
            "D'où tu respecte pas les règles du salon le ?!",
            "Tu n'as pas respecté les règles du salon le !",
            "Je te jure, je vais te retrouver !",
            "Tu te fous de ma gueule ?",
            "Fais gaffe, je te vois",
            "Ah ouais ?",
            "bien frérot, tu sais lire, ça se voit",
            "J'espère que c'est une faute de frappe sinon c'est moi qui frappe.",
            "Fais gaffe, j'arrive chez toi.",
            "Je passe le bonjour de ta part à ta mère",
            "Ton insolence est une insulte à la république française",
            "Ton irrespect prend plus de place que le fiak de matt"
        ]


        if(msg.channel.name == "le") {
            if(msg.content.toLowerCase() != "le") {
                msg.delete()
                rd = getRandomInt(phrases.length)
                msg.author.send(phrases[rd])
            }
        }
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
