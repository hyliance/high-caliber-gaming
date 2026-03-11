"use client";

import { useState } from "react";
import { Sidebar, MobileSidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export function PlatformShell({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen bg-hcg-bg overflow-hidden">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile sidebar drawer */}
      <MobileSidebar
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main content column */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Topbar */}
        <Topbar onMenuClick={() => setMobileMenuOpen(true)} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-screen-2xl mx-auto p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
