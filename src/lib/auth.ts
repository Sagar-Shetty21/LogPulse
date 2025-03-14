import { headers } from "next/headers";

export async function getAuthUser() {
    const headersList = await headers();
    const userId = headersList.get("x-user-id");

    if (!userId) {
        throw new Error("Unauthorized: User not authenticated");
    }

    return {
        id: userId,
        role: headersList.get("x-user-role") || "authenticated",
    };
}
