import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconArrowLeft, IconArrowRight, IconCheck } from "@tabler/icons-react";

import {
  Badge,
  Breadcrumbs,
  Button,
  CodeBlock,
  PageHeader,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@aback-ui/ui";

import { PackageCommand } from "@/components/package-command";
import { BlockPreview } from "@/components/block-preview";
import { blockPreviewMap } from "@/blocks";
import { blocks, blockDocs, getBlock } from "@/data/blocks";
import { getComponent } from "@/data/component-catalog";
import { readBlockSource } from "@/lib/example-source";

export const dynamicParams = false;

export function generateStaticParams() {
  return blocks.map((block) => ({ slug: block.name }));
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const block = getBlock(slug);
  if (!block) return {};

  const title = `${block.title} block`;
  const url = `/docs/blocks/${block.name}`;
  return {
    title,
    description: block.description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: block.description,
      url,
      type: "article",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: `${block.title} block in Aback UI` }],
    },
  };
}

function Section({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="scroll-mt-24 space-y-4" aria-labelledby={`${id}-heading`}>
      <div className="space-y-1">
        <h2
          id={`${id}-heading`}
          className="scroll-mt-24 text-xl font-semibold tracking-tight text-foreground"
        >
          {title}
        </h2>
        {description ? (
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export default async function BlockPage({ params }: PageProps) {
  const { slug } = await params;
  const block = getBlock(slug);
  const doc = blockDocs[slug];
  if (!block || !doc || !blockPreviewMap[slug]) notFound();

  const source = await readBlockSource(slug);
  const index = blocks.findIndex((item) => item.name === slug);
  const previous = index > 0 ? blocks[index - 1] : undefined;
  const next = index < blocks.length - 1 ? blocks[index + 1] : undefined;
  const installArgs = `shadcn@latest add https://abackui.com/r/${block.name}.json`;
  const dependencies = (block.registryDependencies ?? []).map((dependency) =>
    dependency.replace(/^.*\/r\//, "").replace(/\.json$/, ""),
  );

  return (
    <article className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <PageHeader
          eyebrow={`Block · ${block.categories?.[0] ?? "Pattern"}`}
          title={block.title}
          description={block.description}
          actions={<Badge variant="warning">Beta</Badge>}
        />
        <Breadcrumbs
          items={[
            { label: "Docs", href: "/docs" },
            { label: "Blocks", href: "/docs/blocks" },
            { label: block.title },
          ]}
        />
      </div>

      <nav aria-label="On this page" className="flex flex-wrap gap-2">
        {[
          ["install", "Install"],
          ["preview", "Preview"],
          ["usage", "Usage"],
          ["customize", "Customize"],
          ["accessibility", "Accessibility"],
        ].map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            className="border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground underline-offset-4 hover:border-primary-300 hover:text-foreground"
          >
            {label}
          </a>
        ))}
      </nav>

      <Section
        id="install"
        title="Installation"
        description="One item installs the block and every component it imports."
      >
        <Tabs defaultValue="cli">
          <TabsList aria-label="Installation method">
            <TabsTrigger value="cli">CLI</TabsTrigger>
            <TabsTrigger value="manual">Manual</TabsTrigger>
          </TabsList>

          <TabsContent value="cli" className="space-y-3">
            <PackageCommand args={installArgs} />
            <p className="text-xs leading-relaxed text-muted-foreground">
              The registry item declares {dependencies.length} registry dependencies, so the CLI
              installs them first. The block lands at{" "}
              <code className="bg-muted px-1 font-mono">components/blocks/{block.name}.tsx</code>.
            </p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              First time here? Install the theme and shared utilities with{" "}
              <Link href="/docs/installation" className="text-link underline underline-offset-4">
                the installation guide
              </Link>
              .
            </p>
          </TabsContent>

          <TabsContent value="manual" className="space-y-3">
            <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm text-muted-foreground">
              <li>
                Copy <code className="bg-muted px-1 font-mono">components/blocks/{block.name}.tsx</code>{" "}
                into your project.
              </li>
              <li>
                Install its registry dependencies:{" "}
                <code className="bg-muted px-1 font-mono">{dependencies.join(", ")}</code>.
              </li>
              <li>
                Install the npm packages those components declare. The registry page for each
                component lists them.
              </li>
            </ol>
          </TabsContent>
        </Tabs>
      </Section>

      <Section
        id="preview"
        title="Preview"
        description="The exact source the registry installs, rendered in a frame so media queries, sticky headers, and fixed banners behave as they would on your page."
      >
        <BlockPreview slug={block.name} title={block.title} />
      </Section>

      <Section
        id="usage"
        title="Usage"
        description="Copy the file, then pass your own callbacks. No backend is implied."
      >
        {source ? (
          <CodeBlock code={source} filename={`components/blocks/${block.name}.tsx`} language="tsx" />
        ) : (
          <p className="text-sm text-muted-foreground">Block source is unavailable.</p>
        )}
      </Section>

      <Section id="customize" title="What to customize">
        <ul className="flex flex-col gap-2">
          {doc.notes.map((note) => (
            <li
              key={note}
              className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"
            >
              <IconCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-primary-600 dark:text-primary-400" />
              {note}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="accessibility" title="Accessibility">
        <ul className="flex flex-col gap-2">
          {doc.accessibility.map((line) => (
            <li
              key={line}
              className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground"
            >
              <IconCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success" />
              {line}
            </li>
          ))}
        </ul>
      </Section>

      <Section id="related" title="Built from">
        <div className="grid gap-3 sm:grid-cols-2">
          {doc.related.map((slugName) => {
            const related = getComponent(slugName);
            if (!related) return null;
            return (
              <Link
                key={slugName}
                href={`/docs/components/${slugName}`}
                className="group flex flex-col gap-1 border border-border p-4 transition-colors hover:border-primary-300 hover:bg-muted/40"
              >
                <span className="flex items-center justify-between text-sm font-medium text-foreground group-hover:text-link">
                  {related.title}
                  <IconArrowRight aria-hidden="true" className="size-4" />
                </span>
                <span className="text-xs leading-relaxed text-muted-foreground">
                  {related.description}
                </span>
              </Link>
            );
          })}
        </div>
      </Section>

      <nav aria-label="Block pagination" className="grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
        {previous ? (
          <Link
            href={`/docs/blocks/${previous.name}`}
            className="group flex flex-col gap-1 border border-border p-4 transition-colors hover:border-primary-300 hover:bg-muted/40"
          >
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <IconArrowLeft aria-hidden="true" className="size-3.5" />
              Previous
            </span>
            <span className="text-sm font-medium text-foreground group-hover:text-link">
              {previous.title}
            </span>
          </Link>
        ) : (
          <span aria-hidden="true" />
        )}
        {next ? (
          <Link
            href={`/docs/blocks/${next.name}`}
            className="group flex flex-col items-end gap-1 border border-border p-4 text-right transition-colors hover:border-primary-300 hover:bg-muted/40"
          >
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              Next
              <IconArrowRight aria-hidden="true" className="size-3.5" />
            </span>
            <span className="text-sm font-medium text-foreground group-hover:text-link">
              {next.title}
            </span>
          </Link>
        ) : null}
      </nav>

      <Button variant="ghost" size="sm" asChild className="self-start">
        <Link href="/docs/blocks">
          <IconArrowLeft aria-hidden="true" />
          Back to all blocks
        </Link>
      </Button>
    </article>
  );
}
