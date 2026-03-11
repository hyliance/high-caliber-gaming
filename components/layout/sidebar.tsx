"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import {
  LayoutDashboard,
  Trophy,
  Swords,
  Users,
  DollarSign,
  Wallet,
  Rss,
  MessageSquare,
  Shield,
  Building2,
  GraduationCap,
  BookOpen,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Star,
  ListOrdered,
  Medal,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HCGMark } from "@/components/ui/hcg-logo";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
  adminOnly?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "COMPETE",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/ladders", label: "Ladders", icon: ListOrdered },
      { href: "/tournaments", label: "Tournaments", icon: Trophy },
      { href: "/leagues", label: "Leagues", icon: Medal },
      { href: "/matches", label: "Matches", icon: Swords },
    ],
  },
  {
    title: "WAGER",
    items: [
      { href: "/wager", label: "Money Match", icon: DollarSign },
      { href: "/wallet", label: "Wallet", icon: Wallet },
    ],
  },
  {
    title: "SOCIAL",
    items: [
      { href: "/feed", label: "Feed", icon: Rss },
      { href: "/communities", label: "Communities", icon: Users },
      { href: "/messages", label: "Messages", icon: MessageSquare },
    ],
  },
  {
    title: "TEAM",
    items: [
      { href: "/clans", label: "Clans", icon: Shield },
      { href: "/organizations", label: "Organizations", icon: Building2 },
    ],
  },
  {
    title: "COACHING",
    items: [
      { href: "/coaching", label: "Find a Coach", icon: GraduationCap },
      { href: "/coaching/apply", label: "Become a Coach", icon: BookOpen },
    ],
  },
  {
    title: "ACCOUNT",
    items: [
      { href: "/profile", label: "Profile", icon: User },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

const ADMIN_SECTION: NavSection = {
  title: "ADMIN",
  items: [
    { href: "/admin", label: "Admin Panel", icon: ShieldCheck, adminOnly: true },
  ],
};

const TIER_STYLES: Record<string, { label: string; className: string }> = {
  BRONZE: { label: "Bronze", className: "text-amber-600 border-amber-600/30 bg-amber-600/10" },
  SILVER: { label: "Silver", className: "text-slate-300 border-slate-300/30 bg-slate-300/10" },
  GOLD: { label: "Gold", className: "text-hcg-gold border-hcg-gold/30 bg-hcg-gold/10" },
  PLATINUM: { label: "Platinum", className: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10" },
  DIAMOND: { label: "Diamond", className: "text-blue-400 border-blue-400/30 bg-blue-400/10" },
  MASTER: { label: "Master", className: "text-purple-400 border-purple-400/30 bg-purple-400/10" },
};

function TierBadge({ tier }: { tier: string }) {
  const style = TIER_STYLES[tier] ?? TIER_STYLES.BRONZE;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold border",
        style.className
      )}
    >
      <Star className="h-2.5 w-2.5 fill-current" />
      {style.label}
    </span>
  );
}

function UserPanel({ collapsed }: { collapsed: boolean }) {
  const { data: session } = useSession();
  const user = session?.user;

  if (!user) return null;

  const initials = (user.gamerTag ?? user.name ?? "?")
    .slice(0, 2)
    .toUpperCase();

  if (collapsed) {
    return (
      <div className="flex justify-center px-2 py-3 border-b border-hcg-border">
        <div className="h-8 w-8 rounded-full bg-hcg-blue/10 border border-hcg-blue/25 flex items-center justify-center">
          {user.image || user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image ?? user.avatarUrl ?? ""}
              alt={initials}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <span className="text-xs font-bold text-hcg-blue">{initials}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="px-3 py-3 border-b border-hcg-border">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-hcg-blue/10 border border-hcg-blue/25 flex items-center justify-center flex-shrink-0">
          {user.image || user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image ?? user.avatarUrl ?? ""}
              alt={initials}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <span className="text-sm font-bold text-hcg-blue">{initials}</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground truncate">
            {user.name ?? user.gamerTag}
          </p>
          <p className="text-xs text-hcg-muted truncate">@{user.gamerTag}</p>
          <div className="mt-1">
            <TierBadge tier="GOLD" />
          </div>
        </div>
      </div>
    </div>
  );
}

function NavLink({
  item,
  collapsed,
}: {
  item: NavItem;
  collapsed: boolean;
}) {
  const pathname = usePathname();
  const isActive =
    item.href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(item.href);

  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      title={collapsed ? item.label : undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-150",
        collapsed ? "justify-center px-2" : "",
        isActive
          ? "bg-hcg-blue/10 text-hcg-blue font-medium border-l-2 border-hcg-blue pl-[10px]"
          : "text-hcg-muted hover:bg-hcg-card hover:text-foreground border-l-2 border-transparent"
      )}
    >
      <Icon className={cn("flex-shrink-0", isActive ? "h-4 w-4" : "h-4 w-4")} />
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );
}

export function Sidebar() {
  const { data: session } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const isAdmin =
    session?.user?.globalRole === "ADMIN" ||
    session?.user?.globalRole === "SUPER_ADMIN";

  const allSections = isAdmin
    ? [...NAV_SECTIONS, ADMIN_SECTION]
    : NAV_SECTIONS;

  return (
    <aside
      className={cn(
        "hidden lg:flex flex-col h-screen sticky top-0 bg-hcg-card border-r border-hcg-border transition-all duration-200 z-30",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center border-b border-hcg-border flex-shrink-0",
          collapsed ? "justify-center px-2 py-4" : "gap-3 px-4 py-4"
        )}
      >
        <HCGMark size={collapsed ? 32 : 34} variant="blue" className="flex-shrink-0" />
        {!collapsed && (
          <div className="min-w-0">
            <div className="leading-none">
              <span className="font-azonix text-xs text-foreground tracking-widest uppercase">
                High Caliber
              </span>
            </div>
            <div className="mt-0.5">
              <span className="font-azonix text-[9px] text-hcg-blue tracking-[0.3em] uppercase">
                Gaming
              </span>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "ml-auto flex-shrink-0 h-6 w-6 rounded-md flex items-center justify-center text-hcg-muted hover:text-foreground hover:bg-hcg-card-hover transition-colors",
            collapsed ? "hidden" : ""
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Collapse toggle when collapsed */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          className="mx-auto mt-2 h-6 w-6 rounded-md flex items-center justify-center text-hcg-muted hover:text-foreground hover:bg-hcg-card-hover transition-colors"
          aria-label="Expand sidebar"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      )}

      {/* User panel */}
      <UserPanel collapsed={collapsed} />

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
        {allSections.map((section) => (
          <div key={section.title} className="mb-1">
            {!collapsed && (
              <p className="px-3 py-1.5 text-[10px] font-semibold tracking-widest text-hcg-muted uppercase">
                {section.title}
              </p>
            )}
            {collapsed && (
              <div className="my-1 mx-auto h-px w-6 bg-hcg-border" />
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink key={item.href} item={item} collapsed={collapsed} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom: logout */}
      <div className="flex-shrink-0 border-t border-hcg-border p-2">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className={cn(
            "flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm text-hcg-muted hover:bg-hcg-red/10 hover:text-hcg-red transition-colors",
            collapsed ? "justify-center px-2" : ""
          )}
          title={collapsed ? "Log out" : undefined}
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile Sidebar (drawer overlay)                                      */
/* ------------------------------------------------------------------ */

export function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isAdmin =
    session?.user?.globalRole === "ADMIN" ||
    session?.user?.globalRole === "SUPER_ADMIN";

  const allSections = isAdmin
    ? [...NAV_SECTIONS, ADMIN_SECTION]
    : NAV_SECTIONS;

  // Close on route change
  // (pathname dep is intentional — triggers when nav happens)
  // eslint-disable-next-line react-hooks/exhaustive-deps

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside className="fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-hcg-card border-r border-hcg-border lg:hidden">
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-hcg-border">
          <HCGMark size={34} variant="blue" className="flex-shrink-0" />
          <div className="min-w-0">
            <div className="leading-none">
              <span className="font-azonix text-xs text-foreground tracking-widest uppercase">High Caliber</span>
            </div>
            <div className="mt-0.5">
              <span className="font-azonix text-[9px] text-hcg-blue tracking-[0.3em] uppercase">Gaming</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-auto h-7 w-7 rounded-md flex items-center justify-center text-hcg-muted hover:text-foreground hover:bg-hcg-card-hover"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>

        {/* User panel */}
        <UserPanel collapsed={false} />

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
          {allSections.map((section) => (
            <div key={section.title} className="mb-1">
              <p className="px-3 py-1.5 text-[10px] font-semibold tracking-widest text-hcg-muted uppercase">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname.startsWith(item.href);
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-150",
                        isActive
                          ? "bg-hcg-blue/10 text-hcg-blue font-medium border-l-2 border-hcg-blue pl-[10px]"
                          : "text-hcg-muted hover:bg-hcg-card hover:text-foreground border-l-2 border-transparent"
                      )}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="flex-shrink-0 border-t border-hcg-border p-2">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-sm text-hcg-muted hover:bg-hcg-red/10 hover:text-hcg-red transition-colors"
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            <span>Log out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
