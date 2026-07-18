import { cn } from "@/lib/utils";

interface ProfilePhotoProps {
  /** URL of the actual photo. Pass null or undefined to show initials placeholder. */
  src?: string | null;
  /** Full name — used to derive initials when no photo is available. */
  name: string;
  /** Size in pixels — controls width + height of the circle. Defaults to 128. */
  size?: number;
  className?: string;
}

/**
 * ProfilePhoto
 *
 * Renders a circular photo frame.
 * - When `src` is a URL: shows the image (object-cover).
 * - When `src` is null / undefined: shows initials derived from `name`.
 *
 * Admin-ready: swap `src` with a real URL from the dashboard to show a photo.
 */
export function ProfilePhoto({ src, name, size = 128, className }: ProfilePhotoProps) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join("");

  const dimension = `${size}px`;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center shrink-0", className)}
      style={{ width: dimension, height: dimension }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden="true"
        className="absolute rounded-full opacity-20 blur-2xl pointer-events-none"
        style={{
          inset: "-12px",
          background:
            "radial-gradient(circle, oklch(0.63 0.19 251) 0%, transparent 70%)",
        }}
      />

      {/* Gradient ring */}
      <div
        className="relative rounded-full p-[2px]"
        style={{
          width: dimension,
          height: dimension,
          background:
            "linear-gradient(135deg, oklch(0.63 0.19 251 / 55%), oklch(0.63 0.19 251 / 12%))",
        }}
      >
        {/* Inner circle */}
        <div
          className="w-full h-full rounded-full overflow-hidden flex items-center justify-center"
          style={{
            background: src
              ? "transparent"
              : "linear-gradient(145deg, oklch(0.18 0.07 251), oklch(0.12 0.05 271))",
          }}
        >
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={name}
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            <span
              className="font-medium tracking-tight text-foreground select-none"
              style={{ fontSize: Math.round(size * 0.28) }}
              aria-label={`${name} initials`}
            >
              {initials}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
