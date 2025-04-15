// scripts/start-workers.ts
import { fork } from "child_process";
import path from "path";

// Start the worker cluster as a separate process
const workerProcess = fork(
    path.join(process.cwd(), "workers/clusterManager.ts"),
    [],
    {
        execArgv: ["-r", "ts-node/register"],
    }
);

workerProcess.on("message", (message) => {
    console.log("Message from worker cluster:", message);
});

workerProcess.on("exit", (code) => {
    console.log(`Worker cluster exited with code ${code}`);
});

console.log("Worker cluster started");

// Handle process termination
process.on("SIGINT", () => {
    console.log("Shutting down worker cluster...");
    workerProcess.kill();
    process.exit(0);
});

process.on("SIGTERM", () => {
    console.log("Shutting down worker cluster.");
    workerProcess.kill();
    process.exit(0);
});
