import { createClient } from "redis";

const redisClient = createClient({ url: process.env.REDIS_URL! });

redisClient.on("error", (err) => console.error("Redis Client Error:", err));
redisClient.on("connect", () => console.log("✅ Redis connection successful"));
redisClient.connect().catch(console.error);

export default redisClient;