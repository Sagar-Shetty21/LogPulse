import { QueueEvents } from "bullmq";
import { WebSocket } from "ws";

// Track connected clients
const clients = new Set<WebSocket>();

// Setup queue events
const queueEvents = new QueueEvents("log-processing", {
    connection: {
        host: process.env.REDIS_HOST || "localhost",
        port: parseInt(process.env.REDIS_PORT || "6379"),
        password: process.env.REDIS_PASSWORD,
    },
});

// Broadcast message to all connected clients
function broadcast(message: string) {
    for (const client of clients) {
        if (client.readyState === client.OPEN) {
            client.send(message);
        }
    }
}

// Initialize queue event listeners
function initQueueEvents() {
    // Listen for job progress events
    queueEvents.on("progress", ({ jobId, data }) => {
        const message = JSON.stringify({
            type: "progress",
            jobId,
            progress: data,
        });
        broadcast(message);
    });

    // Listen for job completion events
    queueEvents.on("completed", ({ jobId, returnvalue }) => {
        const message = JSON.stringify({
            type: "completed",
            jobId,
            result: returnvalue,
        });
        broadcast(message);
    });
}

// Initialize the queue events
initQueueEvents();

// This is the handler that next-ws will use
export function SOCKET(
    client: WebSocket,
    request: import("http").IncomingMessage,
    server: import("ws").WebSocketServer
) {
    // Add this client to our set of connected clients
    clients.add(client);
    console.log("Client connected");

    // Handle client disconnection
    client.on("close", () => {
        clients.delete(client);
        console.log("Client disconnected");
    });
}
