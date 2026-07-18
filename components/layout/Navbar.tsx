"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Work",    href: "#work" },
  { label: "About",   href: "#about" },
  { label: "Writing", href: "#writing" },
] as const;

/**
 * Navbar
 *
 * Fixed top navigation. Transparent at page top; gains a blurred background
 * and a hairline border once the user scrolls past 24px.
 *
 * Layout (desktop):
 *   [Wordmark]   [Work · About · Writing]   [Resume] [Contact]
 *
 * Layout (mobile):
 *   [Wordmark]   [☰ / ✕]
 *   → Slide-down overlay menu
 */
export function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  /* Scroll listener */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll(); // initialise
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Close mobile menu on desktop breakpoint */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      {/* ── Main bar ── */}
      <header
        role="banner"
        className="fixed top-0 inset-x-0 z-50 h-16 transition-all duration-300"
        style={{
          backgroundColor: scrolled
            ? "oklch(0.09 0.002 250 / 88%)"
            : "transparent",
          backdropFilter: scrolled ? "blur(14px) saturate(1.4)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(14px) saturate(1.4)" : "none",
          borderBottom: scrolled
            ? "1px solid oklch(1 0 0 / 6%)"
            : "1px solid transparent",
        }}
      >
        <nav
          className="container-page h-full flex items-center"
          aria-label="Main navigation"
        >
          {/* Wordmark */}
          <Link
            href="/"
            className="text-[15px] font-medium tracking-[-0.02em] text-foreground transition-opacity duration-150 hover:opacity-70 shrink-0"
            aria-label="Harshdeep — home"
          >
            Harshdeep
          </Link>

          {/* Nav links — centered via absolute positioning */}
          <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 text-sm text-fg-muted rounded-md transition-colors duration-150 hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2 ml-auto">
            <a
              id="nav-resume"
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center h-8 px-3.5 text-xs font-medium text-fg-muted rounded-lg border border-border bg-transparent transition-all duration-150 hover:text-foreground hover:border-border-hover hover:bg-[oklch(1_0_0_/_4%)]"
            >
              Resume
            </a>
            <a
              id="nav-contact"
              href="#contact"
              className="inline-flex items-center h-8 px-3.5 text-xs font-medium text-brand-fg rounded-lg transition-all duration-150 bg-brand hover:bg-brand-hover active:scale-[0.97]"
            >
              Contact
            </a>
          </div>

          {/* Mobile: hamburger */}
          <button
            id="nav-menu-toggle"
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden ml-auto p-2 -mr-2 text-fg-muted hover:text-foreground rounded-md transition-colors duration-150"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <AnimatePresence mode="wait" initial={false}>
              {menuOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 45, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X size={20} strokeWidth={1.75} />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate: 45, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -45, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu size={20} strokeWidth={1.75} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </nav>
      </header>

      {/* ── Mobile menu overlay ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 md:hidden"
              style={{ backgroundColor: "oklch(0 0 0 / 40%)" }}
              onClick={() => setMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Menu panel */}
            <motion.div
              id="mobile-menu"
              key="menu"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-16 inset-x-0 z-40 md:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              style={{
                backgroundColor: "oklch(0.11 0.003 250 / 97%)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                borderBottom: "1px solid oklch(1 0 0 / 7%)",
              }}
            >
              <div className="container-page py-4 space-y-0.5">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.2 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center w-full px-3 py-3 text-sm font-medium text-fg-muted hover:text-foreground rounded-lg hover:bg-[oklch(1_0_0_/_4%)] transition-colors duration-150"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                {/* Mobile CTAs */}
                <div
                  className="pt-4 mt-3 grid grid-cols-2 gap-2"
                  style={{ borderTop: "1px solid oklch(1 0 0 / 8%)" }}
                >
                  <a
                    href="/resume.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center h-10 px-4 text-sm font-medium text-fg-muted rounded-lg border border-border hover:text-foreground hover:border-border-hover transition-all duration-150"
                  >
                    Resume
                  </a>
                  <a
                    href="#contact"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center h-10 px-4 text-sm font-medium text-brand-fg rounded-lg bg-brand hover:bg-brand-hover transition-all duration-150"
                  >
                    Contact
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
