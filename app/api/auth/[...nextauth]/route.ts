import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Force the correct URL on Vercel — VERCEL_URL is deployment-specific
// and would break OAuth callbacks without this override.
if (process.env.VERCEL) {
  process.env.NEXTAUTH_URL = "https://high-caliber-gaming.vercel.app";
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
