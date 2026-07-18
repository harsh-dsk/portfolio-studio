import { Phone, Mail, MapPin, BookOpen } from "lucide-react";
import type { ContactItem } from "@/lib/data/resume";

const ICONS: Record<ContactItem["type"], React.ReactNode> = {
  phone:    <Phone    size={13} strokeWidth={1.75} aria-hidden="true" />,
  email:    <Mail     size={13} strokeWidth={1.75} aria-hidden="true" />,
  location: <MapPin   size={13} strokeWidth={1.75} aria-hidden="true" />,
  college:  <BookOpen size={13} strokeWidth={1.75} aria-hidden="true" />,
};

interface Props {
  items: ContactItem[];
}

/**
 * ContactInfo
 *
 * Horizontal wrapping row of contact details with icons.
 * Items with an href render as accessible links.
 */
export function ContactInfo({ items }: Props) {
  return (
    <div className="flex flex-wrap justify-center md:justify-start gap-x-5 gap-y-2">
      {items.map((item) => {
        const icon = ICONS[item.type];
        const content = (
          <span className="flex items-center gap-1.5 text-sm text-fg-muted">
            <span className="text-fg-subtle shrink-0">{icon}</span>
            {item.value}
          </span>
        );

        if (item.href) {
          return (
            <a
              key={item.type}
              href={item.href}
              className="hover:text-foreground transition-colors duration-150"
              aria-label={`${item.type}: ${item.value}`}
            >
              {content}
            </a>
          );
        }

        return <span key={item.type}>{content}</span>;
      })}
    </div>
  );
}
