"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { FormField } from "@/components/admin/FormField";
import type { Achievement } from "@/lib/data/resume";
import { resumeData } from "@/lib/data/resume";

type AdminAchievement = Achievement & { id: string };

const initialAchievements: AdminAchievement[] = resumeData.achievements.map((a, i) => ({
  ...a,
  id: String(i),
}));

export default function AchievementsPage() {
  const [items, setItems] = useState<AdminAchievement[]>(initialAchievements);
  const [showAdd, setShowAdd] = useState(false);
  const [newItem, setNewItem] = useState({ title: "", description: "", date: "" });

  const deleteItem = (id: string) =>
    setItems((prev) => prev.filter((a) => a.id !== id));

  const addItem = () => {
    if (!newItem.title.trim()) return;
    setItems((prev) => [...prev, { ...newItem, id: Date.now().toString() }]);
    setNewItem({ title: "", description: "", date: "" });
    setShowAdd(false);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="Achievements"
        description="Manage awards, hackathon wins, certifications, and other accomplishments."
        action={{
          label: "Add Achievement",
          icon: <Plus size={14} strokeWidth={2} />,
          onClick: () => setShowAdd((v) => !v),
        }}
      />

      {/* List */}
      <div className="rounded-xl border border-border bg-surface-1 overflow-hidden">
        {items.map((item, i) => (
          <div
            key={item.id}
            className="flex items-start gap-4 px-5 py-4"
            style={{ borderBottom: i < items.length - 1 ? "1px solid var(--ds-border)" : "none" }}
          >
            {/* Number badge */}
            <span className="text-xs font-mono text-fg-subtle tabular-nums mt-0.5 shrink-0 w-5 text-right">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex-1 min-w-0 space-y-0.5">
              <p className="text-sm font-medium text-foreground">{item.title}</p>
              <p className="text-xs text-fg-muted leading-relaxed">{item.description}</p>
              {item.date && (
                <p className="text-[11px] text-fg-subtle tabular-nums">{item.date}</p>
              )}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                className="p-1.5 rounded-md text-fg-subtle hover:text-foreground hover:bg-surface-2 transition-all"
                aria-label="Edit achievement"
              >
                <Pencil size={13} strokeWidth={1.75} />
              </button>
              <button
                onClick={() => deleteItem(item.id)}
                className="p-1.5 rounded-md text-fg-subtle hover:text-[oklch(0.65_0.22_27)] hover:bg-[oklch(0.65_0.22_27_/_8%)] transition-all"
                aria-label="Delete achievement"
              >
                <Trash2 size={13} strokeWidth={1.75} />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="px-5 py-10 text-center text-sm text-fg-subtle">
            No achievements yet. Click "Add Achievement" to add one.
          </div>
        )}
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="rounded-xl border border-border bg-surface-1 p-5 space-y-4">
          <p className="text-sm font-semibold text-foreground">New Achievement</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Title" required className="sm:col-span-2">
              <input className="admin-input" value={newItem.title} onChange={(e) => setNewItem((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Hackathon Winner — DevHack 2024" />
            </FormField>
            <FormField label="Date">
              <input className="admin-input" value={newItem.date} onChange={(e) => setNewItem((p) => ({ ...p, date: e.target.value }))} placeholder="Mar 2024" />
            </FormField>
          </div>
          <FormField label="Description">
            <textarea className="admin-textarea" rows={3} value={newItem.description} onChange={(e) => setNewItem((p) => ({ ...p, description: e.target.value }))} placeholder="Brief description of the achievement..." />
          </FormField>
          <div className="flex gap-2.5">
            <button onClick={addItem} className="h-9 px-4 text-sm font-medium rounded-lg bg-brand text-brand-fg hover:bg-brand-hover transition-colors duration-150">Add</button>
            <button onClick={() => setShowAdd(false)} className="h-9 px-4 text-sm font-medium rounded-lg border border-border text-fg-muted hover:text-foreground hover:bg-surface-2 transition-all duration-150">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
