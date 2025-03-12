import { logQueue } from '../../../lib/queue';
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { Readable } from 'stream';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  try {
    // Initialize Supabase with cookies
    const supabase = createRouteHandlerClient({ cookies });

    // Get the authenticated user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!req.body) {
      return NextResponse.json({ error: "No request body" }, { status: 400 });
    }

    // Generate unique file name
    const fileId = `log-${Date.now()}.log`;

    // Convert request body stream into a buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of Readable.from(req.body as unknown as AsyncIterable<Uint8Array>)) {
      chunks.push(chunk);
    }
    const fileBuffer = Buffer.concat(chunks);

    // Upload log file to Supabase Storage
    const { data, error: uploadError } = await supabaseAdmin.storage
      .from("logs")
      .upload(fileId, fileBuffer, { contentType: "text/plain" });

    if (uploadError) {
      throw new Error(`Supabase Storage Upload Error: ${uploadError.message}`);
    }

    // Generate a signed URL (valid for 24 hours)
    const { data: signedUrlData, error: signedUrlError } = await supabaseAdmin.storage
      .from("logs")
      .createSignedUrl(fileId, 60 * 60 * 24); // 24-hour expiration

    if (signedUrlError || !signedUrlData?.signedUrl) {
      console.log('err',signedUrlError)
      throw new Error("Failed to generate signed URL from Supabase.");
    }

    const fileUrl = signedUrlData.signedUrl;

    // Add job to BullMQ queue
    const job = await logQueue.add(
      "process-log",
      {
        fileUrl,
        fileId,
        userId: user.id,
        fileSize: fileBuffer.length,
        timestamp: new Date().toISOString(),
      },
      {
        priority: fileBuffer.length < 1024 * 1024 ? 1 : 2, // Higher priority for small files
      }
    );

    return NextResponse.json({ jobId: job.id, fileUrl }, { status: 200 });
  } catch (err: any) {
    console.error("Error uploading logs:", err);
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
}