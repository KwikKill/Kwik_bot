const logger = require('../util/logger');
const { entitlementStatus } = require('discord.js');

module.exports = {
    name: 'entitlementCreate',
    group: 'entitlement',
    description: "New entitlement interaction listener",
    type: "entitlementCreate",
    async run(client, entitlement) {
        console.log(entitlement);
        // Log the new entitlement
        logger.log(`New entitlement created: ${entitlement}`);

        logger.log("entitlement are currently disabled, skipping processing.");
        return;

        // Check if the entitlement is valid
        if (!entitlement
            || !entitlement.userId
            || entitlement.status === entitlementStatus.Inactive
        ) {
            logger.error(`Invalid entitlement data received: ${JSON.stringify(entitlement)}`);
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
        });
    }
};