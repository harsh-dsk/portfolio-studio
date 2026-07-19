import type { Metadata } from 'next'
import { PublicPortfolio } from '@/components/portfolio/PublicPortfolio'
import { getFullPortfolio } from '@/lib/services/portfolio.service'

export const metadata: Metadata = {
  title: 'Harshdeep Singh — Full Stack Developer',
  description:
    'Full Stack Developer specializing in React, Next.js, and TypeScript. Building thoughtful digital products with care and precision.',
}

/**
 * HomePage — Server Component
 *
 * Fetches the full portfolio data from Supabase on every request.
 * Passes it to PublicPortfolio as a prop (no localStorage, no cold-start flash).
 */
export default async function HomePage() {
  const data = await getFullPortfolio()
  return <PublicPortfolio initialData={data} />
}
