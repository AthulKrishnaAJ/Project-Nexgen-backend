import { createClient, RedisClientType } from "redis";

let redisClient: RedisClientType = createClient({
  socket: {
    host: process.env.REDIS_SOCKET_HOST || '127.0.0.1',
    port: process.env.REDIS_SOCKET_PORT ? parseInt(process.env.REDIS_SOCKET_PORT) : 6379
  },
});

redisClient.on("error", (err) => {
  console.error("Redis client error", err);
});

redisClient.connect();

export default redisClient;