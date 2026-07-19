import { createClient } from '@/lib/supabase/client'
import type { Project, ProjectScreenshot } from '@/lib/types'
import { getOwnerId } from './owner'

export async function getProjects(): Promise<Project[]> {
  const supabase = createClient()
  const ownerId = await getOwnerId()
  const { data, error } = await supabase
    .from('projects')
    .select('*, project_images(*)')
    .eq('profile_id', ownerId)
    .order('sort_order')

  if (error) throw new Error(`Failed to get projects: ${error.message}`)

  return data.map((d: any) => {
    const screenshots = (d.project_images || [])
      .sort((a: any, b: any) => a.sort_order - b.sort_order)
      .map((img: any) => ({
        id: img.id,
        url: img.url === '' ? null : img.url,
        alt: img.alt_text,
        storagePath: img.storage_path ?? undefined,
        isCover: img.is_cover ?? false,
        sortOrder: img.sort_order ?? 0,
      }))

    const coverObj = screenshots.find((img: any) => img.isCover && img.url) || screenshots.find((img: any) => img.url)
    const coverImage = coverObj?.url ?? null

    return {
      id: d.id,
      title: d.title,
      shortDescription: d.short_description,
      fullDescription: d.full_description,
      techStack: d.tech_stack ?? [],
      liveUrl: d.live_url ?? undefined,
      githubUrl: d.github_url ?? undefined,
      order: d.sort_order,
      placeholder: {
        from: d.placeholder_from,
        to: d.placeholder_to,
        accent: d.placeholder_accent
      },
      screenshots,
      coverImage,
      isVisible: d.is_visible ?? true,
      includeInResume: d.include_in_resume ?? true,
    }
  })
}

export async function addProject(project: Omit<Project, 'id' | 'order'>, order: number): Promise<Project> {
  const supabase = createClient()
  const ownerId = await getOwnerId()
  
  const { data, error } = await supabase
    .from('projects')
    .insert({
      profile_id: ownerId,
      title: project.title,
      short_description: project.shortDescription,
      full_description: project.fullDescription,
      tech_stack: project.techStack,
      live_url: project.liveUrl,
      github_url: project.githubUrl,
      sort_order: order,
      placeholder_from: project.placeholder?.from || 'oklch(0.15 0.04 250)',
      placeholder_to: project.placeholder?.to || 'oklch(0.11 0.03 270)',
      placeholder_accent: project.placeholder?.accent || 'oklch(0.63 0.19 251)'
    })
    .select()
    .single()

  if (error) throw new Error(`Failed to add project: ${error.message}`)

  return {
    id: data.id,
    title: data.title,
    shortDescription: data.short_description,
    fullDescription: data.full_description,
    techStack: data.tech_stack ?? [],
    liveUrl: data.live_url ?? undefined,
    githubUrl: data.github_url ?? undefined,
    order: data.sort_order,
    placeholder: {
      from: data.placeholder_from,
      to: data.placeholder_to,
      accent: data.placeholder_accent
    },
    screenshots: []
  }
}

export async function updateProject(id: string, updates: Partial<Omit<Project, 'id'>>): Promise<void> {
  const supabase = createClient()
  const ownerId = await getOwnerId()
  
  const payload: any = {}
  if (updates.title !== undefined) payload.title = updates.title
  if (updates.shortDescription !== undefined) payload.short_description = updates.shortDescription
  if (updates.fullDescription !== undefined) payload.full_description = updates.fullDescription
  if (updates.techStack !== undefined) payload.tech_stack = updates.techStack
  if (updates.liveUrl !== undefined) payload.live_url = updates.liveUrl
  if (updates.githubUrl !== undefined) payload.github_url = updates.githubUrl
  if (updates.order !== undefined) payload.sort_order = updates.order
  if (updates.isVisible !== undefined) payload.is_visible = updates.isVisible
  if (updates.includeInResume !== undefined) payload.include_in_resume = updates.includeInResume
  if (updates.placeholder) {
    payload.placeholder_from = updates.placeholder.from
    payload.placeholder_to = updates.placeholder.to
    payload.placeholder_accent = updates.placeholder.accent
  }

  const { error } = await supabase
    .from('projects')
    .update(payload)
    .eq('id', id)
    .eq('profile_id', ownerId)

  if (error) throw new Error(`Failed to update project: ${error.message}`)
}

export async function deleteProject(id: string): Promise<void> {
  const supabase = createClient()
  const ownerId = await getOwnerId()
  
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('profile_id', ownerId)

  if (error) throw new Error(`Failed to delete project: ${error.message}`)
}

export async function reorderProjects(projects: Project[]): Promise<void> {
  const supabase = createClient()
  const ownerId = await getOwnerId()
  
  const updates = projects.map((p, index) => 
    supabase
      .from('projects')
      .update({ sort_order: index })
      .eq('id', p.id)
      .eq('profile_id', ownerId)
  )

  const results = await Promise.all(updates)
  const error = results.find(r => r.error)?.error
  if (error) throw new Error(`Failed to reorder projects: ${error.message}`)
}

export async function uploadProjectImage(file: File, projectId: string): Promise<{ publicUrl: string; storagePath: string }> {
  const supabase = createClient()
  const ext = file.name.split('.').pop() || 'png'
  const storagePath = `${projectId}/${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${ext}`

  const { error } = await supabase.storage
    .from('project-images')
    .upload(storagePath, file, { upsert: true })

  if (error) throw new Error(`Failed to upload project image: ${error.message}`)

  const { data } = supabase.storage
    .from('project-images')
    .getPublicUrl(storagePath)

  return { publicUrl: data.publicUrl, storagePath }
}

export async function addProjectImage(
  projectId: string,
  url: string,
  alt: string = '',
  sortOrder: number = 0,
  storagePath?: string,
  isCover: boolean = false
): Promise<ProjectScreenshot> {
  const supabase = createClient()

  // If set to cover, un-cover all other images for this project first
  if (isCover) {
    await supabase
      .from('project_images')
      .update({ is_cover: false })
      .eq('project_id', projectId)
  }
  
  const { data, error } = await supabase
    .from('project_images')
    .insert({
      project_id: projectId,
      url,
      alt_text: alt,
      sort_order: sortOrder,
      storage_path: storagePath ?? null,
      is_cover: isCover
    })
    .select()
    .single()

  if (error) throw new Error(`Failed to add project image: ${error.message}`)

  return {
    id: data.id,
    url: data.url === '' ? null : data.url,
    alt: data.alt_text,
    storagePath: data.storage_path ?? undefined,
    isCover: data.is_cover ?? false,
    sortOrder: data.sort_order ?? 0
  }
}

export async function setCoverImage(projectId: string, imageId: string): Promise<void> {
  const supabase = createClient()

  // Reset all cover flags for this project
  const { error: resetError } = await supabase
    .from('project_images')
    .update({ is_cover: false })
    .eq('project_id', projectId)

  if (resetError) throw new Error(`Failed to reset cover images: ${resetError.message}`)

  // Set the selected image as cover
  const { error: setError } = await supabase
    .from('project_images')
    .update({ is_cover: true })
    .eq('id', imageId)
    .eq('project_id', projectId)

  if (setError) throw new Error(`Failed to set cover image: ${setError.message}`)
}

export async function reorderProjectImages(projectId: string, imageIds: string[]): Promise<void> {
  const supabase = createClient()

  const updates = imageIds.map((id, index) =>
    supabase
      .from('project_images')
      .update({ sort_order: index })
      .eq('id', id)
      .eq('project_id', projectId)
  )

  const results = await Promise.all(updates)
  const error = results.find(r => r.error)?.error
  if (error) throw new Error(`Failed to reorder project images: ${error.message}`)
}

export async function deleteProjectImage(imageId: string, storagePath?: string): Promise<void> {
  const supabase = createClient()
  
  if (storagePath) {
    await supabase.storage
      .from('project-images')
      .remove([storagePath])
  }

  const { error } = await supabase
    .from('project_images')
    .delete()
    .eq('id', imageId)

  if (error) throw new Error(`Failed to delete project image: ${error.message}`)
}
