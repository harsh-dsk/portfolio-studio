'use client'

import React, { useState, useEffect } from 'react'
import { X, Save } from 'lucide-react'
import { FormField } from '@/components/admin/FormField'
import type { Project } from '@/lib/types'

interface ProjectEditorDialogProps {
  isOpen: boolean
  project: Project | null
  onClose: () => void
  onSave: (updates: Partial<Project>) => void
}

export function ProjectEditorDialog({
  isOpen,
  project,
  onClose,
  onSave,
}: ProjectEditorDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    fullDescription: '',
    techStack: '',
    githubUrl: '',
    liveUrl: '',
    isVisible: true,
    includeInResume: true,
  })

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        shortDescription: project.shortDescription || '',
        fullDescription: project.fullDescription || '',
        techStack: project.techStack ? project.techStack.join(', ') : '',
        githubUrl: project.githubUrl || '',
        liveUrl: project.liveUrl || '',
        isVisible: project.isVisible !== false,
        includeInResume: project.includeInResume !== false,
      })
    } else {
      setFormData({
        title: '',
        shortDescription: '',
        fullDescription: '',
        techStack: '',
        githubUrl: '',
        liveUrl: '',
        isVisible: true,
        includeInResume: true,
      })
    }
  }, [project, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    onSave({
      title: formData.title.trim(),
      shortDescription: formData.shortDescription.trim(),
      fullDescription: formData.fullDescription.trim(),
      techStack: formData.techStack
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      githubUrl: formData.githubUrl.trim() || undefined,
      liveUrl: formData.liveUrl.trim() || undefined,
      isVisible: formData.isVisible,
      includeInResume: formData.includeInResume,
    })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-border bg-surface-1 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="editor-dialog-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-1">
          <h2 id="editor-dialog-title" className="text-base font-semibold text-foreground">
            {project ? 'Edit Project' : 'New Project'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-fg-subtle hover:text-foreground hover:bg-surface-2 transition-colors"
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <FormField label="Project Title" required>
            <input
              type="text"
              className="admin-input"
              value={formData.title}
              onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
              placeholder="e.g. DevFlow AI Platform"
              autoFocus
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="GitHub Repository URL">
              <input
                type="url"
                className="admin-input"
                value={formData.githubUrl}
                onChange={(e) => setFormData((p) => ({ ...p, githubUrl: e.target.value }))}
                placeholder="https://github.com/..."
              />
            </FormField>

            <FormField label="Live Demo URL">
              <input
                type="url"
                className="admin-input"
                value={formData.liveUrl}
                onChange={(e) => setFormData((p) => ({ ...p, liveUrl: e.target.value }))}
                placeholder="https://devflow.example.com"
              />
            </FormField>
          </div>

          <FormField label="Tech Stack" description="Comma-separated: React, TypeScript, Supabase, Tailwind">
            <input
              type="text"
              className="admin-input"
              value={formData.techStack}
              onChange={(e) => setFormData((p) => ({ ...p, techStack: e.target.value }))}
              placeholder="React, Next.js, TypeScript"
            />
          </FormField>

          <FormField label="Short Description" description="1-2 sentences shown on project cards">
            <textarea
              className="admin-textarea"
              rows={2}
              value={formData.shortDescription}
              onChange={(e) => setFormData((p) => ({ ...p, shortDescription: e.target.value }))}
              placeholder="A developer productivity platform powered by AI..."
            />
          </FormField>

          <FormField label="Full Description" description="Detailed case study explanation shown in modal">
            <textarea
              className="admin-textarea"
              rows={4}
              value={formData.fullDescription}
              onChange={(e) => setFormData((p) => ({ ...p, fullDescription: e.target.value }))}
              placeholder="DevFlow is a full-stack platform built with Next.js 15, Supabase, and OpenAI..."
            />
          </FormField>

          <div className="pt-2 flex flex-wrap items-center gap-6 border-t border-border">
            <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.isVisible}
                onChange={(e) => setFormData((p) => ({ ...p, isVisible: e.target.checked }))}
                className="rounded border-border text-brand focus:ring-brand"
              />
              <span>Show on Public Website</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.includeInResume}
                onChange={(e) => setFormData((p) => ({ ...p, includeInResume: e.target.checked }))}
                className="rounded border-border text-emerald-500 focus:ring-emerald-500"
              />
              <span>Include in Generated Resume</span>
            </label>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-border bg-surface-1/50">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 text-xs font-medium rounded-lg border border-border text-fg-muted hover:text-foreground hover:bg-surface-2 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="h-9 px-4 text-xs font-medium rounded-lg bg-brand text-brand-fg hover:bg-brand-hover transition-colors flex items-center gap-1.5"
          >
            <Save size={14} />
            <span>Save Project</span>
          </button>
        </div>
      </div>
    </div>
  )
}
