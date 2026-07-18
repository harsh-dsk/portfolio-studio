"use client";

import { ExternalLink, GitBranch } from "lucide-react";
import type { ResumeProject } from "@/lib/data/resume";

/* ── Mini placeholder — simulates a real UI screenshot ── */
function ProjectPlaceholder({ project }: { project: ResumeProject }) {
  const { from, to, accent } = project.placeholder;
  const accentMid = accent.replace(")", " / 20%)");
  const accentBorder = accent.replace(")", " / 30%)");

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ background: `linear-gradient(145deg, ${from} 0%, ${to} 100%)` }}
      aria-hidden="true"
    >
      {/* Browser chrome */}
      <div
        className="absolute top-0 left-0 right-0 h-8 flex items-center px-3 gap-1.5"
        style={{ background: "oklch(0 0 0 / 18%)", borderBottom: "1px solid oklch(1 0 0 / 6%)" }}
      >
        <div className="w-2 h-2 rounded-full" style={{ background: "oklch(0.70 0.18 25 / 70%)" }} />
        <div className="w-2 h-2 rounded-full" style={{ background: "oklch(0.76 0.14 65 / 70%)" }} />
        <div className="w-2 h-2 rounded-full" style={{ background: "oklch(0.72 0.17 155 / 70%)" }} />
        <div className="ml-3 h-3.5 w-24 rounded-full" style={{ background: "oklch(1 0 0 / 8%)" }} />
      </div>

      {/* App layout */}
      <div className="absolute top-8 left-0 right-0 bottom-0 flex">
        {/* Sidebar */}
        <div
          className="w-10 shrink-0 flex flex-col items-center pt-3 gap-2.5"
          style={{ background: "oklch(0 0 0 / 14%)", borderRight: "1px solid oklch(1 0 0 / 5%)" }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-md"
              style={{
                background: i === 0 ? accentMid : "oklch(1 0 0 / 6%)",
                border: i === 0 ? `1px solid ${accentBorder}` : "none",
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-3 space-y-2 overflow-hidden">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-lg p-2"
                style={{ background: "oklch(1 0 0 / 5%)", border: "1px solid oklch(1 0 0 / 5%)" }}
              >
                <div className="h-1.5 w-8 rounded-full mb-1.5" style={{ background: "oklch(1 0 0 / 10%)" }} />
                <div className="h-3 w-10 rounded-full" style={{ background: i === 0 ? accentMid : "oklch(1 0 0 / 12%)" }} />
              </div>
            ))}
          </div>

          {/* Rows */}
          <div className="space-y-1.5">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-6 rounded-md flex items-center gap-2 px-2"
                style={{ background: "oklch(1 0 0 / 4%)", border: "1px solid oklch(1 0 0 / 4%)" }}
              >
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: i === 0 ? accent : "oklch(1 0 0 / 12%)" }} />
                <div className="h-1.5 rounded-full" style={{ width: `${50 + i * 10}%`, background: "oklch(1 0 0 / 10%)" }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Project card ── */
function ProjectCard({ project }: { project: ResumeProject }) {
  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-surface-1 transition-all duration-200 hover:-translate-y-0.5 hover:border-border-hover hover:shadow-[0_12px_32px_oklch(0_0_0_/_35%)]">
      {/* Screenshot placeholder */}
      <div className="aspect-video overflow-hidden relative">
        <ProjectPlaceholder project={project} />
      </div>

      {/* Card body */}
      <div className="p-5 space-y-3">
        {/* Title */}
        <h3 className="text-base font-semibold tracking-tight text-foreground leading-snug">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-fg-muted leading-relaxed line-clamp-2">
          {project.description}
        </p>

        {/* Tech stack chips */}
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="inline-flex px-2 py-1 text-[11px] rounded-md border border-border text-fg-subtle bg-surface-2"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 pt-1">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-lg bg-brand text-brand-fg hover:bg-brand-hover transition-colors duration-150"
            >
              <ExternalLink size={11} strokeWidth={2} />
              Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-lg border border-border text-fg-muted bg-surface-2 hover:text-foreground hover:border-border-hover transition-all duration-150"
            >
              <GitBranch size={11} strokeWidth={2} />
              GitHub
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

interface Props {
  projects: ResumeProject[];
}

/**
 * ResumeProjects
 *
 * Responsive grid: 1 column mobile → 2 columns sm+ → 3 columns lg+.
 * Each card has a screenshot placeholder, description, tech chips, and action buttons.
 * Modals will be added in a later iteration.
 */
export function ResumeProjects({ projects }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
