import type { Achievement } from "@/lib/data/resume";

interface Props {
  items: Achievement[];
}

/** Achievements — numbered list of accomplishments with optional dates. */
export function Achievements({ items }: Props) {
  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div
          key={i}
          className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-6"
        >
          {/* Content */}
          <div className="flex items-start gap-3 flex-1">
            {/* Index number */}
            <span
              className="text-xs font-mono tabular-nums text-fg-subtle mt-0.5 shrink-0 w-5 text-right"
              aria-hidden="true"
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            <div className="space-y-0.5">
              <p className="text-sm font-medium text-foreground leading-snug">{item.title}</p>
              <p className="text-sm text-fg-muted leading-relaxed">{item.description}</p>
            </div>
          </div>

          {/* Date */}
          {item.date && (
            <span className="text-xs text-fg-subtle tabular-nums shrink-0 pl-8 sm:pl-0">
              {item.date}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
