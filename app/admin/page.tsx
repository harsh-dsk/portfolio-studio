import { FolderOpen, Zap, Trophy, ExternalLink } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { adminStats, resumeData } from "@/lib/data/mock-admin";

export const metadata = { title: "Dashboard" };

const STAT_CARDS = [
  {
    title: "Projects",
    value: adminStats.projects,
    description: "Featured & in-progress projects",
    icon: <FolderOpen size={18} strokeWidth={1.75} />,
    accentColor: "oklch(0.63 0.19 251)",
  },
  {
    title: "Skills",
    value: adminStats.skills,
    description: "Across all tech categories",
    icon: <Zap size={18} strokeWidth={1.75} />,
    accentColor: "oklch(0.72 0.17 155)",
  },
  {
    title: "Achievements",
    value: adminStats.achievements,
    description: "Awards, hackathons, certifications",
    icon: <Trophy size={18} strokeWidth={1.75} />,
    accentColor: "oklch(0.76 0.14 65)",
  },
  {
    title: "External Links",
    value: adminStats.externalLinks,
    description: "Blog, portfolio, articles",
    icon: <ExternalLink size={18} strokeWidth={1.75} />,
    accentColor: "oklch(0.68 0.20 308)",
  },
] as const;

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8 max-w-5xl">
      {/* Welcome */}
      <div>
        <h1
          className="text-xl font-semibold tracking-tight text-foreground"
          style={{ letterSpacing: "-0.02em" }}
        >
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-fg-muted">
          Manage your portfolio content. All data flows to the public portfolio.
        </p>
      </div>

      {/* Stat cards */}
      <section>
        <p className="text-xs font-medium uppercase tracking-[0.1em] text-fg-subtle mb-3">
          Overview
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
        </div>
      </section>

      {/* Quick navigation */}
      <section>
        <p className="text-xs font-medium uppercase tracking-[0.1em] text-fg-subtle mb-3">
          Quick Access
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: "Edit Profile",    href: "/admin/profile",      description: "Name, title, contact, objective" },
            { label: "Manage Projects", href: "/admin/projects",     description: "Add, edit, and showcase projects" },
            { label: "Update Skills",   href: "/admin/skills",       description: "Manage skill categories and chips" },
            { label: "Social Buttons",  href: "/admin/social",       description: "GitHub, LinkedIn, LeetCode links" },
            { label: "Achievements",    href: "/admin/achievements",  description: "Awards, hackathons, certifications" },
            { label: "Resume Builder",  href: "/admin/resume",       description: "Preview and export your resume" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex flex-col gap-1 p-4 rounded-xl border border-border bg-surface-1 hover:border-border-hover hover:bg-surface-2 transition-all duration-150 group"
            >
              <span className="text-sm font-medium text-foreground group-hover:text-brand transition-colors duration-150">
                {item.label}
              </span>
              <span className="text-xs text-fg-subtle">{item.description}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Status banner */}
      <div
        className="flex items-start gap-3 px-4 py-3.5 rounded-xl border text-sm"
        style={{
          background: "oklch(0.63 0.19 251 / 7%)",
          borderColor: "oklch(0.63 0.19 251 / 20%)",
        }}
      >
        <div
          className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 animate-pulse"
          style={{ background: "oklch(0.63 0.19 251)" }}
        />
        <div>
          <p className="font-medium text-foreground">Frontend-only mode</p>
          <p className="text-fg-muted text-xs mt-0.5">
            All changes are in-memory only. Supabase connection and authentication will be added in the next phase.
          </p>
        </div>
      </div>
    </div>
  );
}
