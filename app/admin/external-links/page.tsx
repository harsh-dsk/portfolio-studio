"use client";

import { useState } from "react";
import { Plus, Trash2, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { FormField } from "@/components/admin/FormField";
import { usePortfolio } from "@/lib/context/PortfolioContext";
import { SortableList, SortableItem, SortableHandle } from "@/components/admin/SortableList";
import { ItemToggleControls } from "@/components/admin/ItemToggleControls";

export default function ExternalLinksPage() {
  const { data, addExternalLink, deleteExternalLink, reorderExternalLinks, toggleExternalLinkVisibility, toggleExternalLinkResume } = usePortfolio();
  const links = data.externalLinks;

  const [showAdd, setShowAdd] = useState(false);
  const [newLink, setNewLink] = useState({ label: "", url: "", description: "" });

  const handleAddLink = () => {
    if (!newLink.label.trim() || !newLink.url.trim()) return;
    addExternalLink({
      label: newLink.label.trim(),
      url: newLink.url.trim(),
      description: newLink.description.trim() || undefined,
    });
    setNewLink({ label: "", url: "", description: "" });
    setShowAdd(false);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="External Links"
        description="Manage links to your blog, portfolio sites, articles, and profiles."
        action={{
          label: "Add Link",
          icon: <Plus size={14} strokeWidth={2} />,
          onClick: () => setShowAdd((v) => !v),
        }}
      />

      {/* List */}
      {links.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16 rounded-xl border border-border border-dashed text-center">
          <p className="text-sm text-fg-subtle">No external links yet.</p>
          <button onClick={() => setShowAdd(true)} className="text-sm text-brand hover:text-brand-hover transition-colors">+ Add external link</button>
        </div>
      ) : (
        <SortableList items={links} onReorder={reorderExternalLinks} className="rounded-xl border border-border bg-surface-1 overflow-hidden divide-y divide-border">
          {links.map((link) => (
            <SortableItem key={link.id} id={link.id} className="flex items-start gap-3 px-5 py-4 bg-surface-1">
              <SortableHandle className="mt-0.5" />
              <div className="flex-1 min-w-0 space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-brand hover:text-brand-hover transition-colors inline-flex items-center gap-1"
                  >
                    {link.label}
                    <ArrowUpRight size={11} strokeWidth={2} />
                  </a>
                </div>
                {link.description && (
                  <p className="text-xs text-fg-muted">{link.description}</p>
                )}
                <p className="text-[11px] text-fg-subtle truncate">{link.url}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <ItemToggleControls
                  isVisible={link.isVisible}
                  includeInResume={link.includeInResume}
                  onToggleVisibility={(val) => toggleExternalLinkVisibility(link.id, val)}
                  onToggleResume={(val) => toggleExternalLinkResume(link.id, val)}
                  size="sm"
                />
                <button
                  onClick={() => deleteExternalLink(link.id)}
                  className="p-1.5 rounded-md text-fg-subtle hover:text-[oklch(0.65_0.22_27)] hover:bg-[oklch(0.65_0.22_27_/_8%)] transition-all"
                  aria-label="Delete link"
                >
                  <Trash2 size={13} strokeWidth={1.75} />
                </button>
              </div>
            </SortableItem>
          ))}
        </SortableList>
      )}

      {showAdd && (
        <div className="rounded-xl border border-border bg-surface-1 p-5 space-y-4">
          <p className="text-sm font-semibold text-foreground">New External Link</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Label" required>
              <input className="admin-input" value={newLink.label} onChange={(e) => setNewLink((p) => ({ ...p, label: e.target.value }))} placeholder="e.g. Personal Blog" />
            </FormField>
            <FormField label="URL" required>
              <input className="admin-input" value={newLink.url} onChange={(e) => setNewLink((p) => ({ ...p, url: e.target.value }))} placeholder="https://..." />
            </FormField>
          </div>
          <FormField label="Description">
            <input className="admin-input" value={newLink.description} onChange={(e) => setNewLink((p) => ({ ...p, description: e.target.value }))} placeholder="Brief description of this link" />
          </FormField>
          <div className="flex gap-2.5">
            <button onClick={handleAddLink} className="h-9 px-4 text-sm font-medium rounded-lg bg-brand text-brand-fg hover:bg-brand-hover transition-colors duration-150">Add Link</button>
            <button onClick={() => setShowAdd(false)} className="h-9 px-4 text-sm font-medium rounded-lg border border-border text-fg-muted hover:text-foreground hover:bg-surface-2 transition-all duration-150">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
