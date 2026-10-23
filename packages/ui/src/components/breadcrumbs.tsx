import * as React from "react";
import { IconChevronRight } from "@tabler/icons-react";

import { cn } from "../lib/utils";

export interface BreadcrumbItem {
  label: React.ReactNode;
  href?: string;
}

export interface BreadcrumbsProps extends React.ComponentProps<"nav"> {
  items: BreadcrumbItem[];
}

function Breadcrumbs({ items, className, ...props }: BreadcrumbsProps) {
  return (
    <nav
      data-slot="breadcrumbs"
      aria-label="Breadcrumb"
      className={cn("text-sm", className)}
      {...props}
    >
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;
          return (
            <li key={item.href ?? index} className="flex items-center gap-1">
              {index > 0 ? (
                <IconChevronRight
                  aria-hidden="true"
                  className="mx-0.5 size-3.5 shrink-0 text-muted-foreground"
                />
              ) : null}
              {item.href && !isCurrent ? (
                <a
                  href={item.href}
                  className={cn(
                    "text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline",
                    "outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  )}
                >
                  {item.label}
                </a>
              ) : (
                <span
                  aria-current={isCurrent ? "page" : undefined}
                  className={cn(isCurrent ? "font-medium text-foreground" : "text-muted-foreground")}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export { Breadcrumbs };
