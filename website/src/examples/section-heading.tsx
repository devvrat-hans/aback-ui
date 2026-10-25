import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";

import { SectionHeading } from "@/components/ui/section-heading";

export function SectionHeadingExample() {
  return (
    <div className="flex w-full flex-col gap-12">
      <SectionHeading
        eyebrow="Catalogue"
        title="Every product we ship"
        description="Live products, public betas, and what is coming next."
        action={
          <Link
            href="/docs/components"
            className="inline-flex items-center gap-1 text-sm font-medium text-link underline-offset-4 hover:underline"
          >
            View all components
            <IconArrowRight aria-hidden="true" className="size-4" />
          </Link>
        }
      />
      <SectionHeading
        align="center"
        size="lg"
        eyebrow="Pricing"
        title="Start free. Upgrade when it pays for itself."
        description="Every plan includes the full component library."
      />
      <SectionHeading as="h3" size="sm" title="Related tools" description="More converters for images." />
    </div>
  );
}
