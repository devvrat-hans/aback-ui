import type { Metadata } from "next";
import Link from "next/link";
import { IconArrowRight, IconExternalLink } from "@tabler/icons-react";

import { Badge } from "@aback-ui/ui";

import { DocsPageHeader } from "@/components/docs-page";
import { GuidePager } from "@/components/docs-ui";
import { components } from "@/data/component-catalog";
import { products } from "@/data/products";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/built-with");

export default function BuiltWithPage() {
  return (
    <div className="container-page pb-20 pt-10 lg:pt-14">
      <div className="flex flex-col gap-10">
        <DocsPageHeader
          path="/built-with"
          eyebrow="In production"
          title="Built with Aback UI"
          description="Aback UI is built for Aback Group products first. These are the interfaces whose repeated problems shaped the system, and the components they use today."
          crumbs={[{ label: "Docs", href: "/docs" }, { label: "Built with Aback UI" }]}
        />

        <div className="grid gap-4 lg:grid-cols-3">
          {products.map((product) => {
            const used = components.filter((item) =>
              item.meta?.usedIn?.includes(product.slug),
            );

            return (
              <section
                key={product.slug}
                className="flex flex-col border border-border bg-card"
                aria-labelledby={`${product.slug}-heading`}
              >
                <div className="border-b border-border p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2
                        id={`${product.slug}-heading`}
                        className="text-lg font-semibold tracking-tight text-foreground"
                      >
                        {product.name}
                      </h2>
                      <p className="mt-0.5 text-sm text-muted-foreground">{product.tagline}</p>
                    </div>
                    <Badge variant="outline">{used.length} components</Badge>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {product.description}
                  </p>
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-link underline-offset-4 hover:underline"
                  >
                    Visit {product.name}
                    <IconExternalLink aria-hidden="true" className="size-4" />
                  </a>
                </div>

                <div className="p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Components used
                  </p>
                  <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                    {used.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={`/docs/components/${item.name}`}
                          className="group flex items-center justify-between gap-2 py-1 text-sm text-muted-foreground hover:text-link"
                        >
                          {item.title}
                          <IconArrowRight
                            aria-hidden="true"
                            className="size-3.5 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                          />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            );
          })}
        </div>

        <div className="prose-docs">
          <h2 id="what-the-tag-means">What the tag means</h2>
          <p>
            A component is tagged with a product when its pattern was reviewed against that
            product's interface and the same behavior is used there. The source in this repository
            was reimplemented for a general API. No product's routing, auth, billing, data model, or
            internal endpoints are included.
          </p>
          <p>
            Components without a tag are new shared patterns. They are documented and tested, but
            this site does not claim production use for them.
          </p>

          <h2 id="why-it-matters">Why it matters</h2>
          <p>
            A design system that is only used in its documentation site is a demo. These products
            put the components under real forms, dense data, long content, narrow viewports, and
            both themes. That is where the API and the edge cases came from.
          </p>
          <p>
            The products remain independent. Aback UI does not import product code, and product
            teams can customize the copied source without waiting for a package release.
          </p>
        </div>
        <GuidePager href="/built-with" />
      </div>
    </div>
  );
}
