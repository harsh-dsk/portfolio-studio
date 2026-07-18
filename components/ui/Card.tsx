import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

/* ─────────────────────────────────────────────────────────
   Card — sub-components follow the compound pattern:
   <Card>
     <Card.Header>
       <Card.Title>…</Card.Title>
       <Card.Description>…</Card.Description>
     </Card.Header>
     <Card.Footer>…</Card.Footer>
   </Card>
   ───────────────────────────────────────────────────────── */

interface CardProps extends ComponentPropsWithoutRef<"div"> {
  /** Enable the lift-on-hover effect */
  hover?: boolean;
  /** Internal padding preset */
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
} as const;

/**
 * Card
 *
 * Surface-layer container with a subtle border and optional hover lift.
 *
 * @example
 * <Card>
 *   <Card.Header>
 *     <Card.Title>Project name</Card.Title>
 *     <Card.Description>A short summary.</Card.Description>
 *   </Card.Header>
 *   <Card.Footer>
 *     <PrimaryButton size="sm">View</PrimaryButton>
 *   </Card.Footer>
 * </Card>
 */
export function Card({
  className,
  hover = true,
  padding = "md",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl",
        "bg-surface-1",
        "border border-border",
        "transition-all duration-200",
        hover && [
          "hover:-translate-y-0.5",
          "hover:border-border-hover",
          "hover:shadow-[0_8px_32px_oklch(0_0_0_/_50%),0_2px_8px_oklch(0_0_0_/_30%)]",
        ],
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/* ── Sub-components ── */

Card.Header = function CardHeader({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div className={cn("mb-4 last:mb-0", className)} {...props}>
      {children}
    </div>
  );
};
Card.Header.displayName = "Card.Header";

Card.Title = function CardTitle({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"h3">) {
  return (
    <h3
      className={cn(
        "text-base font-medium leading-snug tracking-tight text-foreground",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
};
Card.Title.displayName = "Card.Title";

Card.Description = function CardDescription({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"p">) {
  return (
    <p
      className={cn(
        "mt-1.5 text-sm leading-relaxed text-fg-muted",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
};
Card.Description.displayName = "Card.Description";

Card.Footer = function CardFooter({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("mt-4 pt-4 border-t border-border", className)}
      {...props}
    >
      {children}
    </div>
  );
};
Card.Footer.displayName = "Card.Footer";
