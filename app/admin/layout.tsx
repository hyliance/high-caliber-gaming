"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Gamepad2, DollarSign, Megaphone,
  Shield, GraduationCap, ChevronLeft, AlertTriangle
} from "lucide-react";

const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Games", href: "/admin/games", icon: Gamepad2 },
  { label: "Financial", href: "/admin/financial", icon: DollarSign },
  { label: "Announcements", href: "/admin/announcements", icon: Megaphone },
  { label: "Coaching", href: "/admin/coaching", icon: GraduationCap },
  { label: "Moderation", href: "/admin/moderation", icon: Shield },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
      return;
    }
    const role = (session.user as any)?.globalRole;
    if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-hcg-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-hcg-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const role = (session?.user as any)?.globalRole;
  if (!session || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
    return null;
  }

  return (
    <div className="min-h-screen bg-hcg-bg flex">
      {/* Admin sidebar */}
      <aside className="w-56 shrink-0 bg-hcg-card border-r border-hcg-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-hcg-border">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg bg-hcg-gold flex items-center justify-center">
              <Shield size={14} className="text-black" />
            </div>
            <span className="font-display font-bold text-sm">Admin Panel</span>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs text-hcg-muted hover:text-foreground transition-colors"
          >
            <ChevronLeft size={12} /> Back to platform
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-hcg-gold/10 text-hcg-gold border border-hcg-gold/20"
                    : "text-hcg-muted hover:text-foreground hover:bg-hcg-card-hover"
                }`}
              >
                <Icon size={15} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Role badge */}
        <div className="p-3 border-t border-hcg-border">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-hcg-bg">
            <AlertTriangle size={12} className="text-orange-400 shrink-0" />
            <div>
              <p className="text-xs font-medium">{(session?.user as any)?.name ?? "Admin"}</p>
              <p className="text-xs text-hcg-muted">{role}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
