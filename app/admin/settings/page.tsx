"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function SettingsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="Settings"
        description="Configure your portfolio preferences and display options."
      />

      {/* Appearance */}
      <div className="rounded-xl border border-border bg-surface-1 p-5 space-y-5">
        <p className="text-sm font-semibold text-foreground">Appearance</p>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-foreground">Theme</p>
            <p className="text-xs text-fg-muted mt-0.5">Toggle between dark and light mode.</p>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Backend Status */}
      <div className="rounded-xl border border-border bg-surface-1 p-5 space-y-3">
        <p className="text-sm font-semibold text-foreground">Backend & Storage</p>
        <p className="text-xs text-fg-muted">
          Your portfolio CMS is connected to Supabase. Profile edits, project media, and settings are saved to your cloud PostgreSQL database automatically.
        </p>
      </div>
    </div>
  );
}
