'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { usePortfolio } from '@/lib/context/PortfolioContext'
import type { Project, ProjectScreenshot } from '@/lib/types'
import { ProjectGrid } from '@/components/admin/projects/ProjectGrid'
import { ProjectEditorDialog } from '@/components/admin/projects/ProjectEditorDialog'
import { ProjectGalleryDialog } from '@/components/admin/projects/ProjectGalleryDialog'

export default function ProjectsPage() {
  const {
    data,
    addProject,
    updateProject,
    deleteProject,
    reorderProjects,
    toggleProjectVisibility,
    toggleProjectResume,
    setCoverImage,
    reorderProjectImages,
    deleteProjectImage,
    refreshData,
  } = usePortfolio()

  const projects = data.projects || []

  // Single modal state manager
  const [activeModal, setActiveModal] = useState<'editor' | 'gallery' | null>(null)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)

  // Resolve currently active project for modal dialogs
  const selectedProject = selectedProjectId
    ? projects.find((p) => p.id === selectedProjectId) || null
    : null

  const handleOpenAdd = () => {
    setSelectedProjectId(null)
    setActiveModal('editor')
  }

  const handleOpenEdit = (project: Project) => {
    setSelectedProjectId(project.id)
    setActiveModal('editor')
  }

  const handleOpenGallery = (project: Project) => {
    setSelectedProjectId(project.id)
    setActiveModal('gallery')
  }

  const handleCloseModal = () => {
    setActiveModal(null)
    setSelectedProjectId(null)
  }

  const handleSaveProject = (updates: Partial<Project>) => {
    if (selectedProjectId) {
      updateProject(selectedProjectId, updates)
    } else {
      addProject({
        title: updates.title || '',
        shortDescription: updates.shortDescription || '',
        fullDescription: updates.fullDescription || '',
        techStack: updates.techStack || [],
        githubUrl: updates.githubUrl,
        liveUrl: updates.liveUrl,
        placeholder: {
          from: 'oklch(0.15 0.04 250)',
          to: 'oklch(0.11 0.03 270)',
          accent: 'oklch(0.63 0.19 251)',
        },
        screenshots: [],
        isVisible: updates.isVisible,
        includeInResume: updates.includeInResume,
      })
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Manage your portfolio projects, case studies, image galleries, and visibility controls."
        action={{
          label: 'Add Project',
          icon: <Plus size={14} strokeWidth={2} />,
          onClick: handleOpenAdd,
        }}
      />

      {/* ── Projects Grid ── */}
      <ProjectGrid
        projects={projects}
        onReorder={reorderProjects}
        onOpenEdit={handleOpenEdit}
        onOpenGallery={handleOpenGallery}
        onDelete={deleteProject}
        onToggleVisibility={toggleProjectVisibility}
        onToggleResume={toggleProjectResume}
      />

      {/* ── Project Editor Dialog ── */}
      <ProjectEditorDialog
        isOpen={activeModal === 'editor'}
        project={selectedProject}
        onClose={handleCloseModal}
        onSave={handleSaveProject}
      />

      {/* ── Project Gallery Dialog ── */}
      <ProjectGalleryDialog
        isOpen={activeModal === 'gallery'}
        project={selectedProject}
        onClose={handleCloseModal}
        onSetCover={(imageId) => setCoverImage(selectedProject!.id, imageId)}
        onReorder={(images: ProjectScreenshot[]) =>
          reorderProjectImages(selectedProject!.id, images)
        }
        onDelete={(imageId, storagePath) =>
          deleteProjectImage(selectedProject!.id, imageId, storagePath)
        }
        onRefresh={refreshData}
      />
    </div>
  )
}
