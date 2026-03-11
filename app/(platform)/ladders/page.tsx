"use client";

import { useState } from "react";
import {
  TrendingUp,
  Swords,
  ChevronDown,
  Flame,
  ArrowUp,
  ArrowDown,
  Minus,
  Search,
  Filter,
  Shield,
  Crown,
  Star,
  Zap,
  Users,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Tier = "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | "DIAMOND" | "MASTER";

interface LadderEntry {
  rank: number;
  gamertag: string;
  displayName: string;
  clanTag?: string;
  tier: Tier;
  elo: number;
  wins: number;
  losses: number;
  winRate: number;
  streak: number;
  streakType: "win" | "loss";
  points: number;
  rankChange: "up" | "down" | "same";
  rankChangeDelta: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_ENTRIES: LadderEntry[] = [
  { rank: 1, gamertag: "NightHawkElite", displayName: "NightHawk", clanTag: "NHE", tier: "MASTER", elo: 2847, wins: 312, losses: 45, winRate: 87.4, streak: 14, streakType: "win", points: 2847, rankChange: "same", rankChangeDelta: 0 },
  { rank: 2, gamertag: "VoidWalker_X", displayName: "VoidWalker", clanTag: "VOID", tier: "MASTER", elo: 2791, wins: 289, losses: 62, winRate: 82.3, streak: 7, streakType: "win", points: 2791, rankChange: "up", rankChangeDelta: 1 },
  { rank: 3, gamertag: "SilentStorm99", displayName: "SilentStorm", tier: "MASTER", elo: 2734, wins: 256, losses: 71, winRate: 78.3, streak: 3, streakType: "win", points: 2734, rankChange: "down", rankChangeDelta: 1 },
  { rank: 4, gamertag: "IronGhost", displayName: "IronGhost", clanTag: "IGC", tier: "DIAMOND", elo: 2612, wins: 234, losses: 89, winRate: 72.4, streak: 2, streakType: "win", points: 2612, rankChange: "up", rankChangeDelta: 2 },
  { rank: 5, gamertag: "CrimsonBlade", displayName: "CrimsonBlade", clanTag: "CRIM", tier: "DIAMOND", elo: 2589, wins: 221, losses: 94, winRate: 70.2, streak: 1, streakType: "loss", points: 2589, rankChange: "down", rankChangeDelta: 1 },
  { rank: 6, gamertag: "StormSurge", displayName: "StormSurge", tier: "DIAMOND", elo: 2551, wins: 198, losses: 102, winRate: 66.0, streak: 4, streakType: "win", points: 2551, rankChange: "same", rankChangeDelta: 0 },
  { rank: 7, gamertag: "PhantomFrag", displayName: "PhantomFrag", clanTag: "PFG", tier: "DIAMOND", elo: 2498, wins: 187, losses: 111, winRate: 62.8, streak: 2, streakType: "loss", points: 2498, rankChange: "up", rankChangeDelta: 3 },
  { rank: 8, gamertag: "ArcaneAim", displayName: "ArcaneAim", tier: "PLATINUM", elo: 2387, wins: 174, losses: 121, winRate: 59.0, streak: 5, streakType: "win", points: 2387, rankChange: "up", rankChangeDelta: 1 },
  { rank: 9, gamertag: "GhostlineGG", displayName: "Ghostline", clanTag: "GGL", tier: "PLATINUM", elo: 2341, wins: 167, losses: 134, winRate: 55.5, streak: 1, streakType: "win", points: 2341, rankChange: "down", rankChangeDelta: 2 },
  { rank: 10, gamertag: "KineticKiller", displayName: "Kinetic", tier: "PLATINUM", elo: 2298, wins: 156, losses: 142, winRate: 52.3, streak: 3, streakType: "win", points: 2298, rankChange: "same", rankChangeDelta: 0 },
  { rank: 11, gamertag: "NovaBurst", displayName: "NovaBurst", clanTag: "NVB", tier: "PLATINUM", elo: 2241, wins: 149, losses: 148, winRate: 50.2, streak: 2, streakType: "loss", points: 2241, rankChange: "down", rankChangeDelta: 1 },
  { rank: 12, gamertag: "RapidFire_X", displayName: "RapidFire", tier: "GOLD", elo: 2109, wins: 138, losses: 157, winRate: 46.8, streak: 1, streakType: "loss", points: 2109, rankChange: "up", rankChangeDelta: 2 },
  { rank: 13, gamertag: "SteelNerve", displayName: "SteelNerve", clanTag: "SN", tier: "GOLD", elo: 2067, wins: 131, losses: 162, winRate: 44.7, streak: 3, streakType: "win", points: 2067, rankChange: "same", rankChangeDelta: 0 },
  { rank: 14, gamertag: "OverclockedGG", displayName: "Overclocked", tier: "GOLD", elo: 2023, wins: 124, losses: 168, winRate: 42.5, streak: 4, streakType: "loss", points: 2023, rankChange: "down", rankChangeDelta: 3 },
  { rank: 15, gamertag: "TitanForge", displayName: "TitanForge", clanTag: "TFG", tier: "GOLD", elo: 1987, wins: 118, losses: 172, winRate: 40.7, streak: 2, streakType: "win", points: 1987, rankChange: "up", rankChangeDelta: 1 },
  { rank: 16, gamertag: "ZeroHour_GG", displayName: "ZeroHour", tier: "SILVER", elo: 1834, wins: 98, losses: 178, winRate: 35.5, streak: 1, streakType: "win", points: 1834, rankChange: "same", rankChangeDelta: 0 },
  { rank: 17, gamertag: "MidnightMark", displayName: "MidnightMark", clanTag: "MMK", tier: "SILVER", elo: 1791, wins: 91, losses: 183, winRate: 33.2, streak: 5, streakType: "loss", points: 1791, rankChange: "down", rankChangeDelta: 2 },
  { rank: 18, gamertag: "DuskRunner", displayName: "DuskRunner", tier: "SILVER", elo: 1743, wins: 84, losses: 187, winRate: 31.0, streak: 2, streakType: "win", points: 1743, rankChange: "up", rankChangeDelta: 1 },
  { rank: 19, gamertag: "FirstBlood_KD", displayName: "FirstBlood", tier: "BRONZE", elo: 1512, wins: 67, losses: 198, winRate: 25.3, streak: 3, streakType: "loss", points: 1512, rankChange: "same", rankChangeDelta: 0 },
  { rank: 20, gamertag: "RookieRising", displayName: "RookieRising", clanTag: "RSN", tier: "BRONZE", elo: 1423, wins: 54, losses: 211, winRate: 20.4, streak: 1, streakType: "win", points: 1423, rankChange: "up", rankChangeDelta: 4 },
];

const TIER_CONFIG: Record<Tier, { color: string; bg: string; border: string; icon: React.ElementType; points: string; label: string }> = {
  MASTER: { color: "text-purple-300", bg: "bg-purple-500/10", border: "border-purple-500/30", icon: Crown, points: "2500+", label: "Master" },
  DIAMOND: { color: "text-blue-300", bg: "bg-blue-500/10", border: "border-blue-500/30", icon: Star, points: "2000–2499", label: "Diamond" },
  PLATINUM: { color: "text-cyan-300", bg: "bg-cyan-500/10", border: "border-cyan-500/30", icon: Zap, points: "1800–1999", label: "Platinum" },
  GOLD: { color: "text-hcg-gold", bg: "bg-hcg-gold/10", border: "border-hcg-gold/30", icon: Shield, points: "1600–1799", label: "Gold" },
  SILVER: { color: "text-gray-300", bg: "bg-gray-500/10", border: "border-gray-500/30", icon: Shield, points: "1400–1599", label: "Silver" },
  BRONZE: { color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/30", icon: Shield, points: "0–1399", label: "Bronze" },
};

const GAMES = ["All Games", "Call of Duty", "Valorant", "Apex Legends", "Fortnite", "Rocket League", "CS2"];
const TIERS = ["All Tiers", "Master", "Diamond", "Platinum", "Gold", "Silver", "Bronze"];

// My stats mock
const MY_STATS = {
  rank: 247,
  tier: "GOLD" as Tier,
  elo: 1923,
  wins: 89,
  losses: 72,
  streak: 3,
  streakType: "win" as const,
  nextTierElo: 2000,
  prevTierElo: 1800,
  gamertag: "YourGamerTag",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function TierBadge({ tier }: { tier: Tier }) {
  const cfg = TIER_CONFIG[tier];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold border ${cfg.color} ${cfg.bg} ${cfg.border}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

function RankChange({ change, delta }: { change: "up" | "down" | "same"; delta: number }) {
  if (change === "same") return <Minus className="w-3.5 h-3.5 text-gray-600" />;
  if (change === "up") return (
    <span className="flex items-center gap-0.5 text-green-400 text-xs">
      <ArrowUp className="w-3 h-3" />{delta}
    </span>
  );
  return (
    <span className="flex items-center gap-0.5 text-hcg-red text-xs">
      <ArrowDown className="w-3 h-3" />{delta}
    </span>
  );
}

function StreakBadge({ streak, type }: { streak: number; type: "win" | "loss" }) {
  if (streak === 0) return <span className="text-gray-600 text-xs">—</span>;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${type === "win" ? "text-green-400" : "text-hcg-red"}`}>
      {type === "win" && streak >= 3 && <Flame className="w-3 h-3" />}
      {type === "win" ? "W" : "L"}{streak}
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LaddersPage() {
  const [selectedGame, setSelectedGame] = useState("All Games");
  const [selectedTier, setSelectedTier] = useState("All Tiers");
  const [mode, setMode] = useState<"solo" | "team">("solo");
  const [search, setSearch] = useState("");

  const filteredEntries = MOCK_ENTRIES.filter((e) => {
    const matchesTier = selectedTier === "All Tiers" || e.tier === selectedTier.toUpperCase();
    const matchesSearch = !search || e.gamertag.toLowerCase().includes(search.toLowerCase()) || e.displayName.toLowerCase().includes(search.toLowerCase());
    return matchesTier && matchesSearch;
  });

  const myEloProgress = Math.round(
    ((MY_STATS.elo - MY_STATS.prevTierElo) / (MY_STATS.nextTierElo - MY_STATS.prevTierElo)) * 100
  );

  return (
    <div className="min-h-screen bg-hcg-bg text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-8 h-8 text-hcg-gold" />
              <h1 className="font-display font-bold text-4xl">Seasonal Ladders</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="hcg-badge-gold font-semibold">Season 4 Active</span>
              <span className="text-sm text-gray-500">Season ends April 30, 2026</span>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-500">50,247 players ranked</span>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Main Content */}
          <div className="flex-1 min-w-0">

            {/* Filter Bar */}
            <div className="hcg-card rounded-xl mb-6 p-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Game Selector */}
                <div className="relative">
                  <select
                    value={selectedGame}
                    onChange={(e) => setSelectedGame(e.target.value)}
                    className="hcg-input pl-3 pr-8 py-2 text-sm appearance-none cursor-pointer min-w-[160px]"
                  >
                    {GAMES.map((g) => <option key={g}>{g}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>

                {/* Tier Selector */}
                <div className="relative">
                  <select
                    value={selectedTier}
                    onChange={(e) => setSelectedTier(e.target.value)}
                    className="hcg-input pl-3 pr-8 py-2 text-sm appearance-none cursor-pointer min-w-[140px]"
                  >
                    {TIERS.map((t) => <option key={t}>{t}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>

                {/* Solo / Team Toggle */}
                <div className="flex rounded-lg border border-hcg-border overflow-hidden">
                  <button
                    onClick={() => setMode("solo")}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${mode === "solo" ? "bg-hcg-gold text-hcg-bg" : "text-gray-400 hover:text-white"}`}
                  >
                    Solo
                  </button>
                  <button
                    onClick={() => setMode("team")}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${mode === "team" ? "bg-hcg-gold text-hcg-bg" : "text-gray-400 hover:text-white"}`}
                  >
                    Team
                  </button>
                </div>

                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search player..."
                    className="hcg-input pl-9 py-2 text-sm"
                  />
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-500 ml-auto">
                  <Filter className="w-4 h-4" />
                  {filteredEntries.length} players
                </div>
              </div>
            </div>

            {/* My Ladder Stats Card */}
            <div className="hcg-card rounded-xl mb-6 p-5 border-hcg-gold/20 bg-gradient-to-r from-hcg-gold/5 to-transparent">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 bg-hcg-gold rounded-full" />
                <p className="font-display font-semibold text-sm text-hcg-gold uppercase tracking-wider">Your Ladder Stats</p>
              </div>
              <div className="flex flex-wrap items-start gap-6">
                {/* Rank */}
                <div className="text-center">
                  <p className="text-4xl font-display font-bold text-white">#{MY_STATS.rank}</p>
                  <p className="text-xs text-gray-500 mt-1">Global Rank</p>
                </div>

                <div className="w-px h-16 bg-hcg-border hidden sm:block" />

                {/* Tier */}
                <div>
                  <TierBadge tier={MY_STATS.tier} />
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>{MY_STATS.elo} ELO</span>
                      <span>{MY_STATS.nextTierElo} (Platinum)</span>
                    </div>
                    <div className="w-48 h-2 bg-hcg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-hcg-gold to-hcg-gold-light rounded-full transition-all"
                        style={{ width: `${myEloProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{myEloProgress}% to next tier</p>
                  </div>
                </div>

                <div className="w-px h-16 bg-hcg-border hidden sm:block" />

                {/* W/L */}
                <div className="flex gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-display font-bold text-green-400">{MY_STATS.wins}</p>
                    <p className="text-xs text-gray-500">Wins</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-display font-bold text-hcg-red">{MY_STATS.losses}</p>
                    <p className="text-xs text-gray-500">Losses</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-display font-bold text-white">
                      {Math.round((MY_STATS.wins / (MY_STATS.wins + MY_STATS.losses)) * 100)}%
                    </p>
                    <p className="text-xs text-gray-500">Win Rate</p>
                  </div>
                </div>

                <div className="w-px h-16 bg-hcg-border hidden sm:block" />

                {/* Streak */}
                <div className="text-center">
                  <div className="flex items-center gap-1 justify-center">
                    {MY_STATS.streakType === "win" && <Flame className="w-5 h-5 text-orange-400" />}
                    <p className="text-2xl font-display font-bold text-white">
                      {MY_STATS.streakType === "win" ? "W" : "L"}{MY_STATS.streak}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500">Current Streak</p>
                </div>

                <button className="ml-auto hcg-btn-primary px-6 py-2.5 rounded-lg text-sm font-semibold self-center">
                  <Swords className="w-4 h-4" />
                  Find Match
                </button>
              </div>
            </div>

            {/* Leaderboard Table */}
            <div className="hcg-card rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-hcg-border">
                <p className="font-display font-semibold">Leaderboard — Top 100</p>
                <p className="text-xs text-gray-500">Updated live</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-hcg-border text-xs text-gray-500 uppercase tracking-wider">
                      <th className="text-left px-5 py-3 w-12">#</th>
                      <th className="text-left px-4 py-3">Player</th>
                      <th className="text-center px-4 py-3 hidden md:table-cell">Tier</th>
                      <th className="text-right px-4 py-3">ELO</th>
                      <th className="text-right px-4 py-3 hidden sm:table-cell">W/L</th>
                      <th className="text-right px-4 py-3 hidden lg:table-cell">Win Rate</th>
                      <th className="text-center px-4 py-3 hidden sm:table-cell">Streak</th>
                      <th className="text-right px-4 py-3 hidden lg:table-cell">Points</th>
                      <th className="px-4 py-3 w-24" />
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEntries.map((entry, idx) => {
                      const isTop3 = entry.rank <= 3;
                      const rankColors = ["text-hcg-gold", "text-gray-300", "text-orange-600"];
                      return (
                        <tr
                          key={entry.gamertag}
                          className={`border-b border-hcg-border/50 hover:bg-hcg-card-hover transition-colors group ${isTop3 ? "bg-hcg-gold/[0.02]" : ""}`}
                        >
                          {/* Rank */}
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-1.5">
                              <span className={`font-display font-bold text-base ${isTop3 ? rankColors[entry.rank - 1] : "text-gray-500"}`}>
                                {entry.rank}
                              </span>
                              <RankChange change={entry.rankChange} delta={entry.rankChangeDelta} />
                            </div>
                          </td>

                          {/* Player */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-hcg-border to-hcg-card flex items-center justify-center font-display font-bold text-xs text-gray-400 flex-shrink-0">
                                {entry.displayName.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="font-semibold text-white">{entry.gamertag}</span>
                                  {entry.clanTag && (
                                    <span className="text-xs text-gray-600 font-mono">[{entry.clanTag}]</span>
                                  )}
                                </div>
                                <span className="text-xs text-gray-500">{entry.displayName}</span>
                              </div>
                            </div>
                          </td>

                          {/* Tier */}
                          <td className="px-4 py-3.5 text-center hidden md:table-cell">
                            <TierBadge tier={entry.tier} />
                          </td>

                          {/* ELO */}
                          <td className="px-4 py-3.5 text-right">
                            <span className="font-mono font-semibold text-white">{entry.elo.toLocaleString()}</span>
                          </td>

                          {/* W/L */}
                          <td className="px-4 py-3.5 text-right hidden sm:table-cell">
                            <span className="text-green-400 font-medium">{entry.wins}</span>
                            <span className="text-gray-600 mx-1">/</span>
                            <span className="text-hcg-red font-medium">{entry.losses}</span>
                          </td>

                          {/* Win Rate */}
                          <td className="px-4 py-3.5 text-right hidden lg:table-cell">
                            <span className="text-gray-300">{entry.winRate.toFixed(1)}%</span>
                          </td>

                          {/* Streak */}
                          <td className="px-4 py-3.5 text-center hidden sm:table-cell">
                            <StreakBadge streak={entry.streak} type={entry.streakType} />
                          </td>

                          {/* Points */}
                          <td className="px-4 py-3.5 text-right hidden lg:table-cell">
                            <span className="font-mono text-gray-400">{entry.points.toLocaleString()}</span>
                          </td>

                          {/* Challenge */}
                          <td className="px-4 py-3.5 text-right">
                            <button className="opacity-0 group-hover:opacity-100 transition-opacity hcg-btn-outline py-1 px-3 text-xs rounded-lg border-hcg-gold/30 text-hcg-gold hover:bg-hcg-gold/10">
                              <Swords className="w-3 h-3" />
                              Challenge
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {filteredEntries.length === 0 && (
                <div className="py-16 text-center">
                  <Search className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500">No players found matching your filters.</p>
                </div>
              )}
            </div>
          </div>

          {/* Tier Legend Sidebar */}
          <div className="hidden xl:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="hcg-card rounded-xl p-5">
                <p className="font-display font-semibold text-sm mb-5 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-hcg-gold" />
                  Tier Thresholds
                </p>
                <div className="space-y-3">
                  {(Object.entries(TIER_CONFIG) as [Tier, typeof TIER_CONFIG[Tier]][]).map(([tier, cfg]) => {
                    const Icon = cfg.icon;
                    const isMyTier = tier === MY_STATS.tier;
                    return (
                      <div
                        key={tier}
                        className={`rounded-lg p-3 border transition-all ${isMyTier ? `${cfg.bg} ${cfg.border}` : "border-transparent"}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className={`w-4 h-4 ${cfg.color}`} />
                            <span className={`text-sm font-semibold ${cfg.color}`}>{cfg.label}</span>
                            {isMyTier && <span className="text-xs text-hcg-gold">(You)</span>}
                          </div>
                          <span className="text-xs text-gray-500 font-mono">{cfg.points}</span>
                        </div>
                        {isMyTier && (
                          <div className="mt-2">
                            <div className="h-1.5 bg-hcg-border rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${cfg.color.replace("text-", "bg-")}`}
                                style={{ width: `${myEloProgress}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{MY_STATS.elo}/{MY_STATS.nextTierElo} ELO</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-5 pt-4 border-t border-hcg-border text-xs text-gray-600 space-y-1">
                  <p>ELO gained/lost per match: ±15–35</p>
                  <p>Season resets soft to 70% of rank</p>
                  <p>Placement matches: first 10 games</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Find Match FAB */}
        <div className="fixed bottom-8 right-8 z-30">
          <button className="hcg-btn-primary px-6 py-3.5 rounded-2xl text-base font-bold shadow-2xl shadow-hcg-gold/20 animate-pulse-gold">
            <Swords className="w-5 h-5" />
            Find Match
          </button>
        </div>
      </div>
    </div>
  );
}
