module.exports = {
    name: 'markov',
    group: 'fun',
    description: "Génère un message avec la chaine de markov",
    permission: "none",
    serverid: ["513776796211085342", "480142959501901845", "890915473363980308", "962329252550807592"],
    hidden: false,
    place: "guild",
    help: [
        {
            "name": "- __markov__ :",
            "value": "Génère un message."
        },
    ],
    options: undefined,
    async run(message, client, interaction = undefined) {
        if (interaction !== undefined) {
            const options = {
                maxTries: 2000,
                prng: Math.random,

                filter: (result) => {
                    if (result.string.split(' ').length < 5) {
                        return false;
                    }
                    if (result.refs.length === 1) {
                        return false;
                    }
                    if (result.score <= 10) {
                        return false;
                    }
                    if (result.string[result.string.length - 1] !== "." && result.string[result.string.length - 1] !== "!" && result.string[result.string.length - 1] !== "?") {
                        return false;
                    }
                    for (const ref of result.refs) {
                        if (result.string === ref.string) {
                            return false;
                        }
                    }
                    return true;
                }
            };
            try {
                const content = client.markov.generate(options);
                interaction.reply("Markov : " + content.string);
            } catch (e) {
                interaction.reply("Markov : Et si je veux pas générer de message ?");
                console.log(e);
            }
        }
    }
};
