import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Swords,
  Trophy,
  GraduationCap,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronRight,
  Clock,
  Users,
  Zap,
  Star,
  MessageSquare,
  ThumbsUp,
  Crown,
  Target,
  Flame,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Types                                                                  */
/* ------------------------------------------------------------------ */

interface MatchData {
  id: string;
  player1Id: string;
  player2Id: string;
  winnerId: string | null;
  player1Score: number | null;
  player2Score: number | null;
  isWager: boolean;
  ladderId: string | null;
  tournamentId: string | null;
  completedAt: Date | null;
  createdAt: Date;
  player1: { gamerTag: string | null };
  player2: { gamerTag: string | null };
}

interface TournamentData {
  id: string;
  name: string;
  maxCapacity: number;
  currentEntrants: number;
  startDate: Date;
  entryFeeCents: number;
  prizePoolCents: number;
  format: string;
  gameTitle: { officialName: string };
  gameMode: { name: string };
}

interface RankingData {
  elo: number;
  wins: number;
  tier: string;
  rank: number | null;
  user: { gamerTag: string | null };
}

interface FeedPostData {
  id: string;
  title: string;
  content: string | null;
  type: string;
  upvotes: number;
  commentCount: number;
  createdAt: Date;
  author: { gamerTag: string | null };
  community: { name: string } | null;
}

/* ------------------------------------------------------------------ */
/* Helpers                                                                */
/* ------------------------------------------------------------------ */

function centsToDisplay(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

function relativeTime(date: Date): string {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function tournamentStartLabel(date: Date): string {
  const diff = date.getTime() - Date.now();
  if (diff <= 0) return "Starting now";
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (mins < 60) return `Starts in ${mins}m`;
  if (hours < 24) return `Starts in ${hours}h`;
  if (days === 1) return `Tomorrow`;
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function formatTournamentFormat(fmt: string): string {
  const map: Record<string, string> = {
    SINGLE_ELIMINATION: "Single Elim",
    DOUBLE_ELIMINATION: "Double Elim",
    ROUND_ROBIN: "Round Robin",
    SWISS: "Swiss",
  };
  return map[fmt] ?? fmt;
}

function getMatchType(match: MatchData): string {
  if (match.isWager) return "Money Match";
  if (match.tournamentId) return "Tournament";
  if (match.ladderId) return "Ranked";
  return "Friendly";
}

/* ------------------------------------------------------------------ */
/* Tier config                                                            */
/* ------------------------------------------------------------------ */

const TIER_COLORS: Record<string, string> = {
  BRONZE:   "text-amber-600",
  SILVER:   "text-slate-300",
  GOLD:     "text-hcg-gold",
  PLATINUM: "text-cyan-400",
  DIAMOND:  "text-blue-400",
  MASTER:   "text-purple-400",
};

const TIER_BG: Record<string, string> = {
  BRONZE:   "bg-amber-600/10 border-amber-600/20",
  SILVER:   "bg-slate-300/10 border-slate-300/20",
  GOLD:     "bg-hcg-gold/10 border-hcg-gold/20",
  PLATINUM: "bg-cyan-400/10 border-cyan-400/20",
  DIAMOND:  "bg-blue-400/10 border-blue-400/20",
  MASTER:   "bg-purple-400/10 border-purple-400/20",
};

const TIER_RANGES: Record<string, { min: number; max: number; next: string }> = {
  BRONZE:   { min: 0,    max: 1200, next: "Silver" },
  SILVER:   { min: 1200, max: 1400, next: "Gold" },
  GOLD:     { min: 1400, max: 1600, next: "Platinum" },
  PLATINUM: { min: 1600, max: 1800, next: "Diamond" },
  DIAMOND:  { min: 1800, max: 2000, next: "Master" },
  MASTER:   { min: 2000, max: 9999, next: "—" },
};

/* ------------------------------------------------------------------ */
/* Sub-components                                                         */
/* ------------------------------------------------------------------ */

function StatCard({
  label, value, sub, icon: Icon, accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  accent?: "gold" | "green" | "red" | "blue";
}) {
  const accentClass = {
    gold:  "text-hcg-gold",
    green: "text-green-400",
    red:   "text-hcg-red",
    blue:  "text-blue-400",
  }[accent ?? "gold"];

  const iconBg = {
    gold:  "bg-hcg-gold/10",
    green: "bg-green-400/10",
    red:   "bg-hcg-red/10",
    blue:  "bg-blue-400/10",
  }[accent ?? "gold"];

  return (
    <div className="hcg-card flex items-center gap-4">
      <div className={cn("flex-shrink-0 h-11 w-11 rounded-xl flex items-center justify-center", iconBg)}>
        <Icon className={cn("h-5 w-5", accentClass)} />
      </div>
      <div>
        <p className="text-xs text-hcg-muted uppercase tracking-wider">{label}</p>
        <p className={cn("text-xl font-display font-bold mt-0.5", accentClass)}>{value}</p>
        {sub && <p className="text-xs text-hcg-muted">{sub}</p>}
      </div>
    </div>
  );
}

function QuickActionButton({
  href, icon: Icon, label, description,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="hcg-card group hover:border-hcg-gold/30 hover:bg-hcg-card-hover transition-all duration-150 cursor-pointer flex items-center gap-4"
    >
      <div className="h-10 w-10 rounded-lg bg-hcg-gold/10 border border-hcg-gold/20 flex items-center justify-center flex-shrink-0 group-hover:bg-hcg-gold/20 transition-colors">
        <Icon className="h-5 w-5 text-hcg-gold" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-hcg-muted truncate">{description}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-hcg-muted group-hover:text-hcg-gold transition-colors flex-shrink-0" />
    </Link>
  );
}

function MatchRow({ match, userId }: { match: MatchData; userId: string }) {
  const isP1   = match.player1Id === userId;
  const opponentTag = isP1 ? match.player2.gamerTag : match.player1.gamerTag;
  const isWin  = match.winnerId === userId;
  const isLoss = match.winnerId !== null && match.winnerId !== userId;
  const result = isWin ? "W" : isLoss ? "L" : "D";

  const myScore    = isP1 ? match.player1Score : match.player2Score;
  const theirScore = isP1 ? match.player2Score : match.player1Score;
  const score = myScore !== null && theirScore !== null ? `${myScore}-${theirScore}` : "—";

  const type    = getMatchType(match);
  const dateStr = relativeTime(match.completedAt ?? match.createdAt);

  return (
    <tr className="border-b border-hcg-border/50 hover:bg-hcg-card-hover/50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-hcg-card border border-hcg-border flex items-center justify-center">
            <span className="text-[10px] font-bold text-hcg-muted">
              {(opponentTag ?? "??").slice(0, 2).toUpperCase()}
            </span>
          </div>
          <span className="text-sm font-medium text-foreground">
            {opponentTag ?? "Unknown Player"}
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className={cn(
          "inline-flex items-center justify-center h-6 w-6 rounded-md text-xs font-bold",
          result === "W" ? "bg-green-500/10 text-green-400" : "bg-hcg-red/10 text-hcg-red"
        )}>
          {result}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-hcg-muted">{score}</td>
      <td className="px-4 py-3">
        <span className="hcg-badge bg-hcg-card border border-hcg-border text-hcg-muted">{type}</span>
      </td>
      <td className="px-4 py-3 text-sm text-hcg-muted hidden md:table-cell">{dateStr}</td>
      <td className="px-4 py-3 text-sm font-medium">
        <span className="text-hcg-muted">—</span>
      </td>
    </tr>
  );
}

function TournamentCard({ tournament }: { tournament: TournamentData }) {
  const filled     = tournament.currentEntrants;
  const total      = tournament.maxCapacity;
  const remaining  = total - filled;
  const fillPct    = total > 0 ? Math.round((filled / total) * 100) : 0;
  const almostFull = remaining <= 5 && remaining > 0;

  const entryLabel = tournament.entryFeeCents === 0
    ? "Free"
    : centsToDisplay(tournament.entryFeeCents);

  return (
    <div className="hcg-card hover:border-hcg-gold/20 transition-colors flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-base text-foreground truncate">
            {tournament.name}
          </h3>
          <p className="text-xs text-hcg-muted mt-0.5">
            {tournament.gameTitle.officialName}
          </p>
        </div>
        {almostFull && (
          <span className="hcg-badge-red text-[10px] flex-shrink-0">
            <Flame className="h-2.5 w-2.5" />
            Filling fast
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="text-center rounded-lg bg-hcg-card-hover p-2">
          <p className="text-[10px] text-hcg-muted uppercase tracking-wide">Prize Pool</p>
          <p className="text-sm font-bold text-hcg-gold mt-0.5">
            {centsToDisplay(tournament.prizePoolCents)}
          </p>
        </div>
        <div className="text-center rounded-lg bg-hcg-card-hover p-2">
          <p className="text-[10px] text-hcg-muted uppercase tracking-wide">Entry</p>
          <p className="text-sm font-bold text-foreground mt-0.5">{entryLabel}</p>
        </div>
        <div className="text-center rounded-lg bg-hcg-card-hover p-2">
          <p className="text-[10px] text-hcg-muted uppercase tracking-wide">Format</p>
          <p className="text-sm font-bold text-foreground mt-0.5">
            {formatTournamentFormat(tournament.format)}
          </p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-hcg-muted">{filled} / {total} slots</span>
          <span className={cn("text-xs font-medium", almostFull ? "text-hcg-red" : "text-hcg-muted")}>
            {remaining} remaining
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-hcg-card-hover overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all", almostFull ? "bg-hcg-red" : "bg-hcg-gold")}
            style={{ width: `${fillPct}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5 text-xs text-hcg-muted">
          <Clock className="h-3.5 w-3.5" />
          {tournamentStartLabel(tournament.startDate)}
        </div>
        <Link href={`/tournaments/${tournament.id}`} className="hcg-btn-primary text-xs px-3 py-1.5">
          Enter
        </Link>
      </div>
    </div>
  );
}

function RankRow({
  rank, player, isCurrentUser,
}: {
  rank: number;
  player: RankingData;
  isCurrentUser?: boolean;
}) {
  return (
    <div className={cn(
      "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors",
      isCurrentUser ? "bg-hcg-gold/5 border border-hcg-gold/15" : "hover:bg-hcg-card-hover"
    )}>
      <span className={cn(
        "w-7 text-center text-sm font-bold flex-shrink-0",
        rank === 1 ? "text-hcg-gold" : rank === 2 ? "text-slate-300" : rank === 3 ? "text-amber-600" : "text-hcg-muted"
      )}>
        {rank === 1 ? <Crown className="h-4 w-4 mx-auto text-hcg-gold" /> : `#${rank}`}
      </span>
      <div className="h-7 w-7 rounded-full bg-hcg-card border border-hcg-border flex items-center justify-center flex-shrink-0">
        <span className="text-[9px] font-bold text-hcg-muted">
          {(player.user.gamerTag ?? "??").slice(0, 2).toUpperCase()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {player.user.gamerTag ?? "Unknown"}
          {isCurrentUser && <span className="ml-1.5 text-[10px] text-hcg-gold font-semibold">(you)</span>}
        </p>
        <p className="text-xs text-hcg-muted">{player.wins}W</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className={cn("text-xs font-bold", TIER_COLORS[player.tier] ?? "text-hcg-muted")}>
          {player.elo.toLocaleString()}
        </span>
        <TrendingUp className="h-3.5 w-3.5 text-hcg-muted" />
      </div>
    </div>
  );
}

function FeedCard({ post }: { post: FeedPostData }) {
  const typeColors: Record<string, string> = {
    TEXT:         "hcg-badge-blue",
    ANNOUNCEMENT: "hcg-badge-gold",
    POLL:         "hcg-badge-green",
    IMAGE:        "hcg-badge-blue",
    VIDEO:        "hcg-badge-blue",
    LINK:         "hcg-badge-blue",
  };

  const typeLabel: Record<string, string> = {
    TEXT:  "discussion",
    IMAGE: "image",
    VIDEO: "video",
    LINK:  "link",
    POLL:  "poll",
  };

  return (
    <Link
      href={`/feed/${post.id}`}
      className="hcg-card hover:border-hcg-gold/20 hover:bg-hcg-card-hover transition-all cursor-pointer block"
    >
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-full bg-hcg-card border border-hcg-border flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-[10px] font-bold text-hcg-muted">
            {(post.author.gamerTag ?? "??").slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs font-semibold text-foreground">
              {post.author.gamerTag ?? "Unknown"}
            </span>
            <span className={cn("hcg-badge text-[10px]", typeColors[post.type] ?? "hcg-badge-blue")}>
              {typeLabel[post.type] ?? post.type.toLowerCase()}
            </span>
            {post.community && (
              <span className="text-[10px] text-hcg-muted">{post.community.name}</span>
            )}
          </div>
          <p className="text-xs text-hcg-muted line-clamp-2">{post.content ?? post.title}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-[10px] text-hcg-muted">
              <ThumbsUp className="h-3 w-3" />
              {post.upvotes}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-hcg-muted">
              <MessageSquare className="h-3 w-3" />
              {post.commentCount}
            </span>
            <span className="text-[10px] text-hcg-muted ml-auto">{relativeTime(post.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Dashboard Page (Server Component)                                      */
/* ------------------------------------------------------------------ */

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login");

  const userId  = session.user.id;
  const gamerTag = session.user.gamerTag ?? "Player";

  /* Fetch everything in parallel */
  const [ladderEntry, wallet, recentMatches, topRankings, openTournaments, feedPosts] =
    await Promise.all([
      db.ladderEntry.findFirst({
        where: { userId },
        orderBy: { elo: "desc" },
      }),
      db.wallet.findUnique({
        where: { userId },
      }),
      db.match.findMany({
        where: {
          OR: [{ player1Id: userId }, { player2Id: userId }],
          status: "COMPLETED",
        },
        orderBy: { completedAt: "desc" },
        take: 5,
        include: {
          player1: { select: { gamerTag: true } },
          player2: { select: { gamerTag: true } },
        },
      }),
      db.ladderEntry.findMany({
        orderBy: { elo: "desc" },
        take: 5,
        distinct: ["userId"],
        include: {
          user: { select: { gamerTag: true } },
        },
      }),
      db.tournament.findMany({
        where: {
          status: { in: ["OPEN", "CHECK_IN"] },
          isPublic: true,
        },
        orderBy: { startDate: "asc" },
        take: 3,
        include: {
          gameTitle: { select: { officialName: true } },
          gameMode:  { select: { name: true } },
        },
      }),
      db.post.findMany({
        where: { isRemoved: false },
        orderBy: { createdAt: "desc" },
        take: 3,
        include: {
          author:    { select: { gamerTag: true } },
          community: { select: { name: true } },
        },
      }),
    ]);

  /* Derived stats */
  const wins    = ladderEntry?.wins ?? 0;
  const losses  = ladderEntry?.losses ?? 0;
  const elo     = ladderEntry?.elo ?? 1000;
  const tier    = ladderEntry?.tier ?? "BRONZE";
  const rank    = ladderEntry?.rank ?? null;
  const streak  = ladderEntry?.streak ?? 0;
  const totalEarnedCents = wallet?.totalEarnedCents ?? 0;
  const winRate = wins + losses > 0 ? Math.round((wins / (wins + losses)) * 100) : 0;

  const tierRange    = TIER_RANGES[tier] ?? TIER_RANGES.BRONZE;
  const tierProgress = tier === "MASTER"
    ? 100
    : Math.min(100, Math.max(0, Math.round(((elo - tierRange.min) / (tierRange.max - tierRange.min)) * 100)));
  const tierLabel = tier.charAt(0) + tier.slice(1).toLowerCase();

  /* Check if current user is already in top rankings */
  const userInTop = topRankings.some((e) => e.userId === userId);

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">
            Welcome back, <span className="text-hcg-gold">{gamerTag}</span>
          </h1>
          <p className="text-sm text-hcg-muted mt-0.5">
            {rank ? `Ranked #${rank.toLocaleString()} · ` : "Unranked · "}
            {tierLabel} · {elo.toLocaleString()} ELO ·{" "}
            <span className={cn("font-medium", streak > 0 ? "text-green-400" : streak < 0 ? "text-hcg-red" : "text-hcg-muted")}>
              {streak > 0 ? `+${streak}` : streak} streak
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/matches/new" className="hcg-btn-primary">
            <Swords className="h-4 w-4" />
            Quick Match
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="W/L Record"
          value={`${wins}W — ${losses}L`}
          sub={`${winRate}% win rate`}
          icon={Swords}
          accent="blue"
        />
        <StatCard
          label="Global Rank"
          value={rank ? `#${rank.toLocaleString()}` : "Unranked"}
          sub={tierLabel}
          icon={Target}
          accent="gold"
        />
        <StatCard
          label="Total Earnings"
          value={centsToDisplay(totalEarnedCents)}
          sub="All time"
          icon={DollarSign}
          accent="green"
        />
        <StatCard
          label="Win Rate"
          value={`${winRate}%`}
          sub={`${(wins + losses).toLocaleString()} matches played`}
          icon={TrendingUp}
          accent="gold"
        />
      </div>

      {/* Tier progress card */}
      <div className="hcg-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-semibold text-base text-foreground">
              Competitive Standing
            </h2>
            <p className="text-xs text-hcg-muted mt-0.5">
              Play ranked matches to climb the ladder and earn rewards
            </p>
          </div>
          <span className={cn(
            "hcg-badge border text-xs font-semibold",
            TIER_BG[tier],
            TIER_COLORS[tier]
          )}>
            <Star className="h-2.5 w-2.5 fill-current" />
            {tierLabel}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {/* Tier progress */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-foreground">
                Tier Progress{tier !== "MASTER" ? ` → ${tierRange.next}` : ""}
              </span>
              <span className="text-xs text-hcg-gold font-semibold">{tierProgress}%</span>
            </div>
            <div className="h-2.5 rounded-full bg-hcg-card-hover overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-hcg-gold-dark to-hcg-gold transition-all duration-500"
                style={{ width: `${tierProgress}%` }}
              />
            </div>
            <p className="text-xs text-hcg-muted mt-1.5">
              {tier === "MASTER"
                ? "You've reached the highest tier"
                : `${elo.toLocaleString()} ELO · ${Math.max(0, tierRange.max - elo)} to ${tierRange.next}`}
            </p>
          </div>

          {/* Win/loss breakdown */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-foreground">Win / Loss Breakdown</span>
              <span className="text-xs text-hcg-gold font-semibold">{wins}W / {losses}L</span>
            </div>
            <div className="h-2.5 rounded-full bg-hcg-card-hover overflow-hidden flex">
              {wins + losses > 0 ? (
                <>
                  <div
                    className="h-full bg-green-500 transition-all duration-500"
                    style={{ width: `${winRate}%` }}
                  />
                  <div
                    className="h-full bg-hcg-red/70 transition-all duration-500"
                    style={{ width: `${100 - winRate}%` }}
                  />
                </>
              ) : (
                <div className="h-full w-full bg-hcg-card-hover" />
              )}
            </div>
            <p className="text-xs text-hcg-muted mt-1.5">
              {wins + losses === 0
                ? "No matches played yet — play your first match!"
                : `${wins + losses} total matches · ${winRate}% win rate`}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <div className="section-header">
          <h2 className="section-title">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          <QuickActionButton href="/matches/challenge" icon={Swords}        label="Challenge Player"   description="Send a 1v1 challenge" />
          <QuickActionButton href="/tournaments/create" icon={Trophy}       label="Create Tournament"  description="Host your own bracket" />
          <QuickActionButton href="/coaching"           icon={GraduationCap} label="Find a Coach"      description="Book a session" />
          <QuickActionButton href="/wager"              icon={DollarSign}    label="Enter Wager"       description="Real money matches" />
        </div>
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent matches — 2 cols */}
        <div className="lg:col-span-2 hcg-card p-0 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-hcg-border">
            <h2 className="section-title">Recent Matches</h2>
            <Link href="/matches" className="flex items-center gap-1 text-xs text-hcg-gold hover:text-hcg-gold-light transition-colors">
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {recentMatches.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <Swords className="h-8 w-8 text-hcg-muted mx-auto mb-3 opacity-40" />
              <p className="text-sm text-hcg-muted">No matches yet.</p>
              <p className="text-xs text-hcg-muted/60 mt-1">Challenge a player to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-hcg-border/50">
                    {["Opponent", "Result", "Score", "Type", "Date", "Earnings"].map((h) => (
                      <th key={h} className={cn(
                        "px-4 py-2.5 text-left text-[10px] font-semibold text-hcg-muted uppercase tracking-wider",
                        h === "Date" && "hidden md:table-cell"
                      )}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentMatches.map((match) => (
                    <MatchRow key={match.id} match={match} userId={userId} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top rankings — 1 col */}
        <div className="hcg-card p-0 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-hcg-border">
            <h2 className="section-title">Top Rankings</h2>
            <Link href="/ladders" className="flex items-center gap-1 text-xs text-hcg-gold hover:text-hcg-gold-light transition-colors">
              Full ladder <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="p-2 space-y-0.5">
            {topRankings.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-hcg-muted">No ranked players yet.</p>
              </div>
            ) : (
              topRankings.map((entry, i) => (
                <RankRow
                  key={entry.userId}
                  rank={entry.rank ?? i + 1}
                  player={entry}
                  isCurrentUser={entry.userId === userId}
                />
              ))
            )}

            {/* Current user's position if not in top 5 */}
            {!userInTop && ladderEntry && (
              <div className="mx-2 my-1 border-t border-hcg-border/50 pt-2">
                <RankRow
                  rank={rank ?? 999}
                  player={{
                    elo,
                    wins,
                    tier,
                    rank,
                    user: { gamerTag },
                  }}
                  isCurrentUser
                />
              </div>
            )}

            {!userInTop && !ladderEntry && (
              <div className="mx-2 my-1 border-t border-hcg-border/50 pt-3 px-4">
                <p className="text-xs text-hcg-muted text-center">Play ranked matches to earn a rank.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Live Tournaments */}
      <div>
        <div className="section-header">
          <h2 className="section-title flex items-center gap-2">
            <Zap className="h-4 w-4 text-hcg-gold" />
            Open Tournaments
          </h2>
          <Link href="/tournaments" className="flex items-center gap-1 text-xs text-hcg-gold hover:text-hcg-gold-light transition-colors">
            Browse all <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {openTournaments.length === 0 ? (
          <div className="hcg-card py-12 text-center">
            <Trophy className="h-8 w-8 text-hcg-muted mx-auto mb-3 opacity-40" />
            <p className="text-sm text-hcg-muted">No open tournaments right now.</p>
            <p className="text-xs text-hcg-muted/60 mt-1">Check back soon or create your own.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {openTournaments.map((t) => (
              <TournamentCard key={t.id} tournament={t} />
            ))}
          </div>
        )}
      </div>

      {/* Community feed */}
      <div>
        <div className="section-header">
          <h2 className="section-title flex items-center gap-2">
            <Users className="h-4.5 w-4.5 text-hcg-muted" />
            Community Feed
          </h2>
          <Link href="/feed" className="flex items-center gap-1 text-xs text-hcg-gold hover:text-hcg-gold-light transition-colors">
            Full feed <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        {feedPosts.length === 0 ? (
          <div className="hcg-card py-12 text-center">
            <MessageSquare className="h-8 w-8 text-hcg-muted mx-auto mb-3 opacity-40" />
            <p className="text-sm text-hcg-muted">Nothing posted yet.</p>
            <p className="text-xs text-hcg-muted/60 mt-1">Be the first to post in the community.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {feedPosts.map((post) => (
              <FeedCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
