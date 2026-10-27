import type { Metadata } from "next";

import { Code } from "@/components/code";
import { DocsPage, DocsPageHeader, DocsSection, type TocItem } from "@/components/docs-page";
import { Callout, GuidePager } from "@/components/docs-ui";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/docs/contributing");

const toc: TocItem[] = [
  { id: "repository", title: "Repository layout" },
  { id: "run-it", title: "Run it locally" },
  { id: "new-component", title: "Adding a component" },
  { id: "new-block", title: "Adding a block" },
  { id: "checks", title: "Before a pull request" },
];

const layout = [
  {
    path: "packages/ui",
    name: "@aback-ui/ui",
    body: "The canonical component source and the npm package built from it. Every other copy of a component comes from here.",
    published: true,
  },
  {
    path: "packages/tokens",
    name: "@aback-ui/tokens",
    body: "The theme: colour roles, the Aback Blue ramp, and geometry, as one CSS file.",
    published: true,
  },
  {
    path: "packages/cli",
    name: "aback-ui",
    body: "The command line. Its build bundles the registry, so the published package carries every component.",
    published: true,
  },
  {
    path: "registry",
    name: "registry.json and blocks/",
    body: "Which items exist, their dependencies and targets, and the block source. A build script turns it into item JSON.",
    published: false,
  },
  {
    path: "website",
    name: "abackui.com",
    body: "This site: docs, live examples, block previews, and the hosted copy of the registry. It is never published to npm.",
    published: false,
  },
];

export default function ContributingPage() {
  return (
    <DocsPage toc={toc}>
      <DocsPageHeader
        path="/docs/contributing"
        eyebrow="Resources"
        title="Contributing"
        description="Aback UI is judged on reuse, clarity, accessibility, and maintainability, not on component count. This page is for people working on the library itself."
        crumbs={[{ label: "Docs", href: "/docs" }, { label: "Contributing" }]}
      />

      <div className="mt-10 flex flex-col gap-14">
        <DocsSection
          id="repository"
          title="Repository layout"
          description="Everything that ships to npm lives in packages/. The website only consumes it."
        >
          <ul className="flex flex-col divide-y divide-border border border-border">
            {layout.map((item) => (
              <li key={item.path} className="flex flex-col gap-1.5 p-4 sm:flex-row sm:items-start sm:gap-6">
                <code className="w-40 shrink-0 font-mono text-sm font-semibold text-foreground">{item.path}/</code>
                <span className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="flex flex-wrap items-center gap-2 text-sm font-medium text-foreground">
                    {item.name}
                    <span
                      className={
                        item.published
                          ? "border border-success/25 bg-success-soft px-1.5 py-0.5 text-[11px] font-semibold text-success-strong"
                          : "border border-border bg-muted/40 px-1.5 py-0.5 text-[11px] font-semibold text-muted-foreground"
                      }
                    >
                      {item.published ? "Ships to npm" : "Stays in the repo"}
                    </span>
                  </span>
                  <span className="text-sm leading-relaxed text-muted-foreground">{item.body}</span>
                </span>
              </li>
            ))}
          </ul>
        </DocsSection>

        <DocsSection id="run-it" title="Run it locally" description="The repository uses Bun workspaces.">
          <Code
            language="bash"
            filename="terminal"
            code={`bun install
bun run dev            # the website on http://localhost:3000
bun run build:registry # regenerate the registry after changing an item
bun run build:cli      # build the CLI with the registry bundled`}
          />
          <Callout type="tip" title="Try the CLI from source">
            After <code>bun run build:cli</code>, run <code>node packages/cli/dist/index.js add button</code>{" "}
            inside any React project to install from your working copy.
          </Callout>
        </DocsSection>

        <DocsSection id="new-component" title="Adding a component">
          <div className="prose-docs">
            <ol>
              <li>
                Write it in <code>packages/ui/src/components</code> with semantic tokens, a
                keyboard model, and tests beside it, including an axe check.
              </li>
              <li>
                Export it from <code>packages/ui/src/index.ts</code> and add an item to{" "}
                <code>registry/registry.json</code> with its npm and registry dependencies.
              </li>
              <li>
                Add a live example in <code>website/src/examples</code> and its API and
                accessibility notes in <code>website/src/data/component-docs.ts</code>. A test
                fails if either is missing.
              </li>
              <li>
                Run <code>bun run build:registry</code> and commit the generated files.
              </li>
            </ol>
            <p>
              Open a proposal first for a new component or any public API change. Names, props,
              CSS variables, and registry identifiers are public contracts once released.
            </p>
          </div>
        </DocsSection>

        <DocsSection id="new-block" title="Adding a block">
          <div className="prose-docs">
            <ul>
              <li>
                Write it in <code>registry/blocks</code>, importing components through{" "}
                <code>@/components/ui/*</code> exactly as an installed copy would.
              </li>
              <li>
                Keep example content out of the block. Its preview goes in{" "}
                <code>website/src/block-previews</code>, with example data labelled as such.
              </li>
              <li>
                A block owns no routing, auth, network calls, or product data. It takes callbacks
                such as <code>onSubmit</code> and shows what they return.
              </li>
            </ul>
          </div>
        </DocsSection>

        <DocsSection id="checks" title="Before a pull request">
          <Code
            language="bash"
            filename="terminal"
            code={`bun run check   # typecheck, lint, tests, registry freshness, packed-package tests
bun run build   # packages, registry, CLI, and the website`}
          />
          <div className="prose-docs">
            <p>
              The packed-package test installs the real npm tarballs into a clean project, renders
              components from them, and runs <code>aback-ui init</code> and <code>add</code> with
              the network blocked. If it passes, what you publish works.
            </p>
          </div>
        </DocsSection>

        <GuidePager href="/docs/contributing" />
      </div>
    </DocsPage>
  );
}
