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
  isVisible?: boolean;
  includeInResume?: boolean;
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
  isVisible?: boolean;
  includeInResume?: boolean;
}

/* ── Skills ── */
export interface SkillCategory {
  id: string;
  name: string;
  /** Ordered array — first element is displayed first */
  skills: string[];
  /** Manual sort order for categories */
  order: number;
  isVisible?: boolean;
  includeInResume?: boolean;
}

/* ── Projects ── */
export interface ProjectScreenshot {
  id: string;
  /** Absolute URL or null — null renders the gradient placeholder */
  url: string | null;
  alt: string;
  storagePath?: string;
  isCover?: boolean;
  sortOrder?: number;
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
  isVisible?: boolean;
  includeInResume?: boolean;
  coverImage?: string | null;
}

/* ── Achievements ── */
export interface Achievement {
  id: string;
  title: string;
  description: string;
  date?: string;
  isVisible?: boolean;
  includeInResume?: boolean;
}

/* ── External Links ── */
export interface ExternalLink {
  id: string;
  label: string;
  url: string;
  description?: string;
  isVisible?: boolean;
  includeInResume?: boolean;
}

/* ── Resume Settings & Theme Accent ── */
export type AccentColor = 'blue' | 'purple' | 'green' | 'orange';

export interface ResumeSettings {
  id?: string;
  selectedTemplate: string;
  accentColor?: AccentColor;
  resumeMode: 'dynamic' | 'uploaded';
  resumePdfUrl?: string | null;
  resumeStoragePath?: string | null;
  uploadedAt?: string | null;
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
  resumeSettings?: ResumeSettings;
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
  toggleSocialLinkVisibility: (id: string, isVisible: boolean) => void;
  toggleSocialLinkResume: (id: string, includeInResume: boolean) => void;

  /* ── Education ── */
  addEducation: (entry: Omit<EducationEntry, "id">) => void;
  deleteEducation: (id: string) => void;
  reorderEducation: (entries: EducationEntry[]) => void;
  toggleEducationVisibility: (id: string, isVisible: boolean) => void;
  toggleEducationResume: (id: string, includeInResume: boolean) => void;

  /* ── Skills — categories ── */
  addSkillCategory: (name: string) => void;
  renameSkillCategory: (id: string, name: string) => void;
  deleteSkillCategory: (id: string) => void;
  reorderSkillCategories: (categories: SkillCategory[]) => void;
  toggleSkillCategoryVisibility: (id: string, isVisible: boolean) => void;
  toggleSkillCategoryResume: (id: string, includeInResume: boolean) => void;

  /* ── Skills — items within a category ── */
  addSkill: (categoryId: string, skill: string) => void;
  removeSkill: (categoryId: string, skill: string) => void;
  reorderSkillsInCategory: (categoryId: string, skills: string[]) => void;

  /* ── Projects ── */
  addProject: (project: Omit<Project, "id" | "order">) => void;
  updateProject: (id: string, updates: Partial<Omit<Project, "id">>) => void;
  deleteProject: (id: string) => void;
  reorderProjects: (projects: Project[]) => void;
  toggleProjectVisibility: (id: string, isVisible: boolean) => void;
  toggleProjectResume: (id: string, includeInResume: boolean) => void;
  setCoverImage: (projectId: string, imageId: string) => Promise<void>;
  reorderProjectImages: (projectId: string, images: ProjectScreenshot[]) => Promise<void>;
  deleteProjectImage: (projectId: string, imageId: string, storagePath?: string) => Promise<void>;

  /* ── Achievements ── */
  addAchievement: (a: Omit<Achievement, "id">) => void;
  updateAchievement: (id: string, updates: Partial<Omit<Achievement, "id">>) => void;
  deleteAchievement: (id: string) => void;
  reorderAchievements: (achievements: Achievement[]) => void;
  toggleAchievementVisibility: (id: string, isVisible: boolean) => void;
  toggleAchievementResume: (id: string, includeInResume: boolean) => void;

  /* ── External Links ── */
  addExternalLink: (l: Omit<ExternalLink, "id">) => void;
  deleteExternalLink: (id: string) => void;
  reorderExternalLinks: (links: ExternalLink[]) => void;
  toggleExternalLinkVisibility: (id: string, isVisible: boolean) => void;
  toggleExternalLinkResume: (id: string, includeInResume: boolean) => void;

  /* ── Resume Settings ── */
  updateResumeSettings: (settings: Partial<ResumeSettings>) => Promise<void>;

  /* ── Media ── */
  addMediaItem: (item: Omit<MediaItem, "id" | "uploadedAt">) => void;
  deleteMediaItem: (id: string) => void;
}
