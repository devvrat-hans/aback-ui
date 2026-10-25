import { useId, type ReactNode } from "react";
import { IconArrowRight } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CtaBannerBlockProps {
  title: ReactNode;
  description?: ReactNode;
  primaryAction: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
  /** "brand" is a soft Aback Blue wash; "muted" is neutral for dense pages. */
  tone?: "brand" | "muted";
}

/**
 * A closing call to action for the end of a page or a section. One primary
 * action, at most one secondary. It stacks on phones and lines up on one row
 * from md.
 */
export function CtaBannerBlock({
  title,
  description,
  primaryAction,
  secondaryAction,
  tone = "brand",
}: CtaBannerBlockProps) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
      <div
        className={cn(
          "flex flex-col gap-6 border p-6 sm:p-10 md:flex-row md:items-center md:justify-between",
          tone === "brand"
            ? "border-primary-200 bg-brand-wash dark:border-primary-800/60"
            : "border-border bg-muted/40",
        )}
      >
        <div className="flex max-w-2xl flex-col gap-2">
          <h2 id={headingId} className="text-2xl font-bold tracking-tight text-foreground text-balance">
            {title}
          </h2>
          {description ? (
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{description}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          {secondaryAction ? (
            <Button variant="outline" size="lg" asChild>
              <a href={secondaryAction.href}>{secondaryAction.label}</a>
            </Button>
          ) : null}
          <Button variant="brand" size="lg" asChild>
            <a href={primaryAction.href}>
              {primaryAction.label}
              <IconArrowRight aria-hidden="true" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
