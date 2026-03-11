"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign, TrendingUp, TrendingDown, Download,
  CreditCard, ArrowUpRight, ArrowDownLeft, AlertTriangle, Filter
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { formatCurrency } from "@/lib/utils";

const revenueData = Array.from({ length: 30 }, (_, i) => ({
  date: `Mar ${i + 1}`,
  revenue: Math.floor(Math.random() * 8000 + 2000),
  wagerFees: Math.floor(Math.random() * 3000 + 500),
  coachingFees: Math.floor(Math.random() * 2000 + 300),
  tournamentFees: Math.floor(Math.random() * 1500 + 200),
}));

const MOCK_TRANSACTIONS = Array.from({ length: 25 }, (_, i) => ({
  id: `txn_${i + 1}`,
  type: ["WAGER_WIN", "WAGER_LOSS", "DEPOSIT", "WITHDRAWAL", "COACHING_PAYMENT", "TOURNAMENT_PRIZE"][
    Math.floor(Math.random() * 6)
  ],
  userId: `user_${Math.floor(Math.random() * 100)}`,
  gamerTag: `Player${Math.floor(Math.random() * 1000)}`,
  amountCents: Math.floor(Math.random() * 50000 + 500),
  feeCents: Math.floor(Math.random() * 2000),
  stripeId: `pi_${Math.random().toString(36).slice(2, 18)}`,
  createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
  status: Math.random() > 0.1 ? "COMPLETED" : "PENDING",
}));

const TYPE_CONFIG: Record<string, { label: string; icon: typeof DollarSign; color: string }> = {
  WAGER_WIN: { label: "Wager Win", icon: TrendingUp, color: "text-green-400" },
  WAGER_LOSS: { label: "Wager Loss", icon: TrendingDown, color: "text-hcg-red" },
  DEPOSIT: { label: "Deposit", icon: ArrowDownLeft, color: "text-blue-400" },
  WITHDRAWAL: { label: "Withdrawal", icon: ArrowUpRight, color: "text-orange-400" },
  COACHING_PAYMENT: { label: "Coaching", icon: DollarSign, color: "text-purple-400" },
  TOURNAMENT_PRIZE: { label: "Tournament Prize", icon: TrendingUp, color: "text-hcg-gold" },
};

export default function AdminFinancialPage() {
  const [dateRange, setDateRange] = useState("30d");
  const [txnType, setTxnType] = useState("all");
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => setExporting(false), 1500);
  };

  const totalRevenue = revenueData.reduce((s, d) => s + d.revenue, 0);
  const totalFees = revenueData.reduce((s, d) => s + d.wagerFees + d.coachingFees + d.tournamentFees, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Financial Reports</h1>
          <p className="text-sm text-hcg-muted mt-1">Platform revenue, transactions, and audit trail</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="hcg-input w-28"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="ytd">Year to Date</option>
          </select>
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
            <Download size={14} />
            {exporting ? "Exporting..." : "Export CSV"}
          </Button>
        </div>
      </div>

      {/* Revenue summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: totalRevenue, change: "+12.4%", up: true, icon: DollarSign },
          { label: "Platform Fees", value: totalFees, change: "+8.7%", up: true, icon: CreditCard },
          { label: "Wager Volume", value: 2_480_000, change: "+22.1%", up: true, icon: TrendingUp },
          { label: "Pending Payouts", value: 142_000, change: "-3.2%", up: false, icon: ArrowUpRight },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 rounded-lg bg-hcg-gold/10">
                    <Icon size={16} className="text-hcg-gold" />
                  </div>
                  <span className={`text-xs font-medium ${stat.up ? "text-green-400" : "text-hcg-red"}`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-xl font-display font-bold">{formatCurrency(stat.value)}</p>
                <p className="text-xs text-hcg-muted mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueData.slice(-14)} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A35" />
              <XAxis dataKey="date" tick={{ fill: "#6B7280", fontSize: 11 }} />
              <YAxis tick={{ fill: "#6B7280", fontSize: 11 }} tickFormatter={(v) => `$${(v / 100).toFixed(0)}`} />
              <Tooltip
                contentStyle={{ background: "#111118", border: "1px solid #2A2A35", borderRadius: 8 }}
                formatter={(v: number) => [formatCurrency(v), ""]}
              />
              <Legend />
              <Bar dataKey="wagerFees" name="Wager Fees" fill="#FFB800" radius={[2, 2, 0, 0]} />
              <Bar dataKey="coachingFees" name="Coaching Fees" fill="#A855F7" radius={[2, 2, 0, 0]} />
              <Bar dataKey="tournamentFees" name="Tournament Fees" fill="#3B82F6" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Suspicious activity alert */}
      <Card className="border-orange-500/20 bg-orange-500/5">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-orange-400" />
            <CardTitle className="text-orange-300 text-base">Flagged Transactions</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { user: "ShadowBlade99", amount: 15000, reason: "Unusual wagering pattern — 12 losses in a row" },
              { user: "ProGamer_X", amount: 8500, reason: "Multiple accounts detected from same IP" },
            ].map((flag, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-hcg-card">
                <div>
                  <span className="text-sm font-medium">{flag.user}</span>
                  <span className="text-hcg-gold font-mono ml-2">{formatCurrency(flag.amount)}</span>
                  <p className="text-xs text-hcg-muted">{flag.reason}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">Review</Button>
                  <Button size="sm" variant="destructive">Freeze</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transaction ledger */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transaction Ledger</CardTitle>
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-hcg-muted" />
              <select
                value={txnType}
                onChange={(e) => setTxnType(e.target.value)}
                className="hcg-input w-44 h-8 text-xs"
              >
                <option value="all">All Types</option>
                {Object.keys(TYPE_CONFIG).map((k) => (
                  <option key={k} value={k}>{TYPE_CONFIG[k].label}</option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-hcg-border text-hcg-muted text-xs">
                  <th className="text-left py-2 pr-4">ID</th>
                  <th className="text-left py-2 pr-4">Type</th>
                  <th className="text-left py-2 pr-4">User</th>
                  <th className="text-right py-2 pr-4">Amount</th>
                  <th className="text-right py-2 pr-4">Fee</th>
                  <th className="text-left py-2 pr-4">Status</th>
                  <th className="text-left py-2">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hcg-border/50">
                {MOCK_TRANSACTIONS.filter(
                  (t) => txnType === "all" || t.type === txnType
                ).map((txn) => {
                  const cfg = TYPE_CONFIG[txn.type] ?? { label: txn.type, icon: DollarSign, color: "text-foreground" };
                  const Icon = cfg.icon;
                  return (
                    <tr key={txn.id} className="hover:bg-hcg-card-hover/30">
                      <td className="py-2 pr-4 font-mono text-xs text-hcg-muted">{txn.id}</td>
                      <td className="py-2 pr-4">
                        <div className={`flex items-center gap-1.5 ${cfg.color}`}>
                          <Icon size={12} />
                          <span className="text-xs">{cfg.label}</span>
                        </div>
                      </td>
                      <td className="py-2 pr-4 text-xs">{txn.gamerTag}</td>
                      <td className="py-2 pr-4 text-right font-mono">{formatCurrency(txn.amountCents)}</td>
                      <td className="py-2 pr-4 text-right font-mono text-hcg-muted">{formatCurrency(txn.feeCents)}</td>
                      <td className="py-2 pr-4">
                        <Badge variant={txn.status === "COMPLETED" ? "success" : "warning"} className="text-xs">
                          {txn.status}
                        </Badge>
                      </td>
                      <td className="py-2 text-xs text-hcg-muted">
                        {txn.createdAt.toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
