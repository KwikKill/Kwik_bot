const { Client, MessageEmbed } = require('discord.js');
function help(message) {

  const embed = new MessageEmbed()
  .setTitle("liste des commandes :")
  .setColor(0xffe402)
  //.setThumbnail(message.author.avatarURL)
  .setDescription("voici la liste des commandes disponible :")
  .addField("général","*help : affiche cette liste \n*info : affiche vos infos ")
  .addField("loup garou","*lg help : affiche l'aide du loup-garou")
  .addField("modération","*kick : expulse un membre du serveur \n*ban : banni un membre du serveur \n*unban : débanni un membre du serveur (néssecite l'id)")
  .addField("Apex","*apex stats [nom du joueur] [plateforme] : permet de voir ses stats apex \n*apex legend [nom de la légende] : permet d'avoir des infos sur une légende ")
  .addField("Musiques","*play [musique] : rajoute une musique dans le playlist \n*skip : skip une musique \n*stop : quitte le salon vocal\n*np : indique la musique actuellement joué\n*playlist : affiche la playlist\n*pause : met en pause\n*resume : reprend la musique\n*volume [volume] : change le volume de la musique");


  message.author.send(embed);


}
module.exports = help;
