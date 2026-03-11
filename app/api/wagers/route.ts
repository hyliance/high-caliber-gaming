import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = 20;

  const where: any = {
    OR: [
      { initiatorId: session.user.id },
      { receiverId: session.user.id },
    ],
  };
  if (status) where.status = status;

  const [wagers, total] = await Promise.all([
    db.wager.findMany({
      where,
      include: {
        initiator: { select: { gamerTag: true, avatarUrl: true } },
        receiver: { select: { gamerTag: true, avatarUrl: true } },
        match: { select: { status: true, player1Score: true, player2Score: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: (page - 1) * limit,
    }),
    db.wager.count({ where }),
  ]);

  return NextResponse.json({ wagers, total, page, pages: Math.ceil(total / limit) });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { receiverId, amountCents, matchConfig } = body;

  if (!receiverId || !amountCents || amountCents < 100) {
    return NextResponse.json({ error: "Invalid wager parameters" }, { status: 400 });
  }

  // Check initiator wallet balance
  const wallet = await db.wallet.findUnique({ where: { userId: session.user.id } });
  if (!wallet || wallet.balanceCents < amountCents) {
    return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
  }

  // Check KYC
  const initiator = await db.user.findUnique({ where: { id: session.user.id } });
  if (initiator?.kycStatus !== "VERIFIED") {
    return NextResponse.json({ error: "Identity verification required for wagering" }, { status: 403 });
  }

  // Check age
  if (!initiator.isAgeVerified) {
    return NextResponse.json({ error: "Age verification required for wagering" }, { status: 403 });
  }

  // Check receiver exists and not blocked
  const receiver = await db.user.findUnique({ where: { id: receiverId } });
  if (!receiver) {
    return NextResponse.json({ error: "Receiver not found" }, { status: 404 });
  }

  const block = await db.userBlock.findFirst({
    where: {
      OR: [
        { blockerId: session.user.id, blockedId: receiverId },
        { blockerId: receiverId, blockedId: session.user.id },
      ],
    },
  });
  if (block) {
    return NextResponse.json({ error: "Cannot wager with this player" }, { status: 403 });
  }

  // Check daily wager cap
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayWagers = await db.wager.aggregate({
    where: {
      initiatorId: session.user.id,
      createdAt: { gte: today },
      status: { notIn: ["CANCELLED", "REFUNDED"] },
    },
    _sum: { amountCents: true },
  });
  const todayTotal = (todayWagers._sum.amountCents ?? 0) + amountCents;
  if (todayTotal > wallet.dailyWagerCap) {
    return NextResponse.json({ error: "Daily wager cap exceeded" }, { status: 400 });
  }

  // Create match + wager in a transaction
  const result = await db.$transaction(async (tx) => {
    const match = await tx.match.create({
      data: {
        player1Id: session.user.id,
        player2Id: receiverId,
        isWager: true,
        status: "PENDING",
        ...matchConfig,
      },
    });

    const wager = await tx.wager.create({
      data: {
        matchId: match.id,
        initiatorId: session.user.id,
        receiverId,
        amountCents,
        status: "PENDING",
      },
    });

    return { match, wager };
  });

  // Notify receiver
  await db.notification.create({
    data: {
      userId: receiverId,
      type: "WAGER_REQUEST",
      title: "New Wager Challenge",
      body: `${initiator?.gamerTag} has challenged you to a $${(amountCents / 100).toFixed(2)} wager`,
      referenceId: result.wager.id,
      referenceType: "WAGER",
    },
  });

  return NextResponse.json(result, { status: 201 });
}
