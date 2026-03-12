import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";

const handler = NextAuth(authOptions);

// On Vercel, req.url contains the deployment-specific URL
// (e.g. high-caliber-gaming-abc123.vercel.app) even when the user
// visited the stable alias (high-caliber-gaming.vercel.app).
// NextAuth v4 uses req.url to build OAuth callback URIs, so both
// the sign-in initiation AND the token exchange must use the same
// canonical host — otherwise Google rejects the code exchange.
const CANONICAL_HOST = "high-caliber-gaming.vercel.app";

function withCanonicalUrl(req: NextRequest): NextRequest {
  if (!process.env["VERCEL"]) return req;
  const url = new URL(req.url);
  if (url.host === CANONICAL_HOST) return req;
  url.host = CANONICAL_HOST;
  url.protocol = "https:";
  return new NextRequest(url, req);
}

export async function GET(req: NextRequest, ctx: any) {
  return handler(withCanonicalUrl(req), ctx);
}

export async function POST(req: NextRequest, ctx: any) {
  return handler(withCanonicalUrl(req), ctx);
}
