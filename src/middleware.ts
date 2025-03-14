import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import * as jose from "jose";

// Initialize Supabase client for API routes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();

    // Determine if this is an API route or page route
    if (
        req.nextUrl.pathname.startsWith("/api/") &&
        !req.nextUrl.pathname.startsWith("/api/public/")
    ) {
        return handleApiMiddleware(req);
    } else {
        return handlePageMiddleware(req, res);
    }
}

// Page routing middleware - handles auth redirects for pages
async function handlePageMiddleware(req: NextRequest, res: NextResponse) {
    const supabase = createMiddlewareClient({ req, res });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    // If there's no session and the user is trying to access protected routes
    if (!session && req.nextUrl.pathname === "/") {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = "/auth/login";
        return NextResponse.redirect(redirectUrl);
    }

    // If there's a session and the user is trying to access auth pages
    if (session && req.nextUrl.pathname.startsWith("/auth/")) {
        const redirectUrl = req.nextUrl.clone();
        redirectUrl.pathname = "/";
        return NextResponse.redirect(redirectUrl);
    }

    return res;
}

// API middleware - handles JWT verification for API routes
async function handleApiMiddleware(req: NextRequest) {
    // Get the authorization header
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json(
            { error: "Missing or invalid authorization header" },
            { status: 401 }
        );
    }

    // Extract JWT
    const token = authHeader.split(" ")[1];

    try {
        // Manually decode the token to get the user ID
        // This is a safer approach than relying on external JWKS endpoints
        const decodedToken = jose.decodeJwt(token);

        if (!decodedToken || !decodedToken.sub) {
            throw new Error("Invalid token format or missing user ID");
        }

        // Create a new request with the user info
        const requestHeaders = new Headers(req.headers);
        requestHeaders.set("x-user-id", decodedToken.sub);

        // Optional: Add roles or other auth data
        if (typeof decodedToken.role === "string") {
            requestHeaders.set("x-user-role", decodedToken.role);
        }

        // Verify the token using Supabase's auth API
        const { error } = await supabase.auth.getUser(token);

        if (error) {
            throw new Error("Token validation failed");
        }

        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    } catch (error) {
        console.error("JWT verification failed:", error);
        return NextResponse.json(
            { error: "Invalid or expired token" },
            { status: 401 }
        );
    }
}

// Specify which routes to run the middleware on
export const config = {
    matcher: [
        "/",
        "/auth/:path*",
        "/api/((?!public/).*)", // All API routes except those starting with /api/public/
    ],
};
