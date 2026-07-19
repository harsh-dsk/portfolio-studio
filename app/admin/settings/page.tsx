"use client";

import { useState } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { FormField } from "@/components/admin/FormField";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { clearPortfolioData } from "@/lib/storage";

export default function SettingsPage() {
  const [confirming, setConfirming] = useState(false);

  const handleReset = () => {
    clearPortfolioData();
    window.location.href = "/admin";
  };

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

      {/* Data export */}
      <div className="rounded-xl border border-border bg-surface-1 p-5 space-y-4">
        <p className="text-sm font-semibold text-foreground">Data</p>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-foreground">Export Portfolio Data</p>
            <p className="text-xs text-fg-muted mt-0.5">Download your current portfolio data as a JSON file for backup.</p>
          </div>
          <button
            onClick={() => {
              const raw = localStorage.getItem("portfolio-cms-v1");
              if (!raw) return;
              const blob = new Blob([raw], { type: "application/json" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "portfolio-data.json";
              a.click();
              URL.revokeObjectURL(url);
            }}
            className="h-9 px-4 text-sm font-medium rounded-lg border border-border text-fg-muted hover:text-foreground hover:bg-surface-2 transition-all shrink-0"
          >
            Export JSON
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div
        className="rounded-xl border p-5 space-y-4"
        style={{ borderColor: "oklch(0.65 0.22 27 / 25%)", background: "oklch(0.65 0.22 27 / 4%)" }}
      >
        <p className="text-sm font-semibold" style={{ color: "oklch(0.65 0.22 27)" }}>Danger Zone</p>

        {!confirming ? (
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-foreground">Reset All Portfolio Data</p>
              <p className="text-xs text-fg-muted mt-0.5">
                Clears all saved data and resets to the default mock content. Cannot be undone.
              </p>
            </div>
            <button
              onClick={() => setConfirming(true)}
              className="h-9 px-4 text-sm font-medium rounded-lg border shrink-0 transition-all"
              style={{ borderColor: "oklch(0.65 0.22 27 / 35%)", color: "oklch(0.65 0.22 27)" }}
            >
              Reset Data
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">
              Are you sure? This will erase all your edits and reload the page.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="h-9 px-4 text-sm font-medium rounded-lg text-white"
                style={{ background: "oklch(0.65 0.22 27)" }}
              >
                Yes, reset everything
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="h-9 px-4 text-sm font-medium rounded-lg border border-border text-fg-muted hover:text-foreground hover:bg-surface-2 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
