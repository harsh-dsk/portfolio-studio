"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { FormField } from "@/components/admin/FormField";
import { usePortfolio } from "@/lib/context/PortfolioContext";
import { SortableList, SortableItem, SortableHandle } from "@/components/admin/SortableList";

export default function EducationPage() {
  const { data, addEducation, deleteEducation, reorderEducation } = usePortfolio();
  const entries = data.education;

  const [showAdd, setShowAdd] = useState(false);
  const [newEntry, setNewEntry] = useState({
    degree: "", field: "", institution: "", period: "", location: "", gpa: "", courseworkStr: "",
  });

  const handleAddEntry = () => {
    if (!newEntry.degree.trim() || !newEntry.institution.trim()) return;
    const coursework = newEntry.courseworkStr.split(',').map(s => s.trim()).filter(Boolean);
    addEducation({
      degree: newEntry.degree,
      field: newEntry.field,
      institution: newEntry.institution,
      period: newEntry.period,
      location: newEntry.location,
      gpa: newEntry.gpa || undefined,
      coursework: coursework.length > 0 ? coursework : undefined,
    });
    setNewEntry({ degree: "", field: "", institution: "", period: "", location: "", gpa: "", courseworkStr: "" });
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
      {entries.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 rounded-xl border border-border border-dashed text-center">
          <p className="text-sm text-fg-subtle">No education entries yet.</p>
          <button onClick={() => setShowAdd(true)} className="text-sm text-brand hover:text-brand-hover transition-colors">+ Add education entry</button>
        </div>
      ) : (
        <SortableList items={entries} onReorder={reorderEducation} className="space-y-4">
          {entries.map((entry) => (
            <SortableItem key={entry.id} id={entry.id} className="rounded-xl border border-border bg-surface-1 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{entry.degree}</p>
                  </div>
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
                  {entry.coursework && entry.coursework.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-2">
                      {entry.coursework.map((c) => (
                        <span key={c} className="px-2 py-0.5 text-[10px] rounded border border-border bg-surface-2 text-fg-subtle">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <SortableHandle />
                  <button
                    onClick={() => deleteEducation(entry.id)}
                    className="p-1.5 rounded-md text-fg-subtle hover:text-[oklch(0.65_0.22_27)] hover:bg-[oklch(0.65_0.22_27_/_8%)] transition-all duration-150"
                    aria-label="Delete entry"
                  >
                    <Trash2 size={13} strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            </SortableItem>
          ))}
        </SortableList>
      )}

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
            <textarea className="admin-textarea" rows={2} value={newEntry.courseworkStr} onChange={(e) => setNewEntry((p) => ({ ...p, courseworkStr: e.target.value }))} placeholder="Data Structures, Algorithms, DBMS..." />
          </FormField>
          <div className="flex gap-2.5">
            <button onClick={handleAddEntry} className="h-9 px-4 text-sm font-medium rounded-lg bg-brand text-brand-fg hover:bg-brand-hover transition-colors duration-150">
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
