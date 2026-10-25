import Link from "next/link";
import {
  IconAlertTriangle,
  IconArrowRight,
  IconBulb,
  IconInfoCircle,
  type Icon,
} from "@tabler/icons-react";

import { Alert, AlertDescription, AlertTitle, cn } from "@aback-ui/ui";

import { DocsPager } from "@/components/docs-page";
import { guides, site } from "@/data/site";

/**
 * Numbered instructions. Each step's title is an h3 with an id, so steps can
 * be linked and listed in the "On this page" rail.
 */
export function DocsSteps({ children }: { children: React.ReactNode }) {
  return <ol className="docs-steps flex flex-col">{children}</ol>;
}

export function DocsStep({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="docs-step relative flex gap-5 pb-10 last:pb-0">
      <span
        aria-hidden="true"
        className="docs-step-line absolute bottom-0 left-4 top-10 w-px bg-primary-200 dark:bg-primary-800"
      />
      <span
        aria-hidden="true"
        className="docs-step-marker relative flex size-8 shrink-0 items-center justify-center bg-brand-fill text-xs font-bold tabular-nums text-on-brand-fill"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-3 pt-1">
        <h3 id={id} className="scroll-mt-20 text-base font-semibold text-foreground">
          {title}
        </h3>
        <div className="prose-docs flex flex-col gap-3 [&>*+*]:mt-0">{children}</div>
      </div>
    </li>
  );
}

const callouts = {
  note: { icon: IconInfoCircle, variant: "info" },
  tip: { icon: IconBulb, variant: "success" },
  warning: { icon: IconAlertTriangle, variant: "warning" },
} as const satisfies Record<string, { icon: Icon; variant: "info" | "success" | "warning" }>;

/** A highlighted aside inside a guide: a note, a tip, or a warning. */
export function Callout({
  type = "note",
  title,
  children,
  className,
}: {
  type?: keyof typeof callouts;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { icon: CalloutIcon, variant } = callouts[type];
  return (
    <Alert variant={variant} className={cn("px-4 py-3", className)}>
      <CalloutIcon aria-hidden="true" />
      <div className="flex min-w-0 flex-col gap-1">
        {title ? <AlertTitle>{title}</AlertTitle> : null}
        <AlertDescription className="[&_a]:font-medium [&_a]:underline [&_a]:underline-offset-4 [&_code]:bg-background/60 [&_code]:px-1 [&_code]:font-mono [&_code]:text-[0.9em]">
          {children}
        </AlertDescription>
      </div>
    </Alert>
  );
}

/** Shown on install pages until the packages are on npm. */
export function PreReleaseNotice() {
  if (site.npmPublished) return null;
  return (
    <Callout type="warning" title="Not on npm yet">
      <code>aback-ui</code>, <code>@aback-ui/ui</code>, and <code>@aback-ui/tokens</code> are built and
      tested but have not been published. The commands on this page work from the first release.
    </Callout>
  );
}

export interface LinkCardItem {
  title: string;
  description: string;
  href: string;
  icon?: Icon;
}

/** A grid of destinations, used for "where next" at the end of a guide. */
export function LinkCards({ items, className }: { items: LinkCardItem[]; className?: string }) {
  return (
    <ul className={cn("grid gap-3 sm:grid-cols-2", className)}>
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className="group flex h-full gap-4 border border-border bg-card p-4 outline-none transition-colors duration-200 hover:border-primary-300 focus-visible:ring-2 focus-visible:ring-focus-ring dark:hover:border-primary-700"
          >
            {item.icon ? (
              <span className="flex size-9 shrink-0 items-center justify-center bg-brand-chip text-brand-icon">
                <item.icon aria-hidden="true" className="size-4" />
              </span>
            ) : null}
            <span className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="flex items-center justify-between gap-2 text-sm font-semibold text-foreground group-hover:text-link">
                {item.title}
                <IconArrowRight
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-link motion-reduce:transition-none"
                />
              </span>
              <span className="text-sm leading-relaxed text-muted-foreground">{item.description}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Previous and next guide, in the sidebar's reading order. */
export function GuidePager({ href }: { href: string }) {
  const index = guides.findIndex((guide) => guide.href === href);
  if (index === -1) return null;
  const previous = guides[index - 1];
  const next = guides[index + 1];
  return (
    <DocsPager
      label="Guide pagination"
      previous={previous ? { title: previous.title, href: previous.href } : undefined}
      next={next ? { title: next.title, href: next.href } : undefined}
    />
  );
}
