function kick(message) {

  let can_manage_chans = message.channel.permissionsFor(message.member).has("KICK_MEMBERS", false);
  if(can_manage_chans) {

    const user = message.mentions.users.first();
    if (user) {

      const member = message.guild.member(user);
      if (member) {

        member.kick('demande de kick par ' + message.author.username).then(() => {
        message.reply(` ${user.tag} a bien été kick !`);
        }).catch(err => {
          message.reply('Je n\'ai pas pu le kick');
          //console.error(err);
        });
      } else {
        message.reply('cet utilisateur n\'est pas présent sur le serveur !');
      }
    } else {
      message.reply('vous n\'avez pas mentionnez l\'utilisateur à kick');
    }
  }else {
    message.reply('vous n\'avez pas les perms necessaire !');

  }

}

module.exports = kick;
