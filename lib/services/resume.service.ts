import { createClient } from '@/lib/supabase/client'
import { getOwnerId } from './owner'

export async function getResumeSettings(): Promise<{ id: string; selectedTemplate: string }> {
  const supabase = createClient()
  const ownerId = await getOwnerId()
  const { data, error } = await supabase
    .from('resume_settings')
    .select('*')
    .eq('profile_id', ownerId)
    .maybeSingle()

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to get resume settings: ${error.message}`)
  }

  if (!data) {
    return { id: '', selectedTemplate: 'default' }
  }

  return {
    id: data.id,
    selectedTemplate: data.selected_template
  }
}

export async function upsertResumeSettings(selectedTemplate: string): Promise<void> {
  const supabase = createClient()
  const ownerId = await getOwnerId()
  
  const { error } = await supabase
    .from('resume_settings')
    .upsert({
      profile_id: ownerId,
      selected_template: selectedTemplate
    }, { onConflict: 'profile_id' })

  if (error) throw new Error(`Failed to upsert resume settings: ${error.message}`)
}
