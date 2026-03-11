"use client";

import { useState } from "react";
import {
  Search,
  Plus,
  Users,
  FileText,
  Lock,
  Globe,
  ShieldAlert,
  CheckCircle,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";

type CommunityType = "Public" | "Restricted" | "Private";

interface Community {
  id: number;
  name: string;
  icon: string;
  category: string;
  description: string;
  members: number;
  postsToday: number;
  type: CommunityType;
  joined: boolean;
  featured?: boolean;
  verified?: boolean;
  color: string;
  banner: string;
  moderators: number;
  online: number;
}

const COMMUNITIES: Community[] = [
  {
    id: 1, name: "Call of Duty Competitive", icon: "🎯", category: "Call of Duty",
    description: "The hub for all competitive CoD content — ranked tips, loadouts, clips, and tournament results.",
    members: 24100, postsToday: 87, type: "Public", joined: true,
    featured: true, verified: true, color: "#FF6B35", banner: "from-orange-900/40 to-red-900/20",
    moderators: 8, online: 1240,
  },
  {
    id: 2, name: "Valorant HCG", icon: "⚡", category: "Valorant",
    description: "Official HCG Valorant community. Agent guides, ranked discussions, team finding, and HCG tournament coverage.",
    members: 31400, postsToday: 142, type: "Public", joined: true,
    featured: true, verified: true, color: "#FF4655", banner: "from-red-900/40 to-pink-900/20",
    moderators: 12, online: 2180,
  },
  {
    id: 3, name: "Apex Legends Arena", icon: "🔥", category: "Apex",
    description: "Legends, lore, ranked grind, and clip showcases. Find your squad and dominate the arena.",
    members: 18700, postsToday: 63, type: "Public", joined: false,
    featured: true, verified: true, color: "#FF4500", banner: "from-orange-900/40 to-yellow-900/20",
    moderators: 6, online: 890,
  },
  {
    id: 4, name: "Rocket League Society", icon: "🚀", category: "Rocket League",
    description: "Car soccer done right. Mechanic tutorials, ranked tips, and pro match analysis.",
    members: 12300, postsToday: 44, type: "Public", joined: false,
    verified: true, color: "#3b82f6", banner: "from-blue-900/40 to-cyan-900/20",
    moderators: 5, online: 612,
  },
  {
    id: 5, name: "FPS Strategy Vault", icon: "🧠", category: "General",
    description: "Deep tactical breakdowns and strategy discussions for competitive FPS titles.",
    members: 8900, postsToday: 31, type: "Public", joined: false,
    color: "#a855f7", banner: "from-purple-900/40 to-indigo-900/20",
    moderators: 4, online: 340,
  },
  {
    id: 6, name: "HCG Pro Scene", icon: "🏆", category: "General",
    description: "Professional esports news, tournament brackets, team signings, and match VODs.",
    members: 45200, postsToday: 219, type: "Public", joined: true,
    verified: true, color: "#FFB800", banner: "from-yellow-900/40 to-amber-900/20",
    moderators: 15, online: 3400,
  },
  {
    id: 7, name: "Valorant Immortal+", icon: "💎", category: "Valorant",
    description: "High elo discussions only. Restricted to Immortal rank and above. Proof required.",
    members: 4200, postsToday: 58, type: "Restricted", joined: false,
    color: "#06b6d4", banner: "from-cyan-900/40 to-blue-900/20",
    moderators: 3, online: 280,
  },
  {
    id: 8, name: "CoD Warzone Tactics", icon: "🗺️", category: "Call of Duty",
    description: "Drop spots, rotation meta, loadout synergies, and Warzone-specific strategy content.",
    members: 15600, postsToday: 71, type: "Public", joined: false,
    color: "#84cc16", banner: "from-green-900/40 to-lime-900/20",
    moderators: 6, online: 780,
  },
  {
    id: 9, name: "Apex Predator Club", icon: "👑", category: "Apex",
    description: "Exclusive community for Apex Predator ranked players. Verified by account link.",
    members: 1800, postsToday: 27, type: "Restricted", joined: false,
    color: "#FF4500", banner: "from-orange-900/40 to-red-900/20",
    moderators: 2, online: 95,
  },
  {
    id: 10, name: "Content Creators Hub", icon: "🎬", category: "General",
    description: "A private space for HCG content creators to collaborate, share drafts, and plan events.",
    members: 340, postsToday: 12, type: "Private", joined: false,
    color: "#ec4899", banner: "from-pink-900/40 to-rose-900/20",
    moderators: 2, online: 18,
  },
  {
    id: 11, name: "RL Grand Champ Lounge", icon: "🎖️", category: "Rocket League",
    description: "For GC+ ranked players. Discuss high-level mechanics, team play, and pro career paths.",
    members: 2100, postsToday: 19, type: "Restricted", joined: false,
    color: "#3b82f6", banner: "from-blue-900/40 to-indigo-900/20",
    moderators: 3, online: 112,
  },
  {
    id: 12, name: "Mental Performance Lab", icon: "🧘", category: "General",
    description: "Psychology, tilt management, performance coaching and mental game improvement resources.",
    members: 6700, postsToday: 22, type: "Public", joined: true,
    color: "#10b981", banner: "from-emerald-900/40 to-teal-900/20",
    moderators: 4, online: 267,
  },
  {
    id: 13, name: "New Players Welcome", icon: "🌱", category: "General",
    description: "A friendly space for newcomers to HCG. Ask questions, find mentors, and learn the ropes.",
    members: 19800, postsToday: 95, type: "Public", joined: false,
    color: "#22c55e", banner: "from-green-900/40 to-emerald-900/20",
    moderators: 10, online: 1100,
  },
  {
    id: 14, name: "Clip Showcase Theater", icon: "🎭", category: "General",
    description: "Show off your best plays, insane clips, and highlight reels. Community votes for weekly featured clip.",
    members: 28900, postsToday: 163, type: "Public", joined: false,
    color: "#f59e0b", banner: "from-amber-900/40 to-yellow-900/20",
    moderators: 7, online: 1890,
  },
  {
    id: 15, name: "Valorant IGL Network", icon: "🎙️", category: "Valorant",
    description: "In-game leaders sharing strats, discussing comms, and developing leadership skills.",
    members: 3100, postsToday: 16, type: "Restricted", joined: false,
    color: "#FF4655", banner: "from-red-900/40 to-rose-900/20",
    moderators: 3, online: 145,
  },
];

const CATEGORIES = ["All", "Call of Duty", "Valorant", "Apex", "Rocket League", "General"];

const TYPE_CONFIG: Record<CommunityType, { icon: typeof Globe; color: string; bg: string }> = {
  Public: { icon: Globe, color: "text-green-400", bg: "bg-green-900/30" },
  Restricted: { icon: ShieldAlert, color: "text-yellow-400", bg: "bg-yellow-900/30" },
  Private: { icon: Lock, color: "text-red-400", bg: "bg-red-900/30" },
};

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

function CommunityCard({ community, featured = false }: { community: Community; featured?: boolean }) {
  const [joined, setJoined] = useState(community.joined);
  const TypeIcon = TYPE_CONFIG[community.type].icon;

  if (featured) {
    return (
      <div className={`hcg-card rounded-xl overflow-hidden border border-[#2A2A35] hover:border-[#FFB800]/30 transition-all cursor-pointer group`}>
        {/* Banner */}
        <div className={`h-20 bg-gradient-to-r ${community.banner} relative`}>
          <div className="absolute inset-0 bg-black/20" />
          {community.verified && (
            <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full">
              <CheckCircle size={12} className="text-[#FFB800]" />
              <span className="text-[10px] text-[#FFB800] font-semibold">VERIFIED</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start gap-3 mb-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl -mt-8 border-2 border-[#111118] bg-[#1a1a24] flex-shrink-0"
            >
              {community.icon}
            </div>
            <div className="pt-1 flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="text-sm font-bold text-white group-hover:text-[#FFB800] transition-colors truncate">{community.name}</h3>
              </div>
              <div className="flex items-center gap-1.5">
                <TypeIcon size={11} className={TYPE_CONFIG[community.type].color} />
                <span className={`text-[10px] font-medium ${TYPE_CONFIG[community.type].color}`}>{community.type}</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-4 leading-relaxed line-clamp-2">{community.description}</p>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1.5">
              <Users size={12} className="text-gray-500" />
              <span className="text-xs text-gray-400">{formatNumber(community.members)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileText size={12} className="text-gray-500" />
              <span className="text-xs text-gray-400">{community.postsToday} today</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-xs text-gray-400">{formatNumber(community.online)} online</span>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); setJoined(!joined); }}
            className={`w-full py-2 rounded-lg text-sm font-semibold transition-all ${
              joined
                ? "bg-[#2A2A35] text-gray-300 hover:bg-red-900/30 hover:text-red-400"
                : "bg-[#FFB800] text-black hover:bg-[#FFB800]/90"
            }`}
          >
            {joined ? "Joined" : "Join Community"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="hcg-card rounded-xl p-4 flex items-center gap-4 hover:border-[#FFB800]/20 border border-[#2A2A35] transition-all cursor-pointer group">
      <div className="w-11 h-11 rounded-xl bg-[#1a1a24] flex items-center justify-center text-2xl flex-shrink-0 border border-[#2A2A35] group-hover:border-[#FFB800]/30 transition-colors">
        {community.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="text-sm font-semibold text-white group-hover:text-[#FFB800] transition-colors truncate">{community.name}</h3>
          {community.verified && <CheckCircle size={12} className="text-[#FFB800] flex-shrink-0" />}
        </div>
        <p className="text-xs text-gray-500 line-clamp-1 mb-1.5">{community.description}</p>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-600">{formatNumber(community.members)} members</span>
          <span className="text-xs text-gray-600">{community.postsToday} posts/day</span>
          <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${TYPE_CONFIG[community.type].bg}`}>
            <TypeIcon size={10} className={TYPE_CONFIG[community.type].color} />
            <span className={`text-[10px] font-medium ${TYPE_CONFIG[community.type].color}`}>{community.type}</span>
          </div>
        </div>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); setJoined(!joined); }}
        className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex-shrink-0 ${
          joined
            ? "bg-[#2A2A35] text-gray-300 hover:bg-red-900/30 hover:text-red-400"
            : "border border-[#FFB800] text-[#FFB800] hover:bg-[#FFB800] hover:text-black"
        }`}
      >
        {joined ? "Joined" : "Join"}
      </button>
    </div>
  );
}

export default function CommunitiesPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"members" | "activity" | "new">("members");

  const featured = COMMUNITIES.filter((c) => c.featured);
  const filtered = COMMUNITIES.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || c.category === category;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === "members") return b.members - a.members;
    if (sortBy === "activity") return b.postsToday - a.postsToday;
    return b.id - a.id;
  });

  return (
    <div className="min-h-screen bg-[#0A0A0F] p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Communities</h1>
            <p className="text-gray-400 text-sm">Join communities to connect with players who share your interests.</p>
          </div>
          <button className="hcg-btn-primary px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
            <Plus size={16} />
            Create Community
          </button>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search communities..."
              className="w-full bg-[#111118] border border-[#2A2A35] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FFB800]/50 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 whitespace-nowrap">Sort by:</span>
            {(["members", "activity", "new"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSortBy(s)}
                className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-all ${
                  sortBy === s ? "bg-[#FFB800] text-black" : "bg-[#111118] border border-[#2A2A35] text-gray-400 hover:text-white"
                }`}
              >
                {s === "members" ? "Members" : s === "activity" ? "Activity" : "Newest"}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category === cat
                  ? "bg-[#FFB800] text-black"
                  : "bg-[#111118] border border-[#2A2A35] text-gray-400 hover:text-white hover:border-[#FFB800]/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Communities */}
        {category === "All" && !search && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Star size={16} className="text-[#FFB800]" />
              <h2 className="text-base font-bold text-white uppercase tracking-wider">Featured Communities</h2>
              <div className="flex-1 h-px bg-[#2A2A35] ml-2" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featured.map((c) => (
                <CommunityCard key={c.id} community={c} featured />
              ))}
            </div>
          </section>
        )}

        {/* All Communities */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-[#FFB800]" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              {category === "All" ? "All Communities" : `${category} Communities`}
            </h2>
            <span className="text-xs text-gray-500 bg-[#2A2A35] px-2 py-0.5 rounded-full">{filtered.length}</span>
            <div className="flex-1 h-px bg-[#2A2A35] ml-2" />
          </div>

          {filtered.length === 0 ? (
            <div className="hcg-card rounded-xl p-12 text-center">
              <Search size={32} className="text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">No communities found</p>
              <p className="text-gray-600 text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((c) => (
                <CommunityCard key={c.id} community={c} />
              ))}
            </div>
          )}
        </section>

        {/* Create CTA */}
        <div className="hcg-card rounded-2xl p-8 text-center bg-gradient-to-br from-[#FFB800]/5 via-transparent to-transparent border border-[#FFB800]/20">
          <Zap size={32} className="text-[#FFB800] mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-2">Don't see your community?</h3>
          <p className="text-gray-400 text-sm mb-6 max-w-md mx-auto">
            Create a new community for your game, region, or play style. Community creators get moderation tools, custom branding, and HCG visibility boosts.
          </p>
          <button className="hcg-btn-primary px-8 py-3 rounded-xl font-bold inline-flex items-center gap-2">
            <Plus size={18} />
            Create a Community
          </button>
        </div>
      </div>
    </div>
  );
}
