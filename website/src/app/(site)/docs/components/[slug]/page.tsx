import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconArrowRight, IconArrowUpRight, IconBraces, IconCheck } from "@tabler/icons-react";

import {
  Badge,
  Button,
  CopyButton,
  Kbd,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@aback-ui/ui";

import { Code } from "@/components/code";
import { ComponentPreview } from "@/components/component-preview";
import { DocsPage, DocsPageHeader, DocsPager, DocsSection } from "@/components/docs-page";
import { InlineText } from "@/components/inline-text";
import { PackageCommand } from "@/components/package-command";
import { componentDocs } from "@/data/component-docs";
import { components, getComponent } from "@/data/component-catalog";
import { products, productName } from "@/data/products";
import { site } from "@/data/site";
import { exampleMap } from "@/examples";
import { formatImport, readComponentExports, readExampleSource } from "@/lib/example-source";
import { componentMarkdown } from "@/lib/llms";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return components.map((component) => ({ slug: component.name }));
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return getComponent(slug) ? pageMetadata(`/docs/components/${slug}`) : {};
}

export default async function ComponentPage({ params }: PageProps) {
  const { slug } = await params;
  const item = getComponent(slug);
  const doc = componentDocs[slug];
  const Example = exampleMap[slug];

  if (!item || !doc || !Example) notFound();

  const [source, exported] = await Promise.all([
    readExampleSource(slug),
    readComponentExports(item.files),
  ]);
  const cliImport = exported ? formatImport(exported.names, exported.module) : null;
  const packageImport = exported ? formatImport(exported.names, "@aback-ui/ui") : null;
  const index = components.findIndex((component) => component.name === slug);
  const previous = index > 0 ? components[index - 1] : undefined;
  const next = index < components.length - 1 ? components[index + 1] : undefined;
  const usedIn = item.meta?.usedIn ?? [];
  const installArgs = `${site.cli} add ${item.name}`;
  const dependencies = item.dependencies ?? [];
  const stable = item.meta?.status === "stable";

  const toc = [
    { id: "installation", title: "Installation" },
    { id: "usage", title: "Usage" },
    { id: "api", title: "API reference" },
    { id: "accessibility", title: "Accessibility" },
    ...(doc.keyboard?.length ? [{ id: "keyboard", title: "Keyboard", depth: 2 as const }] : []),
    { id: "used-in", title: "Used in production" },
    ...(doc.related.length ? [{ id: "related", title: "Related" }] : []),
  ];

  return (
    <DocsPage toc={toc}>
      <DocsPageHeader
        path={`/docs/components/${item.name}`}
        eyebrow={item.categories?.[0] ?? "Component"}
        title={item.title}
        description={item.description}
        crumbs={[
          { label: "Docs", href: "/docs" },
          { label: "Components", href: "/docs/components" },
          { label: item.title },
        ]}
      >
        <Badge variant={stable ? "success" : "info"} dot>
          {stable ? "Stable" : "Beta"}
        </Badge>
        <Badge variant="outline">
          {usedIn.length
            ? `Used in ${usedIn.map((product) => productName(product)).join(", ")}`
            : "New shared pattern"}
        </Badge>
        <span className="flex flex-wrap items-center gap-2 sm:ml-auto">
          <CopyButton
            value={componentMarkdown(item.name)}
            variant="outline"
            size="sm"
            showLabel
            label="Copy as Markdown"
          />
          <Button variant="outline" size="sm" asChild>
            <a href={`/r/${item.name}.json`} target="_blank" rel="noreferrer">
              <IconBraces aria-hidden="true" />
              Registry JSON
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </Button>
        </span>
      </DocsPageHeader>

      <div className="mt-10 flex flex-col gap-16">
        <ComponentPreview
          label={`${item.title} example`}
          preview={<Example />}
          code={
            source ? (
              <Code code={source} filename={`examples/${slug}.tsx`} language="tsx" collapseAfter={28} />
            ) : (
              <p className="text-sm text-muted-foreground">Example source is unavailable.</p>
            )
          }
        />

        <DocsSection
          id="installation"
          title="Installation"
          description="Copy the source with the CLI to own and edit it, or import it from the npm package."
        >
          <Tabs defaultValue="cli" className="gap-0">
            <TabsList aria-label="Installation method">
              <TabsTrigger value="cli">CLI</TabsTrigger>
              <TabsTrigger value="package">npm package</TabsTrigger>
              <TabsTrigger value="manual">Manual</TabsTrigger>
            </TabsList>

            <TabsContent value="cli" className="flex flex-col gap-3">
              <PackageCommand args={installArgs} />
              <p className="text-sm leading-relaxed text-muted-foreground">
                Writes <code className="bg-muted px-1 font-mono text-[0.9em] text-foreground">{item.files?.[0] ?? `components/ui/${item.name}.tsx`}</code>
                {(item.registryDependencies ?? []).filter((dependency) => !dependency.endsWith("/utils.json")).length
                  ? " and the components it builds on"
                  : ""}
                . First time in this project? Run{" "}
                <code className="bg-muted px-1 font-mono text-[0.9em] text-foreground">npx {site.cli} init</code> first, as the{" "}
                <Link href="/docs/installation" className="font-medium text-link underline underline-offset-4">
                  installation guide
                </Link>{" "}
                shows.
              </p>
            </TabsContent>

            <TabsContent value="package" className="flex flex-col gap-3">
              <PackageCommand kind="install" args="@aback-ui/ui @aback-ui/tokens" />
              {packageImport ? <Code code={packageImport} language="tsx" copyLabel="Copy import" /> : null}
              <p className="text-sm leading-relaxed text-muted-foreground">
                The package needs one stylesheet change before components are styled. See the{" "}
                <Link href="/docs/package" className="font-medium text-link underline underline-offset-4">
                  npm package guide
                </Link>
                .
              </p>
            </TabsContent>

            <TabsContent value="manual">
              <ol className="flex flex-col gap-4">
                {[
                  <>
                    Install the dependencies:{" "}
                    <code className="bg-muted px-1 font-mono text-[0.9em] text-foreground">
                      {dependencies.length ? dependencies.join(" ") : "none beyond the shared utils"}
                    </code>
                  </>,
                  <>
                    Copy the source from{" "}
                    <a
                      href={`/r/${item.name}.json`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium text-link underline underline-offset-4"
                    >
                      the registry item
                    </a>{" "}
                    into <code className="bg-muted px-1 font-mono text-[0.9em] text-foreground">{item.files?.[0] ?? `components/ui/${item.name}.tsx`}</code>.
                  </>,
                  <>Update the import paths to match your project setup.</>,
                ].map((step, stepIndex) => (
                  <li key={stepIndex} className="flex gap-3 text-sm leading-relaxed text-muted-foreground">
                    <span
                      aria-hidden="true"
                      className="flex size-6 shrink-0 items-center justify-center border border-border text-xs font-semibold tabular-nums text-foreground"
                    >
                      {stepIndex + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </TabsContent>
          </Tabs>
        </DocsSection>

        <DocsSection
          id="usage"
          title="Usage"
          description="Import the parts you need from the installed file. The Code tab above has a complete, working example."
        >
          {cliImport ? (
            <Code code={cliImport} language="tsx" copyLabel="Copy import" />
          ) : (
            <p className="text-sm text-muted-foreground">See the example source above.</p>
          )}
        </DocsSection>

        <DocsSection
          id="api"
          title="API reference"
          description={`Props and composition points for ${item.title}. Native element props pass through.`}
        >
          <Table containerProps={{ "aria-label": `${item.title} API reference` }}>
            <TableHeader>
              <TableRow>
                <TableHead>Prop</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Default</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doc.api.map((row) => (
                <TableRow key={row.prop}>
                  <TableCell className="whitespace-nowrap align-top">
                    <code className="font-mono text-xs font-semibold text-link">{row.prop}</code>
                  </TableCell>
                  <TableCell className="align-top">
                    <code className="font-mono text-xs text-foreground">{row.type}</code>
                  </TableCell>
                  <TableCell className="whitespace-nowrap align-top font-mono text-xs text-muted-foreground">
                    {row.defaultValue ?? "None"}
                  </TableCell>
                  <TableCell className="min-w-[16rem] align-top text-sm leading-relaxed text-muted-foreground">
                    <InlineText text={row.description} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Dependencies:{" "}
            <code className="bg-muted px-1 font-mono text-foreground">
              {dependencies.length ? dependencies.join(", ") : "no extra packages"}
            </code>
            , plus the shared <code className="bg-muted px-1 font-mono text-foreground">@/lib/utils</code> helper.
          </p>
        </DocsSection>

        <DocsSection
          id="accessibility"
          title="Accessibility"
          description="Semantics, keyboard behavior, and the decisions that keep the component operable."
        >
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

          {doc.keyboard?.length ? (
            <div className="flex flex-col gap-3 pt-4">
              <h3 id="keyboard" className="scroll-mt-20 text-base font-semibold text-foreground">
                Keyboard
              </h3>
              <Table containerProps={{ "aria-label": `${item.title} keyboard interactions` }}>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-48">Key</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {doc.keyboard.map((row) => (
                    <TableRow key={row.key}>
                      <TableCell className="whitespace-nowrap">
                        <span className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                          {row.key.split(/\s*([+/])\s*/).map((part, partIndex) =>
                            part === "+" ? (
                              <span key={partIndex}>+</span>
                            ) : part === "/" ? (
                              <span key={partIndex} className="px-0.5">
                                or
                              </span>
                            ) : (
                              <Kbd key={partIndex}>{part}</Kbd>
                            ),
                          )}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        <InlineText text={row.action} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : null}

          {doc.note ? (
            <p className="border-l-2 border-primary-300 bg-muted/30 px-4 py-3 text-sm leading-relaxed text-muted-foreground dark:border-primary-500">
              <InlineText text={doc.note} />
            </p>
          ) : null}
        </DocsSection>

        <DocsSection
          id="used-in"
          title="Used in production"
          description="The Aback products whose interfaces shaped this component."
        >
          {usedIn.length ? (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {products
                .filter((product) => usedIn.includes(product.slug))
                .map((product) => (
                  <li key={product.slug}>
                    <a
                      href={product.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-full flex-col gap-1.5 border border-border bg-card p-4 outline-none transition-colors duration-200 hover:border-primary-300 focus-visible:ring-2 focus-visible:ring-focus-ring dark:hover:border-primary-700"
                    >
                      <span className="flex items-center justify-between gap-2 text-sm font-semibold text-foreground group-hover:text-link">
                        {product.name}
                        <IconArrowUpRight aria-hidden="true" className="size-4 text-muted-foreground group-hover:text-link" />
                      </span>
                      <span className="text-xs leading-relaxed text-muted-foreground">{product.tagline}</span>
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="border border-dashed border-border p-4 text-sm leading-relaxed text-muted-foreground">
              This component is new in Aback UI. It has not shipped in an Aback product yet, so no
              production use is claimed.
            </p>
          )}
        </DocsSection>

        {doc.related.length ? (
          <DocsSection id="related" title="Related">
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {doc.related.map((relatedSlug) => {
                const related = getComponent(relatedSlug);
                if (!related) return null;
                return (
                  <li key={relatedSlug}>
                    <Link
                      href={`/docs/components/${relatedSlug}`}
                      className="group flex h-full flex-col gap-1 border border-border p-4 outline-none transition-colors duration-200 hover:border-primary-300 focus-visible:ring-2 focus-visible:ring-focus-ring dark:hover:border-primary-700"
                    >
                      <span className="flex items-center justify-between text-sm font-semibold text-foreground group-hover:text-link">
                        {related.title}
                        <IconArrowRight aria-hidden="true" className="size-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-link motion-reduce:transition-none" />
                      </span>
                      <span className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                        {related.description}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </DocsSection>
        ) : null}

        <DocsPager
          label="Component pagination"
          previous={previous ? { title: previous.title, href: `/docs/components/${previous.name}` } : undefined}
          next={next ? { title: next.title, href: `/docs/components/${next.name}` } : undefined}
        />
      </div>
    </DocsPage>
  );
}
