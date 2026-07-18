import type { Education } from "@/lib/data/resume";

interface Props {
  items: Education[];
}

/** Education — one entry per degree, with coursework chips. */
export function EducationSection({ items }: Props) {
  return (
    <div className="space-y-6">
      {items.map((edu, i) => (
        <div key={i} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4">
          {/* Left: degree details */}
          <div className="flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span className="text-sm font-medium text-foreground">
                {edu.degree}
              </span>
              <span className="text-fg-subtle text-xs">·</span>
              <span className="text-sm text-fg-muted">{edu.field}</span>
            </div>

            <p className="text-sm text-fg-muted">{edu.institution}</p>

            {edu.gpa && (
              <p className="text-xs text-fg-subtle">GPA: {edu.gpa}</p>
            )}

            {edu.coursework && edu.coursework.length > 0 && (
              <div className="pt-1.5 flex flex-wrap gap-1.5">
                {edu.coursework.map((c) => (
                  <span
                    key={c}
                    className="inline-flex px-2.5 py-1 text-[11px] rounded-md border border-border text-fg-subtle bg-surface-1"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right: period + location */}
          <div className="flex flex-col items-start sm:items-end gap-0.5 shrink-0">
            <span className="text-xs font-medium text-fg-muted tabular-nums">{edu.period}</span>
            <span className="text-xs text-fg-subtle">{edu.location}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
