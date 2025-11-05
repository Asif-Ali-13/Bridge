import Bull from "bull";

export const redisConfig = {
    redis: {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: parseInt(process.env.REDIS_PORT || "6379", 10),
        password: process.env.REDIS_PASSWORD || "",
    },
};

export const bridgeQueue = new Bull("bridgeQueue", redisConfig);

bridgeQueue.on('error', (err) => console.error('Queue error:', err));
bridgeQueue.on('waiting', (jobId) => console.log('Job waiting:', jobId));
bridgeQueue.on('completed', (job) => console.log('Job completed:', job.id));
