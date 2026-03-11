"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  Menu,
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Shield,
  Swords,
  Trophy,
  DollarSign,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/* Route title map                                                       */
/* ------------------------------------------------------------------ */

const ROUTE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/ladders": "Ladders",
  "/tournaments": "Tournaments",
  "/leagues": "Leagues",
  "/matches": "Matches",
  "/wager": "Money Match",
  "/wallet": "Wallet",
  "/feed": "Community Feed",
  "/communities": "Communities",
  "/messages": "Messages",
  "/clans": "Clans",
  "/organizations": "Organizations",
  "/coaching": "Find a Coach",
  "/coaching/apply": "Become a Coach",
  "/profile": "Profile",
  "/settings": "Settings",
  "/admin": "Admin Panel",
};

function getPageTitle(pathname: string): string {
  // Exact match first
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname];

  // Prefix match (longest wins)
  const sorted = Object.keys(ROUTE_TITLES).sort((a, b) => b.length - a.length);
  for (const key of sorted) {
    if (pathname.startsWith(key + "/") || pathname === key) {
      return ROUTE_TITLES[key];
    }
  }
  return "High Caliber Gaming";
}

/* ------------------------------------------------------------------ */
/* Mock notifications                                                    */
/* ------------------------------------------------------------------ */

interface Notification {
  id: string;
  type: "match" | "tournament" | "wager" | "system";
  message: string;
  time: string;
  read: boolean;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "match",
    message: "NightOwl#5521 challenged you to a 1v1 match",
    time: "2m ago",
    read: false,
  },
  {
    id: "2",
    type: "tournament",
    message: "Friday Night Warzone Cup starts in 1 hour",
    time: "58m ago",
    read: false,
  },
  {
    id: "3",
    type: "wager",
    message: "Your $25 wager vs BladeRunner was accepted",
    time: "2h ago",
    read: false,
  },
  {
    id: "4",
    type: "system",
    message: "Your account has been verified",
    time: "1d ago",
    read: true,
  },
];

const NOTIF_ICON: Record<Notification["type"], React.ElementType> = {
  match: Swords,
  tournament: Trophy,
  wager: DollarSign,
  system: Shield,
};

const NOTIF_COLOR: Record<Notification["type"], string> = {
  match: "text-blue-400 bg-blue-400/10",
  tournament: "text-hcg-gold bg-hcg-gold/10",
  wager: "text-green-400 bg-green-400/10",
  system: "text-hcg-muted bg-hcg-border/40",
};

/* ------------------------------------------------------------------ */
/* Notification Panel                                                    */
/* ------------------------------------------------------------------ */

function NotificationPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const unread = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-hcg-border bg-hcg-card shadow-2xl z-50 overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-hcg-border">
        <h3 className="font-display font-semibold text-sm text-foreground">
          Notifications
        </h3>
        {unread > 0 && (
          <span className="hcg-badge-gold text-xs">{unread} new</span>
        )}
      </div>

      <div className="divide-y divide-hcg-border max-h-80 overflow-y-auto">
        {MOCK_NOTIFICATIONS.map((notif) => {
          const Icon = NOTIF_ICON[notif.type];
          return (
            <div
              key={notif.id}
              className={cn(
                "flex items-start gap-3 px-4 py-3 hover:bg-hcg-card-hover transition-colors cursor-pointer",
                !notif.read && "bg-hcg-gold/3"
              )}
            >
              <div
                className={cn(
                  "flex-shrink-0 mt-0.5 h-7 w-7 rounded-full flex items-center justify-center",
                  NOTIF_COLOR[notif.type]
                )}
              >
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-xs leading-snug",
                    notif.read ? "text-hcg-muted" : "text-foreground"
                  )}
                >
                  {notif.message}
                </p>
                <p className="text-[10px] text-hcg-muted mt-0.5">{notif.time}</p>
              </div>
              {!notif.read && (
                <div className="flex-shrink-0 mt-1.5 h-2 w-2 rounded-full bg-hcg-blue" />
              )}
            </div>
          );
        })}
      </div>

      <div className="px-4 py-2.5 border-t border-hcg-border">
        <Link
          href="/notifications"
          onClick={onClose}
          className="block text-center text-xs text-hcg-gold hover:text-hcg-gold-light transition-colors"
        >
          View all notifications
        </Link>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* User Dropdown                                                         */
/* ------------------------------------------------------------------ */

function UserDropdown({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { data: session } = useSession();
  const ref = useRef<HTMLDivElement>(null);
  const user = session?.user;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose]);

  if (!open || !user) return null;

  const initials = (user.gamerTag ?? user.name ?? "?")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-hcg-border bg-hcg-card shadow-2xl z-50 overflow-hidden"
    >
      {/* User info header */}
      <div className="px-4 py-3 border-b border-hcg-border">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-hcg-blue/10 border border-hcg-blue/25 flex items-center justify-center flex-shrink-0">
            {user.image || user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.image ?? user.avatarUrl ?? ""}
                alt={initials}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <span className="text-sm font-bold text-hcg-blue">{initials}</span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {user.name ?? user.gamerTag}
            </p>
            <p className="text-xs text-hcg-muted truncate">@{user.gamerTag}</p>
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div className="py-1">
        <Link
          href="/profile"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2 text-sm text-hcg-muted hover:bg-hcg-card-hover hover:text-foreground transition-colors"
        >
          <User className="h-4 w-4" />
          Profile
        </Link>
        <Link
          href="/settings"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-2 text-sm text-hcg-muted hover:bg-hcg-card-hover hover:text-foreground transition-colors"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>

      <div className="border-t border-hcg-border py-1">
        <button
          onClick={() => {
            onClose();
            signOut({ callbackUrl: "/login" });
          }}
          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-hcg-muted hover:bg-hcg-red/10 hover:text-hcg-red transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Search bar                                                            */
/* ------------------------------------------------------------------ */

function SearchBar() {
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setFocused(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "hidden md:flex items-center gap-2 h-9 px-3 rounded-lg border bg-hcg-card transition-all",
        focused
          ? "border-hcg-blue/40 w-64 ring-2 ring-hcg-blue/20"
          : "border-hcg-border w-48 hover:border-hcg-border/80"
      )}
    >
      <Search className="h-3.5 w-3.5 text-hcg-muted flex-shrink-0" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="Search players, teams..."
        className="flex-1 bg-transparent text-sm text-foreground placeholder:text-hcg-muted focus:outline-none min-w-0"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          className="text-hcg-muted hover:text-foreground transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Topbar                                                                */
/* ------------------------------------------------------------------ */

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [notifOpen, setNotifOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const user = session?.user;
  const pageTitle = getPageTitle(pathname);
  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

  const initials = user
    ? (user.gamerTag ?? user.name ?? "?").slice(0, 2).toUpperCase()
    : "?";

  return (
    <header className="sticky top-0 z-20 h-14 flex items-center gap-3 px-4 bg-hcg-card/80 backdrop-blur-md border-b border-hcg-border">
      {/* Mobile hamburger */}
      <button
        onClick={onMenuClick}
        className="lg:hidden h-8 w-8 rounded-md flex items-center justify-center text-hcg-muted hover:text-foreground hover:bg-hcg-card-hover transition-colors"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Page title */}
      <h1 className="font-display font-semibold text-lg text-foreground tracking-wide leading-none">
        {pageTitle}
      </h1>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search bar (center, hidden on mobile) */}
      <SearchBar />

      {/* Spacer */}
      <div className="flex-1 hidden md:block" />

      {/* Right actions */}
      <div className="flex items-center gap-1">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setDropdownOpen(false);
            }}
            className="relative h-8 w-8 rounded-md flex items-center justify-center text-hcg-muted hover:text-foreground hover:bg-hcg-card-hover transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-4.5 w-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-hcg-blue text-hcg-bg text-[9px] font-bold flex items-center justify-center leading-none">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>
          <NotificationPanel
            open={notifOpen}
            onClose={() => setNotifOpen(false)}
          />
        </div>

        {/* User avatar dropdown */}
        <div className="relative ml-1">
          <button
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2 h-8 pl-1 pr-2 rounded-lg hover:bg-hcg-card-hover transition-colors"
            aria-label="User menu"
          >
            <div className="h-6 w-6 rounded-full bg-hcg-blue/10 border border-hcg-blue/25 flex items-center justify-center flex-shrink-0">
              {user?.image || user?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.image ?? user.avatarUrl ?? ""}
                  alt={initials}
                  className="h-6 w-6 rounded-full object-cover"
                />
              ) : (
                <span className="text-[10px] font-bold text-hcg-gold">
                  {initials}
                </span>
              )}
            </div>
            <span className="hidden sm:block text-xs font-medium text-foreground truncate max-w-24">
              {user?.gamerTag ?? user?.name ?? ""}
            </span>
            <ChevronDown
              className={cn(
                "h-3 w-3 text-hcg-muted transition-transform duration-150",
                dropdownOpen && "rotate-180"
              )}
            />
          </button>
          <UserDropdown
            open={dropdownOpen}
            onClose={() => setDropdownOpen(false)}
          />
        </div>
      </div>
    </header>
  );
}
