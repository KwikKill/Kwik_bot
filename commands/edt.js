const fs = require("fs");
const path = require('path');
const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'edt',
	group: 'INSA',
	description: "Permet de récupérer l'edt d'une classe",
	permission: "none",
	serverid: ["513776796211085342", "890915473363980308"],
	hidden: false,
	place: "guild",
	deploy: true,
    help: [
        {
            "name": "- __edt <classe>__ :",
            "value": "envoie une image de l'emploi du temps de la classe demandé"
        },
    ],
	options: [
		{
			name: 'classe',
			description: 'classe',
			type: 'STRING',
			required: true,
		},
	],
    async run(message, client, interaction=undefined) {
	if(interaction != undefined) {
		monday = new Date()
		prevMonday.setDate(monday.getDate() - (monday.getDay() + 6) % 7);
		console.log(monday.toDateString())
	}
    }
}
