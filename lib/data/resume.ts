/* ── Type definitions ── */

export type SocialPlatform = "github" | "linkedin" | "leetcode";

export interface ContactItem {
  type: "phone" | "email" | "location" | "college";
  value: string;
  href?: string;
}

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  url: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  period: string;
  location: string;
  gpa?: string;
  coursework?: string[];
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface ResumeProject {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  placeholder: {
    from: string;
    to: string;
    accent: string;
  };
}

export interface Achievement {
  title: string;
  description: string;
  date?: string;
}

export interface ExternalLink {
  label: string;
  url: string;
  description?: string;
}

/* ── Placeholder data — replace via admin dashboard ── */

export const resumeData = {
  profile: {
    name: "Harshdeep Singh",
    title: "Full Stack Developer",
    /** Replace with a URL string when a real photo is available */
    photo: null as string | null,
  },

  contact: [
    { type: "phone",    value: "+91 98765 43210",         href: "tel:+919876543210" },
    { type: "email",    value: "harshdeep@example.com",   href: "mailto:harshdeep@example.com" },
    { type: "location", value: "Chandigarh, India" },
    { type: "college",  value: "Chandigarh University" },
  ] satisfies ContactItem[],

  socialLinks: [
    { platform: "github",   label: "GitHub",   url: "https://github.com" },
    { platform: "linkedin", label: "LinkedIn", url: "https://linkedin.com" },
    { platform: "leetcode", label: "LeetCode", url: "https://leetcode.com" },
  ] satisfies SocialLink[],

  objective:
    "A passionate Full Stack Developer with hands-on experience building scalable web applications using modern JavaScript technologies. Focused on writing clean, maintainable code and delivering exceptional user experiences. Seeking opportunities to contribute to impactful products and grow as an engineer within a collaborative team environment.",

  education: [
    {
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
  ] satisfies Education[],

  skills: [
    {
      category: "Frontend",
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML5", "CSS3"],
    },
    {
      category: "Backend",
      skills: ["Node.js", "Express.js", "REST APIs", "GraphQL"],
    },
    {
      category: "Database",
      skills: ["PostgreSQL", "MongoDB", "Redis", "Supabase"],
    },
    {
      category: "Tools & DevOps",
      skills: ["Git", "GitHub Actions", "Vercel", "Docker", "Postman"],
    },
  ] satisfies SkillCategory[],

  projects: [
    {
      id: "devflow",
      title: "DevFlow",
      description:
        "AI-powered developer productivity platform combining task management, code snippet storage, and documentation in one fast, keyboard-first workspace.",
      techStack: ["Next.js 15", "TypeScript", "Supabase", "OpenAI API"],
      liveUrl: "https://devflow.example.com",
      githubUrl: "https://github.com/example/devflow",
      placeholder: {
        from: "oklch(0.15 0.07 258)",
        to: "oklch(0.11 0.05 278)",
        accent: "oklch(0.63 0.19 251)",
      },
    },
    {
      id: "lumina-ds",
      title: "Lumina DS",
      description:
        "Production-ready accessible React component library. 40+ components, full TypeScript support, WCAG 2.1 AA compliance by default.",
      techStack: ["React", "TypeScript", "CSS Variables", "Storybook"],
      liveUrl: "https://lumina.example.com",
      githubUrl: "https://github.com/example/lumina",
      placeholder: {
        from: "oklch(0.15 0.05 195)",
        to: "oklch(0.11 0.04 215)",
        accent: "oklch(0.70 0.17 195)",
      },
    },
    {
      id: "pathfinder",
      title: "Pathfinder",
      description:
        "Route optimization SaaS helping small logistics teams reduce delivery time by 30% through intelligent scheduling, live driver tracking, and analytics.",
      techStack: ["Next.js", "Go", "PostgreSQL", "WebSockets"],
      githubUrl: "https://github.com/example/pathfinder",
      placeholder: {
        from: "oklch(0.14 0.06 38)",
        to: "oklch(0.11 0.04 22)",
        accent: "oklch(0.72 0.18 38)",
      },
    },
  ] satisfies ResumeProject[],

  achievements: [
    {
      title: "LeetCode — 500+ Problems Solved",
      description:
        "Consistently solved algorithmic challenges across easy, medium, and hard difficulty. Ranked in top 15% globally on the platform.",
      date: "2024",
    },
    {
      title: "Hackathon Winner — DevHack 2024",
      description:
        "Led a 4-person team to build a real-time collaborative code editor in 24 hours, winning first place among 80+ participating teams.",
      date: "Mar 2024",
    },
    {
      title: "Open Source Contributor",
      description:
        "Contributed to 3 open-source projects with over 1,000 combined GitHub stars, including bug fixes, documentation, and new features.",
      date: "2023 – Present",
    },
    {
      title: "Google Cloud Certified — Associate Cloud Engineer",
      description:
        "Earned Google Cloud Associate Cloud Engineer certification, demonstrating proficiency in deploying and managing cloud infrastructure.",
      date: "Nov 2023",
    },
  ] satisfies Achievement[],

  externalLinks: [
    {
      label: "Personal Blog",
      url: "https://blog.example.com",
      description: "Technical writing on web development, system design, and engineering best practices.",
    },
    {
      label: "GitHub Profile",
      url: "https://github.com/example",
      description: "Open source contributions, personal projects, and code samples.",
    },
    {
      label: "Dev.to Articles",
      url: "https://dev.to/example",
      description: "Published articles on React patterns, TypeScript tips, and developer tooling.",
    },
  ] satisfies ExternalLink[],
};
