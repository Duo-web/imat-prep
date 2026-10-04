import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Protect these routes — redirect to /login if not authenticated.
// Note: Next.js matcher /quiz/:path* only matches SUB-paths of /quiz,
// not /quiz itself. Both patterns are needed to cover the quiz setup page.
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/quiz",           // quiz setup page
    "/quiz/:path*",    // individual quiz sessions
    "/simulator/:path*",
    "/planner/:path*",
  ],
};
