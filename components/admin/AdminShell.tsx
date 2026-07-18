"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopNav } from "./AdminTopNav";

interface Props {
  children: ReactNode;
}

/**
 * AdminShell
 *
 * Client component that manages sidebar open/close state and
 * composes the full admin layout:
 *
 *   Desktop: [Fixed sidebar 240px] + [TopNav fixed left-60] + [Content area]
 *   Mobile:  [Hamburger → slide-over sidebar] + [Full-width TopNav] + [Content]
 */
export function AdminShell({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex-1 flex bg-background">
      {/* ── Sidebar ── */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ── Mobile backdrop ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: "oklch(0 0 0 / 55%)" }}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Main content area ── */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-60">
        {/* Top nav */}
        <AdminTopNav onMenuClick={() => setSidebarOpen((v) => !v)} />

        {/* Page content — padded below fixed TopNav */}
        <main className="flex-1 pt-14 overflow-auto">
          <div className="p-5 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
