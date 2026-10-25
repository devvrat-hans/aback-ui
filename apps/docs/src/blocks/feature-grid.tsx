import type { ReactNode } from "react";
import { IconArrowRight } from "@tabler/icons-react";

import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/utils";

export interface Feature {
  /** A 20px Tabler icon. It is decorative. */
  icon: ReactNode;
  title: string;
  description: ReactNode;
  /** Makes the feature a link to its detail page. */
  href?: string;
}

export interface FeatureGridBlockProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  features: Feature[];
  columns?: 2 | 3 | 4;
  /** Id of the section heading, unique per page. */
  headingId?: string;
}

const columnClasses = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

/**
 * A titled grid of features with brand icon chips. Cells share hairline
 * borders instead of floating cards. A feature with an href becomes one
 * link whose name is its title.
 */
export function FeatureGridBlock({
  eyebrow,
  title,
  description,
  features,
  columns = 3,
  headingId = "features-title",
}: FeatureGridBlockProps) {
  return (
    <section aria-labelledby={headingId} className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 lg:py-20">
      <SectionHeading eyebrow={eyebrow} title={title} description={description} headingId={headingId} />

      <ul className={cn("mt-10 grid gap-px border border-border bg-border", columnClasses[columns])}>
        {features.map((feature) => {
          const body = (
            <>
              <span
                aria-hidden="true"
                className="flex size-10 items-center justify-center bg-brand-chip text-brand-icon [&_svg]:size-5"
              >
                {feature.icon}
              </span>
              <h3 className="mt-4 flex items-center gap-1.5 text-base font-semibold text-foreground">
                {feature.title}
                {feature.href ? (
                  <IconArrowRight
                    aria-hidden="true"
                    className="size-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
                  />
                ) : null}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </>
          );

          return (
            <li key={feature.title} className="bg-card">
              {feature.href ? (
                <a
                  href={feature.href}
                  className="group block h-full p-6 outline-none transition-colors duration-200 hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring"
                >
                  {body}
                </a>
              ) : (
                <div className="h-full p-6">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
