const parse = require('node-html-parser');

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
        product.push(...response.rows);
        for (let i = 0; i < product.length; i++) {
            const url = product[i].url;
            const identifier = product[i].identifier;

            console.log(url);
            console.log(identifier);

            const prix = product[i].prix;
            const char_start = product[i].char_start;
            const char_end = product[i].char_end;
            const date = product[i].date;
            const responsefetch = await fetch(url);
            const a = await responsefetch.text();
            console.log(a);
            const html = parse.parse(a);
            const price = html.querySelectorAll(identifier);
            console.log(price);
        }

    }
};