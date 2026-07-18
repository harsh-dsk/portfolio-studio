"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { FormField } from "@/components/admin/FormField";
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
            <p className="text-xs text-fg-muted mt-0.5">Toggle between dark and light mode. Preference is saved to localStorage.</p>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Portfolio info */}
      <div className="rounded-xl border border-border bg-surface-1 p-5 space-y-5">
        <p className="text-sm font-semibold text-foreground">Portfolio Info</p>
        <div className="space-y-4">
          <FormField label="Portfolio Title" description="Appears in the browser tab and SEO metadata.">
            <input className="admin-input" defaultValue="Harshdeep Singh — Full Stack Developer" />
          </FormField>
          <FormField label="Portfolio URL" description="Your live portfolio URL (once deployed).">
            <input className="admin-input" defaultValue="https://harshdeep.dev" placeholder="https://yoursite.com" />
          </FormField>
          <FormField label="Meta Description" description="Shown in search engine results.">
            <textarea className="admin-textarea" rows={2} defaultValue="Full Stack Developer specializing in React, Next.js, and TypeScript." />
          </FormField>
        </div>
        <div className="flex items-center gap-3 pt-1">
          <button className="h-9 px-5 text-sm font-medium rounded-lg bg-brand text-brand-fg hover:bg-brand-hover transition-colors duration-150">
            Save Settings
          </button>
          <p className="text-xs text-fg-subtle">Saved to memory only. Database connection required for persistence.</p>
        </div>
      </div>

      {/* Danger zone */}
      <div
        className="rounded-xl border p-5 space-y-4"
        style={{ borderColor: "oklch(0.65 0.22 27 / 25%)", background: "oklch(0.65 0.22 27 / 4%)" }}
      >
        <p className="text-sm font-semibold" style={{ color: "oklch(0.65 0.22 27)" }}>Danger Zone</p>
        <p className="text-xs text-fg-muted">
          These actions will be available once the backend is connected. Proceed with caution.
        </p>
        <button
          disabled
          className="h-9 px-4 text-sm font-medium rounded-lg border text-fg-subtle opacity-50 cursor-not-allowed"
          style={{ borderColor: "oklch(0.65 0.22 27 / 25%)" }}
        >
          Reset All Portfolio Data
        </button>
      </div>
    </div>
  );
}
