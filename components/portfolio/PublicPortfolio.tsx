"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ProfilePhoto } from "@/components/ui/ProfilePhoto";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { ContactInfo } from "@/components/resume/ContactInfo";
import { SocialLinks } from "@/components/resume/SocialLinks";
import { ResumeSection } from "@/components/resume/ResumeSection";
import { Objective } from "@/components/resume/Objective";
import { EducationSection } from "@/components/resume/Education";
import { TechnicalSkills } from "@/components/resume/TechnicalSkills";
import { ProjectCarousel } from "@/components/resume/ProjectCarousel";
import { Achievements } from "@/components/resume/Achievements";
import { ExternalLinks } from "@/components/resume/ExternalLinks";
import { PrintableResume } from "@/components/admin/PrintableResume";
import type { PortfolioData } from "@/lib/types";

export function PublicPortfolio({ initialData }: { initialData: PortfolioData }) {
  const [data] = useState<PortfolioData>(initialData);

  const profile = data.profile;
  const socialLinks = (data.socialLinks || []).filter((l) => l.isVisible !== false);
  const education = (data.education || []).filter((e) => e.isVisible !== false);
  const skills = (data.skills || []).filter((c) => c.isVisible !== false);
  const projects = (data.projects || []).filter((p) => p.isVisible !== false);
  const achievements = (data.achievements || []).filter((a) => a.isVisible !== false);
  const externalLinks = (data.externalLinks || []).filter((l) => l.isVisible !== false);

  const isUploadedMode = data.resumeSettings?.resumeMode === 'uploaded' && !!data.resumeSettings?.resumePdfUrl;
  const uploadedPdfUrl = data.resumeSettings?.resumePdfUrl || '#';

  /* Adapt new SkillCategory type → TechnicalSkills prop shape */
  const skillCategories = skills
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((c) => ({ category: c.name, skills: c.skills }));

  /* Adapt new EducationEntry type → EducationSection prop shape */
  const educationItems = education.map((e) => ({
    degree: e.degree,
    field: e.field,
    institution: e.institution,
    period: e.period,
    location: e.location,
    gpa: e.gpa,
    coursework: e.coursework,
  }));

  /* Contact items from profile */
  const contactItems = [
    { type: "phone" as const,    value: profile.phone },
    { type: "email" as const,    value: profile.email },
    { type: "location" as const, value: profile.location },
    { type: "college" as const,  value: profile.college },
  ].filter((c) => c.value);

  /* Social links — generic platform, label, url */
  const socialItems = socialLinks.map((l) => ({
    id: l.id,
    platform: l.platform,
    label: l.label,
    url: l.url,
  }));

  return (
    <>
      {/* Hidden printable resume for dynamic mode printing */}
      {!isUploadedMode && (
        <PrintableResume data={data} template={data.resumeSettings?.selectedTemplate || 'modern'} />
      )}

      <main className="relative flex-1">
        <AnimatedBackground />

        <div className="container-page pt-8 pb-20">
          <div className="max-w-4xl mx-auto space-y-8">

            {/* ── Top bar: Photo | Name | Actions ── */}
            <header className="flex items-center gap-4">
              {/* Left — profile photo */}
              <ProfilePhoto
                name={profile.name}
                src={profile.photo ?? undefined}
                size={72}
              />

              {/* Center — name */}
              <div className="flex-1 flex justify-center">
                <h1
                  className="text-2xl sm:text-3xl font-semibold text-foreground text-center"
                  style={{ letterSpacing: "-0.025em" }}
                >
                  {profile.name}
                </h1>
              </div>

              {/* Right — Resume button & theme toggle */}
              <div className="flex items-center gap-2">
                {isUploadedMode ? (
                  <a
                    href={uploadedPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-surface-2 transition-colors"
                    title="Download Resume PDF"
                  >
                    <FileText size={13} />
                    <span>Resume</span>
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setTimeout(() => window.print(), 150)
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-surface-2 transition-colors"
                    title="Print / Save Resume PDF"
                  >
                    <FileText size={13} />
                    <span>Resume</span>
                  </button>
                )}
                <ThemeToggle />
              </div>
            </header>

            {/* ── Contact ── */}
            {contactItems.length > 0 && <ContactInfo items={contactItems} />}

            {/* ── Social buttons ── */}
            {socialItems.length > 0 && <SocialLinks links={socialItems} />}

            {/* ── Divider ── */}
            <div className="h-px bg-border" />

            {/* ── Objective ── */}
            {profile.objective && (
              <ResumeSection title="Objective">
                <Objective text={profile.objective} />
              </ResumeSection>
            )}

            {/* ── Education ── */}
            {educationItems.length > 0 && (
              <ResumeSection title="Education" id="education">
                <EducationSection items={educationItems} />
              </ResumeSection>
            )}

            {/* ── Technical Skills ── */}
            {skillCategories.length > 0 && (
              <ResumeSection title="Technical Skills" id="skills">
                <TechnicalSkills categories={skillCategories} />
              </ResumeSection>
            )}

            {/* ── Projects carousel ── */}
            {projects.length > 0 && (
              <ResumeSection title="Projects" id="projects">
                <ProjectCarousel projects={projects} />
              </ResumeSection>
            )}

            {/* ── Achievements ── */}
            {achievements.length > 0 && (
              <ResumeSection title="Achievements">
                <Achievements items={achievements} />
              </ResumeSection>
            )}

            {/* ── External Links ── */}
            {externalLinks.length > 0 && (
              <ResumeSection title="External Links">
                <ExternalLinks links={externalLinks} />
              </ResumeSection>
            )}

          </div>
        </div>
      </main>
    </>
  );
}
