import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef, ElementType } from "react";

type SectionContainerProps<T extends ElementType = "section"> = {
  /** HTML element to render as — defaults to <section> */
  as?: T;
  /** Anchor id for in-page navigation */
  id?: string;
  className?: string;
  /** Extra padding at top — useful for the first section below a fixed navbar */
  navOffset?: boolean;
  children: React.ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "id" | "className" | "children">;

/**
 * SectionContainer
 *
 * Consistent vertical rhythm + responsive horizontal padding.
 * Wraps content in a centered max-width container.
 *
 * @example
 * <SectionContainer id="work" navOffset>
 *   <SectionHeading heading="Work" />
 * </SectionContainer>
 */
export function SectionContainer<T extends ElementType = "section">({
  as,
  id,
  className,
  navOffset = false,
  children,
  ...props
}: SectionContainerProps<T>) {
  const Component = (as ?? "section") as ElementType;

  return (
    <Component
      id={id}
      className={cn(
        "relative w-full",
        "py-20 lg:py-28",
        navOffset && "pt-32 lg:pt-36",
        className
      )}
      {...props}
    >
      <div className="container-page">{children}</div>
    </Component>
  );
}
