import { createClient } from '@/lib/supabase/client'
import type { ExternalLink } from '@/lib/types'
import { getOwnerId } from './owner'

export async function getExternalLinks(): Promise<ExternalLink[]> {
  const supabase = createClient()
  const ownerId = await getOwnerId()
  const { data, error } = await supabase
    .from('external_links')
    .select('*')
    .eq('profile_id', ownerId)
    .order('sort_order')

  if (error) throw new Error(`Failed to get external links: ${error.message}`)

  return data.map((d: any) => ({
    id: d.id,
    label: d.label,
    url: d.url,
    description: d.description ?? undefined
  }))
}

export async function addExternalLink(link: Omit<ExternalLink, 'id'>): Promise<ExternalLink> {
  const supabase = createClient()
  const ownerId = await getOwnerId()
  
  const { count, error: countError } = await supabase
    .from('external_links')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', ownerId)

  if (countError) throw new Error(`Failed to count external links: ${countError.message}`)

  const { data, error } = await supabase
    .from('external_links')
    .insert({
      profile_id: ownerId,
      label: link.label,
      url: link.url,
      description: link.description,
      sort_order: count || 0
    })
    .select()
    .single()

  if (error) throw new Error(`Failed to add external link: ${error.message}`)

  return {
    id: data.id,
    label: data.label,
    url: data.url,
    description: data.description ?? undefined
  }
}

export async function updateExternalLink(id: string, updates: Partial<Omit<ExternalLink, 'id'>>): Promise<void> {
  const supabase = createClient()
  const ownerId = await getOwnerId()
  
  const payload: any = {}
  if (updates.label !== undefined) payload.label = updates.label
  if (updates.url !== undefined) payload.url = updates.url
  if (updates.description !== undefined) payload.description = updates.description
  if (updates.isVisible !== undefined) payload.is_visible = updates.isVisible
  if (updates.includeInResume !== undefined) payload.include_in_resume = updates.includeInResume

  const { error } = await supabase
    .from('external_links')
    .update(payload)
    .eq('id', id)
    .eq('profile_id', ownerId)

  if (error) throw new Error(`Failed to update external link: ${error.message}`)
}

export async function deleteExternalLink(id: string): Promise<void> {
  const supabase = createClient()
  const ownerId = await getOwnerId()
  
  const { error } = await supabase
    .from('external_links')
    .delete()
    .eq('id', id)
    .eq('profile_id', ownerId)

  if (error) throw new Error(`Failed to delete external link: ${error.message}`)
}

export async function reorderExternalLinks(links: ExternalLink[]): Promise<void> {
  const supabase = createClient()
  const ownerId = await getOwnerId()

  const updates = links.map((link, index) =>
    supabase
      .from('external_links')
      .update({ sort_order: index })
      .eq('id', link.id)
      .eq('profile_id', ownerId)
  )

  const results = await Promise.all(updates)
  const error = results.find(r => r.error)?.error
  if (error) throw new Error(`Failed to reorder external links: ${error.message}`)
}
