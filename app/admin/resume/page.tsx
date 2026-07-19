"use client";

import { useState } from "react";
import { AlignLeft, Columns, PanelLeft, Download, Cpu, CheckCircle } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { usePortfolio } from "@/lib/context/PortfolioContext";

/* ── Resume template definitions ── */
const TEMPLATES = [
  {
    id: "modern",
    name: "Modern",
    description: "Sidebar layout with accent colour. Great for tech roles.",
    icon: PanelLeft,
    preview: {
      sidebar: true,
      accent: "oklch(0.63 0.19 251)",
    },
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional two-column layout. Universally accepted.",
    icon: Columns,
    preview: {
      sidebar: false,
      accent: "oklch(0.70 0.15 200)",
    },
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean single column. Let your content do the talking.",
    icon: AlignLeft,
    preview: {
      sidebar: false,
      accent: "oklch(0.72 0.17 155)",
    },
  },
] as const;

/* ── Micro resume preview ── */
function TemplateMiniPreview({
  template,
}: {
  template: (typeof TEMPLATES)[number];
}) {
  const { accent, sidebar } = template.preview;
  return (
    <div
      className="w-full h-24 rounded-lg overflow-hidden border border-border"
      style={{ background: "var(--ds-bg)" }}
    >
      <div className="flex h-full">
        {/* Sidebar column */}
        {sidebar && (
          <div
            className="w-10 h-full flex flex-col gap-1.5 px-1.5 py-2"
            style={{ background: accent.replace(")", " / 15%)") }}
          >
            <div className="w-7 h-7 rounded-full mx-auto" style={{ background: accent.replace(")", " / 40%)") }} />
            {[60, 70, 50].map((w, i) => (
              <div key={i} className="h-1 rounded-full" style={{ width: `${w}%`, background: accent.replace(")", " / 30%)") }} />
            ))}
          </div>
        )}
        {/* Main content */}
        <div className="flex-1 p-2 flex flex-col gap-1.5">
          {!sidebar && <div className="h-2 w-14 rounded-full" style={{ background: accent.replace(")", " / 60%)") }} />}
          {[90, 70, 80, 55, 65].map((w, i) => (
            <div key={i} className="h-1 rounded-full" style={{ width: `${w}%`, background: "var(--ds-surface-2)" }} />
          ))}
          <div className="h-px my-0.5" style={{ background: "var(--ds-border)" }} />
          {[75, 60].map((w, i) => (
            <div key={i} className="h-1 rounded-full" style={{ width: `${w}%`, background: "var(--ds-surface-2)" }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ResumePage() {
  const { data } = usePortfolio();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const name = data.profile.name;
  const projectCount = data.projects.length;
  const skillCount = data.skills.reduce((n, c) => n + c.skills.length, 0);

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader
        title="Resume"
        description="Select a template, preview your resume, and export as PDF."
      />

      {/* ── Data summary ── */}
      <div
        className="flex flex-wrap gap-6 px-5 py-4 rounded-xl border text-sm"
        style={{ borderColor: "var(--ds-border)", background: "var(--ds-surface-1)" }}
      >
        <div>
          <p className="text-xs text-fg-subtle uppercase tracking-[0.08em]">Projects</p>
          <p className="text-lg font-semibold text-foreground tabular-nums">{projectCount}</p>
        </div>
        <div>
          <p className="text-xs text-fg-subtle uppercase tracking-[0.08em]">Skills</p>
          <p className="text-lg font-semibold text-foreground tabular-nums">{skillCount}</p>
        </div>
        <div>
          <p className="text-xs text-fg-subtle uppercase tracking-[0.08em]">Education</p>
          <p className="text-lg font-semibold text-foreground tabular-nums">{data.education.length}</p>
        </div>
        <div>
          <p className="text-xs text-fg-subtle uppercase tracking-[0.08em]">Achievements</p>
          <p className="text-lg font-semibold text-foreground tabular-nums">{data.achievements.length}</p>
        </div>
        <div className="ml-auto self-center">
          <p className="text-xs text-fg-subtle">Resume will be generated for:</p>
          <p className="text-sm font-medium text-foreground">{name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        {/* ── Template selection ── */}
        <div className="space-y-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.1em] text-fg-subtle mb-3">
              1. Select Template
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {TEMPLATES.map((t) => {
                const selected = selectedTemplate === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTemplate(t.id)}
                    className="rounded-xl border p-3 text-left transition-all duration-150 space-y-3"
                    style={{
                      borderColor: selected ? t.preview.accent : "var(--ds-border)",
                      background: selected ? t.preview.accent.replace(")", " / 8%)") : "var(--ds-surface-1)",
                      boxShadow: selected ? `0 0 0 1px ${t.preview.accent.replace(")", " / 30%)")}` : "none",
                    }}
                  >
                    <TemplateMiniPreview template={t} />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-semibold text-foreground">{t.name}</p>
                        {selected && <CheckCircle size={13} strokeWidth={2} style={{ color: t.preview.accent }} />}
                      </div>
                      <p className="text-[11px] text-fg-subtle leading-relaxed mt-0.5">{t.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Preview panel ── */}
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.1em] text-fg-subtle mb-3">
              2. Preview
            </p>
            <div
              className="rounded-xl border border-border bg-surface-1 flex flex-col items-center justify-center gap-4 py-16 px-6"
            >
              {selectedTemplate ? (
                <>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: "oklch(0.63 0.19 251 / 10%)" }}
                  >
                    <Cpu size={22} strokeWidth={1.5} className="text-brand" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">
                      {TEMPLATES.find((t) => t.id === selectedTemplate)?.name} template selected
                    </p>
                    <p className="text-xs text-fg-subtle mt-1 max-w-xs">
                      PDF rendering engine is not yet connected. Once the backend is wired up, a live preview will appear here.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "var(--ds-surface-2)" }}>
                    <AlignLeft size={22} strokeWidth={1.5} className="text-fg-muted" />
                  </div>
                  <p className="text-sm text-fg-subtle text-center">Select a template above to enable preview.</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Actions sidebar ── */}
        <div className="space-y-4">
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-fg-subtle">3. Export</p>

          {/* Generate */}
          <div className="rounded-xl border border-border bg-surface-1 p-5 space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">Generate PDF</p>
              <p className="text-xs text-fg-muted">Compile your portfolio data into a formatted PDF resume.</p>
            </div>
            <button
              disabled={!selectedTemplate}
              className="w-full h-9 flex items-center justify-center gap-2 text-sm font-medium rounded-lg bg-brand text-brand-fg transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-hover"
            >
              <Cpu size={14} strokeWidth={1.75} />
              {selectedTemplate ? "Generate Resume" : "Select a template first"}
            </button>
            <p className="text-[11px] text-fg-subtle text-center">PDF engine not yet connected.</p>
          </div>

          {/* Download */}
          <div className="rounded-xl border border-border bg-surface-1 p-5 space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">Download</p>
              <p className="text-xs text-fg-muted">Download the last generated resume as a PDF file.</p>
            </div>
            <button
              disabled
              className="w-full h-9 flex items-center justify-center gap-2 text-sm font-medium rounded-lg border border-border text-fg-muted bg-surface-2 opacity-50 cursor-not-allowed"
            >
              <Download size={14} strokeWidth={1.75} />
              Download PDF
            </button>
            <p className="text-[11px] text-fg-subtle text-center">No generated file yet.</p>
          </div>

          {/* Info */}
          <div
            className="rounded-xl p-4 text-xs space-y-2"
            style={{ background: "oklch(0.63 0.19 251 / 6%)", border: "1px solid oklch(0.63 0.19 251 / 15%)" }}
          >
            <p className="font-medium text-foreground">Always up-to-date</p>
            <p className="text-fg-muted leading-relaxed">
              When generation is enabled, it pulls the latest data from all sections — profile, skills, projects, and achievements — at the moment you click Generate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
