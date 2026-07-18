import { ArrowUpRight } from "lucide-react";
import type { ExternalLink } from "@/lib/data/resume";

interface Props {
  links: ExternalLink[];
}

/** ExternalLinks — list of labelled links with descriptions. */
export function ExternalLinks({ links }: Props) {
  return (
    <div className="space-y-3">
      {links.map((link) => (
        <div key={link.url} className="flex items-start gap-3">
          {/* Link */}
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-medium text-brand hover:text-brand-hover transition-colors duration-150 shrink-0 mt-0.5"
          >
            {link.label}
            <ArrowUpRight size={12} strokeWidth={2} aria-hidden="true" />
          </a>

          {link.description && (
            <>
              <span className="text-fg-subtle text-xs mt-1" aria-hidden="true">—</span>
              <p className="text-sm text-fg-muted">{link.description}</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
