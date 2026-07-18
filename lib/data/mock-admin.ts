import { resumeData } from "./resume";

/* ── Re-export public resume data for admin use ── */
export { resumeData };

/* ── Dashboard statistics ── */
export const adminStats = {
  projects: resumeData.projects.length,
  skills: resumeData.skills.reduce((acc, cat) => acc + cat.skills.length, 0),
  achievements: resumeData.achievements.length,
  externalLinks: resumeData.externalLinks.length,
} as const;

/* ── Admin skills — includes extra "Languages" category ── */
export const adminSkills: Record<string, string[]> = {
  Languages:  ["JavaScript", "TypeScript", "Python", "SQL"],
  Frontend:   ["React", "Next.js", "Tailwind CSS", "HTML5", "CSS3"],
  Backend:    ["Node.js", "Express.js", "REST APIs", "GraphQL"],
  Database:   ["PostgreSQL", "MongoDB", "Redis", "Supabase"],
  Tools:      ["Git", "GitHub Actions", "Vercel", "Docker", "Postman"],
};

/* ── Sidebar navigation items ── */
export const ADMIN_NAV = [
  { label: "Dashboard",      href: "/admin",               icon: "LayoutDashboard" },
  { label: "Profile",        href: "/admin/profile",       icon: "User" },
  { label: "Social Buttons", href: "/admin/social",        icon: "Share2" },
  { label: "Education",      href: "/admin/education",     icon: "BookOpen" },
  { label: "Skills",         href: "/admin/skills",        icon: "Zap" },
  { label: "Projects",       href: "/admin/projects",      icon: "FolderOpen" },
  { label: "Achievements",   href: "/admin/achievements",  icon: "Trophy" },
  { label: "External Links", href: "/admin/external-links","icon": "ExternalLink" },
  { label: "Resume",         href: "/admin/resume",        icon: "FileText" },
] as const;

export const ADMIN_SETTINGS = { label: "Settings", href: "/admin/settings", icon: "Settings" } as const;
