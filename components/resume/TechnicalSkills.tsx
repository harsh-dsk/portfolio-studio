import type { SkillCategory } from "@/lib/data/resume";

const CATEGORY_ACCENT: Record<string, string> = {
  Frontend:       "oklch(0.63 0.19 251)",  // brand blue
  Backend:        "oklch(0.72 0.17 155)",  // green
  Database:       "oklch(0.76 0.14 65)",   // amber
  "Tools & DevOps": "oklch(0.68 0.20 308)", // purple
};

interface Props {
  categories: SkillCategory[];
}

/** TechnicalSkills — skill chips grouped by category. */
export function TechnicalSkills({ categories }: Props) {
  return (
    <div className="space-y-4">
      {categories.map(({ category, skills }) => {
        const accent = CATEGORY_ACCENT[category] ?? "oklch(0.63 0.19 251)";

        return (
          <div key={category} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
            {/* Category label */}
            <span
              className="text-[11px] font-medium uppercase tracking-[0.1em] shrink-0 sm:w-28 sm:mt-1"
              style={{ color: accent }}
            >
              {category}
            </span>

            {/* Chips */}
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center px-2.5 py-1 text-xs rounded-md border border-border text-fg-muted bg-surface-1"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
