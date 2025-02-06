module.exports = {
    name: 'trackerdelete',
    group: 'LOL',
    description: "listener de supression de channel tracker",
    type: "channelDelete",
    place: "guild",
    async run(client, channel) {
        if (client.lol.lol_rank_manager.trackers.includes({
            channel: channel.id,
            guild: channel.guild.id
        })) {
            const query = "DELETE FROM trackers WHERE channelid=$1;";
            client.lol.lol_rank_manager.trackers.splice(client.lol.lol_rank_manager.trackers.indexOf({
                channel: channel.id,
                guild: channel.guild.id
            }), 1);
            await client.pg.query(query, [channel.id]);
        }
    }
};