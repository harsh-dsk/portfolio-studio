/**
 * lib/services/portfolio.service.ts
 *
 * Server-side portfolio data fetcher.
 * Fetches all tables in parallel and assembles PortfolioData.
 * Used by Server Components (app/page.tsx, app/admin/layout.tsx).
 */
import { createClient } from '@/lib/supabase/server'
import type { PortfolioData } from '@/lib/types'
import { initialPortfolioData } from '@/lib/data/initial-data'

export async function getFullPortfolio(): Promise<PortfolioData> {
  const supabase = await createClient()

  // Deterministic Owner Resolution:
  const { data: { user } } = await supabase.auth.getUser()
  let ownerId = user?.id

  if (!ownerId && process.env.ADMIN_EMAIL) {
    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', process.env.ADMIN_EMAIL)
      .maybeSingle()

    ownerId = adminProfile?.id
  }

  if (!ownerId) {
    const { data: oldestProfile } = await supabase
      .from('profiles')
      .select('id')
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle()

    ownerId = oldestProfile?.id
  }

  if (!ownerId && process.env.NEXT_PUBLIC_PORTFOLIO_OWNER_ID) {
    ownerId = process.env.NEXT_PUBLIC_PORTFOLIO_OWNER_ID
  }

  if (!ownerId) {
    console.warn('[Portfolio] No owner profile found — using initial data.')
    return initialPortfolioData
  }

  const [profileRes, socialRes, eduRes, catRes, projectRes, achieveRes, extRes, resumeRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', ownerId).single(),
    supabase.from('social_links').select('*').eq('profile_id', ownerId).order('sort_order'),
    supabase.from('education').select('*').eq('profile_id', ownerId).order('sort_order'),
    supabase.from('skill_categories').select('*, skills(*)').eq('profile_id', ownerId).order('sort_order'),
    supabase.from('projects').select('*, project_images(*)').eq('profile_id', ownerId).order('sort_order'),
    supabase.from('achievements').select('*').eq('profile_id', ownerId).order('sort_order'),
    supabase.from('external_links').select('*').eq('profile_id', ownerId).order('sort_order'),
    supabase.from('resume_settings').select('*').eq('profile_id', ownerId).maybeSingle(),
  ])

  if (profileRes.error || !profileRes.data) {
    console.warn('[Portfolio] Profile not found for ID:', ownerId, '— using initial data.')
    return initialPortfolioData
  }

  const p = profileRes.data
  const profile = {
    name: p.name,
    title: p.title,
    photo: p.photo_url ?? null,
    phone: p.phone,
    email: p.email,
    location: p.location,
    college: p.college,
    objective: p.objective,
    availability: p.availability as any,
  }

  const socialLinks = (socialRes.data ?? []).map((l: any) => ({
    id: l.id,
    platform: l.platform,
    label: l.label,
    url: l.url,
    isVisible: l.is_visible ?? true,
    includeInResume: l.include_in_resume ?? true,
  }))

  const education = (eduRes.data ?? []).map((e: any) => ({
    id: e.id,
    institution: e.institution,
    degree: e.degree,
    field: e.field,
    period: e.period,
    location: e.location,
    gpa: e.gpa ?? undefined,
    coursework: e.coursework ?? undefined,
    description: e.description ?? undefined,
    isVisible: e.is_visible ?? true,
    includeInResume: e.include_in_resume ?? true,
  }))

  const skills = (catRes.data ?? []).map((c: any) => ({
    id: c.id,
    name: c.name,
    order: c.sort_order,
    isVisible: c.is_visible ?? true,
    includeInResume: c.include_in_resume ?? true,
    skills: (c.skills ?? [])
      .slice()
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((s: any) => s.name),
  }))

  const projects = (projectRes.data ?? []).map((proj: any) => {
    const screenshots = (proj.project_images ?? [])
      .slice()
      .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
      .map((img: any) => ({
        id: img.id,
        url: img.url || null,
        alt: img.alt_text,
        storagePath: img.storage_path ?? undefined,
        isCover: img.is_cover ?? false,
        sortOrder: img.sort_order ?? 0,
      }))

    const coverObj = screenshots.find((img: any) => img.isCover && img.url) || screenshots.find((img: any) => img.url)
    const coverImage = coverObj?.url ?? null

    return {
      id: proj.id,
      title: proj.title,
      shortDescription: proj.short_description,
      fullDescription: proj.full_description,
      techStack: proj.tech_stack ?? [],
      liveUrl: proj.live_url ?? undefined,
      githubUrl: proj.github_url ?? undefined,
      order: proj.sort_order,
      placeholder: {
        from: proj.placeholder_from,
        to: proj.placeholder_to,
        accent: proj.placeholder_accent,
      },
      screenshots,
      coverImage,
      isVisible: proj.is_visible ?? true,
      includeInResume: proj.include_in_resume ?? true,
    }
  })

  const achievements = (achieveRes.data ?? []).map((a: any) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    date: a.date ?? undefined,
    isVisible: a.is_visible ?? true,
    includeInResume: a.include_in_resume ?? true,
  }))

  const externalLinks = (extRes.data ?? []).map((l: any) => ({
    id: l.id,
    label: l.label,
    url: l.url,
    description: l.description ?? undefined,
    isVisible: l.is_visible ?? true,
    includeInResume: l.include_in_resume ?? true,
  }))

  const resumeSettings = resumeRes.data ? {
    id: resumeRes.data.id,
    selectedTemplate: resumeRes.data.selected_template || 'modern',
    resumeMode: (resumeRes.data.resume_mode as 'dynamic' | 'uploaded') || 'dynamic',
    resumePdfUrl: resumeRes.data.resume_pdf_url ?? null,
    resumeStoragePath: resumeRes.data.resume_storage_path ?? null,
    uploadedAt: resumeRes.data.uploaded_at ?? null,
  } : {
    selectedTemplate: 'modern',
    resumeMode: 'dynamic' as const,
    resumePdfUrl: null,
    resumeStoragePath: null,
    uploadedAt: null,
  }

  return {
    profile,
    socialLinks,
    education,
    skills,
    projects,
    achievements,
    externalLinks,
    resumeSettings,
    media: [],
  }
}
