const fs = require("fs");
const https = require("https");
const path = require('path');
const { MessageEmbed } = require('discord.js');
const Canvas = require('canvas');
const ical = require('node-ical');

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

url = "https://edt.insa-rennes.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?resources={0}&projectId=22&calType=ical&firstDate={1}&lastDate={2}"

module.exports = {
	name: 'edt',
	group: 'INSA',
	description: "Permet de récupérer l'edt d'une classe",
	permission: "owner",
	serverid: ["513776796211085342", "890915473363980308"],
	hidden: false,
	place: "both",
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

		//console.log(monday.toDateString())
		//console.log(sunday.toDateString())

		url_modified = url.replace("{0}", codes[interaction.options.getString("classe")]).replace("{1}", monday.getUTCFullYear() + "-" + (monday.getUTCMonth() + 1) + "-" + monday.getUTCDate()).replace("{2}", sunday.getUTCFullYear() + "-" + (sunday.getUTCMonth() + 1) + "-" + sunday.getUTCDate())
			
		//ical.async.fromURL(url_modified, function(err, data) { 
		//	console.log(data);
		//});
		const canvas = Canvas.createCanvas(1530, 757);
		const context = canvas.getContext('2d');
				
		const background = await Canvas.loadImage('/opt/gab_bot/preset.png');
		context.drawImage(background, 0, 0, canvas.width, canvas.height);
		
		context.font = '15px sans-serif';

		// Select the style that will be used to fill the text in
		context.fillStyle = '#000000';

		// Actually fill the text with a solid color
		context.fillText("Semaine du " + monday.getUTCDate() + "/" + (monday.getUTCMonth() + 1) + "/" + monday.getUTCFullYear(), 700, 16);
		tuesday = new Date(monday + 1000*60*60*24)
		context.fillText("Lundi " + tuesday.getUTCDate() + "/" + (tuesday.getUTCMonth() + 1) + "/" + tuesday.getUTCFullYear(), 200, 30);
		
		const file = fs.createWriteStream("/opt/gab_bot/temp/file.ics");
		var request = https.get(url_modified, function(response) {
		   	 //console.log(response)
			response.pipe(file);
			file.on('finish', function() {
				file.close();
				const events = ical.sync.parseFile('/opt/gab_bot/temp/file.ics');
				
				//console.log(events)
				for (const event of Object.values(events)) {
					
				    /*console.log(
					'Summary: ' + event.summary +
					'\nDescription: ' + event.description +
					'\nStart Date: ' + event.start.toISOString() +
					'\n'
				    );*/
					start = new Date(event.start.toISOString())
					end = new Date(event.end.toISOString())
					
					
					
					//console.log(event.start.toISOString())
					//console.log(event.end.toISOString())
					
					duration = Math.abs(start - end);
										
					hours = Math.floor(duration / 3600000);
					duration -= hours * 3600000;
					minutes = Math.floor(duration / 60000);					
					
					//console.log(Math.floor(47 + 297 * (start.getUTCDay() - 1)))
					//console.log(Math.floor(40 + 45.2 * (start.getHours() - 7 + (start.getMinutes()/60))))
					//console.log(Math.floor(295*(hours + (minutes/60))))
					
					context.beginPath();
					context.rect(Math.floor(47 + 297 * (start.getUTCDay() - 1)), Math.floor(40 + 45.2 * (start.getHours() - 7 + (start.getMinutes()/60))), 295, Math.floor(43*(hours + (minutes/60))));
					context.fillStyle = 'yellow';
					context.fill();
					context.lineWidth = 2;
					context.strokeStyle = 'black';
					context.stroke();
					
					
				};
				interaction.reply({content: "Emploi du temp de la classe : " + interaction.options.getString("classe"), files: [canvas.toBuffer()]})
			});
		}).on('error', function(err) {
			fs.unlink(dest);
			console.log(err.message)
		});
	}
    }
}

