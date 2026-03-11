"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Gamepad2, Plus, CheckCircle, XCircle, MessageSquare,
  Edit2, Eye, EyeOff, Trash2, Search, Clock, User
} from "lucide-react";
import { timeAgo } from "@/lib/utils";

const MOCK_GAMES = [
  { id: "g1", title: "Valorant", publisher: "Riot Games", isActive: true, modesCount: 4, matchesTotal: 48200, wagerEnabled: true },
  { id: "g2", title: "Call of Duty: Black Ops 6", publisher: "Activision", isActive: true, modesCount: 6, matchesTotal: 31400, wagerEnabled: true },
  { id: "g3", title: "Apex Legends", publisher: "EA/Respawn", isActive: true, modesCount: 2, matchesTotal: 19800, wagerEnabled: true },
  { id: "g4", title: "CS2", publisher: "Valve", isActive: true, modesCount: 3, matchesTotal: 14200, wagerEnabled: true },
  { id: "g5", title: "Fortnite", publisher: "Epic Games", isActive: true, modesCount: 3, matchesTotal: 9600, wagerEnabled: false },
  { id: "g6", title: "Rocket League", publisher: "Psyonix", isActive: true, modesCount: 2, matchesTotal: 7200, wagerEnabled: true },
  { id: "g7", title: "League of Legends", publisher: "Riot Games", isActive: false, modesCount: 1, matchesTotal: 2100, wagerEnabled: false },
];

const MOCK_REQUESTS = [
  {
    id: "req1", title: "Overwatch 2", publisher: "Blizzard", requestedBy: "ShadowStrike", submittedAt: new Date(Date.now() - 3600000 * 26),
    reason: "Large active community on platform. Multiple users have requested this title. OW2 has ranked modes perfect for ladders.",
    status: "PENDING",
  },
  {
    id: "req2", title: "Halo Infinite", publisher: "343 Industries / Xbox", requestedBy: "NightOwl_87", submittedAt: new Date(Date.now() - 3600000 * 72),
    reason: "Halo has a dedicated competitive scene. Would love to see 4v4 Slayer and Oddball as game modes.",
    status: "PENDING",
  },
  {
    id: "req3", title: "Rainbow Six Siege", publisher: "Ubisoft", requestedBy: "ProHunter_X", submittedAt: new Date(Date.now() - 3600000 * 120),
    reason: "R6 has one of the best ranked systems. Competitive 5v5 would work great on HCG.",
    status: "MORE_INFO",
  },
  {
    id: "req4", title: "Minecraft", publisher: "Mojang", requestedBy: "CubeMaster", submittedAt: new Date(Date.now() - 3600000 * 200),
    reason: "Minecraft PVP tournaments would be unique and attract a different audience.",
    status: "REJECTED",
  },
];

type RequestStatus = "PENDING" | "MORE_INFO" | "APPROVED" | "REJECTED";

const STATUS_BADGE: Record<RequestStatus, string> = {
  PENDING: "bg-yellow-400/10 text-yellow-400 border-yellow-400/30",
  MORE_INFO: "bg-blue-400/10 text-blue-400 border-blue-400/30",
  APPROVED: "bg-green-400/10 text-green-400 border-green-400/30",
  REJECTED: "bg-hcg-red/10 text-hcg-red border-hcg-red/30",
};

export default function AdminGamesPage() {
  const [activeTab, setActiveTab] = useState<"games" | "requests">("games");
  const [showAddGame, setShowAddGame] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [requestNote, setRequestNote] = useState("");

  const pendingCount = MOCK_REQUESTS.filter((r) => r.status === "PENDING").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <Gamepad2 size={22} className="text-hcg-gold" /> Game Title Management
          </h1>
          <p className="text-sm text-hcg-muted mt-1">Manage supported games and review addition requests</p>
        </div>
        <Button className="gap-2" onClick={() => setShowAddGame(true)}>
          <Plus size={14} /> Add Game
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-hcg-border">
        {(["games", "requests"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px flex items-center gap-2 ${
              activeTab === t ? "border-hcg-gold text-hcg-gold" : "border-transparent text-hcg-muted hover:text-foreground"
            }`}
          >
            {t === "requests" ? "Title Requests" : "Active Games"}
            {t === "requests" && pendingCount > 0 && (
              <span className="bg-hcg-gold text-black text-xs font-bold px-1.5 py-0.5 rounded-full">{pendingCount}</span>
            )}
          </button>
        ))}
      </div>

      {activeTab === "games" && (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-hcg-border text-hcg-muted text-xs">
                  <th className="text-left p-3">Game Title</th>
                  <th className="text-left p-3">Publisher</th>
                  <th className="text-center p-3">Modes</th>
                  <th className="text-right p-3">Total Matches</th>
                  <th className="text-center p-3">Wagering</th>
                  <th className="text-center p-3">Status</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hcg-border/50">
                {MOCK_GAMES.map((g) => (
                  <tr key={g.id} className="hover:bg-hcg-card-hover/30">
                    <td className="p-3 font-semibold">{g.title}</td>
                    <td className="p-3 text-xs text-hcg-muted">{g.publisher}</td>
                    <td className="p-3 text-center text-xs">{g.modesCount}</td>
                    <td className="p-3 text-right text-xs">{g.matchesTotal.toLocaleString()}</td>
                    <td className="p-3 text-center">
                      {g.wagerEnabled ? (
                        <CheckCircle size={14} className="text-green-400 mx-auto" />
                      ) : (
                        <XCircle size={14} className="text-hcg-muted mx-auto" />
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`text-xs border rounded px-2 py-0.5 ${
                        g.isActive ? "text-green-400 border-green-400/30 bg-green-400/10" : "text-hcg-muted border-hcg-border"
                      }`}>
                        {g.isActive ? "Active" : "Hidden"}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Button size="sm" variant="ghost" className="h-7 px-2">
                          <Edit2 size={12} />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-7 px-2">
                          {g.isActive ? <EyeOff size={12} /> : <Eye size={12} />}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {activeTab === "requests" && (
        <div className="space-y-3">
          {MOCK_REQUESTS.map((req) => (
            <Card key={req.id} className={req.status === "PENDING" ? "border-yellow-400/20" : ""}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{req.title}</h3>
                      <span className="text-xs text-hcg-muted">{req.publisher}</span>
                      <span className={`text-xs border rounded px-1.5 py-0.5 ${STATUS_BADGE[req.status as RequestStatus]}`}>
                        {req.status.replace("_", " ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-hcg-muted mb-2">
                      <span className="flex items-center gap-1"><User size={10} /> {req.requestedBy}</span>
                      <span className="flex items-center gap-1"><Clock size={10} /> {timeAgo(req.submittedAt)}</span>
                    </div>
                    <p className="text-sm text-hcg-muted">{req.reason}</p>
                  </div>

                  {(req.status === "PENDING" || req.status === "MORE_INFO") && (
                    <div className="flex flex-col gap-2 shrink-0">
                      <Button size="sm" variant="outline" className="gap-1 text-green-400 border-green-400/30 hover:bg-green-400/10">
                        <CheckCircle size={12} /> Approve
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1 text-blue-400 border-blue-400/30 hover:bg-blue-400/10">
                        <MessageSquare size={12} /> More Info
                      </Button>
                      <Button size="sm" variant="outline" className="gap-1 text-hcg-red border-hcg-red/30 hover:bg-hcg-red/10">
                        <XCircle size={12} /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
