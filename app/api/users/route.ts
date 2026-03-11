import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const UpdateProfileSchema = z.object({
  displayName: z.string().min(2).max(32).optional(),
  bio: z.string().max(500).optional(),
  country: z.string().length(2).optional(),
  privacyShowWinnings: z.boolean().optional(),
  privacyShowWagerHistory: z.boolean().optional(),
  privacyOnlineStatus: z.boolean().optional(),
  allowMessages: z.enum(["EVERYONE", "FOLLOWERS", "NOBODY"]).optional(),
});

/**
 * GET /api/users
 * Search / list users (admin or public limited)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") ?? "";
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 50);
    const skip = (page - 1) * limit;

    const where = q
      ? {
          OR: [
            { gamerTag: { contains: q, mode: "insensitive" as const } },
            { email: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        select: {
          id: true,
          gamerTag: true,
          displayName: true,
          avatarUrl: true,
          country: true,
          globalRole: true,
          isVerified: true,
          isBanned: true,
          tier: true,
          createdAt: true,
          lastActiveAt: true,
          _count: { select: { followers: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.user.count({ where }),
    ]);

    return NextResponse.json({
      users,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[GET /api/users]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * PATCH /api/users
 * Update own profile fields
 */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = UpdateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }

    const userId = (session.user as any).id as string;
    const data = parsed.data;

    const updated = await db.user.update({
      where: { id: userId },
      data: {
        ...(data.displayName !== undefined && { displayName: data.displayName }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.country !== undefined && { country: data.country }),
        ...(data.privacyShowWinnings !== undefined && { privacyShowWinnings: data.privacyShowWinnings }),
        ...(data.privacyShowWagerHistory !== undefined && { privacyShowWagerHistory: data.privacyShowWagerHistory }),
        ...(data.privacyOnlineStatus !== undefined && { privacyOnlineStatus: data.privacyOnlineStatus }),
        ...(data.allowMessages !== undefined && { allowMessages: data.allowMessages }),
      },
      select: {
        id: true,
        gamerTag: true,
        displayName: true,
        bio: true,
        country: true,
        privacyShowWinnings: true,
        privacyShowWagerHistory: true,
        privacyOnlineStatus: true,
        allowMessages: true,
      },
    });

    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error("[PATCH /api/users]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
