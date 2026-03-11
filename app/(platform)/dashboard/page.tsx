"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
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
/* Mock / placeholder data                                               */
/* ------------------------------------------------------------------ */

const MOCK_STATS = {
  wins: 142,
  losses: 61,
  rank: 347,
  totalEarnings: 2840,
  winRate: 70,
  currentStreak: 4,
  elo: 1847,
  tier: "GOLD",
  tierProgress: 68, // percent to next tier
  tierLabel: "Gold III",
  nextTier: "Platinum",
  seasonPoints: 3420,
  seasonPointsToNext: 5000,
};

const MOCK_MATCHES = [
  {
    id: "m1",
    opponent: "NightOwl#5521",
    result: "W" as const,
    score: "3-1",
    date: "Today, 2:14 PM",
    type: "Ranked",
    game: "Warzone",
    earnings: "+$25",
  },
  {
    id: "m2",
    opponent: "BladeRunner#7",
    result: "W" as const,
    score: "2-0",
    date: "Today, 11:40 AM",
    type: "Money Match",
    game: "Warzone",
    earnings: "+$50",
  },
  {
    id: "m3",
    opponent: "GhostSniper#99",
    result: "L" as const,
    score: "1-3",
    date: "Yesterday",
    type: "Ranked",
    game: "Warzone",
    earnings: "-",
  },
  {
    id: "m4",
    opponent: "VoidWalker#23",
    result: "W" as const,
    score: "3-0",
    date: "Yesterday",
    type: "Tournament",
    game: "Warzone",
    earnings: "+$15",
  },
  {
    id: "m5",
    opponent: "IronFist#444",
    result: "L" as const,
    score: "0-3",
    date: "Mar 8",
    type: "Ranked",
    game: "Warzone",
    earnings: "-",
  },
];

const MOCK_TOURNAMENTS = [
  {
    id: "t1",
    name: "Friday Night Warzone Cup",
    game: "Call of Duty: Warzone",
    prizePool: "$500",
    entryFee: "$10",
    slotsTotal: 32,
    slotsRemaining: 7,
    startIn: "Starts in 58m",
    format: "Solo",
    status: "open" as const,
  },
  {
    id: "t2",
    name: "HCG Weekly Championship",
    game: "Apex Legends",
    prizePool: "$1,000",
    entryFee: "Free",
    slotsTotal: 64,
    slotsRemaining: 22,
    startIn: "Tomorrow 6 PM",
    format: "Trio",
    status: "open" as const,
  },
  {
    id: "t3",
    name: "Valorant Invitational #12",
    game: "Valorant",
    prizePool: "$250",
    entryFee: "$5",
    slotsTotal: 16,
    slotsRemaining: 3,
    startIn: "Starts in 3h",
    format: "5v5",
    status: "filling" as const,
  },
];

const MOCK_RANKINGS = [
  {
    rank: 1,
    gamerTag: "PhantomKing#001",
    elo: 2840,
    wins: 312,
    tier: "MASTER",
    change: "up" as const,
  },
  {
    rank: 2,
    gamerTag: "VoidWalker#23",
    elo: 2790,
    wins: 289,
    tier: "MASTER",
    change: "same" as const,
  },
  {
    rank: 3,
    gamerTag: "NightOwl#5521",
    elo: 2714,
    wins: 254,
    tier: "DIAMOND",
    change: "up" as const,
  },
  {
    rank: 4,
    gamerTag: "BladeRunner#7",
    elo: 2650,
    wins: 231,
    tier: "DIAMOND",
    change: "down" as const,
  },
  {
    rank: 5,
    gamerTag: "GhostSniper#99",
    elo: 2588,
    wins: 210,
    tier: "DIAMOND",
    change: "up" as const,
  },
];

const MOCK_FEED = [
  {
    id: "p1",
    author: "PhantomKing#001",
    community: "Warzone Central",
    content: "Just hit Master rank for the 3rd season in a row. AMA about ranked grind.",
    upvotes: 142,
    comments: 38,
    time: "30m ago",
    type: "discussion",
  },
  {
    id: "p2",
    author: "HCG Staff",
    community: "Announcements",
    content: "Season 4 kicks off March 15! New prize pool structure and ranked rewards.",
    upvotes: 874,
    comments: 112,
    time: "2h ago",
    type: "announcement",
  },
  {
    id: "p3",
    author: "VoidWalker#23",
    community: "Apex Legends",
    content: "Looking for 2 more for ranked Apex trio. Plat+ only. DM me.",
    upvotes: 24,
    comments: 9,
    time: "4h ago",
    type: "lfg",
  },
];

/* ------------------------------------------------------------------ */
/* Tier helpers                                                           */
/* ------------------------------------------------------------------ */

const TIER_COLORS: Record<string, string> = {
  BRONZE: "text-amber-600",
  SILVER: "text-slate-300",
  GOLD: "text-hcg-gold",
  PLATINUM: "text-cyan-400",
  DIAMOND: "text-blue-400",
  MASTER: "text-purple-400",
};

const TIER_BG: Record<string, string> = {
  BRONZE: "bg-amber-600/10 border-amber-600/20",
  SILVER: "bg-slate-300/10 border-slate-300/20",
  GOLD: "bg-hcg-gold/10 border-hcg-gold/20",
  PLATINUM: "bg-cyan-400/10 border-cyan-400/20",
  DIAMOND: "bg-blue-400/10 border-blue-400/20",
  MASTER: "bg-purple-400/10 border-purple-400/20",
};

/* ------------------------------------------------------------------ */
/* Sub-components                                                         */
/* ------------------------------------------------------------------ */

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  accent?: "gold" | "green" | "red" | "blue";
}) {
  const accentClass = {
    gold: "text-hcg-gold",
    green: "text-green-400",
    red: "text-hcg-red",
    blue: "text-blue-400",
  }[accent ?? "gold"];

  const iconBg = {
    gold: "bg-hcg-gold/10",
    green: "bg-green-400/10",
    red: "bg-hcg-red/10",
    blue: "bg-blue-400/10",
  }[accent ?? "gold"];

  return (
    <div className="hcg-card flex items-center gap-4">
      <div
        className={cn(
          "flex-shrink-0 h-11 w-11 rounded-xl flex items-center justify-center",
          iconBg
        )}
      >
        <Icon className={cn("h-5 w-5", accentClass)} />
      </div>
      <div>
        <p className="text-xs text-hcg-muted uppercase tracking-wider">{label}</p>
        <p className={cn("text-xl font-display font-bold mt-0.5", accentClass)}>
          {value}
        </p>
        {sub && <p className="text-xs text-hcg-muted">{sub}</p>}
      </div>
    </div>
  );
}

function QuickActionButton({
  href,
  icon: Icon,
  label,
  description,
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

function MatchRow({ match }: { match: (typeof MOCK_MATCHES)[0] }) {
  const isWin = match.result === "W";
  return (
    <tr className="border-b border-hcg-border/50 hover:bg-hcg-card-hover/50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-hcg-card border border-hcg-border flex items-center justify-center">
            <span className="text-[10px] font-bold text-hcg-muted">
              {match.opponent.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <span className="text-sm font-medium text-foreground">
            {match.opponent}
          </span>
        </div>
      </td>
      <td className="px-4 py-3">
        <span
          className={cn(
            "inline-flex items-center justify-center h-6 w-6 rounded-md text-xs font-bold",
            isWin
              ? "bg-green-500/10 text-green-400"
              : "bg-hcg-red/10 text-hcg-red"
          )}
        >
          {match.result}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-hcg-muted">{match.score}</td>
      <td className="px-4 py-3">
        <span className="hcg-badge bg-hcg-card border border-hcg-border text-hcg-muted">
          {match.type}
        </span>
      </td>
      <td className="px-4 py-3 text-sm text-hcg-muted hidden md:table-cell">
        {match.date}
      </td>
      <td className="px-4 py-3 text-sm font-medium">
        {match.earnings !== "-" ? (
          <span className="text-green-400">{match.earnings}</span>
        ) : (
          <span className="text-hcg-muted">—</span>
        )}
      </td>
    </tr>
  );
}

function TournamentCard({
  tournament,
}: {
  tournament: (typeof MOCK_TOURNAMENTS)[0];
}) {
  const fillPct = Math.round(
    ((tournament.slotsTotal - tournament.slotsRemaining) / tournament.slotsTotal) * 100
  );
  const almostFull = tournament.slotsRemaining <= 5;

  return (
    <div className="hcg-card hover:border-hcg-gold/20 transition-colors flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-base text-foreground truncate">
            {tournament.name}
          </h3>
          <p className="text-xs text-hcg-muted mt-0.5">{tournament.game}</p>
        </div>
        {almostFull && (
          <span className="hcg-badge-red text-[10px] flex-shrink-0">
            <Flame className="h-2.5 w-2.5" />
            Filling fast
          </span>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center rounded-lg bg-hcg-card-hover p-2">
          <p className="text-[10px] text-hcg-muted uppercase tracking-wide">
            Prize Pool
          </p>
          <p className="text-sm font-bold text-hcg-gold mt-0.5">
            {tournament.prizePool}
          </p>
        </div>
        <div className="text-center rounded-lg bg-hcg-card-hover p-2">
          <p className="text-[10px] text-hcg-muted uppercase tracking-wide">
            Entry
          </p>
          <p className="text-sm font-bold text-foreground mt-0.5">
            {tournament.entryFee}
          </p>
        </div>
        <div className="text-center rounded-lg bg-hcg-card-hover p-2">
          <p className="text-[10px] text-hcg-muted uppercase tracking-wide">
            Format
          </p>
          <p className="text-sm font-bold text-foreground mt-0.5">
            {tournament.format}
          </p>
        </div>
      </div>

      {/* Slots progress */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-hcg-muted">
            {tournament.slotsTotal - tournament.slotsRemaining} / {tournament.slotsTotal} slots
          </span>
          <span
            className={cn(
              "text-xs font-medium",
              almostFull ? "text-hcg-red" : "text-hcg-muted"
            )}
          >
            {tournament.slotsRemaining} remaining
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-hcg-card-hover overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              almostFull ? "bg-hcg-red" : "bg-hcg-gold"
            )}
            style={{ width: `${fillPct}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5 text-xs text-hcg-muted">
          <Clock className="h-3.5 w-3.5" />
          {tournament.startIn}
        </div>
        <Link
          href={`/tournaments/${tournament.id}`}
          className="hcg-btn-primary text-xs px-3 py-1.5"
        >
          Enter
        </Link>
      </div>
    </div>
  );
}

function RankRow({
  player,
  isCurrentUser,
}: {
  player: (typeof MOCK_RANKINGS)[0];
  isCurrentUser?: boolean;
}) {
  const ChangeIcon =
    player.change === "up"
      ? TrendingUp
      : player.change === "down"
      ? TrendingDown
      : Minus;
  const changeColor =
    player.change === "up"
      ? "text-green-400"
      : player.change === "down"
      ? "text-hcg-red"
      : "text-hcg-muted";

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors",
        isCurrentUser
          ? "bg-hcg-gold/5 border border-hcg-gold/15"
          : "hover:bg-hcg-card-hover"
      )}
    >
      <span
        className={cn(
          "w-7 text-center text-sm font-bold flex-shrink-0",
          player.rank === 1
            ? "text-hcg-gold"
            : player.rank === 2
            ? "text-slate-300"
            : player.rank === 3
            ? "text-amber-600"
            : "text-hcg-muted"
        )}
      >
        {player.rank === 1 ? (
          <Crown className="h-4 w-4 mx-auto text-hcg-gold" />
        ) : (
          `#${player.rank}`
        )}
      </span>
      <div className="h-7 w-7 rounded-full bg-hcg-card border border-hcg-border flex items-center justify-center flex-shrink-0">
        <span className="text-[9px] font-bold text-hcg-muted">
          {player.gamerTag.slice(0, 2).toUpperCase()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {player.gamerTag}
          {isCurrentUser && (
            <span className="ml-1.5 text-[10px] text-hcg-gold font-semibold">
              (you)
            </span>
          )}
        </p>
        <p className="text-xs text-hcg-muted">{player.wins}W</p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span
          className={cn(
            "text-xs font-bold",
            TIER_COLORS[player.tier] ?? "text-hcg-muted"
          )}
        >
          {player.elo.toLocaleString()}
        </span>
        <ChangeIcon className={cn("h-3.5 w-3.5", changeColor)} />
      </div>
    </div>
  );
}

function FeedCard({ post }: { post: (typeof MOCK_FEED)[0] }) {
  const typeColors: Record<string, string> = {
    announcement: "hcg-badge-gold",
    discussion: "hcg-badge-blue",
    lfg: "hcg-badge-green",
  };

  return (
    <Link
      href={`/feed/${post.id}`}
      className="hcg-card hover:border-hcg-gold/20 hover:bg-hcg-card-hover transition-all cursor-pointer block"
    >
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-full bg-hcg-card border border-hcg-border flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-[10px] font-bold text-hcg-muted">
            {post.author.slice(0, 2).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-xs font-semibold text-foreground">
              {post.author}
            </span>
            <span
              className={cn(
                "hcg-badge text-[10px]",
                typeColors[post.type] ?? "hcg-badge-blue"
              )}
            >
              {post.type}
            </span>
            <span className="text-[10px] text-hcg-muted">{post.community}</span>
          </div>
          <p className="text-xs text-hcg-muted line-clamp-2">{post.content}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-[10px] text-hcg-muted">
              <ThumbsUp className="h-3 w-3" />
              {post.upvotes}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-hcg-muted">
              <MessageSquare className="h-3 w-3" />
              {post.comments}
            </span>
            <span className="text-[10px] text-hcg-muted ml-auto">
              {post.time}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Dashboard Page                                                         */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  const { data: session } = useSession();
  const gamerTag = session?.user?.gamerTag ?? "Player";
  const stats = MOCK_STATS;

  const wlRecord = `${stats.wins}W — ${stats.losses}L`;
  const winRate = `${stats.winRate}%`;

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl text-foreground">
            Welcome back,{" "}
            <span className="text-hcg-gold">{gamerTag}</span>
          </h1>
          <p className="text-sm text-hcg-muted mt-0.5">
            Season 3 — {stats.tierLabel} · {stats.elo.toLocaleString()} ELO ·{" "}
            <span
              className={cn(
                "font-medium",
                stats.currentStreak > 0 ? "text-green-400" : "text-hcg-red"
              )}
            >
              {stats.currentStreak > 0 ? "+" : ""}
              {stats.currentStreak} streak
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
          value={wlRecord}
          sub={`${stats.winRate}% win rate`}
          icon={Swords}
          accent="blue"
        />
        <StatCard
          label="Global Rank"
          value={`#${stats.rank.toLocaleString()}`}
          sub={stats.tierLabel}
          icon={Target}
          accent="gold"
        />
        <StatCard
          label="Total Earnings"
          value={`$${stats.totalEarnings.toLocaleString()}`}
          sub="All time"
          icon={DollarSign}
          accent="green"
        />
        <StatCard
          label="Win Rate"
          value={winRate}
          sub={`${stats.wins + stats.losses} matches played`}
          icon={TrendingUp}
          accent="gold"
        />
      </div>

      {/* Season progress card */}
      <div className="hcg-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-semibold text-base text-foreground">
              Active Season — Season 3
            </h2>
            <p className="text-xs text-hcg-muted mt-0.5">
              Ends March 31, 2026 · Rank up to unlock exclusive rewards
            </p>
          </div>
          <span
            className={cn(
              "hcg-badge border text-xs font-semibold",
              TIER_BG[stats.tier],
              TIER_COLORS[stats.tier]
            )}
          >
            <Star className="h-2.5 w-2.5 fill-current" />
            {stats.tierLabel}
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {/* Tier progress */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-foreground">
                Tier Progress → {stats.nextTier}
              </span>
              <span className="text-xs text-hcg-gold font-semibold">
                {stats.tierProgress}%
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-hcg-card-hover overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-hcg-gold-dark to-hcg-gold transition-all duration-500"
                style={{ width: `${stats.tierProgress}%` }}
              />
            </div>
            <p className="text-xs text-hcg-muted mt-1.5">
              Keep winning to reach{" "}
              <span className="text-cyan-400 font-medium">{stats.nextTier}</span>
            </p>
          </div>

          {/* Season points */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-foreground">
                Season Points
              </span>
              <span className="text-xs text-hcg-gold font-semibold">
                {stats.seasonPoints.toLocaleString()} /{" "}
                {stats.seasonPointsToNext.toLocaleString()}
              </span>
            </div>
            <div className="h-2.5 rounded-full bg-hcg-card-hover overflow-hidden">
              <div
                className="h-full rounded-full bg-blue-500 transition-all duration-500"
                style={{
                  width: `${Math.round(
                    (stats.seasonPoints / stats.seasonPointsToNext) * 100
                  )}%`,
                }}
              />
            </div>
            <p className="text-xs text-hcg-muted mt-1.5">
              {(stats.seasonPointsToNext - stats.seasonPoints).toLocaleString()}{" "}
              points to next reward tier
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
          <QuickActionButton
            href="/matches/challenge"
            icon={Swords}
            label="Challenge Player"
            description="Send a 1v1 challenge"
          />
          <QuickActionButton
            href="/tournaments/create"
            icon={Trophy}
            label="Create Tournament"
            description="Host your own bracket"
          />
          <QuickActionButton
            href="/coaching"
            icon={GraduationCap}
            label="Find a Coach"
            description="Book a session"
          />
          <QuickActionButton
            href="/wager"
            icon={DollarSign}
            label="Enter Wager"
            description="Real money matches"
          />
        </div>
      </div>

      {/* Main grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent matches — spans 2 cols */}
        <div className="lg:col-span-2 hcg-card p-0 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-hcg-border">
            <h2 className="section-title">Recent Matches</h2>
            <Link
              href="/matches"
              className="flex items-center gap-1 text-xs text-hcg-gold hover:text-hcg-gold-light transition-colors"
            >
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-hcg-border/50">
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-hcg-muted uppercase tracking-wider">
                    Opponent
                  </th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-hcg-muted uppercase tracking-wider">
                    Result
                  </th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-hcg-muted uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-hcg-muted uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-hcg-muted uppercase tracking-wider hidden md:table-cell">
                    Date
                  </th>
                  <th className="px-4 py-2.5 text-left text-[10px] font-semibold text-hcg-muted uppercase tracking-wider">
                    Earnings
                  </th>
                </tr>
              </thead>
              <tbody>
                {MOCK_MATCHES.map((match) => (
                  <MatchRow key={match.id} match={match} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top rankings — 1 col */}
        <div className="hcg-card p-0 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-hcg-border">
            <h2 className="section-title">Top Rankings</h2>
            <Link
              href="/ladders"
              className="flex items-center gap-1 text-xs text-hcg-gold hover:text-hcg-gold-light transition-colors"
            >
              Full ladder <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="p-2 space-y-0.5">
            {MOCK_RANKINGS.map((player) => (
              <RankRow key={player.rank} player={player} />
            ))}

            {/* Current user position */}
            <div className="mx-2 my-1 border-t border-hcg-border/50 pt-2">
              <RankRow
                player={{
                  rank: 347,
                  gamerTag: gamerTag,
                  elo: stats.elo,
                  wins: stats.wins,
                  tier: stats.tier,
                  change: "up",
                }}
                isCurrentUser
              />
            </div>
          </div>
        </div>
      </div>

      {/* Live Tournaments */}
      <div>
        <div className="section-header">
          <h2 className="section-title flex items-center gap-2">
            <Zap className="h-4.5 w-4.5 text-hcg-gold" />
            Live Tournaments
          </h2>
          <Link
            href="/tournaments"
            className="flex items-center gap-1 text-xs text-hcg-gold hover:text-hcg-gold-light transition-colors"
          >
            Browse all <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {MOCK_TOURNAMENTS.map((t) => (
            <TournamentCard key={t.id} tournament={t} />
          ))}
        </div>
      </div>

      {/* Community feed preview */}
      <div>
        <div className="section-header">
          <h2 className="section-title flex items-center gap-2">
            <Users className="h-4.5 w-4.5 text-hcg-muted" />
            Community Feed
          </h2>
          <Link
            href="/feed"
            className="flex items-center gap-1 text-xs text-hcg-gold hover:text-hcg-gold-light transition-colors"
          >
            Full feed <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {MOCK_FEED.map((post) => (
            <FeedCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
