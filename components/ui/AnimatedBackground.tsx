"use client";

import { motion } from "framer-motion";
import { fadeIn } from "@/lib/motion";

/**
 * AnimatedBackground
 *
 * Extremely subtle ambient radial gradients that fade in on mount.
 * Positioned fixed behind all content. CSS-animation-driven drift.
 * Not decorative — it adds depth without competing with content.
 */
export function AnimatedBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Primary orb — top right */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        transition={{ duration: 2.5, ease: "easeOut" }}
        style={{
          position: "absolute",
          top: "-15%",
          right: "-8%",
          width: "680px",
          height: "680px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at center, oklch(0.63 0.19 251 / 4%) 0%, transparent 65%)",
          animation: "bgOrb 18s ease-in-out infinite",
        }}
      />

      {/* Secondary orb — bottom left */}
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        transition={{ duration: 3, delay: 0.4, ease: "easeOut" }}
        style={{
          position: "absolute",
          bottom: "5%",
          left: "-12%",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle at center, oklch(0.63 0.19 251 / 2.5%) 0%, transparent 65%)",
          animation: "bgOrb 24s ease-in-out infinite reverse",
        }}
      />
    </div>
  );
}
