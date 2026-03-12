import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

const GAMERTAG_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;

// GET /api/onboarding?tag=xxx — check availability
export async function GET(req: NextRequest) {
  const tag = new URL(req.url).searchParams.get("tag");

  if (!tag || !GAMERTAG_REGEX.test(tag)) {
    return NextResponse.json({ available: false });
  }

  const existing = await db.user.findUnique({
    where: { gamerTag: tag },
    select: { id: true },
  });

  return NextResponse.json({ available: !existing });
}

// POST /api/onboarding — save gamerTag for the current user
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { gamerTag } = body;

  if (!gamerTag || !GAMERTAG_REGEX.test(gamerTag)) {
    return NextResponse.json(
      { error: "Invalid gamer tag. Use 3–20 characters: letters, numbers, _ or -." },
      { status: 400 }
    );
  }

  // Double-check uniqueness (availability check is optimistic, this is the source of truth)
  const existing = await db.user.findUnique({
    where: { gamerTag },
    select: { id: true },
  });

  if (existing) {
    return NextResponse.json({ error: "Gamer tag already taken." }, { status: 409 });
  }

  await db.user.update({
    where: { id: session.user.id },
    data: { gamerTag },
  });

  return NextResponse.json({ success: true });
}
