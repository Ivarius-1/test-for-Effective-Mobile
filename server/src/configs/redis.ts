import { createClient } from "redis";

export const redis = createClient({
    url: process.env.REDIS_URL!
})

redis.on('connect', () => {
    console.log('Redis started')
})

redis.on('error', (e: Error) => {
    console.error(`Redis error: ${e}`)
})

await redis.connect()