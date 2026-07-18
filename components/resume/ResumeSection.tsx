import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  title: string;
  id?: string;
  children: ReactNode;
  className?: string;
}

/**
 * ResumeSection
 *
 * Consistent resume-style section wrapper:
 *   - UPPERCASE title with tracking
 *   - Full-width horizontal rule
 *   - Content below
 *
 * Pass an `id` for in-page anchor navigation.
 */
export function ResumeSection({ title, id, children, className }: Props) {
  return (
    <section id={id} className={cn("space-y-4", className)}>
      {/* Section header */}
      <div className="flex items-center gap-4">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.12em] text-fg-subtle shrink-0 leading-none">
          {title}
        </h2>
        <div
          className="flex-1 h-px"
          style={{ background: "var(--ds-border)" }}
          aria-hidden="true"
        />
      </div>

      {/* Content */}
      <div>{children}</div>
    </section>
  );
}
