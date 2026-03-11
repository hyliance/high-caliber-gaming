import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

/**
 * GET /api/ladders
 * List all ladders with optional game filter and pagination
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const gameId = searchParams.get("gameId");
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 100);
    const skip = (page - 1) * limit;
    const includeSeason = searchParams.get("season") === "current";

    const where = gameId ? { gameTitleId: gameId } : {};

    const [ladders, total] = await Promise.all([
      db.ladder.findMany({
        where,
        include: {
          gameTitle: { select: { id: true, title: true, iconUrl: true } },
          currentSeason: includeSeason
            ? {
                include: {
                  entries: {
                    orderBy: { points: "desc" },
                    take: 10,
                    include: {
                      user: {
                        select: {
                          id: true,
                          gamerTag: true,
                          displayName: true,
                          avatarUrl: true,
                          tier: true,
                          isVerified: true,
                        },
                      },
                    },
                  },
                },
              }
            : false,
          _count: { select: { seasons: true } },
        },
        orderBy: { createdAt: "asc" },
        skip,
        take: limit,
      }),
      db.ladder.count({ where }),
    ]);

    return NextResponse.json({
      ladders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[GET /api/ladders]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/ladders/:id/enter
 * Handled via /api/ladders/[id]/enter — this endpoint is a placeholder
 * for listing only. Ladder entry is at /api/ladders/[id]/enter
 */
export async function POST(req: NextRequest) {
  return NextResponse.json({ error: "Use /api/ladders/[id]/enter to join a ladder" }, { status: 400 });
}
