"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { initialPortfolioData } from "@/lib/data/initial-data";
import { loadPortfolioData, savePortfolioData } from "@/lib/storage";
import type {
  PortfolioData,
  PortfolioContextValue,
  Profile,
  SocialLink,
  EducationEntry,
  SkillCategory,
  Project,
  Achievement,
  ExternalLink,
  MediaItem,
} from "@/lib/types";

/* ── ID generator ──────────────────────────────────────────────────────── */
const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

/* ── Context ───────────────────────────────────────────────────────────── */
export const PortfolioContext = createContext<PortfolioContextValue | null>(null);

/**
 * usePortfolio
 * Must be called inside <PortfolioProvider>.
 */
export function usePortfolio(): PortfolioContextValue {
  const ctx = useContext(PortfolioContext);
  if (!ctx)
    throw new Error("usePortfolio() must be called inside <PortfolioProvider>");
  return ctx;
}

/* ── Provider ──────────────────────────────────────────────────────────── */
export function PortfolioProvider({
  initialData,
  children,
}: {
  initialData?: PortfolioData;
  children: ReactNode;
}) {
  /**
   * Initialise from localStorage if available, otherwise fall back to the
   * provided initialData or the built-in mock data.
   * This runs once on the client — SSR always renders with initialPortfolioData.
   */
  const [data, setData] = useState<PortfolioData>(() => {
    const stored = loadPortfolioData();
    return stored ?? initialData ?? initialPortfolioData;
  });

  /**
   * Persist every state change to localStorage.
   * SUPABASE MIGRATION: replace with `await upsert(data)` here.
   */
  useEffect(() => {
    savePortfolioData(data);
  }, [data]);

  /* ── Profile ────────────────────────────────────────────────────────── */
  const updateProfile = useCallback((updates: Partial<Profile>) => {
    setData((prev) => ({ ...prev, profile: { ...prev.profile, ...updates } }));
  }, []);

  /* ── Social Links ───────────────────────────────────────────────────── */
  const addSocialLink = useCallback((link: Omit<SocialLink, "id">) => {
    setData((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { ...link, id: uid() }],
    }));
  }, []);

  const updateSocialLink = useCallback(
    (id: string, updates: Partial<Omit<SocialLink, "id">>) => {
      setData((prev) => ({
        ...prev,
        socialLinks: prev.socialLinks.map((l) =>
          l.id === id ? { ...l, ...updates } : l
        ),
      }));
    },
    []
  );

  const deleteSocialLink = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((l) => l.id !== id),
    }));
  }, []);

  const reorderSocialLinks = useCallback((links: SocialLink[]) => {
    setData((prev) => ({ ...prev, socialLinks: links }));
  }, []);

  /* ── Education ──────────────────────────────────────────────────────── */
  const addEducation = useCallback((entry: Omit<EducationEntry, "id">) => {
    setData((prev) => ({
      ...prev,
      education: [...prev.education, { ...entry, id: uid() }],
    }));
  }, []);

  const deleteEducation = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id),
    }));
  }, []);

  /* ── Skills — categories ────────────────────────────────────────────── */
  const addSkillCategory = useCallback((name: string) => {
    setData((prev) => ({
      ...prev,
      skills: [
        ...prev.skills,
        { id: uid(), name, skills: [], order: prev.skills.length },
      ],
    }));
  }, []);

  const renameSkillCategory = useCallback((id: string, name: string) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.map((c) => (c.id === id ? { ...c, name } : c)),
    }));
  }, []);

  const deleteSkillCategory = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills
        .filter((c) => c.id !== id)
        .map((c, i) => ({ ...c, order: i })),
    }));
  }, []);

  const reorderSkillCategories = useCallback((categories: SkillCategory[]) => {
    setData((prev) => ({
      ...prev,
      skills: categories.map((c, i) => ({ ...c, order: i })),
    }));
  }, []);

  /* ── Skills — items within a category ──────────────────────────────── */
  const addSkill = useCallback((categoryId: string, skill: string) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.map((c) =>
        c.id === categoryId && !c.skills.includes(skill)
          ? { ...c, skills: [...c.skills, skill] }
          : c
      ),
    }));
  }, []);

  const removeSkill = useCallback((categoryId: string, skill: string) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.map((c) =>
        c.id === categoryId
          ? { ...c, skills: c.skills.filter((s) => s !== skill) }
          : c
      ),
    }));
  }, []);

  const reorderSkillsInCategory = useCallback(
    (categoryId: string, skills: string[]) => {
      setData((prev) => ({
        ...prev,
        skills: prev.skills.map((c) =>
          c.id === categoryId ? { ...c, skills } : c
        ),
      }));
    },
    []
  );

  /* ── Projects ───────────────────────────────────────────────────────── */
  const addProject = useCallback((project: Omit<Project, "id" | "order">) => {
    setData((prev) => {
      const order = prev.projects.length;
      return {
        ...prev,
        projects: [...prev.projects, { ...project, id: uid(), order }],
      };
    });
  }, []);

  const updateProject = useCallback(
    (id: string, updates: Partial<Omit<Project, "id">>) => {
      setData((prev) => ({
        ...prev,
        projects: prev.projects.map((p) =>
          p.id === id ? { ...p, ...updates } : p
        ),
      }));
    },
    []
  );

  const deleteProject = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects
        .filter((p) => p.id !== id)
        .map((p, i) => ({ ...p, order: i })),
    }));
  }, []);

  const reorderProjects = useCallback((projects: Project[]) => {
    setData((prev) => ({
      ...prev,
      projects: projects.map((p, i) => ({ ...p, order: i })),
    }));
  }, []);

  /* ── Achievements ───────────────────────────────────────────────────── */
  const addAchievement = useCallback((a: Omit<Achievement, "id">) => {
    setData((prev) => ({
      ...prev,
      achievements: [...prev.achievements, { ...a, id: uid() }],
    }));
  }, []);

  const updateAchievement = useCallback(
    (id: string, updates: Partial<Omit<Achievement, "id">>) => {
      setData((prev) => ({
        ...prev,
        achievements: prev.achievements.map((a) =>
          a.id === id ? { ...a, ...updates } : a
        ),
      }));
    },
    []
  );

  const deleteAchievement = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((a) => a.id !== id),
    }));
  }, []);

  /* ── External Links ─────────────────────────────────────────────────── */
  const addExternalLink = useCallback((l: Omit<ExternalLink, "id">) => {
    setData((prev) => ({
      ...prev,
      externalLinks: [...prev.externalLinks, { ...l, id: uid() }],
    }));
  }, []);

  const deleteExternalLink = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      externalLinks: prev.externalLinks.filter((l) => l.id !== id),
    }));
  }, []);

  /* ── Media ──────────────────────────────────────────────────────────── */
  const addMediaItem = useCallback(
    (item: Omit<MediaItem, "id" | "uploadedAt">) => {
      setData((prev) => ({
        ...prev,
        media: [
          ...prev.media,
          { ...item, id: uid(), uploadedAt: new Date().toISOString() },
        ],
      }));
    },
    []
  );

  const deleteMediaItem = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      media: prev.media.filter((m) => m.id !== id),
    }));
  }, []);

  /* ── Assemble context value ─────────────────────────────────────────── */
  const value: PortfolioContextValue = {
    data,
    updateProfile,
    addSocialLink,
    updateSocialLink,
    deleteSocialLink,
    reorderSocialLinks,
    addEducation,
    deleteEducation,
    addSkillCategory,
    renameSkillCategory,
    deleteSkillCategory,
    reorderSkillCategories,
    addSkill,
    removeSkill,
    reorderSkillsInCategory,
    addProject,
    updateProject,
    deleteProject,
    reorderProjects,
    addAchievement,
    updateAchievement,
    deleteAchievement,
    addExternalLink,
    deleteExternalLink,
    addMediaItem,
    deleteMediaItem,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}
