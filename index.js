const { Client, RichEmbed, Util} = require('discord.js');
const YouTube = require('simple-youtube-api');
const config = require('./config.json');
const ytdl = require('ytdl-core-discord');
const fs = require("fs");

const client = new Client();

const youtube = new YouTube(process.env.GOOGLE_API_KEY);
const queue = new Map();

vote_nothing = []; // used
votemort = false; // used
vote_mort = false; // used
vote_maire = false; // used
waitchasse = false; // used
day = 0 // used
state = "off"; // used
cycle = "night" // used
village = null; // fait
loupgarou = null; // fait
petitefille = null; // fait
voyante = null; // fait
sorciere = null; // fait
loupblanc = null;
pyromane = null;
garde = null; // fait
necromancien = null;
amoureux = null; // fait
chienloup = null; // fait
enfantsauvage = null; // fait
cupidon = null; // fait
dictateur = null; // fait
nbr_loup = 0; // used

actif_coup_etat = false; // used
maire = null; // used
dictacible = null; //used
vovo = false; //used
chasse = false; // used
amoureux1 = null; // used
amoureux2 = null; // used
protect = null; // used
lastprotect = null; // used
coup_etat = null; // used
coup_etat_used = false // used
lgmort = null; // used
soso = "null"; // used
sosocible = null; // used
salon = []; // used
players = []; // used
role = []; // used
vie = []; //used
votes = []; // used
chlg = null // used
oil = [];
modele = null; // used
potion_vie = true; //used
potion_mort = true; //used
roles = ["loup-garou", "petite-fille", "simple-villageois", "voyante", "sorcière", "loup-blanc", "chien-loup", "pyromane", "enfant-sauvage", "cupidon", "garde", "dictateur", "nécromancien", "fou", "chasseur"];

save_players = []
save_role = []
save_vie = []
save_votes = []

client.on('warn', console.warn);

client.on('error', console.error);

client.on('ready', () => {
    console.log('Le bot est démarré !');
				client.user.setActivity("KwikKill est grand, vive KwikKill !");

});

client.on('message', async message => {
    if (message.author.bot) return undefined;
    //if (!message.content.startsWith(config.prefix)) return undefined;

    const args = message.content.split(' ');
    const searchString = args.slice(1).join(' ');
    const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
    const serverQueue = queue.get(message.guild.id);

    //fun

    if (message.content === prefixVerifier(message) + 'ping') {
			message.channel.send("pong");
			return;

  	}

    if(message.content.startsWith(prefixVerifier(message) + 'lg')) {
			if(message.channel.guild != null && message.channel.guild.id == "717475578176864277") {

				try{
					if(args[1] == "config") {
						if(state == "off") {
							state = "wait"
							message.reply("la partie est en attente de configuration.");
							return
						}else if(state == "wait") {
							message.reply("La partie est déjà en attente de configuration.");
							return
						}else {
							message.reply("Veuillez d'abbord quitter la partie en cours.");
							return
						}
					}else if(args[1] == "abort") {
						message.reply("la partie à bien été abrégé.");
						salon.forEach(function(item, index, array) {
							item.then((value) => {
  							value.delete('abort');
							});
						});
						vote_nothing = []; // used
						votemort = false; // used
						vote_mort = false; // used
						vote_maire = false; // used
						waitchasse = false; // used
						day = 0 // used
						state = "off"; // used
						cycle = "night" // used
						village = null; // fait
						loupgarou = null; // fait
						petitefille = null; // fait
						voyante = null; // fait
						sorciere = null; // fait
						loupblanc = null;
						pyromane = null;
						garde = null; // fait
						necromancien = null;
						amoureux = null; // fait
						chienloup = null; // fait
						enfantsauvage = null; // fait
						cupidon = null; // fait
						dictateur = null; // fait
						nbr_loup = 0; // used

						actif_coup_etat = false; // used
						maire = null; // used
						dictacible = null; //used
						vovo = false; //used
						chasse = false; // used
						amoureux1 = null; // used
						amoureux2 = null; // used
						protect = null; // used
						lastprotect = null; // used
						coup_etat = null; // used
						coup_etat_used = false // used
						lgmort = null; // used
						soso = "null"; // used
						sosocible = null; // used
						salon = []; // used
						players = []; // used
						role = []; // used
						vie = []; //used
						votes = []; // used
						chlg = null // used
						oil = [];
						modele = null; // used
						potion_vie = true; //used
						potion_mort = true; //used
						return
					}else if(args[1] == "state") {
						if(state == "off") {
							message.reply("Il n'y a aucune partie en cours.");
							return
						}else if(state == "wait") {
							message.reply("La partie est en attente de configuration.");
							return
						}else {
							message.reply("La partie est en cours.");
							return
						}
					}else if(args[1] == "addplayer") {
						if(state == "wait") {
						if(message.mentions.users.size != 1) {
							message.reply("Veuillez ajouter un joueur valide.");
							return
						}else {
							a = false
							players.forEach(function(item, index, array) {
								if(item.id == message.mentions.users.first().id) {
									message.reply("Le joueur " + message.mentions.users.first().username + " est déjà dans la partie.");
									a = true
								}
							});
							if(a == false) {
								players.push(message.mentions.users.first());
								vie.push(true);
								votes.push([]);
								//fonction.push(null);
								//console.log(players);
								message.reply("Le joueur " + message.mentions.users.first().username + " à bien été ajouté.");
							}
							return
						}
						}else {
							message.reply("la partie n'est plus en configuration.");
							return;
						}
					}else if(args[1] == "removeplayer") {
						if(state == "wait") {
						indexx = null;
						players.forEach(function(item, index, array) {
  						if(message.mentions.users.first().id == item.id) {
								indexx = index;
							}
						});
						if(indexx == null) {
							message.reply("Le joueur n'est pas dans la liste des joueurs.")
							return;
						}else {
							message.reply("Le joueur " + message.mentions.users.first().username + " a bien été supprimé de la partie.")
							players.pop(indexx, 1);
							vie.pop(indexx, 1)
							votes.pop(indexx, 1)
							//fonction.pop(indexx, 1)
							return;
						}
						}else {
							message.reply("la partie n'est plus en configuration.");
							return;
						}

					}else if(args[1] == "seeplayer") {
						pl = " "
						players.forEach(function(item, index, array) {
  						pl = pl + " " + item.username
							if(index != players.length - 1) {
								pl = pl + ","
							}
						});
						if(pl == " ") {
							message.reply("Il n'y a aucun joueurs dans la partie.");
							return
						}else {
							message.reply("Les joueurs dans la partie sont :" + pl + ".");
							return
						}
					}else if(args[1] == "clearplayer") {
						if(state == "wait") {
							players = []
							vie = []
							votes = []
							message.reply("Les joueurs ont bien été réinitialisés.");
							return;
						}else {
							message.reply("la partie n'est plus en configuration.");
							return;
						}

					}else if(args[1] == "saveconfig") {
						if(state == "wait") {
						save_players = players
						save_role = role
						save_vie = vie
						save_votes = votes
							message.reply("La config à été sauvegardé.");
							return;
						}else {
							message.reply("la partie n'est plus en configuration.");
							return;
						}

					}else if(args[1] == "loadconfig") {
						if(state == "wait") {
						players = save_players
						role = save_role
						vie = save_vie
						votes = save_votes
							message.reply("La config à été restauré.");
							return;
						}else {
							message.reply("la partie n'est plus en configuration.");
							return;
						}

					}else if(args[1] == "help") {
						const embed = new MessageEmbed()
  .setTitle("liste des commandes du loup garou:")
  .setColor(0xffe402)
  //.setThumbnail(message.author.avatarURL)
  .setDescription("voici la liste des commandes disponible :")
  .addField("configuration","`*lg config` : permet de configurer une partie \n`*lg abort` : permet d'arréter une partie \n`*lg state` : permet de voir l'état de la partie\n`*lg saveconfig` : permet de sauvegarder la config actuelle\n`*lg loadconfig` : permet de charger la config actuelle")
  .addField("joueurs","`*lg seeplayers` : permet de voir les joueurs \n`*lg addplayer` [mention] : permet d'ajouter un joueur \n`*lg removeplayer` [mention] : permet d'enlever un joueur \n`*lg clearplayer` : permet de reset les joueurs")
	.addField("rôles","`*lg allroles` : permet de voir la lise des rôles disponibles \n`*lg addrole` : permet d'ajouter un role dans la partie actuelle (la partie doit être en configuration) \n`*lg removerole` : permet de retirer un role dans la partie actuelle (la partie doit être en configuration) \n`*lg seerole` : permet de voir les roles configurées \n`*lg clearrole` : permet de reset les roles")
	.addField("play","`*lg play` : permet de démarrer la partie");


  					message.channel.send(embed);
						return;
					}else if(args[1] == "allroles") {
						pl = " "
						roles.forEach(function(item, index, array) {
  						pl = pl + " " + item
							if(index != roles.length - 1) {
								pl = pl + ","
							}
						});
						message.reply("les rôles sont :" + pl)
						return;
					}else if(args[1] == "seerole") {
						pl = " "
						role.forEach(function(item, index, array) {
  						pl = pl + " " + item
							if(index != role.length - 1) {
								pl = pl + ","
							}
						});
						if(pl == " ") {
							message.reply("Il n'y as aucun rôle de configuré.")
							return;
						}else {
							message.reply("les rôles dans la partie sont :" + pl + ".")
							return;
						}
					}else if(args[1] == "addrole") {
						if(state == "wait") {
						existe = false;
						roles.forEach(function(item, index, array) {
  						if(args[2] == item) {
								existe = true;
							}
						});

						if(existe == false) {
							message.reply("Le rôle n'existe pas")
							return;
						}else {
							role.push(args[2]);
							message.reply("le rôle " + args[2] + " a bien été ajouté");
							if(args[2] == "loup-garou") {
								nbr_loup += 1;
							}
							return;
						}
						}else {
							message.reply("la partie n'est plus en configuration.");
							return;
						}
					}else if(args[1] == "removerole") {
						if(state == "wait") {
						indexx = null;
						role.forEach(function(item, index, array) {
  						if(args[2] == item) {
								indexx = index;
							}
						});
						if(args[2] == "loup-garou") {
							nbr_loup -= 1;
						}
						message.reply("Le rôle a bien été supprimé.")
						role.pop(indexx, 1);
						return;
						}else {
							message.reply("la partie n'est plus en configuration.");
							return;
						}
					}else if(args[1] == "clearrole") {
						if(state == "wait") {
							role = []
							message.reply("Les rôles ont bien été réinitialisés.");
							return;
						}else {
							message.reply("la partie n'est plus en configuration.");
							return;
						}

					}else if(args[1] == "play") {
						if(state == "wait") {
							if(role.length != players.length) {
								message.reply("Il n'y a pas assez ou trop de rôle pour les joueurs spécifiés")
							}else {

								state = "on"

								randomize(players);
								randomize(role);

								players.forEach(function(item, index, array) {
									item.send("---------Nouvelle partie---------\nvous êtes : " + role[index])
								});

								permvillage = [{id: "717475578176864277",deny: ['VIEW_CHANNEL']}]
								players.forEach(function(item, index, array) {
									permvillage.push({id: item.id, allow: ['VIEW_CHANNEL']})

								});


								villagechanel = message.channel.guild.channels.create("village", {type: 'text', reason: 'channel du village',permissionOverwrites: permvillage,
								},
								);
								village = villagechanel;
								salon.push(village);

								//console.log(players);
								//console.log(role);

								permlg = [{id: "717475578176864277",deny: ['VIEW_CHANNEL']}]
								players.forEach(function(item, index, array) {
									if(role[index] == "loup-garou" || role[index] == "loup-blanc") {
										permlg.push({id: item.id, allow: ['VIEW_CHANNEL']})
									}

								});
								lgchanel = message.channel.guild.channels.create("loup-garou", {type: 'text', reason: 'channel des loup-garou',permissionOverwrites: permlg,
								},
								);
								loupgarou = lgchanel;
								salon.push(loupgarou);

								lgchanel.then((value) => {
									test = value.send("Vous êtes loup garou. Vous gagnez en tuant les villageois. Toutes les nuits vous pouvez tuer quelqu'un en faisant `*lg kill [nom_du_joueur]`. La majorité l'emportera. En cas d'égalité, il n'y auras pas de mort.")
									test.then((value2) => {
										value2.pin()
									});

								});

								permpf = [{id: "717475578176864277",deny: ['VIEW_CHANNEL']}]
								players.forEach(function(item, index, array) {
									if(role[index] == "petite-fille") {
										permpf.push({id: item.id, allow: ['VIEW_CHANNEL']})
									}

								});
								pfchanel = message.channel.guild.channels.create("petite fille", {type: 'text', reason: 'channel de la petite fille',permissionOverwrites: permpf,
								},
								);
								petitefille = pfchanel;
								salon.push(pfchanel);

								pfchanel.then((value) => {
									test = value.send("Vous êtes la petite fille. Tout les messages des loup-garou seront repostés ici.")
									test.then((value2) => {
										value2.pin()
									});

								});

								permvovo = [{id: "717475578176864277",deny: ['VIEW_CHANNEL']}]
								players.forEach(function(item, index, array) {
									if(role[index] == "voyante") {
										permvovo.push({id: item.id, allow: ['VIEW_CHANNEL']})
									}

								});
								vovochanel = message.channel.guild.channels.create("voyante", {type: 'text', reason: 'channel de la voyante',permissionOverwrites: permvovo,
								},
								);
								voyante = vovochanel;
								salon.push(voyante);

								vovochanel.then((value) => {
									test = value.send("Vous êtes la voyante. Vous pouvez chaque nuit voir le rôle d'un joueur. Pour cela, executez la commande `*lg look [nom_du_joueur]`.")
									test.then((value2) => {
										value2.pin()
									});

								});

								permsoso = [{id: "717475578176864277",deny: ['VIEW_CHANNEL']}]
								players.forEach(function(item, index, array) {
									if(role[index] == "sorcière") {
										permsoso.push({id: item.id, allow: ['VIEW_CHANNEL']})
									}

								});
								sosochanel = message.channel.guild.channels.create("sorcière", {type: 'text', reason: 'channel de la sorcière',permissionOverwrites: permsoso,
								},
								);
								sorciere = sosochanel;
								salon.push(sosochanel);


								sosochanel.then((value) => {
									test = value.send("Vous êtes la sorcière. Vous pouvez, une fois par partie, empêcher la mort d'un joueur avec la commande `*lg heal` ou en tuer un autre avec la commande `*lg kill [nom_du_joueur]`. Pour ne rien faire, faites la commande `*lg nothing`. Pour voir les potions qu'il vous reste, vous pouvez faire `*lg potion`. Vous jouez après les loup garou.")
									test.then((value2) => {
										value2.pin()
									});

								});


								permlb = [{id: "717475578176864277",deny: ['VIEW_CHANNEL']}]
								players.forEach(function(item, index, array) {
									if(role[index] == "loup-blanc") {
										permlb.push({id: item.id, allow: ['VIEW_CHANNEL']})
									}

								});
								lbchanel = message.channel.guild.channels.create("loup blanc", {type: 'text', reason: 'channel du loup blanc',permissionOverwrites: permlb,
								},
								);
								loupblanc = lbchanel;
								salon.push(lbchanel);

								lbchanel.then((value) => {
									test = value.send("Vous êtes le loup blanc. Vous votez avec les loup garou mais vous gagnez seul. Vous pouvez voter une fois tout les deux tours avec la commande `*lg kill [nom_du_joueur]`.")
									test.then((value2) => {
										value2.pin()
									});

								});


								permpyro = [{id: "717475578176864277",deny: ['VIEW_CHANNEL']}]
								players.forEach(function(item, index, array) {
									if(role[index] == "pyromane") {
										permpyro.push({id: item.id, allow: ['VIEW_CHANNEL']})
									}

								});
								pyrochanel = message.channel.guild.channels.create("pyromane", {type: 'text', reason: 'channel du pyromane',permissionOverwrites: permpyro,
								},
								);
								pyromane = pyrochanel;
								salon.push(pyrochanel);

								pyrochanel.then((value) => {
									test = value.send("Vous êtes le pyromane. Vous gagnez seul. Chaque nuits vous avez le choix entre enduire deux joueur d'essences avec la commande `*lg oil [nom_du_joueur] [nom_du_joueur]` ou allumer tout les joueurs enduits d'essence avec la commande `*lg fire`.")
									test.then((value2) => {
										value2.pin()
									});

								});

								permgarde = [{id: "717475578176864277",deny: ['VIEW_CHANNEL']}]
								players.forEach(function(item, index, array) {
									if(role[index] == "garde") {
										permgarde.push({id: item.id, allow: ['VIEW_CHANNEL']})
									}

								});
								gardechanel = message.channel.guild.channels.create("garde", {type: 'text', reason: 'channel du garde',permissionOverwrites: permgarde,
								},
								);
								garde = gardechanel;
								salon.push(gardechanel);

								gardechanel.then((value) => {
									test = value.send("Vous êtes le garde. Chaque nuit vous pouvez protéger un joueur avec la commande `*lg protect [nom_du_joueur]`.")
									test.then((value2) => {
										value2.pin()
									});

								});



								permnecro = [{id: "717475578176864277",deny: ['VIEW_CHANNEL']}]
								players.forEach(function(item, index, array) {
									if(role[index] == "nécromancien") {
										permnecro.push({id: item.id, allow: ['VIEW_CHANNEL']})
									}

								});
								necrochanel = message.channel.guild.channels.create("nécromancien", {type: 'text', reason: 'channel du nécromancien',permissionOverwrites: permnecro,
								},
								);
								necromancien = necrochanel;
								salon.push(necrochanel);

								necrochanel.then((value) => {
									test = value.send("Vous êtes le nécromancien. Chaque nuit, le gémissement des mort vous est transmis dans ce salon.")
									test.then((value2) => {
										value2.pin()
									});

								});



								permlove = [{id: "717475578176864277",deny: ['VIEW_CHANNEL']}]

								lovechanel = message.channel.guild.channels.create("amoureux", {type: 'text', reason: 'channel des amoureux',permissionOverwrites: permlove,
								},
								);
								amoureux = lovechanel;
								salon.push(lovechanel);


								permchlg = [{id: "717475578176864277",deny: ['VIEW_CHANNEL']}]
								players.forEach(function(item, index, array) {
									if(role[index] == "chien-loup") {
										permchlg.push({id: item.id, allow: ['VIEW_CHANNEL']})
									}

								});
								chlgchanel = message.channel.guild.channels.create("chien loup", {type: 'text', reason: 'channel du chien loup',permissionOverwrites: permchlg,
								},
								);
								chienloup = chlgchanel;
								salon.push(chlgchanel);

								chlgchanel.then((value) => {
									test = value.send("Vous êtes le chien loup. Le premier tour, vous pouvez choisir d'être loup garou avec la command `*lg choose lg` ou d'être villageois avec la command `*lg choose villageois`.")
									test.then((value2) => {
										value2.pin()
									});

								});


								permenfantsau = [{id: "717475578176864277",deny: ['VIEW_CHANNEL']}]
								players.forEach(function(item, index, array) {
									if(role[index] == "enfant-sauvage") {
										permenfantsau.push({id: item.id, allow: ['VIEW_CHANNEL']})
									}

								});
								enfantsauvchanel = message.channel.guild.channels.create("enfant sauvage", {type: 'text', reason: 'channel de l\'enfant sauvage',permissionOverwrites: permenfantsau,
								},
								);
								enfantsauvage = enfantsauvchanel;
								salon.push(enfantsauvchanel);

								enfantsauvchanel.then((value) => {
									test = value.send("Vous êtes l'enfant sauvage. Le premier tour, vous devez choisir un modèle avec la commande `*lg choose [nom_du_joueur]`. Vous êtes dans l'équipe des villageois tant que votre modèle est en vie. Vous devenez loup garou à sa mort.")
									test.then((value2) => {
										value2.pin()
									});

								});

								permcupidon = [{id: "717475578176864277",deny: ['VIEW_CHANNEL']}]
								players.forEach(function(item, index, array) {
									if(role[index] == "cupidon") {
										permcupidon.push({id: item.id, allow: ['VIEW_CHANNEL']})
									}

								});
								cupidonchanel = message.channel.guild.channels.create("cupidon", {type: 'text', reason: 'channel du cupidon',permissionOverwrites: permcupidon,
								},
								);
								cupidon = cupidonchanel;
								salon.push(cupidonchanel);

								cupidonchanel.then((value) => {
									test = value.send("Vous êtes Cupidon. Votre seul tâche est de mettre deux personnes amoureuses avec la commande `*lg love [nom_du_joueur] [nom_du_joueur]` et de se marrer le reste de la partie.")
									test.then((value2) => {
										value2.pin()
									});
								});




								permdictateur = [{id: "717475578176864277",deny: ['VIEW_CHANNEL']}]
								players.forEach(function(item, index, array) {
									if(role[index] == "dictateur") {
										permdictateur.push({id: item.id, allow: ['VIEW_CHANNEL']})
									}

								});
								dictateurchanel = message.channel.guild.channels.create("dictateur", {type: 'text', reason: 'channel du dictateur',permissionOverwrites: permdictateur,
								},
								);
								dictateur = dictateurchanel;
								salon.push(dictateurchanel);

								dictateurchanel.then((value) => {
									test = value.send("Vous êtes dictateur. Une fois par partie vous pouvez prendre le pouvoir de force avec la commande `*lg coup-état`. Sinon, faites `*lg nothing`. Le lendemain, vous pourez choisir qui va mourir de la main des villageois. Si vous choisissez un loup garou, vous garderez le pouvoir. Mais si par malheur vous tuez un innocent, vos remord vous pousseront à vous suiccider pendant la nuit.")
									test.then((value2) => {
										value2.pin()
									});
								});



								setcycle(message);




							}
						}
						return;
					}else if(args[1] == "choose") {
						if(state == "on") {
							if(cycle == "night") {
								chienloup.then((value) => {
									if(message.channel.id == value.id) {

										if(args[2] == "lg") {
											message.author.send("Vous avez choisie d'être loup garou")
											chlg = "lg"
											message.channel.updateOverwrite(message.author.id, { VIEW_CHANNEL: false, SEND_MESSAGES: false });

											loupgarou.then((value2) => {
												value2.updateOverwrite(message.author.id, { VIEW_CHANNEL: true });
											});
											/*salon.forEach(function(item, index, array) {
												if(role[index] == "dictateur") {
													permdictateur.push({id: item.id, allow: ['VIEW_CHANNEL']})
												}
											});*/
											verif(message);

										}else if(args[2] == "villageois") {
											message.author.send("Vous avez choisie d'être villageois")
											chlg = "villageois"
											message.channel.updateOverwrite(message.author.id, { VIEW_CHANNEL: false, SEND_MESSAGES: false });
											verif(message);
										}
									}
							});
							enfantsauvage.then((value) => {
									if(message.channel.id == value.id) {
										players.forEach(function(item, index, array) {
											if(item.username == args[2] && args[2] != message.author.username) {
												modele = index;
												message.author.send("Vous avez choisie " + item.username + " comme modèle.");
												message.channel.updateOverwrite(message.author.id, { VIEW_CHANNEL: false, SEND_MESSAGES: false });
												verif(message);
												return;
											}
										});
									}
							});
							}
						}



					}else if(args[1] == "love") {
						if(state == "on") {
							if(cycle == "night") {
								cupidon.then((value) => {
										if(message.channel.id == value.id) {
											players.forEach(function(item, index, array) {
												if(item.username == args[2]) {
													players.forEach(function(item2, index2, array2) {
														if(item2.username == args[3] && args[3] != args[2]) {
															amoureux1 = item.username;
															amoureux2 = item2.username;
															message.author.send("Vous avez bien mis " + amoureux1 + " et " + amoureux2 + " ensemble.");
															message.channel.updateOverwrite(message.author.id, { VIEW_CHANNEL: false, SEND_MESSAGES: false });
															amoureux.then((value3) => {
																value3.updateOverwrite(item.id, { VIEW_CHANNEL: true});
																value3.updateOverwrite(item2.id, { VIEW_CHANNEL: true});
															});
															item.send(":hearts: Vous êtes en couple avec " + item2.username + " qui est " + role[index2] + " :hearts:")
															item2.send(":hearts: Vous êtes en couple avec " + item.username + " qui est " + role[index] + " :hearts:")

															verif(message)
														}
													});
												}
											});
									}
								});
							}
						}
					}else if(args[1] == "look") {
						if(state == "on") {
							if(cycle == "night") {
								voyante.then((value) => {
										if(message.channel.id == value.id) {
											players.forEach(function(item, index, array) {
												if(item.username == args[2] && args[2] != message.author.username) {
													message.channel.send("Le joueur " + args[2] + " est " + role[index])
													vovo = true
													message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
													verif(message)
												}
											});
										}
								});
							}
						}

					}else if(args[1] == "protect") {
						if(state == "on") {
							if(cycle == "night") {
								garde.then((value) => {
									if(message.channel.id == value.id) {
										players.forEach(function(item, index, array) {
											if(item.username == args[2] && args[2] != lastprotect) {
												protect = args[2]
												lastprotect = protect
												value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
												message.channel.send("Vous avez protégé " + args[2] + ".")
												verif(message)
											}
										});
									}
								});
								}
							}
						}else if(args[1] == "coup-état") {
							if(state == "on") {
								if(cycle == "night") {
									dictateur.then((value) => {
										if(message.channel.id == value.id) {
											if(coup_etat_used == false) {
												coup_etat_used = true;
												coup_etat = true;
												value.updateOverwrite(message.author.id, { VIEW_CHANNEL: false });
												message.author.send("Vous avez décidé de faire un coup d'état.")
												verif(message)
											}else {message.channel.send("Vous avez déjà fait un coup d'état.")}
										}
									});
								}
							}
						}else if(args[1] == "nothing") {
							if(state == "on") {
								if(cycle == "night") {
									dictateur.then((value) => {
										if(message.channel.id == value.id) {
											coup_etat = false;
											value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
											message.channel.send("Vous avez décidé de ne pas faire de coup d'état.")
											verif(message)
											return;
										}
									});
									sorciere.then((value) => {
										if(message.channel.id == value.id) {
											soso = "nothing";
											value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
											message.channel.send("Vous n'avez pas utilisé de potions.")
											verif(message)
											return;
										}
									});
								}
							}
						}else if(args[1] == "potion") {
							if(state == "on") {
								if(cycle == "night") {
									sorciere.then((value) => {
										if(message.channel.id == value.id) {
											if(potion_vie == true) {
												value.send('Vous n\'avez pas utilisé votre potion de vie')
											}else {
												value.send('Vous avez utilisé votre potion de vie')
											}
											if(potion_mort == true) {
												value.send('Vous n\'avez pas utilisé votre potion de mort')
											}else {
												value.send('Vous avez utilisé votre potion de mort')
											}
										}
									});
								}
							}
						}else if(args[1] == "kill") {
							if(state == "on") {
								if(cycle == "night") {
									loupgarou.then((value) => {
										if(message.channel.id == value.id) {
										players.forEach(function(item, index, array) {
											if(item.username == args[2]) {
												nb = 0
												supp = 0
												ind = 0
												votes.forEach(function(item3, index3, array3) {
													item3.forEach(function(item4, index4, array4) {
														if(item4 == message.author.id) {
															votes[index3].pop(index4, 1)
														}
													});
												});

												votes[index].push(message.author.id)

												votes.forEach(function(item2, index2, array2) {
													nb += item2.length
													if(item2.length > supp) {
														supp = item2.length
														ind = index2
													}
												});
												if(nb == nbr_loup) {
													lgmort = players[ind]
													value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
													message.channel.send("Les loup garou ont fait leurs choix, " + lgmort.username + " est mort.")
													verif(message)
												}else {
													message.channel.send("Vous avez voté contre " + args[2] + ".")
												}

											}
										});
									}
									});
									sorciere.then((value) => {
										if(message.channel.id == value.id) {
											players.forEach(function(item, index, array) {
												if(item.username == args[2]) {
													if(potion_mort == true) {
														soso = "kill";
														potion_mort = false;
														sosocible = item
														value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
														message.channel.send("Vous avez tué " + args[2] + ".")
														verif(message)
														return;
													}
												}
											});
										}
									});
								}else {
									village.then((value) => {
										if(waitchasse == true) {
											if(message.channel.id == value.id) {
												players.forEach(function(item, index, array) {
													if(item.id == message.author.id) {

														if(role[index] == "chasseur") {
															players.forEach(function(item2, index2, array2) {
																if(item2.username == args[2]) {
																	waitchasse = false;
																	mort(item2)
																	value.updateOverwrite(message.author.id, { SEND_MESSAGES: false });
																	dayy(message)
																	return;
																}
															});
														}
													}
												});
											}
										}
										if(actif_coup_etat == true) {
											if(message.channel.id == value.id) {
												players.forEach(function(item, index, array) {
													if(item.id == message.author.id) {

														if(role[index] == "dictateur") {
															players.forEach(function(item2, index2, array2) {
																if(item2.username == args[2]) {
																	actif_coup_etat = false
																	mort(item2)
																	maire = message.author
																	dictacible = item2
																	dayy(message)
																}
															});
														}
													}
												});
											}
										}
									});
								}
							}
						}else if(args[1] == "heal") {
							if(state == "on") {
								if(cycle == "night") {
									sorciere.then((value) => {
										if(message.channel.id == value.id) {
											if(potion_vie == true) {
												soso = "heal";
												potion_vie = false;
												value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
												message.channel.send("Vous avez soigné " + lgmort.username + ".")
												verif(message)
												return;
											}
										}
									});
								}
							}
						}else if(args[1] == 'vote') {
							if(state == "on") {
								if(cycle == "day") {
									village.then((value) => {
										if(message.channel.id == value.id) {
										if(args[2] == "nobody") {
											already = false
											vote_nothing.forEach(function(item, index, array) {
												if(item == message.author.id) {
													already = true;
												}
											});
											votes.forEach(function(item3, index3, array3) {
												item3.forEach(function(item4, index4, array4) {
													if(item4 == message.author.id) {
														votes[index3].pop(index4, 1)
													}
												});
											});

											if(already == false) {
												vote_nothing.push(message.author.id)
											}

											nb = 0
											supp = [0]
											ind = [0]

											votes.forEach(function(item2, index2, array2) {
												nb += item2.length
												if(item2.length > supp[0]) {
													supp = [item2.length]
													ind = [index2]
												}else if(item2.length == supp[0]) {
													supp.push(item2.length)
													ind.push(index2)
												}
											});
											nb_vivant = 0
											vie.forEach(function(item3, index3, array3) {
												if(item3 == true) {
													nb_vivant += 1
												}
											});
											if(nb + vote_nothing.length == nb_vivant) {
												if(vote_mort == true) {
													if(ind.length == 1) {
														votemort = players[ind[0]]
													}else {
														votemort = players[ind[0]]
													}
													value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
													message.channel.send("Le village à fait son choix, " + votemort.username + " est mort.")
													players.forEach(function(item5, index5, array5) {
														if(votemort.id == item5.id) {
															if(role[index] == "fou") {
																message.channel.send(votemort.username + " était fou ! Le fou à gagné !")
																return;
															}else {
																mort(votemort)
																dayy(message)
															}
														}
													});
												}else {
													maire = players[ind[0]]
													message.channel.send("Le village à fait son choix, " + maire.username + " est élu maire.")
													dayy(message)
												}
											}else {
												message.channel.send("Vous avez voté blanc.")
											}

										}else {
											players.forEach(function(item, index, array) {
												if((item.username == args[2] && vie[index] == true)) {
													nb = 0
													supp = 0
													ind = 0
													votes.forEach(function(item3, index3, array3) {
														item3.forEach(function(item4, index4, array4) {
															if(item4 == message.author.id) {
																votes[index3].pop(index4, 1)
															}
														});
													});

													votes[index].push(message.author.id)

													votes.forEach(function(item2, index2, array2) {
														nb += item2.length
														if(item2.length > supp) {
															supp = item2.length
															ind = index2
														}
													});
													nb_vivant = 0
													vie.forEach(function(item3, index3, array3) {
														if(item3 == true) {
															nb_vivant += 1
														}
													});
													if((nb + vote_nothing.length) == nb_vivant) {
														if(vote_mort == true) {
															votemort = players[ind]
															value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
															message.channel.send("Le village à fait son choix, " + votemort.username + " est mort.")
															players.forEach(function(item5, index5, array5) {
																if(votemort.id == item5.id) {
																	if(role[index] == "fou") {
																		message.channel.send(votemort.username + " était fou ! Le fou à gagné !")
																		return;
																	}else {
																		mort(votemort)
																		dayy(message)
																	}
																}
															});

														}else {
															maire = players[ind]
															message.channel.send("Le village à fait son choix, " + maire.username + " est élu maire.")
															dayy(message)
														}
													}else {
														if(vote_mort == true) {
															message.channel.send("Vous avez voté contre " + args[2] + ".")
														}else {
															message.channel.send("Vous avez voté pour " + args[2] + ".")
														}
													}

												}
											});
										}
									}
									});
								}
							}
						}


				}catch(err) {

					console.log(err);

				}

				return;
			}
    }

		if(message.content === prefixVerifier(message) + 'help') {

      const help = require('./command/lg/initialize.js');
      help(message);

			return;

		}

    if(message.content.startsWith(prefixVerifier(message) + 'info')) {

      const info = require('./command/fun/info.js');
      info(message);

      return;

    }

    //moderation

    if(message.content.startsWith(prefixVerifier(message) + "log")) {

      const log = require('./command/moderation/log.js');
      log(message);

      return;

    }

    if(message.content.startsWith(prefixVerifier(message) + "prefix")) {

      const prefix = require('./command/moderation/prefix.js');
      prefix(message);

      return;

    }

    if(message.content.startsWith(prefixVerifier(message) + "musicchannel")) {

      const musicchannel = require('./command/music/musicchannel.js');
      musicchannel(message);

      return;

    }

    if(message.content.startsWith(prefixVerifier(message) + "welcome")) {

      const welcome = require('./command/moderation/welcome.js');
      welcome(message);

      return;

    }

		if (message.content.startsWith(prefixVerifier(message) + 'kick')) {

      const kick = require('./command/moderation/kick.js');
			kick(message);

			return;
		}

		if (message.content.startsWith(prefixVerifier(message) + 'ban')) {

      const ban = require('./command/moderation/ban.js');
			ban(message);

			return;
		}

    var regexpunban = new RegExp('^\\' + prefixVerifier(message) + 'unban\\s+([^\\s]*)$');
		if (regexpunban.test(message.content)) {

      var id = message.content.replace(regexpunban, "$1");

      const unban = require('./command/moderation/unban.js');
			unban(message, id);

			return;
		}

    //apex

		var regexp = new RegExp('^\\' + prefixVerifier(message) + 'apex\\s+stats\\s+([^\\s]*)\\s+([^\\s]*)$');
		if(regexp.test(message.content)) {

			var user = message.content.replace(regexp, "$1");
			var platform = message.content.replace(regexp, "$2");

      const stats = require('./command/apex/stats.js');
			stats(message,user,platform);

			//curl https://public-api.tracker.gg/apex/v1/standard/profile/5/GAb_3511 -H "TRN-API-KEY: 29dd5302-c7ea-4c2c-8b5e-b7858844d8b4"

      return;
		}

		var regexp2 = new RegExp('^\\' + prefixVerifier(message) + 'apex\\s+legend\\s+([^\\s]*)$');
		if(regexp2.test(message.content)) {
			var legend = message.content.replace(regexp2, "$1");

      const legends = require('./command/apex/legend.js');
      legends(message,legend);


		}

    //musics

    if(message.content.startsWith(prefixVerifier(message) + 'play')) {

      if(!message.guild) return undefined;

      try {
        let music = JSON.parse(fs.readFileSync("./musicchannel.json", "utf8"));
        if (music[message.guild.id].musicchannel) {
          var musicchannel = message.guild.channels.find(channel => channel.id === music[channel.guild.id].musicchannel);

          if (!musicchannel) return undefined;
          if (music[message.guild.id].musicchannel != message.channel.id) return undefined;

        /*const play = require('./command/music/play.js');
  			play(message);*/

        const voiceChannel = message.member.voiceChannel;
        if (!voiceChannel) {
          return message.channel.send('je suis désolé mais vous n\'êtes pas dans un salon vocal');
        }
        const permissions = voiceChannel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) {
      			return message.channel.send('je ne peux pas me connecter dans votre salon vocal !');
        }
        if (!permissions.has('SPEAK')) {
      			return message.channel.send('je ne peux pas parler dans votre salon vocal !');
        }
        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
      			const playlist = await youtube.getPlaylist(url);
      			const videos = await playlist.getVideos();
      			for (const video of Object.values(videos)) {
      				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
      				await handleVideo(video2, message, voiceChannel, true); // eslint-disable-line no-await-in-loop
      			}
      			return message.channel.send(`✅ Playlist: **${playlist.title}** a bien été ajouté à la playlist!`);
        }
        else {
      			try {
      				var video = await youtube.getVideo(url);
      			} catch (error) {
      				try {
      					var videos = await youtube.searchVideos(searchString, 10);
      					let index = 0;
      					message.channel.send(`
      __**Song selection:**__
      ${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
      Please provide a value to select one of the search results ranging from 1-10.
      					`);
      					// eslint-disable-next-line max-depth
      					try {
      						var response = await message.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
      							maxMatches: 1,
      							time: 10000,
      							errors: ['time']
      						});
      					} catch (err) {
      						console.error(err);
      						return message.channel.send('résultat absent ou invalide, annulation de la sélection musicale.');
      					}
      					const videoIndex = parseInt(response.first().content);
      					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
      				} catch (err) {
      					console.error(err);
      					return message.channel.send('🆘 Je n\'ai pas trouvé de résultats.');
      				}
      			}
      			return handleVideo(video, message, voiceChannel);
          }

  			return;
      }
    }catch(err) {console.log(err)}

		}

    if(message.content.startsWith(prefixVerifier(message) + 'skip')) {

      if(!message.guild) return undefined;

      try {
        let music = JSON.parse(fs.readFileSync("./musicchannel.json", "utf8"));
        if (music[member.guild.id].musicchannel) {
          var musicchannel = member.guild.channels.find(channel => channel.id === music[channel.guild.id].musicchannel);

          if (!musicchannel) return undefined;
          if (music[message.guild.id].musicchannel != message.channel.id) return undefined;

          if (!message.member.voiceChannel) return message.channel.send('vous n\'êtes pas dans un salon vocal !');
          if (!serverQueue) return message.channel.send('Je ne peut pas skip cette musique.');
          serverQueue.connection.dispatcher.end('musique skip !');

        }
      }catch(err) {}

			return;

		}

    if(message.content.startsWith(prefixVerifier(message) + 'stop')) {

      if(!message.guild) return undefined;

      try {
        let music = JSON.parse(fs.readFileSync("./musicchannel.json", "utf8"));
        if (music[message.guild.id].musicchannel) {
          var musicchannel = message.guild.channels.find(channel => channel.id === music[channel.guild.id].musicchannel);

          if (!musicchannel) return undefined;
          if (music[message.guild.id].musicchannel != message.channel.id) return undefined;


          if (!message.member.voiceChannel) return message.channel.send('vous n\'êtes pas dans un salon vocal !');
      		if (!serverQueue) return message.channel.send('Je suis déjâ stoppé.');
      		serverQueue.songs = [];
          serverQueue.connection.dispatcher.end('La command stop a bien été utilisé !');
          return message.channel.send('j\'ai quitté le salon vocal');

        }
      }catch(err) {}
		}

    if(message.content.startsWith(prefixVerifier(message) + 'volume')) {

      if(!message.guild) return undefined;

      try {
        let music = JSON.parse(fs.readFileSync("./musicchannel.json", "utf8"));
        if (music[message.guild.id].musicchannel) {
          var musicchannel = message.guild.channels.find(channel => channel.id === music[channel.guild.id].musicchannel);

          if (!musicchannel) return undefined;
          if (music[message.guild.id].musicchannel != message.channel.id) return undefined;

          if (!message.member.voiceChannel) return message.channel.send('Vous n\'êtes pas dans un salon vocal!');
    		  if (!serverQueue) return message.channel.send('Il n\'y a rien a joué');
    		  if (!args[1]) return message.channel.send(`Le volume est actuellement à : **${serverQueue.volume}**`);
          serverQueue.volume = args[1];
          serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 5);
          return message.channel.send(`J'ai mis le volume à : **${args[1]}**`);

        }
      }catch(err) {}

    }

    if(message.content.startsWith(prefixVerifier(message) + "np")) {

      if(!message.guild) return undefined;

      try {
        let music = JSON.parse(fs.readFileSync("./musicchannel.json", "utf8"));
        if (music[message.guild.id].musicchannel) {
          var musicchannel = message.guild.channels.find(channel => channel.id === music[channel.guild.id].musicchannel);

          if (!musicchannel) return undefined;
          if (music[message.guild.id].musicchannel != message.channel.id) return undefined;

        if (!serverQueue) return message.channel.send("Il n\'y a rien de joué");
        return message.channel.send(`🎶 Now playing: **${serverQueue.songs[0].title}**`);

        }
      }catch(err) {}
    }

    if(message.content.startsWith(prefixVerifier(message) + "playlist")) {

      if(!message.guild) return undefined;

      try {
        let music = JSON.parse(fs.readFileSync("./musicchannel.json", "utf8"));
        if (music[message.guild.id].musicchannel) {
          var musicchannel = message.guild.channels.find(channel => channel.id === music[channel.guild.id].musicchannel);

          if (!musicchannel) return undefined;
          if (music[message.guild.id].musicchannel != message.channel.id) return undefined;

          if (!serverQueue) return message.channel.send("Il n\'y a rien à joué.");
          return message.channel.send(`
    __**Playlist :**__
    ${serverQueue.songs.map(song => `**-** ${song.title}`).join('\n')}
    **Now playing:** ${serverQueue.songs[0].title}
    		`);

        }
      }catch(err) {}

    }

    if(message.content.startsWith(prefixVerifier(message) + "pause")) {

      if(!message.guild) return undefined;

      try {
        let music = JSON.parse(fs.readFileSync("./musicchannel.json", "utf8"));
        if (music[message.guild.id].musicchannel) {
          var musicchannel = message.guild.channels.find(channel => channel.id === music[channel.guild.id].musicchannel);

          if (!musicchannel) return undefined;
          if (music[message.guild.id].musicchannel != message.channel.id) return undefined;

          if (serverQueue && serverQueue.playing) {
    			   serverQueue.playing = false;
    			   serverQueue.connection.dispatcher.pause();
    			   return message.channel.send('⏸ musique mis en Pause !');
    		  }
          return message.channel.send('Il n\'a rien de joué.');

        }
      }catch(err) {}
    }

    if(message.content.startsWith(prefixVerifier(message) + "resume")) {

      if(!message.guild) return undefined;

      try {
        let music = JSON.parse(fs.readFileSync("./musicchannel.json", "utf8"));
        if (music[message.guild.id].musicchannel) {
          var musicchannel = message.guild.channels.find(channel => channel.id === music[channel.guild.id].musicchannel);

          if (!musicchannel) return undefined;
          if (music[message.guild.id].musicchannel != message.channel.id) return undefined;


          if (serverQueue && !serverQueue.playing) {
    			   serverQueue.playing = true;
    			   serverQueue.connection.dispatcher.resume();
    			   return message.channel.send('▶ musique joué !');
          }
          return message.channel.send("Il n\'y a rien de joué");

        }
      }catch(err) {}
    }

    if(state == "on") {
    loupgarou.then((value) => {
      if(message.channel.id == value.id) {
        nbr = 0
        players.forEach(function(item, index, array) {
          if(item.id == message.author.id) {
            nbr = index
          }
        });
        petitefille.then((value2) => {
          if(!message.content.startsWith(prefixVerifier(message) + 'lg')) {
            value2.send("Loup " + (nbr+1) + " : " + message.content);
          }
        });
      }

    });
  }

});

client.on('guildMemberAdd', member => {
  if(!member.guild) return undefined;

  try {
    let welcome = JSON.parse(fs.readFileSync("./welcome.json", "utf8"));
    if (welcome[member.guild.id].channel) {
      var welcomechannel  = member.guild.channels.find(channel => channel.id === welcome[channel.guild.id].channel);

      if (!welcomechannel) return undefined;
      welcomechannel.send(welcome[member.guild.id].message + ` ${member}`);
    }
  }catch(err) {}
});

client.on('channelCreate', channel => {
  if(!channel.guild) return undefined;


  try {
    let logs = JSON.parse(fs.readFileSync("./logs.json", "utf8"));
    if (logs[channel.guild.id].toggle === 1) {
    	var logchannel  = channel.guild.channels.find(channel => channel.name === "logs");
      if(!logchannel ) return undefined;

    	const embed = new RichEmbed()
    		.setTitle('log :')
    		.setColor(0xffe402)
    		.setDescription(
    			"salon créé : " +
    			channel.name
    		);

  	   logchannel.send(embed);
    }
  }catch(err) {}

});

client.on('channelDelete', channel => {
  if(!channel.guild) return undefined;

  try {
    let logs = JSON.parse(fs.readFileSync("./logs.json", "utf8"));
    if (logs[channel.guild.id].toggle === 1) {
    	var log = channel.guild.channels.find(channel => channel.name === "logs");
      if(!log) return undefined;

    	const embed = new RichEmbed()
    		.setTitle('log :')
    		.setColor(0xffe402)
    		.setDescription(
    			"salon supprimé : " +
    			channel.name
    		);

    	log.send(embed);
    }
  }catch(err) {}
});

client.on('emojiCreate', emoji => {
  if(!emoji.guild) return undefined;

  try {
    let logs = JSON.parse(fs.readFileSync("./logs.json", "utf8"));
    if (logs[emoji.guild.id].toggle === 1) {
    	var log = emoji.guild.channels.find(channel => channel.name === "logs");
      if(!log) return undefined;

    	const embed = new RichEmbed()
    		.setTitle('log :')
    		.setColor(0xffe402)
    		.setThumbnail(emoji.url)
    		.setDescription(
    			"émoji créé : " +
    			emoji.name
    		);

    	log.send(embed);
    }
  }catch(err) {}
});

client.on('emojiDelete', emoji => {
  if(!emoji.guild) return undefined;


  try {
    let logs = JSON.parse(fs.readFileSync("./logs.json", "utf8"));
    if (logs[emoji.guild.id].toggle === 1) {
    	var log = emoji.guild.channels.find(channel => channel.name === "logs");
      if(!log) return undefined;

    	const embed = new RichEmbed()
    		.setTitle('log :')
    		.setColor(0xffe402)
    		.setThumbnail(emoji.url)
    		.setDescription(
    			"émoji supprimé : " +
    			emoji.name
    		);

    	log.send(embed);
    }
  }catch(err) {}
});

/*client.on('guildBanAdd', ban => {
	var log = ban.guild.channels.find(channel => channel.name === "log");
  if(!log) return undefined;

	const embed = new RichEmbed()
		.setTitle('log :')
		.setColor(0xffe402)
		.setDescription(
			"membre banni : " +
			ban.user.username
		);

	log.send(embed);
});

client.on('guildBanRemove', unban => {
	var log = unban.guild.channels.find(channel => channel.name === "log");
  if(!log) return undefined;

	const embed = new RichEmbed()
		.setTitle('log :')
		.setColor(0xffe402)
		.setDescription(
			"membre unban : " +
			unban.user.username
		);

	log.send(embed);
});*/

async function handleVideo(video, msg, voiceChannel, playlist = false) {
	const serverQueue = queue.get(msg.guild.id);
	const song = {
		id: video.id,
		title: Util.escapeMarkdown(video.title),
		url: `https://www.youtube.com/watch?v=${video.id}`
	};
	if (!serverQueue) {
		const queueConstruct = {
			textChannel: msg.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 4,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(msg.guild, queueConstruct.songs[0]);
		} catch (error) {
			console.error(`je ne peux pas rejoindre le salon vocal: ${error}`);
			queue.delete(msg.guild.id);
			return msg.channel.send(`je ne peux pas rejoindre le salon vocal: ${error}`);
		}
	} else {
		serverQueue.songs.push(song);
		if (playlist) return undefined;
		else return msg.channel.send(`✅ **${song.title}** a été ajouté à la playlist!`);
	}
	return undefined;
}

async function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}


	//const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
  const dispatcher = serverQueue.connection.playOpusStream(await ytdl(song.url))
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

	serverQueue.textChannel.send(`🎶 Start playing: **${song.title}**`);
}

function prefixVerifier(message) {

  try {
    let prefix = JSON.parse(fs.readFileSync("./prefix.json", "utf8"));
    return prefix[message.guild.id].prefix;
  }catch(err) {
    return config.prefix;
  }

}

function randomize(tab) {
    var i, j, tmp;
    for (i = tab.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        tmp = tab[i];
        tab[i] = tab[j];
        tab[j] = tmp;
    }
    return tab;
}

function verif(message) {


	loupgarou.then((value) => {
		if(lgmort != null && message.channel.id == value.id) {
			sorciere.then((value2) => {
				value2.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
				if(lgmort != null) {
					value2.send(lgmort.username + " à été tué par les loup garou")
				}
			});
			loupblanc.then((value2) => {
				value2.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
			});
		}
	});

	garde.then((value) => {
		if(protect != null && message.channel.id == value.id) {
			loupgarou.then((value2) => {
				value2.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
			});
		}
	});


	next = true;
	role.forEach(function(item, index, array) {
		if(item == "chien-loup") {
			if(chlg == null) {
				next = false
			}
		}else if(item == "enfant-sauvage") {
			if(modele == null) {
				next = false
			}
		}else if(item == "cupidon") {
			if(amoureux1 == null || amoureux2 == null) {
				next = false
			}
		}else if(item == "voyante") {
			if(vovo == false) {
				next = false
			}
		}else if(item == "garde") {
			if(protect == null) {
				next = false
			}
		}else if(item == "dictateur") {
			if(coup_etat == null) {
				next = false
			}
		}else if(item == "sorcière") {
			if(soso == "null") {
				next = false
			}
		}else if(item == "loup-garou") {
			if(lgmort == null) {
				next = false
			}
		}
	});

	if(next == true) {
		test = end();
		if(test != "null") {
			if(test == "village") {
				village.then((value) => {
					value.send("Victoire du village.")
					return;
				});
			}else if(test == "lg") {
				village.then((value) => {
					value.send("Victoire des loup garou.")
				});
			}else if(test == "lb") {
				village.then((value) => {
					value.send("Victoire du loup blanc.")
				});
			}else if(test == "fou") {
				village.then((value) => {
					value.send("Victoire du fou.")
				});
			}else if(test == "pyro") {
				village.then((value) => {
					value.send("Victoire du pyromane.")
				});
			}else if(test == "love") {
				village.then((value) => {
					value.send("Victoire des amoureux.")
				});
			}else if(test == "égalité") {
				village.then((value) => {
					value.send("égalité, tout le monde est mort.")
				});
			}
		}else {
			resetvote();
			if(dictacible != null) {
				players.forEach(function(item, index, array) {
					if(item.id == dictacible.id) {
						if(role[index] == "loup-garou" || role[index] == "loup-blanc" || role[index] == "pyromane" ) {
							dictacible = null
						}else {
							players.forEach(function(item2, index2, array2) {
								if(role[index2] == "dictateur") {
									mort(item2);
									dictacible = null
								}
							});

						}
					}
				});
			}
			if(soso == "kill") {
				mort(sosocible, 0)
			}else if(soso == "heal") {
				lgmort = null
			}
			if(lgmort != null) {
				mort(lgmort, 0)
			}
			//console.log(lgmort + "---" + sosocible)
			if(lgmort == null && sosocible == null) {
				village.then((value) => {
					value.send("Personne n'est mort cette nuit.")
				});
			}
			village.then((value) => {
				dd = day
				value.send("Le jour " + dd + " vient de démarrer.")
			});
			cycle = "day"
			setcycle(message);

			dayy(message);
		}
	}


}

function dayy(message) {
	test = end();
	if(test != "null") {
		if(test == "village") {
			village.then((value) => {
				value.send("Victoire du village.")
			});
			return;
		}else if(test == "lg") {
			village.then((value) => {
				value.send("Victoire des loup garou.")
			});
			return;
		}else if(test == "lb") {
			village.then((value) => {
				value.send("Victoire du loup blanc.")
			});
			return;
		}else if(test == "fou") {
			village.then((value) => {
				value.send("Victoire du fou.")
			});
			return;
		}else if(test == "pyro") {
			village.then((value) => {
				value.send("Victoire du pyromane.")
			});
			return;
		}else if(test == "love") {
			village.then((value) => {
				value.send("Victoire des amoureux.")
			});
			return;
		}else if(test == "égalité") {
			village.then((value) => {
				value.send("égalité, tout le monde est mort.")
			});
			return;
		}
	}
	if(chasse == true) {
		waitchasse = true;
		chasse = false;
		village.then((value) => {
			value.send("Le Chasseur est mort. Mais dans ses réflexe légendaires, il attrape son arme au moment de sa mort et tire avec la commande `*lg kill [nom_du_joueur]`.")
		});
	}else {
		if(coup_etat == true) {
			village.then((value) => {
				actif_coup_etat = true;
				coup_etat = false
				players.forEach(function(item, index, array) {
					if(role[index] == "dictateur") {
						value.send("Le dictateur " + item.username + " fait un coup d'état, La personne désigné par lui avec la commande `*lg kill [nom_du_joueur]` mourra.")
					}
				});

			});
		}else {
			if(dictacible != null) {
				cycle = "night"
				setcycle(message)
				test = end();
				if(test != "null") {
					if(test == "village") {
						village.then((value) => {
							value.send("Victoire du village.")
						});
						return;
					}else if(test == "lg") {
						village.then((value) => {
							value.send("Victoire des loup garou.")
						});
						return;
					}else if(test == "lb") {
						village.then((value) => {
							value.send("Victoire du loup blanc.")
						});
						return;
					}else if(test == "fou") {
						village.then((value) => {
							value.send("Victoire du fou.")
						});
						return;
					}else if(test == "pyro") {
						village.then((value) => {
							value.send("Victoire du pyromane.")
						});
						return;
					}else if(test == "love") {
						village.then((value) => {
							value.send("Victoire des amoureux.")
						});
						return;
					}else if(test == "égalité") {
						village.then((value) => {
							value.send("égalité, tout le monde est mort.")
						});
						return;
					}
				}else {
					village.then((value) => {
						value.send("La nuit tombe sur le village...")
					});
				}
			}else {
				if(maire == null && vote_maire == false) {
					village.then((value) => {
						value.send("Le village à besoin d'un maire. Vous pouvez voter avec la commande `*lg vote [nom_du_joueur]`. Vous pouvez aussi faire `*lg vote` pour ne voter pour personne. Quand tout le monde aura votés, la personne désigné à la majorité sera élu.")
					});
					vote_maire = true;
				}else {
					if(vote_mort == false) {
						resetvote();
						village.then((value) => {
							value.send("Le village va maintenant pouvoir voter pour pendre quelqu'un avec la commande `*lg vote [nom_du_joueur]`. Vous pouvez aussi faire `*lg vote nobody` pour ne voter pour personne. Quand tout le monde aura votés, la personne désigné à la majorité mourra.")
						});
						vote_mort = true
					}else {
						resetvote();
						cycle = "night"
						setcycle(message)
						test = end();
						if(test != "null") {
							if(test == "village") {
								village.then((value) => {
									value.send("Victoire du village.")
									return;
								});
							}else if(test == "lg") {
								village.then((value) => {
									value.send("Victoire des loup garou.")
									return;
								});
							}else if(test == "lb") {
								village.then((value) => {
									value.send("Victoire du loup blanc.")
									return;
								});
							}else if(test == "fou") {
								village.then((value) => {
									value.send("Victoire du fou.")
									return;
								});
							}else if(test == "pyro") {
								village.then((value) => {
									value.send("Victoire du pyromane.")
									return;
								});
							}else if(test == "love") {
								village.then((value) => {
									value.send("Victoire des amoureux.")
									return;
								});
							}else if(test == "égalité") {
								village.then((value) => {
									value.send("égalité, tout le monde est mort.")
									return;
								});
							}
						}else {
							village.then((value) => {
								value.send("La nuit tombe sur le village...")
							});
						}
					}
				}
			}
		}
	}

}

function mort(user, state) {

	if(state == 0) {
		if(user.username == amoureux1) {
				players.forEach(function(item, index, array) {
					if(item.username == amoureux2) {
						mort(item, 1)
					}
				});
			}else if(user.username == amoureux2) {
				players.forEach(function(item, index, array) {
					if(item.username == amoureux1) {
						mort(item, 1)
					}
				});
			}
	}
	rolemort = null;
	players.forEach(function(item, index, array) {
		if(user.id == item.id) {
			vie[index] = false
			rolemort = role[index]
			if(rolemort == "chasseur") {
				chasse = true;
			}
		}
	});
	if(chasse == true) {
		village.then((value3) => {
			necromancien.then((value2) => {
				salon.forEach(function(item, index, array) {
						item.then((value) => {
							if(value.id == value2.id) {
								value.updateOverwrite(user.id, { VIEW_CHANNEL: true });

							}else if(value.id == value3.id) {
								value.updateOverwrite(user.id, { SEND_MESSAGES: true });
							}else {
								value.updateOverwrite(user.id, { SEND_MESSAGES: false });
							}
						});
				});
			});
		});
	}else {
		necromancien.then((value2) => {
			salon.forEach(function(item, index, array) {
					item.then((value) => {
						if(value.id == value2.id) {
							value.updateOverwrite(user.id, { VIEW_CHANNEL: true });
						}else {
							value.updateOverwrite(user.id, { SEND_MESSAGES: false });
						}
					});
			});
		});
	}

	players.forEach(function(item, index, array) {
		if(user.id == item.id) {
			village.then((value) => {
				value.send("Le joueur " + user.username + " est mort. Il était " + role[index])
			});
		}
	});
}

function setcycle(message) {
	if(cycle == 'day') {
		soso = "null";
		sosocible = null;
		vovo = false;
		protect = null;
		day = day + 1;
		lgmort = null;
	}

	ccycle = (cycle == "night")
	village.then((value) => {
		value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: !ccycle });
	});

	gar = false
	role.forEach(function(item, index, array) {
		if(item == "garde") {
			gar = true
		}
	});

	if(gar == true) {
		if(cycle == "night") {
			loupgarou.then((value) => {
				value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES : false});
			});
		}else {
			loupgarou.then((value) => {
				value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
			});
		}
	}else {
			loupgarou.then((value) => {
				value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: ccycle });
			});
	}

	lg = false
	role.forEach(function(item, index, array) {
		if(item == "loup-garou" || item == "loup-blanc") {
			lg = true
		}
	});

	if(lg == true) {
		if(cycle == "night") {
			sorciere.then((value) => {
				value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES : false});
			});
		}else {
			sorciere.then((value) => {
				value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
			});
		}
	}else {
		if(cycle == "night") {
			sorciere.then((value) => {
				value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
				value.send("Personne n'est mort");
			});
		}else {
			sorciere.then((value) => {
				value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
			});
		}
	}

	voyante.then((value) => {
		value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: ccycle });
	});
	petitefille.then((value) => {
		value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: ccycle });
	});

	gar = false
	role.forEach(function(item, index, array) {
		if(item == "garde") {
			gar = true
		}
	});

	if(gar == true) {
		if(cycle == "night") {
			loupblanc.then((value) => {
				value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES : false});
			});
		}else {
			loupblanc.then((value) => {
				value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
			});
		}
	}else {
			loupblanc.then((value) => {
				value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: ccycle });
			});
	}



	pyromane.then((value) => {
		value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: ccycle });
	});
	garde.then((value) => {
		value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: ccycle });
	});
	necromancien.then((value) => {
		value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: ccycle });

		players.forEach(function(item, index, array) {
			if(vie[index] == false) {
				value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: ccycle });
			}
		});

	});
	cupidon.then((value) => {
		value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: ccycle });
	});
	dictateur.then((value) => {
		value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: ccycle });
	});

}

function resetvote() {
	vv = []
	players.forEach(function(item, index, array) {
		vv.push([])
	});
	vote_nothing = [];
	votes = vv;
}

function get_equipe_from_role(rol) { //return lg, lb, village, pyro, fou
	if(rol == "loup-garou") {
		return "lg";
	}else if(rol == "loup-blanc") {
		return 'lb';
	}else if(rol == "chien-loup") {
		if(chlg == "lg") {
			return "lg";
		}else {
			return "village";
		}
	}else if(rol == "petite-fille") {
		return "village";
	}else if(rol == "simple-villageois") {
		return "village";
	}else if(rol == "voyante") {
		return "village";
	}else if(rol == "sorcière") {
		return "village";
	}else if(rol == "pyromane") {
		return "pyro";
	}else if(rol == "enfant-sauvage") {
		players.forEach(function(item, index, array) {
			if(index == modele) {
				if(vie[index] == true) {
					return "village";
				}else {
					return "lg";
				}
			}
		});
	}else if(rol == "cupidon") {
		return "village";
	}else if(rol == "garde") {
		return "village";
	}else if(rol == "dictateur") {
		return "village";
	}else if(rol == "nécromancien") {
		return "village";
	}else if(rol == "fou") {
		return "fou";
	}else if(rol == "chasseur") {
		return "village";
	}
	return "null";
}

function end() {
	equipe_vill = false
	equipe_lg = false
	equipe_love = false
	equipe_pyro = false
	equipe_lb = false
	equipe_fou = false

	players.forEach(function(item, index, array) {
		if(vie[index] == true) {
			if(amoureux1 != null && item.id == amoureux1.id) {
				players.forEach(function(item2, index2, array2) {
					if(item2.id == amoureux2.id) {
						if(get_equipe_from_role(role[index]) == get_equipe_from_role(role[index2])) {
							if(get_equipe_from_role(role[index]) == "village") {
								equipe_vill = true;
							}else if(get_equipe_from_role(role[index]) == "lg"){
								equipe_lg = true;
							}
						}else {
							equipe_love == true;
						}
					}
				});
			}else if(amoureux1 != null && item.id == amoureux2.id) {
				players.forEach(function(item2, index2, array2) {
					if(item2.id == amoureux1.id) {
						if(get_equipe_from_role(role[index]) == get_equipe_from_role(role[index2])) {
							if(get_equipe_from_role(role[index]) == "village") {
								equipe_vill = true;
							}else if(get_equipe_from_role(role[index]) == "lg"){
								equipe_lg = true;
							}
						}else {
							equipe_love == true;
						}
					}
				});
			}else {
				if(get_equipe_from_role(role[index]) == "village") {
					equipe_vill = true
				}else if(get_equipe_from_role(role[index]) == "lg") {
					equipe_lg = true;
				}else if(get_equipe_from_role(role[index]) == "pyro") {
					equipe_pyro = true;
				}else if(get_equipe_from_role(role[index]) == "lb") {
					equipe_lb = true;
				}else if(get_equipe_from_role(role[index]) == "fou") {
					equipe_fou = true;
				}

			}
		}


	});

	if(equipe_vill == true && equipe_lg == false && equipe_pyro == false && equipe_lb == false && equipe_fou == false && equipe_love == false) {
		return "village"
	}else if(equipe_vill == false && equipe_lg == true && equipe_pyro == false && equipe_lb == false && equipe_fou == false && equipe_love == false) {
		return "lg"
	}else if(equipe_vill == false && equipe_lg == false && equipe_pyro == true && equipe_lb == false && equipe_fou == false && equipe_love == false) {
		return "pyro"
	}else if(equipe_vill == false && equipe_lg == false && equipe_pyro == false && equipe_lb == true && equipe_fou == false && equipe_love == false) {
		return "lb"
	}else if(equipe_vill == false && equipe_lg == false && equipe_pyro == false && equipe_lb == false && equipe_fou == true && equipe_love == false) {
		return "fou"
	}else if(equipe_vill == false && equipe_lg == false && equipe_pyro == false && equipe_lb == false && equipe_fou == false && equipe_love == true) {
		return "love"
	}else if(equipe_vill == false && equipe_lg == false && equipe_pyro == false && equipe_lb == false && equipe_fou == false && equipe_love == false) {
		return "égalité"
	}else {
		return "null"
	}

}



client.login(process.env.DISCORD_TOKEN);
