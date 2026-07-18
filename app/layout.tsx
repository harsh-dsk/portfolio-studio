import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

/* ── Fonts ── */
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/* ── SEO Metadata ── */
export const metadata: Metadata = {
  metadataBase: new URL("https://harshdeep.dev"),
  title: {
    default: "Harshdeep — Designer & Developer",
    template: "%s — Harshdeep",
  },
  description:
    "Portfolio of Harshdeep — a designer and developer crafting thoughtful digital products with care and precision.",
  keywords: [
    "portfolio",
    "frontend developer",
    "UI designer",
    "product design",
    "Next.js",
    "React",
  ],
  authors: [{ name: "Harshdeep" }],
  creator: "Harshdeep",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Harshdeep",
    title: "Harshdeep — Designer & Developer",
    description:
      "Portfolio of Harshdeep — a designer and developer crafting thoughtful digital products.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Harshdeep — Designer & Developer",
    description:
      "Portfolio of Harshdeep — a designer and developer crafting thoughtful digital products.",
    creator: "@harshdeep",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0f",
  width: "device-width",
  initialScale: 1,
};

/* ── Root Layout ── */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // Force dark mode — this is a dark-first product
      className={`${geistSans.variable} ${geistMono.variable} dark`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh flex flex-col bg-background text-foreground antialiased">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
