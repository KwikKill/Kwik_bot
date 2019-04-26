const { Client, RichEmbed } = require('discord.js');
function info(message) {
  const embed = new RichEmbed()
  .setTitle('vos stats :')
  .setColor(0xffe402)
  .setThumbnail(message.author.avatarURL)
  .setDescription("pseudo : " + message.author.username);
  message.channel.send(embed);
}

module.exports = info;
