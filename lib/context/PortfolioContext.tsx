"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
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

// Import services
import { upsertProfile } from "@/lib/services/profile.service";
import {
  addSocialLink as addSocialLinkSvc,
  updateSocialLink as updateSocialLinkSvc,
  deleteSocialLink as deleteSocialLinkSvc,
  reorderSocialLinks as reorderSocialLinksSvc,
} from "@/lib/services/social-links.service";
import {
  addEducation as addEducationSvc,
  updateEducation as updateEducationSvc, // unused in context currently based on provided types but imported anyway
  deleteEducation as deleteEducationSvc,
} from "@/lib/services/education.service";
import {
  addSkillCategory as addSkillCategorySvc,
  renameSkillCategory as renameSkillCategorySvc,
  deleteSkillCategory as deleteSkillCategorySvc,
  reorderSkillCategories as reorderSkillCategoriesSvc,
  addSkill as addSkillSvc,
  removeSkill as removeSkillSvc,
  reorderSkillsInCategory as reorderSkillsInCategorySvc,
} from "@/lib/services/skills.service";
import {
  addProject as addProjectSvc,
  updateProject as updateProjectSvc,
  deleteProject as deleteProjectSvc,
  reorderProjects as reorderProjectsSvc,
} from "@/lib/services/projects.service";
import {
  addAchievement as addAchievementSvc,
  updateAchievement as updateAchievementSvc,
  deleteAchievement as deleteAchievementSvc,
} from "@/lib/services/achievements.service";
import {
  addExternalLink as addExternalLinkSvc,
  updateExternalLink as updateExternalLinkSvc, // unused in context currently but imported
  deleteExternalLink as deleteExternalLinkSvc,
} from "@/lib/services/external-links.service";
import { getFullPortfolioClient } from "@/lib/services/portfolio-client.service";

/* ── Context ───────────────────────────────────────────────────────────── */

// Extend the original context value to include refreshData and isLoading
export interface ExtendedPortfolioContextValue extends PortfolioContextValue {
  refreshData: () => Promise<void>;
  isLoading: boolean;
}

export const PortfolioContext = createContext<ExtendedPortfolioContextValue | null>(null);

export function usePortfolio(): ExtendedPortfolioContextValue {
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
  initialData: PortfolioData;
  children: ReactNode;
}) {
  const [data, setData] = useState<PortfolioData>(initialData);
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const freshData = await getFullPortfolioClient();
      setData(freshData);
    } catch (err) {
      console.error("[PortfolioContext] refreshData failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* ── Profile ────────────────────────────────────────────────────────── */
  const updateProfile = useCallback((updates: Partial<Profile>) => {
    setData((prev) => ({ ...prev, profile: { ...prev.profile, ...updates } }));
    upsertProfile(updates).catch((err) => {
      console.error("[PortfolioContext] updateProfile failed:", err);
    });
  }, []);

  /* ── Social Links ───────────────────────────────────────────────────── */
  const addSocialLink = useCallback((link: Omit<SocialLink, "id">) => {
    const tempId = `temp-${Date.now()}`;
    const tempLink = { ...link, id: tempId };
    setData((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, tempLink],
    }));
    addSocialLinkSvc(link)
      .then((real) => {
        setData((prev) => ({
          ...prev,
          socialLinks: prev.socialLinks.map((l) => (l.id === tempId ? real : l)),
        }));
      })
      .catch((err) => {
        console.error("[PortfolioContext] addSocialLink failed:", err);
        setData((prev) => ({
          ...prev,
          socialLinks: prev.socialLinks.filter((l) => l.id !== tempId),
        }));
      });
  }, []);

  const updateSocialLink = useCallback(
    (id: string, updates: Partial<Omit<SocialLink, "id">>) => {
      setData((prev) => ({
        ...prev,
        socialLinks: prev.socialLinks.map((l) =>
          l.id === id ? { ...l, ...updates } : l
        ),
      }));
      updateSocialLinkSvc(id, updates).catch((err) => {
        console.error("[PortfolioContext] updateSocialLink failed:", err);
      });
    },
    []
  );

  const deleteSocialLink = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((l) => l.id !== id),
    }));
    deleteSocialLinkSvc(id).catch((err) => {
      console.error("[PortfolioContext] deleteSocialLink failed:", err);
    });
  }, []);

  const reorderSocialLinks = useCallback((links: SocialLink[]) => {
    setData((prev) => ({ ...prev, socialLinks: links }));
    reorderSocialLinksSvc(links).catch((err) => {
      console.error("[PortfolioContext] reorderSocialLinks failed:", err);
    });
  }, []);

  /* ── Education ──────────────────────────────────────────────────────── */
  const addEducation = useCallback((entry: Omit<EducationEntry, "id">) => {
    const tempId = `temp-${Date.now()}`;
    const tempEntry = { ...entry, id: tempId };
    setData((prev) => ({
      ...prev,
      education: [...prev.education, tempEntry],
    }));
    addEducationSvc(entry)
      .then((real) => {
        setData((prev) => ({
          ...prev,
          education: prev.education.map((e) => (e.id === tempId ? real : e)),
        }));
      })
      .catch((err) => {
        console.error("[PortfolioContext] addEducation failed:", err);
        setData((prev) => ({
          ...prev,
          education: prev.education.filter((e) => e.id !== tempId),
        }));
      });
  }, []);

  const deleteEducation = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((e) => e.id !== id),
    }));
    deleteEducationSvc(id).catch((err) => {
      console.error("[PortfolioContext] deleteEducation failed:", err);
    });
  }, []);

  /* ── Skills — categories ────────────────────────────────────────────── */
  const addSkillCategory = useCallback(
    (name: string) => {
      const tempId = `temp-${Date.now()}`;
      setData((prev) => ({
        ...prev,
        skills: [
          ...prev.skills,
          { id: tempId, name, skills: [], order: prev.skills.length },
        ],
      }));
      addSkillCategorySvc('', name)
        .then((real) => {
          setData((prev) => ({
            ...prev,
            skills: prev.skills.map((c) => (c.id === tempId ? real : c)),
          }));
        })
        .catch((err) => {
          console.error("[PortfolioContext] addSkillCategory failed:", err);
          setData((prev) => ({
            ...prev,
            skills: prev.skills.filter((c) => c.id !== tempId),
          }));
        });
    },
    []
  );

  const renameSkillCategory = useCallback((id: string, name: string) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.map((c) => (c.id === id ? { ...c, name } : c)),
    }));
    renameSkillCategorySvc(id, name).catch((err) => {
      console.error("[PortfolioContext] renameSkillCategory failed:", err);
    });
  }, []);

  const deleteSkillCategory = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills
        .filter((c) => c.id !== id)
        .map((c, i) => ({ ...c, order: i })),
    }));
    deleteSkillCategorySvc(id).catch((err) => {
      console.error("[PortfolioContext] deleteSkillCategory failed:", err);
    });
  }, []);

  const reorderSkillCategories = useCallback((categories: SkillCategory[]) => {
    const reordered = categories.map((c, i) => ({ ...c, order: i }));
    setData((prev) => ({
      ...prev,
      skills: reordered,
    }));
    reorderSkillCategoriesSvc(reordered).catch((err) => {
      console.error("[PortfolioContext] reorderSkillCategories failed:", err);
    });
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
    addSkillSvc(categoryId, skill).catch((err) => {
      console.error("[PortfolioContext] addSkill failed:", err);
    });
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
    removeSkillSvc(categoryId, skill).catch((err) => {
      console.error("[PortfolioContext] removeSkill failed:", err);
    });
  }, []);

  const reorderSkillsInCategory = useCallback(
    (categoryId: string, skills: string[]) => {
      setData((prev) => ({
        ...prev,
        skills: prev.skills.map((c) =>
          c.id === categoryId ? { ...c, skills } : c
        ),
      }));
      reorderSkillsInCategorySvc(categoryId, skills).catch((err) => {
        console.error("[PortfolioContext] reorderSkillsInCategory failed:", err);
      });
    },
    []
  );

  /* ── Projects ───────────────────────────────────────────────────────── */
  const addProject = useCallback((project: Omit<Project, "id" | "order">) => {
    const tempId = `temp-${Date.now()}`;
    let orderToUse = 0;
    
    setData((prev) => {
      orderToUse = prev.projects.length;
      return {
        ...prev,
        projects: [...prev.projects, { ...project, id: tempId, order: orderToUse }],
      };
    });

    addProjectSvc(project, orderToUse)
      .then((real) => {
        setData((prev) => ({
          ...prev,
          projects: prev.projects.map((p) => (p.id === tempId ? real : p)),
        }));
      })
      .catch((err) => {
        console.error("[PortfolioContext] addProject failed:", err);
        setData((prev) => ({
          ...prev,
          projects: prev.projects.filter((p) => p.id !== tempId),
        }));
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
      updateProjectSvc(id, updates).catch((err) => {
        console.error("[PortfolioContext] updateProject failed:", err);
      });
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
    deleteProjectSvc(id).catch((err) => {
      console.error("[PortfolioContext] deleteProject failed:", err);
    });
  }, []);

  const reorderProjects = useCallback((projects: Project[]) => {
    const reordered = projects.map((p, i) => ({ ...p, order: i }));
    setData((prev) => ({
      ...prev,
      projects: reordered,
    }));
    reorderProjectsSvc(reordered).catch((err) => {
      console.error("[PortfolioContext] reorderProjects failed:", err);
    });
  }, []);

  /* ── Achievements ───────────────────────────────────────────────────── */
  const addAchievement = useCallback((a: Omit<Achievement, "id">) => {
    const tempId = `temp-${Date.now()}`;
    setData((prev) => ({
      ...prev,
      achievements: [...prev.achievements, { ...a, id: tempId }],
    }));
    addAchievementSvc(a)
      .then((real) => {
        setData((prev) => ({
          ...prev,
          achievements: prev.achievements.map((ach) =>
            ach.id === tempId ? real : ach
          ),
        }));
      })
      .catch((err) => {
        console.error("[PortfolioContext] addAchievement failed:", err);
        setData((prev) => ({
          ...prev,
          achievements: prev.achievements.filter((ach) => ach.id !== tempId),
        }));
      });
  }, []);

  const updateAchievement = useCallback(
    (id: string, updates: Partial<Omit<Achievement, "id">>) => {
      setData((prev) => ({
        ...prev,
        achievements: prev.achievements.map((a) =>
          a.id === id ? { ...a, ...updates } : a
        ),
      }));
      updateAchievementSvc(id, updates).catch((err) => {
        console.error("[PortfolioContext] updateAchievement failed:", err);
      });
    },
    []
  );

  const deleteAchievement = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((a) => a.id !== id),
    }));
    deleteAchievementSvc(id).catch((err) => {
      console.error("[PortfolioContext] deleteAchievement failed:", err);
    });
  }, []);

  /* ── External Links ─────────────────────────────────────────────────── */
  const addExternalLink = useCallback((l: Omit<ExternalLink, "id">) => {
    const tempId = `temp-${Date.now()}`;
    setData((prev) => ({
      ...prev,
      externalLinks: [...prev.externalLinks, { ...l, id: tempId }],
    }));
    addExternalLinkSvc(l)
      .then((real) => {
        setData((prev) => ({
          ...prev,
          externalLinks: prev.externalLinks.map((ext) =>
            ext.id === tempId ? real : ext
          ),
        }));
      })
      .catch((err) => {
        console.error("[PortfolioContext] addExternalLink failed:", err);
        setData((prev) => ({
          ...prev,
          externalLinks: prev.externalLinks.filter((ext) => ext.id !== tempId),
        }));
      });
  }, []);

  const deleteExternalLink = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      externalLinks: prev.externalLinks.filter((l) => l.id !== id),
    }));
    deleteExternalLinkSvc(id).catch((err) => {
      console.error("[PortfolioContext] deleteExternalLink failed:", err);
    });
  }, []);

  /* ── Media ──────────────────────────────────────────────────────────── */
  const addMediaItem = useCallback(
    (item: Omit<MediaItem, "id" | "uploadedAt">) => {
      const tempId = `temp-${Date.now()}`;
      setData((prev) => ({
        ...prev,
        media: [
          ...prev.media,
          { ...item, id: tempId, uploadedAt: new Date().toISOString() },
        ],
      }));
      // Media upload is usually handled separately, so this is just local state
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
  const value: ExtendedPortfolioContextValue = {
    data,
    refreshData,
    isLoading,
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
