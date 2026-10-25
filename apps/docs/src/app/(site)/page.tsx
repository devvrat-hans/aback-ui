import Link from "next/link";
import {
  IconAccessible,
  IconArrowRight,
  IconCode,
  IconExternalLink,
  IconLayoutGrid,
  IconPalette,
} from "@tabler/icons-react";

import {
  Alert,
  AlertDescription,
  Badge,
  Breadcrumbs,
  Button,
  Field,
  Input,
} from "@aback-ui/ui";

import { HomePreview } from "@/components/home-preview";
import { PackageCommand } from "@/components/package-command";
import { blocks } from "@/data/blocks";
import { components } from "@/data/component-catalog";
import { products } from "@/data/products";
import { site } from "@/data/site";

const buttonCommand = "shadcn@latest add https://abackui.com/r/button.json";
const themeCommand = "shadcn@latest add https://abackui.com/r/theme.json";

const features = [
  {
    icon: IconAccessible,
    title: "Accessible by default",
    description:
      "Semantic HTML, Radix primitives for the complex widgets, visible focus, and behavior tests for keyboard operation. Accessibility is a release requirement, not a polish phase.",
  },
  {
    icon: IconCode,
    title: "Source you own",
    description:
      "One command copies the canonical file into your project. Edit it, extend it, keep it. There is no runtime to adopt and no hidden upgrade path.",
  },
  {
    icon: IconPalette,
    title: "Tokens with intent",
    description:
      "Neutral ink actions, Aback Blue as a signal, and one set of semantic variables for light and dark. Components read roles, never one-off swatches.",
  },
  {
    icon: IconLayoutGrid,
    title: "Square by design",
    description:
      "Zero radius, one-pixel hairlines, and depth from borders before shadow. A precise instrument, not another rounded template.",
  },
];

const featuredBlockNames = [
  "site-header",
  "hero",
  "pricing",
  "dashboard-shell",
  "users-table",
  "article-layout",
];
const featuredBlocks = featuredBlockNames
  .map((name) => blocks.find((block) => block.name === name))
  .filter((block) => block !== undefined);

const stats = [
  { value: `${components.length}`, label: "Components" },
  { value: `${blocks.length}`, label: "Blocks" },
  { value: `${products.length}`, label: "Aback products" },
  { value: "MIT", label: "License" },
];

export default function HomePage() {
  return (
    <div>
      <section className="border-b border-separator">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-14 md:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:py-20">
          <div>
            <p className="mb-5 inline-flex items-center gap-2 border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground">
              <span aria-hidden="true" className="size-1.5 bg-primary-500" />
              Aback UI v0.1 · Open source
            </p>

            <h1 className="max-w-xl text-4xl font-bold leading-[1.08] tracking-tight text-foreground text-balance">
              The building blocks behind better applications.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
              Open-source React components, semantic design tokens, and a registry that copies
              source into your project. Built for Aback, engineered for reuse, released for
              everyone.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-2">
              <Button size="lg" variant="brand" asChild>
                <Link href="/docs/installation">
                  Install Aback UI
                  <IconArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/docs/components">Browse components</Link>
              </Button>
            </div>

            <div className="mt-6 max-w-xl">
              <PackageCommand args={buttonCommand} />
              <p className="mt-2 text-xs text-muted-foreground">
                Installs the Button source. Add the theme once with{" "}
                <Link href="/docs/installation" className="text-link underline-offset-4 hover:underline">
                  two more steps
                </Link>
                .
              </p>
            </div>

            <ul className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
              <li>MIT licensed</li>
              <li aria-hidden="true" className="h-3 w-px bg-separator" />
              <li>React 19</li>
              <li aria-hidden="true" className="h-3 w-px bg-separator" />
              <li>Tailwind CSS v4</li>
              <li aria-hidden="true" className="h-3 w-px bg-separator" />
              <li>shadcn registry compatible</li>
            </ul>
          </div>

          <HomePreview />
        </div>
      </section>

      <section aria-label="Project facts" className="border-b border-border">
        <dl className="mx-auto grid w-full max-w-6xl grid-cols-2 divide-x divide-y divide-border border-x border-border md:grid-cols-4 md:divide-y-0">
          {stats.map((stat) => (
            <div key={stat.label} className="px-5 py-5">
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {stat.label}
              </dt>
              <dd className="mt-1 text-2xl font-bold tracking-tight tabular-nums text-foreground">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 lg:py-20">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Why Aback UI
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            A design system that earns its place.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Every component solves a repeated interface problem. Every public example works. Every
            copied file is safe to own.
          </p>
        </div>

        <div className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-2">
          {features.map((feature) => (
            <div key={feature.title} className="bg-card p-6">
              <div className="flex size-10 items-center justify-center bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400">
                <feature.icon aria-hidden="true" className="size-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-muted/20">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                The catalogue
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Real components, rendered live.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                The site uses the same source the registry installs. Nothing below is a mock.
              </p>
            </div>
            <Link
              href="/docs/components"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-link underline-offset-4 hover:underline"
            >
              View all {components.length} components
              <IconArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-4 bg-card p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                Actions
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm">Save changes</Button>
                <Button size="sm" variant="brand">
                  Publish
                </Button>
                <Button size="sm" variant="outline">
                  Cancel
                </Button>
              </div>
              <Link href="/docs/components/button" className="mt-auto text-xs font-medium text-link hover:underline">
                Button
              </Link>
            </div>

            <div className="flex flex-col gap-4 bg-card p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                Forms
              </p>
              <Field htmlFor="home-showcase-email" label="Work email">
                <Input id="home-showcase-email" placeholder="you@company.com" />
              </Field>
              <Link href="/docs/components/field" className="mt-auto text-xs font-medium text-link hover:underline">
                Field
              </Link>
            </div>

            <div className="flex flex-col gap-4 bg-card p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                Status
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="success">Deployed</Badge>
                <Badge variant="warning">Review</Badge>
                <Badge variant="outline">Draft</Badge>
              </div>
              <Alert variant="info" className="mt-1">
                <AlertDescription>Changes apply to every member.</AlertDescription>
              </Alert>
              <Link href="/docs/components/alert" className="mt-auto text-xs font-medium text-link hover:underline">
                Alert
              </Link>
            </div>

            <div className="flex flex-col gap-4 bg-card p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                Navigation
              </p>
              <Breadcrumbs
                items={[
                  { label: "Docs", href: "/docs" },
                  { label: "Components", href: "/docs/components" },
                  { label: "Button" },
                ]}
              />
              <Link href="/docs/components/breadcrumbs" className="mt-auto text-xs font-medium text-link hover:underline">
                Breadcrumbs
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/20">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Blocks
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Complete patterns, not starter kits.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Site headers, pricing, FAQ, sign-in, settings, data tables, and article layouts,
                assembled from the same components and installed with every dependency declared.
                Each one previews at desktop, tablet, and phone widths.
              </p>
            </div>
            <Link
              href="/docs/blocks"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-link underline-offset-4 hover:underline"
            >
              Browse {blocks.length} blocks
              <IconArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-px border border-border bg-border md:grid-cols-2 lg:grid-cols-3">
            {featuredBlocks.map((block) => (
              <Link
                key={block.name}
                href={`/docs/blocks/${block.name}`}
                className="group flex flex-col gap-3 bg-card p-5 transition-colors hover:bg-muted/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm font-semibold text-foreground group-hover:text-link">
                    {block.title}
                  </span>
                  <IconArrowRight
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-link motion-reduce:group-hover:translate-x-0"
                  />
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {block.description}
                </p>
                <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                  {(block.categories ?? []).map((category) => (
                    <Badge key={category} variant="outline">
                      {category}
                    </Badge>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              In production
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Built for Aback products first.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The system was shaped by interfaces under real forms, dense data, long content, and
              narrow screens. These are the products behind it.
            </p>
          </div>
          <Link
            href="/built-with"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-link underline-offset-4 hover:underline"
          >
            See what ships where
            <IconArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {products.map((product) => {
            const used = components.filter((item) =>
              item.meta?.usedIn?.includes(product.slug),
            );

            return (
              <div key={product.slug} className="flex flex-col border border-border bg-card p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-foreground">
                      {product.name}
                    </h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">{product.tagline}</p>
                  </div>
                  <Badge variant="outline">{used.length} components</Badge>
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-link underline-offset-4 hover:underline"
                  >
                    {product.name}
                    <IconExternalLink aria-hidden="true" className="size-4" />
                  </a>
                  <span className="text-xs text-muted-foreground">{product.detail}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-border bg-muted/20">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Get started
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                Three steps to your first component.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                No signup, no account, and no runtime dependency on Aback. The source lands in your
                project and stays there.
              </p>
              <Button variant="outline" size="sm" className="mt-5" asChild>
                <Link href="/docs/installation">
                  Read the installation guide
                  <IconArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>

            <ol className="flex flex-col gap-4">
              <li className="border border-border bg-card p-4">
                <p className="text-xs font-semibold text-foreground">01 · Add the theme once</p>
                <PackageCommand args={themeCommand} className="mt-2" />
              </li>
              <li className="border border-border bg-card p-4">
                <p className="text-xs font-semibold text-foreground">02 · Add a component</p>
                <PackageCommand args={buttonCommand} className="mt-2" />
              </li>
              <li className="border border-border bg-card p-4">
                <p className="text-xs font-semibold text-foreground">03 · Import and edit</p>
                <pre className="mt-2 overflow-x-auto border border-border bg-muted/30 p-3 font-mono text-xs leading-relaxed text-foreground">
                  <code>{`import { Button } from "@/components/ui/button";

<Button>Save changes</Button>`}</code>
                </pre>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 lg:py-20">
        <div className="grid gap-px border border-border bg-border md:grid-cols-3">
          {[
            {
              title: "Built for Aback",
              body: "Product interfaces came first. The system codifies what Aback products repeatedly needed, not what looks good in a catalogue.",
            },
            {
              title: "Engineered for reuse",
              body: "Typed APIs, documented keyboard behavior, dependency review, and tests. Generic enough for any team, specific enough to be useful.",
            },
            {
              title: "Released for everyone",
              body: `Open source under MIT. The ${site.name} site, the registry, and the documentation are part of the product, not an afterthought.`,
            },
          ].map((item) => (
            <div key={item.title} className="bg-card p-6">
              <h2 className="text-base font-semibold text-foreground">{item.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-separator">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-12 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Start with one component.
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Read the docs, copy the source, and make it yours.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="brand" asChild>
              <Link href="/docs/components">Browse components</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/docs/registry">How the registry works</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
