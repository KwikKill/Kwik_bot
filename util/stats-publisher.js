const logger = require("./logger")

/**
 * Publishes bot stats to Redis for the dashboard
 * @param {*} client Discord client with Redis connection
 */
async function publishBotStats(client) {
  if (!client.redisPubClient) {
    return
  }

  try {
    let totalCommandsUsed = 0
    if (client.pg) {
      const totalCommandsRes = await client.pg.query("SELECT COUNT(*)::int AS total FROM logs")
      totalCommandsUsed = totalCommandsRes.rows?.[0]?.total || 0
    }

    const stats = {
      serverCount: client.guilds.cache.size,
      userCount: client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
      uptime: Math.floor(process.uptime()),
      commands: totalCommandsUsed,
      connected: true,
    }

    const topServersBase = client.guilds.cache
      .sort((a, b) => b.memberCount - a.memberCount)
      .first(10)
      .map((guild) => ({
        id: guild.id,
        name: guild.name,
        icon: guild.iconURL({ extension: "png", size: 128 }) || null,
        memberCount: guild.memberCount,
      }))

    let topServers = topServersBase.map((server) => ({
      ...server,
      commandsUsed: 0,
      hasTrackerChannel: false,
    }))

    if (client.pg && topServers.length > 0) {
      const guildIds = topServers.map((server) => server.id)

      const [commandsPerGuildRes, trackerPerGuildRes] = await Promise.all([
        client.pg.query(
          "SELECT serverid, COUNT(*)::int AS command_count FROM logs WHERE serverid = ANY($1::text[]) GROUP BY serverid",
          [guildIds],
        ),
        client.pg.query(
          "SELECT DISTINCT guildid FROM trackers WHERE guildid = ANY($1::text[])",
          [guildIds],
        ),
      ])

      const commandCountByGuild = new Map()
      for (const row of commandsPerGuildRes.rows) {
        commandCountByGuild.set(row.serverid, row.command_count || 0)
      }

      const trackerGuilds = new Set(trackerPerGuildRes.rows.map((row) => row.guildid))

      topServers = topServers.map((server) => ({
        ...server,
        commandsUsed: commandCountByGuild.get(server.id) || 0,
        hasTrackerChannel: trackerGuilds.has(server.id),
      }))
    }

    // Publish each stat to Redis
    await client.redisPubClient.set("bot:stats:serverCount", stats.serverCount.toString())
    await client.redisPubClient.set("bot:stats:userCount", stats.userCount.toString())
    await client.redisPubClient.set("bot:stats:uptime", stats.uptime.toString())
    await client.redisPubClient.set("bot:stats:commands", stats.commands.toString())
    await client.redisPubClient.set("bot:stats:connected", "true")
    await client.redisPubClient.set("bot:stats:topServers", JSON.stringify(topServers))

  } catch (error) {
    logger.error(error, "[Stats Publisher] Failed to publish bot stats")
  }
}

/**
 * Start periodic stats publishing
 * @param {*} client Discord client
 * @param {number} interval Interval in milliseconds (default: 10 seconds)
 */
function startStatsPublisher(client, interval = 10000) {
  // Publish immediately
  publishBotStats(client)

  // Then publish at regular intervals
  const intervalId = setInterval(() => {
    publishBotStats(client)
  }, interval)

  // Cleanup on process exit
  process.on("SIGINT", async () => {
    clearInterval(intervalId)
    if (client.redisPubClient) {
      await client.redisPubClient.set("bot:stats:connected", "false")
    }
  })

  process.on("SIGTERM", async () => {
    clearInterval(intervalId)
    if (client.redisPubClient) {
      await client.redisPubClient.set("bot:stats:connected", "false")
    }
  })

  logger.log("[Stats Publisher] Started bot stats publisher")
}

module.exports = {
  publishBotStats,
  startStatsPublisher,
}
