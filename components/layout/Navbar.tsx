"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

/**
 * Navbar (minimal)
 *
 * Public-facing bar: wordmark on the left, theme toggle on the right.
 * Gains a blurred glass background once the user scrolls past 24 px.
 * Hidden entirely on /admin/* routes.
 */
export function Navbar() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      role="banner"
      className="fixed top-0 inset-x-0 z-50 h-14 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? "oklch(0.09 0.002 250 / 88%)" : "transparent",
        backdropFilter: scrolled ? "blur(14px) saturate(1.4)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(14px) saturate(1.4)" : "none",
        borderBottom: scrolled
          ? "1px solid oklch(1 0 0 / 7%)"
          : "1px solid transparent",
      }}
    >
      <div className="container-page h-full flex items-center justify-between">
        {/* Wordmark */}
        <Link
          href="/"
          className="text-[15px] font-medium tracking-[-0.02em] text-foreground transition-opacity duration-150 hover:opacity-70"
          aria-label="Harshdeep — home"
        >
          Harshdeep
        </Link>

        {/* Theme toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}
