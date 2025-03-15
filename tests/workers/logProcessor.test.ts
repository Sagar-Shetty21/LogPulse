import { Job } from "bullmq";
import * as supabase from "@/lib/supabase";
import axios from "axios";
import { Readable } from "stream";
import { processLogFile } from "@/workers/logProcessor";

// Mock dependencies
jest.mock("axios");
jest.mock("@/lib/supabase", () => ({
    supabaseAdmin: {
        from: jest.fn().mockReturnThis(),
        insert: jest.fn().mockResolvedValue({ error: null }),
    },
}));

// Helper to create a readable stream from text content
function createReadableStream(content: string): Readable {
    const stream = new Readable();
    stream.push(content);
    stream.push(null);
    return stream;
}

describe("processLogFile worker", () => {
    let mockJob: any;

    beforeEach(() => {
        jest.clearAllMocks();

        // Setup mock job
        mockJob = {
            id: "123",
            data: {
                fileUrl: "https://example.com/logs/file.log",
                fileId: "file-123",
                userId: "user-123",
                timestamp: "2025-03-14T12:00:00Z",
            },
            updateProgress: jest.fn().mockResolvedValue(undefined),
        };

        // Set environment variable for tracked keywords
        process.env.WATCH_KEYWORDS = "error,warning";
    });

    test("should process a log file successfully", async () => {
        // Mock valid log file content
        const logContent = `[2025-03-14T12:01:00Z] INFO User logged in {"userId": "user-456", "ip": "192.168.1.1"}\n[2025-03-14T12:02:00Z] ERROR Database error {"service": "db", "ip": "10.0.0.1"}`;

        (axios.get as jest.Mock).mockResolvedValue({
            data: createReadableStream(logContent),
        });

        await processLogFile(mockJob as unknown as Job<any>);

        // Verify file was processed and data was inserted
        expect(supabase.supabaseAdmin.from).toHaveBeenCalledWith("log_stats");
        expect(
            supabase.supabaseAdmin.from("log_stats").insert
        ).toHaveBeenCalledWith([
            expect.objectContaining({
                job_id: "123",
                file_id: "file-123",
                user_id: "user-123",
                keywords: [],
                total_lines: 2,
                error_count: 1,
                errors: [
                    {
                        timestamp: "2025-03-14T12:02:00Z",
                        message: "Database error",
                        details: { service: "db", ip: "10.0.0.1" },
                    },
                ],
                status: "completed",
                ips: ["192.168.1.1", "10.0.0.1"],
                job_created_at: expect.any(String),
                processed_at: expect.any(String),
            }),
        ]);

        // Verify job progress was updated
        expect(mockJob.updateProgress).toHaveBeenCalled();
    });

    test("should handle download errors", async () => {
        // Mock axios to throw an error
        (axios.get as jest.Mock).mockRejectedValue(new Error("Network error"));

        await expect(
            processLogFile(mockJob as unknown as Job<any>)
        ).rejects.toThrow("Network error");

        // Verify error was recorded in database
        expect(
            supabase.supabaseAdmin.from("log_stats").insert
        ).toHaveBeenCalledWith([
            expect.objectContaining({
                job_id: "123",
                file_id: "file-123",
                user_id: "user-123",
                status: "failed",
            }),
        ]);
    });
});
