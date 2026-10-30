import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const hasAuthenticationConfiguration = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY,
);

export default hasAuthenticationConfiguration
  ? clerkMiddleware()
  : function setupPending(request: NextRequest) {
      if (request.method !== "GET" && request.method !== "HEAD") {
        return NextResponse.json(
          { error: "Authentication service is not configured yet.", code: "AUTH_NOT_CONFIGURED" },
          { status: 503 },
        );
      }
      return NextResponse.next();
    };

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
