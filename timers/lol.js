module.exports = {
    name: 'lol',
    group: 'lol',
    onsetup: false,
    timer: 300000,
    description: "Fetch des utilisateurs toutes les heures",
    async run(client) {
        if (client.running) {
            return;
        }
        client.commands.get("adminlol").update(client, undefined);
        client.lol();
    }
};