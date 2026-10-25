import type { Metadata } from "next";
import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";

import { Badge } from "@aback-ui/ui";

import { ComponentCatalog } from "@/components/component-catalog";
import { DocsPage, DocsPageHeader } from "@/components/docs-page";
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
    <DocsPage>
      <DocsPageHeader
        eyebrow="Catalogue"
        title="Components"
        description="Small, composable pieces with real keyboard behavior, documented APIs, and no product logic. Install the source and own it."
        crumbs={[{ label: "Docs", href: "/docs" }, { label: "Components" }]}
      >
        <Badge variant="outline">{components.length} components</Badge>
        <Badge variant="outline">{componentGroups.length} categories</Badge>
        <Badge variant="success" dot>
          {components.filter((item) => item.meta?.status === "stable").length} stable
        </Badge>
      </DocsPageHeader>

      <div className="mt-10">
        <ComponentCatalog
          categories={componentGroups.map((group) => group.category)}
          items={components.map((item) => ({
            name: item.name,
            title: item.title,
            description: item.description,
            category: item.categories?.[0] ?? "Foundation",
            status: item.meta?.status ?? "beta",
            usedIn: (item.meta?.usedIn ?? []).map((product) => productName(product)),
          }))}
        />
      </div>

      <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border border-border bg-muted/30 p-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Looking for a block?</h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Blocks are complete patterns built from these components: headers, pricing, FAQ,
            sign-in, settings, and more. Each installs with every component it uses.
          </p>
        </div>
        <Link
          href="/docs/blocks"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-link underline-offset-4 hover:underline"
        >
          Browse blocks
          <IconArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </DocsPage>
  );
}
