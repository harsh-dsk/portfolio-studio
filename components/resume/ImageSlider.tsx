"use client";

import { useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import type { ProjectScreenshot, Project } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Lightbox } from "./Lightbox";

/* ── Per-index placeholder "screen views" ── */
function ScreenPlaceholder({
  project,
  viewIndex,
}: {
  project: Project;
  viewIndex: number;
}) {
  const { from, to, accent } = project.placeholder;
  const bg = `linear-gradient(150deg, ${from} 0%, ${to} 100%)`;

  const views = [
    /* 0 — dashboard / overview */
    <div key="dash" className="p-6 flex flex-col gap-4 w-full h-full">
      <div className="flex items-center gap-2.5">
        <div className="h-2 w-2 rounded-full" style={{ background: accent }} />
        <div className="h-2 w-20 rounded-full" style={{ background: "oklch(1 0 0 / 30%)" }} />
        <div className="ml-auto h-6 w-16 rounded-md" style={{ background: "oklch(1 0 0 / 12%)" }} />
      </div>
      <div className="grid grid-cols-3 gap-2.5 mt-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-xl p-3 space-y-2" style={{ background: "oklch(1 0 0 / 8%)" }}>
            <div className="h-5 w-5 rounded-md" style={{ background: accent.replace(")", " / 50%)") }} />
            <div className="h-5 text-[9px] font-semibold" style={{ color: "oklch(1 0 0 / 70%)" }}>
              {["2,481", "98%", "12ms"][i]}
            </div>
          </div>
        ))}
      </div>
      <div className="flex-1 rounded-xl overflow-hidden" style={{ background: "oklch(1 0 0 / 5%)" }}>
        {[0.6, 0.8, 0.5, 0.9, 0.7].map((w, i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-1.5 border-b" style={{ borderColor: "oklch(1 0 0 / 6%)" }}>
            <div className="h-1.5 rounded-full" style={{ width: `${w * 60}%`, background: "oklch(1 0 0 / 20%)" }} />
            <div className="ml-auto h-4 w-10 rounded" style={{ background: accent.replace(")", " / 20%)") }} />
          </div>
        ))}
      </div>
    </div>,

    /* 1 — detail / list view */
    <div key="list" className="p-6 flex flex-col gap-3 w-full h-full">
      <div className="flex gap-2 mb-1">
        {["All", "Active", "Done"].map((t, i) => (
          <div
            key={t}
            className="h-6 px-3 rounded-full text-[9px] font-medium flex items-center"
            style={{
              background: i === 0 ? accent : "oklch(1 0 0 / 8%)",
              color: i === 0 ? "oklch(0.08 0 0)" : "oklch(1 0 0 / 50%)",
            }}
          >
            {t}
          </div>
        ))}
      </div>
      {[0.9, 0.65, 0.8, 0.55, 0.75, 0.85].map((w, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
          style={{ background: "oklch(1 0 0 / 6%)", opacity: i > 3 ? 0.6 : 1 }}
        >
          <div
            className="w-5 h-5 rounded-md shrink-0"
            style={{ background: i % 2 === 0 ? accent.replace(")", " / 35%)") : "oklch(1 0 0 / 10%)" }}
          />
          <div className="h-1.5 flex-1 rounded-full" style={{ width: `${w * 100}%`, background: "oklch(1 0 0 / 18%)" }} />
          <div className="h-4 w-8 rounded" style={{ background: "oklch(1 0 0 / 10%)" }} />
        </div>
      ))}
    </div>,

    /* 2 — settings / form view */
    <div key="form" className="p-6 flex flex-col gap-4 w-full h-full">
      <div className="h-2 w-24 rounded-full mb-2" style={{ background: "oklch(1 0 0 / 30%)" }} />
      {[0.7, 0.5, 0.85].map((_, i) => (
        <div key={i} className="space-y-1.5">
          <div className="h-1.5 w-12 rounded-full" style={{ background: "oklch(1 0 0 / 25%)" }} />
          <div
            className="h-8 rounded-lg border px-2 flex items-center"
            style={{ borderColor: i === 1 ? accent : "oklch(1 0 0 / 12%)", background: "oklch(1 0 0 / 5%)", boxShadow: i === 1 ? `0 0 0 2px ${accent.replace(")", " / 25%)")}` : "none" }}
          >
            <div className="h-1.5 w-24 rounded-full" style={{ background: "oklch(1 0 0 / 20%)" }} />
          </div>
        </div>
      ))}
      <div className="mt-auto">
        <div className="h-8 rounded-lg px-4 flex items-center w-fit" style={{ background: accent }}>
          <div className="h-1.5 w-12 rounded-full" style={{ background: "oklch(0.08 0 0 / 50%)" }} />
        </div>
      </div>
    </div>,

    /* 3 — analytics / chart view */
    <div key="chart" className="p-6 flex flex-col gap-4 w-full h-full">
      <div className="flex gap-3 mb-1">
        <div className="space-y-0.5">
          <div className="h-1.5 w-10 rounded-full" style={{ background: "oklch(1 0 0 / 25%)" }} />
          <div className="h-3 w-16 rounded" style={{ background: "oklch(1 0 0 / 35%)", fontSize: 9 }} />
        </div>
      </div>
      {/* Bar chart */}
      <div className="flex-1 flex items-end gap-2 pt-4">
        {[40, 65, 48, 80, 55, 70, 90, 45, 75, 60].map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t"
            style={{
              height: `${h}%`,
              background: i === 6 ? accent : `${accent.replace(")", ` / ${20 + i * 3}%)`)}`,
            }}
          />
        ))}
      </div>
      <div className="flex gap-2">
        {["Jan","Mar","Jun","Sep","Dec"].map((m) => (
          <div key={m} className="flex-1 text-center" style={{ fontSize: 7, color: "oklch(1 0 0 / 35%)" }}>{m}</div>
        ))}
      </div>
    </div>,
  ];

  return (
    <div className="w-full h-full relative flex items-center justify-center" style={{ background: bg }}>
      {/* Browser chrome */}
      <div
        className="absolute top-0 left-0 right-0 h-8 flex items-center px-3 gap-1.5 z-10"
        style={{ background: "oklch(0 0 0 / 18%)" }}
      >
        {["oklch(0.70 0.18 25 / 60%)","oklch(0.76 0.14 65 / 60%)","oklch(0.72 0.17 155 / 60%)"].map((c, i) => (
          <div key={i} className="w-2 h-2 rounded-full shrink-0" style={{ background: c }} />
        ))}
        <div className="mx-auto h-4 w-32 rounded-sm" style={{ background: "oklch(1 0 0 / 8%)" }} />
      </div>
      {/* View content */}
      <div className="absolute inset-0 top-8 overflow-hidden">
        {views[viewIndex % views.length]}
      </div>
    </div>
  );
}

/* ── ImageSlider ── */
interface ImageSliderProps {
  screenshots: ProjectScreenshot[];
  project: Project;
  className?: string;
}

export function ImageSlider({ screenshots, project, className }: ImageSliderProps) {
  const [current, setCurrent] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const total = screenshots.length;

  const prev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), []);
  const next = useCallback(() => setCurrent((c) => Math.min(total - 1, c + 1)), [total]);

  // Keyboard navigation support (Left / Right arrow keys)
  useEffect(() => {
    if (total <= 1 || lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prev();
      } else if (e.key === "ArrowRight") {
        next();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [total, prev, next, lightboxOpen]);

  const slide = screenshots[current];

  return (
    <>
      <div className={cn("relative w-full h-full overflow-hidden bg-black/90 select-none flex items-center justify-center p-3 sm:p-6 group", className)}>
        {/* Slide */}
        <div
          className="relative w-full h-full flex items-center justify-center cursor-pointer overflow-hidden rounded-xl"
          onClick={() => slide?.url && setLightboxOpen(true)}
          title={slide?.url ? "Click to view full screen" : undefined}
        >
          {slide?.url ? (
            <>
              {/* object-contain displays 100% of the screenshot without cropping */}
              <img
                src={slide.url}
                alt={slide.alt || project.title}
                className="max-h-full max-w-full object-contain rounded-lg shadow-2xl transition-transform duration-300 group-hover:scale-[1.01]"
                draggable={false}
              />

              {/* Top-right Expand button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxOpen(true);
                }}
                className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-black/50 text-white/80 hover:text-white backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-center transition-all duration-200 opacity-70 group-hover:opacity-100 hover:scale-105 hover:bg-black/75 z-20"
                title="View Fullscreen"
                aria-label="View Fullscreen"
              >
                <Maximize2 size={16} strokeWidth={2} />
              </button>
            </>
          ) : (
            <ScreenPlaceholder project={project} viewIndex={current} />
          )}
        </div>

        {/* Navigation arrows */}
        {total > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              disabled={current === 0}
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150 z-20 shadow-lg border border-white/10",
                "bg-black/60 text-white backdrop-blur-md",
                current === 0 ? "opacity-0 pointer-events-none" : "opacity-90 hover:opacity-100 hover:bg-black/80"
              )}
              aria-label="Previous screenshot"
            >
              <ChevronLeft size={18} strokeWidth={2} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              disabled={current === total - 1}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150 z-20 shadow-lg border border-white/10",
                "bg-black/60 text-white backdrop-blur-md",
                current === total - 1 ? "opacity-0 pointer-events-none" : "opacity-90 hover:opacity-100 hover:bg-black/80"
              )}
              aria-label="Next screenshot"
            >
              <ChevronRight size={18} strokeWidth={2} />
            </button>
          </>
        )}

        {/* Dot indicators */}
        {total > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {screenshots.map((_, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrent(i);
                }}
                aria-label={`Screenshot ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-200 bg-white",
                  i === current ? "w-5 opacity-100" : "w-1.5 opacity-40 hover:opacity-70"
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {screenshots.length > 0 && (
        <Lightbox
          screenshots={screenshots}
          currentIndex={current}
          projectTitle={project.title}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          onIndexChange={(idx) => setCurrent(idx)}
        />
      )}
    </>
  );
}
