// app/api/queue-status/route.ts
import { logQueue } from "@/lib/queue";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
    try {
        const [waiting, active, completed, failed] = await Promise.all([
            logQueue.getWaitingCount(),
            logQueue.getActiveCount(),
            logQueue.getCompletedCount(),
            logQueue.getFailedCount(),
        ]);

        return NextResponse.json(
            {
                waiting,
                active,
                completed,
                failed,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch queue status" },
            { status: 500 }
        );
    }
}
