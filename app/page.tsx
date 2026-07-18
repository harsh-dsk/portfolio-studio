import type { Metadata } from "next";
import { AnimatedBackground } from "@/components/ui/AnimatedBackground";
import { SectionContainer } from "@/components/ui/SectionContainer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SecondaryButton } from "@/components/ui/SecondaryButton";
import { Card } from "@/components/ui/Card";
import { ArrowRight, Zap, Layers, Code2, Palette } from "lucide-react";

export const metadata: Metadata = {
  title: "Design System",
  description: "Design foundation preview — components, typography, and tokens.",
};

/* ── Color token preview data ── */
const surfaceTokens = [
  { label: "Background", token: "bg-background", border: true },
  { label: "Surface 0",  token: "bg-surface-0",  border: false },
  { label: "Surface 1",  token: "bg-surface-1",  border: false },
  { label: "Surface 2",  token: "bg-surface-2",  border: false },
  { label: "Surface 3",  token: "bg-surface-3",  border: false },
  { label: "Brand",      token: "bg-brand",       border: false },
];

const typographyTokens = [
  { label: "fg",        cls: "text-foreground",  sample: "Full foreground" },
  { label: "fg-muted",  cls: "text-fg-muted",    sample: "Muted text" },
  { label: "fg-subtle", cls: "text-fg-subtle",   sample: "Subtle / disabled" },
  { label: "brand",     cls: "text-brand",        sample: "Brand accent" },
];

/* ── Component showcase cards ── */
const componentCards = [
  {
    Icon: Palette,
    title: "Design Tokens",
    description:
      "oklch-based color system with 5 surface layers, one brand accent, and a structured foreground scale.",
  },
  {
    Icon: Layers,
    title: "Motion System",
    description:
      "Centralized Framer Motion variants — fadeUp, fadeIn, staggerContainer, pageTransition — used intentionally.",
  },
  {
    Icon: Code2,
    title: "TypeScript First",
    description:
      "Fully typed polymorphic components with compound sub-component patterns and strict prop interfaces.",
  },
  {
    Icon: Zap,
    title: "Performance",
    description:
      "Server components by default, Geist font with swap, CSS-only animations, zero layout shift.",
  },
] as const;

export default function DesignSystemPage() {
  return (
    <main className="relative flex-1" style={{ zIndex: 1 }}>
      <AnimatedBackground />

      {/* ─── Hero ─── */}
      <SectionContainer navOffset>
        <div className="max-w-3xl space-y-6">
          <p className="eyebrow">Foundation Preview</p>

          <h1 className="text-balance">
            Design foundation,{" "}
            <span className="text-fg-muted">built to last.</span>
          </h1>

          <p className="text-base sm:text-lg leading-relaxed text-fg-muted max-w-xl text-pretty">
            A premium design system for a portfolio that feels like a product.
            Minimal, intentional, and crafted with precision.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <PrimaryButton href="#components">
              View components
              <ArrowRight size={15} strokeWidth={2} />
            </PrimaryButton>
            <SecondaryButton href="#tokens">Design tokens</SecondaryButton>
          </div>
        </div>
      </SectionContainer>

      {/* ─── Component cards ─── */}
      <SectionContainer id="components">
        <SectionHeading
          eyebrow="System overview"
          heading="What's inside"
          description="A complete set of primitives ready to be composed into any page."
          animate
        />

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {componentCards.map(({ Icon, title, description }) => (
            <Card key={title} padding="md">
              <div
                className="mb-4 inline-flex p-2 rounded-lg"
                style={{ backgroundColor: "var(--ds-accent-subtle)" }}
              >
                <Icon
                  size={16}
                  strokeWidth={1.75}
                  className="text-brand"
                  style={{ color: "var(--ds-accent)" }}
                />
              </div>
              <Card.Title>{title}</Card.Title>
              <Card.Description>{description}</Card.Description>
            </Card>
          ))}
        </div>
      </SectionContainer>

      {/* ─── Typography ─── */}
      <SectionContainer id="tokens">
        <SectionHeading
          eyebrow="Typography"
          heading="Type scale"
          animate
        />

        <div className="mt-10 space-y-6 pb-10" style={{ borderBottom: "1px solid oklch(1 0 0 / 7%)" }}>
          <div className="space-y-1">
            <p className="text-xs text-fg-subtle mb-2">h1 — Display</p>
            <h1>Elegant precision.</h1>
          </div>
          <div>
            <p className="text-xs text-fg-subtle mb-2">h2 — Section</p>
            <h2>Design with restraint.</h2>
          </div>
          <div>
            <p className="text-xs text-fg-subtle mb-2">h3 — Subsection</p>
            <h3>Every detail considered.</h3>
          </div>
          <div>
            <p className="text-xs text-fg-subtle mb-2">h4 — Card heading</p>
            <h4>Purposeful components.</h4>
          </div>
          <div>
            <p className="text-xs text-fg-subtle mb-2">Body</p>
            <p className="max-w-2xl text-base">
              The quick brown fox jumps over the lazy dog. Body text is set in
              Geist at 16px with a 1.75 line-height, optimised for reading
              comfort across all viewport sizes. Muted foreground at 60%
              lightness.
            </p>
          </div>
          <div>
            <p className="text-xs text-fg-subtle mb-2">Small / caption</p>
            <p className="text-sm text-fg-subtle">
              Small text — used for labels, captions, timestamps, and supporting
              information throughout the interface.
            </p>
          </div>
        </div>

        {/* ─── Color tokens ─── */}
        <div className="mt-12 space-y-6">
          <SectionHeading eyebrow="Colors" heading="Surface & foreground tokens" animate />

          <div className="mt-8 flex flex-wrap gap-5">
            {surfaceTokens.map(({ label, token, border }) => (
              <div key={label} className="flex flex-col items-start gap-2">
                <div
                  className={`w-16 h-16 rounded-xl ${token} ${border ? "border border-border" : ""}`}
                />
                <p className="text-xs text-fg-subtle">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-6">
            {typographyTokens.map(({ label, cls, sample }) => (
              <div key={label} className="flex flex-col gap-1.5">
                <p className={`text-sm font-medium ${cls}`}>{sample}</p>
                <p className="text-xs text-fg-subtle">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ─── Buttons ─── */}
        <div className="mt-14 space-y-6">
          <SectionHeading eyebrow="Buttons" heading="Interactive states" animate />

          <div className="mt-8 flex flex-wrap gap-3">
            <PrimaryButton>Primary action</PrimaryButton>
            <SecondaryButton>Secondary action</SecondaryButton>
            <PrimaryButton size="sm">Small primary</PrimaryButton>
            <SecondaryButton size="sm">Small secondary</SecondaryButton>
            <PrimaryButton size="lg">
              Large primary
              <ArrowRight size={16} strokeWidth={2} />
            </PrimaryButton>
            <PrimaryButton disabled>Disabled</PrimaryButton>
          </div>
        </div>

        {/* ─── Cards ─── */}
        <div className="mt-14 space-y-6">
          <SectionHeading eyebrow="Cards" heading="Surface components" animate />

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <Card.Header>
                <Card.Title>Default card</Card.Title>
                <Card.Description>
                  Hover to see the lift animation. Border brightens and a
                  shadow appears.
                </Card.Description>
              </Card.Header>
              <Card.Footer>
                <p className="text-xs text-fg-subtle">Surface 1 · hover lift</p>
              </Card.Footer>
            </Card>

            <Card padding="lg">
              <Card.Header>
                <Card.Title>Large padding</Card.Title>
                <Card.Description>
                  More breathing room for featured content, testimonials,
                  or key stats.
                </Card.Description>
              </Card.Header>
            </Card>

            <Card hover={false} padding="sm">
              <Card.Header>
                <Card.Title>Static card</Card.Title>
                <Card.Description>
                  No hover effect — for embedded informational panels that
                  shouldn't appear interactive.
                </Card.Description>
              </Card.Header>
            </Card>
          </div>
        </div>

        {/* ─── Motion note ─── */}
        <div className="mt-14">
          <Card hover={false}>
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div
                className="shrink-0 inline-flex p-2.5 rounded-lg"
                style={{ backgroundColor: "var(--ds-accent-subtle)" }}
              >
                <Zap
                  size={16}
                  strokeWidth={1.75}
                  style={{ color: "var(--ds-accent)" }}
                />
              </div>
              <div>
                <Card.Title>Motion system</Card.Title>
                <Card.Description className="mt-2 max-w-lg">
                  Animations are loaded from{" "}
                  <code className="text-xs px-1.5 py-0.5 rounded bg-surface-2 text-foreground font-mono">
                    lib/motion.ts
                  </code>{" "}
                  and used sparingly. Available variants:{" "}
                  <code className="text-xs px-1.5 py-0.5 rounded bg-surface-2 text-foreground font-mono">
                    fadeUp
                  </code>
                  ,{" "}
                  <code className="text-xs px-1.5 py-0.5 rounded bg-surface-2 text-foreground font-mono">
                    fadeIn
                  </code>
                  ,{" "}
                  <code className="text-xs px-1.5 py-0.5 rounded bg-surface-2 text-foreground font-mono">
                    staggerContainer
                  </code>
                  ,{" "}
                  <code className="text-xs px-1.5 py-0.5 rounded bg-surface-2 text-foreground font-mono">
                    pageTransition
                  </code>
                  . Scroll up — the section headings used{" "}
                  <code className="text-xs px-1.5 py-0.5 rounded bg-surface-2 text-foreground font-mono">
                    animate
                  </code>{" "}
                  prop to trigger on viewport entry.
                </Card.Description>
              </div>
            </div>
          </Card>
        </div>
      </SectionContainer>
    </main>
  );
}
