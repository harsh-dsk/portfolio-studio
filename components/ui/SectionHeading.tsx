"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Small uppercase label above the heading */
  eyebrow?: string;
  /** The main heading text — renders as <h2> */
  heading: string;
  /** Optional supporting paragraph below the heading */
  description?: string;
  /** Text alignment */
  align?: "left" | "center";
  /**
   * Enable scroll-triggered Framer Motion animation.
   * Uses staggerContainer + fadeUp per child.
   * Keep false for above-the-fold headings.
   */
  animate?: boolean;
  className?: string;
}

/**
 * SectionHeading
 *
 * Consistent section label pattern: eyebrow → h2 → description.
 * Optionally animated with Framer Motion on scroll entry.
 *
 * @example
 * <SectionHeading
 *   eyebrow="Selected Work"
 *   heading="Projects that matter"
 *   description="A curated collection of work."
 *   animate
 * />
 */
export function SectionHeading({
  eyebrow,
  heading,
  description,
  align = "left",
  animate = false,
  className,
}: SectionHeadingProps) {
  const containerProps = animate
    ? {
        variants: staggerContainer,
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, margin: "-60px" },
      }
    : {};

  const itemProps = animate ? { variants: fadeUp } : {};

  return (
    <motion.div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
      {...containerProps}
    >
      {eyebrow && (
        <motion.p className="eyebrow mb-3" {...itemProps}>
          {eyebrow}
        </motion.p>
      )}

      <motion.h2
        className="text-balance font-medium tracking-tight text-foreground"
        {...itemProps}
      >
        {heading}
      </motion.h2>

      {description && (
        <motion.p
          className="mt-4 text-base leading-relaxed text-fg-muted text-pretty"
          {...itemProps}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}
