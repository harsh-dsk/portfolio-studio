import { createClient } from '@/lib/supabase/client'
import type { ResumeSettings } from '@/lib/types'
import { getOwnerId } from './owner'

export async function getResumeSettings(): Promise<ResumeSettings> {
  const supabase = createClient()
  const ownerId = await getOwnerId()
  const { data, error } = await supabase
    .from('resume_settings')
    .select('*')
    .eq('profile_id', ownerId)
    .maybeSingle()

  let savedAccent: any = 'blue'
  if (typeof window !== 'undefined') {
    savedAccent = localStorage.getItem('portfolio_accent_color') || 'blue'
  }

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to get resume settings: ${error.message}`)
  }

  if (!data) {
    return {
      selectedTemplate: 'modern',
      accentColor: savedAccent,
      resumeMode: 'dynamic',
      resumePdfUrl: null,
      resumeStoragePath: null,
      uploadedAt: null
    }
  }

  return {
    id: data.id,
    selectedTemplate: data.selected_template || 'modern',
    accentColor: savedAccent,
    resumeMode: (data.resume_mode as 'dynamic' | 'uploaded') || 'dynamic',
    resumePdfUrl: data.resume_pdf_url ?? null,
    resumeStoragePath: data.resume_storage_path ?? null,
    uploadedAt: data.uploaded_at ?? null,
  }
}

export async function upsertResumeSettings(updates: Partial<ResumeSettings>): Promise<void> {
  const supabase = createClient()
  const ownerId = await getOwnerId()

  if (updates.accentColor && typeof window !== 'undefined') {
    localStorage.setItem('portfolio_accent_color', updates.accentColor)
  }
  
  const payload: any = {
    profile_id: ownerId
  }

  if (updates.selectedTemplate !== undefined) payload.selected_template = updates.selectedTemplate
  if (updates.resumeMode !== undefined) payload.resume_mode = updates.resumeMode
  if (updates.resumePdfUrl !== undefined) payload.resume_pdf_url = updates.resumePdfUrl
  if (updates.resumeStoragePath !== undefined) payload.resume_storage_path = updates.resumeStoragePath
  if (updates.uploadedAt !== undefined) payload.uploaded_at = updates.uploadedAt

  const { error } = await supabase
    .from('resume_settings')
    .upsert(payload, { onConflict: 'profile_id' })

  if (error) throw new Error(`Failed to upsert resume settings: ${error.message}`)
}

export async function uploadResumePDF(file: File): Promise<{ publicUrl: string; storagePath: string }> {
  // 1. Validation
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
    throw new Error('Only PDF files are supported.')
  }

  const MAX_SIZE = 10 * 1024 * 1024 // 10MB
  if (file.size > MAX_SIZE) {
    throw new Error('PDF file size must not exceed 10 MB.')
  }

  const supabase = createClient()
  const ownerId = await getOwnerId()
  const storagePath = `resumes/${ownerId}_resume.pdf`

  // 2. Upload file to Supabase Storage bucket 'resume-files'
  const { error: uploadError } = await supabase.storage
    .from('resume-files')
    .upload(storagePath, file, { upsert: true, contentType: 'application/pdf' })

  if (uploadError) throw new Error(`Failed to upload PDF: ${uploadError.message}`)

  // 3. Get Public URL
  const { data } = supabase.storage
    .from('resume-files')
    .getPublicUrl(storagePath)

  const publicUrl = data.publicUrl
  const uploadedAt = new Date().toISOString()

  // 4. Update resume_settings in DB
  await upsertResumeSettings({
    resumeMode: 'uploaded',
    resumePdfUrl: publicUrl,
    resumeStoragePath: storagePath,
    uploadedAt,
  })

  return { publicUrl, storagePath }
}

export async function deleteResumePDF(): Promise<void> {
  const settings = await getResumeSettings()
  const supabase = createClient()

  if (settings.resumeStoragePath) {
    await supabase.storage
      .from('resume-files')
      .remove([settings.resumeStoragePath])
  }

  await upsertResumeSettings({
    resumeMode: 'dynamic',
    resumePdfUrl: null,
    resumeStoragePath: null,
    uploadedAt: null,
  })
}
