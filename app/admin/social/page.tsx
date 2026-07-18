"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { FormField } from "@/components/admin/FormField";
import type { SocialLink } from "@/lib/data/resume";
import { resumeData } from "@/lib/data/resume";

/* ── Social platform icon SVGs ── */
function PlatformIcon({ platform }: { platform: string }) {
  if (platform === "github")
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    );
  if (platform === "linkedin")
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
    </svg>
  );
}

export default function SocialPage() {
  const [links, setLinks] = useState<SocialLink[]>(resumeData.socialLinks as SocialLink[]);
  const [showAdd, setShowAdd] = useState(false);
  const [newLink, setNewLink] = useState({ platform: "github" as const, label: "", url: "" });

  const deleteLink = (platform: string) => {
    setLinks((prev) => prev.filter((l) => l.platform !== platform));
  };

  const addLink = () => {
    if (!newLink.label.trim() || !newLink.url.trim()) return;
    setLinks((prev) => [...prev, { ...newLink }]);
    setNewLink({ platform: "github", label: "", url: "" });
    setShowAdd(false);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="Social Buttons"
        description="Manage the social links displayed on your portfolio. Supports 1–5 buttons."
        action={{
          label: "Add Button",
          icon: <Plus size={14} strokeWidth={2} />,
          onClick: () => setShowAdd((v) => !v),
          disabled: links.length >= 5,
        }}
      />

      {/* ── Existing links ── */}
      <div className="rounded-xl border border-border bg-surface-1 overflow-hidden">
        {links.length === 0 && (
          <div className="px-5 py-10 text-center text-sm text-fg-subtle">
            No social buttons yet. Click "Add Button" to add one.
          </div>
        )}
        {links.map((link, i) => (
          <div
            key={link.platform}
            className="flex items-center gap-4 px-5 py-4"
            style={{
              borderBottom: i < links.length - 1 ? "1px solid var(--ds-border)" : "none",
            }}
          >
            <div className="text-fg-muted shrink-0">
              <PlatformIcon platform={link.platform} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{link.label}</p>
              <p className="text-xs text-fg-subtle truncate">{link.url}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                className="p-1.5 rounded-md text-fg-subtle hover:text-foreground hover:bg-surface-2 transition-all duration-150"
                aria-label={`Edit ${link.label}`}
              >
                <Pencil size={13} strokeWidth={1.75} />
              </button>
              <button
                onClick={() => deleteLink(link.platform)}
                className="p-1.5 rounded-md text-fg-subtle hover:text-[oklch(0.65_0.22_27)] hover:bg-[oklch(0.65_0.22_27_/_8%)] transition-all duration-150"
                aria-label={`Delete ${link.label}`}
              >
                <Trash2 size={13} strokeWidth={1.75} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Add new link form ── */}
      {showAdd && (
        <div className="rounded-xl border border-border bg-surface-1 p-5 space-y-4">
          <p className="text-sm font-semibold text-foreground">New Social Button</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Platform">
              <select
                className="admin-select"
                value={newLink.platform}
                onChange={(e) => setNewLink((p) => ({ ...p, platform: e.target.value as "github" | "linkedin" | "leetcode" }))}
              >
                <option value="github">GitHub</option>
                <option value="linkedin">LinkedIn</option>
                <option value="leetcode">LeetCode</option>
              </select>
            </FormField>
            <FormField label="Label" required>
              <input
                className="admin-input"
                value={newLink.label}
                onChange={(e) => setNewLink((p) => ({ ...p, label: e.target.value }))}
                placeholder="e.g. GitHub"
              />
            </FormField>
          </div>
          <FormField label="URL" required>
            <input
              className="admin-input"
              value={newLink.url}
              onChange={(e) => setNewLink((p) => ({ ...p, url: e.target.value }))}
              placeholder="https://github.com/yourusername"
            />
          </FormField>
          <div className="flex items-center gap-2.5">
            <button
              onClick={addLink}
              className="h-9 px-4 text-sm font-medium rounded-lg bg-brand text-brand-fg hover:bg-brand-hover transition-colors duration-150"
            >
              Add Button
            </button>
            <button
              onClick={() => setShowAdd(false)}
              className="h-9 px-4 text-sm font-medium rounded-lg border border-border text-fg-muted hover:text-foreground hover:bg-surface-2 transition-all duration-150"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {links.length >= 5 && (
        <p className="text-xs text-fg-subtle text-center">
          Maximum of 5 social buttons reached. Delete one to add another.
        </p>
      )}
    </div>
  );
}
