const { Client, RichEmbed } = require('discord.js');
function unban(message, id) {

  let can_manage_chans = message.channel.permissionsFor(message.member).has("BAN_MEMBERS", false);
  if(can_manage_chans) {



    message.guild.unban(id, 'demande de unban par ' + message.author.username).then((user) => {
    message.reply(`${user.username} a bien été unban !`);
    }).catch(err => {
      message.reply('Je n\'ai pas pu le unban');
      //console.error(err);
    });
  }else {
    message.reply('vous n\'avez pas les permissions necessaires !');

  }
}

module.exports = unban;
