"use client";

import { PageHeader } from "@/components/admin/PageHeader";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { AccentColorPicker } from "@/components/ui/AccentColorPicker";
import { usePortfolio } from "@/lib/context/PortfolioContext";
import type { AccentColor } from "@/lib/types";

export default function SettingsPage() {
  const { data, updateResumeSettings } = usePortfolio();
  const currentAccent = (data.resumeSettings?.accentColor as AccentColor) || "blue";

  const handleAccentChange = (newAccent: AccentColor) => {
    updateResumeSettings({ accentColor: newAccent });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="Settings"
        description="Configure your portfolio theme, accent color, and preferences."
      />

      {/* Appearance */}
      <div className="rounded-xl border border-border bg-surface-1 p-6 space-y-6">
        <p className="text-sm font-semibold text-foreground border-b border-border pb-3">
          Appearance & Theme
        </p>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-foreground">Color Mode</p>
            <p className="text-xs text-fg-muted mt-0.5">Toggle between dark mode and light mode.</p>
          </div>
          <ThemeToggle />
        </div>

        <div className="h-px bg-border" />

        {/* Accent Color Selector */}
        <AccentColorPicker
          value={currentAccent}
          onChange={handleAccentChange}
        />
      </div>

      {/* Backend Status */}
      <div className="rounded-xl border border-border bg-surface-1 p-6 space-y-3">
        <p className="text-sm font-semibold text-foreground">Backend & Storage</p>
        <p className="text-xs text-fg-muted leading-relaxed">
          Your portfolio CMS is connected to Supabase. Profile edits, project media, theme preferences, and settings are saved to your cloud PostgreSQL database automatically.
        </p>
      </div>
    </div>
  );
}
