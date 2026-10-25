import type { Metadata } from "next";
import Link from "next/link";

import {
  Badge,
  Breadcrumbs,
  CodeBlock,
  PageHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@aback-ui/ui";

import { PackageCommand } from "@/components/package-command";
import { components } from "@/data/component-catalog";

export const metadata: Metadata = {
  title: "Registry",
  description:
    "How the Aback UI source-copy registry works, what each item declares, and how to install it safely.",
  alternates: { canonical: "/docs/registry" },
};

export default function RegistryPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <PageHeader
          eyebrow="Getting started"
          title="Registry"
          description="A static JSON contract that copies source into your project. No runtime, no account, no hidden service."
        />
        <Breadcrumbs items={[{ label: "Docs", href: "/docs" }, { label: "Registry" }]} />
      </div>

      <div className="prose-docs">
        <h2>The URL is the contract</h2>
        <p>
          Every item is available at a stable URL:{" "}
          <code>https://abackui.com/r/&#123;name&#125;.json</code>. The file is generated from the
          canonical component source and validated in CI. It follows the{" "}
          <a href="https://ui.shadcn.com/docs/registry">shadcn registry schema</a>, so the standard
          CLI can read it.
        </p>
        <PackageCommand args="shadcn@latest add https://abackui.com/r/dialog.json" />
        <p>
          Named registries are supported too. Add{" "}
          <code>&quot;@aback&quot;: &quot;https://abackui.com/r/&#123;name&#125;.json&quot;</code>{" "}
          under <code>registries</code> in <code>components.json</code>, then run{" "}
          <code>npx shadcn@latest add @aback/dialog</code>.
        </p>
        <p>
          The first-party <Link href="/docs/cli">Aback CLI</Link> reads the same schema and the
          same <code>components.json</code>. It is in preview and not yet on npm, so the shadcn CLI
          remains the supported path until publication.
        </p>

        <h2>What an item declares</h2>
        <ul>
          <li>
            <strong>name</strong>: the public identifier, also used in the URL.
          </li>
          <li>
            <strong>type</strong>: ui, block, lib, file, or style. It determines the default
            install directory.
          </li>
          <li>
            <strong>files</strong>: the destination path and the exact content.
          </li>
          <li>
            <strong>dependencies</strong>: npm packages the copied file imports.
          </li>
          <li>
            <strong>registryDependencies</strong>: other registry items, such as the shared{" "}
            <code>utils</code> helper.
          </li>
          <li>
            <strong>docs</strong>: the documentation page the CLI can point to.
          </li>
        </ul>
        <CodeBlock
          language="json"
          filename="button.json"
          code={`{
  "name": "button",
  "type": "registry:ui",
  "dependencies": ["class-variance-authority", "radix-ui"],
  "registryDependencies": ["utils"],
  "files": [
    {
      "path": "components/ui/button.tsx",
      "target": "components/ui/button.tsx",
      "type": "registry:ui",
      "content": "..." 
    }
  ]
}`}
        />

        <h2>The two supporting items</h2>
        <p>
          <strong>theme</strong> writes <code>styles/aback.css</code>. It is a new file, not an edit
          to your global stylesheet, so the CLI does not need to merge CSS. Import it once after
          Tailwind.
        </p>
        <p>
          <strong>utils</strong> writes <code>lib/utils.ts</code> with the{" "}
          <code>cn()</code> helper, under the project's source root. Every component declares the
          full registry URL as a dependency, so the canonical helper is installed once and reused,
          even when the component is installed from a different origin.
        </p>

        <h2>All component items</h2>
      </div>

      <Table containerProps={{ "aria-label": "Registry component items" }}>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Dependencies</TableHead>
            <TableHead>Install</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {components.map((item) => (
            <TableRow key={item.name}>
              <TableCell>
                <a
                  href={`/r/${item.name}.json`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-xs text-link underline underline-offset-4"
                >
                  {item.name}
                </a>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{item.categories?.[0] ?? "Component"}</Badge>
              </TableCell>
              <TableCell className="font-mono text-xs text-muted-foreground">
                {item.dependencies?.join(", ") ?? "none"}
              </TableCell>
              <TableCell>
                <code className="bg-muted px-1 font-mono text-[11px]">
                  add @aback/{item.name}
                </code>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="prose-docs">
        <h2>Ownership and overwrite behavior</h2>
        <p>
          The CLI writes new files and reports conflicts. It does not silently wipe a component you
          have edited. Review the diff before accepting an update, and treat local edits as your
          source of truth.
        </p>
        <p>
          Registry output is generated by <code>scripts/build-registry.mjs</code> and checked in so
          the site serves it without a build-order dependency. The build fails when a source import
          is missing a declared dependency, a target escapes the allowed directories, or a source
          file contains something that looks like a secret.
        </p>

        <h2>Versioning</h2>
        <p>
          Aback UI is pre-1.0. Registry identifiers are treated as public contracts anyway: a
          component name is not changed without a migration note. The package and the registry
          share one source, so a fix lands once.
        </p>
        <p>
          The npm package is built and smoke-tested in the workspace but is not published yet. The
          registry is the supported distribution path today.
        </p>
      </div>
    </div>
  );
}
