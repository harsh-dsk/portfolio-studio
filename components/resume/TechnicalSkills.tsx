/* Category accent colours — auto-assigned from a rotating palette */
const PALETTE = [
  "oklch(0.63 0.19 251)",  // blue
  "oklch(0.72 0.17 155)",  // green
  "oklch(0.76 0.14 65)",   // amber
  "oklch(0.68 0.20 308)",  // purple
  "oklch(0.70 0.15 200)",  // teal
  "oklch(0.65 0.22 27)",   // red
  "oklch(0.73 0.18 320)",  // pink
];

interface Category {
  category: string;
  skills: string[];
}

interface Props {
  categories: Category[];
}

/**
 * TechnicalSkills
 *
 * Accepts `{ category: string, skills: string[] }[]`.
 * Compatible with both the old resume.ts type and the new SkillCategory mapped shape.
 * Accent colours are auto-assigned by index from a rotating palette — no hardcoding.
 */
export function TechnicalSkills({ categories }: Props) {
  return (
    <div className="space-y-4">
      {categories.map(({ category, skills }, idx) => {
        const accent = PALETTE[idx % PALETTE.length];

        return (
          <div key={category} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
            {/* Category label */}
            <span
              className="text-[11px] font-medium uppercase tracking-[0.1em] shrink-0 sm:w-28 sm:mt-1"
              style={{ color: accent }}
            >
              {category}
            </span>

            {/* Skill chips */}
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
