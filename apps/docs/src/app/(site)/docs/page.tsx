import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs, PageHeader } from "@aback-ui/ui";

import { PackageCommand } from "@/components/package-command";
import { components } from "@/data/component-catalog";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Introduction",
  description:
    "Aback UI is an open-source React design system from Aback Group: accessible components, semantic tokens, and a source-copy registry.",
  alternates: { canonical: "/docs" },
};

export default function DocsIntroductionPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <PageHeader
          eyebrow="Documentation"
          title="Introduction"
          description="Aback UI is the shared interface foundation for Aback Group products and an open-source component library for everyone else."
        />
        <Breadcrumbs items={[{ label: "Docs" }, { label: "Introduction" }]} />
      </div>

      <div className="prose-docs">
        <h2>What it is</h2>
        <p>
          A design system, a set of accessible React components, and a registry that copies source
          into your project. There is no runtime to adopt, no account to create, and no hidden
          service behind ordinary component use.
        </p>
        <p>
          The visual language is deliberately narrow: a neutral grayscale, one saturated brand
          blue used as a signal, square corners, one-pixel hairlines, and dense, well-ordered
          typography. It looks like a precise instrument, not a marketing template.
        </p>

        <h2>Principles, in priority order</h2>
        <ol>
          <li>Correctness and predictable behavior.</li>
          <li>Accessibility and semantic interaction.</li>
          <li>Reusability and a clear API.</li>
          <li>Design consistency with the Aback design language.</li>
          <li>Customizability and low lock-in.</li>
          <li>Developer experience and honest documentation.</li>
          <li>Performance and a small dependency footprint.</li>
        </ol>

        <h2>Source you own</h2>
        <p>
          Installing a component copies the canonical source into{" "}
          <code>components/ui</code>. You can change it. That is the point. The package is a
          convenience, not a gate: the registry is the supported install path today, and every
          installed file imports only documented aliases and npm packages.
        </p>
        <PackageCommand args="shadcn@latest add https://abackui.com/r/button.json" />
        <p>
          Read the <Link href="/docs/installation">installation guide</Link> for the theme setup,
          or browse the <Link href="/docs/components">component catalogue</Link>.
        </p>

        <h2>Built for Aback, released for everyone</h2>
        <p>
          The components were shaped by the interfaces of {products.map((product) => product.name).join(" and ")}.
          Product-specific logic stayed in those products. What remains here is the repeated
          interface work: forms, overlays, navigation, feedback, and the tokens underneath.
        </p>
        <p>
          The current catalogue has {components.length} components. There are no placeholder
          entries. A component appears only when it has a typed API, tests, a live example, an
          accessibility note, and a valid registry item, and its page states whether it is beta or
          stable.
        </p>

        <h2>What it is not</h2>
        <ul>
          <li>A complete application framework or a hosted backend.</li>
          <li>A replacement for React, CSS, or Tailwind.</li>
          <li>A guarantee that every assistive-technology combination has been tested.</li>
          <li>A collection of demos that do not install outside this repository.</li>
        </ul>

        <h2 id="contributing">Contributing</h2>
        <p>
          The repository is open source under MIT. Component proposals need a repeated use case, a
          typed API, tests, documentation, accessibility notes, and a provenance review. Read the
          contribution guide in the repository and open a proposal before a large pull request.
        </p>
      </div>
    </div>
  );
}
