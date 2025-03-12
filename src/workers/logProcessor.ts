import { Job } from 'bullmq';
import { supabaseAdmin } from '../lib/supabase';
import axios from "axios";
import readline from 'readline';
import { Readable } from 'stream';

interface LogJob {
  fileUrl: string;
  fileId: string;
  userId: string;
  timestamp: string;
}

// Keywords to track (loaded from .env)
const TRACKED_KEYWORDS = process.env.WATCH_KEYWORDS?.split(",") || [];

export async function processLogFile(job: Job<LogJob>) {
  const { fileUrl, fileId, userId, timestamp } = job.data;
  // console.log(`Processing log file from URL: ${fileUrl}`);

  let totalLines = 0;
  let errorCount = 0;
  const errors: Array<{ timestamp: string; message: string; details?: any }> = [];
  const keywords: Array<{ keyword: string; timestamp: string; details?: any }> = [];
  const ipSet = new Set<string>();

  try {
    // Download the file from the Supabase Storage URL
    const response = await axios.get(fileUrl, { responseType: "stream" });

    // Create a readable stream from the response
    const fileStream = response.data as Readable;
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    for await (const line of rl) {
      totalLines++;

      // Match log format: [TIMESTAMP] LEVEL MESSAGE {JSON payload}
      const logRegex = /^\[(.*?)\] (\w+) (.*?) (\{.*\})?$/;
      const match = line.match(logRegex);

      if (match) {
        const [, logTimestamp, level, message, jsonPayload] = match;
        let details = null;

        try {
          details = jsonPayload ? JSON.parse(jsonPayload) : null;
          if (details?.ip) ipSet.add(details.ip); // Track unique IPs
        } catch (error) {
          console.log("Invalid JSON in log:", error);
          console.warn("Invalid JSON in log:", jsonPayload);
        }

        // Store errors
        if (level === "ERROR") {
          errorCount++;
          errors.push({ timestamp: logTimestamp, message, details });
        }

        // Store tracked keywords
        TRACKED_KEYWORDS.forEach((keyword) => {
          if (message.includes(keyword)) {
            keywords.push({ keyword, timestamp: logTimestamp, details });
          }
        });
      }
    }

    // Insert processed log data into Supabase
    const { error } = await supabaseAdmin.from("log_stats").insert([
      {
        job_id: job.id,
        file_id: fileId,
        user_id: userId,
        job_created_at: timestamp,
        processed_at: new Date().toISOString(),
        total_lines: totalLines,
        error_count: errorCount,
        errors,
        keywords,
        ips: Array.from(ipSet), // Convert Set to array
        status: "completed",
      },
    ]);

    if (error) {
      throw new Error(`Supabase Insert Error: ${error.message}`);
    }

    // console.log(`File processed successfully: ${fileUrl}`);
  } catch (err) {
    console.error("Error processing log file:", err);

    // Mark job as failed in Supabase
    await supabaseAdmin.from("log_stats").insert([
      {
        job_id: job.id,
        file_id: fileId,
        user_id: userId,
        job_created_at: timestamp,
        status: "failed",
      },
    ]);

    throw err; // Rethrow to allow BullMQ retry mechanism
  }
} 