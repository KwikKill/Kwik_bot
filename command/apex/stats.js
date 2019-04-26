const { Client, RichEmbed } = require('discord.js');
function stats(message,user,platform) {

  if(platform != 'PC' && platform != 'XBOX' && platform != 'PSN') {
    const embed = new RichEmbed()
      .setTitle('vos stats générales Apex :')
      .setColor(0xffe402)
      .setThumbnail(
        "https://upload.wikimedia.org/wikipedia/fr/0/03/Apex_Legends_Logo.png"
      )
      .setDescription(
        "Une erreur est survenue : " +
        "\nVérifiez le nom de la plateforme."
      );

    message.channel.send(embed);
    return;

  }
  const Apex = require('apex-api');

  // Create an instance of the client with your API Key
  const apex = new Apex(process.env.APEX_KEY);

  apex.user(user, platform).then(data => {

    try {
      console.log('patapouet');
      console.log(data);

      var description = ""
      data.data.stats.forEach(function(element) {
        description += "\n" + element.metadata.name + " : " + element.displayValue;
      });


      const embed = new RichEmbed()
      .setTitle('vos stats générales Apex :')
      .setColor(0xffe402)
      .setThumbnail("https://upload.wikimedia.org/wikipedia/fr/0/03/Apex_Legends_Logo.png")
      .setDescription(
      "Pseudo : " + data.data.metadata.platformUserHandle +
      description  +
      "\n\nLes stats peuvent seulement être recupérées grâce aux trackeurs de votre banière\nDonnées fournies par https://apex.tracker.gg/"
      );

      console.log(data.data.stats);

      message.channel.send(embed);

    } catch(e) {
      const embed = new RichEmbed()
        .setTitle('vos stats générales Apex :')
        .setColor(0xffe402)
        .setThumbnail(
          "https://upload.wikimedia.org/wikipedia/fr/0/03/Apex_Legends_Logo.png"
          )
        .setDescription(
          "Une erreur est survenue : " +
          data.errors[0].message +
          "\nVérifiez le nom du joueur."
          );

      message.channel.send(embed);
    }

  });

}

module.exports = stats;
