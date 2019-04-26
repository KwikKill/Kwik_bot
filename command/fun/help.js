function help(message,embed) {

  
  .setTitle("liste des commandes :")
  .setColor(0xffe402)
  //.setThumbnail(message.author.avatarURL)
  .setDescription("voici la liste des commandes disponible :")
  .addField("général","*help : affiche cette liste \n*info : affiche vos infos ")
  .addField("modération","*kick : expulse un membre du serveur \n*ban : banni un membre du serveur \n*unban : débanni un membre du serveur (néssecite l'id)")
  .addField("Apex","*apex stats [nom du joueur] [plateforme] : permet de voir ses stats apex \n*apex legend [nom de la légende] : permet d'avoir des infos sur une légende ");


  message.author.send(embed);


}
module.exports = help;
