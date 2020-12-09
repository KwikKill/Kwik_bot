const { Client, MessageEmbed, Util} = require('discord.js');
//const YouTube = require('simple-youtube-api');
const config = require('./config.json');
//const ytdl = require('ytdl-core-discord');
const fs = require("fs");

const client = new Client();

//const youtube = new YouTube(process.env.GOOGLE_API_KEY);
const queue = new Map();


normal = {
    "name": "classic",
    "roles": {
        "villageois": "villageois",
        "loup-garou": "loup-garou",
        "loup-blanc": "loup-blanc",
        "petite-fille": "petite-fille",
        "voyante": "voyante",
        "sorcière": "sorcière",
        "chien-loup": "chien-loup",
        "pyromane": "pyromane",
        "cupidon": "cupidon",
        "enfant-sauvage": "enfant-sauvage",
        "garde": "garde",
        "dictateur": "dictateur",
        "nécromancien": "nécromancien",
        "fou": "fou",
        "chasseur": "chasseur",
        "assassin": "assassin",
    },
    "messages": {
        "salon": {
            "village": "Bienvenue dans le village de Thiercelieux. Vous venez d'apprendre que des loup-garou se cachent parmis vous. Bonne chance pour cette première nuit d'angoisse",
            "loup-garou": "Vous êtes loup garou. Vous gagnez en tuant les villageois. Toutes les nuits vous pouvez tuer quelqu'un en faisant `*lg kill [nom_du_joueur]`. La majorité l'emportera. En cas d'égalité, il n'y auras pas de mort.",
            "petite-fille": "Vous êtes la petite fille. Tout les messages des loup-garou seront repostés ici.",
            "voyante": "Vous êtes la voyante. Vous pouvez chaque nuit voir le rôle d'un joueur. Pour cela, executez la commande `*lg look [nom_du_joueur]`.",
            "sorcière": "Vous êtes la sorcière. Vous pouvez, une fois par partie, empêcher la mort d'un joueur avec la commande `*lg heal` ou en tuer un autre avec la commande `*lg kill [nom_du_joueur]`. Pour ne rien faire, faites la commande `*lg nothing`. Pour voir les potions qu'il vous reste, vous pouvez faire `*lg potion`. Vous jouez après les loup garou.",
            "loup-blanc": "Vous êtes le loup blanc. Vous votez avec les loup garou mais vous gagnez seul. Vous pouvez voter une fois tout les deux tours dans ce salon avec la commande `*lg kill [nom_du_joueur]`.",
            "pyromane": "Vous êtes le pyromane. Vous gagnez seul. Chaque nuits vous avez le choix entre enduire deux joueur d'essences avec la commande `*lg oil [nom_du_joueur] [nom_du_joueur]` ou un seul avec la commande `*lg oil [nom_du_joueur]` ou personne avec la commande `*lg oil` ou allumer tout les joueurs enduits d'essence avec la commande `*lg fire`.",
            "garde": "Vous êtes le garde. Chaque nuit vous pouvez protéger un joueur avec la commande `*lg protect [nom_du_joueur]`.",
            "nécromancien": "Vous êtes le nécromancien. Chaque nuit, le gémissement des mort vous est transmis dans ce salon.",
            "amoureux": "Vous êtes amoureux. Si vous êtes dans la même équipe, vous devez gagner avec elle. Mais si vous n'êtes pas dans la même équipe, vous devez gagner seuls.",
            "chien-loup": "Vous êtes le chien loup. Le premier tour, vous pouvez choisir d'être loup garou avec la command `*lg choose lg` ou d'être villageois avec la command `*lg choose villageois`.",
            "enfant-sauvage": "Vous êtes l'enfant sauvage. Le premier tour, vous devez choisir un modèle avec la commande `*lg choose [nom_du_joueur]`. Vous êtes dans l'équipe des villageois tant que votre modèle est en vie. Vous devenez loup garou à sa mort.",
            "cupidon": "Vous êtes Cupidon. Votre seul tâche est de mettre deux personnes amoureuses avec la commande `*lg love [nom_du_joueur] [nom_du_joueur]` et de se marrer le reste de la partie.",
            "dictateur": "Vous êtes dictateur. Une fois par partie vous pouvez prendre le pouvoir de force avec la commande `*lg coup-état`. Sinon, faites `*lg nothing`. Le lendemain, vous pourez choisir qui va mourir de la main des villageois. Si vous choisissez un loup garou, vous garderez le pouvoir. Mais si par malheur vous tuez un innocent, vos remord vous pousseront à vous suiccider pendant la nuit.",
        },
        "pouvoir": {
            "chien-loup-villageois": "Vous avez choisie d'être villageois",
            "chien-loup-lg": "Vous avez choisie d'être loup garou",
            "enfant-sauvage": "Vous avez choisie {0} comme modèle.",
            "cupidon": "Vous avez bien mis {0} et {1} ensemble.",
            "dmlove": ":hearts: Vous êtes en couple avec {0} qui est {1} :hearts:",
            "pyromane": "vous avez enduit d'huile {0} et {1}.",
            "oil": "vous avez été enduit d'essence.",
            "burn": "vous avez décidé d'allumer le feu (RIP johnny)",
            "voyante": "Le joueur {0} est {1}.",
            "protect": "Vous avez protégé {0}.",
            "coup-état": "Vous avez décidé de faire un coup d'état.",
            "dictateur-nothing": "Vous avez décidé de ne pas faire de coup d'état.",
            "sorcière-nothing": "Vous n'avez pas utilisé de potions.",
            "potion-vie-true": "Vous n'avez pas utilisé votre potion de vie",
            "potion-vie-false": "Vous avez utilisé votre potion de vie",
            "potion-mort-true": "Vous n'avez pas utilisé votre potion de mort",
            "potion-mort-false": "Vous avez utilisé votre potion de mort",
            "lg-kill": "Les loup garou ont fait leurs choix, {0} est mort.",
            "lgb-kill": "Vous avez décidé de tuer {0}.",
            "vote-mort": "Vous avez voté contre {0}.",
            "vote-maire": "Vous avez voté pour {0}.",
            "sorcière-kill": "Vous avez tué {0}.",
            "sorcière-heal": "Vous avez soigné {0}.",
            "village-kill": "Le village à fait son choix, {0} est mort.",
            "fou-win": "{0} était fou ! Le fou à gagné !",
            "village-maire": "Le village à fait son choix, {0} est élu maire.",
            "vote-blanc": "Vous avez voté blanc.",
        },
        "misc": {
            "lg-kill": "{0} à été tué par les loup garou",
            "personne-mort": "Personne n'est mort cette nuit.",
            "jour": "Le jour {0} vient de démarrer.",
            "nuit": "La nuit tombe sur le village...",
            "vote-personne": "Le village n'as pas pu se mettre d'accord, le maire va pouvoir départager avec la commande `*lg vote [nom_du_joueur]`",
            "chasseur": "Le Chasseur est mort. Mais dans ses réflexe légendaires, il attrape son arme au moment de sa mort et tire avec la commande `*lg kill [nom_du_joueur]`.",
            "dictateur": "Le dictateur {0} fait un coup d'état, La personne désigné par lui avec la commande `*lg kill [nom_du_joueur]` mourra.",
            "maire": "Le village à besoin d'un maire. Vous pouvez voter avec la commande `*lg vote [nom_du_joueur]`. Vous pouvez aussi faire `*lg vote nobody` pour ne voter pour personne. Quand tout le monde aura votés, la personne désigné à la majorité sera élu.",
            "mort-village": "Le village va maintenant pouvoir voter pour pendre quelqu'un avec la commande `*lg vote [nom_du_joueur]`. Vous pouvez aussi faire `*lg vote nobody` pour ne voter pour personne. Quand tout le monde aura votés, la personne désigné à la majorité mourra.",
            "mort": "Le joueur {0} est mort. Il était {1}",
            "mort-maire": "Le maire est mort, il va pouvoir désigner son successeur avec la commande `*lg choose [nom_du_joueur]`",
            "mort-love": "Dans son imense chagrin, {0} a rejoint la tombe. Il était {1}. Ses derniers mot furent : \"Ce n'est pas gay, c'est de la Bromance\"",
        },
        "victoire": {
            "village": "Victoire du village.",
            "loup-garou": "Victoire des loup garou.",
            "loup-blanc": "Victoire du loup blanc.",
            "fou": "Victoire du fou.",
            "pyromane": "Victoire du pyromane.",
            "love": "Victoire des amoureux.",
            "égalité": "égalité, tout le monde est mort.",
        },
    },
};

nazi = {
    "name": "Révolution Hitlérienne",
    "roles": {
        "villageois": "juifs",
        "loup-garou": "nazis",
        "loup-blanc": "Général Pétain",
        "petite-fille": "l’espionne",
        "voyante": "la presse de guerre",
        "sorcière": "femme au foyer",
        "chien-loup": "le fonctionnaire",
        "pyromane": "le crématorium",
        "cupidon": "L’armistice",
        "enfant-sauvage": "le collabo",
        "garde": "Anne Frank",
        "dictateur": "Staline",
        "nécromancien": "Le fossoyeur",
        "fou": "fou",
        "chasseur": "le résistant",
        "assassin": "De Gaulle",
    },
    "messages": {
        "salon": {
            "village": "Bienvenue dans le village de Thiercelieux. Vous venez d'apprendre que des loup-garou se cachent parmis vous. Bonne chance pour cette première nuit d'angoisse",
            "loup-garou": "Vous êtes loup garou. Vous gagnez en tuant les villageois. Toutes les nuits vous pouvez tuer quelqu'un en faisant `*lg kill [nom_du_joueur]`. La majorité l'emportera. En cas d'égalité, il n'y auras pas de mort.",
            "petite-fille": "Vous êtes la petite fille. Tout les messages des loup-garou seront repostés ici.",
            "voyante": "Vous êtes la voyante. Vous pouvez chaque nuit voir le rôle d'un joueur. Pour cela, executez la commande `*lg look [nom_du_joueur]`.",
            "sorcière": "Vous êtes la sorcière. Vous pouvez, une fois par partie, empêcher la mort d'un joueur avec la commande `*lg heal` ou en tuer un autre avec la commande `*lg kill [nom_du_joueur]`. Pour ne rien faire, faites la commande `*lg nothing`. Pour voir les potions qu'il vous reste, vous pouvez faire `*lg potion`. Vous jouez après les loup garou.",
            "loup-blanc": "Vous êtes le loup blanc. Vous votez avec les loup garou mais vous gagnez seul. Vous pouvez voter une fois tout les deux tours avec la commande `*lg kill [nom_du_joueur]`.",
            "pyromane": "Vous êtes le pyromane. Vous gagnez seul. Chaque nuits vous avez le choix entre enduire deux joueur d'essences avec la commande `*lg oil [nom_du_joueur] [nom_du_joueur]` ou allumer tout les joueurs enduits d'essence avec la commande `*lg fire`.",
            "garde": "Vous êtes le garde. Chaque nuit vous pouvez protéger un joueur avec la commande `*lg protect [nom_du_joueur]`.",
            "nécromancien": "Vous êtes le nécromancien. Chaque nuit, le gémissement des mort vous est transmis dans ce salon.",
            "amoureux": "Vous êtes amoureux. Si vous êtes dans la même équipe, vous devez gagner avec elle. Mais si vous n'êtes pas dans la même équipe, vous devez gagner seuls.",
            "chien-loup": "Vous êtes le chien loup. Le premier tour, vous pouvez choisir d'être loup garou avec la command `*lg choose lg` ou d'être villageois avec la command `*lg choose villageois`.",
            "enfant-sauvage": "Vous êtes l'enfant sauvage. Le premier tour, vous devez choisir un modèle avec la commande `*lg choose [nom_du_joueur]`. Vous êtes dans l'équipe des villageois tant que votre modèle est en vie. Vous devenez loup garou à sa mort.",
            "cupidon": "Vous êtes Cupidon. Votre seul tâche est de mettre deux personnes amoureuses avec la commande `*lg love [nom_du_joueur] [nom_du_joueur]` et de se marrer le reste de la partie.",
            "dictateur": "Vous êtes dictateur. Une fois par partie vous pouvez prendre le pouvoir de force avec la commande `*lg coup-état`. Sinon, faites `*lg nothing`. Le lendemain, vous pourez choisir qui va mourir de la main des villageois. Si vous choisissez un loup garou, vous garderez le pouvoir. Mais si par malheur vous tuez un innocent, vos remord vous pousseront à vous suiccider pendant la nuit.",
        },
        "pouvoir": {
            "chien-loup-villageois": "Vous avez choisie d'être villageois",
            "chien-loup-lg": "Vous avez choisie d'être loup garou",
            "enfant-sauvage": "Vous avez choisie {0} comme modèle.",
            "cupidon": "Vous avez bien mis {0} et {1} ensemble.",
            "dmlove": ":hearts: Vous êtes en couple avec {0} qui est {1} :hearts:",
            "voyante": "Le joueur {0} est {1}.",
            "protect": "Vous avez protégé {0}.",
            "coup-état": "Vous avez décidé de faire un coup d'état.",
            "dictateur-nothing": "Vous avez décidé de ne pas faire de coup d'état.",
            "sorcière-nothing": "Vous n'avez pas utilisé de potions.",
            "potion-vie-True": "Vous n'avez pas utilisé votre potion de vie",
            "potion-vie-false": "Vous avez utilisé votre potion de vie",
            "potion-mort-True": "Vous n'avez pas utilisé votre potion de mort",
            "potion-mort-false": "Vous avez utilisé votre potion de mort",
            "lg-kill": "Les loup garou ont fait leurs choix, {0} est mort.",
            "vote-mort": "Vous avez voté contre {0}.",
            "vote-maire": "Vous avez voté pour {0}.",
            "sorcière-kill": "Vous avez tué {0}.",
            "sorcière-heal": "Vous avez soigné {0}.",
            "village-kill": "Le village à fait son choix, {0} est mort.",
            "fou-win": "{0} était fou ! Le fou à gagné !",
            "village-maire": "Le village à fait son choix, {0} est élu maire.",
            "vote-blanc": "Vous avez voté blanc.",
        },
        "misc": {
            "lg-kill": "{0} à été tué par les loup garou",
            "personne-mort": "Personne n'est mort cette nuit.",
            "jour": "Le jour {0} vient de démarrer.",
            "nuit": "La nuit tombe sur le village...",
            "vote-personne": "Le village n'as pas pu se mettre d'accord, le maire va pouvoir départager avec la commande `*lg vote [nom_du_joueur]`",
            "chasseur": "Le Chasseur est mort. Mais dans ses réflexe légendaires, il attrape son arme au moment de sa mort et tire avec la commande `*lg kill [nom_du_joueur]`.",
            "dictateur": "Le dictateur {0} fait un coup d'état, La personne désigné par lui avec la commande `*lg kill [nom_du_joueur]` mourra.",
            "maire": "Le village à besoin d'un maire. Vous pouvez voter avec la commande `*lg vote [nom_du_joueur]`. Vous pouvez aussi faire `*lg vote` pour ne voter pour personne. Quand tout le monde aura votés, la personne désigné à la majorité sera élu.",
            "mort-village": "Le village va maintenant pouvoir voter pour pendre quelqu'un avec la commande `*lg vote [nom_du_joueur]`. Vous pouvez aussi faire `*lg vote nobody` pour ne voter pour personne. Quand tout le monde aura votés, la personne désigné à la majorité mourra.",
            "mort": "Le joueur {0} est mort. Il était {1}",
            "mort-love": "Dans son imense chagrin, {0} a rejoint la tombe. Il était {1}. Ses derniers mot furent : \"Ce n'est pas gay, c'est de la Bromance\"",
        },
        "victoire": {
            "village": "Victoire du village.",
            "loup-garou": "Victoire des loup garou.",
            "loup-blanc": "Victoire du loup blanc.",
            "fou": "Victoire du fou.",
            "pyromane": "Victoire du pyromane.",
            "love": "Victoire des amoureux.",
            "égalité": "égalité, tout le monde est mort.",
        },
    },
}

theme = normal


salonbase = null;
com = null;
maire_bet = []; // used
wait_maire = false //used
vote_nothing = []; // used
votemort = false; // used
vote_mort = false; // used
vote_maire = false; // used
waitchasse = false; // used
day = 0 // used
state = "off"; // used
cycle = "night" // used

village = null; // fait
loupgarou = null; // fait
petitefille = null; // fait
voyante = null; // fait
sorciere = null; // fait
loupblanc = null;
pyromane = null;
garde = null; // fait
necromancien = null;
amoureux = null; // fait
chienloup = null; // fait
enfantsauvage = null; // fait
cupidon = null; // fait
dictateur = null; // fait
nbr_loup = 0; // used

waitmaire = false;
actif_coup_etat = false; // used
maire = null; // used
dictacible = null; //used
vovo = false; //used
chasse = false; // used
amoureux1 = null; // used
amoureux2 = null; // used
protect = null; // used
lastprotect = null; // used
coup_etat = null; // used
coup_etat_used = false // used
lgmort = null; // used
lgbcible = null;
soso = "null"; // used
sosocible = null; // used
salon = []; // used
players = []; // used
role = []; // used
vie = []; //used
votes = []; // used
chlg = null // used
oil = [];
pyro_act = null;
modele = null; // used
enfsauvlg = false // used
potion_vie = true; //used
potion_mort = true; //used
roles = ["loup-garou", "petite-fille", "simple-villageois", "voyante", "sorcière", "loup-blanc", "chien-loup", "pyromane", "enfant-sauvage", "cupidon", "garde", "dictateur", "nécromancien", "fou", "chasseur"];

save_players = []
save_role = []
save_vie = []
save_votes = []

client.on('warn', console.warn);

client.on('error', console.error);

client.on('ready', () => {
    console.log('Le bot est démarré !');
		client.user.setActivity("[insert savun twomp]", { type: 'LISTENING' });

});

client.on('message', async message => {
    if (message.author.bot) return undefined;
    //if (!message.content.startsWith(config.prefix)) return undefined;

    const args = message.content.split(' ');
    const searchString = args.slice(1).join(' ');
    const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
		if(message.channel.guild != null) {
    	const serverQueue = queue.get(message.guild.id);
		}

    if(message.content === prefixVerifier(message) + 'help') {

      const help = require('./command/fun/help.js');
      help(message);
			return;
		}

    if(message.content.startsWith(prefixVerifier(message) + 'info')) {

      const info = require('./command/fun/info.js');
      info(message);
      return;

    }


    //fun

    if (message.content === prefixVerifier(message) + 'ping') {
			message.channel.send("pong");
			return;

  	}

    if(message.content.startsWith(prefixVerifier(message) + "welcome")) {

      const welcome = require('./command/moderation/welcome.js');
      welcome(message);

      return;

    }

		if(message.content.startsWith(prefixVerifier(message) + 'lg')) {
			if(message.channel.guild != null && message.channel.guild.id == "717475578176864277") {
        pll = ""
        args.forEach(function(item3, index3, array3) {
          if(index3 > 1) {
            pll += item3
          }
          if(index3 < args.length) {
            pll += " "
          }
        });
        pll = pll.trim()
        pll = pll.toLowerCase()
				try{
					if(args[1] == "config") {
						if(state == "off") {
							state = "wait"
							message.reply("la partie est en attente de configuration.");
							return
						}else if(state == "wait") {
							message.reply("La partie est déjà en attente de configuration.");
							return
						}else {
							message.reply("Veuillez d'abbord quitter la partie en cours.");
							return
						}
					}else if(args[1] == "abort") {
						message.reply("la partie à bien été abrégée.");
						salon.forEach(function(item, index, array) {
							item.then((value) => {
  							value.delete('abort');
							});
						});
            salonbase = null;
            com = null;
            maire_bet = []; // used
            wait_maire = false //used
            vote_nothing = []; // used
            votemort = false; // used
            vote_mort = false; // used
            vote_maire = false; // used
            waitchasse = false; // used
            day = 0 // used
            state = "off"; // used
            cycle = "night" // used

            village = null; // fait
            loupgarou = null; // fait
            petitefille = null; // fait
            voyante = null; // fait
            sorciere = null; // fait
            loupblanc = null;
            pyromane = null;
            garde = null; // fait
            necromancien = null;
            amoureux = null; // fait
            chienloup = null; // fait
            enfantsauvage = null; // fait
            cupidon = null; // fait
            dictateur = null; // fait
            nbr_loup = 0; // used

            waitmaire = false;
            actif_coup_etat = false; // used
            maire = null; // used
            dictacible = null; //used
            vovo = false; //used
            chasse = false; // used
            amoureux1 = null; // used
            amoureux2 = null; // used
            protect = null; // used
            lastprotect = null; // used
            coup_etat = null; // used
            coup_etat_used = false // used
            lgmort = null; // used
            lgbcible = null;
            soso = "null"; // used
            sosocible = null; // used
            salon = []; // used
            players = []; // used
            role = []; // used
            vie = []; //used
            votes = []; // used
            chlg = null // used
            oil = [];
            pyro_act = null;
            modele = null; // used
            enfsauvlg = false // used
            potion_vie = true; //used
            potion_mort = true; //used
						return
					}else if(args[1] == "state") {
						if(state == "off") {
							message.reply("Il n'y a aucune partie en cours.");
							return
						}else if(state == "wait") {
							message.reply("La partie est en attente de configuration.");
							return
						}else {
							message.reply("La partie est en cours.");
							return
						}
					}else if(args[1] == "addplayer") {
						if(state == "wait") {
                message.mentions.users.each(user => {
    							a = false
    							players.forEach(function(item, index, array) {
    								if(item.id == user.id) {
    									message.reply("Le joueur " + user.username + " est déjà dans la partie.");
    									a = true
    								}
    							});
    							if(a == false) {
    								players.push(user);
    								vie.push(true);
    								votes.push([]);
    								//fonction.push(null);
    								//console.log(players);
    								message.channel.send("Le joueur " + user.username + " à bien été ajouté.");
    							}
                });
						}else {
							message.reply("la partie n'est plus en configuration.");
							return;
						}
					}else if(args[1] == "removeplayer") {
						if(state == "wait") {
						indexx = null;
						players.forEach(function(item, index, array) {
  						if(message.mentions.users.first().id == item.id) {
								indexx = index;
							}
						});
						if(indexx == null) {
							message.reply("Le joueur n'est pas dans la liste des joueurs.")
							return;
						}else {
							message.reply("Le joueur " + message.mentions.users.first().username + " a bien été supprimé de la partie.")
							players.pop(indexx, 1);
							vie.pop(indexx, 1)
							votes.pop(indexx, 1)
							//fonction.pop(indexx, 1)
							return;
						}
						}else {
							message.reply("la partie n'est plus en configuration.");
							return;
						}

					}else if(args[1] == "seeplayer") {
						pl = " "
						players.forEach(function(item, index, array) {
  						pl = pl + " " + item.username
							if(index != players.length - 1) {
								pl = pl + ","
							}
						});
						if(pl == " ") {
							message.reply("Il n'y a aucun joueurs dans la partie.");
							return
						}else {
							message.reply("Les joueurs dans la partie sont :" + pl + ".");
							return
						}
					}else if(args[1] == "clearplayer") {
						if(state == "wait") {
							players = []
							vie = []
							votes = []
							message.reply("Les joueurs ont bien été réinitialisés.");
							return;
						}else {
							message.reply("la partie n'est plus en configuration.");
							return;
						}

					}else if(args[1] == "saveconfig") {
						if(state == "wait") {
						save_players = players
						save_role = role
						save_vie = vie
						save_votes = votes
							message.reply("La config à été sauvegardé.");
							return;
						}else {
							message.reply("la partie n'est plus en configuration.");
							return;
						}

					}else if(args[1] == "loadconfig") {
						if(state == "wait") {
						players = save_players
						role = save_role
						vie = save_vie
						votes = save_votes
							message.reply("La config à été restauré.");
							return;
						}else {
							message.reply("la partie n'est plus en configuration.");
							return;
						}

					}else if(args[1] == "help") {
						const embed = new MessageEmbed()
  .setTitle("liste des commandes du loup garou:")
  .setColor(0xffe402)
  //.setThumbnail(message.author.avatarURL)
  .setDescription("voici la liste des commandes disponible :")
  .addField("configuration","`*lg config` : permet de configurer une partie \n`*lg abort` : permet d'arréter une partie \n`*lg state` : permet de voir l'état de la partie\n`*lg saveconfig` : permet de sauvegarder la config actuelle\n`*lg loadconfig` : permet de charger la config actuelle\n`*lg setcom` : permet de définir le commentateur\n`*lg removecom` : permet de reset le commentateur")
  .addField("joueurs","`*lg seeplayers` : permet de voir les joueurs \n`*lg addplayer` [mention] : permet d'ajouter un joueur \n`*lg removeplayer` [mention] : permet d'enlever un joueur \n`*lg clearplayer` : permet de reset les joueurs")
	.addField("rôles","`*lg allroles` : permet de voir la lise des rôles disponibles \n`*lg addrole` : permet d'ajouter un role dans la partie actuelle (la partie doit être en configuration) \n`*lg removerole` : permet de retirer un role dans la partie actuelle (la partie doit être en configuration) \n`*lg seerole` : permet de voir les roles configurées \n`*lg clearrole` : permet de reset les roles")
	.addField("play","`*lg play` : permet de démarrer la partie")
  .addField("theme","`*lg seetheme` : permet de voir les thèmes\n`*lg settheme` : permet de définur le thème utilisé");


  					message.channel.send(embed);
						return;
          }else if (args[1] == "setcom") {
            if(state == "wait") {
                com = message.mentions.users.first()
                message.channel.send("Le joueur " + message.mentions.users.first().username + " à bien été définie comme commentateur.");
              return
            }else {
              message.reply("la partie n'est plus en configuration.");
              return;
            }
          }else if (args[1] == "removecom") {
            if(state == "wait") {
              com = null
              message.channel.send("Le commentateur a bien été réinitialisé.");
            }else {
              message.reply("la partie n'est plus en configuration.");
              return;
            }
          }else if(args[1] == "seetheme") {
            message.channel.send("Les thèmes sont : classic, nazi")
          }else if(args[1] == "settheme") {
            if(args[2] == "classic") {
              theme = normal
              message.channel.send("Le thème a bien été changé")
            }else if(args[2] == "nazi"){
              theme = nazi
              message.channel.send("Le thème a bien été changé")
            }else {
              message.channel.send("Thème incorrect. Les thèmes sont : classic, nazi")
            }
					}else if(args[1] == "allroles") {
						pl = " "
						roles.forEach(function(item, index, array) {
  						pl = pl + " " + item
							if(index != roles.length - 1) {
								pl = pl + ","
							}
						});
						message.reply("les rôles sont :" + pl)
						return;
					}else if(args[1] == "seerole") {
						pl = " "
						role.forEach(function(item, index, array) {
  						pl = pl + " " + item
							if(index != role.length - 1) {
								pl = pl + ","
							}
						});
						if(pl == " ") {
							message.reply("Il n'y as aucun rôle de configuré.")
							return;
						}else {
							message.reply("les rôles dans la partie sont :" + pl + ".")
							return;
						}
					}else if(args[1] == "addrole") {
						if(state == "wait") {
              args.forEach(function(item2, index2, array2) {
                if(index2 > 1) {
      						existe = false;
      						roles.forEach(function(item, index, array) {
        						if(item2 == item) {
      								existe = true;
      							}
      						});

      						if(existe == false) {
      							message.reply("Le rôle n'existe pas")
      							return;
      						}else {
      							role.push(item2);
      							message.channel.send("le rôle " + item2 + " a bien été ajouté");
      							if(item2 == "loup-garou") {
      								nbr_loup += 1;
      							}
                    if(item2 == "loup-blanc") {
      								nbr_loup += 1;
      							}
      							return;
      						}
                }
              });
						}else {
							message.reply("la partie n'est plus en configuration.");
							return;
						}
					}else if(args[1] == "removerole") {
						if(state == "wait") {
  						indexx = null;
  						role.forEach(function(item, index, array) {
    						if(args[2] == item) {
  								indexx = index;
  							}
  						});
  						if(args[2] == "loup-garou") {
  							nbr_loup -= 1;
  						}
  						message.reply("Le rôle a bien été supprimé.")
  						role.pop(indexx, 1);
  						return;
						}else {
							message.reply("la partie n'est plus en configuration.");
							return;
						}
					}else if(args[1] == "clearrole") {
						if(state == "wait") {
							role = []
							message.reply("Les rôles ont bien été réinitialisés.");
							return;
						}else {
							message.reply("la partie n'est plus en configuration.");
							return;
						}

					}else if(args[1] == "play") {
						if(state == "wait") {
							if(role.length != players.length) {
								message.reply("Il n'y a pas assez ou trop de rôle pour les joueurs spécifiés")
							}else {

								state = "on"

                salonbase = message.channel

								randomize(players);
								randomize(role);

                console.log(role);
                console.log(players);

								players.forEach(function(item, index, array) {
									item.send("---------Nouvelle partie---------\nvous êtes : " + theme["roles"][role[index]] + " (" + role[index] + ")")
								});

								permvillage = [{id: "717475578176864277",deny: ['VIEW_CHANNEL']}]
								players.forEach(function(item, index, array) {
									permvillage.push({id: item.id, allow: ['VIEW_CHANNEL']})

								});
                if(com != null) {
                  permvillage.push({id: com.id, allow: ['VIEW_CHANNEL'], deny: ['SEND_MESSAGES']})
                }



								villagechanel = message.channel.guild.channels.create(theme["roles"]["villageois"], {type: 'text', reason: 'channel du village',permissionOverwrites: permvillage,
								},
								);
								village = villagechanel;
								salon.push(village);

                villagechanel.then((value) => {
									test = value.send(theme["messages"]["salon"]["village"])
									test.then((value2) => {
										value2.pin()
									});

								});

								//console.log(players);
								//console.log(role);

								permlg = [{id: "717475578176864277",deny: ['VIEW_CHANNEL']}]
								players.forEach(function(item, index, array) {
									if(role[index] == "loup-garou" || role[index] == "loup-blanc") {
										permlg.push({id: item.id, allow: ['VIEW_CHANNEL']})
									}

								});
                if(com != null) {
                  permlg.push({id: com.id, allow: ['VIEW_CHANNEL'], deny: ['SEND_MESSAGES']})
                }

								lgchanel = message.channel.guild.channels.create(theme["roles"]["loup-garou"], {type: 'text', reason: 'channel des loup-garou',permissionOverwrites: permlg,
								},
								);
								loupgarou = lgchanel;
								salon.push(loupgarou);

								lgchanel.then((value) => {
									test = value.send(theme["messages"]["salon"]["loup-garou"])
									test.then((value2) => {
										value2.pin()
									});

								});

								permpf = [{id: "717475578176864277",deny: ['VIEW_CHANNEL']}]
								players.forEach(function(item, index, array) {
									if(role[index] == "petite-fille") {
										permpf.push({id: item.id, allow: ['VIEW_CHANNEL']})
									}

								});
                if(com != null) {
                  permpf.push({id: com.id, allow: ['VIEW_CHANNEL'], deny: ['SEND_MESSAGES']})
                }

								pfchanel = message.channel.guild.channels.create(theme["roles"]["petite-fille"], {type: 'text', reason: 'channel de la petite fille',permissionOverwrites: permpf,
								},
								);
								petitefille = pfchanel;
								salon.push(pfchanel);

								pfchanel.then((value) => {
									test = value.send(theme["messages"]["salon"]["petite-fille"])
									test.then((value2) => {
										value2.pin()
									});

								});

								permvovo = [{id: "717475578176864277",deny: ['VIEW_CHANNEL']}]
								players.forEach(function(item, index, array) {
									if(role[index] == "voyante") {
										permvovo.push({id: item.id, allow: ['VIEW_CHANNEL']})
									}

								});
                if(com != null) {
                  permvovo.push({id: com.id, allow: ['VIEW_CHANNEL'], deny: ['SEND_MESSAGES']})
                }

								vovochanel = message.channel.guild.channels.create(theme["roles"]["voyante"], {type: 'text', reason: 'channel de la voyante',permissionOverwrites: permvovo,
								},
								);
								voyante = vovochanel;
								salon.push(voyante);

								vovochanel.then((value) => {
									test = value.send(theme["messages"]["salon"]["voyante"])
									test.then((value2) => {
										value2.pin()
									});

								});

								permsoso = [{id: "717475578176864277",deny: ['VIEW_CHANNEL']}]
								players.forEach(function(item, index, array) {
									if(role[index] == "sorcière") {
										permsoso.push({id: item.id, allow: ['VIEW_CHANNEL']})
									}

								});
                if(com != null) {
                  permsoso.push({id: com.id, allow: ['VIEW_CHANNEL'], deny: ['SEND_MESSAGES']})
                }

								sosochanel = message.channel.guild.channels.create(theme["roles"]["sorcière"], {type: 'text', reason: 'channel de la sorcière',permissionOverwrites: permsoso,
								},
								);
								sorciere = sosochanel;
								salon.push(sosochanel);


								sosochanel.then((value) => {
									test = value.send(theme["messages"]["salon"]["sorcière"])
									test.then((value2) => {
										value2.pin()
									});

								});


								permlb = [{id: "717475578176864277",deny: ['VIEW_CHANNEL']}]
								players.forEach(function(item, index, array) {
									if(role[index] == "loup-blanc") {
										permlb.push({id: item.id, allow: ['VIEW_CHANNEL']})
									}

								});
                if(com != null) {
                  permlb.push({id: com.id, allow: ['VIEW_CHANNEL'], deny: ['SEND_MESSAGES']})
                }

								lbchanel = message.channel.guild.channels.create(theme["roles"]["loup-blanc"], {type: 'text', reason: 'channel du loup blanc',permissionOverwrites: permlb,
								},
								);
								loupblanc = lbchanel;
								salon.push(lbchanel);

								lbchanel.then((value) => {
									test = value.send(theme["messages"]["salon"]["loup-blanc"])
									test.then((value2) => {
										value2.pin()
									});

								});


								permpyro = [{id: "717475578176864277",deny: ['VIEW_CHANNEL']}]
								players.forEach(function(item, index, array) {
									if(role[index] == "pyromane") {
										permpyro.push({id: item.id, allow: ['VIEW_CHANNEL']})
									}

								});
                if(com != null) {
                  permpyro.push({id: com.id, allow: ['VIEW_CHANNEL'], deny: ['SEND_MESSAGES']})
                }

								pyrochanel = message.channel.guild.channels.create(theme["roles"]["pyromane"],
                                {type: 'text', reason: 'channel du pyromane',permissionOverwrites: permpyro}
								);
								pyromane = pyrochanel;
								salon.push(pyrochanel);

								pyrochanel.then((value) => {
									test = value.send(theme["messages"]["salon"]["pyromane"])
									test.then((value2) => {
										value2.pin()
									});

								});

								permgarde = [{id: "717475578176864277",deny: ['VIEW_CHANNEL']}]
								players.forEach(function(item, index, array) {
									if(role[index] == "garde") {
										permgarde.push({id: item.id, allow: ['VIEW_CHANNEL']})
									}

								});
                if(com != null) {
                  permgarde.push({id: com.id, allow: ['VIEW_CHANNEL'], deny: ['SEND_MESSAGES']})
                }

								gardechanel = message.channel.guild.channels.create(theme["roles"]["garde"], {type: 'text', reason: 'channel du garde',permissionOverwrites: permgarde,
								},
								);
								garde = gardechanel;
								salon.push(gardechanel);

								gardechanel.then((value) => {
									test = value.send(theme["messages"]["salon"]["garde"])
									test.then((value2) => {
										value2.pin()
									});

								});



								permnecro = [{id: "717475578176864277",deny: ['VIEW_CHANNEL']}]
								players.forEach(function(item, index, array) {
									if(role[index] == "nécromancien") {
										permnecro.push({id: item.id, allow: ['VIEW_CHANNEL']})
									}

								});
                if(com != null) {
                  permnecro.push({id: com.id, allow: ['VIEW_CHANNEL'], deny: ['SEND_MESSAGES']})
                }

								necrochanel = message.channel.guild.channels.create(theme["roles"]["nécromancien"], {type: 'text', reason: 'channel du nécromancien',permissionOverwrites: permnecro,
								},
								);
								necromancien = necrochanel;
								salon.push(necrochanel);

								necrochanel.then((value) => {
									test = value.send(theme["messages"]["salon"]["nécromancien"])
									test.then((value2) => {
										value2.pin()
									});

								});



								permlove = [{id: "717475578176864277",deny: ['VIEW_CHANNEL']}]
                if(com != null) {
                  permlove.push({id: com.id, allow: ['VIEW_CHANNEL'], deny: ['SEND_MESSAGES']})
                }

								lovechanel = message.channel.guild.channels.create("amoureux", {type: 'text', reason: 'channel des amoureux',permissionOverwrites: permlove,
								},
								);
								amoureux = lovechanel;
								salon.push(lovechanel);

                lovechanel.then((value) => {
                  test = value.send(theme["messages"]["salon"]["amoureux"])
                  test.then((value2) => {
                    value2.pin()
                  });

                });


								permchlg = [{id: "717475578176864277",deny: ['VIEW_CHANNEL']}]
								players.forEach(function(item, index, array) {
									if(role[index] == "chien-loup") {
										permchlg.push({id: item.id, allow: ['VIEW_CHANNEL']})
									}

								});
                if(com != null) {
                  permchlg.push({id: com.id, allow: ['VIEW_CHANNEL'], deny: ['SEND_MESSAGES']})
                }

								chlgchanel = message.channel.guild.channels.create(theme["roles"]["chien-loup"], {type: 'text', reason: 'channel du chien loup',permissionOverwrites: permchlg,
								},
								);
								chienloup = chlgchanel;
								salon.push(chlgchanel);

								chlgchanel.then((value) => {
									test = value.send(theme["messages"]["salon"]["chien-loup"])
									test.then((value2) => {
										value2.pin()
									});

								});


								permenfantsau = [{id: "717475578176864277",deny: ['VIEW_CHANNEL']}]
								players.forEach(function(item, index, array) {
									if(role[index] == theme["roles"]["enfant-sauvage"]) {
										permenfantsau.push({id: item.id, allow: ['VIEW_CHANNEL']})
									}

								});
                if(com != null) {
                  permenfantsau.push({id: com.id, allow: ['VIEW_CHANNEL'], deny: ['SEND_MESSAGES']})
                }

								enfantsauvchanel = message.channel.guild.channels.create("enfant sauvage", {type: 'text', reason: 'channel de l\'enfant sauvage',permissionOverwrites: permenfantsau,
								},
								);
								enfantsauvage = enfantsauvchanel;
								salon.push(enfantsauvchanel);

								enfantsauvchanel.then((value) => {
									test = value.send(theme["messages"]["salon"]["enfant-sauvage"])
									test.then((value2) => {
										value2.pin()
									});

								});

								permcupidon = [{id: "717475578176864277",deny: ['VIEW_CHANNEL']}]
								players.forEach(function(item, index, array) {
									if(role[index] == "cupidon") {
										permcupidon.push({id: item.id, allow: ['VIEW_CHANNEL']})
									}

								});
                if(com != null) {
                  permcupidon.push({id: com.id, allow: ['VIEW_CHANNEL'], deny: ['SEND_MESSAGES']})
                }

								cupidonchanel = message.channel.guild.channels.create(theme["roles"]["cupidon"], {type: 'text', reason: 'channel du cupidon',permissionOverwrites: permcupidon,
								},
								);
								cupidon = cupidonchanel;
								salon.push(cupidonchanel);

								cupidonchanel.then((value) => {
									test = value.send(theme["messages"]["salon"]["cupidon"])
									test.then((value2) => {
										value2.pin()
									});
								});




								permdictateur = [{id: "717475578176864277",deny: ['VIEW_CHANNEL']}]
								players.forEach(function(item, index, array) {
									if(role[index] == "dictateur") {
										permdictateur.push({id: item.id, allow: ['VIEW_CHANNEL']})
									}

								});
                if(com != null) {
                  permdictateur.push({id: com.id, allow: ['VIEW_CHANNEL'], deny: ['SEND_MESSAGES']})
                }

								dictateurchanel = message.channel.guild.channels.create(theme["roles"]["dictateur"], {type: 'text', reason: 'channel du dictateur',permissionOverwrites: permdictateur,
								},
								);
								dictateur = dictateurchanel;
								salon.push(dictateurchanel);

								dictateurchanel.then((value) => {
									test = value.send(theme["messages"]["salon"]["dictateur"]);
									test.then((value2) => {
										value2.pin()
									});
								});



								setcycle(message);




							}
						}
						return;
					}else if(args[1] == "choose") {
						if(state == "on") {
							if(cycle == "night") {
								chienloup.then((value) => {
									if(message.channel.id == value.id) {

										if(args[2] == "lg") {
											message.author.send(theme["messages"]["pouvoir"]["chien-loup-lg"])
											chlg = "lg"
											nbr_loup += 1
											message.channel.updateOverwrite(message.author.id, { VIEW_CHANNEL: false, SEND_MESSAGES: false });
											loupgarou.then((value2) => {
												value2.updateOverwrite(message.author.id, { VIEW_CHANNEL: true });
											});
											/*salon.forEach(function(item, index, array) {
												if(role[index] == "dictateur") {
													permdictateur.push({id: item.id, allow: ['VIEW_CHANNEL']})
												}
											});*/
                      nextt(message, chienloup);
											verif(message);


										}else if(args[2] == "villageois") {
											message.author.send(theme["messages"]["pouvoir"]["chien-loup-villageois"])
											chlg = "villageois"
											message.channel.updateOverwrite(message.author.id, { VIEW_CHANNEL: false, SEND_MESSAGES: false });
                      nextt(message, chienloup);
											verif(message);
										}
									}
							  });
							  enfantsauvage.then((value) => {
								  	if(message.channel.id == value.id) {
									  	players.forEach(function(item, index, array) {
										  	if(item.username.toLowerCase() == pll && pll != message.author.username.toLowerCase()) {
											  	modele = index;
												  message.author.send(theme["messages"]["pouvoir"]["enfant-sauvage"].replace("{0}", item.username));
												  message.channel.updateOverwrite(message.author.id, { VIEW_CHANNEL: false, SEND_MESSAGES: false });
                          nextt(message, enfantsauvage);
										  		verif(message);

										  		return;
										  	}
							  			});
							  		}
					  		});
              }else {
                village.then((value) => {
                  if(message.channel.id == value.id && waitmaire == true) {
                    players.forEach(function(item, index, array) {
                      if(item.id == message.author.id) {
                        if(maire != null && maire.id == item.id) {
                          players.forEach(function(item2, index2, array2) {
                            if(item2.username.toLowerCase() == pll) {
                              waitmaire = false;
                              maire = item2
                              value.updateOverwrite(message.author.id, { SEND_MESSAGES: false });
                              message.channel.send("{0} est maintenant maire".replace("{0}", item2.username))
                              dayy(message)
                              return;
                            }
                          });
                        }
                      }
                    });
                  }
                });
              }
					  }



					}else if(args[1] == "love") {
						if(state == "on") {
							if(cycle == "night") {
								cupidon.then((value) => {
										if(message.channel.id == value.id) {
											players.forEach(function(item, index, array) {
												if(item.username.toLowerCase() == args[2].toLowerCase()) {
                          plll = ""
                          args.forEach(function(item3, index3, array3) {
                            if(index3 > 2) {
                              plll += item3
                            }
                            if(index3 < args.length) {
                              plll += " "
                            }
                          });
                          plll = plll.trim()
                          plll += plll.toLowerCase()
													players.forEach(function(item2, index2, array2) {
														if(item2.username.toLowerCase() == plll && plll != args[2].toLowerCase()) {
															amoureux1 = item.username;
															amoureux2 = item2.username;
															message.author.send(theme["messages"]["pouvoir"]["cupidon"].replace("{0}", amoureux1).replace("{1}", amoureux2))
															message.channel.updateOverwrite(message.author.id, { VIEW_CHANNEL: false, SEND_MESSAGES: false });
															amoureux.then((value3) => {
																value3.updateOverwrite(item.id, { VIEW_CHANNEL: true});
																value3.updateOverwrite(item2.id, { VIEW_CHANNEL: true});
															});
															item.send(theme["messages"]["pouvoir"]["dmlove"].replace("{0}", item2.username).replace("{1}", role[index2]))
															item2.send(theme["messages"]["pouvoir"]["dmlove"].replace("{0}", item.username).replace("{1}", role[index]))
                              nextt(message, cupidon);
															verif(message)

														}
													});
												}
											});
									}
								});
							}
						}
					}else if(args[1] == "look") {
						if(state == "on") {
							if(cycle == "night") {
								voyante.then((value) => {
										if(message.channel.id == value.id) {
											players.forEach(function(item, index, array) {
												if(item.username.toLowerCase() == pll && pll != message.author.username.toLowerCase()) {
													message.channel.send(theme["messages"]["pouvoir"]["voyante"].replace("{0}", item.username).replace("{1}", role[index]))
													vovo = true
													message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
                          nextt(message, voyante);
                          verif(message)

												}
											});
										}
								});
							}
						}

					}else if(args[1] == "protect") {
						if(state == "on") {
							if(cycle == "night") {
								garde.then((value) => {
									if(message.channel.id == value.id) {
										players.forEach(function(item, index, array) {
											if(item.username.toLowerCase() == pll) {
                        if(pll != lastprotect) {
                          if(vie[index] == true) {
    												protect = pll
    												lastprotect = protect
    												value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
    												message.channel.send(theme["messages"]["pouvoir"]["protect"].replace("{0}", item.username))
                            nextt(message, garde);
    												verif(message)
                          }else {
                            message.channel.send("vous ne pouvez pas protéger un mort")
                          }
                        }else {
                          	message.channel.send("vous ne pouvez pas protéger 2 fois la même personne")
                        }
											}
										});
									}
								});
								}
							}
						}else if(args[1] == "coup-état") {
							if(state == "on") {
								if(cycle == "night") {
									dictateur.then((value) => {
										if(message.channel.id == value.id) {
											if(coup_etat_used == false) {
												coup_etat_used = true;
												coup_etat = true;
												value.updateOverwrite(message.author.id, { VIEW_CHANNEL: false });
												message.author.send(theme["messages"]["pouvoir"]["coup-état"])
												verif(message)
											}else {message.channel.send("Vous avez déjà fait un coup d'état.")}
										}
									});
								}
							}
						}else if(args[1] == "nothing") {
							if(state == "on") {
								if(cycle == "night") {
									dictateur.then((value) => {
										if(message.channel.id == value.id) {
											coup_etat = false;
											value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
											message.channel.send(theme["messages"]["pouvoir"]["dictateur-nothing"])
											verif(message)
											return;
										}
									});
									sorciere.then((value) => {
										if(message.channel.id == value.id) {
											soso = "nothing";
											value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
											message.channel.send(theme["messages"]["pouvoir"]["sorcière-nothing"])
                      nextt(message, sorciere);
											verif(message)
											return;
										}
									});
								}
							}
						}else if(args[1] == "potion") {
							if(state == "on") {
								if(cycle == "night") {
									sorciere.then((value) => {
										if(message.channel.id == value.id) {
											if(potion_vie == true) {
												value.send(theme["messages"]["pouvoir"]["potion-vie-true"])
											}else {
												value.send(theme["messages"]["pouvoir"]["potion-vie-false"])
											}
											if(potion_mort == true) {
												value.send(theme["messages"]["pouvoir"]["potion-mort-true"])
											}else {
												value.send(theme["messages"]["pouvoir"]["potion-mort-false"])
											}
										}
									});
								}
							}
						}else if(args[1] == "kill") {
							if(state == "on") {
								if(cycle == "night") {
									loupgarou.then((value) => {
										if(message.channel.id == value.id) {

										players.forEach(function(item, index, array) {
											if(item.username.toLowerCase() == pll) {

												nb = 0
												supp = 0
												ind = 0
												votes.forEach(function(item3, index3, array3) {
													item3.forEach(function(item4, index4, array4) {
														if(item4 == message.author.id) {
															votes[index3].pop(index4, 1)
														}
													});
												});

												votes[index].push(message.author.id)

												votes.forEach(function(item2, index2, array2) {
													nb += item2.length
													if(item2.length > supp) {
														supp = item2.length
														ind = index2
													}
												});
												if(nb == nbr_loup) {
													lgmort = players[ind]
													value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
													message.channel.send(theme["messages"]["pouvoir"]["lg-kill"].replace("{0}", lgmort.username))
                          nextt(message, loupgarou);
													verif(message)
												}else {
													message.channel.send(theme["messages"]["pouvoir"]["vote-mort"].replace("{0}", item.username))
												}

											}
										});
									}
									});
									sorciere.then((value) => {
										if(message.channel.id == value.id) {
											players.forEach(function(item, index, array) {
												if(item.username.toLowerCase() == pll) {
													if(potion_mort == true) {
														soso = "kill";
														potion_mort = false;
														sosocible = item
														value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
														message.channel.send(theme["messages"]["pouvoir"]["sorcière-kill"].replace("{0}", item.username))
                            nextt(message, sorciere);
														verif(message)

														return;
													}
												}
											});
										}
									});
                  loupblanc.then((value) => {
										if(message.channel.id == value.id) {
											players.forEach(function(item, index, array) {
												if(item.username.toLowerCase() == pll) {
														lgbcible = item
														value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
														message.channel.send(theme["messages"]["pouvoir"]["lgb-kill"].replace("{0}", item.username))
                            nextt(message, loupblanc);
														verif(message)

														return;
													}
											});
										}
									});
								}else {
									village.then((value) => {
										if(waitchasse == true) {
											if(message.channel.id == value.id) {
												players.forEach(function(item, index, array) {
													if(item.id == message.author.id) {

														if(role[index] == "chasseur") {
															players.forEach(function(item2, index2, array2) {
																if(item2.username.toLowerCase() == pll) {
																	waitchasse = false;
																	mort(item2, 0)
																	value.updateOverwrite(message.author.id, { SEND_MESSAGES: false });
																	dayy(message)
																	return;
																}
															});
														}
													}
												});
											}
										}
										if(actif_coup_etat == true) {
											if(message.channel.id == value.id) {
												players.forEach(function(item, index, array) {
													if(item.id == message.author.id) {

														if(role[index] == "dictateur") {
															players.forEach(function(item2, index2, array2) {
																if(item2.username.toLowerCase() == pll) {
																	actif_coup_etat = false
																	mort(item2, 0)
																	maire = message.author
																	dictacible = item2
																	dayy(message)
																}
															});
														}
													}
												});
											}
										}
									});
								}
							}
						}else if(args[1] == "heal") {
							if(state == "on") {
								if(cycle == "night") {
									sorciere.then((value) => {
										if(message.channel.id == value.id) {
											if(potion_vie == true) {
												soso = "heal";
												potion_vie = false;
												value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
												message.channel.send(theme["messages"]["pouvoir"]["sorcière-heal"].replace("{0}", lgmort.username))
                        nextt(message, sorciere);
												verif(message)

												return;
											}
										}
									});
								}
							}
						}else if(args[1] == 'vote') {
							if(state == "on") {
								if(cycle == "day") {
									village.then((value) => {
										if(message.channel.id == value.id) {
                    if(wait_maire == true) {
                      players.forEach(function(item2, index2, array2) {
                        if(message.author.id == item2.id && maire.id == item2.id) {
                          players.forEach(function(item, index, array) {
    												if((item.username.toLowerCase() == pll && vie[index] == true)) {
                              maire_bet.forEach(function(item3, index3, array3) {
                                if(item3 == index) {
                                  votemort = item
                                  value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
                                  message.channel.send(theme["messages"]["pouvoir"]["village-kill"].replace("{0}", votemort.username))
                                  players.forEach(function(item5, index5, array5) {
                                    if(votemort.id == item5.id) {
                                      if(role[index5] == "fou") {
                                        message.channel.send(theme["messages"]["pouvoir"]["fou-win"].replace("{0}", votemort.username))
                                        return;
                                      }else {
                                        maire_bet = [];
                                        wait_maire = false;
                                        mort(votemort, 0)
                                        dayy(message)
                                      }
                                    }
                                  });
                                }
                              });
                            }
                          });
                        }
                      });
                    }else {
										if(args[2] == "nobody") {
											already = false
											vote_nothing.forEach(function(item, index, array) {
												if(item == message.author.id) {
													already = true;
												}
											});
											votes.forEach(function(item3, index3, array3) {
												item3.forEach(function(item4, index4, array4) {
													if(item4 == message.author.id) {
														votes[index3].pop(index4, 1)
													}
												});
											});

											if(already == false) {
												vote_nothing.push(message.author.id)
											}

											nb = 0
											supp = [0]
											ind = [0]

											votes.forEach(function(item2, index2, array2) {
												nb += item2.length
												if(item2.length > supp[0]) {
													supp = [item2.length]
													ind = [index2]
												}else if(item2.length == supp[0]) {
													supp.push(item2.length)
													ind.push(index2)
												}
											});
											nb_vivant = 0
											vie.forEach(function(item3, index3, array3) {
												if(item3 == true) {
													nb_vivant += 1
												}
											});
											if(nb + vote_nothing.length == nb_vivant) {
												if(vote_mort == true) {
													if(ind.length == 1 || maire == null) {
														votemort = players[ind[0]]
                            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
                            message.channel.send(theme["messages"]["pouvoir"]["village-kill"].replace("{0}", votemort.username))
                            players.forEach(function(item5, index5, array5) {
                              if(votemort.id == item5.id) {
                                if(role[index5] == "fou") {
                                  message.channel.send(theme["messages"]["pouvoir"]["fou-win"].replace("{0}", votemort.username))
                                  return;
                                }else {
                                  mort(votemort, 0)
                                  dayy(message)
                                }
                              }
                            });
													}else {
                            mairee(message, ind);
														//votemort = players[ind[0]]
													}
												}else {
													maire = players[ind[0]]
													message.channel.send(theme["messages"]["pouvoir"]["village-maire"].replace("{0}", maire.username))
													dayy(message)
												}
											}else {
												message.channel.send(theme["messages"]["pouvoir"]["vote-blanc"])
											}

										}else {
											players.forEach(function(item, index, array) {
												if((item.username.toLowerCase() == pll && vie[index] == true)) {
													nb = 0
													supp = [0]
													ind = [0]
													votes.forEach(function(item3, index3, array3) {
														item3.forEach(function(item4, index4, array4) {
															if(item4 == message.author.id) {
																votes[index3].pop(index4, 1)
															}
														});
													});

													votes[index].push(message.author.id)

                          votes.forEach(function(item2, index2, array2) {
                            nb += item2.length
                            if(item2.length > supp[0]) {
                              supp = [item2.length]
                              ind = [index2]
                            }else if(item2.length == supp[0]) {
                              supp.push(item2.length)
                              ind.push(index2)
                            }
                          });
													nb_vivant = 0
													vie.forEach(function(item3, index3, array3) {
														if(item3 == true) {
															nb_vivant += 1
														}
													});
													if((nb + vote_nothing.length) == nb_vivant) {
														if(vote_mort == true) {
                              if(ind.length == 1 || maire == null) {
  															votemort = players[ind]
  															value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
  															message.channel.send(theme["messages"]["pouvoir"]["village-kill"].replace("{0}", votemort.username))
  															players.forEach(function(item5, index5, array5) {
  																if(votemort.id == item5.id) {
  																	if(role[index5] == "fou") {
  																		message.channel.send(theme["messages"]["pouvoir"]["fou-win"].replace("{0}", votemort.username))
  																		return;
  																	}else {
  																		mort(votemort, 0)
  																		dayy(message)
  																	}
  																}
  															});
                              }else {
                                mairee(message, ind);
                              }

														}else {
															maire = players[ind[0]]
															message.channel.send(theme["messages"]["pouvoir"]["village-maire"].replace("{0}", maire.username))
															dayy(message)
														}
													}else {
														if(vote_mort == true) {
															message.channel.send(theme["messages"]["pouvoir"]["vote-mort"].replace("{0}", item.username))
														}else {
															message.channel.send(theme["messages"]["pouvoir"]["vote-maire"].replace("{0}", item.username))
														}
													}

												}
											});
										}
                  }
									}
									});
								}
							}
						}else if(args[1] == "oil") {
              pyromane.then((value) => {
                if(message.channel.id == value.id) {
                  plll = ""
                  args.forEach(function(item3, index3, array3) {
                    if(index3 > 2) {
                      plll += item3
                    }
                    if(index3 < args.length) {
                      plll += " "
                    }
                  });
                  plll = plll.trim()
                  plll += plll.toLowerCase()
                  if(pll != "") {
                    players.forEach(function(item, index, array) {
                      if(item.username.toLowerCase() == args[2].toLowerCase()) {
                        players.forEach(function(item2, index2, array2) {
                          if(item2.username.toLowerCase() == plll && plll != args[2].toLowerCase()) {
                            a = false
                            oil.forEach(function(item4, index4, array4) {
                              if(item4.id == item.id) {
                                a = true
                              }
                              if(item4.id == item2.id) {
                                a = true
                              }
                            });
                            if(a == false) {
                              pyro_act = "oil";
                              oil.push(item);
                              oil.push(item2);
                              message.channel.send(theme["messages"]["pouvoir"]["pyromane"].replace("{0}", item).replace("{1}", item2))
                              message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
                              item.send(theme["messages"]["pouvoir"]["oil"])
                              item2.send(theme["messages"]["pouvoir"]["oil"])
                              nextt(message, pyromane);
                              verif(message)
                            }
                          }
                        });
                      }
                    });
                  }else if(pll != "") {
                    players.forEach(function(item, index, array) {
                      if(item.username.toLowerCase() == pll.toLowerCase()) {
                            a = false
                            oil.forEach(function(item4, index4, array4) {
                              if(item4.id == item.id) {
                                a = true
                              }
                            });
                            if(a == false) {
                              pyro_act = "oil";
                              oil.push(item);
                              message.channel.send(theme["messages"]["pouvoir"]["pyromane"].replace("{0}", item).replace("{1}", "personne"))
                              message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
                              item.send(theme["messages"]["pouvoir"]["oil"])
                              nextt(message, pyromane);
                              verif(message)
                            }
                      }
                    });
                  }else {
                    pyro_act = "oil";
                    message.channel.send(theme["messages"]["pouvoir"]["pyromane"].replace("{0}", "personne").replace("{1}", "personne"))
                    message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
                    nextt(message, pyromane);
                    verif(message)
                  }
                }
              });
            }else if(args[1] == "fire") {
              pyromane.then((value) => {
                if(message.channel.id == value.id) {
                  pyro_act = "burn";
                  message.channel.send(theme["messages"]["pouvoir"]["burn"])
                  message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
                  nextt(message, pyromane);
                  verif(message)
                }
              });
            }


				}catch(err) {

					console.log(err);

				}

				return;
			}else {
        message.channel.send("Le serveur n'est pas un serveur validé")
      }
    }

	if(state == "on") {
		loupgarou.then((value) => {
			if(message.channel.id == value.id) {
				nbr = 0
				players.forEach(function(item, index, array) {
					if(item.id == message.author.id) {
						nbr = index
					}
				});
				petitefille.then((value2) => {
					if(!message.content.startsWith(prefixVerifier(message) + 'lg')) {
						value2.send("Loup " + (nbr+1) + " : " + message.content);
					}
				});
			}

		});
	}




});

client.on('guildMemberAdd', member => {
  console.log("a");

  try {
    let welcome = JSON.parse(fs.readFileSync("./welcome.json", "utf8"));
    if (welcome[member.guild.id].channel) {
      var welcomechannel = member.guild.channels.cache.get(welcome[member.guild.id].channel);

      if (!welcomechannel) {
	console.log("pas de salon");
        console.log(welcomechannel);
        return undefined;
      }
      console.log(welcome[member.guild.id].message + ` ${member}`);
      welcomechannel.send(welcome[member.guild.id].message + ` ${member}`);
    }
  }catch(err) {
    console.log(err);
  }
});

client.on('channelCreate', channel => {
  if(!channel.guild) return undefined;
});

client.on('channelDelete', channel => {
  if(!channel.guild) return undefined;
});

client.on('emojiCreate', emoji => {
  if(!emoji.guild) return undefined;
});

client.on('emojiDelete', emoji => {
  if(!emoji.guild) return undefined;
});


function prefixVerifier(message) {

  try {
    let prefix = JSON.parse(fs.readFileSync("./prefix.json", "utf8"));
    return prefix[message.guild.id].prefix;
  }catch(err) {
    return config.prefix;
  }

}

function randomize(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i

    // swap elements array[i] and array[j]
    // we use "destructuring assignment" syntax to achieve that
    // you'll find more details about that syntax in later chapters
    // same can be written as:
    // let t = array[i]; array[i] = array[j]; array[j] = t
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function ppyyrroo(message) {
  oil.forEach(function(item, index, array) {
    mort(item, 0)
  });
  oil = []
}

function verif(message) {


	loupgarou.then((value) => {
		if(lgmort != null && message.channel.id == value.id) {
			sorciere.then((value2) => {
				value2.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
				if(lgmort != null) {
					value2.send(theme["messages"]["misc"]["lg-kill"].replace("{0}", lgmort.username))
				}
			});
			loupblanc.then((value2) => {
				value2.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
			});
		}
	});

	garde.then((value) => {
		if(protect != null && message.channel.id == value.id) {
			loupgarou.then((value2) => {
				value2.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
			});
		}
	});


	next = true;
	role.forEach(function(item, index, array) {
  if(item == "loup-blanc") {
    if(vie[index] == true) {
      if(day % 2 == 1 && lgbcible == null) {
        console.log('a')
        next = false
      }//else if(day % 2 != 1) {
      //  next = false
      //}
    }
  }else if(item == "chien-loup") {
			if(chlg == null) {
				if(vie[index] == true) {
					next = false
				}
			}
		}else if(item == "enfant-sauvage") {
			if(modele == null) {
				if(vie[index] == true) {
					next = false
				}
			}
		}else if(item == "pyromane") {
      if(vie[index] == true) {
        if(pyro_act == null) {
          next = false
        }
      }
    }else if(item == "cupidon") {
			if(amoureux1 == null || amoureux2 == null) {
				if(vie[index] == true) {
					next = false
				}
			}
		}else if(item == "voyante") {
			if(vovo == false) {
				if(vie[index] == true) {
					next = false
				}
			}
		}else if(item == "garde") {
			if(protect == null) {
				if(vie[index] == true) {
					next = false
				}
			}
		}else if(item == "dictateur") {
			if(coup_etat == null) {
				if(vie[index] == true) {
					next = false
				}
			}
		}else if(item == "sorcière") {
			if(soso == "null") {
				if(vie[index] == true) {
					next = false
				}
			}
		}else if(item == "loup-garou") {
			if(lgmort == null) {
				if(vie[index] == true) {
					next = false
				}
			}
		}
	});

	if(next == true) {
		test = end();
    a = eend(message)
    if(a == true) {
      return;
    }else {
			resetvote();
      vote_mort
			if(dictacible != null) {
				players.forEach(function(item, index, array) {
					if(item.id == dictacible.id) {
						if(role[index] == "loup-garou" || role[index] == "loup-blanc" || role[index] == "pyromane" ) {
							dictacible = null
						}else {
							players.forEach(function(item2, index2, array2) {
								if(role[index2] == "dictateur") {
									mort(item2, 0);
									dictacible = null
								}
							});

						}
					}
				});
			}
      if(lgbcible != null) {
        mort(lgbcible, 0)
      }
			if(soso == "kill") {
				mort(sosocible, 0)
			}else if(soso == "heal") {
				lgmort = null
			}
      if(pyro_act == "burn") {
        ppyyrroo(message)
      }
			if(lgmort != null) {
				if(protect == lgmort.username.toLowerCase()) {

				}else {
					mort(lgmort, 0)
				}
        lgmort = null
			}
      a = eend(message)
      if(a == true) {
        return;
      }else {
  			//console.log(lgmort + "---" + sosocible)
  			if((lgmort == null && sosocible == null) || (protect == lgmort.username.toLowerCase() && sosocible == null)) {
  				village.then((value) => {
  					value.send(theme["messages"]["misc"]["personne-mort"])
  				});
  			}
  			village.then((value) => {
  				dd = day
  				value.send(theme["messages"]["misc"]["jour"].replace("{0}", dd))
  			});
  			cycle = "day"
  			setcycle(message);

  			dayy(message);
      }
		}
	}


}

function dayy(message) {
  a = eend(message)
  if(a == true) {
    return;
  }
  if(waitmaire == true) {
    village.then((value) => {
      value.send(theme["messages"]["misc"]["mort-maire"])
    });
  }else {
  	if(chasse == true) {
  		waitchasse = true;
  		chasse = false;
  		village.then((value) => {
  			value.send(theme["messages"]["misc"]["chasseur"])
  		});
  	}else {
  		players.forEach(function(item, index, array) {
  			if(role[index] == "dictateur") {
  				vie2 = vie[index]
  			}
  		});
  		//console.log(vie2)
  		if(coup_etat == true && vie2 == true) {
  			village.then((value) => {
  				actif_coup_etat = true;
  				coup_etat = false
  				players.forEach(function(item, index, array) {
  					if(role[index] == "dictateur") {
  						value.send(theme["messages"]["misc"]["dictateur"].replace("{0}", item.username))
  					}
  				});

  			});
  		}else {
  			if(dictacible != null) {
  				cycle = "night"
  				setcycle(message)
          a = eend(message)
          if(a == true) {
            return;
          }else {
  					village.then((value) => {
  						value.send(theme["messages"]["misc"]["nuit"])
  					});
  				}
  			}else {
  				if(maire == null && vote_maire == false) {
  					village.then((value) => {
  						value.send(theme["messages"]["misc"]["maire"])
  					});
  					vote_maire = true;
  				}else {
  					if(vote_mort == false) {
  						resetvote();
  						village.then((value) => {
  							value.send(theme["messages"]["misc"]["mort-village"])
  						});
  						vote_mort = true
  					}else {
  						resetvote();
  						cycle = "night"
  						setcycle(message)
              a = eend(message)
              if(a == true) {
                return;
              }else {
  							village.then((value) => {
  								value.send(theme["messages"]["misc"]["nuit"])
  							});
  						}
  					}
  				}
  			}
  		}
  	}
  }

}

function mort(user, statee) {
  if(maire != null && maire.id == user.id) {
    waitmaire = true
  }

	if(statee == 0) {
    if(amoureux1 != null) {
  		if(user.username.toLowerCase() == amoureux1.toLowerCase()) {
  			players.forEach(function(item, index, array) {
  				if(item.username.toLowerCase() == amoureux2.toLowerCase()) {
  					mort(item, 1)
  				}
  			});
  		}else if(user.username.toLowerCase() == amoureux2.toLowerCase()) {
  			players.forEach(function(item, index, array) {
  				if(item.username.toLowerCase() == amoureux1.toLowerCase()) {
  					mort(item, 1)
  				}
  			});
  		}
    }
	}
	rolemort = null;
	players.forEach(function(item, index, array) {
		if(user.id == item.id) {
			vie[index] = false
			rolemort = role[index]
			if(rolemort == "chasseur") {
				chasse = true;
			}
      if(modele != null && modele.id == item.id) {
        nbr_loup += 1
        enfsauvlg = true
        players.forEach(function(item2, index2, array2) {
          if(role[index2] == "enfantsauvage") {
            loupgarou.then((value2) => {
              value2.updateOverwrite(item2.id, { VIEW_CHANNEL: true });
            });
          }
        });
      }
		}
	});
	if(chasse == true || waitmaire == true) {
		village.then((value3) => {
			necromancien.then((value2) => {
				salon.forEach(function(item, index, array) {
						item.then((value) => {
							if(value.id == value2.id) {
								value.updateOverwrite(user.id, { VIEW_CHANNEL: true });

							}else if(value.id == value3.id) {
								value.updateOverwrite(user.id, { SEND_MESSAGES: true });
							}else {
								value.updateOverwrite(user.id, { SEND_MESSAGES: false });
							}
						});
				});
			});
		});
	}else {
		necromancien.then((value2) => {
			salon.forEach(function(item, index, array) {
					item.then((value) => {
						if(value.id == value2.id) {
							value.updateOverwrite(user.id, { VIEW_CHANNEL: true });
						}else {
							value.updateOverwrite(user.id, { SEND_MESSAGES: false });
						}
					});
			});
		});
	}

	players.forEach(function(item, index, array) {
		if(user.id == item.id) {
			village.then((value) => {
				if(statee == 0) {
					value.send(theme["messages"]["misc"]["mort"].replace("{0}", user.username).replace("{1}", role[index]))
				}else {
					value.send(theme["messages"]["misc"]["mort-love"].replace("{0}", user.username).replace("{1}", role[index]))
				}
			});
		}
	});
}

function setcycle(message) {
	if(cycle == 'day') {
		soso = "null";
		sosocible = null;
		vovo = false;
		protect = null;
		day = day + 1;
		lgmort = null;
    pyro_act = null;
    lgbcible = null;
	}

	ccycle = (cycle == "night")
	village.then((value) => {
		value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: !ccycle });
	});

  loupgarou.then((value) => {
    value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: ccycle });
  });

  loupblanc.then((value) => {
    value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: ccycle });
  });

  chienloup.then((value) => {
    value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: ccycle });
  });

  enfantsauvage.then((value) => {
    value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: ccycle });
  });

  voyante.then((value) => {
    value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: ccycle });
  });

  sorciere.then((value) => {
    value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: ccycle });
  });

  pyromane.then((value) => {
    value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: ccycle });
  });

  garde.then((value) => {
    value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: ccycle });
  });

	cupidon.then((value) => {
		value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: ccycle });
	});

  salon.forEach(function(item, index, array) {
    init(message, item)
  });

}

function resetvote() {
	vv = []
	players.forEach(function(item, index, array) {
		vv.push([])
	});
	vote_nothing = [];
	votes = vv;
}

function get_equipe_from_role(rol) { //return lg, lb, village, pyro, fou
	if(rol == "loup-garou") {
		return "lg";
	}else if(rol == "loup-blanc") {
		return 'lb';
	}else if(rol == "chien-loup") {
		if(chlg == "lg") {
			return "lg";
		}else {
			return "village";
		}
	}else if(rol == "petite-fille") {
		return "village";
	}else if(rol == "villageois") {
		return "village";
	}else if(rol == "voyante") {
		return "village";
	}else if(rol == "sorcière") {
		return "village";
	}else if(rol == "pyromane") {
		return "pyro";
	}else if(rol == "enfant-sauvage") {
		players.forEach(function(item, index, array) {
			if(index == modele) {
				if(vie[index] == true) {
					return "village";
				}else {
					return "lg";
				}
			}
		});
	}else if(rol == "cupidon") {
		return "village";
	}else if(rol == "garde") {
		return "village";
	}else if(rol == "dictateur") {
		return "village";
	}else if(rol == "nécromancien") {
		return "village";
	}else if(rol == "fou") {
		return "fou";
	}else if(rol == "chasseur") {
		return "village";
	}
	return "null";
}

function mairee(message, indii) {
  message.channel.send(theme["messages"]["misc"]["vote-personne"]);
  wait_maire = true;
  maire_bet = indii;
}

function init(message, ch) {
  jjj = ""
  players.forEach(function(item, index, array) {
    if(vie[index] == true) {
      jjj += item.username
      if(index < players.length - 1) {
        jjj += ", "
      }
    }
  });


  ch.then((value) => {
    value.send("Les joueurs restants sont : " + jjj);
  });


  if(ch == chienloup) {
    role.forEach(function(item, index, array) {
      if(item == "cupidon" && amoureux1 == null) {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
  }else if(ch == enfantsauvage) {
    role.forEach(function(item, index, array) {
      if(item == "chien-loup" && chlg == null) {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "cupidon" && amoureux1 == null) {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
  }else if(ch == voyante) {
    role.forEach(function(item, index, array) {
      if(item == "enfant-sauvage" && modele == null) {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "chien-loup" && chlg == null) {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "cupidon" && amoureux1 == null) {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
  }else if(ch == garde) {
    role.forEach(function(item, index, array) {
      if(item == "voyante") {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "enfant-sauvage" && modele == null) {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "chien-loup" && chlg == null) {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "cupidon" && amoureux1 == null) {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
  }else if(ch == loupgarou) {
    role.forEach(function(item, index, array) {
      if(item == "garde") {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "voyante") {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "enfant-sauvage" && modele == null) {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "chien-loup" && chlg == null) {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "cupidon" && amoureux1 == null) {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
  }else if(ch == loupblanc) {
    role.forEach(function(item, index, array) {
      if(item == "loup-garou") {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "garde") {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "voyante") {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "enfant-sauvage" && modele == null) {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "chien-loup" && chlg == null) {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "cupidon" && amoureux1 == null) {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
  }else if(ch == pyromane) {
    role.forEach(function(item, index, array) {
      if(item == "loup-blanc" && day % 2 == 1) {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "loup-garou") {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "garde") {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "voyante") {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "enfant-sauvage" && modele == null) {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "chien-loup" && chlg == null) {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "cupidon" && amoureux1 == null) {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
  }else if(ch == sorciere) {
    role.forEach(function(item, index, array) {
      if(item == "pyromane") {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "loup-blanc" && day % 2 == 1) {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "loup-garou") {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "garde") {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "voyante") {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "enfant-sauvage" && modele == null) {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "chien-loup" && chlg == null) {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "cupidon" && amoureux1 == null) {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
  }else if(ch == dictateur) {
    role.forEach(function(item, index, array) {
      if(item == "sorciere") {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "pyromane") {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "loup-blanc" && day % 2 == 1) {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "loup-garou") {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "garde") {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "voyante") {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "enfant-sauvage" && modele == null) {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "chien-loup" && chlg == null) {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "cupidon" && amoureux1 == null) {
        if(vie[index] == true) {
          ch.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false });
          });
          return;
        }
      }
    });
  }
}

function nextt(message, ch) {
  village.then((value) => {
    ch.then((value2) => {
      value.send(value2.name + " a joué");
    });
  });
  all = false


  if(ch == cupidon) {
    role.forEach(function(item, index, array) {
      if(item == "chien-loup" && all == false && chlg == null) {
        if(vie[index] == true) {
          chienloup.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "enfant-sauvage" && all == false && model == null) {
        if(vie[index] == true) {
          enfantsauvage.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "voyante" && all == false) {
        if(vie[index] == true) {
          voyante.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "garde" && all == false) {
        if(vie[index] == true) {
          garde.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "loup-garou" && all == false) {
        if(vie[index] == true) {
          loupgarou.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "loup-blanc" && all == false && day % 2 == 1) {
        if(vie[index] == true) {
          loupblanc.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "pyromane" && all == false) {
        if(vie[index] == true) {
          pyromane.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "assassin" && all == false) {
        if(vie[index] == true) {
          assassin.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "sorcière" && all == false) {
        if(vie[index] == true) {
          sorciere.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "dictateur" && all == false) {
        if(vie[index] == true) {
          dictateur.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
  }else if(ch == enfantsauvage) {
    role.forEach(function(item, index, array) {
      if(item == "voyante" && all == false) {
        if(vie[index] == true) {
          voyante.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "garde" && all == false) {
        if(vie[index] == true) {
          garde.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "loup-garou" && all == false) {
        if(vie[index] == true) {
          loupgarou.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "loup-blanc" && all == false && day % 2 == 1) {
        if(vie[index] == true) {
          loupblanc.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "pyromane" && all == false) {
        if(vie[index] == true) {
          pyromane.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "assassin" && all == false) {
        if(vie[index] == true) {
          assassin.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "sorcière" && all == false) {
        if(vie[index] == true) {
          sorciere.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "dictateur" && all == false) {
        if(vie[index] == true) {
          dictateur.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
  }else if(ch == chienloup) {
    role.forEach(function(item, index, array) {
      if(item == "enfant-sauvage" && all == false && modele == null) {
        if(vie[index] == true) {
          enfantsauvage.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "voyante" && all == false) {
        if(vie[index] == true) {
          voyante.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "garde" && all == false) {
        if(vie[index] == true) {
          garde.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "loup-garou" && all == false) {
        if(vie[index] == true) {
          loupgarou.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "loup-blanc" && all == false && day % 2 == 1) {
        if(vie[index] == true) {
          loupblanc.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "pyromane" && all == false) {
        if(vie[index] == true) {
          pyromane.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "assassin" && all == false) {
        if(vie[index] == true) {
          assassin.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "sorcière" && all == false) {
        if(vie[index] == true) {
          sorciere.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "dictateur" && all == false) {
        if(vie[index] == true) {
          dictateur.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
  }else if(ch == voyante) {
    role.forEach(function(item, index, array) {
      if(item == "garde" && all == false) {
        if(vie[index] == true) {
          garde.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "loup-garou" && all == false) {
        if(vie[index] == true) {
          loupgarou.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "loup-blanc" && all == false && day % 2 == 1) {
        if(vie[index] == true) {
          loupblanc.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "pyromane" && all == false) {
        if(vie[index] == true) {
          pyromane.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "assassin" && all == false) {
        if(vie[index] == true) {
          assassin.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "sorcière" && all == false) {
        if(vie[index] == true) {
          sorciere.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "dictateur" && all == false) {
        if(vie[index] == true) {
          dictateur.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
  }else if(ch == garde) {
    role.forEach(function(item, index, array) {
      if(item == "loup-garou" && all == false) {
        if(vie[index] == true) {
          loupgarou.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "loup-blanc" && all == false && day % 2 == 1) {
        if(vie[index] == true) {
          loupblanc.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "pyromane" && all == false) {
        if(vie[index] == true) {
          pyromane.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "assassin" && all == false) {
        if(vie[index] == true) {
          assassin.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "sorcière" && all == false) {
        if(vie[index] == true) {
          sorciere.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "dictateur" && all == false) {
        if(vie[index] == true) {
          dictateur.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
  }else if(ch == loupgarou) {
    role.forEach(function(item, index, array) {
      if(item == "loup-blanc" && all == false && day % 2 == 1) {
        console.log(day % 2 == 1)
        if(vie[index] == true) {
          loupblanc.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "pyromane" && all == false) {
        if(vie[index] == true) {
          pyromane.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "assassin" && all == false) {
        if(vie[index] == true) {
          assassin.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "sorcière" && all == false) {
        if(vie[index] == true) {
          sorciere.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "dictateur" && all == false) {
        if(vie[index] == true) {
          dictateur.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
  }else if(ch == loupblanc) {
    role.forEach(function(item, index, array) {
      if(item == "pyromane" && all == false) {
        if(vie[index] == true) {
          pyromane.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "assassin" && all == false) {
        if(vie[index] == true) {
          assassin.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(role == "sorcière" && all == false) {
        if(vie[index] == true) {
          sorciere.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "dictateur" && all == false) {
        if(vie[index] == true) {
          dictateur.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
  }else if(ch == pyromane) {
    role.forEach(function(item, index, array) {
      if(item == "assassin" && all == false) {
        if(vie[index] == true) {
          assassin.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "sorcière" && all == false) {
        if(vie[index] == true) {
          sorciere.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
    role.forEach(function(item, index, array) {
      if(item == "dictateur" && all == false) {
        if(vie[index] == true) {
          dictateur.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
  }else if(ch == sorciere) {
    role.forEach(function(item, index, array) {
      if(item == "dictateur" && all == false) {
        if(vie[index] == true) {
          dictateur.then((value) => {
            value.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true });
          });
          all = true
          return;
        }
      }
    });
  }

}

function end() {
	equipe_vill = false
	equipe_lg = false
	equipe_love = false
	equipe_pyro = false
	equipe_lb = false
	equipe_fou = false

	players.forEach(function(item, index, array) {
		if(vie[index] == true) {
			if(amoureux1 != null && item.id == amoureux1.id) {
				players.forEach(function(item2, index2, array2) {
					if(item2.id == amoureux2.id) {
						if(get_equipe_from_role(role[index]) == get_equipe_from_role(role[index2])) {
							if(get_equipe_from_role(role[index]) == "village") {
								equipe_vill = true;
							}else if(get_equipe_from_role(role[index]) == "lg"){
								equipe_lg = true;
							}
						}else {
							equipe_love == true;
						}
					}
				});
			}else if(amoureux1 != null && item.id == amoureux2.id) {
				players.forEach(function(item2, index2, array2) {
					if(item2.id == amoureux1.id) {
						if(get_equipe_from_role(role[index]) == get_equipe_from_role(role[index2])) {
							if(get_equipe_from_role(role[index]) == "village") {
								equipe_vill = true;
							}else if(get_equipe_from_role(role[index]) == "lg"){
								equipe_lg = true;
							}
						}else {
							equipe_love == true;
						}
					}
				});
			}else {
				if(get_equipe_from_role(role[index]) == "village") {
					equipe_vill = true
				}else if(get_equipe_from_role(role[index]) == "lg") {
					equipe_lg = true;
				}else if(get_equipe_from_role(role[index]) == "pyro") {
					equipe_pyro = true;
				}else if(get_equipe_from_role(role[index]) == "lb") {
					equipe_lb = true;
				}else if(get_equipe_from_role(role[index]) == "fou") {
					equipe_fou = true;
				}

			}
		}


	});

	if(equipe_vill == true && equipe_lg == false && equipe_pyro == false && equipe_lb == false && equipe_fou == false && equipe_love == false) {
		return "village"
	}else if(equipe_vill == false && equipe_lg == true && equipe_pyro == false && equipe_lb == false && equipe_fou == false && equipe_love == false) {
		return "lg"
	}else if(equipe_vill == false && equipe_lg == false && equipe_pyro == true && equipe_lb == false && equipe_fou == false && equipe_love == false) {
		return "pyro"
	}else if(equipe_vill == false && equipe_lg == false && equipe_pyro == false && equipe_lb == true && equipe_fou == false && equipe_love == false) {
		return "lb"
	}else if(equipe_vill == false && equipe_lg == false && equipe_pyro == false && equipe_lb == false && equipe_fou == true && equipe_love == false) {
		return "fou"
	}else if(equipe_vill == false && equipe_lg == false && equipe_pyro == false && equipe_lb == false && equipe_fou == false && equipe_love == true) {
		return "love"
	}else if(equipe_vill == false && equipe_lg == false && equipe_pyro == false && equipe_lb == false && equipe_fou == false && equipe_love == false) {
		return "égalité"
	}else {
		return "null"
	}

}

function eend(message) {
  test = end();
  if(test != "null") {
    if(test == "village") {
      village.then((value) => {
        value.send(theme["messages"]["victoire"]["village"])
      });
      recap(message, "village");
      return true;
    }else if(test == "lg") {
      village.then((value) => {
        value.send(theme["messages"]["victoire"]["loup-garou"])
      });
      recap(message, "loup-garou");
      return true;
    }else if(test == "lb") {
      village.then((value) => {
        value.send(theme["messages"]["victoire"]["loup-blanc"])
      });
      recap(message, "loup-blanc");
      return true;
    }else if(test == "fou") {
      village.then((value) => {
        value.send(theme["messages"]["victoire"]["fou"])
      });
      recap(message);
      return true;
    }else if(test == "pyro") {
      village.then((value) => {
        value.send(theme["messages"]["victoire"]["pyromane"])
      });
      recap(message, "pyromane");
      return true;
    }else if(test == "love") {
      village.then((value) => {
        value.send(theme["messages"]["victoire"]["love"])
      });
      recap(message);
      return true;
    }else if(test == "égalité") {
      village.then((value) => {
        value.send(theme["messages"]["victoire"]["égalité"])
      });
      recap(message, "égalité");
      return true;
    }
  }
  return false;
}

function recap(message, team) {
  village.then((value) => {
    pl = ""
    players.forEach(function(item, index, array) {
      pl += "<@" + item.id + ">"
      if(index != players.length -1) {
        pl += "\n"
      }
    });
    rl = ""
    players.forEach(function(item, index, array) {
      rl +=role[index]
      if(index != players.length - 1) {
        rl += "\n"
      }
    });
    if(team == "égalité") {
      embed = new MessageEmbed().setTitle("récapitulatif : ").setColor(0xffe402).setDescription("la partie s'est terminé sur une égalité").addField("joueurs : ", pl, true).addField("rôles : ", rl , true).setThumbnail("https://www.loups-garous-en-ligne.com/jeu/assets/images/carte2.png");
    }else {
      embed = new MessageEmbed().setTitle("récapitulatif : ").setColor(0xffe402).setDescription("la partie s'est terminé sur une victoire de l'équipe " + team).addField("joueurs : ", pl, true).addField("rôles : ", rl , true).setThumbnail("https://www.loups-garous-en-ligne.com/jeu/assets/images/carte2.png");
    }
    salonbase.send(embed);
    return
  });
}



client.login(process.env.DISCORD_TOKEN);
