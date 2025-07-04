const logger = require('../util/logger');
const { entitlementStatus } = require('discord.js');

module.exports = {
    name: 'entitlementUpdate',
    group: 'entitlement',
    description: "Delete entitlement interaction listener",
    type: "entitlementCreate",
    async run(client, oldEntitlement, newEntitlement) {
        // Log the updated entitlement
        logger.log(`Entitlement updated: ${oldEntitlement?.id} -> ${newEntitlement?.id}`);

        // Check if the entitlement is valid
        if (!newEntitlement
            || !newEntitlement.userId
        ) {
            logger.error(`Invalid entitlement data received: ${JSON.stringify(newEntitlement)}`);
            return;
        }

        // Check if the user has an account in DB
        client.pg.query({
            text: 'SELECT * FROM summoners WHERE discordid = $1 ORDER BY priority DESC',
            values: [entitlement.userId]
        }, (err, res) => {
            if (err) {
                logger.error(`Database error while checking user account: ${err.message}`);
                return;
            }

            if (res.rows.length === 0) {
                logger.warn(`No account found for user ${entitlement.userId}. entitlement will be processed automatically on account creation.`);
                return;
            }

            if (newEntitlement.deleted && res.rows[0].priority !== 0) {
                // Update the user's priority to 0, indicating entitlement deletion
                client.pg.query({
                    text: 'UPDATE summoners SET priority = 0 WHERE discordid = $1',
                    values: [entitlement.userId]
                }, (err) => {
                    if (err) {
                        logger.error(`Database error while inserting entitlement: ${err.message}`);
                    } else {
                        logger.log(`entitlement ${entitlement.id} for user ${entitlement.userId} has been processed successfully.`);
                    }
                });

                // Send a message to the user about their new entitlement
                client.users.fetch(entitlement.userId).then(user => {
                    user.send({
                        content: `Your subscription has been successfully cancelled. I'll miss you!`,
                        embeds: []
                    }).catch(error => {
                        logger.error(`Failed to send entitlement message to user ${entitlement.userId}: ${error.message}`);
                    });
                }).catch(error => {
                    logger.error(`Failed to fetch user ${entitlement.userId} for entitlement notification: ${error.message}`);
                });
            // Check endsTimestamp to determine if the entitlement is still valid
            } else if (newEntitlement.endsTimestamp && newEntitlement.endsTimestamp > Date.now() && res.rows[0].priority === 0) {
                // Update the user's priority to 1, indicating entitlement creation
                client.pg.query({
                    text: 'UPDATE summoners SET priority = 1 WHERE discordid = $1',
                    values: [entitlement.userId]
                }, (err) => {
                    if (err) {
                        logger.error(`Database error while inserting entitlement: ${err.message}`);
                    } else {
                        logger.log(`entitlement ${entitlement.id} for user ${entitlement.userId} has been processed successfully.`);

                        // Send a message to the user about their new entitlement
                        client.users.fetch(entitlement.userId).then(user => {
                            user.send({
                                content: `Thank you for your purchase! Your subscription has been successfully activated.`,
                                embeds: []
                            }).catch(error => {
                                logger.error(`Failed to send entitlement message to user ${entitlement.userId}: ${error.message}`);
                            });
                        }).catch(error => {
                            logger.error(`Failed to fetch user ${entitlement.userId} for entitlement notification: ${error.message}`);
                        });
                    }
                });
            }
        });
    }
};
