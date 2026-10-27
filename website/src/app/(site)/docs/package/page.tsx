import type { Metadata } from "next";
import Link from "next/link";
import { IconCheck, IconMinus } from "@tabler/icons-react";

import { Code } from "@/components/code";
import { DocsPage, DocsPageHeader, DocsSection, type TocItem } from "@/components/docs-page";
import { Callout, DocsStep, DocsSteps, GuidePager, PreReleaseNotice } from "@/components/docs-ui";
import { PackageCommand } from "@/components/package-command";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/docs/package");

const toc: TocItem[] = [
  { id: "cli-or-package", title: "CLI or package?" },
  { id: "setup", title: "Set up" },
  { id: "install", title: "Install", depth: 2 },
  { id: "add-the-styles", title: "Add the styles", depth: 2 },
  { id: "import", title: "Import components", depth: 2 },
  { id: "packages", title: "What each package contains" },
  { id: "updating", title: "Updating" },
];

const comparison: { label: string; cli: boolean | string; pkg: boolean | string }[] = [
  { label: "Edit a component's markup or styles", cli: true, pkg: false },
  { label: "Update with a version bump", cli: false, pkg: true },
  { label: "See what changed before updating", cli: "aback-ui diff", pkg: "Changelog" },
  { label: "Import path", cli: "@/components/ui/button", pkg: "@aback-ui/ui" },
  { label: "Blocks", cli: true, pkg: false },
];

function Cell({ value }: { value: boolean | string }) {
  if (value === true) return <IconCheck aria-label="Yes" className="size-4 text-success" />;
  if (value === false) return <IconMinus aria-label="No" className="size-4 text-muted-foreground" />;
  return <code className="font-mono text-xs text-foreground">{value}</code>;
}

export default function PackagePage() {
  return (
    <DocsPage toc={toc}>
      <DocsPageHeader
        path="/docs/package"
        eyebrow="Get started"
        title="npm package"
        description="Install the components as a dependency and import them. Same source and theme as the CLI, compiled to ESM with type declarations."
        crumbs={[{ label: "Docs", href: "/docs" }, { label: "npm package" }]}
      />

      <div className="mt-10 flex flex-col gap-14">
        <PreReleaseNotice />

        <DocsSection
          id="cli-or-package"
          title="CLI or package?"
          description="Both are first-class, and a project can use both: copy the components you want to change, import the rest."
        >
          <div className="overflow-x-auto border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <span className="sr-only">Capability</span>
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">CLI (aback-ui)</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Package (@aback-ui/ui)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {comparison.map((row) => (
                  <tr key={row.label}>
                    <th scope="row" className="px-4 py-3 text-left font-medium text-foreground">{row.label}</th>
                    <td className="px-4 py-3"><Cell value={row.cli} /></td>
                    <td className="px-4 py-3"><Cell value={row.pkg} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DocsSection>

        <DocsSection id="setup" title="Set up">
          <DocsSteps>
            <DocsStep id="install" title="Install the packages">
              <PackageCommand kind="install" args="@aback-ui/ui @aback-ui/tokens" />
              <p>
                React 19 and React DOM are peer dependencies. Radix UI, Tabler icons, and the
                other runtime dependencies install with the package.
              </p>
            </DocsStep>

            <DocsStep id="add-the-styles" title="Add the styles">
              <p>Import the theme after Tailwind, then point Tailwind at the package:</p>
              <Code
                language="css"
                filename="app/globals.css"
                code={`@import "tailwindcss";
@import "@aback-ui/tokens/tokens.css";
@source "../node_modules/@aback-ui/ui/dist";`}
              />
              <Callout type="warning" title="The @source line is required">
                Tailwind CSS v4 does not scan <code>node_modules</code>. Without{" "}
                <code>@source</code>, the classes the components use are never generated and they
                render unstyled. The path is relative to the stylesheet, so adjust it if your CSS
                is not one folder below the project root.
              </Callout>
            </DocsStep>

            <DocsStep id="import" title="Import components">
              <Code
                language="tsx"
                filename="app/settings/save-bar.tsx"
                code={`import { Button, CopyButton } from "@aback-ui/ui";

export function SaveBar({ token }: { token: string }) {
  return (
    <div className="flex gap-2">
      <CopyButton value={token} showLabel label="Copy token" />
      <Button>Save changes</Button>
    </div>
  );
}`}
              />
              <p>
                Everything is a named export from the package root. Interactive components carry{" "}
                <code>&quot;use client&quot;</code>, so they work from React Server Components;
                presentational ones render on the server.
              </p>
            </DocsStep>
          </DocsSteps>
        </DocsSection>

        <DocsSection id="packages" title="What each package contains">
          <div className="grid gap-px border border-border bg-border md:grid-cols-2">
            <div className="flex flex-col gap-2 bg-card p-5">
              <code className="font-mono text-sm font-semibold text-foreground">@aback-ui/ui</code>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Every component, plus <code className="bg-muted px-1 font-mono text-[0.9em] text-foreground">cn()</code>,{" "}
                <code className="bg-muted px-1 font-mono text-[0.9em] text-foreground">ThemeScript</code>, and{" "}
                <code className="bg-muted px-1 font-mono text-[0.9em] text-foreground">useTheme</code>. Tree-shakeable
                ESM with TypeScript declarations.
              </p>
            </div>
            <div className="flex flex-col gap-2 bg-card p-5">
              <code className="font-mono text-sm font-semibold text-foreground">@aback-ui/tokens</code>
              <p className="text-sm leading-relaxed text-muted-foreground">
                One file, <code className="bg-muted px-1 font-mono text-[0.9em] text-foreground">tokens.css</code>: the
                light and dark colour roles, the Aback Blue ramp, and square geometry. See{" "}
                <Link href="/docs/theming" className="font-medium text-link underline underline-offset-4">Theming</Link>.
              </p>
            </div>
          </div>
        </DocsSection>

        <DocsSection id="updating" title="Updating">
          <div className="prose-docs">
            <p>
              Update both packages together, since components rely on the tokens of the same
              release. Aback UI is pre-1.0, so a minor version can change an API; the{" "}
              <Link href="/docs/changelog">changelog</Link> lists every change with migration
              notes.
            </p>
          </div>
          <PackageCommand kind="install" args="@aback-ui/ui@latest @aback-ui/tokens@latest" />
        </DocsSection>

        <GuidePager href="/docs/package" />
      </div>
    </DocsPage>
  );
}
