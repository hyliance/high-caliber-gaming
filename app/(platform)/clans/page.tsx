"use client";

import { useState } from "react";
import {
  Shield,
  Users,
  Trophy,
  Search,
  Plus,
  Crown,
  Star,
  Swords,
  TrendingUp,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  CheckCircle,
  Clock,
  MessageSquare,
  Edit2,
  UserPlus,
  Target,
} from "lucide-react";

const USER_HAS_CLAN = true;

const MY_CLAN = {
  name: "Phantom Ascendancy",
  tag: "[PHX]",
  logo: "PA",
  color: "#FFB800",
  banner: "from-yellow-900/40 to-amber-900/20",
  memberCount: 24,
  maxMembers: 30,
  rank: 7,
  seasonPoints: 14820,
  warRecord: { wins: 18, losses: 4, draws: 2 },
  motd: "GGs only. Scrims every Saturday 8PM EST. Get your VODs reviewed before ranked night.",
  founded: "Jan 2024",
  region: "North America",
  primaryGame: "Valorant",
  totalEarnings: "$3,200",
};

const CLAN_MEMBERS = [
  { id: 1, tag: "xX_SniperKing_Xx", role: "Leader", rank: "Radiant", joined: "Jan 2024", kd: 1.94, winRate: 68, points: 3200, online: true },
  { id: 2, tag: "ValorantViper99", role: "Co-Leader", rank: "Immortal 3", joined: "Jan 2024", kd: 1.72, winRate: 64, points: 2890, online: true },
  { id: 3, tag: "FragQueen_Mia", role: "Officer", rank: "Immortal 2", joined: "Feb 2024", kd: 1.68, winRate: 62, points: 2340, online: false },
  { id: 4, tag: "TacticalHaven_Priya", role: "Officer", rank: "Immortal 1", joined: "Feb 2024", kd: 1.55, winRate: 59, points: 2100, online: true },
  { id: 5, tag: "ClipGod_Tyrese", role: "Member", rank: "Immortal 1", joined: "Mar 2024", kd: 2.01, winRate: 65, points: 1980, online: true },
  { id: 6, tag: "ProCoach_Marcus", role: "Member", rank: "Diamond 3", joined: "Mar 2024", kd: 1.43, winRate: 57, points: 1640, online: false },
  { id: 7, tag: "EsportsAnalyst_Kim", role: "Member", rank: "Diamond 2", joined: "Apr 2024", kd: 1.38, winRate: 55, points: 1420, online: false },
  { id: 8, tag: "NightOwl_Sasha", role: "Member", rank: "Diamond 1", joined: "Apr 2024", kd: 1.31, winRate: 53, points: 1180, online: true },
];

const RECENT_WAR_RESULTS = [
  { id: 1, opponent: "Shadow Protocol [SPR]", result: "W", score: "8-3", date: "Mar 8", prize: "+$200", mode: "5v5 Competitive" },
  { id: 2, opponent: "Night Hawks [NHK]", result: "W", score: "7-4", date: "Mar 6", prize: "+$150", mode: "5v5 Competitive" },
  { id: 3, opponent: "Iron Veil [IVL]", result: "D", score: "5-5", date: "Mar 3", prize: "+$50", mode: "Best of 3" },
  { id: 4, opponent: "Crimson Rush [CRS]", result: "L", score: "4-7", date: "Feb 28", prize: "-$100", mode: "5v5 Competitive" },
  { id: 5, opponent: "Zero Gravity [ZRG]", result: "W", score: "9-2", date: "Feb 25", prize: "+$300", mode: "Best of 5" },
];

const TOP_CLANS = [
  { rank: 1, name: "Apex Division", tag: "[APX]", members: 28, warRecord: "34-3-1", points: 28400, game: "Valorant", trend: "up" },
  { rank: 2, name: "Quantum Strike", tag: "[QST]", members: 25, warRecord: "31-5-2", points: 25100, game: "Call of Duty", trend: "up" },
  { rank: 3, name: "Void Seekers", tag: "[VSD]", members: 30, warRecord: "29-7-3", points: 22900, game: "Apex Legends", trend: "down" },
  { rank: 4, name: "Iron Protocol", tag: "[IRP]", members: 22, warRecord: "27-8-1", points: 20300, game: "Valorant", trend: "stable" },
  { rank: 5, name: "Steel Runners", tag: "[SLR]", members: 18, warRecord: "25-9-2", points: 18700, game: "Rocket League", trend: "up" },
  { rank: 6, name: "Dark Syndicate", tag: "[DSY]", members: 27, warRecord: "23-11-0", points: 17200, game: "Call of Duty", trend: "down" },
  { rank: 7, name: "Phantom Ascendancy", tag: "[PHX]", members: 24, warRecord: "18-4-2", points: 14820, game: "Valorant", trend: "up" },
  { rank: 8, name: "Ghost Division", tag: "[GHD]", members: 21, warRecord: "17-10-1", points: 13400, game: "Apex Legends", trend: "stable" },
  { rank: 9, name: "Nova Siege", tag: "[NVS]", members: 19, warRecord: "16-11-3", points: 12100, game: "Valorant", trend: "up" },
  { rank: 10, name: "Prism Effect", tag: "[PRM]", members: 23, warRecord: "15-12-2", points: 10900, game: "Call of Duty", trend: "down" },
  { rank: 11, name: "Solar Storm", tag: "[SLS]", members: 16, warRecord: "14-13-1", points: 9800, game: "Rocket League", trend: "stable" },
  { rank: 12, name: "Raven Squad", tag: "[RVN]", members: 20, warRecord: "13-14-2", points: 8700, game: "Apex Legends", trend: "down" },
  { rank: 13, name: "Ember Protocol", tag: "[EBP]", members: 18, warRecord: "12-14-4", points: 7900, game: "Valorant", trend: "up" },
  { rank: 14, name: "Neon Wolves", tag: "[NWV]", members: 15, warRecord: "11-15-2", points: 7100, game: "Call of Duty", trend: "stable" },
  { rank: 15, name: "Titan Surge", tag: "[TTS]", members: 22, warRecord: "10-16-3", points: 6300, game: "Apex Legends", trend: "down" },
  { rank: 16, name: "Circuit Breakers", tag: "[CBK]", members: 17, warRecord: "10-17-1", points: 5800, game: "Rocket League", trend: "up" },
  { rank: 17, name: "Frost Protocol", tag: "[FRP]", members: 14, warRecord: "9-17-2", points: 5100, game: "Valorant", trend: "stable" },
  { rank: 18, name: "Surge Electric", tag: "[SGE]", members: 19, warRecord: "8-18-3", points: 4600, game: "Call of Duty", trend: "down" },
  { rank: 19, name: "Twilight Order", tag: "[TWO]", members: 16, warRecord: "7-19-2", points: 3900, game: "Apex Legends", trend: "up" },
  { rank: 20, name: "Zero Gravity", tag: "[ZRG]", members: 12, warRecord: "7-20-1", points: 3200, game: "Valorant", trend: "stable" },
];

const ROLE_COLORS: Record<string, string> = {
  Leader: "text-[#FFB800] bg-[#FFB800]/10",
  "Co-Leader": "text-orange-400 bg-orange-400/10",
  Officer: "text-purple-400 bg-purple-400/10",
  Member: "text-gray-400 bg-gray-400/10",
};

const RESULT_COLORS = { W: "text-green-400 bg-green-400/10", L: "text-red-400 bg-red-400/10", D: "text-yellow-400 bg-yellow-400/10" };

type TabType = "overview" | "leaderboard";

export default function ClansPage() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [clanSearch, setClanSearch] = useState("");

  if (!USER_HAS_CLAN) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] p-6">
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Clans</h1>
            <p className="text-gray-400 text-sm">Compete together. Rise together.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="hcg-card rounded-2xl p-8 text-center border border-[#2A2A35]">
              <Plus size={36} className="text-[#FFB800] mx-auto mb-3" />
              <h2 className="text-lg font-bold text-white mb-2">Create a Clan</h2>
              <p className="text-gray-400 text-sm mb-6">Build your own team, set your tag, recruit members and compete in clan wars.</p>
              <button className="hcg-btn-primary px-8 py-3 rounded-xl font-bold w-full">Create Clan</button>
            </div>
            <div className="hcg-card rounded-2xl p-8 text-center border border-[#2A2A35]">
              <Search size={36} className="text-[#FFB800] mx-auto mb-3" />
              <h2 className="text-lg font-bold text-white mb-2">Find a Clan</h2>
              <p className="text-gray-400 text-sm mb-4">Search for clans recruiting players with your skill level and game preference.</p>
              <input
                type="text"
                placeholder="Search clans..."
                className="w-full bg-[#1a1a24] border border-[#2A2A35] rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FFB800]/50 mb-3"
              />
              <button className="hcg-btn-outline px-8 py-3 rounded-xl font-bold w-full">Search Clans</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header with tabs */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Clans</h1>
            <p className="text-gray-400 text-sm">Compete together. Rise together.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === "overview" ? "bg-[#FFB800] text-black" : "bg-[#111118] border border-[#2A2A35] text-gray-400 hover:text-white"}`}
            >
              My Clan
            </button>
            <button
              onClick={() => setActiveTab("leaderboard")}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === "leaderboard" ? "bg-[#FFB800] text-black" : "bg-[#111118] border border-[#2A2A35] text-gray-400 hover:text-white"}`}
            >
              Leaderboard
            </button>
          </div>
        </div>

        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Clan Profile Card */}
            <div className="hcg-card rounded-2xl overflow-hidden border border-[#2A2A35]">
              <div className={`h-24 bg-gradient-to-r ${MY_CLAN.banner} relative`} />
              <div className="p-6">
                <div className="flex items-start gap-6 -mt-10">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black border-4 border-[#111118] flex-shrink-0 text-black"
                    style={{ backgroundColor: MY_CLAN.color }}
                  >
                    {MY_CLAN.logo}
                  </div>
                  <div className="pt-4 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h2 className="text-xl font-black text-white">{MY_CLAN.name}</h2>
                          <span className="text-[#FFB800] font-mono font-bold text-sm bg-[#FFB800]/10 px-2 py-0.5 rounded">{MY_CLAN.tag}</span>
                          <span className="hcg-badge-gold text-xs px-2 py-0.5 rounded-full font-bold">RANK #{MY_CLAN.rank}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>{MY_CLAN.primaryGame}</span>
                          <span>•</span>
                          <span>{MY_CLAN.region}</span>
                          <span>•</span>
                          <span>Est. {MY_CLAN.founded}</span>
                        </div>
                      </div>
                      <button className="flex items-center gap-2 px-4 py-2 bg-[#FFB800] hover:bg-[#FFB800]/90 text-black rounded-xl text-sm font-bold transition-colors">
                        <Swords size={16} />
                        Challenge to War
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6 pt-6 border-t border-[#2A2A35]">
                  <div className="text-center">
                    <div className="text-xl font-black text-white">{MY_CLAN.memberCount}<span className="text-gray-500 text-sm">/{MY_CLAN.maxMembers}</span></div>
                    <div className="text-xs text-gray-500 mt-0.5">Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-black text-green-400">{MY_CLAN.warRecord.wins}</div>
                    <div className="text-xs text-gray-500 mt-0.5">War Wins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-black text-red-400">{MY_CLAN.warRecord.losses}</div>
                    <div className="text-xs text-gray-500 mt-0.5">War Losses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-black text-[#FFB800]">{MY_CLAN.seasonPoints.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 mt-0.5">Season Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-black text-white">{MY_CLAN.totalEarnings}</div>
                    <div className="text-xs text-gray-500 mt-0.5">Total Earned</div>
                  </div>
                </div>

                {/* MOTD */}
                <div className="mt-4 p-3 bg-[#1a1a24] rounded-xl border border-[#2A2A35]">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare size={13} className="text-[#FFB800]" />
                    <span className="text-xs font-semibold text-[#FFB800] uppercase tracking-wider">Message of the Day</span>
                    <button className="ml-auto text-gray-600 hover:text-gray-400 transition-colors">
                      <Edit2 size={12} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-300 italic">&ldquo;{MY_CLAN.motd}&rdquo;</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Member Roster */}
              <div className="lg:col-span-2 hcg-card rounded-2xl border border-[#2A2A35]">
                <div className="p-4 border-b border-[#2A2A35] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-[#FFB800]" />
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Member Roster</h3>
                    <span className="text-xs text-gray-500 bg-[#2A2A35] px-2 py-0.5 rounded-full">{MY_CLAN.memberCount}</span>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FFB800]/10 text-[#FFB800] rounded-lg text-xs font-semibold hover:bg-[#FFB800]/20 transition-colors">
                    <UserPlus size={13} />
                    Invite
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#2A2A35]">
                        <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Player</th>
                        <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Role</th>
                        <th className="text-right px-4 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">K/D</th>
                        <th className="text-right px-4 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Win%</th>
                        <th className="text-right px-4 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Pts</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {CLAN_MEMBERS.map((member) => (
                        <tr key={member.id} className="border-b border-[#1a1a24] hover:bg-[#1a1a24]/50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="relative">
                                <div className="w-7 h-7 rounded-full bg-[#2A2A35] flex items-center justify-center text-[10px] font-bold text-gray-300">
                                  {member.tag.slice(0, 2).toUpperCase()}
                                </div>
                                {member.online && (
                                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-[#111118]" />
                                )}
                              </div>
                              <div>
                                <p className="text-xs font-medium text-white">{member.tag}</p>
                                <p className="text-[10px] text-gray-500">{member.rank}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${ROLE_COLORS[member.role]}`}>
                              {member.role}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right text-xs font-semibold text-white">{member.kd}</td>
                          <td className="px-4 py-3 text-right text-xs font-semibold text-white">{member.winRate}%</td>
                          <td className="px-4 py-3 text-right text-xs font-semibold text-[#FFB800]">{member.points.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <button className="text-gray-600 hover:text-gray-400 transition-colors">
                              <MoreHorizontal size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent War Results */}
              <div className="hcg-card rounded-2xl border border-[#2A2A35]">
                <div className="p-4 border-b border-[#2A2A35] flex items-center gap-2">
                  <Swords size={16} className="text-[#FFB800]" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">Recent Wars</h3>
                </div>
                <div className="p-4 space-y-3">
                  {RECENT_WAR_RESULTS.map((war) => (
                    <div key={war.id} className="p-3 bg-[#1a1a24] rounded-xl border border-[#2A2A35]">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-black px-2 py-0.5 rounded ${RESULT_COLORS[war.result as keyof typeof RESULT_COLORS]}`}>
                            {war.result}
                          </span>
                          <span className="text-xs font-bold text-white">{war.score}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={10} className="text-gray-500" />
                          <span className="text-[10px] text-gray-500">{war.date}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 mb-1">vs. {war.opponent}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-600">{war.mode}</span>
                        <span className={`text-xs font-bold ${war.prize.startsWith("+") ? "text-green-400" : "text-red-400"}`}>
                          {war.prize}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 pt-0">
                  <button className="w-full py-2 text-xs text-[#FFB800] hover:text-white border border-[#FFB800]/30 hover:border-[#FFB800] rounded-lg transition-colors font-medium">
                    Challenge a Clan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "leaderboard" && (
          <div className="space-y-4">
            {/* Search */}
            <div className="flex gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={clanSearch}
                  onChange={(e) => setClanSearch(e.target.value)}
                  placeholder="Search clans..."
                  className="w-full bg-[#111118] border border-[#2A2A35] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FFB800]/50 transition-colors"
                />
              </div>
              <button className="hcg-btn-primary px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
                <Plus size={16} />
                Create Clan
              </button>
            </div>

            {/* Leaderboard Table */}
            <div className="hcg-card rounded-2xl border border-[#2A2A35] overflow-hidden">
              <div className="p-4 border-b border-[#2A2A35] flex items-center gap-2">
                <Trophy size={16} className="text-[#FFB800]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Season Leaderboard — Top 20 Clans</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#2A2A35]">
                      <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider w-12">Rank</th>
                      <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Clan</th>
                      <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Game</th>
                      <th className="text-right px-4 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Members</th>
                      <th className="text-right px-4 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">War Record</th>
                      <th className="text-right px-4 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Points</th>
                      <th className="text-right px-4 py-3 text-xs text-gray-500 font-medium uppercase tracking-wider">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TOP_CLANS.filter((c) =>
                      !clanSearch || c.name.toLowerCase().includes(clanSearch.toLowerCase()) || c.tag.toLowerCase().includes(clanSearch.toLowerCase())
                    ).map((clan) => {
                      const isMyClан = clan.tag === MY_CLAN.tag;
                      return (
                        <tr
                          key={clan.rank}
                          className={`border-b border-[#1a1a24] hover:bg-[#1a1a24]/50 transition-colors ${isMyClан ? "bg-[#FFB800]/5 border-[#FFB800]/20" : ""}`}
                        >
                          <td className="px-4 py-3">
                            <span className={`text-sm font-black ${clan.rank === 1 ? "text-[#FFB800]" : clan.rank === 2 ? "text-gray-300" : clan.rank === 3 ? "text-amber-600" : "text-gray-500"}`}>
                              #{clan.rank}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${isMyClан ? "bg-[#FFB800] text-black" : "bg-[#2A2A35] text-gray-300"}`}>
                                {clan.tag.replace(/[\[\]]/g, "").slice(0, 2)}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className={`text-sm font-semibold ${isMyClан ? "text-[#FFB800]" : "text-white"}`}>{clan.name}</p>
                                  {isMyClан && <span className="text-[10px] bg-[#FFB800]/10 text-[#FFB800] px-1.5 py-0.5 rounded font-bold">YOU</span>}
                                </div>
                                <p className="text-xs text-gray-500 font-mono">{clan.tag}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-400">{clan.game}</td>
                          <td className="px-4 py-3 text-right text-sm text-white font-medium">
                            <div className="flex items-center justify-end gap-1">
                              <Users size={13} className="text-gray-500" />
                              {clan.members}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right text-sm font-mono text-gray-300">{clan.warRecord}</td>
                          <td className="px-4 py-3 text-right text-sm font-bold text-[#FFB800]">{clan.points.toLocaleString()}</td>
                          <td className="px-4 py-3 text-right">
                            {clan.trend === "up" ? (
                              <ChevronUp size={16} className="text-green-400 ml-auto" />
                            ) : clan.trend === "down" ? (
                              <ChevronDown size={16} className="text-red-400 ml-auto" />
                            ) : (
                              <span className="text-gray-600 text-xs ml-auto block text-right">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
