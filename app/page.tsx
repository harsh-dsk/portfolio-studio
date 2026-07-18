import type { Metadata } from "next";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { ResumeHeader } from "@/components/resume/ResumeHeader";
import { ContactInfo } from "@/components/resume/ContactInfo";
import { SocialLinks } from "@/components/resume/SocialLinks";
import { ResumeSection } from "@/components/resume/ResumeSection";
import { Objective } from "@/components/resume/Objective";
import { EducationSection } from "@/components/resume/Education";
import { TechnicalSkills } from "@/components/resume/TechnicalSkills";
import { ResumeProjects } from "@/components/resume/ResumeProjects";
import { Achievements } from "@/components/resume/Achievements";
import { ExternalLinks } from "@/components/resume/ExternalLinks";
import { resumeData } from "@/lib/data/resume";

export const metadata: Metadata = {
  title: "Harshdeep Singh — Full Stack Developer",
  description:
    "Full Stack Developer specializing in React, Next.js, and TypeScript. Building thoughtful digital products with care and precision.",
};

export default function HomePage() {
  const { profile, contact, socialLinks, objective, education, skills, projects, achievements, externalLinks } =
    resumeData;

  return (
    <main className="relative flex-1">
      {/* Subtle ambient background — very faint, non-distracting */}
      <AnimatedBackground />

      {/* ── Resume document ── */}
      <div className="container-page pt-24 pb-20">
        {/* Max width for the resume content — keeps it readable and document-like */}
        <div className="max-w-4xl mx-auto space-y-10">

          {/* ── Header: Photo + Name + Theme Toggle ── */}
          <ResumeHeader
            name={profile.name}
            title={profile.title}
            photo={profile.photo}
          />

          {/* ── Contact info ── */}
          <ContactInfo items={contact} />

          {/* ── Social links ── */}
          <SocialLinks links={socialLinks} />

          {/* ── Divider ── */}
          <div className="h-px bg-border" />

          {/* ── Objective ── */}
          <ResumeSection title="Objective">
            <Objective text={objective} />
          </ResumeSection>

          {/* ── Education ── */}
          <ResumeSection title="Education" id="education">
            <EducationSection items={education} />
          </ResumeSection>

          {/* ── Technical Skills ── */}
          <ResumeSection title="Technical Skills" id="skills">
            <TechnicalSkills categories={skills} />
          </ResumeSection>

          {/* ── Projects ── */}
          <ResumeSection title="Projects" id="projects">
            <ResumeProjects projects={projects} />
          </ResumeSection>

          {/* ── Achievements ── */}
          <ResumeSection title="Achievements">
            <Achievements items={achievements} />
          </ResumeSection>

          {/* ── External Links ── */}
          <ResumeSection title="External Links">
            <ExternalLinks links={externalLinks} />
          </ResumeSection>

        </div>
      </div>
    </main>
  );
}
