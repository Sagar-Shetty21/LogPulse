// import { NextRequest } from "next/server";
// import { Readable } from "stream";
// import { POST } from "@/app/api/upload-logs/route";
// import { logQueue } from "@/lib/queue";
// import { supabaseAdmin } from "@/lib/supabase";
// import { getAuthUser } from "@/lib/auth";

// // Mock dependencies
// jest.mock("@/lib/queue", () => ({
//     logQueue: {
//         add: jest.fn().mockResolvedValue({ id: "mocked-job-id" }),
//     },
// }));

// jest.mock("@/lib/supabase", () => ({
//     supabaseAdmin: {
//         storage: {
//             from: jest.fn().mockReturnValue({
//                 upload: jest.fn(),
//                 createSignedUrl: jest.fn(),
//             }),
//         },
//     },
// }));

// jest.mock("@/lib/auth", () => ({
//     getAuthUser: jest.fn(),
// }));

// describe("/api/upload-logs endpoint", () => {
//     const mockUser = { id: "test-user-id" };
//     const mockFileContent = "test log content";
//     const mockFileBuffer = Buffer.from(mockFileContent);

//     beforeEach(() => {
//         // Reset mock implementations before each test
//         jest.resetAllMocks();

//         // Setup default mock implementations
//         (getAuthUser as jest.Mock).mockResolvedValue(mockUser);

//         const mockStorageFrom = supabaseAdmin.storage.from as jest.Mock;
//         mockStorageFrom.mockReturnValue({
//             upload: jest.fn().mockResolvedValue({
//                 data: { path: "logs/mocked-file.log" },
//                 error: null,
//             }),
//             createSignedUrl: jest.fn().mockResolvedValue({
//                 data: { signedUrl: "https://example.com/signed-url" },
//                 error: null,
//             }),
//         });
//     });

//     afterEach(() => {
//         jest.clearAllMocks();
//     });

//     it("should successfully process log file upload and queue job", async () => {
//         // Create request with readable stream body
//         const stream = Readable.from([mockFileBuffer]);
//         const req = new NextRequest("http://localhost/api/upload-logs", {
//             method: "POST",
//             body: stream as any,
//         });

//         // Execute the endpoint handler
//         const response = await POST(req);
//         const responseBody = await response.json();

//         // Verify response
//         expect(responseBody).toHaveProperty("jobId", "mocked-job-id");
//         expect(response.status).toBe(200);
//         expect(responseBody).toHaveProperty(
//             "fileUrl",
//             "https://example.com/signed-url"
//         );

//         // Verify Supabase storage upload was called
//         const mockUpload = (supabaseAdmin.storage.from("log_stats") as any)
//             .upload;
//         expect(mockUpload).toHaveBeenCalledTimes(1);
//         expect(mockUpload.mock.calls[0][1]).toEqual(mockFileBuffer);
//         expect(mockUpload.mock.calls[0][2]).toEqual({
//             contentType: "text/plain",
//         });

//         // Verify signed URL was requested
//         const mockCreateSignedUrl = (
//             supabaseAdmin.storage.from("log_stats") as any
//         ).createSignedUrl;
//         expect(mockCreateSignedUrl).toHaveBeenCalledTimes(1);
//         expect(mockCreateSignedUrl.mock.calls[0][1]).toBe(60 * 60 * 24); // 24 hours

//         // Verify job was added to queue with correct parameters
//         expect(logQueue.add).toHaveBeenCalledTimes(1);
//         expect((logQueue.add as jest.Mock).mock.calls[0][0]).toBe(
//             "process-log"
//         );

//         const jobData = (logQueue.add as jest.Mock).mock.calls[0][1];
//         expect(jobData).toHaveProperty(
//             "fileUrl",
//             "https://example.com/signed-url"
//         );
//         expect(jobData).toHaveProperty("userId", "test-user-id");
//         expect(jobData).toHaveProperty("fileSize", mockFileBuffer.length);
//         expect(jobData).toHaveProperty("fileId");
//         expect(jobData).toHaveProperty("timestamp");

//         // Verify priority was set correctly (small file)
//         const jobOptions = (logQueue.add as jest.Mock).mock.calls[0][2];
//         expect(jobOptions).toHaveProperty("priority", 1);
//     });

//     it("should return 400 if request has no body", async () => {
//         // Create request with no body
//         const req = new NextRequest("http://localhost/api/upload-logs", {
//             method: "POST",
//             body: null,
//         });

//         const response = await POST(req);
//         const responseBody = await response.json();

//         expect(response.status).toBe(400);
//         expect(responseBody).toHaveProperty("error", "No request body");
//     });

//     it("should return 401 if user is unauthorized", async () => {
//         // Mock auth error
//         (getAuthUser as jest.Mock).mockRejectedValueOnce(
//             new Error("Unauthorized")
//         );

//         const stream = Readable.from([mockFileBuffer]);
//         const req = new NextRequest("http://localhost/api/upload-logs", {
//             method: "POST",
//             body: stream as any,
//         });

//         const response = await POST(req);
//         const responseBody = await response.json();

//         expect(response.status).toBe(401);
//         expect(responseBody).toHaveProperty("error", "Unauthorized");
//     });

//     it("should handle Supabase upload errors", async () => {
//         // Mock Supabase upload error
//         const mockStorageFrom = supabaseAdmin.storage.from as jest.Mock;
//         mockStorageFrom.mockReturnValueOnce({
//             upload: jest.fn().mockResolvedValue({
//                 data: null,
//                 error: { message: "Storage quota exceeded" },
//             }),
//             createSignedUrl: jest.fn(),
//         });

//         const stream = Readable.from([mockFileBuffer]);
//         const req = new NextRequest("http://localhost/api/upload-logs", {
//             method: "POST",
//             body: stream as any,
//         });

//         const response = await POST(req);
//         const responseBody = await response.json();

//         expect(response.status).toBe(500);
//         expect(responseBody).toHaveProperty(
//             "error",
//             "Supabase Storage Upload Error: Storage quota exceeded"
//         );
//     });

//     it("should handle signed URL generation errors", async () => {
//         // Mock successful upload but failed signed URL generation
//         const mockStorageFrom = supabaseAdmin.storage.from as jest.Mock;
//         mockStorageFrom.mockReturnValueOnce({
//             upload: jest.fn().mockResolvedValue({
//                 data: { path: "logs/mocked-file.log" },
//                 error: null,
//             }),
//             createSignedUrl: jest.fn().mockResolvedValue({
//                 data: null,
//                 error: { message: "URL generation failed" },
//             }),
//         });

//         const stream = Readable.from([mockFileBuffer]);
//         const req = new NextRequest("http://localhost/api/upload-logs", {
//             method: "POST",
//             body: stream as any,
//         });

//         const response = await POST(req);
//         const responseBody = await response.json();

//         expect(response.status).toBe(500);
//         expect(responseBody).toHaveProperty(
//             "error",
//             "Failed to generate signed URL from Supabase."
//         );
//     });

//     it("should set correct priority based on file size", async () => {
//         // Create a large file (over 1MB)
//         const largeContent = Buffer.alloc(1024 * 1024 + 1, "x");
//         const stream = Readable.from([largeContent]);

//         const req = new NextRequest("http://localhost/api/upload-logs", {
//             method: "POST",
//             body: stream as any,
//         });

//         await POST(req);

//         // Verify priority was set to 2 for large file
//         const jobOptions = (logQueue.add as jest.Mock).mock.calls[0][2];
//         expect(jobOptions).toHaveProperty("priority", 2);
//     });
// });
