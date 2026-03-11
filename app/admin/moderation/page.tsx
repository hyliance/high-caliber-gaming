"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Shield, Flag, AlertTriangle, MessageSquare, CheckCircle,
  XCircle, Eye, Ban, Clock, User, ChevronDown, Swords
} from "lucide-react";
import { timeAgo } from "@/lib/utils";

type ReportStatus = "OPEN" | "UNDER_REVIEW" | "RESOLVED" | "DISMISSED";
type DisputeStatus = "OPEN" | "EVIDENCE_PHASE" | "ADMIN_REVIEW" | "RESOLVED";

const MOCK_REPORTS = [
  { id: "r1", type: "HARASSMENT", reportedUser: "DarkSniper99", reportedBy: "Player441", description: "Repeated racist slurs in match chat and DMs after the game.", status: "OPEN" as ReportStatus, createdAt: new Date(Date.now() - 3600000 * 1) },
  { id: "r2", type: "CHEATING", reportedUser: "AimBot_King", reportedBy: "Player224", description: "Suspicious aimlock behavior throughout entire Valorant match. Clip attached.", status: "UNDER_REVIEW" as ReportStatus, createdAt: new Date(Date.now() - 3600000 * 4) },
  { id: "r3", type: "MATCH_MANIPULATION", reportedUser: "ScoreManip", reportedBy: "Player891", description: "Player submitted false match score. I have screenshots of actual result.", status: "OPEN" as ReportStatus, createdAt: new Date(Date.now() - 3600000 * 8) },
  { id: "r4", type: "SPAM", reportedUser: "SpamAccount", reportedBy: "Player117", description: "Posting spam links in community forum repeatedly.", status: "RESOLVED" as ReportStatus, createdAt: new Date(Date.now() - 3600000 * 24) },
];

const MOCK_DISPUTES = [
  { id: "d1", matchId: "match_2841", game: "Valorant", challenger: "ProHunter", challenged: "ShadowEdge", wagerAmount: 5000, reason: "Opponent disconnected intentionally after going down 10-4 and claims a technical issue.", status: "EVIDENCE_PHASE" as DisputeStatus, deadline: new Date(Date.now() + 3600000 * 2), createdAt: new Date(Date.now() - 3600000 * 22) },
  { id: "d2", matchId: "match_2804", game: "CoD", challenger: "IronWolf", challenged: "DustDevil", wagerAmount: 2500, reason: "Disputed score submission — both players submitted different scores.", status: "ADMIN_REVIEW" as DisputeStatus, deadline: null, createdAt: new Date(Date.now() - 3600000 * 48) },
];

const REPORT_TYPE_COLOR: Record<string, string> = {
  HARASSMENT: "text-red-400",
  CHEATING: "text-orange-400",
  MATCH_MANIPULATION: "text-yellow-400",
  SPAM: "text-blue-400",
  INAPPROPRIATE_CONTENT: "text-purple-400",
};

const REPORT_STATUS_BADGE: Record<ReportStatus, string> = {
  OPEN: "bg-yellow-400/10 text-yellow-400 border-yellow-400/30",
  UNDER_REVIEW: "bg-blue-400/10 text-blue-400 border-blue-400/30",
  RESOLVED: "bg-green-400/10 text-green-400 border-green-400/30",
  DISMISSED: "bg-hcg-muted/10 text-hcg-muted border-hcg-border",
};

const DISPUTE_STATUS_BADGE: Record<DisputeStatus, string> = {
  OPEN: "bg-yellow-400/10 text-yellow-400 border-yellow-400/30",
  EVIDENCE_PHASE: "bg-blue-400/10 text-blue-400 border-blue-400/30",
  ADMIN_REVIEW: "bg-orange-400/10 text-orange-400 border-orange-400/30",
  RESOLVED: "bg-green-400/10 text-green-400 border-green-400/30",
};

type Tab = "reports" | "disputes" | "flagged";

export default function AdminModerationPage() {
  const [tab, setTab] = useState<Tab>("reports");
  const [expanded, setExpanded] = useState<string | null>(null);

  const openReports = MOCK_REPORTS.filter((r) => r.status === "OPEN" || r.status === "UNDER_REVIEW").length;
  const openDisputes = MOCK_DISPUTES.filter((d) => d.status !== "RESOLVED").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold flex items-center gap-2">
          <Shield size={22} className="text-hcg-gold" /> Moderation
        </h1>
        <p className="text-sm text-hcg-muted mt-1">Reports, disputes, and flagged content</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Open Reports", value: openReports, color: "text-orange-400" },
          { label: "Active Disputes", value: openDisputes, color: "text-hcg-red" },
          { label: "Resolved (30d)", value: 148, color: "text-green-400" },
          { label: "Avg Resolution", value: "6.2h", color: "text-hcg-muted" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <p className={`text-2xl font-display font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-hcg-muted mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-hcg-border">
        {(["reports", "disputes", "flagged"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px flex items-center gap-2 ${
              tab === t ? "border-hcg-gold text-hcg-gold" : "border-transparent text-hcg-muted hover:text-foreground"
            }`}
          >
            {t === "reports" && <Flag size={13} />}
            {t === "disputes" && <Swords size={13} />}
            {t === "flagged" && <AlertTriangle size={13} />}
            {t === "reports" ? "User Reports" : t === "disputes" ? "Disputes" : "Flagged Content"}
            {t === "reports" && openReports > 0 && (
              <span className="bg-hcg-red text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{openReports}</span>
            )}
            {t === "disputes" && openDisputes > 0 && (
              <span className="bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">{openDisputes}</span>
            )}
          </button>
        ))}
      </div>

      {/* Reports */}
      {tab === "reports" && (
        <div className="space-y-3">
          {MOCK_REPORTS.map((report) => {
            const isExpanded = expanded === report.id;
            return (
              <Card key={report.id} className={report.status === "OPEN" ? "border-orange-500/20" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Flag size={14} className={REPORT_TYPE_COLOR[report.type] ?? "text-hcg-muted"} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">{report.type.replace(/_/g, " ")}</span>
                        <span className={`text-xs border rounded px-1.5 py-0.5 ${REPORT_STATUS_BADGE[report.status]}`}>
                          {report.status.replace(/_/g, " ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-hcg-muted mt-0.5">
                        <span>Reported: <strong className="text-foreground">{report.reportedUser}</strong></span>
                        <span>By: {report.reportedBy}</span>
                        <span className="flex items-center gap-1"><Clock size={10} /> {timeAgo(report.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {(report.status === "OPEN" || report.status === "UNDER_REVIEW") && (
                        <>
                          <Button size="sm" variant="outline" className="text-hcg-red border-hcg-red/30 gap-1 text-xs">
                            <Ban size={11} /> Ban
                          </Button>
                          <Button size="sm" variant="outline" className="text-green-400 border-green-400/30 gap-1 text-xs">
                            <CheckCircle size={11} /> Dismiss
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="ghost" className="px-2" onClick={() => setExpanded(isExpanded ? null : report.id)}>
                        <ChevronDown size={14} className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </Button>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-hcg-border">
                      <p className="text-sm">{report.description}</p>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" className="gap-1">
                          <Eye size={12} /> View Profile
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1 text-blue-400 border-blue-400/30">
                          <MessageSquare size={12} /> View Chat
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1">
                          Mark Under Review
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Disputes */}
      {tab === "disputes" && (
        <div className="space-y-3">
          {MOCK_DISPUTES.map((dispute) => {
            const isExpanded = expanded === dispute.id;
            return (
              <Card key={dispute.id} className={dispute.status === "ADMIN_REVIEW" ? "border-orange-500/20" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Swords size={14} className="text-hcg-muted" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">Match #{dispute.matchId.split("_")[1]}</span>
                        <span className="text-xs text-hcg-muted">{dispute.game}</span>
                        <span className={`text-xs border rounded px-1.5 py-0.5 ${DISPUTE_STATUS_BADGE[dispute.status]}`}>
                          {dispute.status.replace(/_/g, " ")}
                        </span>
                        {dispute.deadline && dispute.deadline > new Date() && (
                          <span className="text-xs text-orange-400 flex items-center gap-1">
                            <Clock size={10} /> Deadline {timeAgo(dispute.deadline)}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-hcg-muted mt-0.5">
                        <span>{dispute.challenger} vs {dispute.challenged}</span>
                        <span>Wager: ${(dispute.wagerAmount / 100).toFixed(0)}</span>
                        <span className="flex items-center gap-1"><Clock size={10} /> {timeAgo(dispute.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Button size="sm" variant="outline" className="gap-1 text-xs" onClick={() => setExpanded(isExpanded ? null : dispute.id)}>
                        <Eye size={11} /> Review
                        <ChevronDown size={12} className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </Button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-hcg-border space-y-3">
                      <p className="text-sm">{dispute.reason}</p>
                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="gap-2 text-sm">
                          <User size={13} /> View {dispute.challenger}&apos;s Evidence
                        </Button>
                        <Button variant="outline" className="gap-2 text-sm">
                          <User size={13} /> View {dispute.challenged}&apos;s Evidence
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="gap-1 flex-1">Award {dispute.challenger}</Button>
                        <Button size="sm" variant="outline" className="gap-1 flex-1">Award {dispute.challenged}</Button>
                        <Button size="sm" variant="outline" className="text-orange-400 border-orange-400/30">Split Pot</Button>
                        <Button size="sm" variant="outline" className="text-hcg-muted">Refund Both</Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Flagged Content */}
      {tab === "flagged" && (
        <Card>
          <CardContent className="p-6 text-center">
            <AlertTriangle size={32} className="text-hcg-muted mx-auto mb-3" />
            <p className="text-hcg-muted">No flagged content at this time.</p>
            <p className="text-sm text-hcg-muted mt-1">Posts and comments flagged by the auto-moderation system will appear here.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
