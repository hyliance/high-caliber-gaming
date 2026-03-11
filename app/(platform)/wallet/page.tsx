"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign, ArrowDownLeft, ArrowUpRight, Lock, Gift,
  CreditCard, TrendingUp, TrendingDown, Filter, AlertTriangle
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const TX_TYPE_CONFIG: Record<string, { label: string; icon: typeof DollarSign; color: string; sign: string }> = {
  DEPOSIT: { label: "Deposit", icon: ArrowDownLeft, color: "text-green-400", sign: "+" },
  WITHDRAWAL: { label: "Withdrawal", icon: ArrowUpRight, color: "text-orange-400", sign: "-" },
  WAGER_WIN: { label: "Wager Win", icon: TrendingUp, color: "text-green-400", sign: "+" },
  WAGER_LOSS: { label: "Wager Loss", icon: TrendingDown, color: "text-hcg-red", sign: "-" },
  WAGER_LOCK: { label: "Escrowed", icon: Lock, color: "text-blue-400", sign: "-" },
  WAGER_REFUND: { label: "Wager Refund", icon: ArrowDownLeft, color: "text-green-400", sign: "+" },
  TOURNAMENT_PRIZE: { label: "Tournament Prize", icon: TrendingUp, color: "text-hcg-gold", sign: "+" },
  TOURNAMENT_ENTRY: { label: "Tournament Entry", icon: ArrowUpRight, color: "text-hcg-muted", sign: "-" },
  COACHING_PAYMENT: { label: "Coaching Fee", icon: ArrowUpRight, color: "text-purple-400", sign: "-" },
  PLATFORM_FEE: { label: "Platform Fee", icon: ArrowUpRight, color: "text-hcg-muted", sign: "-" },
};

const MOCK_TRANSACTIONS = [
  { id: "t1", type: "WAGER_WIN", description: "Won vs ShadowBlade_X — Valorant", amountCents: 9300, feeCents: 700, balanceAfter: 102300, createdAt: new Date("2026-03-10T18:32:00") },
  { id: "t2", type: "WAGER_LOCK", description: "Wager escrow — vs NightOwl_Pro", amountCents: 2500, feeCents: 0, balanceAfter: 93000, createdAt: new Date("2026-03-10T16:00:00") },
  { id: "t3", type: "TOURNAMENT_PRIZE", description: "HCG Weekly Cup #47 — 2nd Place", amountCents: 12500, feeCents: 0, balanceAfter: 95500, createdAt: new Date("2026-03-09T22:00:00") },
  { id: "t4", type: "DEPOSIT", description: "Stripe deposit via Visa ···4411", amountCents: 50000, feeCents: 0, balanceAfter: 83000, createdAt: new Date("2026-03-08T10:15:00") },
  { id: "t5", type: "WAGER_LOSS", description: "Lost vs ProPlayer_ZX — CoD", amountCents: 5000, feeCents: 0, balanceAfter: 33000, createdAt: new Date("2026-03-07T20:00:00") },
  { id: "t6", type: "COACHING_PAYMENT", description: "Session with ProShot_Kyle — 60min", amountCents: 7500, feeCents: 0, balanceAfter: 38000, createdAt: new Date("2026-03-06T14:30:00") },
  { id: "t7", type: "WITHDRAWAL", description: "Withdrawal to Chase ···7890", amountCents: 25000, feeCents: 0, balanceAfter: 45500, createdAt: new Date("2026-03-05T09:00:00") },
  { id: "t8", type: "TOURNAMENT_ENTRY", description: "Valorant Monthly Open — Entry", amountCents: 1000, feeCents: 0, balanceAfter: 70500, createdAt: new Date("2026-03-04T11:00:00") },
];

export default function WalletPage() {
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const wallet = { balanceCents: 102300, escrowCents: 7500, creditsCents: 2000, totalEarned: 193000 };
  const filtered = MOCK_TRANSACTIONS.filter((t) => typeFilter === "all" || t.type === typeFilter);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-display font-bold flex items-center gap-2">
        <CreditCard size={22} className="text-hcg-gold" /> My Wallet
      </h1>

      {/* Balance cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-hcg-gold/20 bg-gradient-to-br from-hcg-gold/5 to-hcg-card md:col-span-1">
          <CardContent className="p-5">
            <p className="text-xs text-hcg-muted font-semibold uppercase mb-1">Available Balance</p>
            <p className="text-4xl font-display font-bold text-hcg-gold">{formatCurrency(wallet.balanceCents)}</p>
            <div className="flex gap-2 mt-4">
              <Button size="sm" className="flex-1 gap-1" onClick={() => setShowDeposit(true)}>
                <ArrowDownLeft size={14} /> Deposit
              </Button>
              <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => setShowWithdraw(true)}>
                <ArrowUpRight size={14} /> Withdraw
              </Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-hcg-muted font-semibold uppercase mb-1">In Escrow</p>
            <p className="text-3xl font-display font-bold text-blue-400">{formatCurrency(wallet.escrowCents)}</p>
            <p className="text-xs text-hcg-muted mt-2 flex items-center gap-1"><Lock size={11} /> Funds locked in active wagers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs text-hcg-muted font-semibold uppercase mb-1">Platform Credits</p>
            <p className="text-3xl font-display font-bold text-purple-400">{formatCurrency(wallet.creditsCents)}</p>
            <p className="text-xs text-hcg-muted mt-2 flex items-center gap-1"><Gift size={11} /> Use for tournament entries & cosmetics</p>
          </CardContent>
        </Card>
      </div>

      {/* Tax notice */}
      <div className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20 flex items-start gap-2 text-xs">
        <AlertTriangle size={13} className="text-yellow-400 mt-0.5 shrink-0" />
        <p className="text-yellow-200/70">Your total earnings may be subject to tax reporting. High Caliber Gaming will issue a 1099-NEC for earnings above IRS thresholds. Keep records of all transactions.</p>
      </div>

      {/* Transaction history */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transaction History</CardTitle>
            <div className="flex items-center gap-2">
              <Filter size={13} className="text-hcg-muted" />
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="hcg-input w-44 h-8 text-xs">
                <option value="all">All Transactions</option>
                {Object.entries(TX_TYPE_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-hcg-border text-xs text-hcg-muted">
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">Description</th>
                <th className="text-right p-3">Amount</th>
                <th className="text-right p-3">Fee</th>
                <th className="text-right p-3">Balance</th>
                <th className="text-left p-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hcg-border/50">
              {filtered.map((tx) => {
                const cfg = TX_TYPE_CONFIG[tx.type];
                const Icon = cfg.icon;
                return (
                  <tr key={tx.id} className="hover:bg-hcg-card-hover/30">
                    <td className="p-3">
                      <div className={`flex items-center gap-1.5 ${cfg.color}`}>
                        <Icon size={13} />
                        <span className="text-xs">{cfg.label}</span>
                      </div>
                    </td>
                    <td className="p-3 text-xs text-hcg-muted max-w-xs truncate">{tx.description}</td>
                    <td className={`p-3 text-right font-mono font-semibold ${cfg.color}`}>
                      {cfg.sign}{formatCurrency(tx.amountCents)}
                    </td>
                    <td className="p-3 text-right font-mono text-xs text-hcg-muted">
                      {tx.feeCents > 0 ? `-${formatCurrency(tx.feeCents)}` : "—"}
                    </td>
                    <td className="p-3 text-right font-mono text-xs">{formatCurrency(tx.balanceAfter)}</td>
                    <td className="p-3 text-xs text-hcg-muted">
                      {tx.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric" })}{" "}
                      <span className="text-hcg-muted/60">{tx.createdAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Deposit Modal */}
      {showDeposit && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm border-hcg-gold/20">
            <CardHeader><CardTitle className="flex items-center gap-2"><ArrowDownLeft size={18} className="text-green-400" /> Deposit Funds</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-hcg-muted font-medium">Amount (USD)</label>
                <div className="relative">
                  <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-hcg-muted" />
                  <input className="hcg-input pl-8" type="number" min="5" placeholder="0.00" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {["10", "25", "50", "100"].map((a) => (
                  <button key={a} onClick={() => setDepositAmount(a)} className={`py-1.5 text-xs rounded-lg border transition-colors ${depositAmount === a ? "border-hcg-gold bg-hcg-gold/10 text-hcg-gold" : "border-hcg-border hover:border-hcg-gold/30"}`}>${a}</button>
                ))}
              </div>
              <div className="p-3 rounded-lg border border-hcg-border bg-hcg-bg text-xs text-hcg-muted">
                <p className="font-medium text-foreground mb-1">Payment Method</p>
                <p>Visa ending in ···4411 (add card in Settings)</p>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" disabled={!depositAmount}>Deposit {depositAmount ? `$${depositAmount}` : ""}</Button>
                <Button variant="outline" onClick={() => setShowDeposit(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdraw && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm border-orange-500/20">
            <CardHeader><CardTitle className="flex items-center gap-2"><ArrowUpRight size={18} className="text-orange-400" /> Withdraw Funds</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-hcg-muted font-medium">Amount (min $10)</label>
                <div className="relative">
                  <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-hcg-muted" />
                  <input className="hcg-input pl-8" type="number" min="10" placeholder="0.00" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} />
                </div>
                <p className="text-xs text-hcg-muted">Available: {formatCurrency(wallet.balanceCents)}</p>
              </div>
              <div className="p-3 rounded-lg border border-hcg-border bg-hcg-bg text-xs">
                <p className="font-medium text-foreground mb-1">Payout Account</p>
                <p className="text-hcg-muted">No bank account linked. Add one in Settings → Payment & KYC.</p>
              </div>
              <p className="text-xs text-hcg-muted">Processing time: 3–5 business days. KYC verification required.</p>
              <div className="flex gap-2">
                <Button className="flex-1" variant="outline" disabled>Request Withdrawal</Button>
                <Button variant="ghost" onClick={() => setShowWithdraw(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
