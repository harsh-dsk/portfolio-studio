"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { adminSkills } from "@/lib/data/mock-admin";

const CATEGORY_COLORS: Record<string, string> = {
  Languages: "oklch(0.68 0.20 308)",
  Frontend:  "oklch(0.63 0.19 251)",
  Backend:   "oklch(0.72 0.17 155)",
  Database:  "oklch(0.76 0.14 65)",
  Tools:     "oklch(0.70 0.15 200)",
};

export default function SkillsPage() {
  const [skills, setSkills] = useState<Record<string, string[]>>(adminSkills);
  const [newSkill, setNewSkill] = useState<Record<string, string>>({});

  const addSkill = (category: string) => {
    const s = newSkill[category]?.trim();
    if (!s) return;
    setSkills((prev) => ({ ...prev, [category]: [...(prev[category] ?? []), s] }));
    setNewSkill((prev) => ({ ...prev, [category]: "" }));
  };

  const removeSkill = (category: string, skill: string) => {
    setSkills((prev) => ({
      ...prev,
      [category]: prev[category].filter((s) => s !== skill),
    }));
  };

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader
        title="Technical Skills"
        description="Add or remove skills within each category. Changes update the public portfolio."
      />

      {Object.entries(skills).map(([category, skillList]) => {
        const accent = CATEGORY_COLORS[category] ?? "oklch(0.63 0.19 251)";
        return (
          <div key={category} className="rounded-xl border border-border bg-surface-1 p-5 space-y-4">
            {/* Category title */}
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: accent }}
                aria-hidden="true"
              />
              <h2
                className="text-sm font-semibold text-foreground"
                style={{ fontSize: "0.875rem", letterSpacing: "-0.01em" }}
              >
                {category}
              </h2>
              <span className="ml-auto text-xs text-fg-subtle tabular-nums">
                {skillList.length} {skillList.length === 1 ? "skill" : "skills"}
              </span>
            </div>

            {/* Chip list */}
            {skillList.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skillList.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-1.5 pl-3 pr-1.5 h-7 text-xs rounded-lg border border-border bg-surface-2 text-fg-muted"
                  >
                    {skill}
                    <button
                      onClick={() => removeSkill(category, skill)}
                      className="p-0.5 rounded text-fg-subtle hover:text-[oklch(0.65_0.22_27)] transition-colors"
                      aria-label={`Remove ${skill}`}
                    >
                      <X size={11} strokeWidth={2} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-fg-subtle">No skills in this category.</p>
            )}

            {/* Add input */}
            <div className="flex items-center gap-2">
              <input
                className="admin-input flex-1"
                value={newSkill[category] ?? ""}
                onChange={(e) =>
                  setNewSkill((prev) => ({ ...prev, [category]: e.target.value }))
                }
                onKeyDown={(e) => e.key === "Enter" && addSkill(category)}
                placeholder={`Add ${category} skill...`}
              />
              <button
                onClick={() => addSkill(category)}
                className="h-9 w-9 flex items-center justify-center rounded-lg border border-border bg-surface-2 text-fg-muted hover:text-foreground hover:border-border-hover transition-all duration-150 shrink-0"
                aria-label={`Add to ${category}`}
              >
                <Plus size={14} strokeWidth={2} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
