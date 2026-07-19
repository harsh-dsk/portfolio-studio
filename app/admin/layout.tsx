import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { AdminShell } from '@/components/admin/AdminShell'
import { PortfolioProvider } from '@/lib/context/PortfolioContext'
import { getFullPortfolio } from '@/lib/services/portfolio.service'
import { createClient } from '@/lib/supabase/server'
import { ensurePortfolioOwnership } from '@/lib/services/migrate-owner'
import '@/app/admin-forms.css'

export const metadata: Metadata = {
  title: { default: 'Admin — Portfolio CMS', template: '%s — Admin' },
  robots: { index: false, follow: false },
}

/**
 * Admin Layout — Server Component
 *
 * 1. Verifies authenticated user session and runs ownership transfer if needed.
 * 2. Fetches full portfolio data server-side for the logged-in owner.
 * 3. Passes SSR data to PortfolioProvider so client state starts populated.
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    // Automatically trigger idempotent ownership migration if not yet migrated
    await ensurePortfolioOwnership(user.id, user.email)
  }

  const initialData = await getFullPortfolio()

  return (
    <PortfolioProvider initialData={initialData}>
      <AdminShell>{children}</AdminShell>
    </PortfolioProvider>
  )
}
