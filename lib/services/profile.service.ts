import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types'
import { getOwnerId } from './owner'

export async function getProfile(): Promise<Profile> {
  const supabase = createClient()
  const ownerId = await getOwnerId()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', ownerId)
    .single()

  if (error) throw new Error(`Failed to get profile: ${error.message}`)

  return {
    name: data.name,
    title: data.title,
    photo: data.photo_url ?? null,
    phone: data.phone,
    email: data.email,
    location: data.location,
    college: data.college,
    objective: data.objective,
    availability: data.availability as any
  }
}

export async function upsertProfile(updates: Partial<Profile>): Promise<void> {
  const supabase = createClient()
  const ownerId = await getOwnerId()
  
  const payload: any = {
    id: ownerId,
  }
  
  if (updates.name !== undefined) payload.name = updates.name
  if (updates.title !== undefined) payload.title = updates.title
  if (updates.photo !== undefined) payload.photo_url = updates.photo
  if (updates.phone !== undefined) payload.phone = updates.phone
  if (updates.email !== undefined) payload.email = updates.email
  if (updates.location !== undefined) payload.location = updates.location
  if (updates.college !== undefined) payload.college = updates.college
  if (updates.objective !== undefined) payload.objective = updates.objective
  if (updates.availability !== undefined) payload.availability = updates.availability

  const { error } = await supabase
    .from('profiles')
    .upsert(payload, { onConflict: 'id' })

  if (error) throw new Error(`Failed to upsert profile: ${error.message}`)
}

export async function uploadProfilePhoto(file: File): Promise<string> {
  const supabase = createClient()
  const ownerId = await getOwnerId()
  const ext = file.name.split('.').pop()
  const path = `${ownerId}/avatar-${Date.now()}.${ext}`

  const { error } = await supabase.storage
    .from('profile-images')
    .upload(path, file, { upsert: true })

  if (error) throw new Error(`Failed to upload photo: ${error.message}`)

  const { data } = supabase.storage
    .from('profile-images')
    .getPublicUrl(path)

  return data.publicUrl
}
