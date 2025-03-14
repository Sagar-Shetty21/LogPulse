// app/api/jobs/[jobId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ jobId: string }> }
) {
    const user = await getAuthUser();

    const { jobId } = await params;

    if (!jobId) {
        return NextResponse.json({ error: "Missing job ID" }, { status: 400 });
    }

    try {
        const { data, error } = await supabase
            .from("log_stats")
            .select("*")
            .eq("job_id", jobId)
            .single();

        if (error) throw error;
        if (!data) {
            return NextResponse.json(
                { error: "Job not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(data);
    } catch (error) {
        if (error instanceof Error && error.message.includes("Unauthorized")) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
        console.error("Error fetching job stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch job stats" },
            { status: 500 }
        );
    }
}
