const fs = require("fs");
const https = require("https");
const path = require('path');
const { MessageEmbed } = require('discord.js');
const Canvas = require('canvas');
const ical = require('node-ical');

codes = {
	"a": "914,1033,426,411,395,383,377",
	"b": "1034,430,440,433,464,463",
	"c": "1035,562,559,521,501,499",
	"d": "1036,603,602,658,634,676",
	"e": "1037,690,689,697,696,695",
	"f": "1038,717,716,708,701,700",
	"g": "1039,729,727,726,721,720",
	"h": "1040,802,800,798,787,770",
	"i": "1326,1325,1324,1300,1298,2337,2329,2327,979,2000,1999,2075,2077,1042",
	"j": "2338,1780,978,2344,2343,1353,1333,1330,1317,1316,1314,2078,2081,1041",
	"k": "3194,818,3193,3192,812,811",
	"l": "1586,1617,1792,1963,3180,3179"
}

TD = ["MECANIQUE 2", "INFO", "CHIMIE 2", "ANALYSE 2", "ALGEBRE 2", "ELECTRICITE 2", "EPS", "CULTURE"]
LANGUES = ["LV2", "LV3", "ANGLAIS"]

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
		if(codes[interaction.options.getString("classe").toLowerCase()] == undefined) {
			interaction.reply("Cette classe n'existe pas, veuillez préciser un classe valide (A, B, C, ...)")
			return;
		}
		monday = new Date()
		monday.setDate(monday.getDate() - (monday.getDay() + 6) % 7);

		sunday = new Date(monday)
		sunday = new Date(sunday.setDate(sunday.getDate() + 4));

		//console.log(monday.toDateString())
		//console.log(sunday.toDateString())

		url_modified = url.replace("{0}", codes[interaction.options.getString("classe").toLowerCase()]).replace("{1}", monday.getUTCFullYear() + "-" + (monday.getUTCMonth() + 1) + "-" + monday.getUTCDate()).replace("{2}", sunday.getUTCFullYear() + "-" + (sunday.getUTCMonth() + 1) + "-" + sunday.getUTCDate())
			
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
		context.fillText("Lundi " + monday.getUTCDate() + "/" + (monday.getUTCMonth() + 1) + "/" + monday.getUTCFullYear(), 135, 34);
		day = new Date(monday)
		day.setDate(day.getDate() + 1);
		context.fillText("Mardi " + day.getUTCDate() + "/" + (day.getUTCMonth() + 1) + "/" + day.getUTCFullYear(), 440, 34);
		day.setDate(day.getDate() + 1);
		context.fillText("Mercredi " + day.getUTCDate() + "/" + (day.getUTCMonth() + 1) + "/" + day.getUTCFullYear(), 715, 34);
		day.setDate(day.getDate() + 1);
		context.fillText("Jeudi " + day.getUTCDate() + "/" + (day.getUTCMonth() + 1) + "/" + day.getUTCFullYear(), 1030, 34);
		day.setDate(day.getDate() + 1);
		context.fillText("Vendredi " + day.getUTCDate() + "/" + (day.getUTCMonth() + 1) + "/" + day.getUTCFullYear(), 1320, 34);
		
		const file = fs.createWriteStream("/opt/gab_bot/temp/file.ics");
		var request = https.get(url_modified, function(response) {
		   	 //console.log(response)
			response.pipe(file);
			file.on('finish', function() {
				file.close();
				const events = ical.sync.parseFile('/opt/gab_bot/temp/file.ics');
				
				di = {1:{}, 2:{}, 3:{}, 4:{}, 5:{}}
				for (const event of Object.values(events)) {
					start = new Date(event.start.toISOString())
					end = new Date(event.end.toISOString())
					
					if(di[start.getUTCDay()][start.getUTCHours() + "-" + start.getUTCMinutes()] == undefined) {
						di[start.getUTCDay()][start.getUTCHours() + "-" + start.getUTCMinutes()] = [{"summary": event.summary, "start": start, "end": end, "description": event.description}]
					}else {
						di[start.getUTCDay()][start.getUTCHours() + "-" + start.getUTCMinutes()].push({"summary": event.summary, "start": start, "end": end, "description": event.description})
					}
				}
				
				//console.log(di)
				
				for(const j in di) {
					for(const i in di[j]) {
						for(const h in di[j][i]) {
							start = di[j][i][h]["start"]
							end = di[j][i][h]["end"]
							summary = di[j][i][h]["summary"]
							description = di[j][i][h]["description"]
							
							duration = Math.abs(start - end);
										
							hours = Math.floor(duration / 3600000);
							duration -= hours * 3600000;
							minutes = Math.floor(duration / 60000);	
							
							width = 295/di[j][i].length
							if(summary.length > 40/di[j][i].length) {
								console.log(summary, di[j][i].length)
							}
							color = "yellow"
							if(summary.includes("ABCDE") || summary.includes("FGHKL")) {
							   color = "#99FFFF"
							}else {
								for(const y in TD) {
									if(summary.includes(TD[y])) {
										color = "#99FF99"
									}
								}
								for(const y in LANGUES) {
									if(summary.includes(LANGUES[y])) {
										color = "#80FF00"
									}
								}
								if(summary.includes("TP")) {
								   color = "#FFCCFF"
								}
							}

							//if(color == "yellow" and summary.includes("MECANIQUE 2") || ) {
							//   color = "yellow"
							//}
							
							context.beginPath();
							context.rect(Math.floor(47 + 297 * (start.getUTCDay() - 1) + width*h), Math.floor(40 + 45.2 * (start.getHours() - 7 + (start.getMinutes()/60))), width, Math.floor(45*(hours + (minutes/60))));
							context.fillStyle = color;
							context.fill();
							context.lineWidth = 2;
							context.strokeStyle = 'black';
							context.stroke();
							
							context.textAlign = "center"
							context.font = '12px sans-serif';
							context.fillStyle = '#000000';
							context.fillText(summary, (2*(Math.floor(47 + 297 * (start.getUTCDay() - 1) + width*h)) + Math.floor(45*(hours + (minutes/60))))/2, Math.floor(40 + 45.2 * (start.getHours() - 7 + (start.getMinutes()/60))) + 20, width);
						}
					}
				}
				
				
				interaction.reply({content: "Emploi du temp de la classe : " + interaction.options.getString("classe").toLowerCase(), files: [canvas.toBuffer()]})
			});
		}).on('error', function(err) {
			fs.unlink(dest);
			console.log(err.message)
		});
	}
    }
}

