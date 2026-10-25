import { useId, type ReactNode } from "react";
import { IconArrowRight, IconCheck } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";

export interface HeroAction {
  label: string;
  href: string;
}

export interface HeroBlockProps {
  /** A short announcement linked from a pill above the title. */
  announcement?: { label: ReactNode; href: string };
  /** The first line of the h1. */
  title: ReactNode;
  /** An optional second line of the h1, set in the brand colour. */
  highlight?: ReactNode;
  description: ReactNode;
  primaryAction: HeroAction;
  secondaryAction?: HeroAction;
  /** A line under the actions, such as "No credit card required." */
  note?: ReactNode;
  /** Short proof points with check marks. Keep them true and specific. */
  highlights?: string[];
  /** Content for the right column on wide screens: a product shot, stats, or a demo. */
  aside?: ReactNode;
}

/**
 * The opening section of a landing page. It renders the page's h1, so use it
 * once. The layout is two columns from lg and stacks on smaller screens, with
 * the aside after the actions.
 */
export function HeroBlock({
  announcement,
  title,
  highlight,
  description,
  primaryAction,
  secondaryAction,
  note,
  highlights = [],
  aside,
}: HeroBlockProps) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} className="border-b border-separator">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-14 md:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-20">
        <div className="flex flex-col items-start">
          {announcement ? (
            <a
              href={announcement.href}
              className="group mb-6 inline-flex items-center gap-2 border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground outline-none transition-colors duration-200 hover:border-primary-300 hover:text-foreground focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span aria-hidden="true" className="size-1.5 bg-primary-500" />
              {announcement.label}
              <IconArrowRight
                aria-hidden="true"
                className="size-3 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
              />
            </a>
          ) : null}

          <h1
            id={headingId}
            className="max-w-xl text-4xl font-bold leading-[1.05] tracking-tight text-foreground text-balance sm:text-5xl"
          >
            {title}
            {highlight ? <span className="block text-link">{highlight}</span> : null}
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {description}
          </p>

          <div className="mt-8 flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
            <Button size="lg" variant="brand" asChild>
              <a href={primaryAction.href}>
                {primaryAction.label}
                <IconArrowRight aria-hidden="true" />
              </a>
            </Button>
            {secondaryAction ? (
              <Button size="lg" variant="outline" asChild>
                <a href={secondaryAction.href}>{secondaryAction.label}</a>
              </Button>
            ) : null}
          </div>

          {note ? <p className="mt-3 text-xs text-muted-foreground">{note}</p> : null}

          {highlights.length ? (
            <ul className="mt-6 grid gap-x-6 gap-y-2 text-sm text-muted-foreground sm:grid-cols-2">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <IconCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-icon" />
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        {aside ? <div className="min-w-0">{aside}</div> : null}
      </div>
    </section>
  );
}
