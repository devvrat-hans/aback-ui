import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconBraces, IconCheck, IconPencil } from "@tabler/icons-react";

import { Badge, Button, CopyButton } from "@aback-ui/ui";

import { BlockPreview } from "@/components/block-preview";
import { Code } from "@/components/code";
import { DocsPage, DocsPageHeader, DocsPager, DocsSection } from "@/components/docs-page";
import { InlineText } from "@/components/inline-text";
import { PackageCommand } from "@/components/package-command";
import { blockPreviewMap } from "@/block-previews";
import { blocks, blockDocs, getBlock } from "@/data/blocks";
import { getComponent } from "@/data/component-catalog";
import { site } from "@/data/site";
import { readBlockSource } from "@/lib/example-source";
import { blockMarkdown } from "@/lib/llms";

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

export default async function BlockPage({ params }: PageProps) {
  const { slug } = await params;
  const block = getBlock(slug);
  const doc = blockDocs[slug];
  if (!block || !doc || !blockPreviewMap[slug]) notFound();

  const source = await readBlockSource(slug);
  const index = blocks.findIndex((item) => item.name === slug);
  const previous = index > 0 ? blocks[index - 1] : undefined;
  const next = index < blocks.length - 1 ? blocks[index + 1] : undefined;
  const installArgs = `${site.cli} add ${block.name}`;
  const dependencies = (block.registryDependencies ?? []).map((dependency) =>
    dependency.replace(/^.*\/r\//, "").replace(/\.json$/, ""),
  );
  const componentCount = dependencies.filter((name) => getComponent(name)).length;

  return (
    <DocsPage>
      <DocsPageHeader
        eyebrow={`Block · ${block.categories?.[0] ?? "Pattern"}`}
        title={block.title}
        description={block.description}
        crumbs={[
          { label: "Docs", href: "/docs" },
          { label: "Blocks", href: "/docs/blocks" },
          { label: block.title },
        ]}
      >
        <Badge variant="info" dot>
          Beta
        </Badge>
        <Badge variant="outline">
          {componentCount} {componentCount === 1 ? "component" : "components"}
        </Badge>
        <span className="flex flex-wrap items-center gap-2 sm:ml-auto">
          <CopyButton
            value={blockMarkdown(block.name)}
            variant="outline"
            size="sm"
            showLabel
            label="Copy as Markdown"
          />
          <Button variant="outline" size="sm" asChild>
            <a href={`/r/${block.name}.json`} target="_blank" rel="noreferrer">
              <IconBraces aria-hidden="true" />
              Registry JSON
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </Button>
        </span>
      </DocsPageHeader>

      <div className="mt-10 flex flex-col gap-16">
        <BlockPreview
          slug={block.name}
          title={block.title}
          code={
            source ? (
              <Code
                code={source}
                filename={`components/blocks/${block.name}.tsx`}
                language="tsx"
                collapseAfter={40}
              />
            ) : undefined
          }
        />

        <div className="grid grid-cols-1 gap-16 xl:grid-cols-2 xl:gap-12">
          <DocsSection
            id="installation"
            title="Installation"
            description="One item installs the block and every component it imports."
          >
            <PackageCommand args={installArgs} />
            <p className="text-sm leading-relaxed text-muted-foreground">
              The block lands at{" "}
              <code className="bg-muted px-1 font-mono text-[0.9em] text-foreground">components/blocks/{block.name}.tsx</code>.
              First time in this project? Run{" "}
              <code className="bg-muted px-1 font-mono text-[0.9em] text-foreground">npx {site.cli} init</code>{" "}
              first, as{" "}
              <Link href="/docs/installation" className="font-medium text-link underline underline-offset-4">
                the installation guide
              </Link>{" "}
              shows. Blocks are copied with the CLI; they are not part of the npm package.
            </p>
          </DocsSection>

          <DocsSection
            id="built-from"
            title="Built from"
            description="The registry installs these components with the block."
          >
            <ul className="flex flex-wrap gap-2">
              {dependencies.map((name) => {
                const component = getComponent(name);
                return (
                  <li key={name}>
                    {component ? (
                      <Link
                        href={`/docs/components/${name}`}
                        className="inline-flex items-center border border-separator px-3 py-1.5 text-sm font-medium text-foreground transition-colors duration-200 hover:border-primary-400 hover:text-link"
                      >
                        {component.title}
                      </Link>
                    ) : (
                      <span className="inline-flex items-center border border-separator px-3 py-1.5 font-mono text-xs text-muted-foreground">
                        {name}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </DocsSection>
        </div>

        <div className="grid grid-cols-1 gap-16 xl:grid-cols-2 xl:gap-12">
          <DocsSection id="customize" title="What to customize">
            <ul className="flex flex-col divide-y divide-border border border-border">
              {doc.notes.map((note) => (
                <li key={note} className="flex items-start gap-3 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                  <IconPencil aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-icon" />
                  <span>
                    <InlineText text={note} />
                  </span>
                </li>
              ))}
            </ul>
          </DocsSection>

          <DocsSection id="accessibility" title="Accessibility">
            <ul className="flex flex-col divide-y divide-border border border-border">
              {doc.accessibility.map((line) => (
                <li key={line} className="flex items-start gap-3 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                  <IconCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success" />
                  <span>
                    <InlineText text={line} />
                  </span>
                </li>
              ))}
            </ul>
          </DocsSection>
        </div>

        <DocsPager
          label="Block pagination"
          previous={previous ? { title: previous.title, href: `/docs/blocks/${previous.name}` } : undefined}
          next={next ? { title: next.title, href: `/docs/blocks/${next.name}` } : undefined}
        />
      </div>
    </DocsPage>
  );
}
