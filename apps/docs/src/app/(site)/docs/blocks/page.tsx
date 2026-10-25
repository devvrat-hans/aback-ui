import type { Metadata } from "next";
import Link from "next/link";
import { IconArrowRight, IconBox } from "@tabler/icons-react";

import { Badge, Breadcrumbs, PageHeader } from "@aback-ui/ui";

import { blocks } from "@/data/blocks";

export const metadata: Metadata = {
  title: "Blocks",
  description:
    "Composed Aback UI patterns: site headers, footers, pricing, FAQ, sign-in, settings, tables, and article layouts that install with their component dependencies.",
  alternates: { canonical: "/docs/blocks" },
};

const categories = [...new Set(blocks.flatMap((block) => block.categories ?? []))];

export default function BlocksPage() {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <PageHeader
          eyebrow="Catalogue"
          title="Blocks"
          description="Complete, customizable patterns built from the same components. Install one item and its component dependencies arrive with it."
        />
        <Breadcrumbs items={[{ label: "Docs", href: "/docs" }, { label: "Blocks" }]} />
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="outline">{blocks.length} blocks</Badge>
        <Badge variant="outline">{categories.length} categories</Badge>
        <Badge variant="warning">Beta</Badge>
        <span>Every block is the source the registry installs.</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {blocks.map((block) => (
          <Link
            key={block.name}
            href={`/docs/blocks/${block.name}`}
            className="group flex flex-col gap-3 border border-border p-5 transition-colors hover:border-primary-300 hover:bg-muted/30"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="flex size-8 items-center justify-center bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400">
                  <IconBox aria-hidden="true" className="size-4" />
                </span>
                <span className="text-sm font-semibold text-foreground group-hover:text-link">
                  {block.title}
                </span>
              </div>
              <IconArrowRight
                aria-hidden="true"
                className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-link motion-reduce:group-hover:translate-x-0"
              />
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">{block.description}</p>
            <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
              {(block.categories ?? []).map((category) => (
                <Badge key={category} variant="outline">
                  {category}
                </Badge>
              ))}
              <Badge variant="secondary">
                {block.registryDependencies?.length ?? 0} dependencies
              </Badge>
            </div>
          </Link>
        ))}
      </div>

      <div className="border border-border bg-muted/20 p-5">
        <h2 className="text-base font-semibold text-foreground">How blocks differ from components</h2>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          A block is a composed workflow, not a new primitive. It installs into{" "}
          <code className="bg-muted px-1 font-mono text-xs">components/blocks</code> and pulls the
          components it uses from the registry. It owns no routing, auth provider, database, or
          product data model: you pass the callbacks and keep the source.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Read <Link href="/docs/registry" className="text-link underline underline-offset-4">the registry guide</Link>{" "}
          for the item schema and overwrite behavior.
        </p>
      </div>
    </div>
  );
}
