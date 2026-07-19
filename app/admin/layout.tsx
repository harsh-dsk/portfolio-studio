import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { PortfolioProvider } from "@/lib/context/PortfolioContext";
import "@/app/admin-forms.css";

export const metadata: Metadata = {
  title: { default: "Admin — Portfolio CMS", template: "%s — Admin" },
  robots: { index: false, follow: false },
};

/**
 * Admin Layout
 *
 * Wraps all /admin/* pages with:
 *  1. PortfolioProvider — centralized state management (swap internals for Supabase next sprint)
 *  2. AdminShell — sidebar + topnav
 *
 * The public Navbar returns null on /admin/* routes (handled in Navbar.tsx).
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <PortfolioProvider>
      <AdminShell>{children}</AdminShell>
    </PortfolioProvider>
  );
}
