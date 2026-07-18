"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

/* ── Human-readable page titles for breadcrumb ── */
const PAGE_TITLES: Record<string, string> = {
  "/admin":               "Dashboard",
  "/admin/profile":       "Profile",
  "/admin/social":        "Social Buttons",
  "/admin/education":     "Education",
  "/admin/skills":        "Skills",
  "/admin/projects":      "Projects",
  "/admin/achievements":  "Achievements",
  "/admin/external-links":"External Links",
  "/admin/resume":        "Resume",
  "/admin/settings":      "Settings",
};

interface Props {
  onMenuClick: () => void;
}

export function AdminTopNav({ onMenuClick }: Props) {
  const pathname = usePathname();
  const currentTitle = PAGE_TITLES[pathname] ?? "Admin";
  const isDashboard = pathname === "/admin";

  return (
    <header
      className="fixed top-0 right-0 left-0 lg:left-60 z-30 h-14 flex items-center justify-between px-4 sm:px-6 shrink-0"
      style={{
        background: "var(--ds-bg)",
        borderBottom: "1px solid var(--ds-border)",
      }}
    >
      {/* Left: mobile menu + breadcrumb */}
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 -ml-1 text-fg-muted hover:text-foreground rounded-md transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu size={18} strokeWidth={1.75} />
        </button>

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-sm">
          {!isDashboard && (
            <>
              <Link
                href="/admin"
                className="text-fg-subtle hover:text-fg-muted transition-colors"
              >
                Dashboard
              </Link>
              <ChevronRight size={13} className="text-fg-subtle" aria-hidden="true" />
            </>
          )}
          <span className="font-medium text-foreground">{currentTitle}</span>
        </nav>

        {/* Mobile: just page title */}
        <span className="sm:hidden text-sm font-medium text-foreground">{currentTitle}</span>
      </div>

      {/* Right: theme toggle */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
