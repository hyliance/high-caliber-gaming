import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Authenticated but no gamerTag → must complete onboarding
    if (token && !token.gamerTag && pathname !== "/onboarding") {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    // Already has gamerTag → skip onboarding
    if (token && token.gamerTag && pathname === "/onboarding") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Only run middleware for authenticated users; redirect others to /login
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/ladders/:path*",
    "/tournaments/:path*",
    "/coaching/:path*",
    "/wallet/:path*",
    "/wager/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/feed/:path*",
    "/clans/:path*",
    "/leagues/:path*",
    "/matches/:path*",
    "/messages/:path*",
    "/communities/:path*",
    "/organizations/:path*",
    "/admin/:path*",
    "/onboarding",
  ],
};
