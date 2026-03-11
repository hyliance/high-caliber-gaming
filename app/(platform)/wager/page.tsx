"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign, TrendingUp, TrendingDown, Shield, AlertTriangle,
  Clock, CheckCircle, XCircle, Eye, Users, Zap, Lock
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/lib/utils";

const MOCK_ACTIVE_WAGERS = [
  { id: "1", opponent: "ShadowBlade_X", amount: 5000, status: "ESCROWED", game: "Valorant", mode: "5v5 Competitive", created: "2h ago", isInitiator: true },
  { id: "2", opponent: "NightOwl_Pro", amount: 2500, status: "PENDING", game: "Call of Duty", mode: "1v1 Gunfight", created: "30m ago", isInitiator: false },
];

const MOCK_HISTORY = [
  { id: "h1", opponent: "GhostSniper44", amount: 10000, result: "W", earned: 9300, game: "Apex", date: "Mar 10" },
  { id: "h2", opponent: "ProPlayer_ZX", amount: 5000, result: "L", earned: -5000, game: "Valorant", date: "Mar 9" },
  { id: "h3", opponent: "IronFist_21", amount: 7500, result: "W", earned: 6975, game: "CoD", date: "Mar 8" },
  { id: "h4", opponent: "RocketKing99", amount: 3000, result: "W", earned: 2790, game: "Rocket League", date: "Mar 7" },
  { id: "h5", opponent: "ShadowHunter", amount: 2000, result: "L", earned: -2000, game: "CS2", date: "Mar 6" },
  { id: "h6", opponent: "ApexPred", amount: 8000, result: "W", earned: 7440, game: "Apex", date: "Mar 4" },
];

const MOCK_LEADERBOARD = [
  { rank: 1, gamerTag: "MoneyMoves_X", earned: 284000, wins: 47, losses: 8, winRate: "85%" },
  { rank: 2, gamerTag: "GoldGrinder", earned: 215000, wins: 38, losses: 11, winRate: "78%" },
  { rank: 3, gamerTag: "CashKing_Pro", earned: 189000, wins: 33, losses: 9, winRate: "79%" },
  { rank: 4, gamerTag: "WagerWolf", earned: 156000, wins: 29, losses: 12, winRate: "71%" },
  { rank: 5, gamerTag: "ShadowBlade_X", earned: 143000, wins: 26, losses: 8, winRate: "76%" },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  PENDING: { label: "Pending", color: "text-yellow-400", icon: Clock },
  ESCROWED: { label: "In Escrow", color: "text-blue-400", icon: Lock },
  COMPLETED: { label: "Completed", color: "text-green-400", icon: CheckCircle },
  DISPUTED: { label: "Disputed", color: "text-orange-400", icon: AlertTriangle },
};

export default function WagerPage() {
  const [activeTab, setActiveTab] = useState<"active" | "history" | "leaderboard">("active");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [wagerForm, setWagerForm] = useState({ opponent: "", amount: "", game: "", mode: "" });

  const stats = {
    totalEarned: 193000,
    winRate: 73,
    activeWagers: 2,
    todayVolume: 18500,
    dailyUsed: 18500,
    dailyCap: 50000,
    weeklyUsed: 87500,
    weeklyCap: 200000,
  };

  return (
    <div className="space-y-6">
      {/* KYC Warning */}
      <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center gap-3">
        <AlertTriangle size={16} className="text-orange-400 shrink-0" />
        <div className="flex-1 text-sm">
          <span className="font-medium text-orange-300">Identity Verification Required</span>
          <span className="text-orange-200/70 ml-2">Complete KYC to unlock money matches and withdrawals.</span>
        </div>
        <Button size="sm" variant="outline" className="border-orange-500/30 text-orange-300 shrink-0">Verify Now</Button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <DollarSign size={24} className="text-hcg-gold" /> Money Matches
          </h1>
          <p className="text-sm text-hcg-muted">Wager real money on competitive matches. Funds held in escrow.</p>
        </div>
        <Button className="gap-2 animate-pulse-gold" onClick={() => setShowCreateModal(true)}>
          <Zap size={16} /> Create Wager
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Earned", value: formatCurrency(stats.totalEarned), icon: TrendingUp, color: "text-green-400" },
          { label: "Win Rate", value: `${stats.winRate}%`, icon: Shield, color: "text-hcg-gold" },
          { label: "Active Wagers", value: stats.activeWagers.toString(), icon: Lock, color: "text-blue-400" },
          { label: "Today's Volume", value: formatCurrency(stats.todayVolume), icon: DollarSign, color: "text-purple-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Icon size={14} className={color} />
                <span className="text-xs text-hcg-muted">{label}</span>
              </div>
              <p className="text-xl font-display font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Limits */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Daily Cap", used: stats.dailyUsed, cap: stats.dailyCap },
          { label: "Weekly Cap", used: stats.weeklyUsed, cap: stats.weeklyCap },
        ].map(({ label, used, cap }) => (
          <Card key={label}>
            <CardContent className="p-4">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-hcg-muted font-medium">{label}</span>
                <span className="text-foreground">{formatCurrency(used)} / {formatCurrency(cap)}</span>
              </div>
              <div className="h-2 bg-hcg-bg rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${(used / cap) > 0.8 ? "bg-orange-500" : "bg-hcg-gold"}`}
                  style={{ width: `${(used / cap) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-hcg-muted">{Math.round((used / cap) * 100)}% used</span>
                <Button variant="link" size="sm" className="h-auto p-0 text-xs text-hcg-muted">Edit Limit</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-hcg-border">
        {(["active", "history", "leaderboard"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors -mb-px ${
              activeTab === tab ? "border-hcg-gold text-hcg-gold" : "border-transparent text-hcg-muted hover:text-foreground"
            }`}
          >
            {tab === "active" ? `Active (${MOCK_ACTIVE_WAGERS.length})` : tab === "history" ? "History" : "Leaderboard"}
          </button>
        ))}
      </div>

      {/* Active Wagers */}
      {activeTab === "active" && (
        <div className="space-y-3">
          {MOCK_ACTIVE_WAGERS.map((w) => {
            const cfg = STATUS_CONFIG[w.status];
            const StatusIcon = cfg.icon;
            return (
              <Card key={w.id}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-hcg-gold/20 to-hcg-gold/5 flex items-center justify-center font-bold text-hcg-gold border border-hcg-gold/20">
                    {w.opponent[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-sm">{w.opponent}</span>
                      <Badge variant="secondary" className="text-xs">{w.game} · {w.mode}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-hcg-muted">
                      <span className={`flex items-center gap-1 ${cfg.color}`}><StatusIcon size={11} /> {cfg.label}</span>
                      <span>·</span>
                      <span>{w.created}</span>
                      <span>·</span>
                      <span>{w.isInitiator ? "You challenged" : "Challenged you"}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-hcg-gold text-lg">{formatCurrency(w.amount)}</p>
                    <p className="text-xs text-hcg-muted">Wager Amount</p>
                  </div>
                  <div className="flex gap-2">
                    {w.status === "PENDING" && !w.isInitiator && (
                      <>
                        <Button size="sm"><CheckCircle size={14} /> Accept</Button>
                        <Button size="sm" variant="destructive"><XCircle size={14} /></Button>
                      </>
                    )}
                    {w.status === "ESCROWED" && (
                      <Button size="sm" variant="outline"><Eye size={14} /> View Match</Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
          {MOCK_ACTIVE_WAGERS.length === 0 && (
            <div className="text-center py-12 text-hcg-muted">
              <DollarSign size={36} className="mx-auto mb-2 opacity-30" />
              <p>No active wagers. Create one to get started!</p>
            </div>
          )}
        </div>
      )}

      {/* Wager History */}
      {activeTab === "history" && (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-hcg-border text-xs text-hcg-muted">
                  <th className="text-left p-3">Opponent</th>
                  <th className="text-left p-3">Game</th>
                  <th className="text-right p-3">Wager</th>
                  <th className="text-center p-3">Result</th>
                  <th className="text-right p-3">Earnings</th>
                  <th className="text-left p-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hcg-border/50">
                {MOCK_HISTORY.map((h) => (
                  <tr key={h.id} className="hover:bg-hcg-card-hover/30">
                    <td className="p-3 font-medium">{h.opponent}</td>
                    <td className="p-3 text-hcg-muted">{h.game}</td>
                    <td className="p-3 text-right font-mono">{formatCurrency(h.amount)}</td>
                    <td className="p-3 text-center">
                      <Badge variant={h.result === "W" ? "success" : "destructive"} className="text-xs">
                        {h.result === "W" ? "WIN" : "LOSS"}
                      </Badge>
                    </td>
                    <td className={`p-3 text-right font-mono font-semibold ${h.earned > 0 ? "text-green-400" : "text-hcg-red"}`}>
                      {h.earned > 0 ? "+" : ""}{formatCurrency(h.earned)}
                    </td>
                    <td className="p-3 text-hcg-muted text-xs">{h.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard */}
      {activeTab === "leaderboard" && (
        <Card>
          <CardHeader><CardTitle>Top Earners — March 2026</CardTitle></CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-hcg-border text-xs text-hcg-muted">
                  <th className="text-center p-2 w-10">#</th>
                  <th className="text-left p-2">Player</th>
                  <th className="text-right p-2">Earned</th>
                  <th className="text-center p-2">W</th>
                  <th className="text-center p-2">L</th>
                  <th className="text-center p-2">Win %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hcg-border/50">
                {MOCK_LEADERBOARD.map((p) => (
                  <tr key={p.rank} className="hover:bg-hcg-card-hover/30">
                    <td className="p-2 text-center">
                      <span className={`font-bold ${p.rank === 1 ? "text-hcg-gold" : p.rank === 2 ? "text-gray-300" : p.rank === 3 ? "text-amber-700" : "text-hcg-muted"}`}>
                        {p.rank}
                      </span>
                    </td>
                    <td className="p-2 font-medium">{p.gamerTag}</td>
                    <td className="p-2 text-right font-mono font-semibold text-hcg-gold">{formatCurrency(p.earned)}</td>
                    <td className="p-2 text-center text-green-400">{p.wins}</td>
                    <td className="p-2 text-center text-hcg-red">{p.losses}</td>
                    <td className="p-2 text-center">{p.winRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Create Wager Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md border-hcg-gold/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><DollarSign size={18} className="text-hcg-gold" /> Create Money Match</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-hcg-muted font-medium">Opponent Gamer Tag</label>
                <input className="hcg-input" placeholder="Search opponent..." value={wagerForm.opponent} onChange={(e) => setWagerForm((f) => ({ ...f, opponent: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-hcg-muted font-medium">Wager Amount ($)</label>
                  <div className="relative">
                    <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-hcg-muted" />
                    <input className="hcg-input pl-8" type="number" placeholder="25.00" value={wagerForm.amount} onChange={(e) => setWagerForm((f) => ({ ...f, amount: e.target.value }))} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-hcg-muted font-medium">Game</label>
                  <select className="hcg-input" value={wagerForm.game} onChange={(e) => setWagerForm((f) => ({ ...f, game: e.target.value }))}>
                    <option value="">Select game...</option>
                    <option>Call of Duty</option><option>Valorant</option><option>Apex Legends</option>
                    <option>Rocket League</option><option>CS2</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-hcg-muted font-medium">Game Mode</label>
                <input className="hcg-input" placeholder="e.g. 1v1 Gunfight, 5v5 Competitive..." value={wagerForm.mode} onChange={(e) => setWagerForm((f) => ({ ...f, mode: e.target.value }))} />
              </div>
              <div className="p-3 rounded-lg bg-hcg-gold/5 border border-hcg-gold/10 text-xs text-hcg-muted">
                <p><strong className="text-foreground">Platform Fee:</strong> 7% on winning wagers (deducted from payout)</p>
                <p className="mt-1"><strong className="text-foreground">Escrow:</strong> Funds locked immediately upon both parties accepting</p>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1">Send Challenge</Button>
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
