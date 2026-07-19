import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./light-mode.css";

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

/* ── SEO ── */
export const metadata: Metadata = {
  metadataBase: new URL("https://harshdeep.dev"),
  title: {
    default: "Harshdeep — Designer & Developer",
    template: "%s — Harshdeep",
  },
  description:
    "Portfolio of Harshdeep — a designer and developer crafting thoughtful digital products with care and precision.",
  keywords: ["portfolio", "frontend developer", "UI designer", "Next.js", "React"],
  authors: [{ name: "Harshdeep" }],
  creator: "Harshdeep",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Harshdeep",
    title: "Harshdeep — Designer & Developer",
    description: "Portfolio of Harshdeep — a designer and developer crafting thoughtful digital products.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Harshdeep — Designer & Developer",
    description: "Portfolio of Harshdeep — a designer and developer crafting thoughtful digital products.",
    creator: "@harshdeep",
  },
  robots: { index: true, follow: true },
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
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/*
         * Theme restoration — runs synchronously before first paint.
         * Reads localStorage and applies "dark" or "light" class to <html>.
         */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('portfolio-theme')||'light';document.documentElement.classList.add(t);}catch(e){document.documentElement.classList.add('light');}})();`,
          }}
        />
      </head>
      <body
        className="min-h-dvh flex flex-col bg-background text-foreground antialiased"
        suppressHydrationWarning
      >
        {/* Navbar removed — public portfolio has its own inline header */}
        {children}
      </body>
    </html>
  );
}
