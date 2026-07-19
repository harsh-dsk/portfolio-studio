import { createClient } from '@/lib/supabase/client'
import type { EducationEntry } from '@/lib/types'
import { getOwnerId } from './owner'

export async function getEducation(): Promise<EducationEntry[]> {
  const supabase = createClient()
  const ownerId = await getOwnerId()
  const { data, error } = await supabase
    .from('education')
    .select('*')
    .eq('profile_id', ownerId)
    .order('sort_order')

  if (error) throw new Error(`Failed to get education: ${error.message}`)

  return data.map((d: any) => ({
    id: d.id,
    institution: d.institution,
    degree: d.degree,
    field: d.field,
    period: d.period,
    location: d.location,
    gpa: d.gpa ?? undefined,
    coursework: d.coursework ?? undefined,
    description: d.description ?? undefined
  }))
}

export async function addEducation(entry: Omit<EducationEntry, 'id'>): Promise<EducationEntry> {
  const supabase = createClient()
  const ownerId = await getOwnerId()
  
  const { count, error: countError } = await supabase
    .from('education')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', ownerId)

  if (countError) throw new Error(`Failed to count education: ${countError.message}`)

  const { data, error } = await supabase
    .from('education')
    .insert({
      profile_id: ownerId,
      institution: entry.institution,
      degree: entry.degree,
      field: entry.field,
      period: entry.period,
      location: entry.location,
      gpa: entry.gpa,
      coursework: entry.coursework,
      description: entry.description,
      sort_order: count || 0
    })
    .select()
    .single()

  if (error) throw new Error(`Failed to add education: ${error.message}`)

  return {
    id: data.id,
    institution: data.institution,
    degree: data.degree,
    field: data.field,
    period: data.period,
    location: data.location,
    gpa: data.gpa ?? undefined,
    coursework: data.coursework ?? undefined,
    description: data.description ?? undefined
  }
}

export async function updateEducation(id: string, updates: Partial<Omit<EducationEntry, 'id'>>): Promise<void> {
  const supabase = createClient()
  const ownerId = await getOwnerId()
  
  const { error } = await supabase
    .from('education')
    .update({
      institution: updates.institution,
      degree: updates.degree,
      field: updates.field,
      period: updates.period,
      location: updates.location,
      gpa: updates.gpa,
      coursework: updates.coursework,
      description: updates.description
    })
    .eq('id', id)
    .eq('profile_id', ownerId)

  if (error) throw new Error(`Failed to update education: ${error.message}`)
}

export async function deleteEducation(id: string): Promise<void> {
  const supabase = createClient()
  const ownerId = await getOwnerId()
  
  const { error } = await supabase
    .from('education')
    .delete()
    .eq('id', id)
    .eq('profile_id', ownerId)

  if (error) throw new Error(`Failed to delete education: ${error.message}`)
}
