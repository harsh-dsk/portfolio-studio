/**
 * lib/storage.ts
 *
 * Persistence layer abstraction.
 *
 * Current implementation: localStorage (browser-only, no backend needed).
 *
 * SUPABASE MIGRATION PATH (next sprint):
 *   Replace `loadPortfolioData()` with an async call to Supabase.
 *   Replace `savePortfolioData()` with Supabase upsert.
 *   The PortfolioContext calls these functions — no other files change.
 */

import type { PortfolioData } from "./types";

/** Bump this version if the data schema changes in a breaking way. */
const STORAGE_KEY = "portfolio-cms-v1";

/* ── Load ─────────────────────────────────────────────────────────────── */

/**
 * Load portfolio data from localStorage.
 * Returns null if:
 *  - not in a browser environment (SSR)
 *  - nothing is stored yet
 *  - the stored JSON is corrupt
 */
export function loadPortfolioData(): PortfolioData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PortfolioData;
  } catch {
    return null;
  }
}

/* ── Save ─────────────────────────────────────────────────────────────── */

/**
 * Persist portfolio data to localStorage.
 * Silently warns on quota errors — does not throw.
 */
export function savePortfolioData(data: PortfolioData): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // Storage quota exceeded or private-browsing restriction
    console.warn("[Portfolio CMS] Could not save to localStorage:", e);
  }
}

/* ── Reset ────────────────────────────────────────────────────────────── */

/**
 * Wipe stored data.
 * Used by the Settings page "Reset to defaults" action.
 */
export function clearPortfolioData(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

/* ── Storage event key (exported for listeners) ──────────────────────── */
export const STORAGE_EVENT_KEY = STORAGE_KEY;
