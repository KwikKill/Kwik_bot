const { Client, RichEmbed } = require('discord.js');
function legend(message,legend) {

  if(legend == "list") {

    const embed = new RichEmbed()
      .setTitle("legendes apex :")
      .setColor(0xffe402)
      .setThumbnail("https://upload.wikimedia.org/wikipedia/fr/0/03/Apex_Legends_Logo.png")
      .setDescription(
      "les légendes disponible sont : \n - Bloodhound\n - Gibraltar\n - Lifeline\n - Pathfinder\n - Octane\n - Wraith\n - Bangalor\n - Caustic\n - Mirage"
      );

    message.channel.send(embed);

  }else if(legend == "Bloodhound" || legend == "bloodhound" ) {

    const embed = new RichEmbed()
      .setTitle("Bloodhound - le traqueur :")
      .setColor(0xffe402)
      .setThumbnail("https://upload.wikimedia.org/wikipedia/fr/0/03/Apex_Legends_Logo.png")
      .setDescription(
      "Bloodhound est un héros discret qui a des capacitées de traque."
      )
      .addField(
        "Passif","Le passif de Bloodhound est de voir des indices sur le passage d'un ennemie. Quand un ennemie, par exemple, a ouvert une porte, Bloodhound voit sur la porte une indication comme quoi l'adversaire est passé par là. Il y as aussi marqué il y as combien de temps l'ennemie est passé ici."
      ).addField(
        "abilitée tactique","le tactique de Bloodhound permet de détecter les ennemies dans un rayon relativement peu important. Cette capacité est surtout utile pour avoir la position précise de l'ennemie qui est dans le même bâtiment que vous (par exemple, à l'étage)."
      ).addField(
        "abilité ultime","l'ultime de Bloodhound est très utile dans les combats. Bloodhound devient un traqueur hors du commun et voit directement les ennemies en rouges ainsi que plein d'autre indices pouvant aider en combats."
      ).setImage(
        "https://gamepedia.cursecdn.com/apexlegends_gamepedia_en/0/05/Bloodhound.jpg?version=4c5dec2a7cbb66867f9e3852de29838b"
      );

    message.channel.send(embed);

  }else if(legend == "Gibraltar" || legend == "gibraltar") {

    const embed = new RichEmbed()
      .setTitle("Gibraltar - le tank :")
      .setColor(0xffe402)
      .setThumbnail("https://upload.wikimedia.org/wikipedia/fr/0/03/Apex_Legends_Logo.png")
      .setDescription(
      "Gibraltar est un héros de type tank qui peut protéger ses alliés facilement."
      )
      .addField(
        "Passif","Le passif de Gibraltar est d'avoir un bouclier quand il vise. ce bouclier absorbe les dégats quand les balles le touche."
      ).addField(
        "abilitée tactique","le tactique de Gibraltar permet de créé un dôme protecteur qui absorbera tout les dégats pendant une période de 15sec. Le bouclier ne bloquera par contre que les balles. les grenades et les ennemies peuvent le traverser."
      ).addField(
        "abilité ultime","l'ultime de Gibraltar est un bombardement défensif. La zone sélectionné sera bombardé violemment. Le bombardement fait 45 de dégats mais les explosions sont relativement éloigné les unes des autres ce qui rend l'esquive possible (difficile quand même)."
      ).setImage(
        "https://gamepedia.cursecdn.com/apexlegends_gamepedia_en/8/8b/Gibraltar.jpg?version=5558c3d340cd25a3eadf182096e60ff5"
      );

    message.channel.send(embed);
  }else if(legend == "Lifeline" || legend == "lifeline") {

    const embed = new RichEmbed()
      .setTitle("Lifeline - la healeuse :")
      .setColor(0xffe402)
      .setThumbnail("https://upload.wikimedia.org/wikipedia/fr/0/03/Apex_Legends_Logo.png")
      .setDescription(
      "Lifeline est une légende qui a des capacitées de heal et de support."
      )
      .addField(
        "Passif","Le passif de Lifeline est de déployer un bouclier qui arrête les tirs devant elle pendant qu'elle réanime ses alliés."
      ).addField(
        "abilitée tactique","le tactique de Lifeline est de placer un robot qui soigne les personnes à proximité. Attention tout de mêmes, Le robot peut aussi soigner vos ennemis."
      ).addField(
        "abilité ultime","l'ultime de Lifeline est de faire tomber du ciel une cargaison de support. cette cargaison peut contenir du stuf plus ou moins bien. Le désavantage est que les ennemies proches voient tomber ce pack de soutien."
      ).setImage(
        "https://gamepedia.cursecdn.com/apexlegends_gamepedia_en/4/4f/Lifeline.jpg?version=cbd81f92b367bf7967cc364e5151cc77"
      );

    message.channel.send(embed);
  }else if(legend == "Pathfinder" || legend == "pathfinder") {

    const embed = new RichEmbed()
      .setTitle("Pathfinder - le robot :")
      .setColor(0xffe402)
      .setThumbnail("https://upload.wikimedia.org/wikipedia/fr/0/03/Apex_Legends_Logo.png")
      .setDescription(
      "Pathfinder est une légende qui a des capacitées de mouvement, nottament grâce à des grapins et des tyroliennes."
      )
      .addField(
        "Passif","Le passif de Pathfinder est de pouvoir scanner les balises (visibles sur la map) pour obtenir des informations sur la zone."
      ).addField(
        "abilitée tactique","le tactique de Pathfinder est de pouvoir balancer un grapin qui lui permet de se déplacer plus vite ou d'attirer ses ennemis."
      ).addField(
        "abilité ultime","l'ultime de Pathfinder est de pouvoir placer une tyrolienne qui lui permet de se déplacer plus vite sur une grande distance."
      ).setImage(
        "https://gamepedia.cursecdn.com/apexlegends_gamepedia_en/thumb/5/53/Pathfinder.jpg/300px-Pathfinder.jpg?version=7e1bf9861a0abe49a58c7ef4665b40ab"
      );

    message.channel.send(embed);
  }else if(legend == "Octane" || legend == "octane") {

    const embed = new RichEmbed()
      .setTitle("Octane - le rapide :")
      .setColor(0xffe402)
      .setThumbnail("https://upload.wikimedia.org/wikipedia/fr/0/03/Apex_Legends_Logo.png")
      .setDescription(
      "Octane est une légende rapide. Ses capacitées lui permettent d'aller plus vite et cela l'avantage."
      )
      .addField(
        "Passif","Le passif d'Octane est de récupérer sa vie quand on ne lui tire pas dessus.Pratique pour économiser les soin"
      ).addField(
        "abilitée tactique","le tactique d'Octane est de pouvoir aller plus vite mais en contrepartie, il doit \"sacrifier\" 10% de sa vie."
      ).addField(
        "abilité ultime","l'ultime d'Octane est de placer un jumppad qui réagit comme un trampoline. Aller dessus permet d'être propulsé en l'air."
      ).setImage(
        "https://media.contentapi.ea.com/content/dam/apex-legends/common/legends/apex-section-bg-legends-octane-xl.jpg.adapt.320w.jpg"
      );

    message.channel.send(embed);
  }

}

module.exports = legend;
