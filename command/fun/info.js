const { Client, RichEmbed } = require('discord.js');
function info(message) {

  if(message.mentions.users.size) {
    let user = message.mentions.users.first();

    const embed = new RichEmbed()
    .setTitle('vos stats :')
    .setColor(0xffe402)
    .setThumbnail(user.avatarURL)
    .setDescription("vos infos :")
    .addField(
      "Pseudo : ", user.username
    ).addField(
      "En ligne : ", user.presence.status, true
    ).addField(
      "ID", user.id, true
    ).addField(
      "Jeux : ", user.presence.game, true
    ).addField(
      "Compte créé le : ", user.createdAt, true
    );
    return message.channel.send(embed);

  }

  const embed = new RichEmbed()
  .setTitle('vos stats :')
  .setColor(0xffe402)
  .setThumbnail(message.author.avatarURL)
  .setDescription("vos infos :")
  .addField(
    "Pseudo : ",message.author.username
  ).addField(
    "En ligne : ", message.author.presence.status, true
  ).addField(
    "ID", message.author.id, true
  ).addField(
    "Jeux : ", message.author.presence.game, true
  ).addField(
    "Compte créé le : ", message.author.createdAt, true
  );
  message.channel.send(embed);


}

module.exports = info;
