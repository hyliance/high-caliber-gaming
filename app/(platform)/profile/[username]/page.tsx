import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import ProfileContent, { type ProfileData } from "./ProfileContent";

/* ------------------------------------------------------------------ */
/* Helpers                                                              */
/* ------------------------------------------------------------------ */

function ordinalPlacement(place: number | null): string {
  if (!place) return "—";
  const suffix = ["th", "st", "nd", "rd"];
  const v = place % 100;
  return place + (suffix[(v - 20) % 10] ?? suffix[v] ?? suffix[0]);
}

/* ------------------------------------------------------------------ */
/* Profile Page (Server Component)                                      */
/* ------------------------------------------------------------------ */

export default async function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = params;

  /* Look up user by gamerTag (URL slug) */
  const user = await db.user.findFirst({
    where: { gamerTag: { equals: username, mode: "insensitive" } },
    include: {
      trophies: { orderBy: { awardedAt: "desc" }, take: 20 },
      clanMembership: { include: { clan: { select: { name: true, tag: true } } } },
      orgMemberships: {
        where: { endDate: null },
        take: 1,
        include: {
          organization: {
            select: { name: true, abbreviation: true, primaryColor: true },
          },
        },
      },
      wallet: { select: { totalEarnedCents: true } },
    },
  });

  if (!user) notFound();

  /* Best ladder entry — for tier/rank/wins/losses */
  const ladderEntry = await db.ladderEntry.findFirst({
    where: { userId: user.id },
    orderBy: { elo: "desc" },
  });

  /* Recent completed matches */
  const recentMatches = await db.match.findMany({
    where: {
      OR: [{ player1Id: user.id }, { player2Id: user.id }],
      status: "COMPLETED",
    },
    orderBy: { completedAt: "desc" },
    take: 20,
    include: {
      player1: { select: { gamerTag: true } },
      player2: { select: { gamerTag: true } },
      wager: { select: { amountCents: true, winnerId: true } },
    },
  });

  /* Tournament entries */
  const tournamentEntries = await db.tournamentEntry.findMany({
    where: { userId: user.id, finalPlace: { not: null } },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: {
      tournament: {
        select: {
          name: true,
          prizePoolCents: true,
          prizeDistribution: true,
          gameTitle: { select: { officialName: true } },
        },
      },
    },
  });

  /* ---------------------------------------------------------------- */
  /* Derive stats                                                       */
  /* ---------------------------------------------------------------- */

  const wins   = ladderEntry?.wins   ?? 0;
  const losses = ladderEntry?.losses ?? 0;
  const winRate = wins + losses > 0 ? (wins / (wins + losses)) * 100 : 0;

  /* Map matches */
  const mappedMatches: ProfileData["recentMatches"] = recentMatches.map((m) => {
    const isP1     = m.player1Id === user.id;
    const opponent = isP1
      ? (m.player2.gamerTag ?? "Unknown")
      : (m.player1.gamerTag ?? "Unknown");

    const isWin   = m.winnerId === user.id;
    const isLoss  = m.winnerId !== null && m.winnerId !== user.id;
    const result: "WIN" | "LOSS" | "DRAW" = isWin ? "WIN" : isLoss ? "LOSS" : "DRAW";

    const myScore    = isP1 ? m.player1Score : m.player2Score;
    const theirScore = isP1 ? m.player2Score : m.player1Score;
    const score = myScore !== null && theirScore !== null
      ? `${myScore}-${theirScore}`
      : "—";

    /* Earnings from wager if winner */
    let earnings = 0;
    if (m.wager && m.wager.winnerId === user.id) {
      earnings = m.wager.amountCents / 100;
    }

    return {
      id: m.id,
      game: null,     // GameTitle not directly on Match in schema
      mode: m.gameMode,
      result,
      score,
      opponent,
      earnings,
      date: m.completedAt ?? m.createdAt,
    };
  });

  /* Map tournament entries */
  const mappedTournaments: ProfileData["tournaments"] = tournamentEntries.map((e) => {
    const place = e.finalPlace ?? 0;
    const placement = ordinalPlacement(place);

    /* Calculate prize from distribution */
    let prize = 0;
    const pool = e.tournament.prizePoolCents ?? 0;
    const dist = e.tournament.prizeDistribution as number[] | null;
    if (dist && place >= 1 && place <= dist.length) {
      prize = Math.floor((pool * dist[place - 1]) / 100) / 100;
    }

    return {
      id: e.id,
      name: e.tournament.name,
      game: e.tournament.gameTitle.officialName,
      placement,
      prize,
      date: e.createdAt,
    };
  });

  /* Map trophies */
  const mappedTrophies: ProfileData["trophies"] = user.trophies.map((t) => ({
    id: t.id,
    label: t.name,
    icon: t.iconUrl ?? "🏆",
    rarity: "COMMON",     // schema doesn't have rarity, default to COMMON
    date: t.awardedAt,
  }));

  /* Org */
  const firstOrg = user.orgMemberships[0]?.organization ?? null;
  const org = firstOrg
    ? {
        name: firstOrg.name,
        abbr: firstOrg.abbreviation,
        color: firstOrg.primaryColor ?? "#FFB800",
      }
    : null;

  /* Clan */
  const clan = user.clanMembership?.clan
    ? { name: user.clanMembership.clan.name, tag: user.clanMembership.clan.tag }
    : null;

  /* Assemble profile */
  const profile: ProfileData = {
    id: user.id,
    username: user.gamerTag ?? username,
    gamerTag: user.gamerTag ?? username,
    displayName: user.displayName ?? user.gamerTag ?? username,
    avatarUrl: user.avatarUrl,
    bannerColor: "#FFB800",
    bio: user.bio,
    country: user.country,
    isVerified: user.kycStatus === "VERIFIED",
    isOnline: user.streamStatus,
    globalRole: user.globalRole,
    tier: ladderEntry?.tier ?? "BRONZE",
    joinedAt: user.createdAt,
    lastSeen: user.lastSeen,
    followers: 0,
    following: 0,
    trustScore: user.trustScore,
    org,
    clan,
    stats: {
      totalMatches: wins + losses,
      wins,
      losses,
      winRate,
      totalEarnings: (user.wallet?.totalEarnedCents ?? 0) / 100,
      tournamentsPlayed: tournamentEntries.length,
      tournamentWins: tournamentEntries.filter((e) => e.finalPlace === 1).length,
      ladderRank: ladderEntry?.rank ?? null,
      karmaScore: user.trustScore,
    },
    games: [],   // GamingAccount doesn't store rank/hours — can be extended later
    trophies: mappedTrophies,
    recentMatches: mappedMatches,
    tournaments: mappedTournaments,
  };

  return <ProfileContent profile={profile} />;
}
