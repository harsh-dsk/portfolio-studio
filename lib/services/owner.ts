import { createClient } from '@/lib/supabase/client'

/**
 * Returns the effective profile owner ID with 100% deterministic resolution:
 * 1. If an authenticated user session exists -> return user.id (authenticated owner)
 * 2. If ADMIN_EMAIL is set -> query profiles table where email = ADMIN_EMAIL
 * 3. Else query profiles table ordered deterministically by created_at ASC
 * 4. Fallback to process.env.NEXT_PUBLIC_PORTFOLIO_OWNER_ID (seed ID)
 */
export async function getOwnerId(): Promise<string> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user?.id) return user.id

  // Unauthenticated visitor: Deterministic email lookup
  const adminEmail = process.env.ADMIN_EMAIL
  if (adminEmail) {
    const { data: adminProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', adminEmail)
      .maybeSingle()

    if (adminProfile?.id) return adminProfile.id
  }

  // Deterministic fallback: oldest created profile
  const { data: oldestProfile } = await supabase
    .from('profiles')
    .select('id')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (oldestProfile?.id) return oldestProfile.id

  if (process.env.NEXT_PUBLIC_PORTFOLIO_OWNER_ID) {
    return process.env.NEXT_PUBLIC_PORTFOLIO_OWNER_ID
  }

  throw new Error('No profile owner ID found in database')
}
