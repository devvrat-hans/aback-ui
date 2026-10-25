import * as React from "react";

import { cn } from "../lib/utils";

const titleSizes = {
  sm: "text-xl font-semibold",
  default: "text-2xl font-bold sm:text-3xl",
  lg: "text-3xl font-bold sm:text-4xl",
} as const;

const descriptionSizes = {
  sm: "text-sm",
  default: "text-base",
  lg: "text-lg",
} as const;

export interface SectionHeadingProps extends Omit<React.ComponentProps<"div">, "title"> {
  title: React.ReactNode;
  /** A short label above the title. */
  eyebrow?: React.ReactNode;
  description?: React.ReactNode;
  /** A link or button that belongs to the section, such as "View all". */
  action?: React.ReactNode;
  /** Heading level. A section under the page title is an h2. */
  as?: "h2" | "h3" | "h4";
  size?: keyof typeof titleSizes;
  align?: "start" | "center";
  /** Id for the heading, so the section can use `aria-labelledby`. */
  headingId?: string;
}

/**
 * The heading of a page section: eyebrow, title, one-line description, and an
 * optional action that moves to the right on wide screens. PageHeader is for
 * the page's h1; this is for everything below it.
 */
function SectionHeading({
  title,
  eyebrow,
  description,
  action,
  as: Heading = "h2",
  size = "default",
  align = "start",
  headingId,
  className,
  ...props
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div
      data-slot="section-heading"
      className={cn(
        "flex flex-col gap-4",
        centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
        className,
      )}
      {...props}
    >
      <div className={cn("flex max-w-2xl flex-col gap-2", centered && "items-center")}>
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-wide text-link">{eyebrow}</p>
        ) : null}
        <Heading
          id={headingId}
          className={cn("leading-tight tracking-tight text-foreground text-balance", titleSizes[size])}
        >
          {title}
        </Heading>
        {description ? (
          <p className={cn("leading-relaxed text-muted-foreground text-pretty", descriptionSizes[size])}>
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export { SectionHeading };
