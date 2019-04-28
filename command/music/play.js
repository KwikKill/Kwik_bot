const { Client, RichEmbed } = require('discord.js');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.GOOGLE_API_KEY);
const queue = new Map();

function play(msg) {
  console.log("play lancé");

  const args = msg.content.split(' ');
	const searchString = args.slice(1).join(' ');
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
  const serverQueue = queue.get(msg.guild.id);

  const voiceChannel = msg.member.voiceChannel;
  if (!voiceChannel) {
    msg.channel.send('je suis désolé maisvous n\'êtes pas dans un salon vocal');
    return;
  }
  const permissions = voiceChannel.permissionsFor(msg.client.user);
  if (!permissions.has('CONNECT')) {
			msg.channel.send('je ne peux pas me connecter dans votre salon vocal !');
      return;
  }
  if (!permissions.has('SPEAK')) {
			msg.channel.send('je ne peux pas parler dans votre salon vocal !');
      return;
  }
  if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			const playlist = await youtube.getPlaylist(url);
			const videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
				await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
			}
			msg.channel.send(`✅ Playlist: **${playlist.title}** a bien été ajouté à la playlist!`);
      return;
  }
  else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 10);
					let index = 0;
					msg.channel.send(`
__**Song selection:**__
${videos.map(video2 => `**${++index} -** ${video2.title}`).join('\n')}
Please provide a value to select one of the search results ranging from 1-10.
					`);
					// eslint-disable-next-line max-depth
					try {
						var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
							maxMatches: 1,
							time: 10000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
						msg.channel.send('résultat absent ou invalide, annulation de la sélection musicale.');
            return;
					}
					const videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					msg.channel.send('🆘 Je n\'ai pas trouvé de résultats.');
          return;
				}
			}
			handleVideo(video, msg, voiceChannel);
      return;
    }

}

module.exports = play;
