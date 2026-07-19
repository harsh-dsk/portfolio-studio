/**
 * lib/supabase/client.ts
 *
 * Browser-side Supabase client.
 * Use this in "use client" components and the PortfolioContext.
 */
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
