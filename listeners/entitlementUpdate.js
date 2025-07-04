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
            text: 'SELECT * FROM summoners WHERE discordid = $1',
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

            if (newEntitlement.deleted) {
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
            // Check endsTimestamp to determine if the entitlement is still valid
            } else if (newEntitlement.endsTimestamp && newEntitlement.endsTimestamp > Date.now()) {
                // Update the user's priority to 1, indicating entitlement creation
                client.pg.query({
                    text: 'UPDATE summoners SET priority = 1 WHERE discordid = $1',
                    values: [entitlement.userId]
                }, (err) => {
                    if (err) {
                        logger.error(`Database error while inserting entitlement: ${err.message}`);
                    } else {
                        logger.log(`entitlement ${entitlement.id} for user ${entitlement.userId} has been processed successfully.`);
                    }
                });
            }
        });
    }
};
