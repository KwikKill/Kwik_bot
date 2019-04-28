const { Client, RichEmbed, Util} = require('discord.js');
const YouTube = require('simple-youtube-api');
const config = require('./config.json');
const ytdl = require('ytdl-core');

const client = new Client();

const youtube = new YouTube(process.env.GOOGLE_API_KEY);
const queue = new Map();


client.on('warn', console.warn);

client.on('error', console.error);

client.on('ready', () => {
    console.log('Le bot est démarré !');
		client.user.setActivity("Aduler Loomy");
});

client.on('message', async message => {
    if (message.author.bot) return undefined;
    if (!message.content.startsWith(config.prefix)) return undefined;

    const args = message.content.split(' ');
    const searchString = args.slice(1).join(' ');
    const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
    const serverQueue = queue.get(message.guild.id);

    if (message.content === config.prefix + 'ping') {
			message.channel.sendMessage("pong");
			return;

  	}

		if(message.content === config.prefix + 'help') {

      const help = require('./command/fun/help.js');
      help(message);

			return;

		}

    if(message.content === config.prefix + 'info') {

      const info = require('./command/fun/info.js');
			info(message);

			return;

		}

		if (message.content.startsWith(config.prefix + 'kick')) {

      const kick = require('./command/moderation/kick.js');
			kick(message);

			return;
		}

		if (message.content.startsWith(config.prefix + 'ban')) {

      const ban = require('./command/moderation/ban.js');
			ban(message);

			return;
		}

    var regexpunban = new RegExp('^\\' + config.prefix + 'unban\\s+([^\\s]*)$');
		if (regexpunban.test(message.content)) {

      var id = message.content.replace(regexpunban, "$1");

      const unban = require('./command/moderation/unban.js');
			unban(message, id);

			return;
		}

		var regexp = new RegExp('^\\' + config.prefix + 'apex\\s+stats\\s+([^\\s]*)\\s+([^\\s]*)$');
		if(regexp.test(message.content)) {

			var user = message.content.replace(regexp, "$1");
			var platform = message.content.replace(regexp, "$2");

      const stats = require('./command/apex/stats.js');
			stats(message,user,platform);

			//curl https://public-api.tracker.gg/apex/v1/standard/profile/5/GAb_3511 -H "TRN-API-KEY: 29dd5302-c7ea-4c2c-8b5e-b7858844d8b4"

      return;
		}

		var regexp2 = new RegExp('^\\' + config.prefix + 'apex\\s+legend\\s+([^\\s]*)$');
		if(regexp2.test(message.content)) {
			var legend = message.content.replace(regexp2, "$1");

      const legends = require('./command/apex/legend.js');
      legends(message,legend);


		}

    if(message.content.startsWith(config.prefix + 'play')) {


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

    if(message.content.startsWith(config.prefix + 'skip')) {

      const skip = require('./command/music/skip.js');
			skip(message);

			return;

		}

    if(message.content.startsWith(config.prefix + 'stop')) {

      const stop = require('./command/music/stop.js');
			stop(message);

			return;

		}


});

client.on('guildMemberAdd', member => {
  if(!channel.guild) return undefined;
  const channel = member.guild.channels.find(ch => ch.name === 'qui-vous-a-inviter-❔');
  if (!channel) return undefined;
  channel.send(`Bienvenue, plébéien ${member}`);
});

client.on('channelCreate', channel => {
  if(!channel.guild) return undefined;
	var log = channel.guild.channels.find(channel => channel.name === "log");
  if(!log) return undefined;

	const embed = new RichEmbed()
		.setTitle('log :')
		.setColor(0xffe402)
		.setDescription(
			"salon créé : " +
			channel.name
		);

	log.send(embed);
});

client.on('channelDelete', chanel => {
  if(!channel.guild) return undefined;
	var log = chanel.guild.channels.find(channel => channel.name === "log");
  if(!log) return undefined;

	const embed = new RichEmbed()
		.setTitle('log :')
		.setColor(0xffe402)
		.setDescription(
			"salon supprimé : " +
			chanel.name
		);

	log.send(embed);
});

client.on('emojiCreate', emoji => {
  if(!channel.guild) return undefined;
	var log = emoji.guild.channels.find(channel => channel.name === "log");
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
});

client.on('emojiDelete', emoji => {
  if(!channel.guild) return undefined;
	var log = emoji.guild.channels.find(channel => channel.name === "log");
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
			volume: 5,
			playing: true
		};
		queue.set(msg.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
      console.log("a" + queueConstruct.songs[0]);

			var connection = await voiceChannel.join();

      console.log("b" + queueConstruct.songs[0]);

			queueConstruct.connection = connection;

      console.log("c" + queueConstruct.songs[0]);

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

function play(guild, song) {
	const serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	//console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
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



client.login(process.env.DISCORD_TOKEN);
