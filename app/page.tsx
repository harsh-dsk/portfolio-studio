import type { Metadata } from "next";
import { PublicPortfolio } from "@/components/portfolio/PublicPortfolio";

export const metadata: Metadata = {
  title: "Harshdeep Singh — Full Stack Developer",
  description:
    "Full Stack Developer specializing in React, Next.js, and TypeScript. Building thoughtful digital products with care and precision.",
};

/**
 * HomePage
 *
 * Server component — minimal shell.
 * All data fetching and rendering happens inside PublicPortfolio (client).
 *
 * SUPABASE MIGRATION:
 *  Fetch data here as a server component and pass as `initialData` prop
 *  to PublicPortfolio to avoid the localStorage cold-start flash.
 */
export default function HomePage() {
  return <PublicPortfolio />;
}
