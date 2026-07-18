import { ProfilePhoto } from "@/components/ui/ProfilePhoto";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface Props {
  name: string;
  title: string;
  photo?: string | null;
}

/**
 * ResumeHeader
 *
 * Top row of the resume page:
 *   Desktop: [Photo]  [Name + Title — flex 1]  [ThemeToggle]
 *   Mobile:  [ThemeToggle top-right (absolute)] / [Photo centered] / [Name + Title centered]
 */
export function ResumeHeader({ name, title, photo }: Props) {
  return (
    <header id="about" className="relative flex flex-col items-center md:flex-row md:items-center gap-5 md:gap-6">
      {/* ── Theme toggle — absolute top-right on mobile, end of row on desktop ── */}
      <div className="absolute top-0 right-0 md:static md:order-last md:shrink-0">
        <ThemeToggle />
      </div>

      {/* ── Profile photo ── */}
      {/* Mobile: 150px centered; Tablet: 110px; Desktop: 128px */}
      <ProfilePhoto
        src={photo}
        name={name}
        size={150}
        className="md:hidden"
      />
      <ProfilePhoto
        src={photo}
        name={name}
        size={110}
        className="hidden md:flex lg:hidden"
      />
      <ProfilePhoto
        src={photo}
        name={name}
        size={128}
        className="hidden lg:flex"
      />

      {/* ── Name + Title ── */}
      <div className="flex-1 text-center md:text-left">
        <h1
          className="font-semibold tracking-tight text-foreground"
          style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", letterSpacing: "-0.03em", lineHeight: 1.1 }}
        >
          {name}
        </h1>
        <p className="mt-1.5 text-base sm:text-lg text-fg-muted font-normal tracking-normal leading-normal">
          {title}
        </p>
      </div>
    </header>
  );
}
