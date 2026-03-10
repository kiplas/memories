import Redis from "ioredis";

if (!process.env.REDIS_URL) throw new Error("Redis url was not provided");

export const redis = new Redis(process.env.REDIS_URL);
