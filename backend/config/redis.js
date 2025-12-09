const Redis = require("ioredis");

// Create a redis client
const redisClient = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,

    retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
    }
});

// Event listeners
redisClient.on("connect", () => {
    console.log("Redis connected!");
});

redisClient.on("error", (e) => {
    console.log("Redis error: ", e);
});

module.exports = redisClient;