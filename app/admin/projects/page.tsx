'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, ExternalLink, GitBranch, Star, ImageIcon } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { FormField } from '@/components/admin/FormField'
import { usePortfolio } from '@/lib/context/PortfolioContext'
import { uploadProjectImage, addProjectImage } from '@/lib/services/projects.service'
import type { Project } from '@/lib/types'

function MiniPlaceholder({ project }: { project: Project }) {
  const from = project.placeholder?.from || 'oklch(0.15 0.04 250)'
  const to = project.placeholder?.to || 'oklch(0.11 0.03 270)'
  const accent = project.placeholder?.accent || 'oklch(0.63 0.19 251)'
  
  // If there's an actual screenshot, let's display it over the placeholder, 
  // or at least show the placeholder as a fallback if no screenshots.
  const firstScreenshot = project.screenshots && project.screenshots.length > 0 ? project.screenshots[0].url : null

  if (firstScreenshot) {
    return (
      <div className="w-full h-24 rounded-lg overflow-hidden relative" style={{ background: `linear-gradient(145deg, ${from} 0%, ${to} 100%)` }}>
        <img src={firstScreenshot} alt="Screenshot" className="w-full h-full object-cover" />
      </div>
    )
  }

  return (
    <div
      className="w-full h-24 rounded-lg overflow-hidden relative"
      style={{ background: `linear-gradient(145deg, ${from} 0%, ${to} 100%)` }}
      aria-hidden="true"
    >
      <div
        className="absolute top-0 left-0 right-0 h-5 flex items-center px-2 gap-1"
        style={{ background: 'oklch(0 0 0 / 18%)' }}
      >
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'oklch(0.70 0.18 25 / 70%)' }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'oklch(0.76 0.14 65 / 70%)' }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'oklch(0.72 0.17 155 / 70%)' }} />
      </div>
      <div className="absolute top-6 left-2 right-2 bottom-2 flex flex-col gap-1.5">
        <div className="h-2 w-16 rounded-full" style={{ background: accent.replace(')', ' / 40%)') }} />
        <div className="h-1.5 rounded-full" style={{ background: 'oklch(1 0 0 / 10%)' }} />
        <div className="h-1.5 w-3/4 rounded-full" style={{ background: 'oklch(1 0 0 / 8%)' }} />
      </div>
    </div>
  )
}

export default function ProjectsPage() {
  const { data, addProject, updateProject, deleteProject } = usePortfolio()
  const projects = data.projects

  const [showAdd, setShowAdd] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const [newProject, setNewProject] = useState({
    title: '', shortDescription: '', fullDescription: '', techStack: '', githubUrl: '', liveUrl: '',
  })
  const [editProject, setEditProject] = useState({
    title: '', shortDescription: '', fullDescription: '', techStack: '', githubUrl: '', liveUrl: '',
  })

  const handleAddProject = () => {
    if (!newProject.title.trim()) return
    addProject({
      title: newProject.title,
      shortDescription: newProject.shortDescription,
      fullDescription: newProject.fullDescription,
      techStack: newProject.techStack.split(',').map((s) => s.trim()).filter(Boolean),
      githubUrl: newProject.githubUrl || undefined,
      liveUrl: newProject.liveUrl || undefined,
      placeholder: { from: 'oklch(0.15 0.04 250)', to: 'oklch(0.11 0.03 270)', accent: 'oklch(0.63 0.19 251)' },
      screenshots: [],
    })
    setNewProject({ title: '', shortDescription: '', fullDescription: '', techStack: '', githubUrl: '', liveUrl: '' })
    setShowAdd(false)
  }
  
  const startEditing = (p: Project) => {
    setEditingId(p.id)
    setEditProject({
      title: p.title,
      shortDescription: p.shortDescription || '',
      fullDescription: p.fullDescription || '',
      techStack: p.techStack.join(', '),
      githubUrl: p.githubUrl || '',
      liveUrl: p.liveUrl || '',
    })
  }
  
  const handleEditProject = (id: string) => {
    if (!editProject.title.trim()) return
    updateProject(id, {
      title: editProject.title,
      shortDescription: editProject.shortDescription,
      fullDescription: editProject.fullDescription,
      techStack: editProject.techStack.split(',').map((s) => s.trim()).filter(Boolean),
      githubUrl: editProject.githubUrl || undefined,
      liveUrl: editProject.liveUrl || undefined,
    })
    setEditingId(null)
  }

  const handleScreenshotUpload = async (projectId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const url = await uploadProjectImage(file, projectId)
      const project = data.projects.find(p => p.id === projectId)
      const sortOrder = project?.screenshots?.length ?? 0
      const screenshot = await addProjectImage(projectId, url, file.name, sortOrder)
      updateProject(projectId, {
        screenshots: [...(project?.screenshots ?? []), screenshot]
      })
    } catch (err) {
      console.error('Screenshot upload failed:', err)
    }
  }

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader
        title="Projects"
        description="Add, edit, and manage the projects displayed on your portfolio."
        action={{
          label: 'Add Project',
          icon: <Plus size={14} strokeWidth={2} />,
          onClick: () => setShowAdd((v) => !v),
        }}
      />

      {/* Project cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded-xl border border-border bg-surface-1 overflow-hidden flex flex-col"
          >
            {/* Screenshot */}
            <div className="p-3 pb-0">
              <MiniPlaceholder project={project} />
            </div>

            {/* Content */}
            <div className="p-4 space-y-2.5 flex-1 flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-foreground leading-snug">{project.title}</p>
              </div>

              <p className="text-xs text-fg-muted line-clamp-2 leading-relaxed">{project.shortDescription}</p>

              <div className="flex flex-wrap gap-1">
                {project.techStack.slice(0, 3).map((t) => (
                  <span key={t} className="px-2 py-0.5 text-[10px] rounded-md border border-border text-fg-subtle bg-surface-2">{t}</span>
                ))}
                {project.techStack.length > 3 && (
                  <span className="px-2 py-0.5 text-[10px] rounded-md border border-border text-fg-subtle bg-surface-2">+{project.techStack.length - 3}</span>
                )}
              </div>

              <div className="mt-auto pt-4 flex flex-col gap-3">
                <div className="flex items-center gap-1.5">
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] text-brand hover:text-brand-hover transition-colors">
                      <ExternalLink size={10} strokeWidth={2} />Live
                    </a>
                  )}
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] text-fg-subtle hover:text-fg-muted transition-colors">
                      <GitBranch size={10} strokeWidth={2} />GitHub
                    </a>
                  )}
                  <div className="ml-auto flex items-center gap-1">
                    <label className="inline-flex items-center justify-center p-1.5 rounded-md text-fg-subtle hover:text-foreground hover:bg-surface-2 transition-all cursor-pointer" aria-label="Add Photo" title="Add Photo">
                      <ImageIcon size={12} strokeWidth={1.75} />
                      <input type="file" accept="image/*" className="sr-only" onChange={(e) => handleScreenshotUpload(project.id, e)} />
                    </label>
                    <button onClick={() => startEditing(project)} className="p-1.5 rounded-md text-fg-subtle hover:text-foreground hover:bg-surface-2 transition-all" aria-label="Edit project">
                      <Pencil size={12} strokeWidth={1.75} />
                    </button>
                    <button onClick={() => deleteProject(project.id)} className="p-1.5 rounded-md text-fg-subtle hover:text-[oklch(0.65_0.22_27)] hover:bg-[oklch(0.65_0.22_27_/_8%)] transition-all" aria-label="Delete project">
                      <Trash2 size={12} strokeWidth={1.75} />
                    </button>
                  </div>
                </div>
                
                {/* Inline Edit Form */}
                {editingId === project.id && (
                  <div className="pt-3 border-t border-border flex flex-col gap-3">
                    <input className="admin-input text-xs" value={editProject.title} onChange={(e) => setEditProject((p) => ({ ...p, title: e.target.value }))} placeholder="Project title" />
                    <textarea className="admin-textarea text-xs" rows={2} value={editProject.shortDescription} onChange={(e) => setEditProject((p) => ({ ...p, shortDescription: e.target.value }))} placeholder="Short Description" />
                    <textarea className="admin-textarea text-xs" rows={3} value={editProject.fullDescription} onChange={(e) => setEditProject((p) => ({ ...p, fullDescription: e.target.value }))} placeholder="Full Description" />
                    <input className="admin-input text-xs" value={editProject.techStack} onChange={(e) => setEditProject((p) => ({ ...p, techStack: e.target.value }))} placeholder="Tech Stack (comma separated)" />
                    <input className="admin-input text-xs" value={editProject.githubUrl} onChange={(e) => setEditProject((p) => ({ ...p, githubUrl: e.target.value }))} placeholder="GitHub URL" />
                    <input className="admin-input text-xs" value={editProject.liveUrl} onChange={(e) => setEditProject((p) => ({ ...p, liveUrl: e.target.value }))} placeholder="Live URL" />
                    <div className="flex gap-2">
                      <button onClick={() => handleEditProject(project.id)} className="h-7 px-3 text-[11px] font-medium rounded bg-brand text-brand-fg">Save</button>
                      <button onClick={() => setEditingId(null)} className="h-7 px-3 text-[11px] font-medium rounded border border-border text-fg-muted">Cancel</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add project form */}
      {showAdd && (
        <div className="rounded-xl border border-border bg-surface-1 p-5 space-y-4">
          <p className="text-sm font-semibold text-foreground">New Project</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Title" required>
              <input className="admin-input" value={newProject.title} onChange={(e) => setNewProject((p) => ({ ...p, title: e.target.value }))} placeholder="Project name" />
            </FormField>
            <FormField label="Tech Stack" description="Comma-separated: React, Node.js, Supabase">
              <input className="admin-input" value={newProject.techStack} onChange={(e) => setNewProject((p) => ({ ...p, techStack: e.target.value }))} placeholder="React, TypeScript, Supabase" />
            </FormField>
            <FormField label="GitHub URL">
              <input className="admin-input" value={newProject.githubUrl} onChange={(e) => setNewProject((p) => ({ ...p, githubUrl: e.target.value }))} placeholder="https://github.com/..." />
            </FormField>
            <FormField label="Live Demo URL">
              <input className="admin-input" value={newProject.liveUrl} onChange={(e) => setNewProject((p) => ({ ...p, liveUrl: e.target.value }))} placeholder="https://..." />
            </FormField>
          </div>
          <FormField label="Short Description">
            <textarea className="admin-textarea" rows={2} value={newProject.shortDescription} onChange={(e) => setNewProject((p) => ({ ...p, shortDescription: e.target.value }))} placeholder="One or two sentence summary..." />
          </FormField>
          <FormField label="Full Description">
            <textarea className="admin-textarea" rows={3} value={newProject.fullDescription} onChange={(e) => setNewProject((p) => ({ ...p, fullDescription: e.target.value }))} placeholder="Detailed description for the case study modal..." />
          </FormField>
          <div className="flex gap-2.5">
            <button onClick={handleAddProject} className="h-9 px-4 text-sm font-medium rounded-lg bg-brand text-brand-fg hover:bg-brand-hover transition-colors duration-150">Add Project</button>
            <button onClick={() => setShowAdd(false)} className="h-9 px-4 text-sm font-medium rounded-lg border border-border text-fg-muted hover:text-foreground hover:bg-surface-2 transition-all duration-150">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
