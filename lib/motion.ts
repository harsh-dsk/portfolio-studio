import type { Variants } from "framer-motion";

// Premium easing: spring-like with soft overshoot
const smooth = [0.16, 1, 0.3, 1] as const;

/**
 * Fades an element up from a subtle y-offset.
 * Use on section content, cards, and text blocks.
 */
export const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: smooth,
    },
  },
};

/**
 * Simple opacity fade. Use for decorative elements
 * and overlays where y-movement would feel wrong.
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

/**
 * Wraps a group of children to stagger their reveal.
 * Pair with fadeUp/fadeIn on the children.
 */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

/**
 * Full-page enter/exit transition.
 * Use on the top-level page wrapper with AnimatePresence.
 */
export const pageTransition: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.35,
      ease: "easeInOut",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

/**
 * Slide-down reveal for menus and expandable panels.
 */
export const slideDown: Variants = {
  hidden: {
    opacity: 0,
    y: -6,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: smooth,
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: {
      duration: 0.18,
      ease: "easeIn",
    },
  },
};
