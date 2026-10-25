import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@aback-ui/ui";

import { Code } from "@/components/code";
import { DocsPage, DocsPageHeader, DocsSection, type TocItem } from "@/components/docs-page";
import { Callout, GuidePager } from "@/components/docs-ui";
import { blocks } from "@/data/blocks";
import { components } from "@/data/component-catalog";

export const metadata: Metadata = {
  title: "Registry format",
  description:
    "The item JSON the aback-ui CLI installs, its schema, the supporting theme and utils items, and how to host a mirror.",
  alternates: { canonical: "/docs/registry" },
};

const toc: TocItem[] = [
  { id: "what-it-is", title: "What the registry is" },
  { id: "item-format", title: "Item format" },
  { id: "supporting-items", title: "Theme and utils" },
  { id: "self-hosting", title: "Hosting a mirror" },
  { id: "all-items", title: "All items" },
];

export default function RegistryPage() {
  const items = [...components, ...blocks];

  return (
    <DocsPage toc={toc}>
      <DocsPageHeader
        eyebrow="Resources"
        title="Registry format"
        description="Behind aback-ui add is a set of static JSON files, one per component or block, with the source inlined. You only need this page to inspect items or host your own copy."
        crumbs={[{ label: "Docs", href: "/docs" }, { label: "Registry format" }]}
      />

      <div className="mt-10 flex flex-col gap-14">
        <DocsSection id="what-it-is" title="What the registry is">
          <div className="prose-docs">
            <p>
              Each item is a JSON file named after the item: <code>button.json</code>,{" "}
              <code>sign-in.json</code>. An <code>index.json</code> lists them all. The files are
              generated from the canonical component source and checked on every change, so the
              registry can never drift from the components on this site.
            </p>
            <p>
              The same files ship in two places: inside the <code>aback-ui</code> npm package, which
              is what the CLI reads by default, and on this site at{" "}
              <a href="/r/index.json">abackui.com/r</a>, for browsing and for mirrors.
            </p>
          </div>
        </DocsSection>

        <DocsSection
          id="item-format"
          title="Item format"
          description="Validated against a published JSON Schema."
        >
          <Code
            language="json"
            filename="button.json"
            code={`{
  "$schema": "https://abackui.com/schema/registry-item.json",
  "name": "button",
  "type": "registry:ui",
  "title": "Button",
  "description": "The primary action, with ink, brand, outline, ghost, and destructive variants.",
  "dependencies": ["class-variance-authority", "radix-ui"],
  "registryDependencies": ["https://abackui.com/r/utils.json"],
  "categories": ["Foundation"],
  "meta": { "status": "stable", "usedIn": ["aback-tools", "aback-launch", "aback-group"] },
  "files": [
    {
      "path": "components/ui/button.tsx",
      "target": "components/ui/button.tsx",
      "type": "registry:ui",
      "content": "\\"use client\\";\\n\\nimport * as React from \\"react\\";\\n…"
    }
  ]
}`}
          />
          <div className="overflow-x-auto border border-border">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border">
                {[
                  ["type", "registry:ui for components, registry:block for blocks, registry:lib and registry:file for the helper and the theme."],
                  ["dependencies", "npm packages the files import. The CLI installs them with your package manager."],
                  ["registryDependencies", "Items to install first. Their URLs resolve against whichever registry is in use."],
                  ["files[].target", "Where the file lands, relative to components, lib, or styles. Paths outside the project are refused."],
                  ["files[].content", "The complete source, written as-is."],
                ].map(([field, description]) => (
                  <tr key={field}>
                    <td className="whitespace-nowrap px-4 py-2.5 align-top font-mono text-xs font-semibold text-link">{field}</td>
                    <td className="px-4 py-2.5 text-sm leading-relaxed text-muted-foreground">{description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground">
            Schemas:{" "}
            <a href="/schema/registry-item.json" className="font-medium text-link underline underline-offset-4">registry-item.json</a>,{" "}
            <a href="/schema/registry.json" className="font-medium text-link underline underline-offset-4">registry.json</a>, and{" "}
            <a href="/schema/aback-ui.json" className="font-medium text-link underline underline-offset-4">aback-ui.json</a>.
          </p>
        </DocsSection>

        <DocsSection id="supporting-items" title="Theme and utils">
          <div className="grid gap-px border border-border bg-border md:grid-cols-2">
            <div className="flex flex-col gap-2 bg-card p-5">
              <code className="font-mono text-sm font-semibold text-foreground">theme</code>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Writes <code className="bg-muted px-1 font-mono text-[0.9em] text-foreground">styles/aback.css</code> as a new
                file, so your own stylesheet only gains one import line.
              </p>
            </div>
            <div className="flex flex-col gap-2 bg-card p-5">
              <code className="font-mono text-sm font-semibold text-foreground">utils</code>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Writes <code className="bg-muted px-1 font-mono text-[0.9em] text-foreground">lib/utils.ts</code> with{" "}
                <code className="bg-muted px-1 font-mono text-[0.9em] text-foreground">cn()</code>. Every component
                depends on it, so it is installed once and shared.
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            <code className="bg-muted px-1 font-mono text-[0.9em] text-foreground">aback-ui init</code> installs both.
          </p>
        </DocsSection>

        <DocsSection
          id="self-hosting"
          title="Hosting a mirror"
          description="For an internal fork, an air-gapped network, or a pinned copy."
        >
          <div className="prose-docs">
            <p>
              Serve the item files and <code>index.json</code> from any static host, then point the
              CLI at the directory that contains them. A local folder works the same way.
            </p>
          </div>
          <Code
            language="json"
            filename="aback-ui.json"
            code={`{
  "registries": {
    "@aback": "https://ui.example.com/r/{name}.json"
  }
}`}
          />
          <Callout type="note">
            Dependency URLs inside the items still say abackui.com. The CLI rewrites them to your
            mirror, so a mirrored install never reaches this site.
          </Callout>
        </DocsSection>

        <DocsSection
          id="all-items"
          title="All items"
          description={`${items.length} components and blocks. Each name opens its JSON.`}
        >
          <div className="overflow-x-auto border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  {["Item", "Type", "npm dependencies"].map((heading) => (
                    <th key={heading} className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item) => (
                  <tr key={item.name}>
                    <td className="whitespace-nowrap px-4 py-2">
                      <a href={`/r/${item.name}.json`} className="font-mono text-xs font-medium text-link underline underline-offset-4">
                        {item.name}
                      </a>
                    </td>
                    <td className="px-4 py-2">
                      <Badge variant="outline">{item.type === "registry:block" ? "Block" : item.categories?.[0] ?? "Component"}</Badge>
                    </td>
                    <td className="px-4 py-2 font-mono text-xs text-muted-foreground">
                      {item.dependencies?.length ? item.dependencies.join(", ") : "None"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground">
            Prefer browsing with previews? See <Link href="/docs/components" className="font-medium text-link underline underline-offset-4">Components</Link>{" "}
            and <Link href="/docs/blocks" className="font-medium text-link underline underline-offset-4">Blocks</Link>.
          </p>
        </DocsSection>

        <GuidePager href="/docs/registry" />
      </div>
    </DocsPage>
  );
}
