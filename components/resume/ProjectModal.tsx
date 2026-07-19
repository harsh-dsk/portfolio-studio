"use client";

import { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, GitBranch } from "lucide-react";
import type { Project } from "@/lib/types";
import { ImageSlider } from "./ImageSlider";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  /* Close on Escape */
  useEffect(() => {
    if (!project) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [project, onClose]);

  /* Lock body scroll */
  useEffect(() => {
    if (project) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [project]);

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* ── Backdrop ── */}
          <motion.div
            key="modal-backdrop"
            className="fixed inset-0 z-[60]"
            style={{ background: "oklch(0 0 0 / 80%)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* ── Modal ── */}
          <motion.div
            key="modal-panel"
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            className="fixed z-[61] flex flex-col lg:flex-row overflow-hidden rounded-2xl"
            style={{
              inset: "clamp(16px, 4vw, 48px)",
              background: "var(--ds-surface-0)",
              border: "1px solid var(--ds-border)",
              boxShadow: "0 32px 80px oklch(0 0 0 / 60%)",
            }}
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 4 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* ── Close button ── */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-150 text-fg-muted hover:text-foreground"
              style={{ background: "var(--ds-surface-2)" }}
              aria-label="Close project modal"
            >
              <X size={15} strokeWidth={2} />
            </button>

            {/* ── Left: Image gallery ── */}
            <div className="w-full lg:w-[55%] h-56 sm:h-72 lg:h-full shrink-0">
              <ImageSlider screenshots={project.screenshots} project={project} className="h-full" />
            </div>

            {/* ── Right: Details ── */}
            <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
              {/* Title + short description */}
              <div className="space-y-2 pr-8 lg:pr-0">
                <h2
                  className="text-xl font-semibold text-foreground tracking-tight"
                  style={{ letterSpacing: "-0.025em" }}
                >
                  {project.title}
                </h2>
                <p className="text-sm text-fg-muted leading-relaxed">{project.shortDescription}</p>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: "var(--ds-border)" }} />

              {/* Full description */}
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.1em] text-fg-subtle mb-2">
                  Overview
                </p>
                <p className="text-sm text-fg-muted leading-[1.8]">{project.fullDescription}</p>
              </div>

              {/* Tech stack */}
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.1em] text-fg-subtle mb-2">
                  Tech Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 text-xs rounded-lg border border-border text-fg-muted bg-surface-2"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Screenshot count */}
              {project.screenshots.length > 1 && (
                <p className="text-xs text-fg-subtle">
                  {project.screenshots.length} screenshots — use arrows to navigate
                </p>
              )}

              {/* CTA links */}
              <div className="flex flex-wrap gap-3 pt-2">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 h-9 px-4 text-sm font-medium rounded-lg bg-brand text-brand-fg hover:bg-brand-hover transition-colors duration-150"
                  >
                    <ExternalLink size={14} strokeWidth={2} />
                    Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 h-9 px-4 text-sm font-medium rounded-lg border border-border text-fg-muted bg-surface-1 hover:text-foreground hover:bg-surface-2 transition-all duration-150"
                  >
                    <GitBranch size={14} strokeWidth={1.75} />
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
