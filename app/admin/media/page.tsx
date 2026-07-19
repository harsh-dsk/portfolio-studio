'use client'

import { useEffect, useState } from 'react'
import { Upload, Copy, Check, Image as ImageIcon, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { createClient } from '@/lib/supabase/client'

interface StorageFile {
  name: string
  bucket: string
  url: string
  size?: number
}

export default function MediaPage() {
  const [files, setFiles] = useState<StorageFile[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)
  const [activeBucket, setActiveBucket] = useState<'profile-images' | 'project-images'>('project-images')

  const supabase = createClient()

  const loadFiles = async () => {
    setLoading(true)
    const { data, error } = await supabase.storage.from(activeBucket).list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } })
    if (!error && data) {
      const mapped = data
        .filter(f => f.name !== '.emptyFolderPlaceholder')
        .map(f => ({
          name: f.name,
          bucket: activeBucket,
          url: supabase.storage.from(activeBucket).getPublicUrl(f.name).data.publicUrl,
          size: f.metadata?.size,
        }))
      setFiles(mapped)
    }
    setLoading(false)
  }

  useEffect(() => { loadFiles() }, [activeBucket])

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const path = `${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from(activeBucket).upload(path, file)
    if (!error) await loadFiles()
    setUploading(false)
  }

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url)
    setCopiedUrl(url)
    setTimeout(() => setCopiedUrl(null), 2000)
  }

  const deleteFile = async (name: string) => {
    await supabase.storage.from(activeBucket).remove([name])
    await loadFiles()
  }

  const formatBytes = (bytes?: number) => {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  }

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader
        title="Media Library"
        description="Upload and manage images stored in Supabase Storage."
      />

      {/* Bucket tabs + Upload */}
      <div className="flex items-center gap-3 flex-wrap">
        {(['project-images', 'profile-images'] as const).map(bucket => (
          <button
            key={bucket}
            onClick={() => setActiveBucket(bucket)}
            className="h-8 px-4 text-xs font-medium rounded-lg border transition-all duration-150"
            style={{
              borderColor: activeBucket === bucket ? 'oklch(0.63 0.19 251)' : 'var(--ds-border)',
              background: activeBucket === bucket ? 'oklch(0.63 0.19 251 / 10%)' : 'var(--ds-surface-1)',
              color: activeBucket === bucket ? 'oklch(0.63 0.19 251)' : 'var(--ds-fg-muted)',
            }}
          >
            {bucket}
          </button>
        ))}
        <label className="ml-auto inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-lg border border-border text-fg-muted bg-surface-2 hover:border-border-hover hover:text-foreground transition-all cursor-pointer">
          <Upload size={12} strokeWidth={1.75} />
          {uploading ? 'Uploading…' : 'Upload File'}
          <input type="file" accept="image/*" className="sr-only" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      {/* File grid */}
      {loading ? (
        <div className="py-12 text-center text-sm text-fg-subtle">Loading…</div>
      ) : files.length === 0 ? (
        <div className="py-16 rounded-xl border border-dashed border-border flex flex-col items-center gap-3">
          <ImageIcon size={32} strokeWidth={1} className="text-fg-subtle" />
          <p className="text-sm text-fg-subtle">No files in this bucket yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {files.map(file => (
            <div key={file.name} className="rounded-xl border border-border bg-surface-1 overflow-hidden group">
              <div className="aspect-square bg-surface-2 relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={file.url} alt={file.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-2.5 space-y-2">
                <p className="text-[11px] text-fg-muted truncate" title={file.name}>{file.name}</p>
                {file.size && <p className="text-[10px] text-fg-subtle">{formatBytes(file.size)}</p>}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => copyUrl(file.url)}
                    className="flex-1 h-6 flex items-center justify-center gap-1 text-[10px] rounded-md border border-border text-fg-subtle hover:text-foreground hover:border-border-hover transition-all"
                    title="Copy URL"
                  >
                    {copiedUrl === file.url ? <Check size={9} strokeWidth={2.5} /> : <Copy size={9} strokeWidth={1.75} />}
                    {copiedUrl === file.url ? 'Copied' : 'Copy URL'}
                  </button>
                  <button
                    onClick={() => deleteFile(file.name)}
                    className="h-6 w-6 flex items-center justify-center rounded-md text-fg-subtle hover:text-[oklch(0.65_0.22_27)] hover:bg-[oklch(0.65_0.22_27_/_8%)] transition-all"
                    title="Delete"
                  >
                    <Trash2 size={10} strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
