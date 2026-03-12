import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

/**
 * Debug endpoint — remove before public launch.
 * Visit /api/debug-session to see your JWT session + DB record.
 */
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated", session: null }, { status: 401 });
  }

  const dbUser = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      gamerTag: true,
      globalRole: true,
      email: true,
      createdAt: true,
    },
  }).catch((e) => ({ error: String(e) }));

  return NextResponse.json({
    session: {
      id: session.user.id,
      gamerTag: session.user.gamerTag,
      globalRole: session.user.globalRole,
      name: session.user.name,
      email: session.user.email,
    },
    dbUser,
  });
}
