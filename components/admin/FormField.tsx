import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  description?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * FormField
 *
 * Consistent label + optional description + input wrapper for all admin forms.
 * The child should be an input, textarea, or select.
 */
export function FormField({ label, description, required, className, children }: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="block text-sm font-medium text-foreground">
        {label}
        {required && (
          <span className="ml-1 text-[oklch(0.65_0.22_27)] select-none" aria-label="required">
            *
          </span>
        )}
      </label>
      {description && (
        <p className="text-xs text-fg-subtle leading-relaxed">{description}</p>
      )}
      {children}
    </div>
  );
}
