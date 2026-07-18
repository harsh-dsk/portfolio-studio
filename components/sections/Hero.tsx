"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeUp } from "@/lib/motion";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { ArrowRight, ExternalLink } from "lucide-react";
import type { ReactNode } from "react";

/* ─────────────────────────────────────────────────────────
   Data — will be editable via admin dashboard
   ───────────────────────────────────────────────────────── */

type SocialPlatform = "github" | "linkedin" | "leetcode";

interface SocialLink {
  platform: SocialPlatform;
  href: string;
  label: string;
}

const PROFILE = {
  name: "Harshdeep Singh",
  tagline: "Full Stack Developer crafting thoughtful digital products.",
  /** Set to a URL string when a real photo is available */
  photo: null as string | null,
} as const;

const SOCIAL_LINKS: SocialLink[] = [
  { platform: "github",   href: "https://github.com",   label: "GitHub" },
  { platform: "linkedin", href: "https://linkedin.com", label: "LinkedIn" },
  { platform: "leetcode", href: "https://leetcode.com", label: "LeetCode" },
];

const SKILL_CHIPS = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "Tailwind CSS",
  "Supabase",
  "REST APIs",
] as const;

/* ─────────────────────────────────────────────────────────
   Hero
   ───────────────────────────────────────────────────────── */
export function Hero() {
  return (
    <section className="relative min-h-dvh flex items-center pt-16">
      <div className="container-page w-full py-16 lg:py-24">

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center"
        >
          {/* ── Profile photo ── */}
          <motion.div variants={fadeUp}>
            <ProfilePhoto
              src={PROFILE.photo}
              name={PROFILE.name}
            />
          </motion.div>

          {/* ── Name + tagline ── */}
          <motion.div variants={fadeUp} className="mt-7 space-y-3">
            <h1 className="text-foreground text-balance">
              {PROFILE.name}
            </h1>
            <p className="text-lg sm:text-xl text-fg-muted leading-relaxed max-w-lg mx-auto text-pretty">
              {PROFILE.tagline}
            </p>
          </motion.div>

          {/* ── Social buttons ── */}
          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-wrap justify-center gap-2.5"
          >
            {SOCIAL_LINKS.map(({ platform, href, label }) => (
              <SocialButton key={platform} href={href} label={label}>
                <SocialIcon platform={platform} />
              </SocialButton>
            ))}
          </motion.div>

          {/* ── Skill chips ── */}
          <motion.div
            variants={fadeUp}
            className="mt-6 flex flex-wrap justify-center gap-2 max-w-xl"
          >
            {SKILL_CHIPS.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg border border-border text-fg-muted bg-surface-1 tracking-wide"
              >
                {skill}
              </span>
            ))}
          </motion.div>

          {/* ── CTAs ── */}
          <motion.div
            variants={fadeUp}
            className="mt-8 flex flex-wrap justify-center items-center gap-3"
          >
            <PrimaryButton href="#projects" size="lg">
              View Projects
              <ArrowRight size={15} strokeWidth={2} />
            </PrimaryButton>
            <SecondaryButton href="/resume.pdf" external size="lg">
              <ExternalLink size={14} strokeWidth={1.75} />
              Download Resume
            </SecondaryButton>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2"
      >
        <span className="text-[11px] tracking-[0.12em] uppercase text-fg-subtle">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-fg-subtle to-transparent"
        />
      </motion.div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────
   ProfilePhoto
   Will display a real <img> when src is provided;
   falls back to initials placeholder.
   ───────────────────────────────────────────────────────── */
interface ProfilePhotoProps {
  src: string | null;
  name: string;
}

function ProfilePhoto({ src, name }: ProfilePhotoProps) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Ambient glow behind the ring */}
      <div
        aria-hidden="true"
        className="absolute w-40 h-40 rounded-full opacity-25 blur-2xl pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, oklch(0.63 0.19 251) 0%, transparent 70%)",
        }}
      />

      {/* Gradient ring wrapper */}
      <div
        className="relative rounded-full p-[2px]"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.63 0.19 251 / 60%), oklch(0.63 0.19 251 / 12%))",
        }}
      >
        {/* Inner photo / placeholder */}
        <div
          className="w-[112px] h-[112px] sm:w-[128px] sm:h-[128px] rounded-full overflow-hidden flex items-center justify-center"
          style={{
            background:
              "linear-gradient(145deg, oklch(0.18 0.07 251), oklch(0.12 0.05 271))",
          }}
        >
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={name}
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <span
              className="text-2xl font-medium tracking-tight text-foreground select-none"
              aria-hidden="true"
            >
              {initials}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   SocialButton
   ───────────────────────────────────────────────────────── */
function SocialButton({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex items-center gap-2 h-9 px-4 text-sm font-medium text-fg-muted rounded-xl border border-border bg-surface-1 transition-all duration-150 hover:text-foreground hover:border-border-hover hover:bg-surface-2 select-none"
    >
      {children}
      <span>{label}</span>
    </a>
  );
}

/* ─────────────────────────────────────────────────────────
   SocialIcon — inline SVGs for platforms not in lucide-react
   ───────────────────────────────────────────────────────── */
function SocialIcon({ platform }: { platform: SocialPlatform }) {
  if (platform === "github") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-[15px] h-[15px] shrink-0"
        aria-hidden="true"
      >
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    );
  }

  if (platform === "linkedin") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-[15px] h-[15px] shrink-0"
        aria-hidden="true"
      >
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    );
  }

  // leetcode
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-[15px] h-[15px] shrink-0"
      aria-hidden="true"
    >
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
    </svg>
  );
}
