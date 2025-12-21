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
    const stats = {
      serverCount: client.guilds.cache.size,
      userCount: client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0),
      uptime: Math.floor(process.uptime()),
      commands: client.commands.size,
      connected: true,
    }

    const topServers = client.guilds.cache
      .sort((a, b) => b.memberCount - a.memberCount)
      .first(3)
      .map((guild) => ({
        id: guild.id,
        name: guild.name,
        icon: guild.iconURL({ extension: "png", size: 128 }) || null,
        memberCount: guild.memberCount,
      }))

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
