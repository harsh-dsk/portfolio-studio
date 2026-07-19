"use client";

import {
  FolderOpen, Zap, Trophy, ExternalLink, CheckCircle,
  Clock, User, Plus, ArrowRight, Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { usePortfolio } from "@/lib/context/PortfolioContext";
import { computeStats } from "@/lib/data/initial-data";
import { StatCard } from "@/components/admin/StatCard";

const AVAILABILITY_LABELS = {
  available:      { label: "Available for work",  color: "oklch(0.72 0.17 155)" },
  "open-to-work": { label: "Open to work",         color: "oklch(0.76 0.14 65)"  },
  employed:       { label: "Currently employed",   color: "oklch(0.63 0.19 251)"  },
  unavailable:    { label: "Not available",         color: "oklch(0.65 0.22 27)"   },
} as const;

const QUICK_ACTIONS = [
  { label: "Edit Profile",     href: "/admin/profile",       icon: User,       description: "Name, title, availability" },
  { label: "Add Project",      href: "/admin/projects",      icon: FolderOpen, description: "Showcase new work" },
  { label: "Update Skills",    href: "/admin/skills",        icon: Zap,        description: "Add or remove skills" },
  { label: "Manage Media",     href: "/admin/media",         icon: ImageIcon,  description: "Upload and organise images" },
  { label: "Add Achievement",  href: "/admin/achievements",  icon: Trophy,     description: "Awards and certifications" },
  { label: "External Links",   href: "/admin/external-links",icon: ExternalLink, description: "Blog, articles, profiles" },
] as const;

/* Profile completion ring */
function CompletionRing({ percent }: { percent: number }) {
  const R = 28;
  const C = 2 * Math.PI * R;
  const dash = (percent / 100) * C;
  const color =
    percent >= 80 ? "oklch(0.72 0.17 155)" :
    percent >= 50 ? "oklch(0.76 0.14 65)"  :
                    "oklch(0.65 0.22 27)";

  return (
    <div className="relative w-16 h-16 shrink-0">
      <svg width="64" height="64" className="rotate-[-90deg]">
        <circle cx="32" cy="32" r={R} fill="none" stroke="var(--ds-surface-2)" strokeWidth="5" />
        <circle
          cx="32" cy="32" r={R} fill="none"
          stroke={color} strokeWidth="5"
          strokeDasharray={`${dash} ${C - dash}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-foreground">
        {percent}%
      </span>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data } = usePortfolio();
  const stats = computeStats(data);
  const avail = AVAILABILITY_LABELS[data.profile.availability];

  const STAT_CARDS = [
    { title: "Projects",       value: stats.projects,     description: "Published projects",          icon: <FolderOpen size={18} strokeWidth={1.75} />, accentColor: "oklch(0.63 0.19 251)" },
    { title: "Skills",         value: stats.skills,       description: "Across all categories",       icon: <Zap size={18} strokeWidth={1.75} />,        accentColor: "oklch(0.72 0.17 155)" },
    { title: "Achievements",   value: stats.achievements, description: "Awards and certifications",   icon: <Trophy size={18} strokeWidth={1.75} />,     accentColor: "oklch(0.76 0.14 65)"  },
    { title: "External Links", value: stats.externalLinks,description: "Blog, articles, profiles",   icon: <ExternalLink size={18} strokeWidth={1.75} />,accentColor: "oklch(0.68 0.20 308)" },
  ];

  return (
    <div className="max-w-5xl space-y-8">

      {/* ── Welcome header ── */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground" style={{ letterSpacing: "-0.02em" }}>
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-fg-muted">
            Welcome back, {data.profile.name.split(" ")[0]}. Here's your portfolio overview.
          </p>
        </div>
        {/* Availability badge */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium self-start"
          style={{ background: `${avail.color.replace(")", " / 10%)")}`, border: `1px solid ${avail.color.replace(")", " / 25%)")}`, color: avail.color }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: avail.color }} />
          {avail.label}
        </div>
      </div>

      {/* ── Stat cards ── */}
      <section>
        <p className="text-xs font-medium uppercase tracking-[0.1em] text-fg-subtle mb-3">Overview</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map((card) => <StatCard key={card.title} {...card} />)}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        {/* ── Quick actions ── */}
        <section>
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-fg-subtle mb-3">Quick Actions</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {QUICK_ACTIONS.map(({ label, href, icon: Icon, description }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 p-4 rounded-xl border border-border bg-surface-1 hover:border-border-hover hover:bg-surface-2 transition-all duration-150 group"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "var(--ds-surface-2)" }}>
                  <Icon size={15} strokeWidth={1.75} className="text-fg-muted group-hover:text-brand transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground group-hover:text-brand transition-colors">{label}</p>
                  <p className="text-xs text-fg-subtle truncate">{description}</p>
                </div>
                <ArrowRight size={13} strokeWidth={1.75} className="text-fg-subtle opacity-0 group-hover:opacity-100 transition-all duration-150 -translate-x-1 group-hover:translate-x-0 shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        {/* ── Right column ── */}
        <div className="space-y-4">
          {/* Profile completion */}
          <section className="rounded-xl border border-border bg-surface-1 p-5">
            <p className="text-xs font-medium uppercase tracking-[0.1em] text-fg-subtle mb-4">Profile Completion</p>
            <div className="flex items-center gap-4">
              <CompletionRing percent={stats.completion} />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium text-foreground">
                  {stats.completion >= 80 ? "Looking great!" : stats.completion >= 50 ? "Almost there" : "Needs attention"}
                </p>
                <p className="text-xs text-fg-muted">
                  {stats.completion < 100
                    ? "Add a profile photo and fill all fields to reach 100%."
                    : "Your profile is complete."}
                </p>
                <Link href="/admin/profile" className="inline-flex items-center gap-1 text-xs text-brand hover:text-brand-hover transition-colors mt-1">
                  <Plus size={11} strokeWidth={2} />
                  Complete profile
                </Link>
              </div>
            </div>
          </section>

          {/* Recent activity (static placeholder) */}
          <section className="rounded-xl border border-border bg-surface-1 p-5">
            <p className="text-xs font-medium uppercase tracking-[0.1em] text-fg-subtle mb-3">Recent Activity</p>
            <ul className="space-y-3">
              {[
                { icon: CheckCircle, text: "Connected to Supabase",          time: "Live",      color: "oklch(0.72 0.17 155)" },
                { icon: Clock,       text: "Last sync: real-time",            time: "Now",       color: "oklch(0.63 0.19 251)" },
                { icon: FolderOpen,  text: `${stats.projects} projects live`, time: "Published", color: "oklch(0.76 0.14 65)"  },
              ].map(({ icon: Icon, text, time, color }) => (
                <li key={text} className="flex items-start gap-3 text-xs">
                  <Icon size={14} strokeWidth={1.75} className="mt-0.5 shrink-0" style={{ color }} />
                  <span className="flex-1 text-fg-muted">{text}</span>
                  <span className="text-fg-subtle shrink-0 tabular-nums">{time}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* Status banner */}
      <div
        className="flex items-start gap-3 px-4 py-3.5 rounded-xl border text-sm"
        style={{ background: "oklch(0.72 0.17 155 / 7%)", borderColor: "oklch(0.72 0.17 155 / 20%)" }}
      >
        <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "oklch(0.72 0.17 155)" }} />
        <div>
          <p className="font-medium text-foreground">Connected to Supabase</p>
          <p className="text-fg-muted text-xs mt-0.5">
            All changes persist to the database and are immediately reflected on the public portfolio.
          </p>
        </div>
      </div>
    </div>
  );
}
