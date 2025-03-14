import { Queue, Worker } from "bullmq";
import { processLogFile } from "../workers/logProcessor";
import { Server } from "socket.io";

const connection = {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || "6379"),
    password: process.env.REDIS_PASSWORD,
};

export const logQueue = new Queue("log-processing", {
    connection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 1000,
        },
    },
});

// Initialize worker with concurrency of 4
const worker = new Worker("log-processing", processLogFile, {
    connection,
    concurrency: 4, // Process 4 jobs concurrently
    limiter: {
        max: 100, // Optional: limit to 100 jobs
        duration: 1000, // per second
    },
});

worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed:`, err);
});

export async function addLogJob(
    fileUrl: string,
    fileId: string,
    userId: string
) {
    return await logQueue.add("process-log", {
        fileUrl,
        fileId,
        userId,
        timestamp: new Date().toISOString(),
    });
}

export function setupQueueEvents(io: Server) {
    logQueue.on("progress", ({ jobId, data }) => {
        io.emit(`job-progress:${jobId}`, data);
    });
}
