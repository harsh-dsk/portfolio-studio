'use client'

import { useState } from 'react'
import { Camera } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { FormField } from '@/components/admin/FormField'
import { ProfilePhoto } from '@/components/ui/ProfilePhoto'
import { usePortfolio } from '@/lib/context/PortfolioContext'
import type { AvailabilityStatus } from '@/lib/types'
import { uploadProfilePhoto } from '@/lib/services/profile.service'

const AVAILABILITY_OPTIONS: { value: AvailabilityStatus; label: string; description: string; color: string }[] = [
  { value: 'available',      label: 'Available for work',   description: 'Actively looking for new opportunities', color: 'oklch(0.72 0.17 155)' },
  { value: 'open-to-work',   label: 'Open to work',          description: 'Employed but open to the right role',    color: 'oklch(0.76 0.14 65)'  },
  { value: 'employed',       label: 'Currently employed',    description: 'Not actively looking',                   color: 'oklch(0.63 0.19 251)' },
  { value: 'unavailable',    label: 'Not available',          description: 'Not open to new roles right now',        color: 'oklch(0.65 0.22 27)'  },
]

export default function ProfilePage() {
  const { data, updateProfile } = usePortfolio()
  const { profile } = data

  const [name,         setName]         = useState(profile.name)
  const [title,        setTitle]        = useState(profile.title)
  const [phone,        setPhone]        = useState(profile.phone)
  const [email,        setEmail]        = useState(profile.email)
  const [location,     setLocation]     = useState(profile.location)
  const [college,      setCollege]      = useState(profile.college)
  const [objective,    setObjective]    = useState(profile.objective)
  const [availability, setAvailability] = useState<AvailabilityStatus>(profile.availability)
  const [saved,        setSaved]        = useState(false)
  const [photoUrl,     setPhotoUrl]     = useState<string | null>(profile.photo || null)
  const [photoUploading, setPhotoUploading] = useState(false)

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setPhotoUploading(true)
    try {
      const url = await uploadProfilePhoto(file)
      setPhotoUrl(url)
      updateProfile({ photo: url })
    } catch (err) {
      console.error('Photo upload failed:', err)
    } finally {
      setPhotoUploading(false)
    }
  }

  const handleSave = () => {
    updateProfile({ name, title, phone, email, location, college, objective, availability, photo: photoUrl || undefined })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const selectedAvail = AVAILABILITY_OPTIONS.find((o) => o.value === availability)!

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your personal information, contact details, and availability status."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_256px] gap-5">
        {/* ── Form ── */}
        <div className="rounded-xl border border-border bg-surface-1 p-6 space-y-6">
          {/* Photo */}
          <div className="flex items-center gap-5">
            <ProfilePhoto name={name} src={photoUrl ?? undefined} size={72} />
            <div>
              <p className="text-sm font-medium text-foreground">Profile Photo</p>
              <p className="text-xs text-fg-subtle mt-0.5 mb-2">
                Uploads directly to Supabase Storage.
              </p>
              <label
                className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-lg border border-border text-fg-muted bg-surface-2 hover:border-border-hover hover:text-foreground transition-all cursor-pointer"
              >
                <Camera size={12} strokeWidth={1.75} />
                {photoUploading ? 'Uploading…' : 'Upload Photo'}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handlePhotoUpload}
                  disabled={photoUploading}
                />
              </label>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--ds-border)' }} className="pt-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Full Name" required>
                <input className="admin-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
              </FormField>
              <FormField label="Professional Title" required>
                <input className="admin-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Full Stack Developer" />
              </FormField>
              <FormField label="Phone Number">
                <input className="admin-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 00000 00000" />
              </FormField>
              <FormField label="Email Address" required>
                <input className="admin-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </FormField>
              <FormField label="Location">
                <input className="admin-input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, Country" />
              </FormField>
              <FormField label="College / University">
                <input className="admin-input" value={college} onChange={(e) => setCollege(e.target.value)} placeholder="Institution name" />
              </FormField>
            </div>

            <FormField label="Objective" description="A brief professional summary shown at the top of your portfolio.">
              <textarea className="admin-textarea" rows={4} value={objective} onChange={(e) => setObjective(e.target.value)} placeholder="Write a short professional summary..." />
            </FormField>

            {/* Availability */}
            <FormField label="Availability" description="Shown as a status badge on your dashboard and public portfolio.">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                {AVAILABILITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setAvailability(opt.value)}
                    className="flex items-start gap-3 p-3 rounded-lg border text-left transition-all duration-150"
                    style={{
                      borderColor: availability === opt.value ? opt.color : 'var(--ds-border)',
                      background: availability === opt.value ? `${opt.color.replace(')', ' / 8%)')}` : 'var(--ds-surface-2)',
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full mt-1 shrink-0"
                      style={{ background: opt.color }}
                    />
                    <div>
                      <p className="text-xs font-medium text-foreground">{opt.label}</p>
                      <p className="text-[11px] text-fg-subtle leading-relaxed">{opt.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </FormField>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSave}
              className="h-9 px-5 text-sm font-medium rounded-lg transition-colors duration-150"
              style={{ background: saved ? 'oklch(0.72 0.17 155)' : 'var(--ds-accent)', color: 'var(--ds-accent-fg)' }}
            >
              {saved ? 'Saved ✓' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* ── Preview card ── */}
        <div className="rounded-xl border border-border bg-surface-1 p-5 space-y-4 h-fit">
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-fg-subtle">Preview</p>
          <div className="flex flex-col items-center text-center gap-3">
            <ProfilePhoto name={name} src={photoUrl ?? undefined} size={80} />
            <div>
              <p className="text-sm font-semibold text-foreground">{name}</p>
              <p className="text-xs text-fg-muted mt-0.5">{title}</p>
              <div
                className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full text-[10px] font-medium"
                style={{ background: `${selectedAvail.color.replace(')', ' / 12%)')}`, color: selectedAvail.color }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: selectedAvail.color }} />
                {selectedAvail.label}
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--ds-border)' }} className="pt-3">
            <p className="text-[11px] text-fg-subtle line-clamp-4 leading-relaxed">{objective}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
