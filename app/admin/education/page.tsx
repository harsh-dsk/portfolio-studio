"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { FormField } from "@/components/admin/FormField";
import type { Education } from "@/lib/data/resume";
import { resumeData } from "@/lib/data/resume";

type EducationEntry = Education & { id: string };

const initialEntries: EducationEntry[] = resumeData.education.map((e, i) => ({
  ...e,
  id: String(i),
}));

export default function EducationPage() {
  const [entries, setEntries] = useState<EducationEntry[]>(initialEntries);
  const [showAdd, setShowAdd] = useState(false);
  const [newEntry, setNewEntry] = useState({
    degree: "", field: "", institution: "", period: "", location: "", gpa: "", coursework: [] as string[],
  });

  const deleteEntry = (id: string) =>
    setEntries((prev) => prev.filter((e) => e.id !== id));

  const addEntry = () => {
    if (!newEntry.degree.trim() || !newEntry.institution.trim()) return;
    setEntries((prev) => [
      ...prev,
      { ...newEntry, id: Date.now().toString(), coursework: newEntry.coursework },
    ]);
    setNewEntry({ degree: "", field: "", institution: "", period: "", location: "", gpa: "", coursework: [] });
    setShowAdd(false);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="Education"
        description="Manage your educational background and qualifications."
        action={{
          label: "Add Entry",
          icon: <Plus size={14} strokeWidth={2} />,
          onClick: () => setShowAdd((v) => !v),
        }}
      />

      {/* Existing entries */}
      <div className="space-y-4">
        {entries.map((entry) => (
          <div key={entry.id} className="rounded-xl border border-border bg-surface-1 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-1">
                <p className="text-sm font-semibold text-foreground">{entry.degree}</p>
                <p className="text-sm text-fg-muted">{entry.field}</p>
                <p className="text-xs text-fg-subtle">{entry.institution}</p>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
                  {entry.period && (
                    <span className="text-xs text-fg-subtle tabular-nums">{entry.period}</span>
                  )}
                  {entry.gpa && (
                    <span className="text-xs text-fg-subtle">GPA: {entry.gpa}</span>
                  )}
                  {entry.location && (
                    <span className="text-xs text-fg-subtle">{entry.location}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  className="p-1.5 rounded-md text-fg-subtle hover:text-foreground hover:bg-surface-2 transition-all duration-150"
                  aria-label="Edit entry"
                >
                  <Pencil size={13} strokeWidth={1.75} />
                </button>
                <button
                  onClick={() => deleteEntry(entry.id)}
                  className="p-1.5 rounded-md text-fg-subtle hover:text-[oklch(0.65_0.22_27)] hover:bg-[oklch(0.65_0.22_27_/_8%)] transition-all duration-150"
                  aria-label="Delete entry"
                >
                  <Trash2 size={13} strokeWidth={1.75} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="rounded-xl border border-border bg-surface-1 p-5 space-y-4">
          <p className="text-sm font-semibold text-foreground">New Education Entry</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Degree" required>
              <input className="admin-input" value={newEntry.degree} onChange={(e) => setNewEntry((p) => ({ ...p, degree: e.target.value }))} placeholder="Bachelor of Engineering" />
            </FormField>
            <FormField label="Field of Study" required>
              <input className="admin-input" value={newEntry.field} onChange={(e) => setNewEntry((p) => ({ ...p, field: e.target.value }))} placeholder="Computer Science" />
            </FormField>
            <FormField label="Institution" required>
              <input className="admin-input" value={newEntry.institution} onChange={(e) => setNewEntry((p) => ({ ...p, institution: e.target.value }))} placeholder="University name" />
            </FormField>
            <FormField label="Duration">
              <input className="admin-input" value={newEntry.period} onChange={(e) => setNewEntry((p) => ({ ...p, period: e.target.value }))} placeholder="2021 – 2025" />
            </FormField>
            <FormField label="Location">
              <input className="admin-input" value={newEntry.location} onChange={(e) => setNewEntry((p) => ({ ...p, location: e.target.value }))} placeholder="City, Country" />
            </FormField>
            <FormField label="CGPA / GPA">
              <input className="admin-input" value={newEntry.gpa} onChange={(e) => setNewEntry((p) => ({ ...p, gpa: e.target.value }))} placeholder="8.5 / 10" />
            </FormField>
          </div>
          <FormField label="Description / Key Coursework" description="Separate courses or topics with commas.">
            <textarea className="admin-textarea" rows={2} placeholder="Data Structures, Algorithms, DBMS..." />
          </FormField>
          <div className="flex gap-2.5">
            <button onClick={addEntry} className="h-9 px-4 text-sm font-medium rounded-lg bg-brand text-brand-fg hover:bg-brand-hover transition-colors duration-150">
              Add Entry
            </button>
            <button onClick={() => setShowAdd(false)} className="h-9 px-4 text-sm font-medium rounded-lg border border-border text-fg-muted hover:text-foreground hover:bg-surface-2 transition-all duration-150">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
