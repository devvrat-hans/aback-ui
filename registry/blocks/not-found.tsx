import { useId, type ReactNode } from "react";
import { IconArrowRight, IconHome, IconSearch } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface NotFoundLink {
  title: string;
  description: string;
  href: string;
}

export interface NotFoundBlockProps {
  title?: ReactNode;
  description?: ReactNode;
  homeHref?: string;
  /** A second real destination, such as the catalogue or the docs. */
  secondaryAction?: { label: string; href: string };
  /** Where most lost visitors were trying to go. */
  links?: NotFoundLink[];
  /** A hint that search exists, such as "Press Ctrl K to search." Only if search is real. */
  searchHint?: ReactNode;
}

/**
 * A 404 page that offers a way forward: home, one alternative, and the pages
 * people usually want. It renders the page's h1. Return a real 404 status from
 * your framework's not-found route; this block is only the content.
 */
export function NotFoundBlock({
  title = "Page not found",
  description = "The page you followed does not exist. It may have moved or been renamed.",
  homeHref = "/",
  secondaryAction,
  links = [],
  searchHint,
}: NotFoundBlockProps) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} className="mx-auto w-full max-w-3xl px-4 py-16 md:px-6 lg:py-24">
      <div className="border border-border bg-card p-6 md:p-10">
        <Badge variant="brand">Error 404</Badge>
        <h1 id={headingId} className="mt-4 text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">{description}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Button asChild>
            <a href={homeHref}>
              <IconHome aria-hidden="true" />
              Go home
            </a>
          </Button>
          {secondaryAction ? (
            <Button variant="outline" asChild>
              <a href={secondaryAction.href}>{secondaryAction.label}</a>
            </Button>
          ) : null}
        </div>

        {links.length ? (
          <div className="mt-10 border-t border-border pt-6">
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Popular destinations
            </h2>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="group flex h-full items-start justify-between gap-3 border border-border p-3 outline-none transition-colors duration-200 hover:border-primary-300 hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <span className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium text-foreground group-hover:text-link">{link.title}</span>
                      <span className="text-xs text-muted-foreground">{link.description}</span>
                    </span>
                    <IconArrowRight
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {searchHint ? (
          <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
            <IconSearch aria-hidden="true" className="size-3.5" />
            {searchHint}
          </p>
        ) : null}
      </div>
    </section>
  );
}
