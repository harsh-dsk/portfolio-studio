/**
 * lib/services/portfolio-client.service.ts
 *
 * Client-side portfolio data fetcher.
 * Uses browser Supabase client (no server-only next/headers).
 */
import { createClient } from '@/lib/supabase/client'
import type { PortfolioData } from '@/lib/types'
import { initialPortfolioData } from '@/lib/data/initial-data'
import { getOwnerId } from './owner'

export async function getFullPortfolioClient(): Promise<PortfolioData> {
  const supabase = createClient()
  const ownerId = await getOwnerId()

  const [profileRes, socialRes, eduRes, catRes, projectRes, achieveRes, extRes] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', ownerId).single(),
    supabase.from('social_links').select('*').eq('profile_id', ownerId).order('sort_order'),
    supabase.from('education').select('*').eq('profile_id', ownerId).order('sort_order'),
    supabase.from('skill_categories').select('*, skills(*)').eq('profile_id', ownerId).order('sort_order'),
    supabase.from('projects').select('*, project_images(*)').eq('profile_id', ownerId).order('sort_order'),
    supabase.from('achievements').select('*').eq('profile_id', ownerId).order('sort_order'),
    supabase.from('external_links').select('*').eq('profile_id', ownerId).order('sort_order'),
  ])

  if (profileRes.error || !profileRes.data) {
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
  }))

  const skills = (catRes.data ?? []).map((c: any) => ({
    id: c.id,
    name: c.name,
    order: c.sort_order,
    skills: (c.skills ?? [])
      .slice()
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((s: any) => s.name),
  }))

  const projects = (projectRes.data ?? []).map((proj: any) => ({
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
    screenshots: (proj.project_images ?? [])
      .slice()
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((img: any) => ({
        id: img.id,
        url: img.url || null,
        alt: img.alt_text,
      })),
  }))

  const achievements = (achieveRes.data ?? []).map((a: any) => ({
    id: a.id,
    title: a.title,
    description: a.description,
    date: a.date ?? undefined,
  }))

  const externalLinks = (extRes.data ?? []).map((l: any) => ({
    id: l.id,
    label: l.label,
    url: l.url,
    description: l.description ?? undefined,
  }))

  return {
    profile,
    socialLinks,
    education,
    skills,
    projects,
    achievements,
    externalLinks,
    media: [],
  }
}
