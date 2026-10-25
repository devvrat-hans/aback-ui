import Link from "next/link";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";

import { Breadcrumbs, TableOfContents, cn, type TableOfContentsItem } from "@aback-ui/ui";

export type TocItem = TableOfContentsItem;

/**
 * The frame of a documentation page: the article column and, from xl, an
 * "On this page" rail that follows the reader. Pages pass the ids of their
 * own h2s, so every entry points at a real heading.
 */
export function DocsPage({
  toc = [],
  className,
  children,
}: {
  toc?: TocItem[];
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn(toc.length ? "xl:grid xl:grid-cols-[minmax(0,1fr)_13rem] xl:gap-12" : undefined)}>
      <article className={cn("min-w-0", className)}>{children}</article>
      {toc.length ? (
        <div className="hidden xl:block">
          <div className="sticky top-24 max-h-[calc(100dvh-8rem)] overflow-y-auto pb-6 [scrollbar-width:thin]">
            <TableOfContents items={toc} offset={88} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export interface Crumb {
  label: string;
  href?: string;
}

/**
 * The page title block every docs page shares: eyebrow, the page's one h1,
 * the lead, breadcrumbs directly below it, and an optional meta row.
 */
export function DocsPageHeader({
  eyebrow,
  title,
  description,
  crumbs,
  children,
  className,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  crumbs: Crumb[];
  /** Status badges, actions, and other meta shown under the breadcrumbs. */
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("flex flex-col gap-3 border-b border-border pb-8", className)}>
      {eyebrow ? (
        <p className="text-xs font-medium uppercase tracking-wide text-link">{eyebrow}</p>
      ) : null}
      <h1 className="text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">{title}</h1>
      <Breadcrumbs items={crumbs} />
      {description ? (
        <p className="mt-1 max-w-[68ch] text-base leading-relaxed text-pretty text-muted-foreground sm:text-[17px]">
          {description}
        </p>
      ) : null}
      {children ? <div className="mt-2 flex flex-wrap items-center gap-2">{children}</div> : null}
    </header>
  );
}

/** A docs section with a linkable h2. The id doubles as the TOC target. */
export function DocsSection({
  id,
  title,
  description,
  children,
  className,
}: {
  id: string;
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section aria-labelledby={id} className={cn("flex min-w-0 flex-col gap-4", className)}>
      <div className="flex flex-col gap-1.5">
        <h2 id={id} className="group scroll-mt-20 text-xl font-semibold tracking-tight text-foreground">
          <a href={`#${id}`} className="outline-none focus-visible:ring-2 focus-visible:ring-focus-ring">
            {title}
            <span
              aria-hidden="true"
              className="ml-2 text-muted-foreground opacity-0 transition-opacity duration-150 group-hover:opacity-100"
            >
              #
            </span>
          </a>
        </h2>
        {description ? (
          <p className="max-w-[68ch] text-sm leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

/** Previous and next links at the foot of a page in a sequence. */
export function DocsPager({
  label,
  previous,
  next,
}: {
  label: string;
  previous?: { title: string; href: string };
  next?: { title: string; href: string };
}) {
  if (!previous && !next) return null;
  return (
    <nav aria-label={label} className="grid gap-3 border-t border-border pt-8 sm:grid-cols-2">
      {previous ? (
        <Link
          href={previous.href}
          className="group flex flex-col gap-1 border border-border p-4 outline-none transition-colors duration-200 hover:border-primary-300 focus-visible:ring-2 focus-visible:ring-focus-ring dark:hover:border-primary-700"
        >
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <IconArrowLeft aria-hidden="true" className="size-3.5" />
            Previous
          </span>
          <span className="text-sm font-semibold text-foreground group-hover:text-link">{previous.title}</span>
        </Link>
      ) : (
        <span aria-hidden="true" className="hidden sm:block" />
      )}
      {next ? (
        <Link
          href={next.href}
          className="group flex flex-col items-end gap-1 border border-border p-4 text-right outline-none transition-colors duration-200 hover:border-primary-300 focus-visible:ring-2 focus-visible:ring-focus-ring dark:hover:border-primary-700"
        >
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            Next
            <IconArrowRight aria-hidden="true" className="size-3.5" />
          </span>
          <span className="text-sm font-semibold text-foreground group-hover:text-link">{next.title}</span>
        </Link>
      ) : null}
    </nav>
  );
}
