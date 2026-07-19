'use client'

import React from 'react'
import type { PortfolioData } from '@/lib/types'

interface PrintableResumeProps {
  data: PortfolioData
  template: 'modern' | 'classic' | 'minimal' | string
}

export function PrintableResume({ data, template }: PrintableResumeProps) {
  const profile = data.profile
  const socialLinks = (data.socialLinks || []).filter((l) => l.includeInResume !== false)
  const education = (data.education || []).filter((e) => e.includeInResume !== false)
  const skills = (data.skills || []).filter((c) => c.includeInResume !== false)
  const projects = (data.projects || []).filter((p) => p.includeInResume !== false)
  const achievements = (data.achievements || []).filter((a) => a.includeInResume !== false)
  const externalLinks = (data.externalLinks || []).filter((l) => l.includeInResume !== false)

  const activeTemplate = template || 'modern'

  return (
    <div id="resume-print-area" className="printable-resume-root">
      {/* ── Global Print Styles ── */}
      <style>{`
        @media screen {
          #resume-print-area {
            display: none !important;
          }
        }

        @media print {
          /* Hide non-print UI */
          body > *:not(#resume-print-area),
          .no-print,
          nav,
          aside,
          header,
          button,
          .admin-sidebar,
          .admin-topnav {
            display: none !important;
          }

          /* Ensure body and html do not hide parent tree */
          html, body, #__next, main, div:has(#resume-print-area) {
            display: block !important;
            visibility: visible !important;
            background: #ffffff !important;
            color: #111827 !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
          }

          #resume-print-area {
            display: block !important;
            visibility: visible !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            min-height: 100% !important;
            background: #ffffff !important;
            color: #111827 !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
            box-sizing: border-box !important;
            padding: 0 !important;
            margin: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          @page {
            size: A4 portrait;
            margin: 0.4in;
          }

          a {
            color: inherit !important;
            text-decoration: none !important;
          }
        }
      `}</style>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 1. MODERN TEMPLATE                                                 */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTemplate === 'modern' && (
        <div className="flex min-h-screen text-slate-800 bg-white leading-relaxed text-xs">
          {/* Left Sidebar */}
          <div className="w-[30%] bg-slate-900 text-slate-100 p-6 flex flex-col gap-6 shrink-0 print:bg-slate-900 print:text-slate-100">
            {/* Header / Name */}
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white leading-snug">{profile.name}</h1>
              <p className="text-xs font-medium text-blue-400 mt-1">{profile.title}</p>
            </div>

            {/* Contact Information */}
            <div className="space-y-2 text-[11px] text-slate-300 border-t border-slate-700 pt-4">
              <h2 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">Contact</h2>
              {profile.email && <div><span className="text-slate-400 block text-[10px]">Email</span><span className="break-all">{profile.email}</span></div>}
              {profile.phone && <div><span className="text-slate-400 block text-[10px]">Phone</span><span>{profile.phone}</span></div>}
              {profile.location && <div><span className="text-slate-400 block text-[10px]">Location</span><span>{profile.location}</span></div>}
              {profile.college && <div><span className="text-slate-400 block text-[10px]">Education</span><span>{profile.college}</span></div>}
              {profile.availability && <div><span className="text-slate-400 block text-[10px]">Status</span><span className="capitalize">{profile.availability}</span></div>}
            </div>

            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="space-y-2 text-[11px] text-slate-300 border-t border-slate-700 pt-4">
                <h2 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2">Social Profiles</h2>
                {socialLinks.map((link) => (
                  <div key={link.id}>
                    <span className="font-medium text-slate-200">{link.label}: </span>
                    <span className="text-blue-300 break-all">{link.url.replace(/^https?:\/\//, '')}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <div className="space-y-3 border-t border-slate-700 pt-4">
                <h2 className="text-xs uppercase tracking-wider font-semibold text-slate-400">Technical Skills</h2>
                {skills.map((cat) => (
                  <div key={cat.id} className="space-y-1">
                    <p className="text-[11px] font-semibold text-blue-300">{cat.name}</p>
                    <div className="flex flex-wrap gap-1">
                      {cat.skills.map((s) => (
                        <span key={s} className="px-1.5 py-0.5 text-[10px] bg-slate-800 text-slate-200 rounded border border-slate-700">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Main Body */}
          <div className="w-[70%] p-6 space-y-6 bg-white">
            {/* Objective */}
            {profile.objective && (
              <section className="space-y-1.5">
                <h2 className="text-xs uppercase tracking-wider font-bold text-slate-900 border-b-2 border-slate-900 pb-1">Professional Summary</h2>
                <p className="text-slate-700 text-[11px] leading-relaxed">{profile.objective}</p>
              </section>
            )}

            {/* Projects */}
            {projects.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-xs uppercase tracking-wider font-bold text-slate-900 border-b-2 border-slate-900 pb-1">Key Projects</h2>
                {projects.map((p) => (
                  <div key={p.id} className="space-y-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="font-bold text-slate-900 text-xs">{p.title}</h3>
                      <div className="text-[10px] text-slate-500 space-x-2">
                        {p.liveUrl && <span>Live: {p.liveUrl.replace(/^https?:\/\//, '')}</span>}
                        {p.githubUrl && <span>GitHub: {p.githubUrl.replace(/^https?:\/\//, '')}</span>}
                      </div>
                    </div>
                    {p.techStack && p.techStack.length > 0 && (
                      <p className="text-[10px] font-mono text-blue-600 font-medium">{p.techStack.join(' • ')}</p>
                    )}
                    <p className="text-[11px] text-slate-600 leading-relaxed">{p.shortDescription}</p>
                  </div>
                ))}
              </section>
            )}

            {/* Education */}
            {education.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-xs uppercase tracking-wider font-bold text-slate-900 border-b-2 border-slate-900 pb-1">Education</h2>
                {education.map((e) => (
                  <div key={e.id} className="space-y-0.5">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-slate-900 text-xs">{e.institution}</h3>
                      <span className="text-[10px] text-slate-500 font-medium">{e.period}</span>
                    </div>
                    <p className="text-[11px] text-slate-700 font-medium">{e.degree} in {e.field} {e.gpa ? `(GPA: ${e.gpa})` : ''}</p>
                    {e.location && <p className="text-[10px] text-slate-500">{e.location}</p>}
                    {e.coursework && e.coursework.length > 0 && (
                      <p className="text-[10px] text-slate-600 pt-0.5"><span className="font-semibold text-slate-700">Coursework:</span> {e.coursework.join(', ')}</p>
                    )}
                  </div>
                ))}
              </section>
            )}

            {/* Achievements */}
            {achievements.length > 0 && (
              <section className="space-y-2">
                <h2 className="text-xs uppercase tracking-wider font-bold text-slate-900 border-b-2 border-slate-900 pb-1">Achievements & Certifications</h2>
                {achievements.map((a) => (
                  <div key={a.id} className="flex justify-between items-start text-[11px]">
                    <div>
                      <span className="font-semibold text-slate-900">{a.title}</span>
                      {a.description && <span className="text-slate-600 block text-[10px]">{a.description}</span>}
                    </div>
                    {a.date && <span className="text-[10px] text-slate-500 shrink-0 ml-2 font-medium">{a.date}</span>}
                  </div>
                ))}
              </section>
            )}

            {/* External Links */}
            {externalLinks.length > 0 && (
              <section className="space-y-1.5">
                <h2 className="text-xs uppercase tracking-wider font-bold text-slate-900 border-b-2 border-slate-900 pb-1">Additional Links</h2>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  {externalLinks.map((l) => (
                    <div key={l.id}>
                      <span className="font-semibold text-slate-800">{l.label}: </span>
                      <span className="text-blue-600">{l.url.replace(/^https?:\/\//, '')}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 2. CLASSIC TEMPLATE                                                */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTemplate === 'classic' && (
        <div className="p-8 space-y-5 text-slate-900 bg-white leading-relaxed text-xs">
          {/* Header */}
          <div className="text-center space-y-1.5 border-b border-slate-300 pb-4">
            <h1 className="text-2xl font-bold tracking-tight uppercase text-slate-900">{profile.name}</h1>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest">{profile.title}</p>
            <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-[11px] text-slate-600 pt-1">
              {profile.email && <span>{profile.email}</span>}
              {profile.phone && <span>• {profile.phone}</span>}
              {profile.location && <span>• {profile.location}</span>}
            </div>
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-[10px] text-blue-700">
                {socialLinks.map((l) => (
                  <span key={l.id}>{l.label}: {l.url.replace(/^https?:\/\//, '')}</span>
                ))}
              </div>
            )}
          </div>

          {/* Objective */}
          {profile.objective && (
            <section className="space-y-1">
              <h2 className="text-xs uppercase tracking-wider font-bold text-slate-900 border-b border-slate-400 pb-0.5">Summary</h2>
              <p className="text-[11px] text-slate-700 leading-relaxed">{profile.objective}</p>
            </section>
          )}

          {/* Technical Skills */}
          {skills.length > 0 && (
            <section className="space-y-1.5">
              <h2 className="text-xs uppercase tracking-wider font-bold text-slate-900 border-b border-slate-400 pb-0.5">Technical Skills</h2>
              <div className="space-y-1 text-[11px]">
                {skills.map((cat) => (
                  <div key={cat.id} className="flex">
                    <span className="font-bold text-slate-900 w-32 shrink-0">{cat.name}:</span>
                    <span className="text-slate-700">{cat.skills.join(', ')}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-xs uppercase tracking-wider font-bold text-slate-900 border-b border-slate-400 pb-0.5">Projects</h2>
              {projects.map((p) => (
                <div key={p.id} className="space-y-0.5">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-900 text-xs">{p.title}</h3>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {p.liveUrl || p.githubUrl ? (p.liveUrl || p.githubUrl)?.replace(/^https?:\/\//, '') : ''}
                    </span>
                  </div>
                  {p.techStack && <p className="text-[10px] italic text-slate-600 font-medium">Technologies: {p.techStack.join(', ')}</p>}
                  <p className="text-[11px] text-slate-700">{p.shortDescription}</p>
                </div>
              ))}
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section className="space-y-2">
              <h2 className="text-xs uppercase tracking-wider font-bold text-slate-900 border-b border-slate-400 pb-0.5">Education</h2>
              {education.map((e) => (
                <div key={e.id} className="space-y-0.5">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-900 text-xs">{e.institution}</h3>
                    <span className="text-[10px] text-slate-600 font-medium">{e.period}</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-800 font-medium">{e.degree} in {e.field}</span>
                    {e.gpa && <span className="text-slate-600 text-[10px]">GPA: {e.gpa}</span>}
                  </div>
                  {e.coursework && e.coursework.length > 0 && (
                    <p className="text-[10px] text-slate-600">Coursework: {e.coursework.join(', ')}</p>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Achievements */}
          {achievements.length > 0 && (
            <section className="space-y-1.5">
              <h2 className="text-xs uppercase tracking-wider font-bold text-slate-900 border-b border-slate-400 pb-0.5">Achievements</h2>
              {achievements.map((a) => (
                <div key={a.id} className="flex justify-between text-[11px]">
                  <div>
                    <span className="font-bold text-slate-900">{a.title}</span>
                    {a.description && <span className="text-slate-600"> — {a.description}</span>}
                  </div>
                  {a.date && <span className="text-[10px] text-slate-500 shrink-0 ml-2">{a.date}</span>}
                </div>
              ))}
            </section>
          )}

          {/* External Links */}
          {externalLinks.length > 0 && (
            <section className="space-y-1">
              <h2 className="text-xs uppercase tracking-wider font-bold text-slate-900 border-b border-slate-400 pb-0.5">External Links</h2>
              <div className="flex flex-wrap gap-4 text-[11px]">
                {externalLinks.map((l) => (
                  <span key={l.id}><strong className="text-slate-900">{l.label}:</strong> <span className="text-blue-700">{l.url}</span></span>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 3. MINIMAL TEMPLATE                                                */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {activeTemplate === 'minimal' && (
        <div className="p-8 space-y-6 text-slate-800 bg-white leading-relaxed text-xs">
          {/* Header */}
          <div className="space-y-2 border-l-4 border-slate-900 pl-4">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{profile.name}</h1>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">{profile.title}</p>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500 pt-1">
              {profile.email && <span>{profile.email}</span>}
              {profile.phone && <span>{profile.phone}</span>}
              {profile.location && <span>{profile.location}</span>}
            </div>
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-3 text-[10px] text-slate-600 pt-0.5">
                {socialLinks.map((l) => (
                  <span key={l.id} className="underline">{l.label} ({l.url.replace(/^https?:\/\//, '')})</span>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          {profile.objective && (
            <section className="space-y-1">
              <h2 className="text-[11px] uppercase tracking-widest font-bold text-slate-400">About</h2>
              <p className="text-[11px] text-slate-700 leading-relaxed">{profile.objective}</p>
            </section>
          )}

          {/* Technical Skills */}
          {skills.length > 0 && (
            <section className="space-y-2">
              <h2 className="text-[11px] uppercase tracking-widest font-bold text-slate-400">Skills</h2>
              <div className="grid grid-cols-2 gap-3 text-[11px]">
                {skills.map((cat) => (
                  <div key={cat.id}>
                    <p className="font-semibold text-slate-900">{cat.name}</p>
                    <p className="text-slate-600 text-[10px]">{cat.skills.join(', ')}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-[11px] uppercase tracking-widest font-bold text-slate-400">Projects</h2>
              {projects.map((p) => (
                <div key={p.id} className="space-y-1 border-l-2 border-slate-100 pl-3">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-900 text-xs">{p.title}</h3>
                    {p.liveUrl && <span className="text-[10px] text-emerald-600">{p.liveUrl.replace(/^https?:\/\//, '')}</span>}
                  </div>
                  {p.techStack && <p className="text-[10px] font-mono text-slate-500">{p.techStack.join(' • ')}</p>}
                  <p className="text-[11px] text-slate-600">{p.shortDescription}</p>
                </div>
              ))}
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-[11px] uppercase tracking-widest font-bold text-slate-400">Education</h2>
              {education.map((e) => (
                <div key={e.id} className="space-y-0.5 border-l-2 border-slate-100 pl-3">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-900 text-xs">{e.institution}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">{e.period}</span>
                  </div>
                  <p className="text-[11px] text-slate-700">{e.degree} — {e.field} {e.gpa ? `(GPA: ${e.gpa})` : ''}</p>
                  {e.coursework && e.coursework.length > 0 && (
                    <p className="text-[10px] text-slate-500">Coursework: {e.coursework.join(', ')}</p>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* Achievements */}
          {achievements.length > 0 && (
            <section className="space-y-2">
              <h2 className="text-[11px] uppercase tracking-widest font-bold text-slate-400">Achievements</h2>
              {achievements.map((a) => (
                <div key={a.id} className="flex justify-between items-baseline text-[11px] border-l-2 border-slate-100 pl-3">
                  <div>
                    <span className="font-bold text-slate-900">{a.title}</span>
                    {a.description && <span className="text-slate-600 text-[10px] block">{a.description}</span>}
                  </div>
                  {a.date && <span className="text-[10px] text-slate-400 shrink-0 font-mono ml-2">{a.date}</span>}
                </div>
              ))}
            </section>
          )}

          {/* External Links */}
          {externalLinks.length > 0 && (
            <section className="space-y-1">
              <h2 className="text-[11px] uppercase tracking-widest font-bold text-slate-400">Links</h2>
              <div className="space-y-1 text-[11px]">
                {externalLinks.map((l) => (
                  <div key={l.id}>
                    <span className="font-semibold text-slate-800">{l.label}: </span>
                    <span className="text-emerald-600 text-[10px]">{l.url}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
