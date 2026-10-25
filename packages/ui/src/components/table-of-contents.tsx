"use client";

import * as React from "react";
import { IconList } from "@tabler/icons-react";

import { cn } from "../lib/utils";

export interface TableOfContentsItem {
  /** The id of the heading on the page, without the hash. */
  id: string;
  title: React.ReactNode;
  /** Heading depth relative to the first level. 1 is a top-level section. */
  depth?: 1 | 2 | 3;
}

export interface TableOfContentsProps extends Omit<React.ComponentProps<"nav">, "children" | "title"> {
  items: TableOfContentsItem[];
  /** Visible heading of the list. Also names the navigation landmark. */
  title?: React.ReactNode;
  /**
   * Distance from the top of the viewport, in pixels, where a heading counts
   * as reached. Set it to the height of a sticky header.
   */
  offset?: number;
  /** Disable scroll tracking, for a static list. */
  trackActive?: boolean;
}

const depthIndent = {
  1: "pl-3",
  2: "pl-6",
  3: "pl-9",
} as const;

/**
 * An "On this page" list that follows the reader. Links are real anchors, so
 * they work without JavaScript and update the URL hash; the active section is
 * tracked with an IntersectionObserver and marked with `aria-current`.
 */
function TableOfContents({
  items,
  title = "On this page",
  offset = 96,
  trackActive = true,
  className,
  "aria-label": ariaLabel,
  ...props
}: TableOfContentsProps) {
  const headingId = React.useId();
  const [active, setActive] = React.useState<string | null>(null);
  const ids = items.map((item) => item.id).join("|");

  React.useEffect(() => {
    if (!trackActive || typeof IntersectionObserver === "undefined") return;
    const targets = ids
      .split("|")
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    if (targets.length === 0) return;

    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const first = targets.find((target) => visible.has(target.id));
        if (first) setActive(first.id);
      },
      { rootMargin: `-${offset}px 0px -55% 0px`, threshold: 0 },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [ids, offset, trackActive]);

  if (items.length === 0) return null;

  return (
    <nav
      data-slot="table-of-contents"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabel ? undefined : headingId}
      className={cn("flex flex-col gap-2", className)}
      {...props}
    >
      <p
        id={headingId}
        className="flex items-center gap-2 border-b border-border pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
      >
        <IconList aria-hidden="true" className="size-4 text-brand-icon" />
        {title}
      </p>
      <ul className="flex flex-col">
        {items.map((item) => {
          const current = active === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={current ? "location" : undefined}
                onClick={() => setActive(item.id)}
                className={cn(
                  "block border-l-2 py-1.5 pr-2 text-xs leading-snug outline-none transition-colors duration-150",
                  "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring",
                  depthIndent[item.depth ?? 1],
                  current
                    ? "border-primary-500 bg-brand-wash font-semibold text-link"
                    : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
                )}
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export { TableOfContents };
