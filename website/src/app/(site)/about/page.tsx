import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs, Button } from "@aback-ui/ui";

import { JsonLd } from "@/components/json-ld";
import { A, Prose } from "@/components/prose";
import { blocks } from "@/data/blocks";
import { components } from "@/data/component-catalog";
import { products } from "@/data/products";
import { site } from "@/data/site";
import { librarySchema, organizationSchema, routeGraph } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/about");

const crumbs = [{ label: "About" }];

const principles = [
  {
    title: "Correct before clever",
    body: "Predictable behavior and accessible semantics come before visual polish or component count.",
  },
  {
    title: "Own the source",
    body: "Components install as files you can read and change, or as a versioned package. No hosted service, no account.",
  },
  {
    title: "One design language",
    body: "Square corners, hairline borders, neutral ink actions, and Aback Blue used as a signal rather than paint.",
  },
  {
    title: "Evidence over claims",
    body: "Stable means tested and documented. What has not been verified is listed on the accessibility page instead of hidden.",
  },
];

export default function AboutPage() {
  return (
    <div className="container-page pb-24 pt-10 lg:pt-14">
      <JsonLd data={routeGraph("/about", crumbs, [organizationSchema(), librarySchema()])} />
      <header className="flex flex-col gap-3 border-b border-border pb-10">
        <p className="text-xs font-medium uppercase tracking-wide text-link">About</p>
        <h1 className="text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
          Build it for Aback. Engineer it for reuse. Release it for everyone.
        </h1>
        <Breadcrumbs items={[{ label: "Home", href: "/" }, ...crumbs]} />
      </header>

      <div className="mt-12 grid gap-16 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Prose>
          <p>
            Aback UI is the interface foundation behind the products of Aback Group, published as an
            open-source React component library. It has {components.length} components and {blocks.length}{" "}
            blocks today, one set of design tokens, a CLI that copies source into your project, and an npm
            package for teams that would rather import.
          </p>
          <h2 id="why">Why it exists</h2>
          <p>
            Aback Group runs several products, and each one had rebuilt the same pieces: buttons, dialogs,
            data tables, settings rows, empty states. They drifted apart in small ways, and every fix had to
            be made more than once. Aback UI pulls those patterns into one place, makes them accessible and
            documented, and lets each product take them as source it can still change.
          </p>
          <p>
            Releasing it publicly keeps the bar high. A component that has to make sense to a developer
            outside Aback cannot quietly depend on one product&apos;s data, routes, or business rules.
          </p>
          <h2 id="where-it-comes-from">Where the components come from</h2>
          <p>
            Components are reimplemented from patterns that ship in Aback products, not copied from them,
            and product-specific logic stays in the products. Each component page says which products use
            it, and <A href="/built-with">Built with Aback UI</A> shows them side by side.
          </p>
          <h2 id="how-it-is-maintained">How it is maintained</h2>
          <p>
            The code lives in a public repository on{" "}
            <A href={site.repository}>GitHub</A> under the MIT licence. Releases are versioned, published to
            npm with provenance from CI, and recorded in the <A href="/docs/changelog">changelog</A>. Until
            1.0, APIs may still change; component pages mark what is stable and what is beta. Contributions
            follow the <A href="/docs/contributing">contributing guide</A>.
          </p>
          <h2 id="what-it-is-not">What it is not</h2>
          <p>
            Aback UI is not a hosted service, a page builder, or a framework. It does not need an account,
            phone home, or fetch component code from the internet at install time. It targets React 19 and
            Tailwind CSS v4 and does not claim support for setups it has not been tested in.
          </p>
        </Prose>

        <aside className="flex flex-col gap-8">
          <section aria-labelledby="principles">
            <h2 id="principles" className="text-sm font-semibold text-foreground">
              Principles
            </h2>
            <ul className="mt-3 flex flex-col gap-px border border-border bg-border">
              {principles.map((item) => (
                <li key={item.title} className="bg-card p-4">
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.body}</p>
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="products">
            <h2 id="products" className="text-sm font-semibold text-foreground">
              Aback products
            </h2>
            <ul className="mt-3 flex flex-col gap-2 text-sm">
              {products.map((product) => (
                <li key={product.slug}>
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-link underline-offset-4 hover:underline"
                  >
                    {product.name}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                  <span className="text-muted-foreground"> — {product.tagline}</span>
                </li>
              ))}
            </ul>
          </section>
          <Button variant="brand" asChild>
            <Link href="/docs/installation">Get started</Link>
          </Button>
        </aside>
      </div>
    </div>
  );
}
