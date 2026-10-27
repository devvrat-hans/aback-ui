import type { Metadata } from "next";
import Link from "next/link";
import { IconArrowRight } from "@tabler/icons-react";

import { Badge } from "@aback-ui/ui";

import { BlockThumbnail } from "@/components/block-thumbnail";
import { DocsPage, DocsPageHeader } from "@/components/docs-page";
import { blocks } from "@/data/blocks";
import { itemListSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/docs/blocks");

const categories = [...new Set(blocks.flatMap((block) => block.categories ?? []))];

export default function BlocksPage() {
  return (
    <DocsPage>
      <DocsPageHeader
        path="/docs/blocks"
        schema={[itemListSchema(blocks.map((block) => ({ name: block.title, path: `/docs/blocks/${block.name}` })))]}
        eyebrow="Catalogue"
        title="Blocks"
        description="Complete, customizable sections built from the same components. Install one item and the components it uses arrive with it."
        crumbs={[{ label: "Docs", href: "/docs" }, { label: "Blocks" }]}
      >
        <Badge variant="outline">{blocks.length} blocks</Badge>
        <Badge variant="outline">{categories.length} categories</Badge>
        <Badge variant="info" dot>
          Beta
        </Badge>
      </DocsPageHeader>

      <ul className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2">
        {blocks.map((block) => (
          <li key={block.name}>
            <Link
              href={`/docs/blocks/${block.name}`}
              className="group flex flex-col gap-4 outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
            >
              <div className="border border-border transition-colors duration-200 group-hover:border-primary-300 dark:group-hover:border-primary-700">
                <BlockThumbnail slug={block.name} title={block.title} />
              </div>
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-semibold text-foreground group-hover:text-link">
                      {block.title}
                    </span>
                    {(block.categories ?? []).slice(0, 1).map((category) => (
                      <Badge key={category} variant="muted">
                        {category}
                      </Badge>
                    ))}
                  </p>
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {block.description}
                  </p>
                </div>
                <IconArrowRight
                  aria-hidden="true"
                  className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-link motion-reduce:transition-none"
                />
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <aside className="mt-16 border border-border bg-muted/30 p-6">
        <h2 className="text-lg font-semibold text-foreground">How blocks differ from components</h2>
        <p className="mt-2 max-w-[72ch] text-sm leading-relaxed text-muted-foreground">
          A block is a composed workflow, not a new primitive. It installs into{" "}
          <code className="bg-muted px-1 font-mono text-xs text-foreground">components/blocks</code> and pulls the
          components it uses from the registry. It owns no routing, auth provider, database, or
          product data model: you pass the callbacks and keep the source. Read{" "}
          <Link href="/docs/registry" className="font-medium text-link underline underline-offset-4">
            the registry guide
          </Link>{" "}
          for the item schema and overwrite behavior.
        </p>
      </aside>
    </DocsPage>
  );
}
