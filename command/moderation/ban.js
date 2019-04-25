function ban(var message) {
  let can_manage_chans = message.channel.permissionsFor(message.member).has("BAN_MEMBERS", false);
  if(can_manage_chans) {

    const user = message.mentions.users.first();
    if (user) {

      const member = message.guild.member(user);
      if (member) {

        member.ban('demande de ban par ' + message.author.username).then(() => {
        message.reply(` ${user.tag} a bien été ban !`);
        }).catch(err => {
          message.reply('Je n\'ai pas pu le ban');
          //console.error(err);
        });
      } else {
        message.reply('cet utilisateur n\'est pas présent sur le serveur !');
      }
    } else {
      message.reply('vous n\'avez pas mentionnez l\'utilisateur à ban');
    }
  }else {
    message.reply('vous n\'avez pas les permissions necessaires !');

  }
}

module.exports = ban;
