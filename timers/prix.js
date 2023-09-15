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
            const prix = product[i].prix;
            const char_start = product[i].char_start;
            const char_end = product[i].char_end;
            const responsefetch = await fetch(url);
            const a = await responsefetch.text();
            const html = parse.parse(a);
            const price_text = html.querySelector(identifier).innerHTML.trim();
            const price = parseFloat(html.querySelector(identifier).innerHTML.trim().substring(char_start, price_text.length - char_end));
            if (price !== prix) {
                client.channels.cache.get('523429014703177729').send(`<@297409548703105035> Le prix de ${url} a changé de ${prix}€ à ${price}€`);

                await client.pg.query({
                    name: "insert-price",
                    text: "INSERT INTO prix (url, date, identifier, char_start, char_end, prix) VALUES ($1, $2, $3, $4, $5, $6)",
                    values: [url, new Date(), identifier, char_start, char_end, price]
                });
            }
        }

    }
};