'use client'

import { useState, useEffect } from 'react'
import { AlignLeft, Columns, PanelLeft, Download, Cpu, CheckCircle, Upload, FileText, Trash2, ExternalLink, Loader2 } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { usePortfolio } from '@/lib/context/PortfolioContext'
import { getResumeSettings, upsertResumeSettings, uploadResumePDF, deleteResumePDF } from '@/lib/services/resume.service'
import { PrintableResume } from '@/components/admin/PrintableResume'
import { AccentColorPicker } from '@/components/ui/AccentColorPicker'
import type { ResumeSettings, AccentColor } from '@/lib/types'

/* ── Resume template definitions ── */
const TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Sidebar layout with accent colour. Great for tech roles.',
    icon: PanelLeft,
    preview: {
      sidebar: true,
      accent: 'oklch(0.63 0.19 251)',
    },
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional two-column layout. Universally accepted.',
    icon: Columns,
    preview: {
      sidebar: false,
      accent: 'oklch(0.70 0.15 200)',
    },
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean single column. Let your content do the talking.',
    icon: AlignLeft,
    preview: {
      sidebar: false,
      accent: 'oklch(0.72 0.17 155)',
    },
  },
] as const

/* ── Micro resume preview ── */
function TemplateMiniPreview({
  template,
}: {
  template: (typeof TEMPLATES)[number]
}) {
  const { accent, sidebar } = template.preview
  return (
    <div
      className="w-full h-24 rounded-lg overflow-hidden border border-border"
      style={{ background: 'var(--ds-bg)' }}
    >
      <div className="flex h-full">
        {/* Sidebar column */}
        {sidebar && (
          <div
            className="w-10 h-full flex flex-col gap-1.5 px-1.5 py-2"
            style={{ background: accent.replace(')', ' / 15%)') }}
          >
            <div className="w-7 h-7 rounded-full mx-auto" style={{ background: accent.replace(')', ' / 40%)') }} />
            {[60, 70, 50].map((w, i) => (
              <div key={i} className="h-1 rounded-full" style={{ width: `${w}%`, background: accent.replace(')', ' / 30%)') }} />
            ))}
          </div>
        )}
        {/* Main content */}
        <div className="flex-1 p-2 flex flex-col gap-1.5">
          {!sidebar && <div className="h-2 w-14 rounded-full" style={{ background: accent.replace(')', ' / 60%)') }} />}
          {[90, 70, 80, 55, 65].map((w, i) => (
            <div key={i} className="h-1 rounded-full" style={{ width: `${w}%`, background: 'var(--ds-surface-2)' }} />
          ))}
          <div className="h-px my-0.5" style={{ background: 'var(--ds-border)' }} />
          {[75, 60].map((w, i) => (
            <div key={i} className="h-1 rounded-full" style={{ width: `${w}%`, background: 'var(--ds-surface-2)' }} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ResumePage() {
  const { data, updateResumeSettings: updateSettingsInContext } = usePortfolio()
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern')
  const [resumeMode, setResumeMode] = useState<'dynamic' | 'uploaded'>('dynamic')
  const [resumePdfUrl, setResumePdfUrl] = useState<string | null>(null)
  const [uploadedAt, setUploadedAt] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    getResumeSettings()
      .then((settings) => {
        if (settings?.selectedTemplate && settings.selectedTemplate !== 'default') {
          setSelectedTemplate(settings.selectedTemplate)
        }
        if (settings?.resumeMode) {
          setResumeMode(settings.resumeMode)
        }
        if (settings?.resumePdfUrl) {
          setResumePdfUrl(settings.resumePdfUrl)
        }
        if (settings?.uploadedAt) {
          setUploadedAt(settings.uploadedAt)
        }
      })
      .catch(console.error)
  }, [])

  const name = data.profile.name
  const projectCount = data.projects.length
  const skillCount = data.skills.reduce((n, c) => n + c.skills.length, 0)

  const handleTemplateSelect = (id: string) => {
    setSelectedTemplate(id)
    updateSettingsInContext({ selectedTemplate: id })
  }

  const handleModeSelect = (mode: 'dynamic' | 'uploaded') => {
    setResumeMode(mode)
    updateSettingsInContext({ resumeMode: mode })
  }

  const handleGenerateResume = () => {
    setIsGenerating(true)
    setTimeout(() => {
      window.print()
      setIsGenerating(false)
    }, 150)
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadError(null)

    try {
      const { publicUrl } = await uploadResumePDF(file)
      setResumePdfUrl(publicUrl)
      const now = new Date().toISOString()
      setUploadedAt(now)
      setResumeMode('uploaded')
      await updateSettingsInContext({
        resumeMode: 'uploaded',
        resumePdfUrl: publicUrl,
        uploadedAt: now,
      })
    } catch (err: any) {
      console.error('[ResumePage] PDF upload error:', err)
      setUploadError(err.message || 'Failed to upload PDF resume.')
    } finally {
      setIsUploading(false)
      e.target.value = ''
    }
  }

  const handleDeleteUploadedPdf = async () => {
    try {
      await deleteResumePDF()
      setResumePdfUrl(null)
      setUploadedAt(null)
      setResumeMode('dynamic')
      await updateSettingsInContext({
        resumeMode: 'dynamic',
        resumePdfUrl: null,
        uploadedAt: null,
      })
    } catch (err: any) {
      console.error('[ResumePage] Delete PDF error:', err)
      setUploadError(err.message || 'Failed to delete PDF resume.')
    }
  }

  return (
    <>
      {/* Printable Resume Component */}
      <PrintableResume data={data} template={selectedTemplate} />

      <div className="max-w-4xl space-y-6">
        <PageHeader
          title="Resume Settings"
          description="Choose between dynamic template generation or upload your custom PDF resume."
        />

        {/* ── Data summary ── */}
        <div
          className="flex flex-wrap gap-6 px-5 py-4 rounded-xl border text-sm"
          style={{ borderColor: 'var(--ds-border)', background: 'var(--ds-surface-1)' }}
        >
          <div>
            <p className="text-xs text-fg-subtle uppercase tracking-[0.08em]">Projects</p>
            <p className="text-lg font-semibold text-foreground tabular-nums">{projectCount}</p>
          </div>
          <div>
            <p className="text-xs text-fg-subtle uppercase tracking-[0.08em]">Skills</p>
            <p className="text-lg font-semibold text-foreground tabular-nums">{skillCount}</p>
          </div>
          <div>
            <p className="text-xs text-fg-subtle uppercase tracking-[0.08em]">Education</p>
            <p className="text-lg font-semibold text-foreground tabular-nums">{data.education.length}</p>
          </div>
          <div>
            <p className="text-xs text-fg-subtle uppercase tracking-[0.08em]">Achievements</p>
            <p className="text-lg font-semibold text-foreground tabular-nums">{data.achievements.length}</p>
          </div>
          <div className="ml-auto self-center">
            <p className="text-xs text-fg-subtle">Resume for:</p>
            <p className="text-sm font-medium text-foreground">{name}</p>
          </div>
        </div>

        {/* ── Resume Source Selection (Dynamic vs Uploaded) ── */}
        <div className="rounded-xl border border-border bg-surface-1 p-5 space-y-4">
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-fg-subtle">
            Resume Source
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label
              onClick={() => handleModeSelect('dynamic')}
              className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                resumeMode === 'dynamic'
                  ? 'border-brand bg-brand/5 ring-1 ring-brand/30'
                  : 'border-border bg-surface-1 hover:bg-surface-2'
              }`}
            >
              <input
                type="radio"
                name="resumeMode"
                checked={resumeMode === 'dynamic'}
                onChange={() => handleModeSelect('dynamic')}
                className="mt-1 accent-brand"
              />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">Dynamic Resume</p>
                <p className="text-xs text-fg-muted leading-relaxed">
                  Generated automatically from your live portfolio data using customizable templates.
                </p>
              </div>
            </label>

            <label
              onClick={() => handleModeSelect('uploaded')}
              className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                resumeMode === 'uploaded'
                  ? 'border-brand bg-brand/5 ring-1 ring-brand/30'
                  : 'border-border bg-surface-1 hover:bg-surface-2'
              }`}
            >
              <input
                type="radio"
                name="resumeMode"
                checked={resumeMode === 'uploaded'}
                onChange={() => handleModeSelect('uploaded')}
                className="mt-1 accent-brand"
              />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">Uploaded Resume</p>
                <p className="text-xs text-fg-muted leading-relaxed">
                  Upload a custom PDF file to serve directly when visitors click "Resume" on your website.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* ── Mode Specific Content ── */}
        {resumeMode === 'uploaded' ? (
          <div className="rounded-xl border border-border bg-surface-1 p-6 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Uploaded PDF Resume</h3>
              <p className="text-xs text-fg-muted mt-0.5">
                Upload a custom PDF resume (max 10 MB). Public website visitors will download this file directly.
              </p>
            </div>

            {uploadError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
                {uploadError}
              </div>
            )}

            {resumePdfUrl ? (
              <div className="p-4 rounded-xl border border-border bg-surface-2 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center shrink-0">
                      <FileText size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">Custom_Resume.pdf</p>
                      {uploadedAt && (
                        <p className="text-xs text-fg-subtle">
                          Uploaded: {new Date(uploadedAt).toLocaleDateString()} at {new Date(uploadedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={resumePdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-surface-3 transition-colors flex items-center gap-1.5"
                    >
                      <ExternalLink size={13} /> View / Download
                    </a>
                    <button
                      onClick={handleDeleteUploadedPdf}
                      className="p-1.5 rounded-lg text-fg-subtle hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete custom PDF"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-brand text-brand-fg hover:bg-brand-hover transition-colors cursor-pointer">
                    {isUploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                    <span>Replace PDF</span>
                    <input type="file" accept="application/pdf" className="sr-only" onChange={handleFileUpload} disabled={isUploading} />
                  </label>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 rounded-xl border border-dashed border-border text-center space-y-4">
                <div className="w-12 h-12 rounded-xl bg-surface-2 flex items-center justify-center text-fg-muted">
                  <Upload size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">No custom PDF uploaded</p>
                  <p className="text-xs text-fg-subtle max-w-xs">
                    Select a PDF file from your computer (maximum size 10 MB).
                  </p>
                </div>
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold bg-brand text-brand-fg hover:bg-brand-hover transition-colors cursor-pointer">
                  {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  <span>{isUploading ? 'Uploading...' : 'Upload PDF Resume'}</span>
                  <input type="file" accept="application/pdf" className="sr-only" onChange={handleFileUpload} disabled={isUploading} />
                </label>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
            {/* ── Template selection ── */}
            <div className="space-y-5">
              <div className="rounded-xl border border-border bg-surface-1 p-5 mb-4">
                <AccentColorPicker
                  value={(data.resumeSettings?.accentColor as AccentColor) || 'blue'}
                  onChange={(color) => updateSettingsInContext({ accentColor: color })}
                />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.1em] text-fg-subtle mb-3">
                  Select Template
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {TEMPLATES.map((t) => {
                    const selected = selectedTemplate === t.id
                    return (
                      <button
                        key={t.id}
                        onClick={() => handleTemplateSelect(t.id)}
                        className="rounded-xl border p-3 text-left transition-all duration-150 space-y-3"
                        style={{
                          borderColor: selected ? t.preview.accent : 'var(--ds-border)',
                          background: selected ? t.preview.accent.replace(')', ' / 8%)') : 'var(--ds-surface-1)',
                          boxShadow: selected ? `0 0 0 1px ${t.preview.accent.replace(')', ' / 30%)')}` : 'none',
                        }}
                      >
                        <TemplateMiniPreview template={t} />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-semibold text-foreground">{t.name}</p>
                            {selected && <CheckCircle size={13} strokeWidth={2} style={{ color: t.preview.accent }} />}
                          </div>
                          <p className="text-[11px] text-fg-subtle leading-relaxed mt-0.5">{t.description}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* ── Preview panel ── */}
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.1em] text-fg-subtle mb-3">
                  Preview
                </p>
                <div className="rounded-xl border border-border bg-surface-1 flex flex-col items-center justify-center gap-4 py-16 px-6">
                  {selectedTemplate ? (
                    <>
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: 'oklch(0.63 0.19 251 / 10%)' }}
                      >
                        <Cpu size={22} strokeWidth={1.5} className="text-brand" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground">
                          {TEMPLATES.find((t) => t.id === selectedTemplate)?.name} template selected
                        </p>
                        <p className="text-xs text-fg-subtle mt-1 max-w-xs">
                          Click Generate Resume to open the print dialog. Save as PDF to download.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--ds-surface-2)' }}>
                        <AlignLeft size={22} strokeWidth={1.5} className="text-fg-muted" />
                      </div>
                      <p className="text-sm text-fg-subtle text-center">Select a template above to enable preview.</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* ── Actions sidebar ── */}
            <div className="space-y-4">
              <p className="text-xs font-medium uppercase tracking-[0.1em] text-fg-subtle">Export</p>

              {/* Generate */}
              <div className="rounded-xl border border-border bg-surface-1 p-5 space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">Generate PDF</p>
                  <p className="text-xs text-fg-muted">Compile your portfolio data into a formatted PDF resume.</p>
                </div>
                <button
                  disabled={!selectedTemplate || isGenerating}
                  onClick={handleGenerateResume}
                  className="w-full h-9 flex items-center justify-center gap-2 text-sm font-medium rounded-lg bg-brand text-brand-fg transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-brand-hover"
                >
                  <Cpu size={14} strokeWidth={1.75} />
                  {isGenerating ? 'Preparing Print...' : selectedTemplate ? 'Generate Resume' : 'Select a template first'}
                </button>
                <p className="text-[11px] text-fg-subtle text-center">Opens the print dialog. Save as PDF to download.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
