import type { PortfolioData } from "../types";

/**
 * initialPortfolioData
 *
 * Default mock data used when localStorage has no stored data.
 * Public portfolio and admin context both start from this.
 * Replace with a Supabase fetch in the next sprint.
 */
export const initialPortfolioData: PortfolioData = {

  /* ── Profile ── */
  profile: {
    name: "Harshdeep Singh",
    title: "Full Stack Developer",
    photo: null,
    phone: "+91 98765 43210",
    email: "harshdeep@example.com",
    location: "Chandigarh, India",
    college: "Chandigarh University",
    objective:
      "A passionate Full Stack Developer with hands-on experience building scalable web applications using modern JavaScript technologies. Focused on writing clean, maintainable code and delivering exceptional user experiences. Seeking opportunities to contribute to impactful products and grow as an engineer within a collaborative team environment.",
    availability: "available",
  },

  /* ── Social Links ── */
  socialLinks: [
    { id: "sl-1", platform: "github",   label: "GitHub",   url: "https://github.com" },
    { id: "sl-2", platform: "linkedin", label: "LinkedIn", url: "https://linkedin.com" },
    { id: "sl-3", platform: "leetcode", label: "LeetCode", url: "https://leetcode.com" },
  ],

  /* ── Education ── */
  education: [
    {
      id: "edu-1",
      institution: "Chandigarh University",
      degree: "Bachelor of Engineering",
      field: "Computer Science & Engineering",
      period: "2021 – 2025",
      location: "Chandigarh, India",
      gpa: "8.5 / 10",
      coursework: [
        "Data Structures & Algorithms",
        "Database Management Systems",
        "Operating Systems",
        "Computer Networks",
        "Software Engineering",
      ],
    },
  ],

  /* ── Skills ── */
  skills: [
    { id: "sk-1", name: "Languages",       order: 0, skills: ["JavaScript", "TypeScript", "Python", "SQL"] },
    { id: "sk-2", name: "Frontend",        order: 1, skills: ["React", "Next.js", "Tailwind CSS", "HTML5", "CSS3"] },
    { id: "sk-3", name: "Backend",         order: 2, skills: ["Node.js", "Express.js", "REST APIs", "GraphQL"] },
    { id: "sk-4", name: "Database",        order: 3, skills: ["PostgreSQL", "MongoDB", "Redis", "Supabase"] },
    { id: "sk-5", name: "Tools & DevOps",  order: 4, skills: ["Git", "GitHub Actions", "Vercel", "Docker", "Postman"] },
  ],

  /* ── Projects ── */
  projects: [
    {
      id: "proj-devflow",
      title: "DevFlow",
      shortDescription:
        "AI-powered developer productivity platform combining task management, code snippets, and documentation in one keyboard-first workspace.",
      fullDescription:
        "DevFlow is a unified workspace built for developers who want to stay in the zone. It combines task management, persistent code snippet storage, and inline documentation — all searchable with a command palette. Built with Next.js 15 and Supabase, it uses OpenAI to auto-summarise tasks and suggest related snippets. The real-time collaboration engine uses Supabase Realtime channels so teams stay in sync without page refreshes.",
      techStack: ["Next.js 15", "TypeScript", "Supabase", "OpenAI API", "Tailwind CSS"],
      liveUrl: "https://devflow.example.com",
      githubUrl: "https://github.com/example/devflow",
      order: 0,
      placeholder: { from: "oklch(0.15 0.07 258)", to: "oklch(0.11 0.05 278)", accent: "oklch(0.63 0.19 251)" },
      screenshots: [
        { id: "df-ss-1", url: null, alt: "DevFlow dashboard overview" },
        { id: "df-ss-2", url: null, alt: "DevFlow task board" },
        { id: "df-ss-3", url: null, alt: "DevFlow snippet library" },
      ],
    },
    {
      id: "proj-lumina",
      title: "Lumina DS",
      shortDescription:
        "Production-ready accessible React component library. 40+ components, full TypeScript support, and WCAG 2.1 AA compliance by default.",
      fullDescription:
        "Lumina DS is a design system built for teams who need accessible, type-safe, and themeable React components out of the box. Every component ships with ARIA attributes, keyboard navigation, screen-reader announcements, and a comprehensive Storybook documentation. The theming system is powered by CSS custom properties so switching themes requires zero JavaScript. CI runs Axe accessibility audits on every pull request.",
      techStack: ["React", "TypeScript", "CSS Variables", "Storybook", "Rollup"],
      liveUrl: "https://lumina.example.com",
      githubUrl: "https://github.com/example/lumina",
      order: 1,
      placeholder: { from: "oklch(0.15 0.05 195)", to: "oklch(0.11 0.04 215)", accent: "oklch(0.70 0.17 195)" },
      screenshots: [
        { id: "lu-ss-1", url: null, alt: "Lumina DS component gallery" },
        { id: "lu-ss-2", url: null, alt: "Lumina DS button variants" },
        { id: "lu-ss-3", url: null, alt: "Lumina DS form components" },
        { id: "lu-ss-4", url: null, alt: "Lumina DS dark mode" },
      ],
    },
    {
      id: "proj-pathfinder",
      title: "Pathfinder",
      shortDescription:
        "Route optimization SaaS helping logistics teams cut delivery time by 30% through intelligent scheduling and live driver tracking.",
      fullDescription:
        "Pathfinder solves the last-mile delivery problem for small logistics companies that can't afford enterprise software. The intelligent scheduler batches nearby deliveries, accounts for traffic patterns, and reassigns routes in real-time when a driver checks in late. The live map uses WebSockets to push driver positions every 5 seconds. The analytics dashboard shows on-time rates, distance driven, and cost-per-delivery trends over time.",
      techStack: ["Next.js", "Go", "PostgreSQL", "WebSockets", "Mapbox GL"],
      githubUrl: "https://github.com/example/pathfinder",
      order: 2,
      placeholder: { from: "oklch(0.14 0.06 38)", to: "oklch(0.11 0.04 22)", accent: "oklch(0.72 0.18 38)" },
      screenshots: [
        { id: "pf-ss-1", url: null, alt: "Pathfinder route map" },
        { id: "pf-ss-2", url: null, alt: "Pathfinder analytics dashboard" },
        { id: "pf-ss-3", url: null, alt: "Pathfinder driver tracking" },
      ],
    },
  ],

  /* ── Achievements ── */
  achievements: [
    {
      id: "ach-1",
      title: "LeetCode — 500+ Problems Solved",
      description:
        "Consistently solved algorithmic challenges across easy, medium, and hard difficulty. Ranked in the top 15% globally on the platform.",
      date: "2024",
    },
    {
      id: "ach-2",
      title: "Hackathon Winner — DevHack 2024",
      description:
        "Led a 4-person team to build a real-time collaborative code editor in 24 hours, winning first place among 80+ participating teams.",
      date: "Mar 2024",
    },
    {
      id: "ach-3",
      title: "Open Source Contributor",
      description:
        "Contributed to 3 open-source projects with over 1,000 combined GitHub stars, including bug fixes, documentation improvements, and new features.",
      date: "2023 – Present",
    },
    {
      id: "ach-4",
      title: "Google Cloud Certified — Associate Cloud Engineer",
      description:
        "Earned Google Cloud Associate Cloud Engineer certification, demonstrating proficiency in deploying and managing cloud infrastructure.",
      date: "Nov 2023",
    },
  ],

  /* ── External Links ── */
  externalLinks: [
    {
      id: "el-1",
      label: "Personal Blog",
      url: "https://blog.example.com",
      description: "Technical writing on web development, system design, and engineering best practices.",
    },
    {
      id: "el-2",
      label: "GitHub Profile",
      url: "https://github.com/example",
      description: "Open source contributions, personal projects, and code samples.",
    },
    {
      id: "el-3",
      label: "Dev.to Articles",
      url: "https://dev.to/example",
      description: "Published articles on React patterns, TypeScript tips, and developer tooling.",
    },
  ],

  /* ── Media ── */
  media: [],
};

/* ── Dashboard stats helper ── */
export function computeStats(data: PortfolioData) {
  const totalSkills = data.skills.reduce((n, c) => n + c.skills.length, 0);

  const filledFields = [
    !!data.profile.photo,
    !!data.profile.name,
    !!data.profile.title,
    !!data.profile.phone,
    !!data.profile.email,
    !!data.profile.location,
    !!data.profile.college,
    !!data.profile.objective,
    data.projects.length > 0,
    totalSkills > 0,
    data.socialLinks.length > 0,
    data.education.length > 0,
  ];

  return {
    projects: data.projects.length,
    skills: totalSkills,
    achievements: data.achievements.length,
    externalLinks: data.externalLinks.length,
    mediaItems: data.media.length,
    completion: Math.round((filledFields.filter(Boolean).length / filledFields.length) * 100),
  };
}
