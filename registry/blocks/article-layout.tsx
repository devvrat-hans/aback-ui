"use client";

import { type ReactNode, useId, useRef } from "react";
import { IconCalendar, IconChevronDown, IconClock } from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/ui/breadcrumbs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ReadingProgress } from "@/components/ui/reading-progress";
import { ShareButtons } from "@/components/ui/share-buttons";
import { TableOfContents, type TableOfContentsItem } from "@/components/ui/table-of-contents";

export interface ArticleAuthor {
  name: string;
  role?: string;
  initials?: string;
  avatarUrl?: string;
}

export interface ArticleLayoutBlockProps {
  title: string;
  /** The lead paragraph under the title. */
  description?: ReactNode;
  category?: string;
  author: ArticleAuthor;
  /** ISO date of publication. Rendered as a stable absolute date. */
  publishedAt: string;
  /** Such as "6 min read". Compute it from the real word count. */
  readingTime?: string;
  breadcrumbs?: BreadcrumbItem[];
  /** One entry per h2 or h3 in the body, by id. */
  toc?: TableOfContentsItem[];
  /** The canonical URL, for the share links. */
  shareUrl?: string;
  /** The article body. Plain h2, h3, p, ul, ol, blockquote, and code are styled. */
  children: ReactNode;
}

// Typography for the body, scoped to this block so it never leaks into the page.
const prose = [
  "flex min-w-0 max-w-[72ch] flex-col gap-4 text-sm leading-relaxed text-muted-foreground",
  "[&_h2]:mt-6 [&_h2]:scroll-mt-24 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-foreground",
  "[&_h3]:mt-2 [&_h3]:scroll-mt-24 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground",
  "[&_strong]:font-semibold [&_strong]:text-foreground",
  "[&_a]:text-link [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-link-hover",
  "[&_ul]:ml-6 [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ol]:ml-6 [&_ol]:list-decimal [&_ol]:space-y-1.5 [&_li]:marker:text-muted-foreground",
  "[&_blockquote]:border-l-4 [&_blockquote]:border-primary-300 [&_blockquote]:py-1 [&_blockquote]:pl-4 [&_blockquote]:italic dark:[&_blockquote]:border-primary-500",
  "[&_:not(pre)>code]:bg-muted [&_:not(pre)>code]:px-1 [&_:not(pre)>code]:font-mono [&_:not(pre)>code]:text-[0.9em] [&_:not(pre)>code]:text-foreground",
].join(" ");

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.length > 1 ? `${parts[0]![0]}${parts[1]![0]}`.toUpperCase() : name.slice(0, 2).toUpperCase();
}

/**
 * A long-form article page: breadcrumbs, title, author and meta bar, a body
 * with scoped typography, a sticky "On this page" list, share links, and a
 * reading progress bar. The aside appears when the block's own container is
 * wide enough, so it adapts inside narrow layouts as well as on wide screens.
 */
export function ArticleLayoutBlock({
  title,
  description,
  category,
  author,
  publishedAt,
  readingTime,
  breadcrumbs,
  toc = [],
  shareUrl,
  children,
}: ArticleLayoutBlockProps) {
  const headingId = useId();
  const article = useRef<HTMLElement>(null);
  const published = new Date(publishedAt);
  const validDate = !Number.isNaN(published.getTime());

  return (
    <div className="@container mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
      <ReadingProgress target={article} />
      <article ref={article} className="flex flex-col gap-6" aria-labelledby={headingId}>
        <header className="flex flex-col gap-4">
          {breadcrumbs?.length ? <Breadcrumbs items={breadcrumbs} /> : null}
          {category ? <Badge variant="brand" className="self-start">{category}</Badge> : null}
          <h1 id={headingId} className="max-w-3xl text-3xl font-bold leading-tight tracking-tight text-foreground text-balance sm:text-4xl">
            {title}
          </h1>
          {description ? (
            <p className="max-w-[72ch] text-base leading-relaxed text-muted-foreground">{description}</p>
          ) : null}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3 border border-border bg-muted/20 p-4">
            <div className="flex items-center gap-3">
              <Avatar size="lg">
                {author.avatarUrl ? <AvatarImage src={author.avatarUrl} alt="" /> : null}
                <AvatarFallback>{author.initials ?? initialsOf(author.name)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground">{author.name}</span>
                {author.role ? <span className="text-xs text-muted-foreground">{author.role}</span> : null}
              </div>
            </div>
            <span aria-hidden="true" className="hidden h-8 w-px bg-border sm:block" />
            <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {validDate ? (
                <li className="flex items-center gap-1.5">
                  <IconCalendar aria-hidden="true" className="size-3.5" />
                  <span className="sr-only">Published </span>
                  <time dateTime={published.toISOString()}>
                    {new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeZone: "UTC" }).format(published)}
                  </time>
                </li>
              ) : null}
              {readingTime ? (
                <li className="flex items-center gap-1.5">
                  <IconClock aria-hidden="true" className="size-3.5" />
                  {readingTime}
                </li>
              ) : null}
            </ul>
          </div>
        </header>

        {toc.length ? (
          <Collapsible className="border border-border bg-muted/20 @3xl:hidden">
            <CollapsibleTrigger className="group flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring">
              Contents
              <IconChevronDown
                aria-hidden="true"
                className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180 motion-reduce:transition-none"
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              <TableOfContents items={toc} />
            </CollapsibleContent>
          </Collapsible>
        ) : null}

        <div className="grid gap-10 @3xl:grid-cols-[minmax(0,1fr)_240px] @3xl:items-start">
          <div className="flex min-w-0 flex-col gap-10">
            <div className={prose}>{children}</div>
            {shareUrl ? (
              <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
                <span className="text-sm font-medium text-foreground">Share this article</span>
                <ShareButtons url={shareUrl} title={title} networks={["x", "linkedin", "email"]} />
              </footer>
            ) : null}
          </div>
          {toc.length ? (
            <aside className="hidden @3xl:sticky @3xl:top-20 @3xl:block @3xl:max-h-[calc(100vh-6rem)] @3xl:overflow-y-auto">
              <TableOfContents items={toc} className="border border-border bg-muted/20 p-4" />
            </aside>
          ) : null}
        </div>
      </article>
    </div>
  );
}
