const { Client, MessageEmbed, Collection, Intents } = require('discord.js');
const config = require('./config.json');
const fs = require("fs");
const path = require('path');
const packageJSON = require("./package.json");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.DIRECT_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS], partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

const discordJSVersion = packageJSON.dependencies["discord.js"];

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

client.on('warn', console.warn);

client.on('interactionCreate', async interaction => {
  if(interaction.isCommand()) {

  if (!client.commands.has(interaction.commandName)) return;

    try {
      can_run = canRunCommande(undefined, client.commands.get(interaction.commandName), interaction)
      if(can_run) {
        await client.commands.get(interaction.commandName).run(undefined, client, interaction);
        return
      }else {
        if(can_run == "perm") {
          await interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande", ephemeral: true });
        }else {
          await interaction.reply({ content: "Vous ne pouvez pas utiliser cette commande dans ce salon", ephemeral: true });
        }

      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }else if(interaction.isButton()) {
    console.log(interaction)
    if (!client.buttons.has(interaction.customId)) return;

    
    try {
      can_run = canRunCommande(undefined, client.buttons.get(interaction.customId), interaction)
      if(can_run) {
        await client.buttons.get(interaction.customId).run(interaction, client);
        return
      }else {
        if(can_run == "perm") {
          await interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande", ephemeral: true });
        }else {
          await interaction.reply({ content: "Vous ne pouvez pas utiliser cette commande dans ce salon", ephemeral: true });
        }

      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
 } else {
    //console.log(interaction)
    if (!client.context_menu.has(interaction.commandName)) return;

    try {
      can_run = canRunCommande(undefined, client.context_menu.get(interaction.commandName), interaction)
      if(can_run) {
        await client.context_menu.get(interaction.commandName).run(interaction, client);
        return
      }else {
        if(can_run == "perm") {
          await interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande", ephemeral: true });
        }else {
          await interaction.reply({ content: "Vous ne pouvez pas utiliser cette commande dans ce salon", ephemeral: true });
        }

      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
});

client.on('messageCreate', async message => {
  //config = JSON.parse(fs.readFileSync(path.join(__dirname, "config.json"), "utf8"));
  if (message.partial) {
      message = await message.fetch()
  }

  if (message.author.bot) return;
  const args = message.content.split(/ |\n/);
  if(message.content.charAt(0) == config["prefix"]) {
		args[0] = args[0].slice(1)
		commande = await client.commands.get(args[0])
		if(commande != undefined) {
			message.command = commande
			message.args = args
			if(canRunCommande(message, commande)) {
				await commande.run(message, client).catch(err => {
          console.log(err)
					message.channel.send("Une erreur inattendue s'est produite lors de l'exécution de la commande.\nCette erreur a été transmise et sera réglée au plus vite.")
					owner = client.users.cache.get(client.owners[0])
					owner.send("Une erreur inattendue s'est produite lors de l'exécution de la commande `" + message.content.toString() + "` par <@" + message.author.id.toString() + "> :\n```" + err.stack.toString() + "```")
				})
				return
			}
		}
	}else {
		message.command = undefined
	}
})

client.on('guildMemberAdd', member => {
    try {
        let welcome = JSON.parse(fs.readFileSync("./welcome.json", "utf8"));
        if (welcome[member.guild.id].channel) {
        var welcomechannel = member.guild.channels.cache.get(welcome[member.guild.id].channel);

        if (!welcomechannel) {
            return undefined;
        }
        console.log(welcome[member.guild.id].message + ` ${member}`);
        welcomechannel.send(welcome[member.guild.id].message + ` ${member}`);
        }
    }catch(err) {
        console.log(err);
    }
});
  
client.on('ready', () => {
    console.log(discordJSVersion);
    console.log('Le bot est démarré !');
    client.user.setActivity("[insert savun twomp]", { type: 'LISTENING' });
});

// -------------- Functions -----------------
function canRunCommande(message, commande, interaction=undefined) {
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
