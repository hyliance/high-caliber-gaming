"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users, Trophy, DollarSign, Shield, TrendingUp, AlertTriangle,
  Zap, Flag, CheckCircle, Clock, Activity, Server
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { formatCurrency } from "@/lib/utils";

// Mock 30-day DAU data
const dauData = Array.from({ length: 30 }, (_, i) => ({
  day: `Mar ${i + 1}`,
  dau: Math.floor(Math.random() * 4000 + 6000),
  newUsers: Math.floor(Math.random() * 300 + 50),
}));

// Match volume by game
const matchVolumeData = [
  { game: "Valorant", matches: 2840 },
  { game: "CoD", matches: 1920 },
  { game: "Apex", matches: 1340 },
  { game: "CS2", matches: 980 },
  { game: "Fortnite", matches: 620 },
  { game: "RL", matches: 410 },
];

// Wager outcomes
const wagerData = [
  { name: "Completed", value: 68, color: "#22c55e" },
  { name: "Disputed", value: 8, color: "#EF4444" },
  { name: "Pending", value: 14, color: "#FFB800" },
  { name: "Cancelled", value: 10, color: "#6B7280" },
];

const STAT_CARDS = [
  { label: "Daily Active Users", value: "8,421", change: "+5.2%", up: true, icon: Users, color: "text-blue-400" },
  { label: "Monthly Active Users", value: "91,247", change: "+12.8%", up: true, icon: TrendingUp, color: "text-green-400" },
  { label: "Platform Revenue (30d)", value: formatCurrency(284000), change: "+8.7%", up: true, icon: DollarSign, color: "text-hcg-gold" },
  { label: "Active Disputes", value: "14", change: "-2", up: false, icon: Flag, color: "text-hcg-red" },
  { label: "Matches Today", value: "1,284", change: "+18.4%", up: true, icon: Trophy, color: "text-purple-400" },
  { label: "Pending Reports", value: "37", change: "+5", up: false, icon: AlertTriangle, color: "text-orange-400" },
  { label: "Coach Applications", value: "12", change: "New", up: true, icon: CheckCircle, color: "text-cyan-400" },
  { label: "Server Uptime", value: "99.94%", change: "Last 30d", up: true, icon: Server, color: "text-green-400" },
];

const ALERTS = [
  { type: "warning", message: "ShadowBlade99 flagged for unusual wagering pattern (12 losses in a row)", time: "2m ago", action: "Review" },
  { type: "warning", message: "ProGamer_X — multiple accounts detected from same IP (192.168.x.x)", time: "14m ago", action: "Investigate" },
  { type: "info", message: "14 pending coach applications awaiting review", time: "1h ago", action: "Review Queue" },
  { type: "error", message: "Dispute #2841 escalated — evidence deadline in 2 hours", time: "2h ago", action: "View" },
];

const QUICK_ACTIONS = [
  { label: "Post Announcement", icon: Zap, href: "/admin/announcements" },
  { label: "Review Coach Apps", icon: CheckCircle, href: "/admin/coaching" },
  { label: "View Reports", icon: Flag, href: "/admin/moderation" },
  { label: "Financial Export", icon: DollarSign, href: "/admin/financial" },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold flex items-center gap-2">
          <Activity size={22} className="text-hcg-gold" /> Admin Dashboard
        </h1>
        <p className="text-sm text-hcg-muted mt-1">Platform health, metrics, and quick actions</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STAT_CARDS.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <Icon size={15} className={s.color} />
                  <span className={`text-xs font-medium ${s.up ? "text-green-400" : "text-hcg-red"}`}>
                    {s.change}
                  </span>
                </div>
                <p className="text-xl font-display font-bold">{s.value}</p>
                <p className="text-xs text-hcg-muted mt-0.5">{s.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* DAU chart */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Daily Active Users (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={dauData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2A35" />
                <XAxis dataKey="day" tick={{ fill: "#6B7280", fontSize: 10 }} interval={6} />
                <YAxis tick={{ fill: "#6B7280", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ background: "#111118", border: "1px solid #2A2A35", borderRadius: 8 }}
                />
                <Line type="monotone" dataKey="dau" name="DAU" stroke="#FFB800" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="newUsers" name="New Users" stroke="#A855F7" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Wager outcomes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Wager Outcomes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={wagerData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {wagerData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#111118", border: "1px solid #2A2A35", borderRadius: 8 }}
                  formatter={(v: number) => [`${v}%`, ""]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-1 mt-2">
              {wagerData.map((d) => (
                <div key={d.name} className="flex items-center gap-1.5 text-xs">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
                  <span className="text-hcg-muted">{d.name}</span>
                  <span className="font-medium ml-auto">{d.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Match volume chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Match Volume by Game (Last 30 days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={matchVolumeData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A35" />
              <XAxis dataKey="game" tick={{ fill: "#6B7280", fontSize: 11 }} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: "#111118", border: "1px solid #2A2A35", borderRadius: 8 }}
              />
              <Bar dataKey="matches" name="Matches" fill="#FFB800" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Alerts + Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Alerts */}
        <Card className="md:col-span-2 border-orange-500/10">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle size={15} className="text-orange-400" /> Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {ALERTS.map((alert, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${
                alert.type === "error" ? "bg-hcg-red/5 border border-hcg-red/20" :
                alert.type === "warning" ? "bg-orange-500/5 border border-orange-500/20" :
                "bg-blue-400/5 border border-blue-400/20"
              }`}>
                <div className={`mt-0.5 shrink-0 ${
                  alert.type === "error" ? "text-hcg-red" :
                  alert.type === "warning" ? "text-orange-400" : "text-blue-400"
                }`}>
                  <AlertTriangle size={13} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-hcg-muted mt-0.5 flex items-center gap-1">
                    <Clock size={10} /> {alert.time}
                  </p>
                </div>
                <Button size="sm" variant="outline" className="shrink-0 text-xs h-7">
                  {alert.action}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {QUICK_ACTIONS.map((qa) => {
              const Icon = qa.icon;
              return (
                <Button key={qa.label} variant="outline" className="w-full justify-start gap-2 text-sm">
                  <Icon size={14} className="text-hcg-gold" />
                  {qa.label}
                </Button>
              );
            })}

            <div className="pt-3 mt-3 border-t border-hcg-border space-y-2">
              <p className="text-xs font-medium text-hcg-muted uppercase tracking-wider">System Status</p>
              {[
                { label: "API", status: "Operational" },
                { label: "DB", status: "Operational" },
                { label: "Stripe", status: "Operational" },
                { label: "Socket.IO", status: "Degraded" },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between text-xs">
                  <span className="text-hcg-muted">{s.label}</span>
                  <span className={`flex items-center gap-1 ${s.status === "Operational" ? "text-green-400" : "text-orange-400"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${s.status === "Operational" ? "bg-green-400" : "bg-orange-400"}`} />
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
