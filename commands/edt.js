const fs = require("fs");
const https = require("https");
const path = require('path');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const Canvas = require('canvas');
const ical = require('node-ical');

codes = {
	"a": "348,2237",
	"b": "354,2241",
	"c": "356,2243",
	"d": "365,2239",
	"e": "367,2245",
	"f": "372,2246",
	"g": "374,2248",
	"h": "382,2249",
	"i": "2387,2394",
	"j": "2390,2397",
	"k": "389,2250",
	"l": "897,2221",
	"1a": "2444,396",
	"1b": "460,2445",
	"1c": "466,2446",
	"1d": "358,467",
	"1e": "2454,468",
	"1f": "2433,469",
	"1g": "491,2451",
	"1h": "2434,495",
	"1i": "1275,346",
	"1j": "892,1274",
	"1k": "496,2455",
	"1l": "795,1584",
	"raph": {
		// 1B
		"460,2445": [
			"ALGEBRE 1_ABCDE",
			"ALGEBRE 2_ABCDE",
			"ANALYSE 1_ABCDE",
			"ANALYSE 2_ABCDE",
			"ELECTRICITE 1_ABCDE",
			"ELECTRICITE 2_ABCDE",
			"MECANIQUE 1_ABCDE",
			"MECANIQUE 1_B",
			"OMSP ABCDE",
			"CHIMIE 1_ABCDE",
			"OPTIQUE_ABCDE",
			"PHYSIQUE_B",
			"THERMOPHYSIQUE_ABCDE"
		],
		// 1F
		"2433,469": [
			"ALGEBRE 1_F"
		],
		// 1K
		"496,2455": [
			"ANALYSE 1 (Base d'analyse réelle)_K"
		],
		// 2B
		"354,2241": [
			"SCIENCE INDUSTRIEL",
			"EPS-AB",
			"EPS AB - CHOIX des ACTIVITES & ORGANISATION ANNEE",
			"PARCOURS RIE",
		],
		// 2A
		"348,2237": [
			"LV2_A allemand",
			"#ANGLAIS_A"
		]
		
	}
}

TD = ["MECANIQUE 2", "INFO", "CHIMIE 2", "ANALYSE 2", "ALGEBRE 2", "ELECTRICITE 2", "EPS", "CULTURE", "CA"]
LANGUES = ["LV2", "LV3", "ANGLAIS"]

url = "https://ade.insa-rennes.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?resources={0}&projectId=1&calType=ical&firstDate={1}&lastDate={2}"

module.exports = {
	name: 'edt',
	group: 'INSA',
	description: "Permet de récupérer l'edt d'une classe",
	permission: "none",
	serverid: ["513776796211085342"],//, "890915473363980308"],
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
		await interaction.deferReply()
		if(codes[interaction.options.getString("classe").toLowerCase()] == undefined) {
			await interaction.editReply("Cette classe n'existe pas, veuillez préciser un classe valide (A, B, C, ...)")
			return;
		}
		today = new Date()
		//today = new Date(today.setDate(today.getDate() + 14));
		if(today.getDay() != 0 && today.getDay() != 6) {
			monday = new Date(today)
			monday.setDate(monday.getDate() - (monday.getDay() + 6) % 7);

			sunday = new Date(monday)
			sunday = new Date(sunday.setDate(sunday.getDate() + 4));
		}else {
			monday = new Date(today)
			monday.setDate(monday.getDate() + 7 - (monday.getDay() + 6) % 7);

			sunday = new Date(monday)
			sunday = new Date(sunday.setDate(sunday.getDate() + 4));
			
			console.log(monday, sunday)
		}
		if(interaction.options.getString("classe").toLowerCase() == "raph") {
			const canvas = Canvas.createCanvas(1530, 757);
			const context = canvas.getContext('2d');

			const background = await Canvas.loadImage('/opt/gab_bot/preset.png');
			context.drawImage(background, 0, 0, canvas.width, canvas.height);

			context.font = '15px sans-serif';

			// Select the style that will be used to fill the text in
			context.fillStyle = '#000000';

			// Actually fill the text with a solid color
			context.fillText("Semaine du " + monday.getDate() + "/" + (monday.getMonth() + 1) + "/" + monday.getFullYear(), 700, 16);
			context.fillText("Lundi " + monday.getDate() + "/" + (monday.getMonth() + 1) + "/" + monday.getFullYear(), 135, 34);
			day = new Date(monday)
			day.setDate(day.getDate() + 1);
			context.fillText("Mardi " + day.getDate() + "/" + (day.getMonth() + 1) + "/" + day.getFullYear(), 440, 34);
			day.setDate(day.getDate() + 1);
			context.fillText("Mercredi " + day.getDate() + "/" + (day.getMonth() + 1) + "/" + day.getFullYear(), 715, 34);
			day.setDate(day.getDate() + 1);
			context.fillText("Jeudi " + day.getDate() + "/" + (day.getMonth() + 1) + "/" + day.getFullYear(), 1030, 34);
			day.setDate(day.getDate() + 1);
			context.fillText("Vendredi " + day.getDate() + "/" + (day.getMonth() + 1) + "/" + day.getFullYear(), 1320, 34);

			di = {1:{}, 2:{}, 3:{}, 4:{}, 5:{}}
			test = []
			for(const x in codes[interaction.options.getString("classe").toLowerCase()]) {
				
				
				
				const file = fs.createWriteStream("/opt/gab_bot/temp/file" + x + ".ics");
				url_modified = url.replace("{0}", x).replace("{1}", monday.getUTCFullYear() + "-" + (monday.getUTCMonth() + 1) + "-" + monday.getUTCDate()).replace("{2}", sunday.getUTCFullYear() + "-" + (sunday.getUTCMonth() + 1) + "-" + sunday.getUTCDate())
				var request = https.get(url_modified, function(response) {
					response.pipe(file);
					file.on('finish', function() {
						file.close();
						const events = ical.sync.parseFile('/opt/gab_bot/temp/file' + x + '.ics');
	
						
						for (const event of Object.values(events)) {
							//console.log(x, event.summary)
							if(codes[interaction.options.getString("classe").toLowerCase()][x].includes(event.summary) || event.summary.includes("CC")) {
								start = new Date(event.start.toISOString())
								start.setHours(start.getHours() + 1)
								end = new Date(event.end.toISOString())
								end.setHours(end.getHours() + 1)
								
								

								if(di[start.getDay()][start.getHours() + "-" + start.getUTCMinutes()] == undefined) {
									di[start.getDay()][start.getHours() + "-" + start.getUTCMinutes()] = [{"summary": event.summary, "start": start, "end": end, "description": event.description, "location": event.location}]
								}else {
									a = false
									for(const x in di[start.getDay()][start.getHours() + "-" + start.getUTCMinutes()]) {
										if(di[start.getDay()][start.getHours() + "-" + start.getUTCMinutes()][x]["summary"] == event.summary) {
											a = true	
										}
									}
									if(a == false) {
										di[start.getDay()][start.getHours() + "-" + start.getUTCMinutes()].push({"summary": event.summary, "start": start, "end": end, "description": event.description, "location": event.location})
									}
								}
							}
						}

						test.push(x)
						if(test.length == Object.keys(codes[interaction.options.getString("classe").toLowerCase()]).length) {
							for(const j in di) {
								for(const i in di[j]) {
									for(const h in di[j][i]) {
										start = di[j][i][h]["start"]
										end = di[j][i][h]["end"]
										summary = di[j][i][h]["summary"]
										description = di[j][i][h]["description"]
										location = di[j][i][h]["location"]

										//console.log(description)

										description2 = description.trim()
										description2 = location + "\n" + description2
										description2 = description2.split("\n")
										description2 = description2.slice(0,description2.length - 1)

										description3 = ""
										duration = Math.abs(start - end);
										hours = Math.floor(duration / 3600000);
										duration -= hours * 3600000;
										minutes = Math.floor(duration / 60000);	

										if(hours + minutes/60 <= 1.5) {
											description3 = location
										}else {

											for(const y in description2) {
												if(!description2[y].includes("STPI") && !description2[y].includes("Grp") && !description2[y].includes("FIRE")) {

													description3 += description2[y] + "\n"
												}else {
													//console.log(description2[y])
												}
											}
										}




										//console.log(description3)



										width = 295/di[j][i].length
										if(summary.length > 45/di[j][i].length) {
											//console.log(summary, di[j][i].length)
										}
										color = "yellow"
										if(summary.includes("ABCDE") || summary.includes("FGHKL") || summary.includes("FGHJKL")) {
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
										context.rect(Math.floor(47 + 296.85 * (start.getDay() - 1) + width*h), Math.floor(40 + 45.2 * (start.getHours() - 7 + (start.getMinutes()/60))), width, Math.floor(45*(hours + (minutes/60))));
										context.fillStyle = color;
										context.fill();
										context.lineWidth = 2;
										context.strokeStyle = 'black';
										context.stroke();

										context.textAlign = "center"
										context.font = '12px sans-serif';
										context.fillStyle = '#000000';
										context.fillText(summary, (Math.floor(47 + 296.85 * (start.getDay() - 1) + width*h) + Math.floor(47 + 296.85 * (start.getDay() - 1) + width*h) + width)/2, Math.floor(40 + 45.2 * (start.getHours() - 7 + (start.getMinutes()/60))) + 15, width);

										context.textAlign = "center"
										context.font = '12px sans-serif';
										context.fillStyle = '#000000';
										context.fillText(description3, (Math.floor(47 + 296.85 * (start.getDay() - 1) + width*h) + Math.floor(47 + 296.85 * (start.getDay() - 1) + width*h) + width)/2, Math.floor(40 + 45.2 * (start.getHours() - 7 + (start.getMinutes()/60))) + 33 + Math.floor(8*(hours - 1 + (minutes/60))), width);

									}
								}
							}
							interaction.editReply({content: "Emploi du temp de la classe : " + interaction.options.getString("classe").toLowerCase(), files: [canvas.toBuffer()]})

						}

						
					});
				}).on('error', function(err) {
					fs.unlink(file);
					console.log(err.message)
				});
			}
			return;
		}

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
		context.fillText("Semaine du " + monday.getDate() + "/" + (monday.getMonth() + 1) + "/" + monday.getFullYear(), 700, 16);
		context.fillText("Lundi " + monday.getDate() + "/" + (monday.getMonth() + 1) + "/" + monday.getFullYear(), 135, 34);
		day = new Date(monday)
		day.setDate(day.getDate() + 1);
		context.fillText("Mardi " + day.getDate() + "/" + (day.getMonth() + 1) + "/" + day.getFullYear(), 440, 34);
		day.setDate(day.getDate() + 1);
		context.fillText("Mercredi " + day.getDate() + "/" + (day.getMonth() + 1) + "/" + day.getFullYear(), 715, 34);
		day.setDate(day.getDate() + 1);
		context.fillText("Jeudi " + day.getDate() + "/" + (day.getMonth() + 1) + "/" + day.getFullYear(), 1030, 34);
		day.setDate(day.getDate() + 1);
		context.fillText("Vendredi " + day.getDate() + "/" + (day.getMonth() + 1) + "/" + day.getFullYear(), 1320, 34);
		
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
					start.setHours(start.getHours() + 1)
					end = new Date(event.end.toISOString())
					end.setHours(end.getHours() + 1)
					
					if(di[start.getDay()][start.getHours() + "-" + start.getUTCMinutes()] == undefined) {
						di[start.getDay()][start.getHours() + "-" + start.getUTCMinutes()] = [{"summary": event.summary, "start": start, "end": end, "description": event.description, "location": event.location}]
					}else {
						di[start.getDay()][start.getHours() + "-" + start.getUTCMinutes()].push({"summary": event.summary, "start": start, "end": end, "description": event.description, "location": event.location})
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
							location = di[j][i][h]["location"]
							
							//console.log(description)
							
							description2 = description.trim()
							description2 = location + "\n" + description2
							description2 = description2.split("\n")
							description2 = description2.slice(0,description2.length - 1)
							
							description3 = ""
							duration = Math.abs(start - end);
							hours = Math.floor(duration / 3600000);
							duration -= hours * 3600000;
							minutes = Math.floor(duration / 60000);	
							
							if(hours + minutes/60 <= 1.5) {
								description3 = location
							}else {
															
								for(const y in description2) {
									if(!description2[y].includes("STPI") && !description2[y].includes("Grp") && !description2[y].includes("FIRE")) {
										
										description3 += description2[y] + "\n"
									}else {
										//console.log(description2[y])
									}
								}
							}
							
							
							
							
							//console.log(description3)
										

							
							width = 295/di[j][i].length
							if(summary.length > 45/di[j][i].length) {
								//console.log(summary, di[j][i].length)
							}
							color = "yellow"
							if(summary.includes("ABCDE") || summary.includes("FGHKL") || summary.includes("FGHJKL")) {
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
							context.rect(Math.floor(47 + 296.85 * (start.getDay() - 1) + width*h), Math.floor(40 + 45.2 * (start.getHours() - 7 + (start.getMinutes()/60))), width, Math.floor(45*(hours + (minutes/60))));
							context.fillStyle = color;
							context.fill();
							context.lineWidth = 2;
							context.strokeStyle = 'black';
							context.stroke();
							
							context.textAlign = "center"
							context.font = '12px sans-serif';
							context.fillStyle = '#000000';
							context.fillText(summary, (Math.floor(47 + 296.85 * (start.getDay() - 1) + width*h) + Math.floor(47 + 296.85 * (start.getDay() - 1) + width*h) + width)/2, Math.floor(40 + 45.2 * (start.getHours() - 7 + (start.getMinutes()/60))) + 15, width);
						
							context.textAlign = "center"
							context.font = '12px sans-serif';
							context.fillStyle = '#000000';
							context.fillText(description3, (Math.floor(47 + 296.85 * (start.getDay() - 1) + width*h) + Math.floor(47 + 296.85 * (start.getDay() - 1) + width*h) + width)/2, Math.floor(40 + 45.2 * (start.getHours() - 7 + (start.getMinutes()/60))) + 33 + Math.floor(8*(hours - 1 + (minutes/60))), width);

						}
					}
				}
				const attachment = new MessageAttachment(canvas.toBuffer(),'edt.png');
				console.log("a")

				let embed1 = new MessageEmbed()
				.setColor("0x757575")
				.setTitle("Emploi du temps : ")
				.setAuthor("KwikBot", client.user.avatarURL())//, 'https://github.com/KwikKill/Gab_bot')
				.setDescription(
					"Test de description."
				)
				.addFields([{
					name: "Semaine du b",
					value: "a"
				}])
				.setTimestamp()
    			.setImage(attachment);
				
				interaction.editReply({embeds: [embed1]});
				//interaction.editReply({content: "Emploi du temp de la classe : " + interaction.options.getString("classe").toLowerCase(), files: [canvas.toBuffer()]})
			});
		}).on('error', function(err) {
			fs.unlink(file);
			console.log(err.message)
		});
	}
    }
}
