import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAuthUser } from "@/lib/auth";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
    const user = await getAuthUser();

    try {
        const { data, error } = await supabase
            .from("log_stats")
            .select("*")
            .order("processed_at", { ascending: false });

        if (error) throw error;
        return NextResponse.json(data);
    } catch (error) {
        if (error instanceof Error && error.message.includes("Unauthorized")) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }
        console.error("Error fetching stats:", error);
        return NextResponse.json(
            { error: "Failed to fetch stats" },
            { status: 500 }
        );
    }
}
