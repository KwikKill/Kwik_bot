const { Client, Collection, GatewayIntentBits, Partials, ChannelType } = require('discord.js');
const config = require('./config.json');
const fs = require("fs");
const lol = require("./util/lol_functions.js");
const index2 = require('./index2.js');
const logger = require('./util/logger');

const dns = require('node:dns');
dns.setDefaultResultOrder('ipv4first');

logger.log("Starting...");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction
    ]
});

// -------------- LOL -----------------
client.lol = lol;
client.lol.setup(client);

// -------------- Commandes -----------------
client.commands = new Collection();
client.context_menu = new Collection();
client.buttons = new Collection();
client.modals = new Collection();
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

const modalsFiles = fs.readdirSync('./modals').filter(file => file.endsWith('.js'));
for (const file of modalsFiles) {
    const modal = require(`./modals/${file}`);
    client.modals.set(modal.name, modal);
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
        if (!checkpermission(message, commande.owner, commande.permission)) { return "perm"; }
        if (commande.place === "dm" && message.channel.type !== ChannelType.DM) { return false; }
        if (commande.place === "guild" && message.channel.type !== ChannelType.GuildText) { return false; }
        return true;
    }
    //if(commande.commande_channel === true && !interaction.channel.name.toLowerCase().includes("commande")) return false;
    if (!checkpermission(interaction, commande.owner, commande.permission)) { return "perm"; }
    return true;

};

/**
 * Check if the user has the given permission
 * @function checkpermission
 * @param {*} message    message send by the user
 * @param {*} perm       permission to check
 * @returns {Boolean}    return true if the user has the permission
 */
function checkpermission(message, owner, perm) {
    const id = message.author !== undefined ? message.author.id : message.user.id;
    if (client.owners.includes(id)) {
        return true;
    }
    if (owner === true) {
        return false;
    }
    if (perm === undefined) {
        return true;
    }
    return message?.member?.permissions?.has(perm) ?? false;
}

// -------------- Index2 -----------------

index2.main(client);

// -------------- Login -----------------
client.login(process.env.DISCORD_TOKEN);
