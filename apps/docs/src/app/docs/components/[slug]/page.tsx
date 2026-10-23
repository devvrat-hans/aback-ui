import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconExternalLink,
} from "@tabler/icons-react";

import {
  Badge,
  Breadcrumbs,
  Button,
  PageHeader,
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

import { CodeBlock } from "@/components/code-block";
import { InstallCommand } from "@/components/install-command";
import { PreviewFrame } from "@/components/preview-frame";
import { componentDocs } from "@/data/component-docs";
import { components, getComponent } from "@/data/component-catalog";
import { products, productName } from "@/data/products";
import { exampleMap } from "@/examples";
import { readExampleSource } from "@/lib/example-source";

export const dynamicParams = false;

export function generateStaticParams() {
  return components.map((component) => ({ slug: component.name }));
}

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getComponent(slug);
  if (!item) return {};

  const title = `${item.title} component`;
  const url = `/docs/components/${item.name}`;

  return {
    title,
    description: item.description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: item.description,
      url,
      type: "article",
      images: [
        {
          url: "/og.png",
          width: 1200,
          height: 630,
          alt: `${item.title} component in Aback UI`,
        },
      ],
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
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export default async function ComponentPage({ params }: PageProps) {
  const { slug } = await params;
  const item = getComponent(slug);
  const doc = componentDocs[slug];
  const Example = exampleMap[slug];

  if (!item || !doc || !Example) notFound();

  const source = await readExampleSource(slug);
  const index = components.findIndex((component) => component.name === slug);
  const previous = index > 0 ? components[index - 1] : undefined;
  const next = index < components.length - 1 ? components[index + 1] : undefined;
  const usedIn = item.meta?.usedIn ?? [];
  const installCommand = `npx shadcn@latest add https://abackui.com/r/${item.name}.json`;
  const dependencies = item.dependencies ?? [];

  return (
    <article className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <PageHeader
          eyebrow={item.categories?.[0] ?? "Component"}
          title={item.title}
          description={item.description}
          actions={
            <>
              <Badge variant={item.meta?.status === "stable" ? "success" : "brand"}>
                {item.meta?.status === "stable" ? "Stable" : item.meta?.status ?? "Beta"}
              </Badge>
              {usedIn.length ? (
                <span className="text-xs text-muted-foreground">
                  Used in {usedIn.map((product) => productName(product)).join(", ")}
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">New shared pattern</span>
              )}
            </>
          }
        />
        <Breadcrumbs
          items={[
            { label: "Docs", href: "/docs" },
            { label: "Components", href: "/docs/components" },
            { label: item.title },
          ]}
        />
      </div>

      <nav aria-label="On this page" className="flex flex-wrap gap-2">
        {[
          ["install", "Install"],
          ["preview", "Preview"],
          ["usage", "Usage"],
          ["api", "API"],
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
        description="Copy the source into your project. The file is yours to edit."
      >
        <Tabs defaultValue="cli">
          <TabsList aria-label="Installation method">
            <TabsTrigger value="cli">CLI</TabsTrigger>
            <TabsTrigger value="manual">Manual</TabsTrigger>
          </TabsList>

          <TabsContent value="cli" className="space-y-3">
            <InstallCommand command={installCommand} />
            <p className="text-xs leading-relaxed text-muted-foreground">
              First time here? Install the theme once with{" "}
              <code className="bg-muted px-1 font-mono">
                npx shadcn@latest add https://abackui.com/r/theme.json
              </code>
              , then import{" "}
              <code className="bg-muted px-1 font-mono">./styles/aback.css</code> after Tailwind in
              your global stylesheet. See the{" "}
              <Link href="/docs/installation" className="text-link underline underline-offset-4">
                installation guide
              </Link>
              .
            </p>
          </TabsContent>

          <TabsContent value="manual" className="space-y-3">
            <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm text-muted-foreground">
              <li>
                Install the theme once:{" "}
                <code className="bg-muted px-1 font-mono">
                  npx shadcn@latest add https://abackui.com/r/theme.json
                </code>
              </li>
              <li>
                Copy{" "}
                <code className="bg-muted px-1 font-mono">components/ui/{item.name}.tsx</code>{" "}
                into your project, or download it from{" "}
                <a
                  href={`/r/${item.name}.json`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-link underline underline-offset-4"
                >
                  the registry item
                </a>
                .
              </li>
              <li>
                Install dependencies:{" "}
                <code className="bg-muted px-1 font-mono">
                  {dependencies.length ? dependencies.join(", ") : "none beyond the shared utils"}
                </code>
                .
              </li>
            </ol>
          </TabsContent>
        </Tabs>
      </Section>

      <Section
        id="preview"
        title="Preview"
        description="This is the installed component, not a mock. Switch the theme to check both surfaces."
      >
        <PreviewFrame>
          <Example />
        </PreviewFrame>
      </Section>

      <Section
        id="usage"
        title="Usage"
        description="A complete example with the states and labels the component expects."
      >
        {source ? (
          <CodeBlock code={source} filename={`examples/${slug}.tsx`} language="tsx" />
        ) : (
          <p className="text-sm text-muted-foreground">Example source is unavailable.</p>
        )}
      </Section>

      <Section
        id="api"
        title="API"
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
                <TableCell className="whitespace-nowrap font-mono text-xs">{row.prop}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{row.type}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {row.defaultValue ?? "None"}
                </TableCell>
                <TableCell className="min-w-[16rem] text-sm text-muted-foreground">
                  {row.description}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="text-xs leading-relaxed text-muted-foreground">
          The registry item declares{" "}
          <code className="bg-muted px-1 font-mono">
            {dependencies.length ? dependencies.join(", ") : "no extra packages"}
          </code>
          . Component source also imports the shared{" "}
          <code className="bg-muted px-1 font-mono">@/lib/utils</code> helper.
        </p>
      </Section>

      <Section
        id="accessibility"
        title="Accessibility"
        description="Semantics, keyboard behavior, and the decisions that keep the component operable."
      >
        <ul className="flex flex-col gap-2">
          {doc.accessibility.map((line) => (
            <li key={line} className="flex items-start gap-2 text-sm leading-relaxed text-muted-foreground">
              <IconCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-success" />
              {line}
            </li>
          ))}
        </ul>

        {doc.keyboard?.length ? (
          <div className="pt-2">
            <h3 className="mb-2 text-sm font-semibold text-foreground">Keyboard</h3>
            <Table containerProps={{ "aria-label": `${item.title} keyboard shortcuts` }}>
              <TableHeader>
                <TableRow>
                  <TableHead>Key</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doc.keyboard.map((row) => (
                  <TableRow key={row.key}>
                    <TableCell className="whitespace-nowrap font-mono text-xs">{row.key}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{row.action}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : null}

        {doc.note ? (
          <p className="border-l-2 border-primary-300 bg-muted/20 px-3 py-2 text-xs leading-relaxed text-muted-foreground dark:border-primary-500">
            {doc.note}
          </p>
        ) : null}
      </Section>

      <Section
        id="used-in"
        title="Used in production"
        description="The Aback products whose interfaces shaped this component pattern."
      >
        {usedIn.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {products
              .filter((product) => usedIn.includes(product.slug))
              .map((product) => (
                <a
                  key={product.slug}
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col gap-1.5 border border-border bg-card p-4 transition-colors hover:border-primary-300 hover:bg-muted/40"
                >
                  <span className="flex items-center justify-between gap-2 text-sm font-semibold text-foreground">
                    {product.name}
                    <IconExternalLink
                      aria-hidden="true"
                      className="size-4 text-muted-foreground transition-colors group-hover:text-link"
                    />
                  </span>
                  <span className="text-xs leading-relaxed text-muted-foreground">
                    {product.tagline}
                  </span>
                </a>
              ))}
          </div>
        ) : (
          <p className="border border-border bg-muted/20 p-4 text-sm leading-relaxed text-muted-foreground">
            This component is new in Aback UI. It has not shipped in an Aback product yet, so no
            production usage is claimed.
          </p>
        )}
      </Section>

      <Section id="related" title="Related components">
        <div className="grid gap-3 sm:grid-cols-2">
          {doc.related.map((relatedSlug) => {
            const related = getComponent(relatedSlug);
            if (!related) return null;
            return (
              <Link
                key={relatedSlug}
                href={`/docs/components/${relatedSlug}`}
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

      <nav aria-label="Component pagination" className="grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
        {previous ? (
          <Link
            href={`/docs/components/${previous.name}`}
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
            href={`/docs/components/${next.name}`}
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
        <Link href="/docs/components">
          <IconArrowLeft aria-hidden="true" />
          Back to all components
        </Link>
      </Button>
    </article>
  );
}
