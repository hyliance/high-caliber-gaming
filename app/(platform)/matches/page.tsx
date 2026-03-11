"use client";

import { useState } from "react";
import {
  Swords,
  Search,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Loader2,
  Trophy,
  Shield,
  Zap,
  Users,
  User,
  X,
  Send,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type MatchFormat = "1v1" | "2v2" | "5v5";
type MatchMode = "Ranked" | "Wager" | "Tournament" | "Scrimmage";
type MatchStatus = "IN_PROGRESS" | "PENDING_REPORT" | "DISPUTED" | "COMPLETED";
type DisputeStatus = "OPEN" | "UNDER_REVIEW" | "RESOLVED";

interface ActiveMatch {
  id: string;
  opponent: string;
  opponentElo: number;
  game: string;
  mode: MatchMode;
  format: MatchFormat;
  startedAt: string;
  status: MatchStatus;
  wager?: number;
}

interface PendingReport {
  id: string;
  opponent: string;
  game: string;
  format: MatchFormat;
  endedAt: string;
  wager?: number;
}

interface Dispute {
  id: string;
  matchId: string;
  opponent: string;
  game: string;
  status: DisputeStatus;
  openedAt: string;
  moderator?: string;
}

interface MatchHistory {
  id: string;
  opponent: string;
  game: string;
  result: "W" | "L";
  score: string;
  type: MatchMode;
  format: MatchFormat;
  date: string;
  earnings: number;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const GAMES = [
  "All Games",
  "Valorant",
  "FIFA 25",
  "Call of Duty: MW3",
  "NBA 2K25",
  "Madden NFL 25",
  "Fortnite",
  "Rocket League",
  "Street Fighter 6",
];

const activeMatches: ActiveMatch[] = [
  {
    id: "m001",
    opponent: "ShadowStrike99",
    opponentElo: 1842,
    game: "Valorant",
    mode: "Ranked",
    format: "1v1",
    startedAt: "14 min ago",
    status: "IN_PROGRESS",
    wager: 25,
  },
  {
    id: "m002",
    opponent: "GridironKing",
    opponentElo: 1605,
    game: "Madden NFL 25",
    mode: "Wager",
    format: "1v1",
    startedAt: "3 min ago",
    status: "IN_PROGRESS",
    wager: 50,
  },
];

const pendingReports: PendingReport[] = [
  {
    id: "p001",
    opponent: "NightOwlGamer",
    game: "NBA 2K25",
    format: "1v1",
    endedAt: "22 min ago",
    wager: 10,
  },
  {
    id: "p002",
    opponent: "TeamBlaze",
    game: "Valorant",
    format: "5v5",
    endedAt: "1 hr ago",
  },
];

const disputes: Dispute[] = [
  {
    id: "d001",
    matchId: "MTH-4821",
    opponent: "ProSniper77",
    game: "Call of Duty: MW3",
    status: "UNDER_REVIEW",
    openedAt: "2 hrs ago",
    moderator: "Mod_Alex",
  },
  {
    id: "d002",
    matchId: "MTH-4799",
    opponent: "QuickDraw_X",
    game: "Valorant",
    status: "OPEN",
    openedAt: "5 hrs ago",
  },
];

const recentHistory: MatchHistory[] = [
  { id: "h1", opponent: "IronFist88", game: "Valorant", result: "W", score: "13-7", type: "Ranked", format: "1v1", date: "Mar 10", earnings: 0 },
  { id: "h2", opponent: "CourtKing23", game: "NBA 2K25", result: "L", score: "98-105", type: "Wager", format: "1v1", date: "Mar 10", earnings: -15 },
  { id: "h3", opponent: "GridPro", game: "Madden NFL 25", result: "W", score: "31-17", type: "Wager", format: "1v1", date: "Mar 9", earnings: 50 },
  { id: "h4", opponent: "SkyRocker", game: "Rocket League", result: "W", score: "3-1", type: "Ranked", format: "2v2", date: "Mar 9", earnings: 0 },
  { id: "h5", opponent: "BlazeForce", game: "Valorant", result: "L", score: "10-13", type: "Tournament", format: "5v5", date: "Mar 8", earnings: 0 },
  { id: "h6", opponent: "DribbleMaster", game: "FIFA 25", result: "W", score: "4-2", type: "Wager", format: "1v1", date: "Mar 8", earnings: 30 },
  { id: "h7", opponent: "NightHawk", game: "Fortnite", result: "W", score: "1st/100", type: "Tournament", format: "1v1", date: "Mar 7", earnings: 200 },
  { id: "h8", opponent: "TacticalGhost", game: "Call of Duty: MW3", result: "L", score: "42-50", type: "Wager", format: "1v1", date: "Mar 7", earnings: -25 },
  { id: "h9", opponent: "PixelWarrior", game: "Street Fighter 6", result: "W", score: "3-1", type: "Ranked", format: "1v1", date: "Mar 6", earnings: 0 },
  { id: "h10", opponent: "AceSniper", game: "Call of Duty: MW3", result: "W", score: "55-48", type: "Wager", format: "1v1", date: "Mar 6", earnings: 40 },
  { id: "h11", opponent: "GoldRoller", game: "Rocket League", result: "L", score: "0-3", type: "Ranked", format: "1v1", date: "Mar 5", earnings: 0 },
  { id: "h12", opponent: "NetBreaker", game: "NBA 2K25", result: "W", score: "112-101", type: "Wager", format: "1v1", date: "Mar 5", earnings: 20 },
  { id: "h13", opponent: "StrikeForce", game: "Valorant", result: "W", score: "13-11", type: "Ranked", format: "1v1", date: "Mar 4", earnings: 0 },
  { id: "h14", opponent: "ClassicKing", game: "FIFA 25", result: "L", score: "1-3", type: "Wager", format: "1v1", date: "Mar 4", earnings: -10 },
  { id: "h15", opponent: "TurboSmash", game: "Street Fighter 6", result: "W", score: "3-0", type: "Ranked", format: "1v1", date: "Mar 3", earnings: 0 },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: MatchStatus | DisputeStatus }) {
  const map: Record<string, { label: string; className: string }> = {
    IN_PROGRESS: { label: "LIVE", className: "hcg-badge-green" },
    PENDING_REPORT: { label: "PENDING", className: "hcg-badge-gold" },
    DISPUTED: { label: "DISPUTED", className: "hcg-badge-red" },
    COMPLETED: { label: "COMPLETED", className: "hcg-badge bg-hcg-border/40 text-hcg-muted border border-hcg-border" },
    OPEN: { label: "OPEN", className: "hcg-badge-red" },
    UNDER_REVIEW: { label: "UNDER REVIEW", className: "hcg-badge-gold" },
    RESOLVED: { label: "RESOLVED", className: "hcg-badge-green" },
  };
  const cfg = map[status] ?? { label: status, className: "hcg-badge-gold" };
  return <span className={cfg.className}>{cfg.label}</span>;
}

function MatchmakingModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="hcg-card w-full max-w-md text-center">
        <div className="flex justify-end mb-2">
          <button onClick={onClose} className="text-hcg-muted hover:text-foreground">
            <X size={18} />
          </button>
        </div>
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-full border-4 border-hcg-border flex items-center justify-center">
              <Swords size={32} className="text-hcg-gold" />
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-hcg-gold border-t-transparent animate-spin" />
          </div>
          <div>
            <h3 className="text-xl font-display font-bold text-foreground">Finding Your Match</h3>
            <p className="text-sm text-hcg-muted mt-1">Searching for opponents with similar skill rating...</p>
          </div>
          <div className="flex gap-2 items-center text-sm text-hcg-muted">
            <Loader2 size={14} className="animate-spin text-hcg-gold" />
            <span>Est. wait time: <span className="text-foreground font-medium">~45 seconds</span></span>
          </div>
          <div className="w-full bg-hcg-border/40 rounded-full h-1.5 mt-2">
            <div className="bg-hcg-gold h-1.5 rounded-full w-2/3 animate-pulse" />
          </div>
          <button onClick={onClose} className="hcg-btn-outline text-xs mt-2">
            Cancel Queue
          </button>
        </div>
      </div>
    </div>
  );
}

function ChallengeModal({ tag, onClose }: { tag: string; onClose: () => void }) {
  const [game, setGame] = useState("Valorant");
  const [format, setFormat] = useState<MatchFormat>("1v1");
  const [wager, setWager] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="hcg-card w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-display font-bold text-foreground flex items-center gap-2">
            <Swords size={18} className="text-hcg-gold" />
            Challenge {tag}
          </h3>
          <button onClick={onClose} className="text-hcg-muted hover:text-foreground">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-hcg-muted mb-1">Game</label>
            <select
              value={game}
              onChange={(e) => setGame(e.target.value)}
              className="hcg-input"
            >
              {GAMES.slice(1).map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-hcg-muted mb-1">Format</label>
            <div className="flex gap-2">
              {(["1v1", "2v2", "5v5"] as MatchFormat[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    format === f
                      ? "bg-hcg-gold text-hcg-bg border-hcg-gold"
                      : "border-hcg-border text-hcg-muted hover:border-hcg-gold/40"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs text-hcg-muted mb-1">Wager Amount (optional)</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-hcg-gold text-sm font-bold">$</span>
              <input
                type="number"
                value={wager}
                onChange={(e) => setWager(e.target.value)}
                placeholder="0.00"
                className="hcg-input pl-7"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <button onClick={onClose} className="hcg-btn-outline flex-1">Cancel</button>
            <button className="hcg-btn-primary flex-1">
              <Send size={14} />
              Send Challenge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MatchesPage() {
  const [selectedGame, setSelectedGame] = useState("All Games");
  const [selectedMode, setSelectedMode] = useState<MatchMode>("Ranked");
  const [selectedFormat, setSelectedFormat] = useState<MatchFormat>("1v1");
  const [sbmm, setSbmm] = useState(true);
  const [queuing, setQueuing] = useState(false);
  const [searchTag, setSearchTag] = useState("");
  const [challengeTarget, setChallengeTarget] = useState<string | null>(null);
  const [historyFilter, setHistoryFilter] = useState("All");

  const filteredHistory =
    historyFilter === "All"
      ? recentHistory
      : recentHistory.filter((m) => m.result === historyFilter || m.type === historyFilter);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold hcg-gradient-text">Matches</h1>
        <p className="text-sm text-hcg-muted mt-1">Queue up, report results, and review your history</p>
      </div>

      {/* Find a Match */}
      <div className="hcg-card">
        <h2 className="section-title flex items-center gap-2 mb-4">
          <Zap size={18} className="text-hcg-gold" />
          Find a Match
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          {/* Game Selector */}
          <div>
            <label className="block text-xs text-hcg-muted mb-1">Game</label>
            <select
              value={selectedGame}
              onChange={(e) => setSelectedGame(e.target.value)}
              className="hcg-input"
            >
              {GAMES.map((g) => <option key={g}>{g}</option>)}
            </select>
          </div>
          {/* Mode */}
          <div>
            <label className="block text-xs text-hcg-muted mb-1">Mode</label>
            <select
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value as MatchMode)}
              className="hcg-input"
            >
              {(["Ranked", "Wager", "Tournament", "Scrimmage"] as MatchMode[]).map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
          {/* Format */}
          <div>
            <label className="block text-xs text-hcg-muted mb-1">Format</label>
            <div className="flex gap-1">
              {(["1v1", "2v2", "5v5"] as MatchFormat[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setSelectedFormat(f)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${
                    selectedFormat === f
                      ? "bg-hcg-gold text-hcg-bg border-hcg-gold"
                      : "border-hcg-border text-hcg-muted hover:border-hcg-gold/40"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          {/* SBMM Toggle */}
          <div>
            <label className="block text-xs text-hcg-muted mb-1">Skill-Based Matchmaking</label>
            <div className="flex items-center gap-3 h-[38px]">
              <button
                onClick={() => setSbmm(!sbmm)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full border transition-colors ${
                  sbmm ? "bg-hcg-gold border-hcg-gold" : "bg-hcg-border border-hcg-border"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-hcg-bg transition-transform ${
                    sbmm ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${sbmm ? "text-hcg-gold" : "text-hcg-muted"}`}>
                {sbmm ? "ON" : "OFF"}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setQueuing(true)}
          className="hcg-btn-primary w-full md:w-auto px-8 animate-pulse-gold"
        >
          <Swords size={16} />
          Queue Up
        </button>
      </div>

      {/* Active Matches + Pending Reports side by side on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Active Matches */}
        <div className="hcg-card">
          <div className="section-header">
            <h2 className="section-title flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Active Matches
            </h2>
            <span className="text-xs text-hcg-muted">{activeMatches.length} active</span>
          </div>
          {activeMatches.length === 0 ? (
            <p className="text-sm text-hcg-muted text-center py-6">No active matches</p>
          ) : (
            <div className="space-y-3">
              {activeMatches.map((m) => (
                <div key={m.id} className="flex items-center justify-between rounded-lg border border-hcg-border bg-hcg-bg/40 p-3 hover:border-hcg-gold/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-hcg-border flex items-center justify-center">
                      <User size={16} className="text-hcg-muted" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{m.opponent}</span>
                        <span className="text-xs text-hcg-muted">({m.opponentElo})</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-hcg-muted">{m.game}</span>
                        <span className="text-hcg-muted/40">·</span>
                        <span className="text-xs text-hcg-muted">{m.format}</span>
                        {m.wager && (
                          <>
                            <span className="text-hcg-muted/40">·</span>
                            <span className="text-xs text-hcg-gold font-medium">${m.wager}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={m.status} />
                    <span className="text-xs text-hcg-muted">{m.startedAt}</span>
                    <ChevronRight size={14} className="text-hcg-muted" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Reports */}
        <div className="hcg-card">
          <div className="section-header">
            <h2 className="section-title flex items-center gap-2">
              <Clock size={16} className="text-hcg-gold" />
              Pending Reports
            </h2>
            <span className="text-xs text-hcg-muted">{pendingReports.length} pending</span>
          </div>
          {pendingReports.length === 0 ? (
            <p className="text-sm text-hcg-muted text-center py-6">No pending reports</p>
          ) : (
            <div className="space-y-3">
              {pendingReports.map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-lg border border-hcg-border bg-hcg-bg/40 p-3 hover:border-hcg-gold/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-hcg-border flex items-center justify-center">
                      <User size={16} className="text-hcg-muted" />
                    </div>
                    <div>
                      <span className="text-sm font-medium text-foreground">{p.opponent}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-hcg-muted">{p.game}</span>
                        <span className="text-hcg-muted/40">·</span>
                        <span className="text-xs text-hcg-muted">{p.format}</span>
                        {p.wager && (
                          <>
                            <span className="text-hcg-muted/40">·</span>
                            <span className="text-xs text-hcg-gold font-medium">${p.wager}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-hcg-muted">{p.endedAt}</span>
                    <button className="hcg-btn-primary text-xs px-3 py-1.5">
                      Report Result
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Disputes */}
      <div className="hcg-card">
        <div className="section-header">
          <h2 className="section-title flex items-center gap-2">
            <AlertTriangle size={16} className="text-hcg-red" />
            Disputes
          </h2>
          <span className="text-xs text-hcg-muted">{disputes.length} active</span>
        </div>
        {disputes.length === 0 ? (
          <p className="text-sm text-hcg-muted text-center py-4">No active disputes</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-hcg-border">
                  {["Match ID", "Opponent", "Game", "Opened", "Moderator", "Status", "Action"].map((h) => (
                    <th key={h} className="text-left text-xs text-hcg-muted font-medium pb-2 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-hcg-border/40">
                {disputes.map((d) => (
                  <tr key={d.id} className="hover:bg-hcg-card-hover/30 transition-colors">
                    <td className="py-2 pr-4 font-mono text-xs text-hcg-gold">{d.matchId}</td>
                    <td className="py-2 pr-4 text-foreground font-medium">{d.opponent}</td>
                    <td className="py-2 pr-4 text-hcg-muted">{d.game}</td>
                    <td className="py-2 pr-4 text-hcg-muted">{d.openedAt}</td>
                    <td className="py-2 pr-4 text-hcg-muted">{d.moderator ?? "Unassigned"}</td>
                    <td className="py-2 pr-4">
                      <StatusBadge status={d.status} />
                    </td>
                    <td className="py-2">
                      <a href={`/disputes/${d.id}`} className="text-xs text-hcg-gold hover:underline flex items-center gap-1">
                        View <ChevronRight size={12} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Match History */}
      <div className="hcg-card">
        <div className="section-header">
          <h2 className="section-title flex items-center gap-2">
            <Trophy size={16} className="text-hcg-gold" />
            Recent Match History
          </h2>
          <div className="flex items-center gap-2">
            {["All", "W", "L", "Ranked", "Wager", "Tournament"].map((f) => (
              <button
                key={f}
                onClick={() => setHistoryFilter(f)}
                className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                  historyFilter === f
                    ? "bg-hcg-gold/10 border-hcg-gold/30 text-hcg-gold"
                    : "border-hcg-border text-hcg-muted hover:border-hcg-gold/20"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-hcg-border">
                {["Opponent", "Game", "Result", "Score", "Type", "Format", "Date", "Earnings"].map((h) => (
                  <th key={h} className="text-left text-xs text-hcg-muted font-medium pb-2 pr-4 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-hcg-border/40">
              {filteredHistory.map((m) => (
                <tr key={m.id} className="hover:bg-hcg-card-hover/30 transition-colors">
                  <td className="py-2 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-hcg-border flex items-center justify-center flex-shrink-0">
                        <User size={12} className="text-hcg-muted" />
                      </div>
                      <span className="text-foreground font-medium whitespace-nowrap">{m.opponent}</span>
                    </div>
                  </td>
                  <td className="py-2 pr-4 text-hcg-muted whitespace-nowrap">{m.game}</td>
                  <td className="py-2 pr-4">
                    <span className={`font-bold text-base ${m.result === "W" ? "text-green-400" : "text-hcg-red"}`}>
                      {m.result}
                    </span>
                  </td>
                  <td className="py-2 pr-4 font-mono text-xs text-foreground">{m.score}</td>
                  <td className="py-2 pr-4">
                    <span className={`text-xs font-medium ${
                      m.type === "Wager" ? "text-hcg-gold" :
                      m.type === "Tournament" ? "text-purple-400" :
                      "text-hcg-muted"
                    }`}>{m.type}</span>
                  </td>
                  <td className="py-2 pr-4 text-hcg-muted">{m.format}</td>
                  <td className="py-2 pr-4 text-hcg-muted whitespace-nowrap">{m.date}</td>
                  <td className="py-2 pr-4">
                    {m.earnings !== 0 ? (
                      <span className={`font-medium ${m.earnings > 0 ? "text-green-400" : "text-hcg-red"}`}>
                        {m.earnings > 0 ? "+" : ""}${Math.abs(m.earnings)}
                      </span>
                    ) : (
                      <span className="text-hcg-muted">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Challenge a Player */}
      <div className="hcg-card">
        <h2 className="section-title flex items-center gap-2 mb-4">
          <Shield size={18} className="text-hcg-gold" />
          Challenge a Player
        </h2>
        <div className="flex gap-2 max-w-md">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-hcg-muted" />
            <input
              type="text"
              placeholder="Search by gamer tag..."
              value={searchTag}
              onChange={(e) => setSearchTag(e.target.value)}
              className="hcg-input pl-9"
            />
          </div>
          <button
            onClick={() => searchTag.trim() && setChallengeTarget(searchTag.trim())}
            className="hcg-btn-primary"
          >
            <Swords size={14} />
            Challenge
          </button>
        </div>
        {searchTag && (
          <div className="mt-3 rounded-lg border border-hcg-border bg-hcg-bg/40 p-3 max-w-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-hcg-border flex items-center justify-center">
                  <User size={16} className="text-hcg-muted" />
                </div>
                <div>
                  <span className="text-sm font-medium text-foreground">{searchTag}</span>
                  <div className="text-xs text-hcg-muted">ELO 1721 · Diamond III</div>
                </div>
              </div>
              <button
                onClick={() => setChallengeTarget(searchTag)}
                className="hcg-btn-primary text-xs px-3 py-1.5"
              >
                <Swords size={12} />
                Challenge
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {queuing && <MatchmakingModal onClose={() => setQueuing(false)} />}
      {challengeTarget && <ChallengeModal tag={challengeTarget} onClose={() => setChallengeTarget(null)} />}
    </div>
  );
}
