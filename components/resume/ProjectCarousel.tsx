"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, GitBranch } from "lucide-react";
import type { Project } from "@/lib/types";
import { ProjectModal } from "./ProjectModal";
import { cn } from "@/lib/utils";

/* ── Card thumbnail ── */
function CardThumbnail({ project }: { project: Project }) {
  const coverImg = project.coverImage || project.screenshots?.find((img) => img.isCover && img.url)?.url || project.screenshots?.find((img) => img.url)?.url

  if (coverImg) {
    return (
      <div className="w-full h-full relative overflow-hidden bg-surface-2">
        <img
          src={coverImg}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
    );
  }

  const { from, to, accent } = project.placeholder;
  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{ background: `linear-gradient(145deg, ${from} 0%, ${to} 100%)` }}
    >
      <div className="absolute top-0 inset-x-0 h-5 flex items-center px-2 gap-1" style={{ background: "oklch(0 0 0 / 18%)" }}>
        {["oklch(0.70 0.18 25 / 60%)", "oklch(0.76 0.14 65 / 60%)", "oklch(0.72 0.17 155 / 60%)"].map((c, i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />
        ))}
      </div>
      <div className="absolute top-7 left-3 right-3 bottom-3 flex flex-col gap-2">
        <div className="h-2 w-20 rounded-full" style={{ background: accent.replace(")", " / 50%)") }} />
        <div className="h-1.5 rounded-full" style={{ background: "oklch(1 0 0 / 12%)" }} />
        <div className="h-1.5 w-4/5 rounded-full" style={{ background: "oklch(1 0 0 / 8%)" }} />
        <div className="mt-auto flex gap-1.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-3 rounded-md px-1.5 flex items-center" style={{ background: accent.replace(")", " / 20%)"), minWidth: 28 }}>
              <div className="h-1 w-full rounded-full" style={{ background: "oklch(1 0 0 / 30%)" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Project card ── */
function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group w-full text-left rounded-xl overflow-hidden border border-border bg-surface-1 transition-all duration-200 hover:border-border-hover hover:shadow-[0_8px_32px_oklch(0_0_0_/_20%)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
      aria-label={`View ${project.title} case study`}
    >
      <div className="h-40 overflow-hidden">
        <CardThumbnail project={project} />
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-foreground group-hover:text-brand transition-colors duration-150">
            {project.title}
          </h3>
          <p className="mt-1 text-xs text-fg-muted leading-relaxed line-clamp-2">
            {project.shortDescription}
          </p>
        </div>
        <div className="flex flex-wrap gap-1">
          {project.techStack.slice(0, 3).map((t) => (
            <span key={t} className="px-2 py-0.5 text-[10px] rounded-md border border-border text-fg-subtle bg-surface-2">{t}</span>
          ))}
          {project.techStack.length > 3 && (
            <span className="px-2 py-0.5 text-[10px] rounded-md border border-border text-fg-subtle bg-surface-2">+{project.techStack.length - 3}</span>
          )}
        </div>
        <div className="flex items-center gap-3 pt-0.5">
          <span className="text-xs font-medium text-brand group-hover:text-brand-hover transition-colors">
            View Case Study →
          </span>
          <div className="ml-auto flex gap-2">
            {project.liveUrl && (
              <span onClick={(e) => { e.stopPropagation(); window.open(project.liveUrl, "_blank"); }} className="text-fg-subtle hover:text-fg-muted transition-colors cursor-pointer" title="Live Demo">
                <ExternalLink size={12} strokeWidth={1.75} />
              </span>
            )}
            {project.githubUrl && (
              <span onClick={(e) => { e.stopPropagation(); window.open(project.githubUrl, "_blank"); }} className="text-fg-subtle hover:text-fg-muted transition-colors cursor-pointer" title="GitHub">
                <GitBranch size={12} strokeWidth={1.75} />
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}

/* ── Carousel ── */
const CARD_WIDTH = 300;
const CARD_GAP   = 16;
const SCROLL_BY  = CARD_WIDTH + CARD_GAP;

export function ProjectCarousel({ projects }: { projects: Project[] }) {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [canLeft,  setCanLeft]  = useState(false);
  const [canRight, setCanRight] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  /* Mouse drag state */
  const isDown      = useRef(false);
  const startX      = useRef(0);
  const scrollStart = useRef(0);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => { el.removeEventListener("scroll", updateArrows); ro.disconnect(); };
  }, [updateArrows]);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -SCROLL_BY : SCROLL_BY, behavior: "smooth" });
  };

  /* ── Mouse drag handlers ── */
  const onMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    isDown.current = true;
    startX.current = e.pageX - el.offsetLeft;
    scrollStart.current = el.scrollLeft;
    el.style.cursor = "grabbing";
    el.style.userSelect = "none";
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDown.current) return;
    const el = scrollRef.current;
    if (!el) return;
    e.preventDefault();
    const x    = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    el.scrollLeft = scrollStart.current - walk;
  };

  const onMouseUp = () => {
    const el = scrollRef.current;
    if (!el) return;
    isDown.current = false;
    el.style.cursor = "grab";
    el.style.userSelect = "";
  };

  const onMouseLeave = () => {
    if (!isDown.current) return;
    onMouseUp();
  };

  if (projects.length === 0) {
    return <p className="text-sm text-fg-subtle">No projects yet.</p>;
  }

  const sorted = projects.slice().sort((a, b) => a.order - b.order);

  return (
    <div className="relative">
      {/* Left arrow */}
      <button
        onClick={() => scroll("left")}
        aria-label="Scroll left"
        className={cn(
          "absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150",
          "bg-surface-1 border border-border text-fg-muted hover:text-foreground hover:border-border-hover shadow-sm",
          canLeft ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <ChevronLeft size={15} strokeWidth={2} />
      </button>

      {/* Scrollable track */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ scrollSnapType: "x mandatory", cursor: "grab" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        {sorted.map((project) => (
          <div
            key={project.id}
            style={{ minWidth: CARD_WIDTH, maxWidth: CARD_WIDTH, scrollSnapAlign: "start" }}
            /* Prevent card button click when we were dragging */
            onClickCapture={(e) => { if (Math.abs(scrollRef.current!.scrollLeft - scrollStart.current) > 6) e.stopPropagation(); }}
          >
            <ProjectCard project={project} onClick={() => setActiveProject(project)} />
          </div>
        ))}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scroll("right")}
        aria-label="Scroll right"
        className={cn(
          "absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150",
          "bg-surface-1 border border-border text-fg-muted hover:text-foreground hover:border-border-hover shadow-sm",
          canRight && sorted.length > 1 ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <ChevronRight size={15} strokeWidth={2} />
      </button>

      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </div>
  );
}
