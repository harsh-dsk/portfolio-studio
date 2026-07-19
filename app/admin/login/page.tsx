'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function LoginContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const handleGoogleLogin = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  const errorMessage =
    error === 'unauthorized'
      ? 'This Google account does not have admin access.'
      : error === 'auth_failed'
      ? 'Authentication failed. Please try again.'
      : null

  return (
    <main
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--ds-bg)',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '380px',
          background: 'var(--ds-surface-1)',
          border: '1px solid var(--ds-border)',
          borderRadius: '16px',
          padding: '40px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'oklch(0.63 0.19 251 / 15%)',
              border: '1px solid oklch(0.63 0.19 251 / 25%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="oklch(0.63 0.19 251)" strokeWidth="1.75" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </div>
          <h1 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ds-fg)', margin: 0, letterSpacing: '-0.02em' }}>
            Portfolio CMS
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--ds-fg-muted)', margin: '6px 0 0', lineHeight: 1.5 }}>
            Sign in with your admin Google account to access the dashboard.
          </p>
        </div>

        {/* Error */}
        {errorMessage && (
          <div
            style={{
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'oklch(0.65 0.22 27 / 10%)',
              border: '1px solid oklch(0.65 0.22 27 / 25%)',
              fontSize: '13px',
              color: 'oklch(0.65 0.22 27)',
              lineHeight: 1.5,
            }}
          >
            {errorMessage}
          </div>
        )}

        {/* Google Sign In */}
        <button
          id="google-signin-btn"
          onClick={handleGoogleLogin}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            width: '100%',
            height: '44px',
            background: 'var(--ds-surface-2)',
            border: '1px solid var(--ds-border)',
            borderRadius: '10px',
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--ds-fg)',
            cursor: 'pointer',
            transition: 'border-color 150ms, background 150ms',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--ds-border-hover)'
            e.currentTarget.style.background = 'var(--ds-surface-1)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--ds-border)'
            e.currentTarget.style.background = 'var(--ds-surface-2)'
          }}
        >
          <GoogleIcon />
          Sign in with Google
        </button>

        <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--ds-fg-subtle)', margin: 0 }}>
          Access is restricted to authorised accounts only.
        </p>
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}
