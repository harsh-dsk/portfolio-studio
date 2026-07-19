import { createClient } from '@/lib/supabase/client'
import type { SkillCategory } from '@/lib/types'
import { getOwnerId } from './owner'

export async function getSkillCategories(): Promise<SkillCategory[]> {
  const supabase = createClient()
  const ownerId = await getOwnerId()
  const { data, error } = await supabase
    .from('skill_categories')
    .select('*, skills(*)')
    .eq('profile_id', ownerId)
    .order('sort_order')

  if (error) throw new Error(`Failed to get skill categories: ${error.message}`)

  return data.map((d: any) => ({
    id: d.id,
    name: d.name,
    order: d.sort_order,
    skills: (d.skills || [])
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((s: any) => s.name)
  }))
}

export async function addSkillCategory(profileId: string, name: string): Promise<SkillCategory> {
  const supabase = createClient()
  const targetId = profileId || await getOwnerId()
  
  const { count, error: countError } = await supabase
    .from('skill_categories')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', targetId)

  if (countError) throw new Error(`Failed to count skill categories: ${countError.message}`)

  const { data, error } = await supabase
    .from('skill_categories')
    .insert({
      profile_id: targetId,
      name,
      sort_order: count || 0
    })
    .select()
    .single()

  if (error) throw new Error(`Failed to add skill category: ${error.message}`)

  return {
    id: data.id,
    name: data.name,
    order: data.sort_order,
    skills: []
  }
}

export async function renameSkillCategory(id: string, name: string): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('skill_categories')
    .update({ name })
    .eq('id', id)

  if (error) throw new Error(`Failed to rename skill category: ${error.message}`)
}

export async function deleteSkillCategory(id: string): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('skill_categories')
    .delete()
    .eq('id', id)

  if (error) throw new Error(`Failed to delete skill category: ${error.message}`)
}

export async function reorderSkillCategories(categories: SkillCategory[]): Promise<void> {
  const supabase = createClient()
  
  const updates = categories.map((cat, index) => 
    supabase
      .from('skill_categories')
      .update({ sort_order: index })
      .eq('id', cat.id)
  )

  const results = await Promise.all(updates)
  const error = results.find(r => r.error)?.error
  if (error) throw new Error(`Failed to reorder skill categories: ${error.message}`)
}

export async function addSkill(categoryId: string, name: string): Promise<void> {
  const supabase = createClient()
  
  const { count, error: countError } = await supabase
    .from('skills')
    .select('*', { count: 'exact', head: true })
    .eq('category_id', categoryId)

  if (countError) throw new Error(`Failed to count skills: ${countError.message}`)

  const { error } = await supabase
    .from('skills')
    .insert({
      category_id: categoryId,
      name,
      sort_order: count || 0
    })

  if (error) throw new Error(`Failed to add skill: ${error.message}`)
}

export async function removeSkill(categoryId: string, skillName: string): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('skills')
    .delete()
    .eq('category_id', categoryId)
    .eq('name', skillName)

  if (error) throw new Error(`Failed to remove skill: ${error.message}`)
}

export async function reorderSkillsInCategory(categoryId: string, skillNames: string[]): Promise<void> {
  const supabase = createClient()
  
  const updates = skillNames.map((name, index) => 
    supabase
      .from('skills')
      .update({ sort_order: index })
      .eq('category_id', categoryId)
      .eq('name', name)
  )

  const results = await Promise.all(updates)
  const error = results.find(r => r.error)?.error
  if (error) throw new Error(`Failed to reorder skills: ${error.message}`)
}
