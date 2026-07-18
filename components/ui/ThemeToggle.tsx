"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "portfolio-theme";

/* ── Inline SVG icons to avoid lucide version issues ── */
function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-[15px] h-[15px]"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-[15px] h-[15px]"
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

/**
 * ThemeToggle
 *
 * Reads and persists the user's preferred theme ("dark" | "light") in
 * localStorage under the key "portfolio-theme".
 *
 * The toggle adds/removes the "dark" and "light" classes on <html>; the
 * corresponding CSS variable overrides in globals.css / light-mode.css pick
 * up the change automatically.
 */
export function ThemeToggle() {
  // Initialise from DOM state (set by the inline script in layout.tsx)
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.remove("dark");
      html.classList.add("light");
      localStorage.setItem(STORAGE_KEY, "light");
      setIsDark(false);
    } else {
      html.classList.remove("light");
      html.classList.add("dark");
      localStorage.setItem(STORAGE_KEY, "dark");
      setIsDark(true);
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-border text-fg-muted bg-surface-1 hover:text-foreground hover:border-border-hover hover:bg-surface-2 transition-all duration-150 shrink-0"
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
