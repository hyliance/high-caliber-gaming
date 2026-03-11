"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trophy, Plus, Filter, Users, DollarSign, Calendar,
  Sword, Shield, ChevronRight, Star, Clock, Zap
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const FORMAT_LABELS: Record<string, string> = {
  SINGLE_ELIMINATION: "Single Elim",
  DOUBLE_ELIMINATION: "Double Elim",
  ROUND_ROBIN: "Round Robin",
  SWISS: "Swiss",
};

const STATUS_CONFIG: Record<string, { label: string; variant: string; color: string }> = {
  OPEN: { label: "Open", variant: "success", color: "text-green-400" },
  CHECK_IN: { label: "Check-In", variant: "warning", color: "text-yellow-400" },
  IN_PROGRESS: { label: "Live", variant: "destructive", color: "text-hcg-red" },
  COMPLETED: { label: "Completed", variant: "secondary", color: "text-hcg-muted" },
  DRAFT: { label: "Draft", variant: "secondary", color: "text-hcg-muted" },
};

const MOCK_TOURNAMENTS = [
  { id: "1", name: "HCG Weekly Cup #48", game: "Call of Duty", gameIcon: "🎯", format: "SINGLE_ELIMINATION", status: "OPEN", prizePoolCents: 50000, entryFeeCents: 500, maxCapacity: 64, currentEntrants: 47, startDate: new Date("2026-03-15T18:00:00"), featured: true },
  { id: "2", name: "Valorant Monthly Open", game: "Valorant", gameIcon: "⚡", format: "DOUBLE_ELIMINATION", status: "OPEN", prizePoolCents: 200000, entryFeeCents: 1000, maxCapacity: 128, currentEntrants: 112, startDate: new Date("2026-03-20T20:00:00"), featured: true },
  { id: "3", name: "Apex Legends Invitational", game: "Apex Legends", gameIcon: "🔥", format: "ROUND_ROBIN", status: "IN_PROGRESS", prizePoolCents: 100000, entryFeeCents: 0, maxCapacity: 30, currentEntrants: 30, startDate: new Date("2026-03-11T16:00:00"), featured: true },
  { id: "4", name: "Rocket League 3v3 Pro", game: "Rocket League", gameIcon: "🚀", format: "SWISS", status: "OPEN", prizePoolCents: 30000, entryFeeCents: 250, maxCapacity: 32, currentEntrants: 18, startDate: new Date("2026-03-16T19:00:00"), featured: false },
  { id: "5", name: "CS2 Monday Madness", game: "CS2", gameIcon: "💣", format: "SINGLE_ELIMINATION", status: "OPEN", prizePoolCents: 25000, entryFeeCents: 0, maxCapacity: 64, currentEntrants: 31, startDate: new Date("2026-03-17T20:00:00"), featured: false },
  { id: "6", name: "Fortnite Solo Cup", game: "Fortnite", gameIcon: "🏆", format: "ROUND_ROBIN", status: "OPEN", prizePoolCents: 75000, entryFeeCents: 750, maxCapacity: 100, currentEntrants: 68, startDate: new Date("2026-03-22T15:00:00"), featured: false },
  { id: "7", name: "LoL 5v5 Community League", game: "League of Legends", gameIcon: "🧙", format: "SWISS", status: "OPEN", prizePoolCents: 40000, entryFeeCents: 500, maxCapacity: 16, currentEntrants: 9, startDate: new Date("2026-03-18T18:00:00"), featured: false },
  { id: "8", name: "Warzone Trios Throwdown", game: "Call of Duty", gameIcon: "🎯", format: "SINGLE_ELIMINATION", status: "COMPLETED", prizePoolCents: 60000, entryFeeCents: 600, maxCapacity: 48, currentEntrants: 48, startDate: new Date("2026-03-08T17:00:00"), featured: false },
  { id: "9", name: "Valorant Agents Cup", game: "Valorant", gameIcon: "⚡", format: "DOUBLE_ELIMINATION", status: "COMPLETED", prizePoolCents: 150000, entryFeeCents: 1500, maxCapacity: 64, currentEntrants: 64, startDate: new Date("2026-03-05T19:00:00"), featured: false },
];

export default function TournamentsPage() {
  const [activeTab, setActiveTab] = useState<"browse" | "mine" | "completed">("browse");
  const [formatFilter, setFormatFilter] = useState("all");
  const [entryFilter, setEntryFilter] = useState("all");
  const [gameFilter, setGameFilter] = useState("all");

  const filteredTournaments = MOCK_TOURNAMENTS.filter((t) => {
    if (activeTab === "completed" && t.status !== "COMPLETED") return false;
    if (activeTab === "browse" && t.status === "COMPLETED") return false;
    if (formatFilter !== "all" && t.format !== formatFilter) return false;
    if (entryFilter === "free" && t.entryFeeCents > 0) return false;
    if (entryFilter === "paid" && t.entryFeeCents === 0) return false;
    if (gameFilter !== "all" && t.game !== gameFilter) return false;
    return true;
  });

  const featured = MOCK_TOURNAMENTS.filter((t) => t.featured && t.status !== "COMPLETED");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <Trophy size={24} className="text-hcg-gold" /> Tournaments
          </h1>
          <p className="text-sm text-hcg-muted mt-1">Compete in structured events with real prize pools</p>
        </div>
        <Button className="gap-2">
          <Plus size={16} /> Create Tournament
        </Button>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 border-b border-hcg-border pb-0">
        {(["browse", "mine", "completed"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors -mb-px ${
              activeTab === tab
                ? "border-hcg-gold text-hcg-gold"
                : "border-transparent text-hcg-muted hover:text-foreground"
            }`}
          >
            {tab === "mine" ? "My Tournaments" : tab === "completed" ? "Completed" : "Browse"}
          </button>
        ))}
      </div>

      {/* Featured (Browse only) */}
      {activeTab === "browse" && (
        <div>
          <h2 className="text-sm font-semibold text-hcg-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Star size={13} className="text-hcg-gold" /> Featured Events
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featured.map((t) => (
              <div key={t.id} className="hcg-card-hover group relative overflow-hidden border-hcg-gold/10">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-hcg-gold to-hcg-gold-light" />
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{t.gameIcon}</span>
                  <Badge variant={STATUS_CONFIG[t.status]?.variant as any}>
                    {t.status === "IN_PROGRESS" && <span className="mr-1 w-1.5 h-1.5 rounded-full bg-hcg-red inline-block animate-pulse" />}
                    {STATUS_CONFIG[t.status]?.label}
                  </Badge>
                </div>
                <h3 className="font-display font-semibold text-base mb-1">{t.name}</h3>
                <p className="text-xs text-hcg-muted mb-3">{t.game} · {FORMAT_LABELS[t.format]}</p>
                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                  <div className="bg-hcg-bg/50 rounded p-2">
                    <p className="text-hcg-muted">Prize Pool</p>
                    <p className="font-bold text-hcg-gold">{formatCurrency(t.prizePoolCents)}</p>
                  </div>
                  <div className="bg-hcg-bg/50 rounded p-2">
                    <p className="text-hcg-muted">Entry Fee</p>
                    <p className="font-bold">{t.entryFeeCents === 0 ? "FREE" : formatCurrency(t.entryFeeCents)}</p>
                  </div>
                </div>
                {/* Slots progress */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-hcg-muted">{t.currentEntrants}/{t.maxCapacity} registered</span>
                    {t.currentEntrants / t.maxCapacity > 0.85 && (
                      <span className="text-orange-400 flex items-center gap-1"><Zap size={10} /> Filling fast</span>
                    )}
                  </div>
                  <div className="h-1.5 bg-hcg-bg rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-hcg-gold to-hcg-gold-light rounded-full transition-all"
                      style={{ width: `${(t.currentEntrants / t.maxCapacity) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-hcg-muted flex items-center gap-1">
                    <Clock size={11} /> {t.startDate.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                  <Button size="sm" disabled={t.status === "IN_PROGRESS"}>
                    {t.status === "IN_PROGRESS" ? "In Progress" : "Register"}
                    <ChevronRight size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center">
        <Filter size={14} className="text-hcg-muted" />
        <select value={gameFilter} onChange={(e) => setGameFilter(e.target.value)} className="hcg-input w-40 h-8 text-xs">
          <option value="all">All Games</option>
          {[...new Set(MOCK_TOURNAMENTS.map((t) => t.game))].map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <select value={formatFilter} onChange={(e) => setFormatFilter(e.target.value)} className="hcg-input w-40 h-8 text-xs">
          <option value="all">All Formats</option>
          <option value="SINGLE_ELIMINATION">Single Elimination</option>
          <option value="DOUBLE_ELIMINATION">Double Elimination</option>
          <option value="ROUND_ROBIN">Round Robin</option>
          <option value="SWISS">Swiss</option>
        </select>
        <select value={entryFilter} onChange={(e) => setEntryFilter(e.target.value)} className="hcg-input w-32 h-8 text-xs">
          <option value="all">Any Entry</option>
          <option value="free">Free Only</option>
          <option value="paid">Paid Only</option>
        </select>
      </div>

      {/* Tournament grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTournaments.map((t) => (
          <div key={t.id} className="hcg-card-hover group">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{t.gameIcon}</span>
                <div>
                  <h3 className="font-semibold text-sm leading-tight">{t.name}</h3>
                  <p className="text-xs text-hcg-muted">{t.game}</p>
                </div>
              </div>
              <Badge variant={STATUS_CONFIG[t.status]?.variant as any} className="text-xs shrink-0">
                {STATUS_CONFIG[t.status]?.label}
              </Badge>
            </div>
            <div className="flex gap-3 text-xs mb-3">
              <span className="flex items-center gap-1 text-hcg-gold font-semibold">
                <DollarSign size={11} />{formatCurrency(t.prizePoolCents)}
              </span>
              <span className="flex items-center gap-1 text-hcg-muted">
                <Users size={11} />{t.currentEntrants}/{t.maxCapacity}
              </span>
              <span className="flex items-center gap-1 text-hcg-muted">
                <Sword size={11} />{FORMAT_LABELS[t.format]}
              </span>
            </div>
            <div className="h-1 bg-hcg-bg rounded-full mb-3">
              <div className="h-full bg-hcg-gold/50 rounded-full" style={{ width: `${(t.currentEntrants / t.maxCapacity) * 100}%` }} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-hcg-muted">
                <Calendar size={11} className="inline mr-1" />
                {t.startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-hcg-muted">{t.entryFeeCents === 0 ? "FREE" : formatCurrency(t.entryFeeCents)}</span>
                {t.status !== "COMPLETED" && (
                  <Button size="sm" variant="outline">Enter</Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTournaments.length === 0 && (
        <div className="text-center py-16 text-hcg-muted">
          <Trophy size={40} className="mx-auto mb-3 opacity-30" />
          <p>No tournaments match your filters</p>
        </div>
      )}
    </div>
  );
}
