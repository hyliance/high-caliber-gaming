import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";
import { MatchStatus } from "@prisma/client";

const CreateMatchSchema = z.object({
  gameTitleId: z.string().cuid(),
  gameModeId: z.string().cuid(),
  teamSize: z.number().int().min(1).max(5),
  bestOf: z.number().int().min(1).max(7),
  wagerAmountCents: z.number().int().min(0).optional(),
  scheduledAt: z.string().datetime().optional(),
  rules: z.string().max(2000).optional(),
});

const SubmitResultSchema = z.object({
  matchId: z.string().cuid(),
  reporterScore: z.number().int().min(0),
  opponentScore: z.number().int().min(0),
  proofUrl: z.string().url().optional(),
});

/**
 * GET /api/matches
 * List matches for the authenticated user (history + open challenges)
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status") as MatchStatus | null;
    const gameId = searchParams.get("gameId");
    const page = parseInt(searchParams.get("page") ?? "1", 10);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "20", 10), 50);
    const skip = (page - 1) * limit;
    const userId = (session.user as any).id as string;

    const where: any = {
      OR: [
        { challengerId: userId },
        { challengedId: userId },
      ],
    };

    if (statusFilter) where.status = statusFilter;
    if (gameId) where.gameTitleId = gameId;

    const [matches, total] = await Promise.all([
      db.match.findMany({
        where,
        include: {
          gameTitle: { select: { id: true, title: true, iconUrl: true } },
          gameMode: { select: { id: true, name: true, teamSize: true } },
          challenger: {
            select: {
              id: true,
              gamerTag: true,
              displayName: true,
              avatarUrl: true,
              tier: true,
            },
          },
          challenged: {
            select: {
              id: true,
              gamerTag: true,
              displayName: true,
              avatarUrl: true,
              tier: true,
            },
          },
          wager: { select: { id: true, amountCents: true, status: true } },
          _count: { select: { reports: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      db.match.count({ where }),
    ]);

    return NextResponse.json({
      matches,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[GET /api/matches]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/matches
 * Create a new match challenge
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = CreateMatchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }

    const userId = (session.user as any).id as string;
    const { gameTitleId, gameModeId, teamSize, bestOf, wagerAmountCents, scheduledAt, rules } = parsed.data;

    // Verify game mode belongs to game title
    const gameMode = await db.gameMode.findFirst({
      where: { id: gameModeId, gameTitleId },
    });
    if (!gameMode) {
      return NextResponse.json({ error: "Invalid game mode for this title" }, { status: 400 });
    }

    // If wager, verify user has sufficient balance and KYC
    if (wagerAmountCents && wagerAmountCents > 0) {
      const user = await db.user.findUnique({
        where: { id: userId },
        include: { wallet: true },
      });

      if (!user?.isKycVerified) {
        return NextResponse.json({ error: "KYC verification required for wagered matches" }, { status: 403 });
      }

      if (!user.wallet || user.wallet.balanceCents < wagerAmountCents) {
        return NextResponse.json({ error: "Insufficient wallet balance" }, { status: 400 });
      }
    }

    // Create the match
    const match = await db.match.create({
      data: {
        challengerId: userId,
        gameTitleId,
        gameModeId,
        teamSize,
        bestOf,
        rules: rules ?? null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        status: "OPEN",
      },
      include: {
        gameTitle: { select: { id: true, title: true } },
        gameMode: { select: { id: true, name: true } },
        challenger: { select: { id: true, gamerTag: true, displayName: true, avatarUrl: true } },
      },
    });

    // Create wager if amount provided
    if (wagerAmountCents && wagerAmountCents > 0) {
      await db.wager.create({
        data: {
          matchId: match.id,
          challengerId: userId,
          amountCents: wagerAmountCents,
          status: "PENDING",
        },
      });
    }

    // Notify potential challengers via notification (simplified — in prod would use Socket.IO)
    await db.notification.create({
      data: {
        userId,
        type: "MATCH_CHALLENGE",
        title: "Match created",
        body: `Your ${gameMode.name} challenge is now live and open for opponents.`,
        relatedId: match.id,
      },
    });

    return NextResponse.json({ match }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/matches]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
