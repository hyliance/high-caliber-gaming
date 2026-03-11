"use client";

import { useState } from "react";
import {
  Image,
  Video,
  Link2,
  BarChart2,
  Tag,
  ChevronUp,
  ChevronDown,
  MessageSquare,
  Share2,
  Bookmark,
  TrendingUp,
  Flame,
  Zap,
  Clock,
  Users,
  Trophy,
  Shield,
  Star,
  MoreHorizontal,
  Send,
} from "lucide-react";

const MOCK_POSTS = [
  {
    id: 1,
    type: "IMAGE",
    author: { tag: "xX_SniperKing_Xx", avatar: "SK", color: "#FFB800" },
    community: "Call of Duty",
    timestamp: "2h ago",
    title: "Finally hit Diamond rank after 300 hours grind!",
    content: "Been grinding ranked for the past two weeks straight. The final game was absolutely insane — came back from a 0-3 deficit to win 4-3 in overtime. The clutch plays at the end were unreal.",
    upvotes: 1284,
    downvotes: 42,
    comments: 97,
    hasImage: true,
    saved: false,
    userVote: null,
  },
  {
    id: 2,
    type: "TEXT",
    author: { tag: "ValorantViper99", avatar: "VV", color: "#FF4655" },
    community: "Valorant",
    timestamp: "3h ago",
    title: "PSA: New ranked changes completely broke the matchmaking system",
    content: "After the latest patch, I've been getting matched with players who are 3 full ranks below me consistently. This is affecting competitive integrity significantly and Riot needs to address it ASAP.",
    upvotes: 3421,
    downvotes: 218,
    comments: 445,
    hasImage: false,
    saved: true,
    userVote: "up",
  },
  {
    id: 3,
    type: "VIDEO",
    author: { tag: "ApexPredator_Lena", avatar: "AL", color: "#4ade80" },
    community: "Apex Legends",
    timestamp: "4h ago",
    title: "20-kill 4K damage game with Newcastle — full ranked game VOD",
    content: "Been practicing this Newcastle movement tech for weeks. This game everything clicked. Timestamps in the comments for key fights.",
    upvotes: 876,
    downvotes: 15,
    comments: 134,
    hasImage: true,
    saved: false,
    userVote: null,
  },
  {
    id: 4,
    type: "POLL",
    author: { tag: "RocketLeague_Dev", avatar: "RL", color: "#3b82f6" },
    community: "Rocket League",
    timestamp: "5h ago",
    title: "Which mechanic do you think has the highest skill ceiling?",
    content: "Been debating with my team about this. Curious what the community thinks.",
    upvotes: 2103,
    downvotes: 87,
    comments: 312,
    hasImage: false,
    saved: false,
    userVote: "down",
    poll: {
      options: [
        { label: "Musty Flick", votes: 1840 },
        { label: "Air Dribble", votes: 2910 },
        { label: "Ceiling Shot", votes: 1230 },
        { label: "Double Tap", votes: 980 },
      ],
      totalVotes: 6960,
    },
  },
  {
    id: 5,
    type: "TEXT",
    author: { tag: "ProCoach_Marcus", avatar: "PM", color: "#a855f7" },
    community: "General Gaming",
    timestamp: "6h ago",
    title: "5 mental game tips that took me from Plat to Diamond in 2 weeks",
    content: "Mental game is 60% of ranked success. Here's the exact framework I use with my coaching clients: tilt management, VOD review habits, micro-goal setting, warm-up routines, and post-session review.",
    upvotes: 5672,
    downvotes: 134,
    comments: 891,
    hasImage: false,
    saved: false,
    userVote: "up",
  },
  {
    id: 6,
    type: "IMAGE",
    author: { tag: "Fragmaster_Dmitri", avatar: "FD", color: "#f97316" },
    community: "Call of Duty",
    timestamp: "7h ago",
    title: "New SMG loadout is absolutely broken right now — 0.8s TTK",
    content: "Just put together this loadout after watching the HCG pro matches. The barrel combo reduces recoil to basically zero while maintaining max damage range.",
    upvotes: 2198,
    downvotes: 456,
    comments: 267,
    hasImage: true,
    saved: false,
    userVote: null,
  },
  {
    id: 7,
    type: "TEXT",
    author: { tag: "EsportsAnalyst_Kim", avatar: "EK", color: "#06b6d4" },
    community: "Esports",
    timestamp: "9h ago",
    title: "HCG Spring Invitational bracket predictions — my picks and analysis",
    content: "After reviewing all 16 teams' recent form, map statistics, and head-to-head records, here's my full bracket prediction with confidence percentages for each matchup.",
    upvotes: 1876,
    downvotes: 92,
    comments: 203,
    hasImage: false,
    saved: true,
    userVote: null,
  },
  {
    id: 8,
    type: "VIDEO",
    author: { tag: "ClipGod_Tyrese", avatar: "CT", color: "#FFB800" },
    community: "Valorant",
    timestamp: "10h ago",
    title: "1v5 clutch to win the tournament — unedited POV",
    content: "This was in the HCG Weekly Cup quarterfinals. 12 seconds left on the clock, 1v5, enemy all full buy. Still can't believe this happened.",
    upvotes: 14302,
    downvotes: 287,
    comments: 1847,
    hasImage: true,
    saved: false,
    userVote: null,
  },
  {
    id: 9,
    type: "TEXT",
    author: { tag: "GameDev_Sara", avatar: "GS", color: "#ec4899" },
    community: "General Gaming",
    timestamp: "12h ago",
    title: "Why crossplay matchmaking is fundamentally broken and how to fix it",
    content: "Three years working on ranked systems and here's my honest take on why console-PC crossplay creates inherent matchmaking problems and what actually works as a solution.",
    upvotes: 4231,
    downvotes: 178,
    comments: 534,
    hasImage: false,
    saved: false,
    userVote: null,
  },
  {
    id: 10,
    type: "IMAGE",
    author: { tag: "TacticalHaven_Priya", avatar: "TP", color: "#84cc16" },
    community: "Apex Legends",
    timestamp: "14h ago",
    title: "Mapped out every optimal rotation path for the new ranked map",
    content: "Spent 20 hours in the firing range and custom games plotting optimal rotation timings. Full breakdown with timestamps and zone coverage percentages.",
    upvotes: 3109,
    downvotes: 67,
    comments: 421,
    hasImage: true,
    saved: false,
    userVote: null,
  },
];

const TRENDING_COMMUNITIES = [
  { name: "Call of Duty", members: "24.1K", icon: "🎯", growth: "+12%" },
  { name: "Valorant", members: "31.4K", icon: "⚡", growth: "+8%" },
  { name: "Apex Legends", members: "18.7K", icon: "🔥", growth: "+15%" },
  { name: "Rocket League", members: "12.3K", icon: "🚀", growth: "+5%" },
  { name: "General Gaming", members: "45.2K", icon: "🎮", growth: "+3%" },
];

const TOP_PLAYERS = [
  { tag: "ClipGod_Tyrese", game: "Valorant", points: 9840, rank: 1 },
  { tag: "xX_SniperKing_Xx", game: "Call of Duty", points: 8230, rank: 2 },
  { tag: "ApexPredator_Lena", game: "Apex Legends", points: 7645, rank: 3 },
  { tag: "RocketPro_Jake", game: "Rocket League", points: 6980, rank: 4 },
  { tag: "FragQueen_Mia", game: "Valorant", points: 5421, rank: 5 },
];

const ACTIVE_TOURNAMENTS = [
  { name: "HCG Spring Invitational", game: "Valorant", prizePool: "$5,000", endsIn: "2d 4h", participants: "64/64" },
  { name: "Weekend Warchest", game: "Call of Duty", prizePool: "$1,200", endsIn: "14h", participants: "32/32" },
  { name: "Apex Champions Cup", game: "Apex Legends", prizePool: "$2,500", endsIn: "4d 12h", participants: "41/60" },
];

const SORT_TABS = [
  { id: "hot", label: "Hot", icon: Flame },
  { id: "new", label: "New", icon: Clock },
  { id: "top", label: "Top", icon: TrendingUp },
  { id: "rising", label: "Rising", icon: Zap },
];

const GAME_TAGS = ["Call of Duty", "Valorant", "Apex Legends", "Rocket League", "General"];

const TYPE_BADGE_COLORS: Record<string, string> = {
  TEXT: "bg-[#2A2A35] text-gray-400",
  IMAGE: "bg-blue-900/40 text-blue-400",
  VIDEO: "bg-red-900/40 text-red-400",
  POLL: "bg-purple-900/40 text-purple-400",
};

function formatVotes(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

function PostCard({ post }: { post: (typeof MOCK_POSTS)[0] }) {
  const [vote, setVote] = useState<"up" | "down" | null>(post.userVote as "up" | "down" | null);
  const [upvotes, setUpvotes] = useState(post.upvotes);
  const [saved, setSaved] = useState(post.saved);

  const handleVote = (dir: "up" | "down") => {
    if (vote === dir) {
      setVote(null);
      setUpvotes(post.upvotes);
    } else {
      const prev = vote;
      setVote(dir);
      const base = post.upvotes;
      if (dir === "up") setUpvotes(prev === "down" ? base + 2 : base + 1);
      else setUpvotes(prev === "up" ? base - 2 : base - 1);
    }
  };

  return (
    <div className="hcg-card hcg-card-hover rounded-xl overflow-hidden">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0"
              style={{ backgroundColor: post.author.color }}
            >
              {post.author.avatar}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">{post.author.tag}</span>
                <span className="text-xs text-gray-500">in</span>
                <span className="text-xs font-medium text-[#FFB800]">{post.community}</span>
              </div>
              <span className="text-xs text-gray-500">{post.timestamp}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${TYPE_BADGE_COLORS[post.type]}`}>
              {post.type}
            </span>
            <button className="text-gray-500 hover:text-gray-300 transition-colors">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <h3 className="text-base font-semibold text-white mb-2 leading-snug">{post.title}</h3>
        <p className="text-sm text-gray-400 leading-relaxed line-clamp-2 mb-3">{post.content}</p>

        {/* Image placeholder */}
        {post.hasImage && (
          <div className="w-full h-48 bg-[#1a1a24] rounded-lg mb-3 flex items-center justify-center border border-[#2A2A35]">
            <div className="text-center">
              <Image size={28} className="text-gray-600 mx-auto mb-1" />
              <span className="text-xs text-gray-600">{post.type === "VIDEO" ? "Video Preview" : "Image"}</span>
            </div>
          </div>
        )}

        {/* Poll */}
        {post.poll && (
          <div className="space-y-2 mb-3">
            {post.poll.options.map((opt) => {
              const pct = Math.round((opt.votes / post.poll!.totalVotes) * 100);
              return (
                <div key={opt.label} className="relative">
                  <div className="w-full h-9 bg-[#1a1a24] rounded-lg overflow-hidden border border-[#2A2A35] cursor-pointer hover:border-[#FFB800]/50 transition-colors">
                    <div className="h-full bg-[#FFB800]/15 rounded-lg transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-between px-3">
                    <span className="text-sm text-white">{opt.label}</span>
                    <span className="text-xs text-[#FFB800] font-semibold">{pct}%</span>
                  </div>
                </div>
              );
            })}
            <p className="text-xs text-gray-500">{formatVotes(post.poll.totalVotes)} votes</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 pt-2 border-t border-[#2A2A35]">
          {/* Vote */}
          <div className="flex items-center gap-1 mr-1">
            <button
              onClick={() => handleVote("up")}
              className={`p-1.5 rounded transition-colors ${vote === "up" ? "text-[#FFB800] bg-[#FFB800]/10" : "text-gray-500 hover:text-[#FFB800] hover:bg-[#FFB800]/10"}`}
            >
              <ChevronUp size={18} />
            </button>
            <span className={`text-sm font-semibold min-w-[2rem] text-center ${vote === "up" ? "text-[#FFB800]" : vote === "down" ? "text-red-400" : "text-gray-300"}`}>
              {formatVotes(upvotes)}
            </span>
            <button
              onClick={() => handleVote("down")}
              className={`p-1.5 rounded transition-colors ${vote === "down" ? "text-red-400 bg-red-400/10" : "text-gray-500 hover:text-red-400 hover:bg-red-400/10"}`}
            >
              <ChevronDown size={18} />
            </button>
          </div>

          {/* Comments */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-[#2A2A35] transition-colors text-sm">
            <MessageSquare size={15} />
            <span>{formatVotes(post.comments)}</span>
          </button>

          {/* Share */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-[#2A2A35] transition-colors text-sm">
            <Share2 size={15} />
            <span>Share</span>
          </button>

          {/* Save */}
          <button
            onClick={() => setSaved(!saved)}
            className={`ml-auto p-1.5 rounded transition-colors ${saved ? "text-[#FFB800]" : "text-gray-500 hover:text-[#FFB800]"}`}
          >
            <Bookmark size={16} fill={saved ? "#FFB800" : "none"} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FeedPage() {
  const [sortTab, setSortTab] = useState("hot");
  const [postText, setPostText] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [showTagMenu, setShowTagMenu] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0F] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex gap-6">
          {/* Main Feed */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Post Composer */}
            <div className="hcg-card rounded-xl p-4">
              <div className="flex gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-[#FFB800] flex items-center justify-center text-black font-bold text-sm flex-shrink-0">
                  ME
                </div>
                <textarea
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  placeholder="Share something with the community..."
                  className="flex-1 bg-[#1a1a24] border border-[#2A2A35] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FFB800]/50 resize-none h-16 transition-colors"
                />
              </div>
              <div className="flex items-center gap-2 pl-12">
                <button className="p-2 rounded-lg text-gray-500 hover:text-[#FFB800] hover:bg-[#FFB800]/10 transition-colors" title="Add Image">
                  <Image size={16} />
                </button>
                <button className="p-2 rounded-lg text-gray-500 hover:text-[#FFB800] hover:bg-[#FFB800]/10 transition-colors" title="Add Video">
                  <Video size={16} />
                </button>
                <button className="p-2 rounded-lg text-gray-500 hover:text-[#FFB800] hover:bg-[#FFB800]/10 transition-colors" title="Add Link">
                  <Link2 size={16} />
                </button>
                <button className="p-2 rounded-lg text-gray-500 hover:text-[#FFB800] hover:bg-[#FFB800]/10 transition-colors" title="Create Poll">
                  <BarChart2 size={16} />
                </button>

                {/* Game Tag */}
                <div className="relative ml-1">
                  <button
                    onClick={() => setShowTagMenu(!showTagMenu)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a1a24] border border-[#2A2A35] text-xs text-gray-400 hover:border-[#FFB800]/50 transition-colors"
                  >
                    <Tag size={12} />
                    {selectedTag || "Tag Game"}
                  </button>
                  {showTagMenu && (
                    <div className="absolute top-full left-0 mt-1 bg-[#111118] border border-[#2A2A35] rounded-lg shadow-xl z-10 min-w-[140px] overflow-hidden">
                      {GAME_TAGS.map((tag) => (
                        <button
                          key={tag}
                          onClick={() => { setSelectedTag(tag); setShowTagMenu(false); }}
                          className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-[#2A2A35] hover:text-white transition-colors"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  disabled={!postText.trim()}
                  className="ml-auto hcg-btn-primary px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send size={12} />
                  Post
                </button>
              </div>
            </div>

            {/* Sort Tabs */}
            <div className="flex gap-1 bg-[#111118] rounded-xl p-1 border border-[#2A2A35]">
              {SORT_TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setSortTab(id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                    sortTab === id
                      ? "bg-[#FFB800] text-black"
                      : "text-gray-400 hover:text-white hover:bg-[#2A2A35]"
                  }`}
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </div>

            {/* Posts */}
            <div className="space-y-4">
              {MOCK_POSTS.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-72 flex-shrink-0 space-y-4">
            {/* Trending Communities */}
            <div className="hcg-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={16} className="text-[#FFB800]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Trending Communities</h3>
              </div>
              <div className="space-y-3">
                {TRENDING_COMMUNITIES.map((community, i) => (
                  <div key={community.name} className="flex items-center gap-3 cursor-pointer group">
                    <span className="text-xs text-gray-600 w-4 font-mono">{i + 1}</span>
                    <div className="w-8 h-8 rounded-full bg-[#1a1a24] flex items-center justify-center text-base border border-[#2A2A35] group-hover:border-[#FFB800]/40 transition-colors">
                      {community.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white group-hover:text-[#FFB800] transition-colors truncate">{community.name}</p>
                      <p className="text-xs text-gray-500">{community.members} members</p>
                    </div>
                    <span className="text-xs text-green-400 font-semibold">{community.growth}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Players */}
            <div className="hcg-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <Star size={16} className="text-[#FFB800]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Top Players This Week</h3>
              </div>
              <div className="space-y-3">
                {TOP_PLAYERS.map((player) => (
                  <div key={player.tag} className="flex items-center gap-3">
                    <span className={`text-xs font-bold w-4 text-center ${player.rank === 1 ? "text-[#FFB800]" : player.rank === 2 ? "text-gray-300" : player.rank === 3 ? "text-amber-600" : "text-gray-600"}`}>
                      {player.rank}
                    </span>
                    <div className="w-7 h-7 rounded-full bg-[#2A2A35] flex items-center justify-center text-[10px] font-bold text-gray-300">
                      {player.tag.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-white truncate">{player.tag}</p>
                      <p className="text-[10px] text-gray-500">{player.game}</p>
                    </div>
                    <span className="text-xs text-[#FFB800] font-semibold">{player.points.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Tournaments */}
            <div className="hcg-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <Trophy size={16} className="text-[#FFB800]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Active Tournaments</h3>
              </div>
              <div className="space-y-3">
                {ACTIVE_TOURNAMENTS.map((t) => (
                  <div key={t.name} className="p-3 bg-[#1a1a24] rounded-lg border border-[#2A2A35] hover:border-[#FFB800]/30 transition-colors cursor-pointer">
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-xs font-semibold text-white leading-snug flex-1 mr-2">{t.name}</p>
                      <span className="text-xs font-bold text-[#FFB800] flex-shrink-0">{t.prizePool}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-500">{t.game} • {t.participants}</span>
                      <div className="flex items-center gap-1">
                        <Clock size={10} className="text-red-400" />
                        <span className="text-[10px] text-red-400">{t.endsIn}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-3 py-2 text-xs text-[#FFB800] hover:text-white border border-[#FFB800]/30 hover:border-[#FFB800] rounded-lg transition-colors font-medium">
                View All Tournaments
              </button>
            </div>

            {/* Community info */}
            <div className="hcg-card rounded-xl p-4 bg-gradient-to-br from-[#FFB800]/5 to-transparent border border-[#FFB800]/20">
              <div className="flex items-center gap-2 mb-2">
                <Shield size={16} className="text-[#FFB800]" />
                <h3 className="text-sm font-bold text-white">Global Feed</h3>
              </div>
              <p className="text-xs text-gray-400 mb-3">Showing posts from all communities. Join communities to personalize your feed.</p>
              <button className="w-full py-2 bg-[#FFB800] hover:bg-[#FFB800]/90 text-black text-xs font-bold rounded-lg transition-colors">
                Browse Communities
              </button>
            </div>

            {/* Users online */}
            <div className="hcg-card rounded-xl p-4">
              <div className="flex items-center gap-2">
                <Users size={14} className="text-green-400" />
                <span className="text-xs text-gray-400">
                  <span className="text-white font-semibold">8,421</span> players online now
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
