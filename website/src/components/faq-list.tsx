import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";

import { cn } from "@aback-ui/ui";

import type { FaqItem } from "@/data/faq";

/**
 * Questions and answers as an always-visible description list. The answers
 * stay in the page text rather than behind a disclosure, so readers can scan
 * them and search and answer engines can quote them.
 */
export function FaqList({
  items,
  headingLevel = "h3",
  className,
}: {
  items: FaqItem[];
  headingLevel?: "h2" | "h3";
  className?: string;
}) {
  const Heading = headingLevel;
  return (
    <div className={cn("grid gap-px border border-border bg-border md:grid-cols-2", className)}>
      {items.map((item) => (
        <div key={item.question} className="flex flex-col gap-2 bg-background p-5 sm:p-6">
          <Heading className="text-base font-semibold text-foreground">{item.question}</Heading>
          <p className="text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
          {item.href ? (
            <Link
              href={item.href}
              className="mt-auto inline-flex items-center gap-1 pt-1 text-sm font-medium text-link underline-offset-4 hover:underline"
            >
              Read more
              <span className="sr-only">: {item.question}</span>
              <IconArrowRight aria-hidden="true" className="size-3.5" />
            </Link>
          ) : null}
        </div>
      ))}
    </div>
  );
}
