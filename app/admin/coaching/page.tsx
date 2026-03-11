"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap, CheckCircle, XCircle, Eye, Clock,
  Star, MessageSquare, User, Gamepad2, ChevronDown
} from "lucide-react";
import { timeAgo } from "@/lib/utils";

type AppStatus = "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";

const MOCK_APPLICATIONS = [
  {
    id: "app1",
    applicantTag: "ProCoach_Valo",
    email: "coach1@example.com",
    games: ["Valorant"],
    tier: "RADIANT",
    yearsExperience: 4,
    bio: "Former pro player with 4 years experience. 3x Radiant ranked. Helped 50+ students reach Diamond+. I focus on game sense, aim, and communication.",
    sessionTypes: ["1-ON-1_VIDEO", "VOD_REVIEW"],
    hourlyRate: 6000,
    portfolioUrls: ["https://tracker.gg/valorant/profile/riot/ProCoach_Valo"],
    achievements: "Top 500 Global Season 4, 5, 6. Semi-finalist VCT Challengers Open.",
    status: "PENDING" as AppStatus,
    submittedAt: new Date(Date.now() - 3600000 * 6),
  },
  {
    id: "app2",
    applicantTag: "CodeRed_Coach",
    email: "coach2@example.com",
    games: ["Call of Duty", "Apex Legends"],
    tier: "CRIMSON",
    yearsExperience: 3,
    bio: "Full-time content creator and coach. Specialized in movement and positioning for BR games. 200+ students coached.",
    sessionTypes: ["1-ON-1_VIDEO", "WRITTEN_ANALYSIS"],
    hourlyRate: 4500,
    portfolioUrls: [],
    achievements: "Crimson 3 CoD, Masters Apex. 1st place HCG Weekly Cup x3.",
    status: "UNDER_REVIEW" as AppStatus,
    submittedAt: new Date(Date.now() - 3600000 * 28),
  },
  {
    id: "app3",
    applicantTag: "StratMaster99",
    email: "coach3@example.com",
    games: ["Valorant", "CS2"],
    tier: "IMMORTAL",
    yearsExperience: 6,
    bio: "Strategy and IGL coach. 6 years playing at a high level. Focus on macro game, team coordination, and economy management.",
    sessionTypes: ["1-ON-1_VIDEO", "VOD_REVIEW", "TEAM_SESSION"],
    hourlyRate: 8000,
    portfolioUrls: ["https://youtube.com/c/StratMaster99"],
    achievements: "IGL for regional T2 team. Multiple top-8 finishes at Open Qualifiers.",
    status: "PENDING" as AppStatus,
    submittedAt: new Date(Date.now() - 3600000 * 48),
  },
];

const STATUS_CONFIG: Record<AppStatus, { label: string; color: string }> = {
  PENDING: { label: "Pending", color: "bg-yellow-400/10 text-yellow-400 border-yellow-400/30" },
  UNDER_REVIEW: { label: "Under Review", color: "bg-blue-400/10 text-blue-400 border-blue-400/30" },
  APPROVED: { label: "Approved", color: "bg-green-400/10 text-green-400 border-green-400/30" },
  REJECTED: { label: "Rejected", color: "bg-hcg-red/10 text-hcg-red border-hcg-red/30" },
};

export default function AdminCoachingPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [adminNote, setAdminNote] = useState("");

  const filtered = MOCK_APPLICATIONS.filter(
    (a) => statusFilter === "all" || a.status === statusFilter
  );

  const pendingCount = MOCK_APPLICATIONS.filter((a) => a.status === "PENDING" || a.status === "UNDER_REVIEW").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <GraduationCap size={22} className="text-hcg-gold" /> Coach Applications
          </h1>
          <p className="text-sm text-hcg-muted mt-1">{pendingCount} applications pending review</p>
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="hcg-input w-40">
          <option value="all">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="UNDER_REVIEW">Under Review</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Pending Review", value: MOCK_APPLICATIONS.filter(a => a.status === "PENDING").length, color: "text-yellow-400" },
          { label: "Under Review", value: MOCK_APPLICATIONS.filter(a => a.status === "UNDER_REVIEW").length, color: "text-blue-400" },
          { label: "Total Coaches", value: 48, color: "text-green-400" },
          { label: "Avg Response Time", value: "18h", color: "text-hcg-muted" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <p className={`text-2xl font-display font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-hcg-muted mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Application cards */}
      <div className="space-y-3">
        {filtered.map((app) => {
          const isExpanded = expanded === app.id;
          const cfg = STATUS_CONFIG[app.status];

          return (
            <Card key={app.id} className={app.status === "PENDING" ? "border-yellow-400/20" : ""}>
              <CardContent className="p-4">
                {/* Summary row */}
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-hcg-bg border border-hcg-border flex items-center justify-center font-bold text-sm">
                    {app.applicantTag.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold">{app.applicantTag}</span>
                      <span className={`text-xs border rounded px-1.5 py-0.5 ${cfg.color}`}>{cfg.label}</span>
                      <span className="text-xs text-hcg-muted">{app.tier}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-hcg-muted mt-0.5">
                      <span className="flex items-center gap-1"><Gamepad2 size={10} /> {app.games.join(", ")}</span>
                      <span className="flex items-center gap-1"><Clock size={10} /> {timeAgo(app.submittedAt)}</span>
                      <span>${(app.hourlyRate / 100).toFixed(0)}/hr</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {(app.status === "PENDING" || app.status === "UNDER_REVIEW") && (
                      <>
                        <Button size="sm" variant="outline" className="text-green-400 border-green-400/30 hover:bg-green-400/10 gap-1">
                          <CheckCircle size={12} /> Approve
                        </Button>
                        <Button size="sm" variant="outline" className="text-hcg-red border-hcg-red/30 hover:bg-hcg-red/10 gap-1">
                          <XCircle size={12} /> Reject
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="px-2"
                      onClick={() => setExpanded(isExpanded ? null : app.id)}
                    >
                      <ChevronDown size={14} className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                    </Button>
                  </div>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-hcg-border space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-hcg-muted uppercase tracking-wider mb-1">Bio</p>
                        <p className="text-sm">{app.bio}</p>
                      </div>
                      <div>
                        <p className="text-xs text-hcg-muted uppercase tracking-wider mb-1">Achievements</p>
                        <p className="text-sm">{app.achievements}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-hcg-muted mb-0.5">Session Types</p>
                        <p>{app.sessionTypes.map((s) => s.replace(/_/g, " ")).join(", ")}</p>
                      </div>
                      <div>
                        <p className="text-xs text-hcg-muted mb-0.5">Experience</p>
                        <p>{app.yearsExperience} years</p>
                      </div>
                      <div>
                        <p className="text-xs text-hcg-muted mb-0.5">Email</p>
                        <p className="truncate">{app.email}</p>
                      </div>
                      <div>
                        <p className="text-xs text-hcg-muted mb-0.5">Portfolio</p>
                        <p>{app.portfolioUrls.length > 0 ? `${app.portfolioUrls.length} link(s)` : "None"}</p>
                      </div>
                    </div>

                    {/* Admin note */}
                    <div>
                      <label className="text-xs text-hcg-muted mb-1 block">Admin Note (sent to applicant)</label>
                      <textarea
                        className="hcg-input w-full h-20 resize-none text-sm"
                        placeholder="Optional note explaining decision or requesting more info..."
                        value={adminNote}
                        onChange={(e) => setAdminNote(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
