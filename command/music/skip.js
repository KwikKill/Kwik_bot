const { Client, RichEmbed } = require('discord.js');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.GOOGLE_API_KEY);
const queue = new Map();

function skip(msg) {

  const args = msg.content.split(' ');
	const searchString = args.slice(1).join(' ');
	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
  const serverQueue = queue.get(msg.guild.id);
  
  if (!msg.member.voiceChannel) return msg.channel.send('vous n\'êtes pas dans un salon vocal !');
	if (!serverQueue) return msg.channel.send('Je ne peut pas skip cette musique.');
  serverQueue.connection.dispatcher.end('musique skip !');

}

module.exports = skip;
