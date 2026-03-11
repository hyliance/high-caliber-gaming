"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search, Filter, Ban, CheckCircle, Eye, MoreHorizontal,
  Users, Shield, AlertTriangle, UserX, ChevronDown
} from "lucide-react";
import { timeAgo, formatCurrency } from "@/lib/utils";

const MOCK_USERS = Array.from({ length: 20 }, (_, i) => ({
  id: `user_${i + 1}`,
  gamerTag: `Player${1000 + i}`,
  email: `player${i + 1}@example.com`,
  globalRole: ["MEMBER", "MEMBER", "VERIFIED_MEMBER", "MEMBER", "MODERATOR"][i % 5] as string,
  isVerified: i % 3 === 0,
  isKycVerified: i % 4 === 0,
  isBanned: i === 7 || i === 14,
  walletBalance: Math.floor(Math.random() * 50000),
  matchesPlayed: Math.floor(Math.random() * 500 + 10),
  reportCount: Math.floor(Math.random() * 5),
  joinedAt: new Date(Date.now() - Math.random() * 365 * 24 * 3600 * 1000),
  lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 3600 * 1000),
  country: ["US", "EU", "AU", "CA", "UK"][i % 5],
}));

const ROLE_BADGE: Record<string, string> = {
  SUPER_ADMIN: "bg-red-500/20 text-red-400 border-red-500/30",
  ADMIN: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  MODERATOR: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  VERIFIED_MEMBER: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  MEMBER: "bg-hcg-bg text-hcg-muted border-hcg-border",
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [showBanModal, setShowBanModal] = useState<string | null>(null);
  const [banReason, setBanReason] = useState("");

  const filtered = MOCK_USERS.filter((u) => {
    const matchesSearch = !search || u.gamerTag.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.globalRole === roleFilter;
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "banned" && u.isBanned) ||
      (statusFilter === "active" && !u.isBanned) ||
      (statusFilter === "reported" && u.reportCount > 0);
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <Users size={22} className="text-hcg-gold" /> User Management
          </h1>
          <p className="text-sm text-hcg-muted mt-1">{MOCK_USERS.length.toLocaleString()} registered users</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Users", value: "91,247", icon: Users, color: "text-blue-400" },
          { label: "Banned", value: "142", icon: Ban, color: "text-hcg-red" },
          { label: "Verified Members", value: "12,481", icon: CheckCircle, color: "text-green-400" },
          { label: "Pending Reports", value: "37", icon: AlertTriangle, color: "text-orange-400" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <Icon size={18} className={s.color} />
                <div>
                  <p className="text-lg font-display font-bold">{s.value}</p>
                  <p className="text-xs text-hcg-muted">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-hcg-muted" />
          <input
            className="hcg-input pl-8 w-full"
            placeholder="Search by gamer tag or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="hcg-input w-44">
          <option value="all">All Roles</option>
          <option value="MEMBER">Member</option>
          <option value="VERIFIED_MEMBER">Verified Member</option>
          <option value="MODERATOR">Moderator</option>
          <option value="ADMIN">Admin</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="hcg-input w-36">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="banned">Banned</option>
          <option value="reported">Reported</option>
        </select>
      </div>

      {/* User table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-hcg-border text-hcg-muted text-xs">
                  <th className="text-left p-3">User</th>
                  <th className="text-left p-3">Role</th>
                  <th className="text-left p-3">Country</th>
                  <th className="text-right p-3">Wallet</th>
                  <th className="text-right p-3">Matches</th>
                  <th className="text-left p-3">Reports</th>
                  <th className="text-left p-3">Joined</th>
                  <th className="text-left p-3">Last Active</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hcg-border/50">
                {filtered.map((user) => (
                  <tr key={user.id} className={`hover:bg-hcg-card-hover/30 ${user.isBanned ? "opacity-60" : ""}`}>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-hcg-bg border border-hcg-border flex items-center justify-center text-xs font-bold">
                          {user.gamerTag.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <span className="font-medium text-sm">{user.gamerTag}</span>
                            {user.isVerified && <CheckCircle size={11} className="text-blue-400" />}
                            {user.isBanned && <Badge variant="destructive" className="text-xs h-4 px-1">Banned</Badge>}
                          </div>
                          <p className="text-xs text-hcg-muted">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`text-xs border rounded px-1.5 py-0.5 ${ROLE_BADGE[user.globalRole]}`}>
                        {user.globalRole.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-3 text-xs text-hcg-muted">{user.country}</td>
                    <td className="p-3 text-right font-mono text-xs">{formatCurrency(user.walletBalance)}</td>
                    <td className="p-3 text-right text-xs">{user.matchesPlayed}</td>
                    <td className="p-3">
                      {user.reportCount > 0 ? (
                        <span className="text-xs text-orange-400 font-medium">{user.reportCount} reports</span>
                      ) : (
                        <span className="text-xs text-hcg-muted">None</span>
                      )}
                    </td>
                    <td className="p-3 text-xs text-hcg-muted">{timeAgo(user.joinedAt)}</td>
                    <td className="p-3 text-xs text-hcg-muted">{timeAgo(user.lastActive)}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Button size="sm" variant="ghost" className="h-7 px-2">
                          <Eye size={12} />
                        </Button>
                        {!user.isBanned ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-hcg-red hover:text-hcg-red"
                            onClick={() => setShowBanModal(user.id)}
                          >
                            <Ban size={12} />
                          </Button>
                        ) : (
                          <Button size="sm" variant="ghost" className="h-7 px-2 text-green-400 hover:text-green-400">
                            <CheckCircle size={12} />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Ban modal */}
      {showBanModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="hcg-card w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-2 text-hcg-red">
              <Ban size={18} />
              <h2 className="text-lg font-display font-bold">Ban User</h2>
            </div>
            <p className="text-sm text-hcg-muted">
              Banning this user will prevent them from logging in and forfeit any active wagers. This action is logged.
            </p>
            <div>
              <label className="text-xs text-hcg-muted mb-1 block">Reason for ban *</label>
              <textarea
                className="hcg-input w-full h-24 resize-none"
                placeholder="Describe the reason for this ban..."
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => { setShowBanModal(null); setBanReason(""); }}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={!banReason.trim()}
                onClick={() => { setShowBanModal(null); setBanReason(""); }}
              >
                Confirm Ban
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
