import type { Metadata } from "next";
import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";

import { Badge, Breadcrumbs, PageHeader } from "@aback-ui/ui";

import { componentGroups, components } from "@/data/component-catalog";
import { productName } from "@/data/products";

export const metadata: Metadata = {
  title: "Components",
  description:
    "Every Aback UI component, grouped by layer, with live previews, API references, and accessibility notes.",
  alternates: { canonical: "/docs/components" },
};

export default function ComponentsPage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <PageHeader
          eyebrow="Catalogue"
          title="Components"
          description="Small, composable pieces with real keyboard behavior, documented APIs, and no product logic. Install the source and own it."
        />
        <Breadcrumbs items={[{ label: "Docs", href: "/docs" }, { label: "Components" }]} />
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="outline">{components.length} components</Badge>
        <Badge variant="outline">{componentGroups.length} categories</Badge>
        <Badge variant="success">Stable</Badge>
        <span>Every component installs by source through the registry.</span>
      </div>

      <div className="flex flex-col gap-12">
        {componentGroups.map((group) => (
          <section key={group.category} aria-labelledby={`category-${group.category}`}>
            <div className="mb-4 flex items-end justify-between gap-4 border-b border-border pb-2">
              <h2
                id={`category-${group.category}`}
                className="scroll-mt-24 text-xl font-semibold tracking-tight text-foreground"
              >
                {group.category}
              </h2>
              <span className="text-xs text-muted-foreground">
                {group.items.length} {group.items.length === 1 ? "component" : "components"}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {group.items.map((item) => {
                const usedIn = item.meta?.usedIn ?? [];
                return (
                  <Link
                    key={item.name}
                    href={`/docs/components/${item.name}`}
                    className="group flex flex-col gap-2 border border-border p-4 transition-colors hover:border-primary-300 hover:bg-muted/30"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-sm font-semibold text-foreground group-hover:text-link">
                        {item.title}
                      </span>
                      <IconArrowRight
                        aria-hidden="true"
                        className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-link motion-reduce:group-hover:translate-x-0"
                      />
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                    <p className="mt-auto pt-1 text-[11px] text-muted-foreground">
                      {usedIn.length
                        ? `Used in ${usedIn.map((product) => productName(product)).join(", ")}`
                        : "New shared pattern"}
                    </p>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="border border-border bg-muted/20 p-5">
        <h2 className="text-base font-semibold text-foreground">Looking for a block?</h2>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Blocks are composed workflows such as a full settings page or an onboarding sequence.
          They are not published yet. The component layer and registry install path come first, so
          no placeholder block pages are shown.
        </p>
      </div>
    </div>
  );
}
