'use client'

import React, { useState } from 'react'
import { Star, Trash2, Upload, Loader2, Image as ImageIcon } from 'lucide-react'
import { SortableList, SortableItem, SortableHandle } from '@/components/admin/SortableList'
import type { ProjectScreenshot } from '@/lib/types'
import { uploadProjectImage, addProjectImage } from '@/lib/services/projects.service'

interface ProjectImageManagerProps {
  projectId: string
  screenshots: ProjectScreenshot[]
  onSetCover: (imageId: string) => Promise<void>
  onReorder: (images: ProjectScreenshot[]) => Promise<void>
  onDelete: (imageId: string, storagePath?: string) => Promise<void>
  onImageUploaded: (newScreenshot: ProjectScreenshot) => void
}

export function ProjectImageManager({
  projectId,
  screenshots,
  onSetCover,
  onReorder,
  onDelete,
  onImageUploaded,
}: ProjectImageManagerProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setError(null)

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const { publicUrl, storagePath } = await uploadProjectImage(file, projectId)
        const isFirstImage = screenshots.length === 0 && i === 0
        const newScreenshot = await addProjectImage(
          projectId,
          publicUrl,
          file.name,
          screenshots.length + i,
          storagePath,
          isFirstImage
        )
        onImageUploaded(newScreenshot)
      }
    } catch (err: any) {
      console.error('[ProjectImageManager] Upload failed:', err)
      setError(err.message || 'Failed to upload image')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <ImageIcon size={13} strokeWidth={2} />
          Project Gallery ({screenshots.length} image{screenshots.length !== 1 ? 's' : ''})
        </label>
        <label
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-surface-2 text-foreground hover:bg-surface-3 transition-colors cursor-pointer ${
            uploading ? 'opacity-50 pointer-events-none' : ''
          }`}
        >
          {uploading ? (
            <Loader2 size={13} className="animate-spin text-brand" />
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
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {screenshots.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-fg-subtle">
          No project screenshots uploaded yet. Click "+ Upload Images" above.
        </div>
      ) : (
        <SortableList
          items={screenshots}
          onReorder={(newItems) => onReorder(newItems)}
          className="grid grid-cols-2 sm:grid-cols-3 gap-3"
        >
          {screenshots.map((img) => (
            <SortableItem
              key={img.id}
              id={img.id}
              className={`group relative rounded-lg border bg-surface-1 overflow-hidden transition-all ${
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

                {/* Cover badge */}
                {img.isCover && (
                  <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500 text-black flex items-center gap-1 shadow">
                    <Star size={10} fill="currentColor" /> Cover
                  </span>
                )}

                {/* Drag handle overlay */}
                <div className="absolute top-1.5 right-1.5 opacity-80 hover:opacity-100 transition-opacity">
                  <SortableHandle />
                </div>
              </div>

              {/* Card action footer */}
              <div className="flex items-center justify-between p-2 text-xs border-t border-border bg-surface-1">
                <button
                  type="button"
                  onClick={() => onSetCover(img.id)}
                  title={img.isCover ? 'Currently Cover Image' : 'Set as Cover Image'}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                    img.isCover
                      ? 'text-amber-400 font-semibold cursor-default'
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
                  className="p-1 rounded text-fg-subtle hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </SortableItem>
          ))}
        </SortableList>
      )}
    </div>
  )
}
