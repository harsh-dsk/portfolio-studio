import Link from "next/link";
import { Globe, GitBranch, AtSign, ArrowUpRight } from "lucide-react";

const NAV_LINKS = [
  { label: "Work",    href: "#work" },
  { label: "About",   href: "#about" },
  { label: "Writing", href: "#writing" },
  { label: "Contact", href: "#contact" },
] as const;

const SOCIAL_LINKS = [
  { label: "GitHub",   href: "https://github.com",   Icon: GitBranch },
  { label: "Twitter",  href: "https://twitter.com",  Icon: AtSign },
  { label: "Website",  href: "https://harshdeep.dev", Icon: Globe },
] as const;

/**
 * Footer
 *
 * Minimal three-column layout: brand + tagline / navigation / social links.
 * Followed by a bottom bar with copyright.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="mt-auto w-full"
      style={{ borderTop: "1px solid oklch(1 0 0 / 8%)" }}
    >
      <div className="container-page py-12 lg:py-16">
        {/* ── Three-column grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">

          {/* Column 1: Brand */}
          <div className="space-y-3">
            <Link
              href="/"
              className="inline-block text-[15px] font-medium tracking-[-0.02em] text-foreground transition-opacity duration-150 hover:opacity-70"
            >
              Harshdeep
            </Link>
            <p className="text-sm leading-relaxed text-fg-muted max-w-[200px]">
              Building thoughtful products with care and craft.
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div className="space-y-4">
            <p className="eyebrow">Navigation</p>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-fg-muted hover:text-foreground transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Social */}
          <div className="space-y-4">
            <p className="eyebrow">Connect</p>
            <ul className="space-y-2.5">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-fg-muted hover:text-foreground transition-colors duration-150 group"
                  >
                    <Icon
                      size={13}
                      strokeWidth={1.75}
                      className="shrink-0 transition-colors duration-150"
                    />
                    {label}
                    <ArrowUpRight
                      size={11}
                      strokeWidth={1.75}
                      className="shrink-0 opacity-0 group-hover:opacity-60 transition-opacity duration-150"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid oklch(1 0 0 / 6%)" }}
        >
          <p className="text-xs text-fg-subtle order-2 sm:order-1">
            © {year} Harshdeep. All rights reserved.
          </p>
          <p className="text-xs text-fg-subtle order-1 sm:order-2">
            Designed &amp; built with care.
          </p>
        </div>
      </div>
    </footer>
  );
}
