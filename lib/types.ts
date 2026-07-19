/* ─────────────────────────────────────────────────────────────────────────
   Unified Portfolio Types — single source of truth.
   Used by: public portfolio, admin pages, PortfolioContext, storage layer.
   Every id field is ready to become a Supabase UUID primary key.
   ───────────────────────────────────────────────────────────────────────── */

/* ── Profile ── */
export type AvailabilityStatus =
  | "available"
  | "open-to-work"
  | "employed"
  | "unavailable";

export interface Profile {
  name: string;
  title: string;
  /** Absolute URL or null — null shows initials placeholder */
  photo: string | null;
  phone: string;
  email: string;
  location: string;
  college: string;
  objective: string;
  availability: AvailabilityStatus;
}

/* ── Social Links ── */
export interface SocialLink {
  id: string;
  /** "github" | "linkedin" | "leetcode" | any custom string */
  platform: string;
  label: string;
  url: string;
}

/* ── Education ── */
export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field: string;
  period: string;
  location: string;
  gpa?: string;
  coursework?: string[];
  description?: string;
}

/* ── Skills ── */
export interface SkillCategory {
  id: string;
  name: string;
  /** Ordered array — first element is displayed first */
  skills: string[];
  /** Manual sort order for categories */
  order: number;
}

/* ── Projects ── */
export interface ProjectScreenshot {
  id: string;
  /** Absolute URL or null — null renders the gradient placeholder */
  url: string | null;
  alt: string;
}

export interface ProjectPlaceholder {
  from: string;  // oklch gradient start
  to: string;    // oklch gradient end
  accent: string; // oklch accent colour
}

export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  /** Manual sort order — first (0) is implicitly the most prominent */
  order: number;
  screenshots: ProjectScreenshot[];
  placeholder: ProjectPlaceholder;
}

/* ── Achievements ── */
export interface Achievement {
  id: string;
  title: string;
  description: string;
  date?: string;
}

/* ── External Links ── */
export interface ExternalLink {
  id: string;
  label: string;
  url: string;
  description?: string;
}

/* ── Media Library ── */
export type MediaType = "image" | "document";

export interface MediaItem {
  id: string;
  url: string;
  filename: string;
  type: MediaType;
  size?: number; // bytes
  uploadedAt: string; // ISO 8601
  /** IDs of projects or "profile" where this image is used */
  usedIn?: string[];
}

/* ── Portfolio root aggregate ── */
export interface PortfolioData {
  profile: Profile;
  socialLinks: SocialLink[];
  education: EducationEntry[];
  skills: SkillCategory[];
  projects: Project[];
  achievements: Achievement[];
  externalLinks: ExternalLink[];
  media: MediaItem[];
}

/* ── Context contract ─────────────────────────────────────────────────── */
export interface PortfolioContextValue {
  data: PortfolioData;

  /* ── Profile ── */
  updateProfile: (updates: Partial<Profile>) => void;

  /* ── Social Links ── */
  addSocialLink: (link: Omit<SocialLink, "id">) => void;
  updateSocialLink: (id: string, updates: Partial<Omit<SocialLink, "id">>) => void;
  deleteSocialLink: (id: string) => void;
  reorderSocialLinks: (links: SocialLink[]) => void;

  /* ── Education ── */
  addEducation: (entry: Omit<EducationEntry, "id">) => void;
  deleteEducation: (id: string) => void;
  reorderEducation: (entries: EducationEntry[]) => void;

  /* ── Skills — categories ── */
  addSkillCategory: (name: string) => void;
  renameSkillCategory: (id: string, name: string) => void;
  deleteSkillCategory: (id: string) => void;
  reorderSkillCategories: (categories: SkillCategory[]) => void;
  /* ── Skills — items within a category ── */
  addSkill: (categoryId: string, skill: string) => void;
  removeSkill: (categoryId: string, skill: string) => void;
  reorderSkillsInCategory: (categoryId: string, skills: string[]) => void;

  /* ── Projects ── */
  addProject: (project: Omit<Project, "id" | "order">) => void;
  updateProject: (id: string, updates: Partial<Omit<Project, "id">>) => void;
  deleteProject: (id: string) => void;
  reorderProjects: (projects: Project[]) => void;

  /* ── Achievements ── */
  addAchievement: (a: Omit<Achievement, "id">) => void;
  updateAchievement: (id: string, updates: Partial<Omit<Achievement, "id">>) => void;
  deleteAchievement: (id: string) => void;
  reorderAchievements: (achievements: Achievement[]) => void;

  /* ── External Links ── */
  addExternalLink: (l: Omit<ExternalLink, "id">) => void;
  deleteExternalLink: (id: string) => void;
  reorderExternalLinks: (links: ExternalLink[]) => void;

  /* ── Media ── */
  addMediaItem: (item: Omit<MediaItem, "id" | "uploadedAt">) => void;
  deleteMediaItem: (id: string) => void;
}
