import Link from "next/link";
import {
  Trophy,
  Users,
  Swords,
  BookOpen,
  Shield,
  ChevronRight,
  Star,
  Zap,
  TrendingUp,
  ArrowRight,
  Award,
  Clock,
  Medal,
} from "lucide-react";
import { HCGMark } from "@/components/ui/hcg-logo";
import { TopoTexture } from "@/components/ui/topo-texture";

const features = [
  { icon: TrendingUp, label: "Ladders",    desc: "Ranked 1v1 & team ladders across all titles" },
  { icon: Trophy,     label: "Tournaments",desc: "Daily, weekly, and major prize tournaments" },
  { icon: Shield,     label: "Leagues",    desc: "Season-long competitive leagues with playoffs" },
  { icon: Swords,     label: "Wagering",   desc: "Skill-based wagering with secure payouts" },
  { icon: Users,      label: "Clans",      desc: "Build and manage your competitive team" },
  { icon: BookOpen,   label: "Coaching",   desc: "1-on-1 sessions with verified pro coaches" },
];

const stats = [
  { value: "50K+",  label: "Active Players",    icon: Users,  desc: "Verified competitive players across 15+ game titles competing daily." },
  { value: "$500K+",label: "Prizes Awarded",    icon: Trophy, desc: "Real cash prizes paid out to winners across tournaments and leagues." },
  { value: "200+",  label: "Verified Coaches",  icon: Star,   desc: "Pro-level coaches available for 1-on-1 sessions to accelerate your growth." },
];

const games = [
  { name: "Call of Duty",    abbr: "CoD",  color: "#FF6B00", players: "12,400+" },
  { name: "Valorant",        abbr: "VAL",  color: "#FF4655", players: "9,200+"  },
  { name: "Apex Legends",    abbr: "APX",  color: "#DA292A", players: "7,800+"  },
  { name: "Fortnite",        abbr: "FN",   color: "#00C4FF", players: "6,500+"  },
  { name: "Rocket League",   abbr: "RL",   color: "#5DBAFF", players: "5,100+"  },
  { name: "CS2",             abbr: "CS2",  color: "#F5A623", players: "8,300+"  },
];

const coaches = [
  { name: "ProSniper_X",    game: "Call of Duty",  rating: 4.9, sessions: 312, tier: "Master" },
  { name: "ValorantViper",  game: "Valorant",      rating: 4.8, sessions: 247, tier: "Radiant" },
  { name: "ApexPredator",   game: "Apex Legends",  rating: 4.9, sessions: 198, tier: "Predator" },
];

const recentResults = [
  { name: "HCG Weekly Cup #18",    game: "Valorant",      winner: "NightHawks eSports", prize: "$500",   date: "Mar 8" },
  { name: "CoD Ladder Finals",     game: "Call of Duty",  winner: "DigitalStorm",       prize: "$1,200", date: "Mar 7" },
  { name: "RL Championship",       game: "Rocket League", winner: "SkyRocket FC",       prize: "$800",   date: "Mar 5" },
  { name: "CS2 Open Invitational", game: "CS2",           winner: "IronForge",          prize: "$2,000", date: "Mar 3" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-hcg-bg text-white overflow-x-hidden">

      {/* ── Navbar ──────────────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-hcg-border bg-hcg-bg/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <HCGMark size={36} variant="blue" />
              <div className="flex flex-col leading-none">
                <span className="font-azonix text-sm tracking-widest text-white uppercase">
                  High Caliber
                </span>
                <span className="font-azonix text-[10px] tracking-[0.3em] text-hcg-blue uppercase">
                  Gaming
                </span>
              </div>
            </div>

            {/* Nav links */}
            <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
              <Link href="/ladders"     className="hover:text-white transition-colors font-azonix text-xs tracking-wider">Ladders</Link>
              <Link href="/tournaments" className="hover:text-white transition-colors font-azonix text-xs tracking-wider">Tournaments</Link>
              <Link href="/leagues"     className="hover:text-white transition-colors font-azonix text-xs tracking-wider">Leagues</Link>
              <Link href="/coaching"    className="hover:text-white transition-colors font-azonix text-xs tracking-wider">Coaching</Link>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <Link href="/login"    className="hcg-btn-ghost text-sm px-4 py-2 rounded-lg font-azonix tracking-wider text-xs">Sign In</Link>
              <Link href="/register" className="hcg-btn-primary text-sm">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">

        {/* Topographic mountain texture — primary visual */}
        <TopoTexture
          className="topo-overlay"
          color="#00B4FF"
          opacity={1.0}
          variant="mountain"
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,180,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(0,180,255,0.6) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />

        {/* Radial glow — blue */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full bg-hcg-blue/5 blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] rounded-full bg-hcg-blue-mid/6 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-hcg-violet/5 blur-[100px] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Season badge */}
          <div className="inline-flex items-center gap-2 hcg-badge-blue mb-8 text-xs font-azonix tracking-widest uppercase px-4 py-1.5">
            <Zap className="w-3 h-3" />
            Season 4 Now Live — $50K Prize Pool
          </div>

          {/* Hero headline — KVC-Brute brush script */}
          <h1 className="leading-[0.9] mb-6">
            <span className="block font-brute text-7xl sm:text-9xl lg:text-[11rem] tracking-tight text-white drop-shadow-2xl">
              COMPETE.
            </span>
            <span className="block font-brute text-7xl sm:text-9xl lg:text-[11rem] tracking-tight text-white drop-shadow-2xl">
              RISE.
            </span>
            <span className="block font-brute text-7xl sm:text-9xl lg:text-[11rem] tracking-tight hc-brand-gradient-text drop-shadow-2xl">
              DOMINATE.
            </span>
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-sans">
            The premier competitive esports platform. Climb ranked ladders, compete in tournaments,
            join leagues, and get coached by the best — all in one place.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="hcg-btn-primary px-8 py-3 text-base rounded-lg glow-blue">
              Get Started — It&apos;s Free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#features" className="hcg-btn-outline px-8 py-3 text-base rounded-lg font-azonix tracking-wider text-sm">
              Learn More
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="mt-16 flex items-center justify-center gap-8 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-hcg-blue animate-pulse" />
              50,000+ players online
            </span>
            <span className="hidden sm:block">•</span>
            <span>No credit card required</span>
            <span className="hidden sm:block">•</span>
            <span>Free to compete</span>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-hcg-bg to-transparent" />
      </section>

      {/* ── Feature Strip ────────────────────────────────────────────── */}
      <section id="features" className="relative py-16 border-y border-hcg-border bg-hcg-card/30 overflow-hidden">
        {/* Subtle ridge topo behind strip */}
        <TopoTexture
          className="topo-overlay opacity-50"
          color="#3B7BF0"
          opacity={0.6}
          variant="ridge"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {features.map((f) => (
              <div
                key={f.label}
                className="flex flex-col items-center text-center gap-3 p-4 rounded-xl border border-hcg-border hover:border-hcg-blue/30 hover:bg-hcg-card transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-lg bg-hcg-blue/10 flex items-center justify-center group-hover:bg-hcg-blue/20 transition-colors">
                  <f.icon className="w-6 h-6 text-hcg-blue" />
                </div>
                <div>
                  <p className="font-azonix font-semibold text-xs tracking-wider uppercase text-white">{f.label}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-snug">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why HCG ──────────────────────────────────────────────────── */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <TopoTexture className="topo-overlay" color="#3B7BF0" opacity={0.7} variant="dual" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-label mb-3">The Platform</p>
            <h2 className="font-brute text-5xl sm:text-6xl lg:text-7xl tracking-tight">
              Why High Caliber Gaming?
            </h2>
            <p className="mt-4 text-gray-400 text-lg max-w-xl mx-auto font-sans">
              Built by competitors, for competitors. Every feature designed to elevate your game.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((s) => (
              <div
                key={s.label}
                className="relative rounded-2xl border border-hcg-border bg-hcg-card p-8 overflow-hidden group hover:border-hcg-blue/30 transition-all"
              >
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-hcg-blue/5 blur-3xl group-hover:bg-hcg-blue/10 transition-all" />
                <s.icon className="w-10 h-10 text-hcg-blue mb-6" />
                <p className="font-brute text-6xl hcg-gradient-text leading-none mb-2">
                  {s.value}
                </p>
                <p className="text-xl font-azonix text-white tracking-wide uppercase text-sm mb-3">{s.label}</p>
                <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Game Titles ───────────────────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-hcg-card/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="section-label mb-3">Game Titles</p>
              <h2 className="font-brute text-5xl sm:text-6xl">Compete Across Top Games</h2>
            </div>
            <Link href="/games" className="hidden sm:flex items-center gap-2 text-sm text-hcg-blue hover:text-hcg-blue-light transition-colors font-azonix tracking-wider">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {games.map((game) => (
              <div
                key={game.name}
                className="hcg-card-hover rounded-xl p-5 flex flex-col items-center text-center gap-3 group"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center font-azonix font-bold text-sm text-white"
                  style={{ backgroundColor: `${game.color}22`, border: `1px solid ${game.color}44` }}
                >
                  <span style={{ color: game.color }}>{game.abbr}</span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-white">{game.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{game.players} players</p>
                </div>
                <div className="hcg-badge-green text-xs">Active</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Coaching Spotlight ───────────────────────────────────────── */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <TopoTexture className="topo-overlay" color="#00B4FF" opacity={0.5} variant="ridge" />
        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="section-label mb-3">Coaching</p>
              <h2 className="font-brute text-5xl sm:text-6xl">Learn From the Best</h2>
              <p className="mt-3 text-gray-400 max-w-lg font-sans">
                Our verified coaches are top-ranked players who help you climb faster through personalized sessions.
              </p>
            </div>
            <Link href="/coaching" className="hidden sm:flex items-center gap-2 text-sm text-hcg-blue hover:text-hcg-blue-light transition-colors font-azonix tracking-wider">
              All Coaches <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coaches.map((coach) => (
              <div key={coach.name} className="hcg-card rounded-xl p-6 hover:border-hcg-blue/20 transition-all group cursor-pointer">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-hcg-blue-mid/20 to-hcg-blue/10 border border-hcg-blue/20 flex items-center justify-center font-azonix font-bold text-hcg-blue text-sm">
                    {coach.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{coach.name}</p>
                    <p className="text-xs text-gray-500">{coach.game}</p>
                    <span className="hcg-badge-blue mt-1 text-xs">{coach.tier}</span>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Rating</p>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-hcg-gold fill-hcg-gold" />
                      <span className="font-semibold text-white">{coach.rating}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Sessions</p>
                    <p className="font-semibold text-white">{coach.sessions}</p>
                  </div>
                </div>
                <button className="mt-5 w-full hcg-btn-primary rounded-lg py-2 text-sm justify-center">
                  Book Session
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Recent Tournament Results ─────────────────────────────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-hcg-card/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="section-label mb-3">Results</p>
              <h2 className="font-brute text-5xl sm:text-6xl">Recent Tournament Results</h2>
            </div>
            <Link href="/tournaments?tab=completed" className="hidden sm:flex items-center gap-2 text-sm text-hcg-blue hover:text-hcg-blue-light transition-colors font-azonix tracking-wider">
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentResults.map((result) => (
              <div key={result.name} className="hcg-card rounded-xl p-5 hover:border-hcg-blue/20 transition-all">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy className="w-4 h-4 text-hcg-blue" />
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {result.date}
                  </span>
                </div>
                <p className="font-semibold text-sm text-white mb-1">{result.name}</p>
                <p className="text-xs text-gray-500 mb-3">{result.game}</p>
                <div className="border-t border-hcg-border pt-3">
                  <p className="text-xs text-gray-500">Winner</p>
                  <p className="font-semibold text-hcg-blue text-sm mt-0.5">{result.winner}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Award className="w-3.5 h-3.5 text-green-400" />
                    <span className="text-green-400 font-semibold text-sm">{result.prize}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Season Ladder Highlights ──────────────────────────────────── */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <TopoTexture className="topo-overlay" color="#00B4FF" opacity={0.8} variant="mountain" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-label mb-3">Season 4</p>
            <h2 className="font-brute text-5xl sm:text-6xl lg:text-7xl mb-4">Top of the Mountain</h2>
            <p className="text-gray-400 max-w-lg mx-auto font-sans">
              The climb never stops. These are the players ruling Season 4.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { rank: 2, tag: "BladeRunner",   game: "Valorant",    pts: 4820, tier: "Diamond" },
              { rank: 1, tag: "NightHawkX",    game: "Call of Duty", pts: 5240, tier: "Master"  },
              { rank: 3, tag: "ApexPhantom",   game: "Apex Legends", pts: 4610, tier: "Diamond" },
            ].map((p) => (
              <div
                key={p.rank}
                className={`hcg-card rounded-2xl p-6 text-center relative overflow-hidden transition-all hover:border-hcg-blue/30 ${p.rank === 1 ? "border-hcg-blue/40 glow-blue sm:-mt-4" : ""}`}
              >
                {p.rank === 1 && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-hcg-blue to-transparent" />
                )}
                <div className={`w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center text-lg font-brute ${
                  p.rank === 1 ? "bg-hcg-blue/20 border border-hcg-blue/40 text-hcg-blue" :
                  "bg-hcg-card-hover border border-hcg-border text-gray-400"
                }`}>
                  {p.rank === 1 ? "👑" : `#${p.rank}`}
                </div>
                <p className="font-azonix text-sm text-white tracking-wider">{p.tag}</p>
                <p className="text-xs text-gray-500 mt-1">{p.game}</p>
                <p className={`font-brute text-3xl mt-3 ${p.rank === 1 ? "hcg-gradient-text" : "text-gray-300"}`}>
                  {p.pts.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">points</p>
                <span className={`mt-3 hcg-badge ${p.tier === "Master" ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "hcg-badge-blue"} text-xs`}>
                  {p.tier}
                </span>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/ladders" className="hcg-btn-secondary px-8 py-3 text-sm rounded-lg">
              View Full Leaderboard
              <Medal className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────── */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <TopoTexture className="topo-overlay" color="#3B7BF0" opacity={1} variant="ridge" />
        <div className="relative max-w-4xl mx-auto">
          <div className="relative rounded-2xl border border-hcg-blue/20 bg-gradient-to-br from-hcg-blue/10 via-hcg-card to-hcg-card overflow-hidden p-12 text-center">
            {/* Top glow bar */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-hcg-blue to-transparent" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-hcg-blue/8 blur-[80px]" />
            <div className="relative">
              <HCGMark size={56} variant="blue" className="mx-auto mb-6 animate-float-up" />
              <h2 className="font-brute text-5xl sm:text-6xl mb-4">
                Ready to compete at a{" "}
                <span className="hc-brand-gradient-text">higher level?</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto font-sans">
                Join 50,000+ players already competing on High Caliber Gaming.
                Free to start, ranked to dominate.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register" className="hcg-btn-primary px-10 py-3 text-base rounded-lg glow-blue">
                  Create Free Account
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/tournaments" className="hcg-btn-outline px-10 py-3 text-base rounded-lg font-azonix tracking-wider text-sm">
                  Browse Tournaments
                </Link>
              </div>
            </div>
            {/* Bottom glow bar */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-hcg-blue/50 to-transparent" />
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="border-t border-hcg-border bg-hcg-card/30 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <HCGMark size={32} variant="blue" />
                <div className="flex flex-col leading-none">
                  <span className="font-azonix text-xs tracking-widest text-white uppercase">High Caliber</span>
                  <span className="font-azonix text-[9px] tracking-[0.3em] text-hcg-blue uppercase">Gaming</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                The premier competitive esports platform for serious players.
              </p>
            </div>
            <div>
              <p className="font-azonix text-xs tracking-wider mb-4 text-white uppercase">Compete</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/ladders"     className="hover:text-white transition-colors">Ladders</Link></li>
                <li><Link href="/tournaments" className="hover:text-white transition-colors">Tournaments</Link></li>
                <li><Link href="/leagues"     className="hover:text-white transition-colors">Leagues</Link></li>
                <li><Link href="/wagering"    className="hover:text-white transition-colors">Wagering</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-azonix text-xs tracking-wider mb-4 text-white uppercase">Community</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/clans"        className="hover:text-white transition-colors">Clans</Link></li>
                <li><Link href="/coaching"     className="hover:text-white transition-colors">Coaching</Link></li>
                <li><Link href="/leaderboards" className="hover:text-white transition-colors">Leaderboards</Link></li>
                <li><Link href="/news"         className="hover:text-white transition-colors">News</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-azonix text-xs tracking-wider mb-4 text-white uppercase">Support</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/help"     className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/rules"    className="hover:text-white transition-colors">Rules</Link></li>
                <li><Link href="/disputes" className="hover:text-white transition-colors">Disputes</Link></li>
                <li><Link href="/contact"  className="hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-azonix text-xs tracking-wider mb-4 text-white uppercase">Legal</p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/terms"   className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-hcg-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-600">
              &copy; 2026 High Caliber Gaming. All rights reserved.
            </p>
            <p className="text-xs text-gray-600 font-azonix tracking-widest">
              BUILT FOR COMPETITORS. POWERED BY PASSION.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
