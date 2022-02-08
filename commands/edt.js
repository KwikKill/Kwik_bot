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
		monday = getPreviousMonday()
		date = new Date(monday)
		console.log(date.toDateString())
	}
    }
}

function getPreviousMonday() {
  var date = new Date();
  if (date.getDay() != 0) {
    return new Date().setDate(date.getDate() - 7 - 6);
  } else {
    return new Date().setDate(date.getDate() - date.getDate() - 6);
  }
}
