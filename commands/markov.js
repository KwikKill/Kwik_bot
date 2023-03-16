const Markov = require('markov-strings').default;
const fs = require('fs');

module.exports = {
    name: 'markov',
    group: 'fun',
    description: "Génère un message avec la chaine de markov",
    permission: "none",
    serverid: ["513776796211085342", "480142959501901845", "890915473363980308", "962329252550807592"],
    hidden: false,
    place: "guild",
    options: [
        {
            name: 'score',
            description: 'score minimum du message',
            type: 'STRING',
            required: false,
        },
        {
            name: 'profil',
            description: 'profil de markov',
            type: 'USER',
            required: false,
        }
    ],
    async run(message, client, interaction = undefined) {
        if (interaction !== undefined) {
            await interaction.deferReply();
            if (interaction.options.getUser('profil') === null || interaction.options.getUser('profil') === undefined) {
                let score = 10;
                if (interaction.options.getString('score') !== null) {
                    score = interaction.options.getString('score');
                }
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
                        if (result.score <= score) {
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
                    interaction.editReply("Markov : " + content.string);
                } catch (e) {
                    interaction.editReply("Markov : ratio (j'ai la flemme)");
                }
            } else {
                const userid = interaction.options.getUser('profil').id;
                let score = 4;
                if (interaction.options.getString('score') !== null) {
                    score = interaction.options.getString('score');
                }
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
                        if (result.score <= score) {
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
                    const markov = new Markov({ stateSize: 3 });
                    markov.import(JSON.parse(fs.readFileSync('markov/' + userid + '.json', 'utf8')));
                    try {
                        const content = markov.generate(options);
                        interaction.editReply("Markov : " + content.string);
                    } catch (e) {
                        interaction.editReply("Markov : ratio (j'ai la flemme)");
                    }
                } catch (e) {
                    interaction.editReply("Ce profile n'existe pas");
                    return;
                }
            }
        }
    }
};
