import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import "@/app/admin-forms.css";

export const metadata: Metadata = {
  title: { default: "Admin — Portfolio CMS", template: "%s — Admin" },
  robots: { index: false, follow: false },
};

/**
 * Admin Layout
 *
 * Wraps all /admin/* pages with the AdminShell (sidebar + topnav).
 * The public Navbar returns null on /admin/* routes (handled in Navbar.tsx).
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
