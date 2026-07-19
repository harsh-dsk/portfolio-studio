"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { usePortfolio } from "@/lib/context/PortfolioContext";
import { SortableList, SortableItem, SortableHandle } from "@/components/admin/SortableList";
import { ItemToggleControls } from "@/components/admin/ItemToggleControls";
import type { SkillCategory } from "@/lib/types";

/* ── Per-category accent palette (same as public portfolio) ── */
const PALETTE = [
  "oklch(0.63 0.19 251)",
  "oklch(0.72 0.17 155)",
  "oklch(0.76 0.14 65)",
  "oklch(0.68 0.20 308)",
  "oklch(0.70 0.15 200)",
  "oklch(0.65 0.22 27)",
  "oklch(0.73 0.18 320)",
];

function accent(idx: number) { return PALETTE[idx % PALETTE.length]; }

/* ── Category card ── */
function CategoryCard({
  category,
  index,
}: {
  category: SkillCategory;
  index: number;
}) {
  const {
    renameSkillCategory, deleteSkillCategory,
    addSkill, removeSkill, reorderSkillsInCategory,
    toggleSkillCategoryVisibility, toggleSkillCategoryResume,
  } = usePortfolio();

  const [renaming, setRenaming] = useState(false);
  const [newName, setNewName]   = useState(category.name);
  const [skillInput, setSkillInput] = useState("");

  const handleRename = () => {
    if (newName.trim() && newName.trim() !== category.name) {
      renameSkillCategory(category.id, newName.trim());
    }
    setRenaming(false);
  };

  const handleAddSkill = () => {
    const s = skillInput.trim();
    if (!s) return;
    addSkill(category.id, s);
    setSkillInput("");
  };

  const skillItems = category.skills.map((name) => ({ id: name, name }));

  const handleSkillReorder = (newItems: { id: string; name: string }[]) => {
    reorderSkillsInCategory(category.id, newItems.map((item) => item.name));
  };

  return (
    <SortableItem id={category.id} className="rounded-xl border border-border bg-surface-1 overflow-hidden">
      {/* Category header */}
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
        <SortableHandle />
        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: accent(index) }} />

        {renaming ? (
          <input
            autoFocus
            className="admin-input flex-1 py-0.5 text-sm"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleRename(); if (e.key === "Escape") setRenaming(false); }}
          />
        ) : (
          <span className="flex-1 text-sm font-semibold text-foreground">{category.name}</span>
        )}

        <span className="text-xs text-fg-subtle tabular-nums ml-auto shrink-0 mr-1">
          {category.skills.length} skill{category.skills.length !== 1 ? "s" : ""}
        </span>

        <ItemToggleControls
          isVisible={category.isVisible}
          includeInResume={category.includeInResume}
          onToggleVisibility={(val) => toggleSkillCategoryVisibility(category.id, val)}
          onToggleResume={(val) => toggleSkillCategoryResume(category.id, val)}
          size="sm"
        />

        {renaming ? (
          <>
            <button onClick={handleRename} className="p-1.5 rounded text-fg-subtle hover:text-foreground" title="Save name"><Check size={13} strokeWidth={2.5} /></button>
            <button onClick={() => { setRenaming(false); setNewName(category.name); }} className="p-1.5 rounded text-fg-subtle hover:text-foreground" title="Cancel"><X size={13} strokeWidth={2} /></button>
          </>
        ) : (
          <>
            <button onClick={() => setRenaming(true)} className="p-1.5 rounded text-fg-subtle hover:text-foreground hover:bg-surface-2 transition-all" title="Rename category"><Pencil size={13} strokeWidth={1.75} /></button>
            <button onClick={() => deleteSkillCategory(category.id)} className="p-1.5 rounded text-fg-subtle hover:text-[oklch(0.65_0.22_27)] hover:bg-[oklch(0.65_0.22_27_/_8%)] transition-all" title="Delete category"><Trash2 size={13} strokeWidth={1.75} /></button>
          </>
        )}
      </div>

      {/* Skills body */}
      <div className="p-4 space-y-3">
        {/* Skill chips */}
        {category.skills.length > 0 ? (
          <SortableList items={skillItems} onReorder={handleSkillReorder} layout="horizontal" className="flex flex-wrap gap-2">
            {skillItems.map((item) => (
              <SortableItem
                key={item.id}
                id={item.id}
                className="group flex items-center gap-1 pl-1 pr-1 h-7 text-xs rounded-lg border border-border bg-surface-2 text-fg-muted"
              >
                <SortableHandle iconSize={10} />
                <span className="pr-1">{item.name}</span>
                <button onClick={() => removeSkill(category.id, item.name)} className="p-0.5 rounded text-fg-subtle hover:text-[oklch(0.65_0.22_27)] transition-colors" aria-label={`Remove ${item.name}`}><X size={11} strokeWidth={2} /></button>
              </SortableItem>
            ))}
          </SortableList>
        ) : (
          <p className="text-xs text-fg-subtle">No skills yet. Add one below.</p>
        )}

        {/* Add skill input */}
        <div className="flex items-center gap-2">
          <input
            className="admin-input flex-1"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
            placeholder={`Add ${category.name} skill…`}
          />
          <button
            onClick={handleAddSkill}
            className="h-9 w-9 flex items-center justify-center rounded-lg border border-border bg-surface-2 text-fg-muted hover:text-foreground hover:border-border-hover transition-all shrink-0"
            title="Add skill"
          >
            <Plus size={14} strokeWidth={2} />
          </button>
        </div>
      </div>
    </SortableItem>
  );
}

/* ── Page ── */
export default function SkillsPage() {
  const { data, addSkillCategory, reorderSkillCategories } = usePortfolio();
  const categories = data.skills;

  const [addingCategory, setAddingCategory] = useState(false);
  const [newCatName, setNewCatName]          = useState("");

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    addSkillCategory(newCatName.trim());
    setNewCatName("");
    setAddingCategory(false);
  };

  return (
    <div className="max-w-3xl space-y-5">
      <PageHeader
        title="Technical Skills"
        description="Create categories, add skills, and drag to reorder. All changes update the public portfolio immediately."
        action={{
          label: "Add Category",
          icon: <Plus size={14} strokeWidth={2} />,
          onClick: () => setAddingCategory((v) => !v),
        }}
      />

      {/* Add category input */}
      {addingCategory && (
        <div className="flex items-center gap-2 p-4 rounded-xl border border-border bg-surface-1">
          <input
            autoFocus
            className="admin-input flex-1"
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleAddCategory(); if (e.key === "Escape") setAddingCategory(false); }}
            placeholder="Category name (e.g. AI, Cloud, DevOps…)"
          />
          <button onClick={handleAddCategory} className="h-9 px-4 text-sm font-medium rounded-lg bg-brand text-brand-fg hover:bg-brand-hover transition-colors shrink-0">Add</button>
          <button onClick={() => setAddingCategory(false)} className="h-9 px-3 text-sm rounded-lg border border-border text-fg-muted hover:text-foreground hover:bg-surface-2 transition-all shrink-0">Cancel</button>
        </div>
      )}

      {/* Category list */}
      {categories.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 rounded-xl border border-border border-dashed text-center">
          <p className="text-sm text-fg-subtle">No skill categories yet.</p>
          <button onClick={() => setAddingCategory(true)} className="text-sm text-brand hover:text-brand-hover transition-colors">+ Add your first category</button>
        </div>
      ) : (
        <SortableList items={categories} onReorder={reorderSkillCategories} className="space-y-4">
          {categories.map((cat, idx) => (
            <CategoryCard
              key={cat.id}
              category={cat}
              index={idx}
            />
          ))}
        </SortableList>
      )}

      <p className="text-xs text-fg-subtle px-1">
        Drag categories by the ≡ handle to reorder. Drag skill chips within a category to reorder them.
      </p>
    </div>
  );
}
