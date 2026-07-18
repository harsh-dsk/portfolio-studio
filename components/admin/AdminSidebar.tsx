"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, User, Share2, BookOpen, Zap,
  FolderOpen, Trophy, ExternalLink, FileText, Settings, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Nav item definitions ── */
const NAV_ITEMS = [
  { label: "Dashboard",      href: "/admin",               Icon: LayoutDashboard },
  { label: "Profile",        href: "/admin/profile",       Icon: User },
  { label: "Social Buttons", href: "/admin/social",        Icon: Share2 },
  { label: "Education",      href: "/admin/education",     Icon: BookOpen },
  { label: "Skills",         href: "/admin/skills",        Icon: Zap },
  { label: "Projects",       href: "/admin/projects",      Icon: FolderOpen },
  { label: "Achievements",   href: "/admin/achievements",  Icon: Trophy },
  { label: "External Links", href: "/admin/external-links", Icon: ExternalLink },
  { label: "Resume",         href: "/admin/resume",        Icon: FileText },
] as const;

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ isOpen, onClose }: Props) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <>
      {/* ── Sidebar panel ── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-60 flex-col",
          "transition-transform duration-200",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
        )}
        style={{
          background: "var(--ds-surface-0)",
          borderRight: "1px solid var(--ds-border)",
        }}
        aria-label="Admin navigation"
      >
        {/* Brand */}
        <div
          className="flex h-14 items-center justify-between px-4 shrink-0"
          style={{ borderBottom: "1px solid var(--ds-border)" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold text-brand-fg shrink-0"
              style={{ background: "var(--ds-accent)" }}
            >
              P
            </div>
            <span className="text-sm font-medium tracking-tight text-foreground">Portfolio CMS</span>
          </div>

          {/* Close — mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-fg-subtle hover:text-foreground transition-colors"
            aria-label="Close sidebar"
          >
            <X size={16} strokeWidth={1.75} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2" aria-label="Admin sections">
          <ul className="space-y-0.5" role="list">
            {NAV_ITEMS.map(({ label, href, Icon }) => {
              const active = isActive(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-2.5 h-9 px-3 rounded-lg text-sm font-medium transition-all duration-150 relative",
                      active
                        ? "text-brand bg-[oklch(0.63_0.19_251_/_10%)]"
                        : "text-fg-muted hover:text-foreground hover:bg-surface-2",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {/* Active indicator */}
                    {active && (
                      <span
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                        style={{ background: "var(--ds-accent)" }}
                        aria-hidden="true"
                      />
                    )}
                    <Icon size={15} strokeWidth={active ? 2 : 1.75} aria-hidden="true" />
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Settings at bottom */}
        <div className="px-2 pb-3 shrink-0" style={{ borderTop: "1px solid var(--ds-border)" }}>
          <div className="pt-3">
            <Link
              href="/admin/settings"
              onClick={onClose}
              className={cn(
                "flex items-center gap-2.5 h-9 px-3 rounded-lg text-sm font-medium transition-all duration-150",
                pathname === "/admin/settings"
                  ? "text-brand bg-[oklch(0.63_0.19_251_/_10%)]"
                  : "text-fg-muted hover:text-foreground hover:bg-surface-2",
              )}
            >
              <Settings size={15} strokeWidth={1.75} aria-hidden="true" />
              Settings
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
