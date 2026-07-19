'use client'

import React from 'react'
import { Pencil, Trash2, ExternalLink, GitBranch, Image as ImageIcon } from 'lucide-react'
import type { Project } from '@/lib/types'
import { ItemToggleControls } from '@/components/admin/ItemToggleControls'
import { SortableHandle } from '@/components/admin/SortableList'

interface ProjectCardProps {
  project: Project
  onOpenEdit: () => void
  onOpenGallery: () => void
  onDelete: () => void
  onToggleVisibility: (isVisible: boolean) => void
  onToggleResume: (includeInResume: boolean) => void
}

export function ProjectCard({
  project,
  onOpenEdit,
  onOpenGallery,
  onDelete,
  onToggleVisibility,
  onToggleResume,
}: ProjectCardProps) {
  // Find cover image or first valid screenshot
  const coverImg = project.screenshots?.find((img) => img.isCover) || project.screenshots?.[0]
  const displayUrl = coverImg?.url

  const visibleTech = project.techStack.slice(0, 3)
  const remainingTechCount = Math.max(0, project.techStack.length - 3)

  return (
    <div className="h-full flex flex-col justify-between rounded-xl border border-border bg-surface-1 overflow-hidden shadow-sm hover:border-border-hover transition-all duration-200">
      {/* ── Card Top Header & Cover Image ── */}
      <div className="flex flex-col">
        {/* Title bar with drag handle */}
        <div className="flex items-center gap-2 p-3.5 border-b border-border bg-surface-1/50">
          <SortableHandle />
          <h3 className="font-semibold text-sm text-foreground truncate flex-1" title={project.title}>
            {project.title}
          </h3>
        </div>

        {/* Cover Image or Empty Placeholder */}
        <div className="w-full h-36 relative overflow-hidden bg-surface-2 border-b border-border">
          {displayUrl ? (
            <img
              src={displayUrl}
              alt={coverImg?.alt || project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 p-4 text-center bg-surface-2/60 text-fg-subtle select-none">
              <div className="w-8 h-8 rounded-full bg-surface-3 flex items-center justify-center text-fg-muted">
                <ImageIcon size={16} strokeWidth={1.5} />
              </div>
              <span className="text-[11px] font-medium text-fg-subtle">No screenshots uploaded</span>
            </div>
          )}
        </div>

        {/* Short Description & Tech Badges */}
        <div className="p-4 space-y-3">
          <p className="text-xs text-fg-muted leading-relaxed line-clamp-2 min-h-[2.5rem]" title={project.shortDescription}>
            {project.shortDescription || 'No description provided.'}
          </p>

          <div className="flex flex-wrap gap-1 min-h-[1.5rem] items-center">
            {visibleTech.map((tech, idx) => (
              <span
                key={`${project.id}-tech-${tech}-${idx}`}
                className="px-2 py-0.5 text-[10px] font-medium rounded border border-border bg-surface-2 text-fg-subtle"
              >
                {tech}
              </span>
            ))}
            {remainingTechCount > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-semibold rounded border border-border bg-surface-3 text-fg-muted">
                +{remainingTechCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Card Bottom Action Bar (Always 100% Identical Across All Cards) ── */}
      <div className="p-3 border-t border-border bg-surface-1/80 flex items-center justify-between gap-2 mt-auto">
        {/* Left: Live & GitHub links */}
        <div className="flex items-center gap-2 shrink-0">
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-brand hover:text-brand-hover transition-colors"
              title="View Live Demo"
            >
              <ExternalLink size={11} strokeWidth={2} />
              <span className="hidden xs:inline">Live</span>
            </a>
          ) : (
            <span className="text-[11px] text-fg-subtle/50 cursor-not-allowed inline-flex items-center gap-1">
              <ExternalLink size={11} strokeWidth={1.5} />
            </span>
          )}

          {project.githubUrl ? (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-fg-subtle hover:text-foreground transition-colors"
              title="View Source Code"
            >
              <GitBranch size={11} strokeWidth={2} />
              <span className="hidden xs:inline">Code</span>
            </a>
          ) : (
            <span className="text-[11px] text-fg-subtle/50 cursor-not-allowed inline-flex items-center gap-1">
              <GitBranch size={11} strokeWidth={1.5} />
            </span>
          )}
        </div>

        {/* Right: Identical Action Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <ItemToggleControls
            isVisible={project.isVisible}
            includeInResume={project.includeInResume}
            onToggleVisibility={onToggleVisibility}
            onToggleResume={onToggleResume}
            size="sm"
          />

          {/* Gallery Button */}
          <button
            type="button"
            onClick={onOpenGallery}
            className="p-1.5 rounded-md text-fg-subtle hover:text-foreground hover:bg-surface-2 transition-all"
            aria-label="Manage Project Gallery"
            title={`Manage Gallery (${project.screenshots?.length || 0} images)`}
          >
            <ImageIcon size={13} strokeWidth={1.75} />
          </button>

          {/* Edit Button */}
          <button
            type="button"
            onClick={onOpenEdit}
            className="p-1.5 rounded-md text-fg-subtle hover:text-foreground hover:bg-surface-2 transition-all"
            aria-label="Edit Project Details"
            title="Edit Project Details"
          >
            <Pencil size={13} strokeWidth={1.75} />
          </button>

          {/* Delete Button */}
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 rounded-md text-fg-subtle hover:text-[oklch(0.65_0.22_27)] hover:bg-[oklch(0.65_0.22_27_/_8%)] transition-all"
            aria-label="Delete Project"
            title="Delete Project"
          >
            <Trash2 size={13} strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  )
}
