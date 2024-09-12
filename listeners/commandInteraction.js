const logger = require('../util/logger');
module.exports = {
    name: 'commandInteraction',
    group: 'core',
    description: "listener de gestion d'interaction",
    type: "interactionCreate",
    place: "guild",
    options: undefined,
    async run(client, interaction) {
        if (client.softbans.includes(interaction.user.id)) {
            // softban mean 4/5 commands are blocked
            const random = Math.floor(Math.random() * 5);
            if (random !== 0) {
                logger.log(`softban ${interaction.user.id} on command ${interaction.commandName}`);
                return;
            }
        }
        if (interaction.isCommand()) {

            if (!client.commands.has(interaction.commandName)) { return; }

            try {
                const can_run = client.canRunCommande(undefined, client.commands.get(interaction.commandName), interaction);
                if (can_run) {
                    await client.commands.get(interaction.commandName).run(undefined, client, interaction);
                    return;
                }
                if (can_run === "perm") {
                    await interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande", ephemeral: true });
                } else {
                    await interaction.reply({ content: "Vous ne pouvez pas utiliser cette commande dans ce salon", ephemeral: true });
                }


            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        } else if (interaction.isAutocomplete()) {
            if (!client.commands.has(interaction.commandName)) { return; }

            try {
                const can_run = client.canRunCommande(undefined, client.commands.get(interaction.commandName), interaction);
                if (can_run) {
                    await client.commands.get(interaction.commandName).autocomplete(client, interaction);
                    return;
                }

            } catch (error) {
                console.error(error);
            }
        } else if (interaction.isButton()) {
            if (!client.buttons.has(interaction.customId)) { return; }


            try {
                const can_run = client.canRunCommande(undefined, client.buttons.get(interaction.customId), interaction);
                if (can_run) {
                    await client.buttons.get(interaction.customId).run(interaction, client);
                    return;
                }
                if (can_run === "perm") {
                    await interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande", ephemeral: true });
                } else {
                    await interaction.reply({ content: "Vous ne pouvez pas utiliser cette commande dans ce salon", ephemeral: true });
                }


            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        } else {
            //console.log(interaction)
            if (!client.context_menu.has(interaction.commandName)) { return; }

            try {
                const can_run = client.canRunCommande(undefined, client.context_menu.get(interaction.commandName), interaction);
                if (can_run) {
                    await client.context_menu.get(interaction.commandName).run(interaction, client);
                    return;
                }
                if (can_run === "perm") {
                    await interaction.reply({ content: "Vous n'avez pas la permission d'utiliser cette commande", ephemeral: true });
                } else {
                    await interaction.reply({ content: "Vous ne pouvez pas utiliser cette commande dans ce salon", ephemeral: true });
                }


            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    }
};