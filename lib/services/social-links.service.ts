import { createClient } from '@/lib/supabase/client'
import type { SocialLink } from '@/lib/types'
import { getOwnerId } from './owner'

export async function getSocialLinks(): Promise<SocialLink[]> {
  const supabase = createClient()
  const ownerId = await getOwnerId()
  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .eq('profile_id', ownerId)
    .order('sort_order')

  if (error) throw new Error(`Failed to get social links: ${error.message}`)

  return data.map((d: any) => ({
    id: d.id,
    platform: d.platform,
    label: d.label,
    url: d.url
  }))
}

export async function addSocialLink(link: Omit<SocialLink, 'id'>): Promise<SocialLink> {
  const supabase = createClient()
  const ownerId = await getOwnerId()
  
  const { count, error: countError } = await supabase
    .from('social_links')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', ownerId)

  if (countError) throw new Error(`Failed to count links: ${countError.message}`)

  const { data, error } = await supabase
    .from('social_links')
    .insert({
      profile_id: ownerId,
      platform: link.platform,
      label: link.label,
      url: link.url,
      sort_order: count || 0
    })
    .select()
    .single()

  if (error) throw new Error(`Failed to add social link: ${error.message}`)

  return {
    id: data.id,
    platform: data.platform,
    label: data.label,
    url: data.url
  }
}

export async function updateSocialLink(id: string, updates: Partial<Omit<SocialLink, 'id'>>): Promise<void> {
  const supabase = createClient()
  const ownerId = await getOwnerId()
  
  const payload: any = {}
  if (updates.platform !== undefined) payload.platform = updates.platform
  if (updates.label !== undefined) payload.label = updates.label
  if (updates.url !== undefined) payload.url = updates.url
  if (updates.isVisible !== undefined) payload.is_visible = updates.isVisible
  if (updates.includeInResume !== undefined) payload.include_in_resume = updates.includeInResume

  const { error } = await supabase
    .from('social_links')
    .update(payload)
    .eq('id', id)
    .eq('profile_id', ownerId)

  if (error) throw new Error(`Failed to update social link: ${error.message}`)
}

export async function deleteSocialLink(id: string): Promise<void> {
  const supabase = createClient()
  const ownerId = await getOwnerId()
  
  const { error } = await supabase
    .from('social_links')
    .delete()
    .eq('id', id)
    .eq('profile_id', ownerId)

  if (error) throw new Error(`Failed to delete social link: ${error.message}`)
}

export async function reorderSocialLinks(links: SocialLink[]): Promise<void> {
  const supabase = createClient()
  const ownerId = await getOwnerId()
  
  const updates = links.map((link, index) => 
    supabase
      .from('social_links')
      .update({ sort_order: index })
      .eq('id', link.id)
      .eq('profile_id', ownerId)
  )

  const results = await Promise.all(updates)
  
  const error = results.find(r => r.error)?.error
  if (error) throw new Error(`Failed to reorder social links: ${error.message}`)
}
