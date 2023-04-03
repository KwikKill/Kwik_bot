const { Client, Collection, Intents } = require('discord.js');
const config = require('./config.json');
const fs = require("fs");
const lol = require("./util/lol_functions.js");
const express_server = require("./util/express.js");
const Markov = require('markov-strings').default;

const client = new Client(
    {
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.DIRECT_MESSAGES,
            Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            Intents.FLAGS.GUILD_MEMBERS
        ],
        partials: [
            'MESSAGE',
            'CHANNEL',
            'REACTION'
        ]
    }
);

// -------------- LOL -----------------
client.lol = lol;
client.lol.setup(client);

// -------------- Markov -----------------

client.markov = new Markov({ stateSize: 3 });
client.markov.import(JSON.parse(fs.readFileSync('markov.json', 'utf8')));

// -------------- Commandes -----------------
client.commands = new Collection();
client.context_menu = new Collection();
client.buttons = new Collection();
client.groups = new Collection();

client.timers = new Collection();

client.listeners = new Collection();

client.amonglegends = new Collection();

client.owners = config["owner"];

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

const TimersFiles = fs.readdirSync('./timers').filter(file => file.endsWith('.js'));
for (const file of TimersFiles) {
    const timer = require(`./timers/${file}`);
    client.timers.set(timer.name, timer);
}

client.commands.forEach((item) => {
    if (!client.groups.has(item.group)) {
        const a = {
            name: item.group,
            commands: new Collection()
        };
        client.groups.set(item.group, a);
    }
    client.groups.get(item.group).commands.set(item.name, item);
});

client.isOwner = function (user) {
    return client.owners.includes(user.id);
};

// -------------- Express -----------------

express_server.register(client);

// -------------- Utils -----------------
if (!String.prototype.format) {
    String.prototype.format = function () {
        const args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] !== 'undefined'
                ? args[number]
                : match;
        });
    };
}

// -------------- Events -----------------
client.listeners.forEach((item) => {
    client.on(item.type, async (args1, args2, args3, args4) => {
        item.run(client, args1, args2, args3, args4);
    });
});

// -------------- Functions -----------------
/**
 * Check if the command can be run
 * @function canRunCommande
 * @param  {*} message      message send by the user
 * @param  {*} commande     commande to run
 * @param  {*} interaction  interaction send by the user
 * @return {Boolean}        return true if the command can be run
 */
client.canRunCommande = function (message, commande, interaction = undefined) {
    if (interaction === undefined) {
        //if(commande.commande_channel === true && !message.channel.name.toLowerCase().includes("commande")) return false
        if (!checkpermission(message, commande.permission)) { return "perm"; }
        if (commande.place === "dm" && message.channel.type !== "DM") { return false; }
        if (commande.place === "guild" && message.channel.type !== "GUILD_TEXT") { return false; }
        return true;
    }
    //if(commande.commande_channel === true && !interaction.channel.name.toLowerCase().includes("commande")) return false;
    if (!checkpermission(interaction, commande.permission)) { return "perm"; }
    return true;

};

/**
 * Check if the user has the given permission
 * @function checkpermission
 * @param {*} message    message send by the user
 * @param {*} perm       permission to check
 * @returns {Boolean}    return true if the user has the permission
 */
function checkpermission(message, perm) {
    const id = message.author !== undefined ? message.author.id : message.user.id;
    if (client.owners.includes(id)) {
        return true;
    }
    if (perm === "none") {
        return true;
    } if (perm === "modo") {
        if (message.member.permissions.any("MANAGE_MESSAGES")) {
            return true;
        }
    }
    return false;

}

// -------------- Login -----------------
client.login(process.env.DISCORD_TOKEN);
