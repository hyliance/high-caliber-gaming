"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, CheckCircle, Users, Trophy, ChevronRight, ExternalLink, Search, Star } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const MOCK_ORGS = [
  { id: "1", name: "Team Nexus", abbr: "NXS", primaryColor: "#FFB800", country: "US", isVerified: true, memberCount: 24, teamCount: 4, games: ["Valorant", "CoD", "Apex", "RL"], totalEarnings: 284000, recentResult: "1st — HCG Pro League S3", website: "nexus.gg", followers: 8400 },
  { id: "2", name: "Phantom Force", abbr: "PHF", primaryColor: "#8B5CF6", country: "EU", isVerified: true, memberCount: 18, teamCount: 3, games: ["Valorant", "CS2", "LoL"], totalEarnings: 196000, recentResult: "3rd — Valorant Monthly Open", website: "phantomforce.gg", followers: 5200 },
  { id: "3", name: "Iron Wolves", abbr: "IRW", primaryColor: "#6B7280", country: "AU", isVerified: true, memberCount: 12, teamCount: 2, games: ["CoD", "Apex"], totalEarnings: 87000, recentResult: "2nd — HCG Weekly Cup #45", website: null, followers: 2100 },
  { id: "4", name: "Desert Hawks", abbr: "DHK", primaryColor: "#EF4444", country: "US", isVerified: false, memberCount: 8, teamCount: 2, games: ["CoD"], totalEarnings: 34000, recentResult: "1st — CoD Amateur League", website: null, followers: 890 },
  { id: "5", name: "Ghost Protocol", abbr: "GHP", primaryColor: "#06B6D4", country: "US", isVerified: true, memberCount: 20, teamCount: 3, games: ["Valorant", "Apex", "Fortnite"], totalEarnings: 152000, recentResult: "Top 8 — HCG Pro League S4", website: "ghostprotocol.gg", followers: 4600 },
];

const FEATURED = MOCK_ORGS.slice(0, 3);

export default function OrganizationsPage() {
  const [search, setSearch] = useState("");
  const [myOrgView, setMyOrgView] = useState(false);

  const filtered = MOCK_ORGS.filter((o) =>
    !search || o.name.toLowerCase().includes(search.toLowerCase()) || o.games.some((g) => g.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <Building2 size={24} className="text-hcg-gold" /> Organizations
          </h1>
          <p className="text-sm text-hcg-muted mt-1">Professional and amateur esports teams on the platform</p>
        </div>
        <Button variant="outline" className="gap-2">
          Apply to Create Org <ChevronRight size={14} />
        </Button>
      </div>

      {/* Featured orgs */}
      <div>
        <h2 className="text-sm font-semibold text-hcg-muted uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Star size={13} className="text-hcg-gold" /> Featured Organizations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURED.map((org) => (
            <div key={org.id} className="hcg-card-hover group relative overflow-hidden">
              {/* Color accent strip */}
              <div className="absolute top-0 left-0 right-0 h-1" style={{ background: org.primaryColor }} />
              <div className="pt-3">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white border-2" style={{ background: org.primaryColor + "30", borderColor: org.primaryColor + "50" }}>
                      {org.abbr}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold">{org.name}</span>
                        {org.isVerified && <CheckCircle size={13} className="text-blue-400" />}
                      </div>
                      <p className="text-xs text-hcg-muted">{org.country}</p>
                    </div>
                  </div>
                  {org.website && (
                    <Button size="sm" variant="ghost" className="h-7 gap-1 text-xs text-hcg-muted">
                      <ExternalLink size={11} />
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {org.games.map((g) => (
                    <span key={g} className="text-xs bg-hcg-bg border border-hcg-border rounded px-1.5 py-0.5 text-hcg-muted">{g}</span>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs mb-3">
                  <div>
                    <p className="font-bold text-hcg-gold">{formatCurrency(org.totalEarnings)}</p>
                    <p className="text-hcg-muted">Earnings</p>
                  </div>
                  <div>
                    <p className="font-bold">{org.memberCount}</p>
                    <p className="text-hcg-muted">Players</p>
                  </div>
                  <div>
                    <p className="font-bold">{org.followers.toLocaleString()}</p>
                    <p className="text-hcg-muted">Followers</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-hcg-muted truncate">{org.recentResult}</p>
                  <Button size="sm" variant="outline">Follow</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search + all orgs */}
      <div>
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-hcg-muted" />
            <input className="hcg-input pl-8" placeholder="Search organizations or games..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((org) => (
            <div key={org.id} className="hcg-card-hover flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: org.primaryColor + "30", border: `1px solid ${org.primaryColor}40` }}>
                {org.abbr}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{org.name}</span>
                  {org.isVerified && <CheckCircle size={12} className="text-blue-400" />}
                  <span className="text-xs text-hcg-muted">{org.country}</span>
                </div>
                <div className="flex gap-2 text-xs text-hcg-muted mt-0.5">
                  <span className="flex items-center gap-1"><Users size={10} /> {org.memberCount} players</span>
                  <span>·</span>
                  <span className="flex items-center gap-1"><Trophy size={10} /> {formatCurrency(org.totalEarnings)} earned</span>
                  <span>·</span>
                  <span>{org.games.slice(0, 2).join(", ")}{org.games.length > 2 ? ` +${org.games.length - 2}` : ""}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <p className="text-xs text-hcg-muted hidden md:block">{org.recentResult}</p>
                <Button size="sm" variant="outline">View</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
