const config = require('../config.json');

module.exports = {
    name: 'prix',
    group: 'fun',
    onsetup: true,
    timer: 900000,
    description: "Notifie quand le prix d'un produit a changé",
    async run(client) {
        const product = [];
        const response = await client.pg.query({
            name: "select-product",
            text: "SELECT url, " +
                "max(date) as date, " +
                "(SELECT identifier FROM prix p2 WHERE p2.url = p1.url), " +
                "(SELECT prix FROM prix p2 WHERE p2.url = p1.url AND p2.date = max(p1.date)), " +
                "max(char_start) as char_start, " +
                "max(char_end) as char_end " +
                "FROM prix p1 GROUP BY url;"
        });
        console.log(response.rows);
    }
};