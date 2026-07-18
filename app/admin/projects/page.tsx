"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, ExternalLink, GitBranch, Star } from "lucide-react";
import { PageHeader } from "@/components/admin/PageHeader";
import { FormField } from "@/components/admin/FormField";
import type { ResumeProject } from "@/lib/data/resume";
import { resumeData } from "@/lib/data/resume";

type AdminProject = ResumeProject & { featured: boolean };

const initialProjects: AdminProject[] = resumeData.projects.map((p, i) => ({
  ...p,
  featured: i === 0,
}));

/* ── Mini screenshot placeholder ── */
function MiniPlaceholder({ project }: { project: AdminProject }) {
  const { from, to, accent } = project.placeholder;
  return (
    <div
      className="w-full h-24 rounded-lg overflow-hidden relative"
      style={{ background: `linear-gradient(145deg, ${from} 0%, ${to} 100%)` }}
      aria-hidden="true"
    >
      <div
        className="absolute top-0 left-0 right-0 h-5 flex items-center px-2 gap-1"
        style={{ background: "oklch(0 0 0 / 18%)" }}
      >
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "oklch(0.70 0.18 25 / 70%)" }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "oklch(0.76 0.14 65 / 70%)" }} />
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "oklch(0.72 0.17 155 / 70%)" }} />
      </div>
      <div className="absolute top-6 left-2 right-2 bottom-2 flex flex-col gap-1.5">
        <div className="h-2 w-16 rounded-full" style={{ background: accent.replace(")", " / 40%)") }} />
        <div className="h-1.5 rounded-full" style={{ background: "oklch(1 0 0 / 10%)" }} />
        <div className="h-1.5 w-3/4 rounded-full" style={{ background: "oklch(1 0 0 / 8%)" }} />
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<AdminProject[]>(initialProjects);
  const [showAdd, setShowAdd] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "", description: "", techStack: "", githubUrl: "", liveUrl: "", featured: false,
  });

  const deleteProject = (id: string) =>
    setProjects((prev) => prev.filter((p) => p.id !== id));

  const toggleFeatured = (id: string) =>
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p))
    );

  const addProject = () => {
    if (!newProject.title.trim()) return;
    const newP: AdminProject = {
      id: Date.now().toString(),
      title: newProject.title,
      description: newProject.description,
      techStack: newProject.techStack.split(",").map((s) => s.trim()).filter(Boolean),
      githubUrl: newProject.githubUrl || undefined,
      liveUrl: newProject.liveUrl || undefined,
      featured: newProject.featured,
      placeholder: { from: "oklch(0.15 0.04 250)", to: "oklch(0.11 0.03 270)", accent: "oklch(0.63 0.19 251)" },
    };
    setProjects((prev) => [...prev, newP]);
    setNewProject({ title: "", description: "", techStack: "", githubUrl: "", liveUrl: "", featured: false });
    setShowAdd(false);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <PageHeader
        title="Projects"
        description="Add, edit, and manage the projects displayed on your portfolio."
        action={{
          label: "Add Project",
          icon: <Plus size={14} strokeWidth={2} />,
          onClick: () => setShowAdd((v) => !v),
        }}
      />

      {/* Project cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded-xl border border-border bg-surface-1 overflow-hidden"
          >
            {/* Screenshot */}
            <div className="p-3 pb-0">
              <MiniPlaceholder project={project} />
            </div>

            {/* Content */}
            <div className="p-4 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-foreground leading-snug">{project.title}</p>
                <button
                  onClick={() => toggleFeatured(project.id)}
                  title={project.featured ? "Remove featured" : "Mark as featured"}
                  className={`p-1 rounded transition-colors shrink-0 ${project.featured ? "text-[oklch(0.76_0.14_65)]" : "text-fg-subtle hover:text-fg-muted"}`}
                >
                  <Star size={13} strokeWidth={project.featured ? 0 : 1.75} fill={project.featured ? "currentColor" : "none"} />
                </button>
              </div>

              <p className="text-xs text-fg-muted line-clamp-2 leading-relaxed">{project.description}</p>

              <div className="flex flex-wrap gap-1">
                {project.techStack.slice(0, 3).map((t) => (
                  <span key={t} className="px-2 py-0.5 text-[10px] rounded-md border border-border text-fg-subtle bg-surface-2">{t}</span>
                ))}
                {project.techStack.length > 3 && (
                  <span className="px-2 py-0.5 text-[10px] rounded-md border border-border text-fg-subtle bg-surface-2">+{project.techStack.length - 3}</span>
                )}
              </div>

              <div className="flex items-center gap-1.5 pt-1">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] text-brand hover:text-brand-hover transition-colors">
                    <ExternalLink size={10} strokeWidth={2} />Live
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] text-fg-subtle hover:text-fg-muted transition-colors">
                    <GitBranch size={10} strokeWidth={2} />GitHub
                  </a>
                )}
                <div className="ml-auto flex items-center gap-1">
                  <button className="p-1.5 rounded-md text-fg-subtle hover:text-foreground hover:bg-surface-2 transition-all" aria-label="Edit project">
                    <Pencil size={12} strokeWidth={1.75} />
                  </button>
                  <button onClick={() => deleteProject(project.id)} className="p-1.5 rounded-md text-fg-subtle hover:text-[oklch(0.65_0.22_27)] hover:bg-[oklch(0.65_0.22_27_/_8%)] transition-all" aria-label="Delete project">
                    <Trash2 size={12} strokeWidth={1.75} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add project form */}
      {showAdd && (
        <div className="rounded-xl border border-border bg-surface-1 p-5 space-y-4">
          <p className="text-sm font-semibold text-foreground">New Project</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Title" required>
              <input className="admin-input" value={newProject.title} onChange={(e) => setNewProject((p) => ({ ...p, title: e.target.value }))} placeholder="Project name" />
            </FormField>
            <FormField label="Tech Stack" description="Comma-separated: React, Node.js, Supabase">
              <input className="admin-input" value={newProject.techStack} onChange={(e) => setNewProject((p) => ({ ...p, techStack: e.target.value }))} placeholder="React, TypeScript, Supabase" />
            </FormField>
            <FormField label="GitHub URL">
              <input className="admin-input" value={newProject.githubUrl} onChange={(e) => setNewProject((p) => ({ ...p, githubUrl: e.target.value }))} placeholder="https://github.com/..." />
            </FormField>
            <FormField label="Live Demo URL">
              <input className="admin-input" value={newProject.liveUrl} onChange={(e) => setNewProject((p) => ({ ...p, liveUrl: e.target.value }))} placeholder="https://..." />
            </FormField>
          </div>
          <FormField label="Short Description">
            <textarea className="admin-textarea" rows={2} value={newProject.description} onChange={(e) => setNewProject((p) => ({ ...p, description: e.target.value }))} placeholder="One or two sentence summary..." />
          </FormField>
          <FormField label="Full Description">
            <textarea className="admin-textarea" rows={3} placeholder="Detailed description for the case study modal..." />
          </FormField>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-fg-muted cursor-pointer select-none">
              <input
                type="checkbox"
                checked={newProject.featured}
                onChange={(e) => setNewProject((p) => ({ ...p, featured: e.target.checked }))}
                className="rounded border-border"
              />
              Featured project
            </label>
          </div>
          <div className="flex gap-2.5">
            <button onClick={addProject} className="h-9 px-4 text-sm font-medium rounded-lg bg-brand text-brand-fg hover:bg-brand-hover transition-colors duration-150">Add Project</button>
            <button onClick={() => setShowAdd(false)} className="h-9 px-4 text-sm font-medium rounded-lg border border-border text-fg-muted hover:text-foreground hover:bg-surface-2 transition-all duration-150">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
