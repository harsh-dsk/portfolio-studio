import { FileText, Download, Cpu } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";

export default function ResumePage() {
  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader
        title="Resume"
        description="Preview, generate, and export your resume as a PDF."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ── Preview panel ── */}
        <div
          className="lg:col-span-2 rounded-xl border border-border bg-surface-1 flex flex-col items-center justify-center gap-4 py-20 px-6"
        >
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center"
            style={{ background: "oklch(0.63 0.19 251 / 10%)" }}
          >
            <FileText size={24} strokeWidth={1.5} className="text-brand" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-sm font-medium text-foreground">Resume Preview</p>
            <p className="text-xs text-fg-subtle max-w-xs">
              PDF preview will be available once a resume template is selected and the generation engine is connected.
            </p>
          </div>
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{
              background: "oklch(0.63 0.19 251 / 8%)",
              border: "1px solid oklch(0.63 0.19 251 / 20%)",
              color: "oklch(0.63 0.19 251)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "currentColor" }} />
            Template selection coming soon
          </div>
        </div>

        {/* ── Actions panel ── */}
        <div className="space-y-4">
          {/* Generate */}
          <div className="rounded-xl border border-border bg-surface-1 p-5 space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">Generate Resume</p>
              <p className="text-xs text-fg-muted">
                Build a PDF from your portfolio data using a pre-designed template.
              </p>
            </div>
            <button
              disabled
              className="w-full h-9 flex items-center justify-center gap-2 text-sm font-medium rounded-lg bg-brand text-brand-fg opacity-50 cursor-not-allowed"
            >
              <Cpu size={14} strokeWidth={1.75} />
              Generate PDF
            </button>
            <p className="text-[11px] text-fg-subtle text-center">
              PDF generation not yet implemented.
            </p>
          </div>

          {/* Download */}
          <div className="rounded-xl border border-border bg-surface-1 p-5 space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">Download Resume</p>
              <p className="text-xs text-fg-muted">
                Download the last generated PDF resume.
              </p>
            </div>
            <button
              disabled
              className="w-full h-9 flex items-center justify-center gap-2 text-sm font-medium rounded-lg border border-border text-fg-muted bg-surface-2 opacity-50 cursor-not-allowed"
            >
              <Download size={14} strokeWidth={1.75} />
              Download PDF
            </button>
            <p className="text-[11px] text-fg-subtle text-center">
              No generated resume available.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
