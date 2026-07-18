import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";
import Link from "next/link";

type ButtonBase = {
  className?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
};

type AsButton = ButtonBase & { href?: never } & ComponentPropsWithoutRef<"button">;
type AsAnchor = ButtonBase & {
  href: string;
  /** Open in new tab (adds target + rel automatically) */
  external?: boolean;
};

export type PrimaryButtonProps = AsButton | AsAnchor;

const sizeClasses = {
  sm: "h-8 px-3.5 text-xs",
  md: "h-9 px-5 text-sm",
  lg: "h-11 px-6 text-sm",
} as const;

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap " +
  "rounded-lg font-medium select-none cursor-pointer " +
  "transition-all duration-[150ms] " +
  "bg-brand text-brand-fg hover:bg-brand-hover " +
  "focus-visible:outline-[2px] focus-visible:outline-[var(--ds-accent)] focus-visible:outline-offset-2 " +
  "disabled:opacity-40 disabled:pointer-events-none " +
  "active:scale-[0.98]";

/**
 * PrimaryButton
 *
 * Accent-filled CTA button. Renders as <button> by default;
 * pass `href` to render as a link.
 *
 * @example
 * <PrimaryButton href="#contact">Get in Touch</PrimaryButton>
 * <PrimaryButton onClick={handleClick}>Submit</PrimaryButton>
 */
export function PrimaryButton({
  className,
  children,
  size = "md",
  ...props
}: PrimaryButtonProps) {
  const classes = cn(base, sizeClasses[size], className);

  if ("href" in props && props.href !== undefined) {
    const { href, external, ...rest } = props as AsAnchor;

    if (external || href.startsWith("http") || href.startsWith("//")) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          {...(rest as ComponentPropsWithoutRef<"a">)}
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...(props as AsButton)}>
      {children}
    </button>
  );
}
