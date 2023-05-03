module.exports = {
    name: 'trackerdelete',
    group: 'LOL',
    description: "listener de supression de channel tracker",
    type: "channelDelete",
    place: "guild",
    async run(client, channel) {
        if (client.lol.trackers.includes(channel.id)) {
            const query = "DELETE FROM trackers WHERE channelid=$1;";
            client.lol.trackers.splice(client.lol.trackers.indexOf(channel.id), 1);
            await client.pg.query(query, [channel.id]);
        }
    }
};