'use client'

import React, { useState } from 'react'
import { X, Upload, Loader2, Star, Trash2, Image as ImageIcon } from 'lucide-react'
import { SortableList, SortableItem, SortableHandle } from '@/components/admin/SortableList'
import type { Project, ProjectScreenshot } from '@/lib/types'
import { uploadProjectImage, addProjectImage } from '@/lib/services/projects.service'

interface ProjectGalleryDialogProps {
  isOpen: boolean
  project: Project | null
  onClose: () => void
  onSetCover: (imageId: string) => Promise<void>
  onReorder: (images: ProjectScreenshot[]) => Promise<void>
  onDelete: (imageId: string, storagePath?: string) => Promise<void>
  onRefresh: () => void
}

export function ProjectGalleryDialog({
  isOpen,
  project,
  onClose,
  onSetCover,
  onReorder,
  onDelete,
  onRefresh,
}: ProjectGalleryDialogProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen || !project) return null

  const screenshots = project.screenshots || []

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setError(null)

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const { publicUrl, storagePath } = await uploadProjectImage(file, project.id)
        const isFirstImage = screenshots.length === 0 && i === 0
        await addProjectImage(
          project.id,
          publicUrl,
          file.name,
          screenshots.length + i,
          storagePath,
          isFirstImage
        )
      }
      onRefresh()
    } catch (err: any) {
      console.error('[ProjectGalleryDialog] Upload error:', err)
      setError(err.message || 'Failed to upload images')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl border border-border bg-surface-1 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="gallery-dialog-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface-1">
          <div>
            <h2 id="gallery-dialog-title" className="text-base font-semibold text-foreground">
              Project Gallery
            </h2>
            <p className="text-xs text-fg-subtle truncate max-w-md">
              {project.title} — {screenshots.length} screenshot{screenshots.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-brand text-brand-fg hover:bg-brand-hover transition-colors cursor-pointer ${
                uploading ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              {uploading ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Upload size={13} strokeWidth={2} />
              )}
              <span>{uploading ? 'Uploading...' : '+ Upload Images'}</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={handleFileChange}
                disabled={uploading}
              />
            </label>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-fg-subtle hover:text-foreground hover:bg-surface-2 transition-colors"
              aria-label="Close gallery dialog"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
              {error}
            </div>
          )}

          {screenshots.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border space-y-3 bg-surface-2/30">
              <div className="w-12 h-12 rounded-xl bg-surface-3 flex items-center justify-center text-fg-muted">
                <ImageIcon size={24} strokeWidth={1.5} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">No screenshots uploaded</p>
                <p className="text-xs text-fg-subtle max-w-xs">
                  Upload screenshots to display a visual gallery and cover image for this project.
                </p>
              </div>
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-brand text-brand-fg hover:bg-brand-hover transition-colors cursor-pointer">
                <Upload size={14} />
                <span>Upload Screenshots</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
              </label>
            </div>
          ) : (
            <SortableList
              items={screenshots}
              onReorder={(newItems) => onReorder(newItems)}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {screenshots.map((img, idx) => (
                <SortableItem
                  key={`${project.id}-img-${img.id}-${idx}`}
                  id={img.id}
                  className={`group relative rounded-xl border bg-surface-1 overflow-hidden transition-all ${
                    img.isCover ? 'border-amber-500/50 ring-1 ring-amber-500/30' : 'border-border'
                  }`}
                >
                  <div className="aspect-video relative w-full overflow-hidden bg-black/10">
                    {img.url ? (
                      <img
                        src={img.url}
                        alt={img.alt || 'Project screenshot'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-fg-subtle text-xs">
                        No image URL
                      </div>
                    )}

                    {/* Cover Badge */}
                    {img.isCover && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500 text-black flex items-center gap-1 shadow-md">
                        <Star size={10} fill="currentColor" /> Cover
                      </span>
                    )}

                    {/* Drag Handle Overlay */}
                    <div className="absolute top-2 right-2 bg-black/40 rounded p-1 text-white backdrop-blur-sm">
                      <SortableHandle />
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="flex items-center justify-between p-2.5 text-xs border-t border-border bg-surface-1">
                    <button
                      type="button"
                      onClick={() => onSetCover(img.id)}
                      title={img.isCover ? 'Currently Cover Image' : 'Set as Cover Image'}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                        img.isCover
                          ? 'text-amber-400 font-semibold cursor-default bg-amber-500/10'
                          : 'text-fg-subtle hover:text-foreground hover:bg-surface-2'
                      }`}
                    >
                      <Star size={11} fill={img.isCover ? 'currentColor' : 'none'} />
                      <span>{img.isCover ? 'Cover' : 'Set Cover'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(img.id, img.storagePath)}
                      title="Delete image"
                      className="p-1.5 rounded-lg text-fg-subtle hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </SortableItem>
              ))}
            </SortableList>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-border bg-surface-1/50 text-xs text-fg-subtle">
          <span>Drag cards to reorder image gallery display.</span>
          <button
            type="button"
            onClick={onClose}
            className="h-8 px-4 font-medium rounded-lg border border-border text-foreground hover:bg-surface-2 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
