"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Plus, ChevronRight, Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";

const MOCK_LEAGUES = [
  {
    id: "1", name: "HCG Pro League — Season 4", game: "Valorant", gameIcon: "⚡", status: "IN_PROGRESS", stage: "GROUP",
    groups: [
      {
        name: "Group A", standings: [
          { team: "Team Nexus", tag: "NXS", w: 4, l: 0, d: 0, pts: 12, gd: +18, form: ["W","W","W","W"] },
          { team: "Phantom Force", tag: "PHF", w: 3, l: 1, d: 0, pts: 9, gd: +7, form: ["W","W","L","W"] },
          { team: "Ghost Squad", tag: "GSQ", w: 2, l: 2, d: 0, pts: 6, gd: -3, form: ["W","L","W","L"] },
          { team: "Iron Wolves", tag: "IRW", w: 0, l: 4, d: 0, pts: 0, gd: -22, form: ["L","L","L","L"] },
        ]
      },
      {
        name: "Group B", standings: [
          { team: "Apex Raiders", tag: "APR", w: 3, l: 0, d: 1, pts: 10, gd: +12, form: ["W","D","W","W"] },
          { team: "Storm Riders", tag: "STR", w: 2, l: 1, d: 1, pts: 7, gd: +4, form: ["W","W","D","L"] },
          { team: "Shadow Kings", tag: "SHK", w: 1, l: 2, d: 1, pts: 4, gd: -5, form: ["L","W","D","L"] },
          { team: "Rogue Bullets", tag: "RGB", w: 0, l: 3, d: 1, pts: 1, gd: -11, form: ["D","L","L","L"] },
        ]
      },
    ]
  },
  {
    id: "2", name: "HCG Amateur League — CoD", game: "Call of Duty", gameIcon: "🎯", status: "IN_PROGRESS", stage: "GROUP",
    groups: [
      {
        name: "Group C", standings: [
          { team: "Desert Hawks", tag: "DHK", w: 5, l: 0, d: 0, pts: 15, gd: +25, form: ["W","W","W","W","W"] },
          { team: "Viper Squad", tag: "VPS", w: 3, l: 2, d: 0, pts: 9, gd: +3, form: ["W","L","W","W","L"] },
          { team: "Recon Unit", tag: "RCN", w: 2, l: 3, d: 0, pts: 6, gd: -8, form: ["L","W","L","W","L"] },
          { team: "Chaos Theory", tag: "CHT", w: 0, l: 5, d: 0, pts: 0, gd: -20, form: ["L","L","L","L","L"] },
        ]
      },
    ]
  },
];

const formColor = (r: string) =>
  r === "W" ? "bg-green-500" : r === "L" ? "bg-hcg-red" : "bg-hcg-muted";

export default function LeaguesPage() {
  const [activeTab, setActiveTab] = useState<"active" | "completed" | "create">("active");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold flex items-center gap-2">
            <Shield size={24} className="text-hcg-gold" /> Leagues
          </h1>
          <p className="text-sm text-hcg-muted mt-1">Season-long competitions with group stage and playoffs</p>
        </div>
        <Button className="gap-2"><Plus size={16} /> Create League</Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-hcg-border">
        {(["active", "completed"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize border-b-2 transition-colors -mb-px ${
              activeTab === tab ? "border-hcg-gold text-hcg-gold" : "border-transparent text-hcg-muted hover:text-foreground"
            }`}
          >
            {tab === "active" ? "Active Leagues" : "Completed"}
          </button>
        ))}
      </div>

      {activeTab === "active" && MOCK_LEAGUES.map((league) => (
        <Card key={league.id} className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-hcg-card to-hcg-card-hover border-b border-hcg-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{league.gameIcon}</span>
                <div>
                  <CardTitle className="text-base">{league.name}</CardTitle>
                  <p className="text-xs text-hcg-muted">{league.game} · Group Stage</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="info">Group Stage</Badge>
                <Button size="sm" variant="outline">
                  View Full League <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {league.groups.map((group) => (
                <div key={group.name}>
                  <h3 className="text-sm font-semibold text-hcg-gold mb-2 flex items-center gap-1.5">
                    <Trophy size={12} /> {group.name}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-hcg-muted border-b border-hcg-border">
                          <th className="text-left py-1.5 w-6">#</th>
                          <th className="text-left py-1.5">Team</th>
                          <th className="text-center py-1.5 w-8">W</th>
                          <th className="text-center py-1.5 w-8">D</th>
                          <th className="text-center py-1.5 w-8">L</th>
                          <th className="text-center py-1.5 w-8">GD</th>
                          <th className="text-center py-1.5 w-10 font-bold">PTS</th>
                          <th className="text-center py-1.5 w-20">Form</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-hcg-border/30">
                        {group.standings.map((s, i) => (
                          <tr
                            key={s.tag}
                            className={`hover:bg-hcg-card-hover/30 ${i < 2 ? "border-l-2 border-green-500/40" : ""}`}
                          >
                            <td className="py-2 text-hcg-muted">{i + 1}</td>
                            <td className="py-2">
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold">{s.team}</span>
                                <span className="text-hcg-muted">[{s.tag}]</span>
                              </div>
                            </td>
                            <td className="py-2 text-center text-green-400">{s.w}</td>
                            <td className="py-2 text-center text-hcg-muted">{s.d}</td>
                            <td className="py-2 text-center text-hcg-red">{s.l}</td>
                            <td className="py-2 text-center">
                              <span className={s.gd >= 0 ? "text-green-400" : "text-hcg-red"}>
                                {s.gd > 0 ? "+" : ""}{s.gd}
                              </span>
                            </td>
                            <td className="py-2 text-center font-bold text-hcg-gold">{s.pts}</td>
                            <td className="py-2">
                              <div className="flex gap-0.5 justify-center">
                                {s.form.map((r, j) => (
                                  <span key={j} className={`w-4 h-4 rounded-sm flex items-center justify-center text-white text-[9px] font-bold ${formColor(r)}`}>
                                    {r}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-hcg-muted mt-1.5">
                    <span className="inline-block w-2 h-2 bg-green-500/40 border-l-2 border-green-500 mr-1" />
                    Top 2 advance to Playoffs
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {activeTab === "completed" && (
        <div className="space-y-4">
          {/* Simple playoff bracket visualization */}
          <Card>
            <CardHeader>
              <CardTitle>HCG Pro League — Season 3 Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-8 overflow-x-auto pb-4">
                {/* Semifinals */}
                <div className="space-y-8">
                  <p className="text-xs text-hcg-muted font-semibold text-center mb-2">SEMIFINALS</p>
                  {[["Team Alpha", "Shadow Kings"], ["Storm Riders", "Iron Wolves"]].map(([t1, t2], i) => (
                    <div key={i} className="space-y-1">
                      <div className="bg-green-500/10 border border-green-500/20 rounded px-3 py-1.5 text-sm font-medium w-40">{t1}</div>
                      <div className="bg-hcg-card border border-hcg-border rounded px-3 py-1.5 text-sm text-hcg-muted w-40">{t2}</div>
                    </div>
                  ))}
                </div>
                {/* Finals */}
                <div className="pt-12">
                  <p className="text-xs text-hcg-muted font-semibold text-center mb-2">GRAND FINAL</p>
                  <div className="space-y-1">
                    <div className="bg-hcg-gold/10 border border-hcg-gold/30 rounded px-3 py-2 text-sm font-semibold w-44 flex items-center gap-2">
                      <Trophy size={14} className="text-hcg-gold" /> Team Alpha
                    </div>
                    <div className="bg-hcg-card border border-hcg-border rounded px-3 py-2 text-sm text-hcg-muted w-44">Storm Riders</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
