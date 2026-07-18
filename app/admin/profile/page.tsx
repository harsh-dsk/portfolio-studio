"use client";

import { useState } from "react";
import { Camera } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { FormField } from "@/components/admin/FormField";
import { ProfilePhoto } from "@/components/ui/ProfilePhoto";
import { resumeData } from "@/lib/data/resume";

export default function ProfilePage() {
  const { profile, contact } = resumeData;
  const phone = contact.find((c) => c.type === "phone")?.value ?? "";
  const email = contact.find((c) => c.type === "email")?.value ?? "";
  const location = contact.find((c) => c.type === "location")?.value ?? "";

  const [name, setName] = useState(profile.name);
  const [title, setTitle] = useState(profile.title);
  const [objective, setObjective] = useState(resumeData.objective);

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your personal information, contact details, and objective."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-5">
        {/* ── Form ── */}
        <div
          className="rounded-xl border border-border bg-surface-1 p-6 space-y-6"
        >
          {/* Photo upload */}
          <div className="flex items-center gap-5">
            <ProfilePhoto name={name} size={72} />
            <div>
              <p className="text-sm font-medium text-foreground">Profile Photo</p>
              <p className="text-xs text-fg-subtle mt-0.5 mb-2">
                Photo upload will be available once storage is connected.
              </p>
              <button
                disabled
                className="inline-flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-lg border border-border text-fg-subtle bg-surface-2 opacity-50 cursor-not-allowed"
              >
                <Camera size={12} strokeWidth={1.75} />
                Upload Photo
              </button>
            </div>
          </div>

          <div style={{ borderTop: "1px solid var(--ds-border)" }} className="pt-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormField label="Full Name" required>
                <input
                  className="admin-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                />
              </FormField>
              <FormField label="Professional Title" required>
                <input
                  className="admin-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Full Stack Developer"
                />
              </FormField>
              <FormField label="Phone Number">
                <input className="admin-input" defaultValue={phone} placeholder="+91 00000 00000" />
              </FormField>
              <FormField label="Email Address" required>
                <input className="admin-input" type="email" defaultValue={email} placeholder="you@example.com" />
              </FormField>
              <FormField label="Location">
                <input className="admin-input" defaultValue={location} placeholder="City, Country" />
              </FormField>
              <FormField label="College / University">
                <input className="admin-input" defaultValue="Chandigarh University" placeholder="Institution name" />
              </FormField>
            </div>

            <FormField
              label="Objective"
              description="A brief professional summary shown at the top of your resume."
            >
              <textarea
                className="admin-textarea"
                rows={4}
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="Write a short professional summary..."
              />
            </FormField>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button className="h-9 px-5 text-sm font-medium rounded-lg bg-brand text-brand-fg hover:bg-brand-hover transition-colors duration-150">
              Save Changes
            </button>
            <p className="text-xs text-fg-subtle">Changes are in-memory only until Supabase is connected.</p>
          </div>
        </div>

        {/* ── Live preview card ── */}
        <div className="rounded-xl border border-border bg-surface-1 p-5 space-y-4 h-fit">
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-fg-subtle">Preview</p>
          <div className="flex flex-col items-center text-center gap-3">
            <ProfilePhoto name={name} size={80} />
            <div>
              <p className="text-sm font-semibold text-foreground">{name}</p>
              <p className="text-xs text-fg-muted mt-0.5">{title}</p>
            </div>
          </div>
          <div style={{ borderTop: "1px solid var(--ds-border)" }} className="pt-3 space-y-1.5">
            <p className="text-[11px] text-fg-subtle line-clamp-4">{objective}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
