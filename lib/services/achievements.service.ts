import { createClient } from '@/lib/supabase/client'
import type { Achievement } from '@/lib/types'
import { getOwnerId } from './owner'

export async function getAchievements(): Promise<Achievement[]> {
  const supabase = createClient()
  const ownerId = await getOwnerId()
  const { data, error } = await supabase
    .from('achievements')
    .select('*')
    .eq('profile_id', ownerId)
    .order('sort_order')

  if (error) throw new Error(`Failed to get achievements: ${error.message}`)

  return data.map((d: any) => ({
    id: d.id,
    title: d.title,
    description: d.description,
    date: d.date ?? undefined
  }))
}

export async function addAchievement(a: Omit<Achievement, 'id'>): Promise<Achievement> {
  const supabase = createClient()
  const ownerId = await getOwnerId()
  
  const { count, error: countError } = await supabase
    .from('achievements')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', ownerId)

  if (countError) throw new Error(`Failed to count achievements: ${countError.message}`)

  const { data, error } = await supabase
    .from('achievements')
    .insert({
      profile_id: ownerId,
      title: a.title,
      description: a.description,
      date: a.date,
      sort_order: count || 0
    })
    .select()
    .single()

  if (error) throw new Error(`Failed to add achievement: ${error.message}`)

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    date: data.date ?? undefined
  }
}

export async function updateAchievement(id: string, updates: Partial<Omit<Achievement, 'id'>>): Promise<void> {
  const supabase = createClient()
  const ownerId = await getOwnerId()
  
  const { error } = await supabase
    .from('achievements')
    .update({
      title: updates.title,
      description: updates.description,
      date: updates.date
    })
    .eq('id', id)
    .eq('profile_id', ownerId)

  if (error) throw new Error(`Failed to update achievement: ${error.message}`)
}

export async function deleteAchievement(id: string): Promise<void> {
  const supabase = createClient()
  const ownerId = await getOwnerId()
  
  const { error } = await supabase
    .from('achievements')
    .delete()
    .eq('id', id)
    .eq('profile_id', ownerId)

  if (error) throw new Error(`Failed to delete achievement: ${error.message}`)
}

export async function reorderAchievements(achievements: Achievement[]): Promise<void> {
  const supabase = createClient()
  const ownerId = await getOwnerId()

  const updates = achievements.map((a, index) =>
    supabase
      .from('achievements')
      .update({ sort_order: index })
      .eq('id', a.id)
      .eq('profile_id', ownerId)
  )

  const results = await Promise.all(updates)
  const error = results.find(r => r.error)?.error
  if (error) throw new Error(`Failed to reorder achievements: ${error.message}`)
}
