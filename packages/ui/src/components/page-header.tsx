import * as React from "react";

import { cn } from "../lib/utils";

export interface PageHeaderProps extends Omit<React.ComponentProps<"header">, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  actions?: React.ReactNode;
  /**
   * Heading element for the title. Defaults to `h1`, which is the correct
   * choice for a page. Pass `h2` or `h3` only when the header introduces a
   * section below an existing page heading, such as a documentation preview.
   */
  as?: "h1" | "h2" | "h3";
}

/**
 * The page title block. It renders the page's single <h1> by default.
 * Breadcrumbs belong directly below this block, not inside it.
 */
function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  as: Heading = "h1",
  className,
  ...props
}: PageHeaderProps) {
  return (
    <header
      data-slot="page-header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      {eyebrow ? (
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {eyebrow}
        </p>
      ) : null}
      <Heading className="text-3xl font-bold leading-tight tracking-tight text-foreground text-balance">
        {title}
      </Heading>
      {description ? (
        <p className="max-w-3xl text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      {actions ? <div className="mt-2 flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

export { PageHeader };
