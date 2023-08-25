const fs = require("fs");
const https = require("https");
const { MessageEmbed, MessageAttachment, MessageActionRow, MessageButton } = require('discord.js');
const Canvas = require('canvas');
const ical = require('node-ical');


const codes = {
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

    "2a": "348,2237",
    "2b": "354,2241",
    "2c": "356,2243",
    "2d": "365,2239",
    "2e": "367,2245",
    "2f": "372,2246",
    "2g": "374,2248",
    "2h": "382,2249",
    "2i": "2387,2394",
    "2j": "2390,2397",
    "2k": "389,2250",
    "2l": "897,2221",

    "3info": "1212,1213",
    "3et": "1017,1023",
    "3eii": "1132,1131",
    "3gcu": "1152,1153",
    "3gma": "1182,1183",
    "3gpm": "1242,1243",
    "3ma": "31,3768",

    "4info": "1214,1215",
    "4et": "1057,1058",
    "4eii": "1133,1134",
    "4gcu": "1154,1155",
    "4gma": "1184,1185",
    "4gpm": "1244,1245",
    "4ma": "37,3770",

    "5info": "1216,1217",
    "5et": "1072,1110",
    "5eii": "1135,1136",
    "5gcu": "1156,1157",
    "5gma": "1186,1187",
    "5gpm": "1246,1247",
    "5ma": "1536,1982",

    "postec": "408",
};

const TD = ["MECANIQUE 2", "INFO", "CHIMIE 2", "ANALYSE 2", "ALGEBRE 2", "ELECTRICITE 2", "EPS", "CULTURE", "CA"];
const LANGUES = ["LV2", "LV3", "ANGLAIS", "ALLEMAND", "ESPAGNOL", "ITALIEN", "CHINOIS", "JAPONAIS", "RUSSE", "ARABE", "PORTUGAIS"];

const url = "https://ade.insa-rennes.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?resources={0}&projectId=1&calType=ical&firstDate={1}&lastDate={2}";

module.exports = {
    name: 'edt',
    group: 'INSA',
    description: "Permet de récupérer l'edt d'une classe",
    permission: "none",
    serverid: ["513776796211085342", "890915473363980308", "671289237982806026"],
    hidden: false,
    place: "both",
    deploy: true,
    options: [
        {
            name: 'classe',
            description: 'classe',
            type: 'STRING',
            required: true,
            autocomplete: true,
        },
    ],
    async run(message, client, interaction = undefined) {
        client.pg.query({
            name: "insert-logs",
            text: "INSERT INTO logs (date, discordid, command, args, serverid) VALUES ($1, $2, $3, $4, $5)",
            values: [
                new Date(),
                interaction.user.id,
                "edt",
                JSON.stringify({
                    classe: interaction.options.getString("classe").toLowerCase()
                }),
                interaction.guild.id
            ]
        });
        if (interaction !== undefined) {
            // deferReply is necessary to send a delayed response
            await interaction.deferReply();
            // check if the class exists
            if (codes[interaction.options.getString("classe").toLowerCase()] === undefined) {
                await interaction.editReply("Cette classe n'existe pas, veuillez préciser un classe valide (A, B, C, ...)");
                return;
            }
            // get the date
            const today = new Date();
            let monday;
            let sunday;
            if (today.getDay() !== 0 && today.getDay() !== 6) {
                monday = new Date(today);
                monday.setDate(monday.getDate() - (monday.getDay() + 6) % 7);

                sunday = new Date(monday);
                sunday = new Date(sunday.setDate(sunday.getDate() + 4));
            } else {
                monday = new Date(today);
                monday.setDate(monday.getDate() + 7 - (monday.getDay() + 6) % 7);

                sunday = new Date(monday);
                sunday = new Date(sunday.setDate(sunday.getDate() + 4));

                console.log(monday, sunday);
            }
            // if it's for raph the bg
            if (interaction.options.getString("classe").toLowerCase() === "raph") {
                await create_di_raph(client, monday, sunday, interaction);
                return;
                // or for the lambda people
            }
            await classic(client, monday, sunday, interaction);

        }
    },
    async autocomplete(client, interaction) {
        const focusedValue = interaction.options.getFocused();
        const values = [];
        for (const x in codes) {
            if (x.toLowerCase().startsWith(focusedValue.toLowerCase()) && values.length < 25) {
                values.push({
                    name: x,
                    value: x
                });
            }
        }
        return await interaction.respond(values);
    },
    create_di,
    generate_canvas,
    create_di_raph,
    classic,
    codes
};

async function classic(client, monday, sunday, interaction, rt = false) {
    let arg;
    if (rt !== false) {
        arg = rt;
    } else {
        arg = interaction.options.getString("classe").toLowerCase();
    }
    const url_modified = url.replace("{0}", codes[arg]).replace("{1}", monday.getFullYear() + "-" + (monday.getMonth() + 1) + "-" + monday.getDate()).replace("{2}", sunday.getFullYear() + "-" + (sunday.getMonth() + 1) + "-" + sunday.getDate());
    console.log(url_modified);

    const file = fs.createWriteStream("/opt/gab_bot/temp/file.ics");
    https.get(url_modified, function (response) {
        //console.log(response)
        response.pipe(file);
        file.on('finish', function () {
            file.close();
            const events = ical.sync.parseFile('/opt/gab_bot/temp/file.ics');

            const di = create_di(events);

            //console.log(di)

            generate_canvas(di, monday).then(canvas => {
                const attachment = new MessageAttachment(canvas.toBuffer(), 'edt.png');

                const embed1 = new MessageEmbed()
                    .setColor("0x757575")
                    .setTitle("Emploi du temps de la classe : " + arg)
                    .setAuthor("KwikBot", client.user.avatarURL())//, 'https://github.com/KwikKill/Gab_bot')
                    .setDescription(
                        "Semaine du " + monday.getFullYear() + "-" + (monday.getMonth() + 1) + "-" + monday.getDate() + " au " + sunday.getFullYear() + "-" + (sunday.getMonth() + 1) + "-" + sunday.getDate()
                    )
                    .setTimestamp()
                    .setImage(`attachment://edt.png`);

                const row = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('lastweek')
                            .setLabel('◀️')
                            .setStyle('PRIMARY'),
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId('nextweek')
                            .setLabel('▶️')
                            .setStyle('PRIMARY'),
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId('lastclass')
                            .setLabel('⏮️')
                            .setStyle('PRIMARY'),
                    )
                    .addComponents(
                        new MessageButton()
                            .setCustomId('nextclass')
                            .setLabel('⏭️')
                            .setStyle('PRIMARY'),
                    );

                if (rt === false) {
                    interaction.editReply({ embeds: [embed1], files: [attachment], components: [row] });
                } else {
                    interaction.message.edit({ embeds: [embed1], files: [attachment], components: [row] });
                }
            });
        });
    }).on('error', function (err) {
        fs.unlink(file);
        console.log(err.message);
    });
}

function create_di(events) {
    const di = { 0: {}, 1: {}, 2: {}, 3: {}, 4: {}, 5: {}, 6: {} };
    for (const event of Object.values(events)) {
        const start = new Date(event.start.toISOString());
        start.setHours(start.getHours() - 1);
        const end = new Date(event.end.toISOString());
        end.setHours(end.getHours() - 1);

        if (di[start.getDay()][start.getHours() + "-" + start.getMinutes()] === undefined) {
            di[start.getDay()][start.getHours() + "-" + start.getMinutes()] = [{ "summary": event.summary, "start": start, "end": end, "description": event.description, "location": event.location }];
        } else {
            di[start.getDay()][start.getHours() + "-" + start.getMinutes()].push({ "summary": event.summary, "start": start, "end": end, "description": event.description, "location": event.location });
        }

    }
    return di;
}

async function create_di_raph(client, monday, sunday, interaction, rt = false) {
    let arg;
    if (rt !== false) {
        arg = rt;
    } else {
        arg = interaction.options.getString("classe").toLowerCase();
    }
    const di = { 1: {}, 2: {}, 3: {}, 4: {}, 5: {} };
    const test = [];
    for (const x in codes[arg]) {
        const file = fs.createWriteStream("/opt/gab_bot/temp/file" + x + ".ics");
        const url_modified = url.replace("{0}", x).replace("{1}", monday.getFullYear() + "-" + (monday.getMonth() + 1) + "-" + monday.getDate()).replace("{2}", sunday.getFullYear() + "-" + (sunday.getMonth() + 1) + "-" + sunday.getDate());
        https.get(url_modified, function (response) {
            response.pipe(file);
            file.on('finish', function () {
                file.close();
                const events = ical.sync.parseFile('/opt/gab_bot/temp/file' + x + '.ics');


                for (const event of Object.values(events)) {
                    if (codes[arg][x].includes(event.summary) ||
                        event.summary.includes("CC") ||
                        event.summary.includes("RIE") ||
                        event.summary.includes("PPI")
                    ) {
                        const start = new Date(event.start.toISOString());
                        start.setHours(start.getHours() - 1);
                        const end = new Date(event.end.toISOString());
                        end.setHours(end.getHours() - 1);



                        if (di[start.getDay()][start.getHours() + "-" + start.getMinutes()] === undefined) {
                            di[start.getDay()][start.getHours() + "-" + start.getMinutes()] = [{ "summary": event.summary, "start": start, "end": end, "description": event.description, "location": event.location }];
                        } else {
                            let a = false;
                            for (const x in di[start.getDay()][start.getHours() + "-" + start.getMinutes()]) {
                                if (di[start.getDay()][start.getHours() + "-" + start.getMinutes()][x]["summary"] === event.summary) {
                                    a = true;
                                }
                            }
                            if (a === false) {
                                di[start.getDay()][start.getHours() + "-" + start.getMinutes()].push({ "summary": event.summary, "start": start, "end": end, "description": event.description, "location": event.location });
                            }
                        }
                    }
                }

                test.push(x);
                if (test.length === Object.keys(codes[arg]).length) {
                    generate_canvas(di, monday).then(canvas => {
                        const attachment = new MessageAttachment(canvas.toBuffer(), 'edt.png');

                        const embed1 = new MessageEmbed()
                            .setColor("0x757575")
                            .setTitle("Emploi du temps de la classe : " + arg)
                            .setAuthor("KwikBot", client.user.avatarURL())//, 'https://github.com/KwikKill/Gab_bot')
                            .setDescription(
                                "Semaine du " + monday.getFullYear() + "-" + (monday.getMonth() + 1) + "-" + monday.getDate() + " au " + sunday.getFullYear() + "-" + (sunday.getMonth() + 1) + "-" + sunday.getDate()
                            )
                            .setTimestamp()
                            .setImage(`attachment://edt.png`);

                        const row = new MessageActionRow()
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('lastweek')
                                    .setLabel('◀️')
                                    .setStyle('PRIMARY'),
                            )
                            .addComponents(
                                new MessageButton()
                                    .setCustomId('nextweek')
                                    .setLabel('▶️')
                                    .setStyle('PRIMARY'),
                            );
                        if (rt === false) {
                            interaction.editReply({ embeds: [embed1], files: [attachment], components: [row] });
                        } else {
                            interaction.message.edit({ embeds: [embed1], files: [attachment], components: [row] });
                        }
                        //interaction.editReply({content: "Emploi du temp de la classe : " + interaction.options.getString("classe").toLowerCase(), files: [canvas.toBuffer()]})

                    }
                    );
                }


            });
        }).on('error', function (err) {
            fs.unlink(file);
            console.log(err.message);
        });
    }
}

async function generate_canvas(di, monday) {
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
    const day = new Date(monday);
    day.setDate(day.getDate() + 1);
    context.fillText("Mardi " + day.getDate() + "/" + (day.getMonth() + 1) + "/" + day.getFullYear(), 440, 34);
    day.setDate(day.getDate() + 1);
    context.fillText("Mercredi " + day.getDate() + "/" + (day.getMonth() + 1) + "/" + day.getFullYear(), 715, 34);
    day.setDate(day.getDate() + 1);
    context.fillText("Jeudi " + day.getDate() + "/" + (day.getMonth() + 1) + "/" + day.getFullYear(), 1030, 34);
    day.setDate(day.getDate() + 1);
    context.fillText("Vendredi " + day.getDate() + "/" + (day.getMonth() + 1) + "/" + day.getFullYear(), 1320, 34);

    for (const j in di) {
        if (j === 0 || j === 6) {
            continue;
        }
        for (const i in di[j]) {
            for (const h in di[j][i]) {
                const start = di[j][i][h]["start"];
                const end = di[j][i][h]["end"];
                const summary = di[j][i][h]["summary"];
                const description = di[j][i][h]["description"];
                const location = di[j][i][h]["location"];

                //console.log(description)

                let description2 = description.trim();
                description2 = location + "\n" + description2;
                description2 = description2.split("\n");
                description2 = description2.slice(0, description2.length - 1);

                let description3 = "";
                let duration = Math.abs(start - end);
                const hours = Math.floor(duration / 3600000);
                duration -= hours * 3600000;
                const minutes = Math.floor(duration / 60000);

                if (hours + minutes / 60 <= 1.5) {
                    description3 = location;
                } else {

                    for (const y in description2) {
                        if (!description2[y].includes("STPI") && !description2[y].includes("Grp") && !description2[y].includes("FIRE")) {

                            description3 += description2[y] + "\n";
                        } else {
                            //console.log(description2[y])
                        }
                    }
                }




                //console.log(description3)



                const width = 295 / di[j][i].length;
                if (summary.length > 45 / di[j][i].length) {
                    //console.log(summary, di[j][i].length)
                }
                let color = "yellow";
                if (summary.includes("ABCDE") || summary.includes("FGHKL") || summary.includes("FGHJKL")) {
                    color = "#99FFFF";
                } else {
                    for (const y in TD) {
                        if (summary.includes(TD[y])) {
                            color = "#99FF99";
                        }
                    }
                    for (const y in LANGUES) {
                        if (summary.includes(LANGUES[y])) {
                            color = "#80FF00";
                        }
                    }
                    if (summary.includes("TP")) {
                        color = "#FFCCFF";
                    }
                }

                //if(color === "yellow" and summary.includes("MECANIQUE 2") || ) {
                //   color = "yellow"
                //}

                context.beginPath();
                context.rect(Math.floor(47 + 296.85 * (start.getDay() - 1) + width * h), Math.floor(40 + 45.2 * (start.getHours() - 7 + (start.getMinutes() / 60))), width, Math.floor(45 * (hours + (minutes / 60))));
                context.fillStyle = color;
                context.fill();
                context.lineWidth = 2;
                context.strokeStyle = 'black';
                context.stroke();

                context.textAlign = "center";
                context.font = '12px sans-serif';
                context.fillStyle = '#000000';
                context.fillText(summary, (Math.floor(47 + 296.85 * (start.getDay() - 1) + width * h) + Math.floor(47 + 296.85 * (start.getDay() - 1) + width * h) + width) / 2, Math.floor(40 + 45.2 * (start.getHours() - 7 + (start.getMinutes() / 60))) + 15, width);

                context.textAlign = "center";
                context.font = '12px sans-serif';
                context.fillStyle = '#000000';
                context.fillText(description3, (Math.floor(47 + 296.85 * (start.getDay() - 1) + width * h) + Math.floor(47 + 296.85 * (start.getDay() - 1) + width * h) + width) / 2, Math.floor(40 + 45.2 * (start.getHours() - 7 + (start.getMinutes() / 60))) + 33 + Math.floor(8 * (hours - 1 + (minutes / 60))), width);

            }
        }
    }

    return canvas;
}
