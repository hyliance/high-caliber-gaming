import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(cents / 100);
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function timeAgo(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  return past.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function tierColor(tier: string): string {
  const map: Record<string, string> = {
    BRONZE: "text-amber-700",
    SILVER: "text-gray-300",
    GOLD: "text-yellow-400",
    PLATINUM: "text-cyan-300",
    DIAMOND: "text-blue-400",
    MASTER: "text-purple-400",
  };
  return map[tier] ?? "text-gray-400";
}

export function tierBgColor(tier: string): string {
  const map: Record<string, string> = {
    BRONZE: "bg-amber-900/20 border-amber-700/30",
    SILVER: "bg-gray-500/10 border-gray-400/30",
    GOLD: "bg-yellow-900/20 border-yellow-500/30",
    PLATINUM: "bg-cyan-900/20 border-cyan-400/30",
    DIAMOND: "bg-blue-900/20 border-blue-500/30",
    MASTER: "bg-purple-900/20 border-purple-500/30",
  };
  return map[tier] ?? "bg-gray-800/20 border-gray-600/30";
}

export function formatWinRate(wins: number, losses: number): string {
  const total = wins + losses;
  if (total === 0) return "0%";
  return `${Math.round((wins / total) * 100)}%`;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
