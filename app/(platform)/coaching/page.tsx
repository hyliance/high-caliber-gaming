"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star, Search, Filter, ChevronRight, Clock, Users,
  Award, Video, Gamepad2, TrendingUp, Shield, CheckCircle
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const TIER_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  MASTER: { label: "Master Coach", color: "text-yellow-300", bg: "bg-yellow-500/10 border-yellow-500/20" },
  ELITE: { label: "Elite Coach", color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
  VERIFIED: { label: "Verified Coach", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
};

const SESSION_TYPE_LABELS: Record<string, string> = {
  VOD_REVIEW: "VOD Review",
  LIVE_1ON1: "Live 1-on-1",
  GROUP_SESSION: "Group Session",
  STRATEGY_BREAKDOWN: "Strategy",
  REPLAY_ANALYSIS: "Replay Analysis",
};

const MOCK_COACHES = [
  { id: "1", displayName: "ProShot_Kyle", tier: "MASTER", rating: 4.9, reviewCount: 847, sessionCount: 1240, isCredVerified: true, game: "Call of Duty", gameIcon: "🎯", country: "US", priceMin: 4500, priceMax: 9000, sessionTypes: ["LIVE_1ON1", "VOD_REVIEW", "STRATEGY_BREAKDOWN"], achievements: "3x World Champion" },
  { id: "2", displayName: "ValorantViper", tier: "ELITE", rating: 4.8, reviewCount: 523, sessionCount: 780, isCredVerified: true, game: "Valorant", gameIcon: "⚡", country: "EU", priceMin: 3000, priceMax: 6000, sessionTypes: ["LIVE_1ON1", "VOD_REVIEW", "REPLAY_ANALYSIS"], achievements: "Radiant Top 50" },
  { id: "3", displayName: "ApexPredatory", tier: "MASTER", rating: 4.95, reviewCount: 312, sessionCount: 450, isCredVerified: true, game: "Apex Legends", gameIcon: "🔥", country: "US", priceMin: 5000, priceMax: 10000, sessionTypes: ["VOD_REVIEW", "STRATEGY_BREAKDOWN"], achievements: "Former Pro Player" },
  { id: "4", displayName: "CoachRocket", tier: "ELITE", rating: 4.7, reviewCount: 290, sessionCount: 620, isCredVerified: false, game: "Rocket League", gameIcon: "🚀", country: "AU", priceMin: 2500, priceMax: 5000, sessionTypes: ["LIVE_1ON1", "GROUP_SESSION", "REPLAY_ANALYSIS"], achievements: "Grand Champion" },
  { id: "5", displayName: "CSMaestro", tier: "VERIFIED", rating: 4.6, reviewCount: 178, sessionCount: 310, isCredVerified: true, game: "CS2", gameIcon: "💣", country: "EU", priceMin: 2000, priceMax: 4000, sessionTypes: ["VOD_REVIEW", "LIVE_1ON1"], achievements: "FACEIT Level 10" },
  { id: "6", displayName: "FortniteFormula", tier: "VERIFIED", rating: 4.5, reviewCount: 95, sessionCount: 160, isCredVerified: false, game: "Fortnite", gameIcon: "🏆", country: "US", priceMin: 1500, priceMax: 3000, sessionTypes: ["LIVE_1ON1", "STRATEGY_BREAKDOWN"], achievements: "Arena Champion" },
  { id: "7", displayName: "LeagueLegende", tier: "ELITE", rating: 4.85, reviewCount: 445, sessionCount: 890, isCredVerified: true, game: "League of Legends", gameIcon: "🧙", country: "KR", priceMin: 3500, priceMax: 7000, sessionTypes: ["VOD_REVIEW", "REPLAY_ANALYSIS", "STRATEGY_BREAKDOWN"], achievements: "Challenger Rank" },
  { id: "8", displayName: "OverwatchOracle", tier: "VERIFIED", rating: 4.4, reviewCount: 67, sessionCount: 105, isCredVerified: false, game: "Overwatch 2", gameIcon: "🦸", country: "CA", priceMin: 1800, priceMax: 3500, sessionTypes: ["LIVE_1ON1", "GROUP_SESSION"], achievements: "Grandmaster" },
];

const RECOMMENDED = MOCK_COACHES.slice(0, 3);

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={12}
          className={s <= Math.round(rating) ? "fill-hcg-gold text-hcg-gold" : "text-hcg-border"}
        />
      ))}
    </div>
  );
}

function CoachCard({ coach }: { coach: typeof MOCK_COACHES[0] }) {
  const tier = TIER_CONFIG[coach.tier];
  return (
    <div className="hcg-card-hover group flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-hcg-gold/30 to-hcg-gold/10 flex items-center justify-center text-xl font-bold text-hcg-gold border border-hcg-gold/20">
            {coach.displayName[0]}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm">{coach.displayName}</span>
              {coach.isCredVerified && <CheckCircle size={13} className="text-blue-400" />}
            </div>
            <div className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full border ${tier.bg} ${tier.color}`}>
              <Award size={10} /> {tier.label}
            </div>
          </div>
        </div>
        <span className="text-lg">{coach.gameIcon}</span>
      </div>

      {/* Game + achievement */}
      <div>
        <p className="text-xs text-hcg-muted">{coach.game}</p>
        <p className="text-xs text-hcg-gold/80 font-medium">{coach.achievements}</p>
      </div>

      {/* Rating + sessions */}
      <div className="flex items-center gap-3 text-xs">
        <div className="flex items-center gap-1">
          <StarRating rating={coach.rating} />
          <span className="font-semibold">{coach.rating}</span>
          <span className="text-hcg-muted">({coach.reviewCount})</span>
        </div>
        <span className="text-hcg-muted">·</span>
        <span className="text-hcg-muted flex items-center gap-0.5"><Users size={11} /> {coach.sessionCount}+ sessions</span>
      </div>

      {/* Session types */}
      <div className="flex flex-wrap gap-1">
        {coach.sessionTypes.map((t) => (
          <span key={t} className="text-xs bg-hcg-bg text-hcg-muted border border-hcg-border rounded px-1.5 py-0.5">
            {SESSION_TYPE_LABELS[t]}
          </span>
        ))}
      </div>

      {/* Price + CTA */}
      <div className="flex items-center justify-between pt-1 border-t border-hcg-border/50 mt-auto">
        <div>
          <span className="text-xs text-hcg-muted">From </span>
          <span className="font-semibold text-hcg-gold">{formatCurrency(coach.priceMin)}</span>
          <span className="text-xs text-hcg-muted">/session</span>
        </div>
        <Button size="sm">Book <ChevronRight size={14} /></Button>
      </div>
    </div>
  );
}

export default function CoachingPage() {
  const [search, setSearch] = useState("");
  const [gameFilter, setGameFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sessionFilter, setSessionFilter] = useState("all");
  const [sort, setSort] = useState("rating");

  const filtered = MOCK_COACHES.filter((c) => {
    if (search && !c.displayName.toLowerCase().includes(search.toLowerCase()) && !c.game.toLowerCase().includes(search.toLowerCase())) return false;
    if (gameFilter !== "all" && c.game !== gameFilter) return false;
    if (tierFilter !== "all" && c.tier !== tierFilter) return false;
    if (priceFilter === "budget" && c.priceMin >= 2000) return false;
    if (priceFilter === "standard" && (c.priceMin < 2000 || c.priceMin >= 6000)) return false;
    if (priceFilter === "premium" && c.priceMin < 6000) return false;
    if (sessionFilter !== "all" && !c.sessionTypes.includes(sessionFilter)) return false;
    return true;
  }).sort((a, b) => {
    if (sort === "rating") return b.rating - a.rating;
    if (sort === "sessions") return b.sessionCount - a.sessionCount;
    if (sort === "price_asc") return a.priceMin - b.priceMin;
    if (sort === "price_desc") return b.priceMin - a.priceMin;
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-xl border border-hcg-gold/20 bg-gradient-to-br from-hcg-gold/5 to-hcg-bg p-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-hcg-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={20} className="text-hcg-gold" />
            <span className="text-xs font-semibold text-hcg-gold uppercase tracking-widest">Coaching Marketplace</span>
          </div>
          <h1 className="text-3xl font-display font-bold mb-2">Train with the <span className="hcg-gradient-text">Best</span></h1>
          <p className="text-hcg-muted text-sm max-w-lg">Work 1-on-1 with approved coaches who have competed at the highest levels. VOD reviews, live sessions, strategy breakdowns — fully booked within the platform.</p>
          <div className="flex gap-3 mt-4">
            <Button size="sm" variant="outline" className="gap-1.5"><TrendingUp size={14} /> Browse Coaches</Button>
            <Button size="sm" variant="ghost" className="gap-1.5 text-hcg-gold" asChild>
              <a href="/coaching/apply"><Award size={14} /> Become a Coach</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Recommended */}
      <div>
        <h2 className="text-sm font-semibold text-hcg-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Star size={13} className="text-hcg-gold" /> Recommended for You
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {RECOMMENDED.map((c) => <CoachCard key={c.id} coach={c} />)}
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-hcg-muted" />
          <input
            className="hcg-input pl-8 h-9"
            placeholder="Search coaches or games..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select value={gameFilter} onChange={(e) => setGameFilter(e.target.value)} className="hcg-input w-40 h-9 text-sm">
          <option value="all">All Games</option>
          {[...new Set(MOCK_COACHES.map((c) => c.game))].map((g) => <option key={g}>{g}</option>)}
        </select>
        <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value)} className="hcg-input w-36 h-9 text-sm">
          <option value="all">All Tiers</option>
          <option value="MASTER">Master Coach</option>
          <option value="ELITE">Elite Coach</option>
          <option value="VERIFIED">Verified Coach</option>
        </select>
        <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)} className="hcg-input w-36 h-9 text-sm">
          <option value="all">Any Price</option>
          <option value="budget">Budget (&lt;$20/hr)</option>
          <option value="standard">Standard ($20–$60)</option>
          <option value="premium">Premium ($60+)</option>
        </select>
        <select value={sessionFilter} onChange={(e) => setSessionFilter(e.target.value)} className="hcg-input w-40 h-9 text-sm">
          <option value="all">Any Session Type</option>
          {Object.entries(SESSION_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="hcg-input w-36 h-9 text-sm">
          <option value="rating">Top Rated</option>
          <option value="sessions">Most Booked</option>
          <option value="price_asc">Price: Low–High</option>
          <option value="price_desc">Price: High–Low</option>
        </select>
      </div>

      {/* Results */}
      <div>
        <p className="text-xs text-hcg-muted mb-3">{filtered.length} coaches found</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((c) => <CoachCard key={c.id} coach={c} />)}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-hcg-muted">
            <Gamepad2 size={40} className="mx-auto mb-3 opacity-30" />
            <p>No coaches match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
