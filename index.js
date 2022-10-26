const { Client, MessageEmbed, Collection, Intents } = require('discord.js');
const config = require('./config.json');
const fs = require("fs");
const path = require('path');
const packageJSON = require("./package.json");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS], partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

// -------------- Commandes -----------------
client.commands = new Collection();
client.context_menu = new Collection();
client.buttons = new Collection();
client.groups = new Collection();
client.owners = config["owner"]

client.listeners = new Collection();

client.amonglegends = new Collection();

const ListenerFiles = fs.readdirSync('./listeners').filter(file => file.endsWith('.js'));
for (const file of ListenerFiles) {
	const listener = require(`./listeners/${file}`);
	client.listeners.set(listener.name, listener);
}

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const contextFiles = fs.readdirSync('./context-menu').filter(file => file.endsWith('.js'));
for (const file of contextFiles) {
	const context = require(`./context-menu/${file}`);
	client.context_menu.set(context.name, context);
}

const buttonFiles = fs.readdirSync('./buttons').filter(file => file.endsWith('.js'));
for (const file of buttonFiles) {
	const button = require(`./buttons/${file}`);
	client.buttons.set(button.name, button);
}

client.commands.forEach((item, i) => {
	if(!client.groups.has(item.group)) {
		a = {
			name: item.group,
			commands: new Collection()
		}
		client.groups.set(item.group, a)
	}
	client.groups.get(item.group).commands.set(item.name, item)
});

client.isOwner = function (user) {
	return client.owners.includes(user.id)
}

// -------------- Utils -----------------
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

// -------------- Events -----------------
client.listeners.forEach((item, i) => {
  client.on(item.type, async (args1, args2, args3, args4) => {
    item.run(client, args1, args2, args3, args4)
  })
});

// -------------- Functions -----------------
client.canRunCommande = function(message, commande, interaction=undefined) {
	if(interaction == undefined) {
		//if(commande.commande_channel == true && !message.channel.name.toLowerCase().includes("commande")) return false
		if(!checkpermission(message, commande.permission)) return "perm";
		if(commande.place == "dm" && message.channel.type != "DM") return false;
		if(commande.place == "guild" && message.channel.type != "GUILD_TEXT") return false;
		return true;
	}else {
		//if(commande.commande_channel == true && !interaction.channel.name.toLowerCase().includes("commande")) return false;
		if(!checkpermission(interaction, commande.permission)) return "perm";
		return true;
	}
}

function checkpermission(message, perm) {
	id = message.author != undefined ? message.author.id : message.user.id
  if(client.owners.includes(id)) {
    return true
  }
	if(perm == "none") {
		return true
	}if(perm == "modo") {
    if(message.member.permissions.any("MANAGE_MESSAGES")) {
      return true
    }
  }
  return false

}

// -------------- Login -----------------
client.login(process.env.DISCORD_TOKEN);
