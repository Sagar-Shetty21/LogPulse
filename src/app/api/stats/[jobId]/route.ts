// app/api/jobs/[jobId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
    request: NextRequest,
    { params }: { params: { jobId: string } }
) {
    const jobId = params.jobId;

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
        console.error("Error fetching job stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch job stats" },
            { status: 500 }
        );
    }
}
