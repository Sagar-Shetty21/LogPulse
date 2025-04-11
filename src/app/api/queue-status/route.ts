// app/api/queue-status/route.ts
import { getAuthUser } from "@/lib/auth";
import { logQueue } from "@/lib/queue";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
    try {
        const user = await getAuthUser();

        // Get all jobs from different states
        const [waitingJobs, activeJobs, completedJobs, failedJobs] =
            await Promise.all([
                logQueue.getJobs(["waiting"]),
                logQueue.getJobs(["active"]),
                logQueue.getJobs(["completed"]),
                logQueue.getJobs(["failed"]),
            ]);

        // Filter jobs by current user's ID
        const filterByUserId = (jobs: any[]) => {
            return jobs.filter((job) => job.data.userId === user.id);
        };

        const userWaitingJobs = filterByUserId(waitingJobs);
        const userActiveJobs = filterByUserId(activeJobs);
        const userCompletedJobs = filterByUserId(completedJobs);
        const userFailedJobs = filterByUserId(failedJobs);

        return NextResponse.json(
            {
                waiting: userWaitingJobs.length,
                active: userActiveJobs.length,
                completed: userCompletedJobs.length,
                failed: userFailedJobs.length,
            },
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof Error && error.message.includes("Unauthorized")) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        return NextResponse.json(
            { error: "Failed to fetch queue status" },
            { status: 500 }
        );
    }
}
