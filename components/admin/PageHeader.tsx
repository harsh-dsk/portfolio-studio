import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    icon?: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
  };
}

/**
 * PageHeader
 *
 * Consistent header for every admin editor page.
 * Shows title + optional description + optional action button.
 */
export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div className="space-y-1">
        <h1
          className="text-xl font-semibold tracking-tight text-foreground"
          style={{ fontSize: "1.25rem", lineHeight: 1.3, letterSpacing: "-0.02em" }}
        >
          {title}
        </h1>
        {description && (
          <p className="text-sm text-fg-muted">{description}</p>
        )}
      </div>

      {action && (
        <button
          onClick={action.onClick}
          disabled={action.disabled}
          className="inline-flex items-center gap-2 h-9 px-4 text-sm font-medium rounded-lg bg-brand text-brand-fg hover:bg-brand-hover transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {action.icon}
          {action.label}
        </button>
      )}
    </div>
  );
}
