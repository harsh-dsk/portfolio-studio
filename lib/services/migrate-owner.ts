import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient as createBrowserClient } from '@/lib/supabase/client'

const SEED_ID = process.env.NEXT_PUBLIC_PORTFOLIO_OWNER_ID || 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'

/**
 * Idempotent Portfolio Ownership Check & Migration.
 *
 * Ensures that if a seed profile exists in the database under SEED_ID,
 * it is migrated to the authenticated user's UUID (userId).
 *
 * Guaranteed Behavior:
 * 1. If profile for `userId` already exists -> DO NOTHING (returns immediately).
 * 2. If seed profile exists -> Call `transfer_portfolio_ownership` RPC (atomic SECURITY DEFINER function).
 * 3. If seed profile does NOT exist -> Create a new profile for `userId` (only if none exists).
 */
export async function ensurePortfolioOwnership(userId: string, userEmail?: string): Promise<void> {
  if (!userId) return

  const isServer = typeof window === 'undefined'
  const supabase = isServer ? await createServerClient() : createBrowserClient()

  // 1. Check if authenticated user already has a profile row
  const { data: userProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .maybeSingle()

  if (userProfile) {
    // Already migrated & authenticated profile exists. Return immediately.
    return
  }

  // 2. User profile does NOT exist. Check if seed profile exists to migrate.
  const { data: seedProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', SEED_ID)
    .maybeSingle()

  if (seedProfile && SEED_ID !== userId) {
    // Trigger database RPC function (runs as SECURITY DEFINER to bypass RLS restrictions)
    try {
      const { error: rpcError } = await supabase.rpc('transfer_portfolio_ownership', {
        old_id: SEED_ID,
        new_id: userId,
        new_email: userEmail || null,
      })

      if (!rpcError) {
        return
      }
    } catch {
      // Ignore RPC migration error
    }
  }

  // 3. Fallback: If no seed profile existed or RPC failed, create a fresh single profile for userId
  // (Uses upsert with onConflict on 'id' to prevent duplicate row errors)
  await supabase.from('profiles').upsert(
    {
      id: userId,
      email: userEmail || '',
      name: 'Harshdeep Singh',
      title: 'Full Stack Developer',
      availability: 'available',
    },
    { onConflict: 'id' }
  )
}
