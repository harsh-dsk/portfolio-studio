import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: ReactNode;
  /** oklch color string — used for icon bg tint */
  accentColor?: string;
}

/**
 * StatCard
 *
 * Dashboard metric card. Shows an icon, a large number, and a label.
 */
export function StatCard({ title, value, description, icon, accentColor }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface-1 p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        {/* Icon */}
        <div
          className="p-2.5 rounded-xl shrink-0"
          style={{
            background: accentColor
              ? accentColor.replace(")", " / 12%)")
              : "oklch(0.63 0.19 251 / 12%)",
          }}
        >
          <div
            style={{
              color: accentColor ?? "oklch(0.63 0.19 251)",
            }}
          >
            {icon}
          </div>
        </div>

        {/* Value */}
        <p
          className="text-3xl font-semibold tracking-tight text-foreground tabular-nums"
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {value}
        </p>
      </div>

      <div>
        <p className="text-xs font-medium uppercase tracking-[0.1em] text-fg-subtle">{title}</p>
        {description && (
          <p className="text-xs text-fg-subtle mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );
}
