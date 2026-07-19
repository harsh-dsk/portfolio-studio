'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { FormField } from '@/components/admin/FormField'
import { usePortfolio } from '@/lib/context/PortfolioContext'
import { SortableList, SortableItem, SortableHandle } from '@/components/admin/SortableList'

export default function AchievementsPage() {
  const { data, addAchievement, updateAchievement, deleteAchievement, reorderAchievements } = usePortfolio()
  const items = data.achievements

  const [showAdd, setShowAdd] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newItem, setNewItem] = useState({ title: '', description: '', date: '' })
  const [editItem, setEditItem] = useState({ title: '', description: '', date: '' })

  const handleAddItem = () => {
    if (!newItem.title.trim()) return
    addAchievement({ title: newItem.title, description: newItem.description, date: newItem.date })
    setNewItem({ title: '', description: '', date: '' })
    setShowAdd(false)
  }
  
  const startEditing = (a: any) => {
    setEditingId(a.id)
    setEditItem({ title: a.title, description: a.description || '', date: a.date || '' })
  }
  
  const handleEditItem = (id: string) => {
    if (!editItem.title.trim()) return
    updateAchievement(id, { title: editItem.title, description: editItem.description, date: editItem.date })
    setEditingId(null)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="Achievements"
        description="Manage awards, hackathon wins, certifications, and other accomplishments."
        action={{
          label: 'Add Achievement',
          icon: <Plus size={14} strokeWidth={2} />,
          onClick: () => setShowAdd((v) => !v),
        }}
      />

      {/* List */}
      {items.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface-1 px-5 py-10 text-center text-sm text-fg-subtle">
          No achievements yet. Click "Add Achievement" to add one.
        </div>
      ) : (
        <SortableList items={items} onReorder={reorderAchievements} className="rounded-xl border border-border bg-surface-1 overflow-hidden divide-y divide-border">
          {items.map((item, i) => (
            <SortableItem
              key={item.id}
              id={item.id}
              className="flex items-start gap-4 px-5 py-4 flex-col sm:flex-row bg-surface-1"
            >
              <div className="flex w-full items-start">
                <SortableHandle className="mr-2 mt-0.5" />
                {/* Number badge */}
                <span className="text-xs font-mono text-fg-subtle tabular-nums mt-0.5 shrink-0 w-5 text-right mr-3">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-fg-muted leading-relaxed">{item.description}</p>
                  {item.date && (
                    <p className="text-[11px] text-fg-subtle tabular-nums">{item.date}</p>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  <button
                    onClick={() => startEditing(item)}
                    className="p-1.5 rounded-md text-fg-subtle hover:text-foreground hover:bg-surface-2 transition-all"
                    aria-label="Edit achievement"
                  >
                    <Pencil size={13} strokeWidth={1.75} />
                  </button>
                  <button
                    onClick={() => deleteAchievement(item.id)}
                    className="p-1.5 rounded-md text-fg-subtle hover:text-[oklch(0.65_0.22_27)] hover:bg-[oklch(0.65_0.22_27_/_8%)] transition-all"
                    aria-label="Delete achievement"
                  >
                    <Trash2 size={13} strokeWidth={1.75} />
                  </button>
                </div>
              </div>
              
              {/* Inline Edit Form */}
              {editingId === item.id && (
                <div className="w-full mt-3 pt-3 border-t border-border flex flex-col gap-3 ml-0 sm:ml-9">
                  <input className="admin-input text-xs" value={editItem.title} onChange={(e) => setEditItem((p) => ({ ...p, title: e.target.value }))} placeholder="Title" />
                  <textarea className="admin-textarea text-xs" rows={2} value={editItem.description} onChange={(e) => setEditItem((p) => ({ ...p, description: e.target.value }))} placeholder="Description" />
                  <input className="admin-input text-xs" value={editItem.date} onChange={(e) => setEditItem((p) => ({ ...p, date: e.target.value }))} placeholder="Date (e.g. Mar 2024)" />
                  <div className="flex gap-2">
                    <button onClick={() => handleEditItem(item.id)} className="h-7 px-3 text-[11px] font-medium rounded bg-brand text-brand-fg">Save</button>
                    <button onClick={() => setEditingId(null)} className="h-7 px-3 text-[11px] font-medium rounded border border-border text-fg-muted">Cancel</button>
                  </div>
                </div>
              )}
            </SortableItem>
          ))}
        </SortableList>
      )}

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
            <button onClick={handleAddItem} className="h-9 px-4 text-sm font-medium rounded-lg bg-brand text-brand-fg hover:bg-brand-hover transition-colors duration-150">Add</button>
            <button onClick={() => setShowAdd(false)} className="h-9 px-4 text-sm font-medium rounded-lg border border-border text-fg-muted hover:text-foreground hover:bg-surface-2 transition-all duration-150">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
