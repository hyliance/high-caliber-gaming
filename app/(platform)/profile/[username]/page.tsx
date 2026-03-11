"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trophy, Shield, Sword, Star, Users, MessageSquare, Flag,
  CheckCircle, ExternalLink, Crown, Zap, Clock, TrendingUp,
  Award, Target, ChevronRight, MoreHorizontal
} from "lucide-react";
import { formatCurrency, tierColor, tierBgColor, formatWinRate, timeAgo } from "@/lib/utils";

// Mock profile data
const MOCK_PROFILE = {
  id: "user_001",
  username: "ShadowStrike",
  gamerTag: "ShadowStrike#7821",
  displayName: "Shadow Strike",
  avatarUrl: null,
  bannerColor: "#FFB800",
  bio: "Valorant IGL & CoD veteran. 5+ years competitive experience. Playing for Team Nexus. Always grinding ranked.",
  country: "US",
  isVerified: true,
  isOnline: true,
  globalRole: "VERIFIED_MEMBER",
  tier: "ELITE",
  joinedAt: new Date("2023-04-12"),
  lastSeen: new Date(Date.now() - 1000 * 60 * 12),
  followers: 2840,
  following: 431,
  isFollowing: false,
  org: { name: "Team Nexus", abbr: "NXS", color: "#FFB800" },
  clan: { name: "Night Owls", tag: "NOW" },
  stats: {
    totalMatches: 1284,
    wins: 847,
    losses: 437,
    winRate: 65.97,
    totalEarnings: 48500,
    tournamentsPlayed: 34,
    tournamentWins: 6,
    ladderRank: 12,
    karmaScore: 98,
  },
  games: [
    { title: "Valorant", rank: "Radiant", hoursPlayed: 2100, wins: 580, losses: 210 },
    { title: "Call of Duty", rank: "Crimson 3", hoursPlayed: 890, wins: 267, losses: 227 },
  ],
  trophies: [
    { id: "t1", label: "HCG Pro League S3 Champion", icon: "🏆", rarity: "LEGENDARY", date: new Date("2025-09-15") },
    { id: "t2", label: "Valorant Monthly Open — 1st Place", icon: "🥇", rarity: "EPIC", date: new Date("2025-07-22") },
    { id: "t3", label: "Top 100 Ladder — Season 4", icon: "⚡", rarity: "RARE", date: new Date("2025-06-01") },
    { id: "t4", label: "50-Match Win Streak", icon: "🔥", rarity: "RARE", date: new Date("2025-03-10") },
    { id: "t5", label: "Verified Member", icon: "✅", rarity: "COMMON", date: new Date("2023-05-01") },
  ],
  recentMatches: [
    { id: "m1", game: "Valorant", mode: "5v5", result: "WIN", score: "13-7", opponent: "PhantomEdge", earnings: 2500, date: new Date(Date.now() - 3600000 * 2) },
    { id: "m2", game: "CoD", mode: "Hardpoint", result: "WIN", score: "250-198", opponent: "IronFist99", earnings: 1000, date: new Date(Date.now() - 3600000 * 5) },
    { id: "m3", game: "Valorant", mode: "5v5", result: "LOSS", score: "9-13", opponent: "GhostRecon", earnings: 0, date: new Date(Date.now() - 3600000 * 24) },
    { id: "m4", game: "Valorant", mode: "5v5", result: "WIN", score: "13-4", opponent: "DarkMatter", earnings: 5000, date: new Date(Date.now() - 3600000 * 48) },
    { id: "m5", game: "CoD", mode: "SnD", result: "WIN", score: "6-3", opponent: "ProHunter", earnings: 750, date: new Date(Date.now() - 3600000 * 72) },
  ],
  tournaments: [
    { id: "trn1", name: "HCG Pro League S3", game: "Valorant", placement: "1st", prize: 25000, date: new Date("2025-09-15") },
    { id: "trn2", name: "Valorant Monthly Open", game: "Valorant", placement: "1st", prize: 8000, date: new Date("2025-07-22") },
    { id: "trn3", name: "HCG Weekly Cup #38", game: "CoD", placement: "3rd", prize: 1500, date: new Date("2025-06-10") },
    { id: "trn4", name: "CoD Amateur Invitational", game: "CoD", placement: "2nd", prize: 3000, date: new Date("2025-04-05") },
  ],
};

const TROPHY_RARITY: Record<string, string> = {
  LEGENDARY: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
  EPIC: "text-purple-400 border-purple-400/30 bg-purple-400/10",
  RARE: "text-blue-400 border-blue-400/30 bg-blue-400/10",
  COMMON: "text-hcg-muted border-hcg-border bg-hcg-bg",
};

const PLACEMENT_COLOR: Record<string, string> = {
  "1st": "text-hcg-gold",
  "2nd": "text-slate-300",
  "3rd": "text-orange-400",
};

type Tab = "overview" | "matches" | "tournaments" | "trophies";

export default function ProfilePage({ params }: { params: { username: string } }) {
  const [tab, setTab] = useState<Tab>("overview");
  const [isFollowing, setIsFollowing] = useState(MOCK_PROFILE.isFollowing);

  const profile = MOCK_PROFILE;
  const tierColorClass = tierColor(profile.tier);

  return (
    <div className="space-y-0">
      {/* Banner */}
      <div
        className="h-32 rounded-t-xl relative"
        style={{ background: `linear-gradient(135deg, ${profile.bannerColor}22 0%, ${profile.bannerColor}08 100%), #111118` }}
      >
        <div className="absolute inset-0 rounded-t-xl" style={{ borderBottom: `1px solid ${profile.bannerColor}30` }} />
        {/* Online indicator */}
        {profile.isOnline && (
          <div className="absolute top-3 right-3 flex items-center gap-1.5 text-xs text-green-400">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Online
          </div>
        )}
      </div>

      {/* Profile header */}
      <div className="hcg-card rounded-t-none border-t-0 px-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 mb-4">
          {/* Avatar */}
          <div className="relative">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white border-4 border-hcg-bg"
              style={{ background: `${profile.bannerColor}30`, boxShadow: `0 0 20px ${profile.bannerColor}30` }}
            >
              {profile.displayName.charAt(0)}
            </div>
            {profile.isVerified && (
              <CheckCircle size={16} className="absolute -bottom-1 -right-1 text-blue-400 bg-hcg-bg rounded-full" />
            )}
          </div>

          {/* Name + badges */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-display font-bold">{profile.displayName}</h1>
              <span className={`text-xs font-bold px-2 py-0.5 rounded border ${tierColorClass}`}>
                {profile.tier}
              </span>
              {profile.org && (
                <span className="text-xs text-hcg-muted border border-hcg-border rounded px-1.5 py-0.5">
                  [{profile.org.abbr}] {profile.org.name}
                </span>
              )}
              {profile.clan && (
                <span className="text-xs text-hcg-muted border border-hcg-border rounded px-1.5 py-0.5">
                  [{profile.clan.tag}]
                </span>
              )}
            </div>
            <p className="text-sm text-hcg-muted">{profile.gamerTag} · {profile.country} · Joined {profile.joinedAt.toLocaleDateString("en-US", { month: "short", year: "numeric" })}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant={isFollowing ? "outline" : "default"}
              onClick={() => setIsFollowing(!isFollowing)}
              className="gap-1.5"
            >
              <Users size={13} />
              {isFollowing ? "Following" : "Follow"}
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5">
              <MessageSquare size={13} /> Message
            </Button>
            <Button size="sm" variant="ghost" className="px-2">
              <MoreHorizontal size={16} />
            </Button>
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="text-sm text-hcg-muted mb-4 max-w-2xl">{profile.bio}</p>
        )}

        {/* Follower stats */}
        <div className="flex items-center gap-4 text-sm">
          <button className="hover:text-foreground transition-colors">
            <span className="font-bold">{profile.followers.toLocaleString()}</span>
            <span className="text-hcg-muted ml-1">Followers</span>
          </button>
          <button className="hover:text-foreground transition-colors">
            <span className="font-bold">{profile.following.toLocaleString()}</span>
            <span className="text-hcg-muted ml-1">Following</span>
          </button>
          <span className="text-hcg-muted">·</span>
          <span className="text-xs text-hcg-muted flex items-center gap-1">
            <Clock size={11} /> Last seen {timeAgo(profile.lastSeen)}
          </span>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border border-hcg-border rounded-lg overflow-hidden mt-4">
        {[
          { label: "Win Rate", value: `${profile.stats.winRate.toFixed(1)}%`, sub: `${profile.stats.wins}W / ${profile.stats.losses}L`, icon: TrendingUp, color: "text-green-400" },
          { label: "Total Earnings", value: formatCurrency(profile.stats.totalEarnings), sub: "All time", icon: Trophy, color: "text-hcg-gold" },
          { label: "Ladder Rank", value: `#${profile.stats.ladderRank}`, sub: "Global", icon: Crown, color: "text-purple-400" },
          { label: "Karma Score", value: `${profile.stats.karmaScore}/100`, sub: "Platform standing", icon: Star, color: "text-blue-400" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`hcg-card rounded-none p-4 ${i > 0 ? "border-l border-hcg-border" : ""}`}>
              <div className="flex items-center gap-2 mb-1">
                <Icon size={13} className={stat.color} />
                <span className="text-xs text-hcg-muted">{stat.label}</span>
              </div>
              <p className="text-xl font-display font-bold">{stat.value}</p>
              <p className="text-xs text-hcg-muted">{stat.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mt-4 border-b border-hcg-border">
        {(["overview", "matches", "tournaments", "trophies"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              tab === t
                ? "border-hcg-gold text-hcg-gold"
                : "border-transparent text-hcg-muted hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-4 space-y-4">
        {tab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Games */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sword size={15} className="text-hcg-gold" /> Game Profiles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profile.games.map((g) => (
                  <div key={g.title} className="flex items-center justify-between p-3 rounded-lg bg-hcg-bg border border-hcg-border">
                    <div>
                      <p className="font-semibold text-sm">{g.title}</p>
                      <p className="text-xs text-hcg-muted">{g.hoursPlayed.toLocaleString()} hours · {formatWinRate(g.wins, g.losses)}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">{g.rank}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent trophies */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Trophy size={15} className="text-hcg-gold" /> Recent Trophies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {profile.trophies.slice(0, 4).map((t) => (
                  <div key={t.id} className={`flex items-center gap-3 p-2 rounded-lg border text-sm ${TROPHY_RARITY[t.rarity]}`}>
                    <span className="text-lg">{t.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs truncate">{t.label}</p>
                      <p className="text-xs opacity-60">{t.date.toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="w-full gap-1 text-xs mt-1" onClick={() => setTab("trophies")}>
                  View all trophies <ChevronRight size={12} />
                </Button>
              </CardContent>
            </Card>

            {/* Recent matches preview */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target size={15} className="text-hcg-gold" /> Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {profile.recentMatches.slice(0, 3).map((m) => (
                    <div key={m.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-hcg-bg transition-colors">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold ${
                        m.result === "WIN" ? "bg-green-400/10 text-green-400 border border-green-400/20" : "bg-hcg-red/10 text-hcg-red border border-hcg-red/20"
                      }`}>
                        {m.result === "WIN" ? "W" : "L"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{m.game} · {m.mode}</p>
                        <p className="text-xs text-hcg-muted">vs {m.opponent} · {m.score}</p>
                      </div>
                      <div className="text-right shrink-0">
                        {m.earnings > 0 && (
                          <p className="text-sm font-mono text-hcg-gold">+{formatCurrency(m.earnings)}</p>
                        )}
                        <p className="text-xs text-hcg-muted">{timeAgo(m.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="w-full gap-1 text-xs mt-2" onClick={() => setTab("matches")}>
                  View all matches <ChevronRight size={12} />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {tab === "matches" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Match History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-hcg-border text-hcg-muted text-xs">
                      <th className="text-left py-2 pr-4">Result</th>
                      <th className="text-left py-2 pr-4">Game / Mode</th>
                      <th className="text-left py-2 pr-4">Opponent</th>
                      <th className="text-left py-2 pr-4">Score</th>
                      <th className="text-right py-2 pr-4">Earnings</th>
                      <th className="text-left py-2">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hcg-border/50">
                    {profile.recentMatches.map((m) => (
                      <tr key={m.id} className="hover:bg-hcg-bg/50">
                        <td className="py-2 pr-4">
                          <span className={`text-xs font-bold px-2 py-1 rounded ${
                            m.result === "WIN" ? "bg-green-400/10 text-green-400" : "bg-hcg-red/10 text-hcg-red"
                          }`}>
                            {m.result}
                          </span>
                        </td>
                        <td className="py-2 pr-4 text-sm">{m.game} <span className="text-hcg-muted">· {m.mode}</span></td>
                        <td className="py-2 pr-4 text-sm">{m.opponent}</td>
                        <td className="py-2 pr-4 font-mono text-xs">{m.score}</td>
                        <td className="py-2 pr-4 text-right font-mono text-xs">
                          {m.earnings > 0 ? <span className="text-hcg-gold">+{formatCurrency(m.earnings)}</span> : <span className="text-hcg-muted">—</span>}
                        </td>
                        <td className="py-2 text-xs text-hcg-muted">{timeAgo(m.date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {tab === "tournaments" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tournament Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profile.tournaments.map((t) => (
                  <div key={t.id} className="flex items-center gap-4 p-3 rounded-lg bg-hcg-bg border border-hcg-border hover:border-hcg-gold/20 transition-colors">
                    <div className={`text-2xl font-display font-bold w-10 text-center ${PLACEMENT_COLOR[t.placement] ?? "text-hcg-muted"}`}>
                      {t.placement}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{t.name}</p>
                      <p className="text-xs text-hcg-muted">{t.game} · {t.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-hcg-gold font-bold">{formatCurrency(t.prize)}</p>
                      <p className="text-xs text-hcg-muted">prize</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {tab === "trophies" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profile.trophies.map((t) => (
              <div key={t.id} className={`flex items-center gap-4 p-4 rounded-lg border ${TROPHY_RARITY[t.rarity]}`}>
                <span className="text-3xl">{t.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{t.label}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs opacity-70 capitalize">{t.rarity.toLowerCase()}</span>
                    <span className="text-xs opacity-50">·</span>
                    <span className="text-xs opacity-70">{t.date.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
