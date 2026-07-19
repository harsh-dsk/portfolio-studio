import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ensurePortfolioOwnership } from '@/lib/services/migrate-owner'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/admin'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Perform idempotent ownership transfer from seed UUID to authenticated user's UUID
      await ensurePortfolioOwnership(data.user.id, data.user.email)

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Auth failed — redirect to login with error param
  return NextResponse.redirect(`${origin}/admin/login?error=auth_failed`)
}
