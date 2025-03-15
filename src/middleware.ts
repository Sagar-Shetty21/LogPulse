import { NextRequest, NextResponse } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import * as jose from "jose";

// Initialize Supabase client for API routes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Store rate limit data in memory
const rateLimitStore = new Map();

async function checkRateLimit(identifier: string) {
    const MAX_REQUESTS = 3;
    const WINDOW_SIZE = 60; // seconds
    const now = Date.now();

    // Get existing data or create new entry
    const data = rateLimitStore.get(identifier) || { count: 0, timestamp: now };

    // Reset if window has passed
    if ((now - data.timestamp) / 1000 > WINDOW_SIZE) {
        console.log(`Rate limit window reset for ${identifier}`);
        data.count = 0;
        data.timestamp = now;
    }

    // Increment count
    data.count++;

    console.log(`Request ${data.count}/${MAX_REQUESTS} for ${identifier}`);

    // Store updated data
    rateLimitStore.set(identifier, data);

    const isLimited = data.count > MAX_REQUESTS;
    console.log(`Rate limited: ${isLimited}`);

    return {
        limited: isLimited,
        remaining: Math.max(0, MAX_REQUESTS - data.count),
        reset: Math.floor(data.timestamp / 1000) + WINDOW_SIZE,
    };
}

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
    // Get client IP address for rate limiting
    const clientIp =
        req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    console.log(`Request from IP: ${clientIp}`);

    // Check rate limit
    const rateLimit = await checkRateLimit(clientIp);

    if (rateLimit.limited) {
        console.log(`Rate limit exceeded for ${clientIp}`);
        return NextResponse.json(
            { error: "Rate limit exceeded. Please try again later." },
            {
                status: 429,
                headers: {
                    "Retry-After": String(
                        rateLimit.reset - Math.floor(Date.now() / 1000)
                    ),
                    "X-RateLimit-Limit": String(3),
                    "X-RateLimit-Remaining": String(rateLimit.remaining),
                    "X-RateLimit-Reset": String(rateLimit.reset),
                },
            }
        );
    }

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
