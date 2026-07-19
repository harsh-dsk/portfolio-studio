'use client'

import React from 'react'
import { SortableList, SortableItem } from '@/components/admin/SortableList'
import type { Project } from '@/lib/types'
import { ProjectCard } from './ProjectCard'

interface ProjectGridProps {
  projects: Project[]
  onReorder: (projects: Project[]) => void
  onOpenEdit: (project: Project) => void
  onOpenGallery: (project: Project) => void
  onDelete: (projectId: string) => void
  onToggleVisibility: (projectId: string, isVisible: boolean) => void
  onToggleResume: (projectId: string, includeInResume: boolean) => void
}

export function ProjectGrid({
  projects,
  onReorder,
  onOpenEdit,
  onOpenGallery,
  onDelete,
  onToggleVisibility,
  onToggleResume,
}: ProjectGridProps) {
  if (!projects || projects.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface-1 p-12 text-center text-sm text-fg-subtle">
        No projects created yet. Click "+ Add Project" above to create your first project.
      </div>
    )
  }

  return (
    <SortableList
      items={projects}
      onReorder={onReorder}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {projects.map((project) => (
        <SortableItem key={project.id} id={project.id} className="h-full">
          <ProjectCard
            project={project}
            onOpenEdit={() => onOpenEdit(project)}
            onOpenGallery={() => onOpenGallery(project)}
            onDelete={() => onDelete(project.id)}
            onToggleVisibility={(val) => onToggleVisibility(project.id, val)}
            onToggleResume={(val) => onToggleResume(project.id, val)}
          />
        </SortableItem>
      ))}
    </SortableList>
  )
}
