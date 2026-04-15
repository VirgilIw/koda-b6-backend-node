import { createClient } from "redis";

export const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
  password: process.env.REDIS_PASSWORD || undefined,
});

// handle runtime error
redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});

try {
  await redisClient.connect();
  console.log("Redis connected");
} catch (err) {
  console.error("Failed to connect Redis:", err);
}