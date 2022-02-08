const fs = require("fs");
var http = require('http');
const path = require('path');
const { MessageEmbed } = require('discord.js');

codes = {
	"A": "914,1033,426,411,395,383,377",
	"B": "1034,430,440,433,464,463",
	"C": "1035,562,559,521,501,499",
	"D": "1036,603,602,658,634,676",
	"E": "1037,690,689,697,696,695",
	"F": "1038,717,716,708,701,700",
	"G": "1039,729,727,726,721,720",
	"H": "1040,802,800,798,787,770",
	"I": "1326,1325,1324,1300,1298,2337,2329,2327,979,2000,1999,2075,2077,1042",
	"J": "2338,1780,978,2344,2343,1353,1333,1330,1317,1316,1314,2078,2081,1041",
	"K": "3194,818,3193,3192,812,811",
	"L": "1586,1617,1792,1963,3180,3179"
}

url = "http://edt.insa-rennes.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?resources={0}&projectId=22&calType=ical&firstDate={1}&lastDate={2}"

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
		if(codes[interaction.options.getString("classe")] == undefined) {
			interaction.reply("Cette classe n'existe pas, veuillez préciser un classe valide (A, B, C, ...)")
			return;
		}
		monday = new Date()
		monday.setDate(monday.getDate() - (monday.getDay() + 6) % 7);

		sunday = new Date(monday)
		sunday = new Date(sunday.setDate(sunday.getDate() + 4));

		console.log(monday.toDateString())
		console.log(sunday.toDateString())

		url_modified = url.replace("{0}", codes[interaction.options.getString("classe")]).replace("{1}", monday.getUTCFullYear() + "-" + (monday.getUTCMonth() + 1) + "-" + monday.getUTCDate()).replace("{2}", sunday.getUTCFullYear() + "-" + (sunday.getUTCMonth() + 1) + "-" + sunday.getUTCDate())
		
		console.log(url_modified)
		const file = fs.createWriteStream("/opt/gab_bot/temp/file.ics");
		console.log(__filename)
		var request = http.get(url_modified, function(response) {
		   	 //console.log(response)
			response.pipe(file);
		});
	}
    }
}
