const { PermissionsBitField, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
const parse = require('node-html-parser');
const logger = require('../util/logger');

module.exports = {
    name: 'entitlements',
    group: 'admin',
    description: "Manage entitlements",
    permission: PermissionsBitField.Flags.ManageMessages,
    owner: true,
    serverid: ["513776796211085342"],
    hidden: false,
    options: [
        {
            name: 'status',
            description: 'check the status of the bot\'s entitlements',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'user',
                    description: 'the user to check the entitlement status for',
                    type: ApplicationCommandOptionType.User,
                    required: false
                }
            ]
        },
        {
            name: 'add',
            description: 'add a new Test entitlement',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: 'user',
                    description: 'the user to add the entitlement to',
                    type: ApplicationCommandOptionType.User,
                    required: true
                },
                {
                    name: 'sku_id',
                    description: 'the sku to add',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                } 
            ]
        },
        {
            name: 'remove',
            description: 'remove an entitlement from a user',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                 {
                    name: 'entitlement_id',
                    description: 'the entitlement to remove',
                    type: ApplicationCommandOptionType.String,
                    required: true,
                }
            ]
        }
    ],
    async run(message, client, interaction = undefined) {
        if (interaction !== undefined) { 
            if (interaction.options.getSubcommand() === 'status') {
                const user = interaction.options.getUser('user');
                // If a user is specified, check their entitlement status, otherwise check the bot's entitlements
                if (user) {

                } else {

                }

                // Check the status of the bot's entitlements
                await interaction.reply({
                    content: "Entitlements are currently disabled, skipping processing.",
                    ephemeral: true
                });
                return;
            } else if (interaction.options.getSubcommand() === 'add') {
                // Add a new entitlement
                const user = interaction.options.getUser('user');
                const skuId = interaction.options.getString('sku_id');

                if (!user || !skuId) {
                    await interaction.reply({
                        content: "Invalid user or entitlement ID.",
                        ephemeral: true
                    });
                    return;
                }

                // Log the entitlement addition
                logger.log(`Adding Test entitlement with sku ${skuId} for user ${user.id}`);

                // Add a Test entitlement to the user
                try {
                    const entitlement = await client.application.entitlements.createTest({
                        user: user.id,
                        sku: skuId
                    });
                    await interaction.reply({
                        content: `Test entitlement ${entitlement.id} has been added for user <@${user.id}>.`,
                        ephemeral: true
                    });
                } catch (error) {
                    logger.error(`Failed to add entitlement: ${error.message}`);
                    await interaction.reply({
                        content: `Failed to add entitlement: ${error.message}`,
                        ephemeral: true
                    });
                    return;
                }
            } else if (interaction.options.getSubcommand() === 'remove') {
                // Remove an entitlement
                const entitlementId = interaction.options.getString('entitlement_id');

                if (!entitlementId) {
                    await interaction.reply({
                        content: "Invalid entitlement ID.",
                        ephemeral: true
                    });
                    return;
                }

                // Log the entitlement removal
                logger.log(`Removing entitlement ${entitlementId}`);

                // Remove the entitlement
                try {
                    await client.application.entitlements.deleteTest(entitlementId);
                    await interaction.reply({
                        content: `Entitlement ${entitlementId} has been removed.`,
                        ephemeral: true
                    });
                } catch (error) {
                    logger.error(`Failed to remove entitlement: ${error.message}`);
                    await interaction.reply({
                        content: `Failed to remove entitlement: ${error.message}`,
                        ephemeral: true
                    });
                    return;
                }
            }
        }
    }
}