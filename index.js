const { Client, RichEmbed } = require('discord.js');

const client = new Client();

var prefix = ("*")

client.on('ready', () => {
    console.log('Le bot est démarré !');
		client.user.setActivity("aduler Loomy")
});

client.on('message', message => {


    if (message.content === prefix + 'ping') {
			message.channel.sendMessage("pong");
			return;

  	}
		if(message.content === prefix + 'help') {

			message.author.send("liste des commandes :");

			const embed = new RichEmbed()
      .setTitle('général :')
      .setColor(0xffe402)
			//.setThumbnail(message.author.avatarURL)
      .setDescription("*help : affiche cette liste \n*info : affiche vos infos ");

			message.author.send(embed);


			const embed2 = new RichEmbed()
      .setTitle('modération :')
      .setColor(0xffe402)
			//.setThumbnail(message.author.avatarURL)
      .setDescription("*kick : permet de kick un utilisateur");

			message.author.send(embed2);

    	//message.channel.send(embed);
			return;


		}else if(message.content === prefix + 'info') {

			const embed = new RichEmbed()
      .setTitle('vos stats :')
      .setColor(0xffe402)
			.setThumbnail(message.author.avatarURL)
      .setDescription("pseudo : " + message.author.username);
    	message.channel.send(embed);
			return;

		}
		if (message.content.startsWith(prefix + 'kick')) {

      const kick = require('./command/moderation/kick.js');
			kick(message);

			return;
		}
		if (message.content.startsWith(prefix + 'ban')) {

      const ban = require('./command/moderation/ban.js');
			ban(message);

			return;
		}
    var regexpunban = new RegExp('^\\' + prefix + 'unban\\s+([^\\s]*)$');
		if (regexpunban.test(message.content)) {

      var id = message.content.replace(regexpunban, "$1");

      const unban = require('./command/moderation/unban.js');
			unban(message, id);

			return;
		}

		var regexp = new RegExp('^\\' + prefix + 'apex\\s+stats\\s+([^\\s]*)\\s+([^\\s]*)$');

		if(regexp.test(message.content)) {

			var user = message.content.replace(regexp, "$1");
			console.log('>>>>> USER : ' + user);
			var platform = message.content.replace(regexp, "$2");
			console.log('>>>>> PLATFORM : ' + platform);

			if(platform != 'PC' && platform != 'XBOX' && platform != 'PSN') {
				const embed = new RichEmbed()
					.setTitle('vos stats générales Apex :')
					.setColor(0xffe402)
					.setThumbnail(
						"https://upload.wikimedia.org/wikipedia/fr/0/03/Apex_Legends_Logo.png"
					)
					.setDescription(
						"Une erreur est survenue : " +
						"\nVérifiez le nom de la plateforme."
					);

				message.channel.send(embed);
				return;

			}
			const Apex = require('apex-api');

			// Create an instance of the client with your API Key
			const apex = new Apex(process.env.APEX_KEY);

			apex.user(user, platform).then(data => {

				try {
          console.log('patapouet');
					console.log(data);

					var description = ""
					data.data.stats.forEach(function(element) {
						description += "\n" + element.metadata.name + " : " + element.displayValue;
					});


					const embed = new RichEmbed()
      		.setTitle('vos stats générales Apex :')
      		.setColor(0xffe402)
					.setThumbnail("https://upload.wikimedia.org/wikipedia/fr/0/03/Apex_Legends_Logo.png")
      		.setDescription(
					"Pseudo : " + data.data.metadata.platformUserHandle +
					description  +
					"\n\nLes stats peuvent seulement être recupérées grâce aux trackeurs de votre banière\nDonnées fournies par https://apex.tracker.gg/"
					);

				  console.log(data.data.stats);

    			message.channel.send(embed);

				} catch(e) {
					const embed = new RichEmbed()
						.setTitle('vos stats générales Apex :')
						.setColor(0xffe402)
						.setThumbnail(
							"https://upload.wikimedia.org/wikipedia/fr/0/03/Apex_Legends_Logo.png"
						  )
						.setDescription(
							"Une erreur est survenue : " +
							data.errors[0].message +
							"\nVérifiez le nom du joueur."
						  );

					message.channel.send(embed);
				}

			});




			//curl https://public-api.tracker.gg/apex/v1/standard/profile/5/GAb_3511 -H "TRN-API-KEY: 29dd5302-c7ea-4c2c-8b5e-b7858844d8b4"

		}

		var regexp2 = new RegExp('^\\' + prefix + 'apex\\s+legend\\s+([^\\s]*)$');

		if(regexp2.test(message.content)) {
			var legend = message.content.replace(regexp2, "$1");

			if(legend == "list") {

				const embed = new RichEmbed()
      		.setTitle('legendes apex :')
      		.setColor(0xffe402)
					.setThumbnail("https://upload.wikimedia.org/wikipedia/fr/0/03/Apex_Legends_Logo.png")
      		.setDescription(
					"les légendes disponible sont : \n - Bloodhound\n - Gibraltar\n - Lifeline\n - Pathfinder\n - Octane\n - Wraith\n - Bangalor\n - Caustic\n - Mirage"
					);

				message.channel.send(embed);

			}else if(legend == "Bloodhound" || legend == "bloodhound" ) {

				const embed = new RichEmbed()
      		.setTitle('Bloodhound - le traqueur :')
      		.setColor(0xffe402)
					.setThumbnail("https://upload.wikimedia.org/wikipedia/fr/0/03/Apex_Legends_Logo.png")
      		.setDescription(
					"Bloodhound est un héros discret qui a des capacitées de traque."
					)
					.addField(
						"Passif","Le passif de Bloodhound est de voir des indices sur le passage d'un ennemie. Quand un ennemie, par exemple, a ouvert une porte, Bloodhound voit sur la porte une indication comme quoi l'adversaire est passé par là. Il y as aussi marqué il y as combien de temps l'ennemie est passé ici."
					).addField(
						"abilitée tactique","le tactique de Bloodhound permet de détecter les ennemies dans un rayon relativement peu important. Cette capacité est surtout utile pour avoir la position précise de l'ennemie qui est dans le même bâtiment que vous (par exemple, à l'étage)."
					).addField(
						"abilité ultime","l'ultime de Bloodhound est très utile dans les combats. Bloodhound devient un traqueur hors du commun et voit directement les ennemies en rouges ainsi que plein d'autre indices pouvant aider en combats."
					).setImage(
						"https://gamepedia.cursecdn.com/apexlegends_gamepedia_en/0/05/Bloodhound.jpg?version=4c5dec2a7cbb66867f9e3852de29838b"
					);

				message.channel.send(embed);
				return;

			}else if(legend == "Gibraltar" || legend == "gibraltar") {

				const embed = new RichEmbed()
      		.setTitle('Gibraltar - le tank :')
      		.setColor(0xffe402)
					.setThumbnail("https://upload.wikimedia.org/wikipedia/fr/0/03/Apex_Legends_Logo.png")
      		.setDescription(
					"Gibraltar est un héros de type tank qui peut protéger ses alliés facilement."
					)
					.addField(
						"Passif","Le passif de Gibraltar est d'avoir un bouclier quand il vise. ce bouclier absorbe les dégats quand les balles le touche."
					).addField(
						"abilitée tactique","le tactique de Gibraltar permet de créé un dôme protecteur qui absorbera tout les dégats pendant une période de 15sec. Le bouclier ne bloquera par contre que les balles. les grenades et les ennemies peuvent le traverser."
					).addField(
						"abilité ultime","l'ultime de Gibraltar est un bombardement défensif. La zone sélectionné sera bombardé violemment. Le bombardement fait 45 de dégats mais les explosions sont relativement éloigné les unes des autres ce qui rend l'esquive possible (difficile quand même)."
					).setImage(
						"https://gamepedia.cursecdn.com/apexlegends_gamepedia_en/8/8b/Gibraltar.jpg?version=5558c3d340cd25a3eadf182096e60ff5"
					);

				message.channel.send(embed);
				return;
			}else if(legend == "Lifeline" || legend == "lifeline") {

				const embed = new RichEmbed()
      		.setTitle('Lifeline - la healeuse :')
      		.setColor(0xffe402)
					.setThumbnail("https://upload.wikimedia.org/wikipedia/fr/0/03/Apex_Legends_Logo.png")
      		.setDescription(
					"Lifeline est une légende qui a des capacitées de heal et de support."
					)
					.addField(
						"Passif","Le passif de Lifeline est de déployer un bouclier qui arrête les tirs devant elle pendant qu'elle réanime ses alliés."
					).addField(
						"abilitée tactique","le tactique de Lifeline est de placer un robot qui soigne les personnes à proximité. Attention tout de mêmes, Le robot peut aussi soigner vos ennemis."
					).addField(
						"abilité ultime","l'ultime de Lifeline est de faire tomber du ciel une cargaison de support. cette cargaison peut contenir du stuf plus ou moins bien. Le désavantage est que les ennemies proches voient tomber ce pack de soutien."
					).setImage(
						"https://gamepedia.cursecdn.com/apexlegends_gamepedia_en/4/4f/Lifeline.jpg?version=cbd81f92b367bf7967cc364e5151cc77"
					);

				message.channel.send(embed);
				return;
			}else if(legend == "Pathfinder" || legend == "pathfinder") {

				const embed = new RichEmbed()
      		.setTitle('Pathfinder - le robot :')
      		.setColor(0xffe402)
					.setThumbnail("https://upload.wikimedia.org/wikipedia/fr/0/03/Apex_Legends_Logo.png")
      		.setDescription(
					"Pathfinder est une légende qui a des capacitées de mouvement, nottament grâce à des grapins et des tyroliennes."
					)
					.addField(
						"Passif","Le passif de Pathfinder est de pouvoir scanner les balises (visibles sur la map) pour obtenir des informations sur la zone."
					).addField(
						"abilitée tactique","le tactique de Pathfinder est de pouvoir balancer un grapin qui lui permet de se déplacer plus vite ou d'attirer ses ennemis."
					).addField(
						"abilité ultime","l'ultime de Pathfinder est de pouvoir placer une tyrolienne qui lui permet de se déplacer plus vite sur une grande distance."
					).setImage(
						"https://gamepedia.cursecdn.com/apexlegends_gamepedia_en/thumb/5/53/Pathfinder.jpg/300px-Pathfinder.jpg?version=7e1bf9861a0abe49a58c7ef4665b40ab"
					);

				message.channel.send(embed);
				return;
			}


		}
});

/*client.on('guildMemberAdd', member => {
  const channel = member.guild.channels.find(ch => ch.name === 'qui-vous-a-inviter-❔');
  if (!channel) return;
  channel.send(`Bienvenue, plébéien ${member}`);
});

client.on('channelCreate', chanel => {
	var log = chanel.guild.channels.find(channel => channel.name === "log");

	const embed = new RichEmbed()
		.setTitle('log :')
		.setColor(0xffe402)
		.setDescription(
			"salon créé : " +
			chanel.name
		);

	log.send(embed);
});

client.on('channelDelete', chanel => {
	var log = chanel.guild.channels.find(channel => channel.name === "log");
	const embed = new RichEmbed()
		.setTitle('log :')
		.setColor(0xffe402)
		.setDescription(
			"salon supprimé : " +
			chanel.name
		);

	log.send(embed);
});*/

client.on('emojiCreate', emoji => {
	var log = emoji.guild.channels.find(channel => channel.name === "log");

	const embed = new RichEmbed()
		.setTitle('log :')
		.setColor(0xffe402)
		.setThumbnail(emoji.url)
		.setDescription(
			"émoji créé : " +
			emoji.name
		);

	log.send(embed);
});

client.on('emojiDelete', emoji => {
	var log = emoji.guild.channels.find(channel => channel.name === "log");

	const embed = new RichEmbed()
		.setTitle('log :')
		.setColor(0xffe402)
		.setThumbnail(emoji.url)
		.setDescription(
			"émoji supprimé : " +
			emoji.name
		);

	log.send(embed);
});

client.login(process.env.DISCORD_TOKEN);
