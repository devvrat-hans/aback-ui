import type { Metadata } from "next";
import Link from "next/link";

import {
  Badge,
  Breadcrumbs,
  CodeBlock,
  PageHeader,
} from "@aback-ui/ui";

export const metadata: Metadata = {
  title: "Aback CLI",
  description:
    "Initialize an Aback UI project and install canonical component source from the registry with the @aback-ui/cli package.",
  alternates: { canonical: "/docs/cli" },
};

const commands = [
  {
    command: "init",
    description:
      "Detect the framework, Tailwind v4, stylesheet, and path aliases. Write components.json, styles/aback.css, and lib/utils.ts. Add the theme import and install the shared utilities.",
  },
  {
    command: "add <items...>",
    description:
      "Resolve each item and its registry dependencies, copy source into the project, and install the npm packages the files import.",
  },
  {
    command: "diff [items...]",
    description:
      "Compare installed files with the registry and print what a reinstall would change. Pass --all to check every installed UI and block item.",
  },
  {
    command: "doctor",
    description:
      "Check the project setup without writing anything: config, style, aliases, utilities, stylesheet import, theme, Tailwind version, registry template, and installed files.",
  },
  {
    command: "list [query]",
    description: "List registry items grouped by category. Add --json for scripts and agents.",
  },
  {
    command: "view <item>",
    description: "Show an item's metadata, dependencies, registry dependencies, and file targets.",
  },
];

const options = [
  ["--cwd <dir>", "Project directory. Defaults to the current directory."],
  ["--registry <url>", "Registry base URL or a local directory. Also ABACK_UI_REGISTRY."],
  ["--yes, -y", "Accept defaults. Existing files are kept."],
  ["--overwrite", "Replace existing files without prompting."],
  ["--dry-run", "Print the plan without writing or installing anything."],
  ["--no-install", "Write files but skip package installation."],
  ["--json", "Machine-readable output for diff, list, view, and doctor."],
  ["--all", "Compare every installed UI and block item (diff)."],
];

export default function CliPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <PageHeader
          eyebrow="Developer tools"
          title="Aback CLI"
          description="One command to configure a project. One command to copy canonical component source. No runtime, no account, and no hidden upgrade path."
          actions={<Badge variant="warning">Preview · not on npm yet</Badge>}
        />
        <Breadcrumbs items={[{ label: "Docs", href: "/docs" }, { label: "CLI" }]} />
      </div>

      <div className="border border-warning bg-warning-soft px-4 py-3 text-sm leading-relaxed text-warning-strong dark:border-warning/40 dark:bg-warning/10 dark:text-warning">
        <strong className="font-semibold">Availability.</strong> The CLI package is implemented
        and tested in this repository, but it has not been published to npm. Until publication,
        use the <Link href="/docs/installation" className="underline underline-offset-4">shadcn CLI</Link>{" "}
        path, or build the workspace package and run it locally as shown below. The site does not
        advertise an <code className="font-mono">npx</code> command that would fail.
      </div>

      <div className="prose-docs">
        <h2>Overview</h2>
        <p>
          The Aback CLI is the first-party client for the same registry the shadcn CLI installs
          from. Both read <code>components.json</code>, both write the same canonical source, and
          both leave the files in your project. The Aback CLI adds project detection, a dry run,
          dependency-graph resolution, and a guarded overwrite policy.
        </p>
        <p>
          Registry items are validated in CI: every import must have a declared dependency, paths
          may not escape the project, targets must stay inside documented install directories, and
          the source is scanned for committed secrets.
        </p>

        <h2>Run it from the repository</h2>
        <p>
          The package lives at <code>packages/cli</code>. Build it once, then run the emitted
          binary. The build has no runtime dependencies beyond Node.js 20.9 or newer.
        </p>
        <CodeBlock
          language="bash"
          filename="terminal"
          code={`bun --filter @aback-ui/cli build

# Configure the project you are standing in
node packages/cli/dist/index.js init

# Install components
node packages/cli/dist/index.js add button dialog
node packages/cli/dist/index.js add @aback/tooltip
node packages/cli/dist/index.js list forms`}
        />
        <p>
          Point the CLI at the generated registry to inspect a change against your local build
          before it deploys. Items that declare remote registry dependencies still resolve them by
          their published URL.
        </p>
        <CodeBlock
          language="bash"
          filename="terminal"
          code={`node packages/cli/dist/index.js add button \\
  --registry apps/docs/public/r`}
        />

        <h2>What init does</h2>
        <ol>
          <li>Finds the nearest package.json and refuses to run outside a project.</li>
          <li>Checks for Tailwind CSS v4 and reports a clear error for v3 or a missing install.</li>
          <li>Detects Next.js or Vite, the source directory, the global stylesheet, and the path alias from tsconfig.</li>
          <li>Writes <code>components.json</code> with the aliases the rest of the CLI uses.</li>
          <li>Installs the theme at <code>styles/aback.css</code> and <code>lib/utils.ts</code> from the registry.</li>
          <li>Inserts the theme import directly after the Tailwind import in your stylesheet.</li>
          <li>Installs <code>clsx</code> and <code>tailwind-merge</code> with the package manager the lockfile indicates.</li>
        </ol>

        <h2>Commands</h2>
        <div className="not-prose overflow-x-auto border border-border">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-muted/40 text-left">
                <th scope="col" className="px-4 py-2 font-medium text-foreground">
                  Command
                </th>
                <th scope="col" className="px-4 py-2 font-medium text-foreground">
                  Behavior
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {commands.map((entry) => (
                <tr key={entry.command}>
                  <td className="whitespace-nowrap px-4 py-2.5 align-top font-mono text-xs text-foreground">
                    {entry.command}
                  </td>
                  <td className="px-4 py-2.5 text-sm leading-relaxed text-muted-foreground">
                    {entry.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Options</h2>
        <div className="not-prose overflow-x-auto border border-border">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-muted/40 text-left">
                <th scope="col" className="px-4 py-2 font-medium text-foreground">
                  Option
                </th>
                <th scope="col" className="px-4 py-2 font-medium text-foreground">
                  Effect
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {options.map(([option, effect]) => (
                <tr key={option}>
                  <td className="whitespace-nowrap px-4 py-2.5 align-top font-mono text-xs text-foreground">
                    {option}
                  </td>
                  <td className="px-4 py-2.5 text-sm leading-relaxed text-muted-foreground">
                    {effect}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Overwrite policy</h2>
        <p>
          File contents are compared before writing. An identical file is left untouched. A file
          that differs is never replaced silently: the CLI asks, and in a non-interactive shell the
          answer defaults to keeping your version. Pass <code>--overwrite</code> only when you
          intend to discard local edits.
        </p>

        <h2>Checking a setup</h2>
        <p>
          When a component renders without styles, or an install fails for a reason that is not
          obvious, run <code>doctor</code> before changing files. It inspects the project without
          touching it, and every check is local: no registry request and no package install.
        </p>
        <CodeBlock
          language="bash"
          filename="terminal"
          code={`npx @aback-ui/cli doctor

# For CI or an agent: JSON with a stable summary and per-check ids
npx @aback-ui/cli doctor --json`}
        />
        <p>
          Each check reports <code>pass</code>, <code>warn</code>, <code>fail</code>, or{" "}
          <code>skip</code> with a concrete next action. The command exits non-zero only for
          errors, so warnings are safe to surface without breaking a build. Checks cover the Node
          version, framework, Tailwind v4, components.json, the <code>aback</code> style, path
          aliases, the <code>cn()</code> utility, the theme import, <code>styles/aback.css</code>,
          the registry template, installed components, and conflicting lockfiles.
        </p>

        <h2>Detecting drift</h2>
        <p>
          Copied source is yours, so it will diverge from the registry. Before upgrading,
          see exactly what would change:
        </p>
        <CodeBlock
          language="bash"
          filename="terminal"
          code={`# One item
node packages/cli/dist/index.js diff button

# Everything installed, with machine-readable output for CI
node packages/cli/dist/index.js diff --all --json`}
        />
        <p>
          The output uses <code>-</code> for the file on disk and <code>+</code> for the registry
          version, with two lines of context. Missing files are reported separately. The command
          never writes or installs anything; it exits successfully even when files differ, so CI
          can decide what to do with the JSON.
        </p>

        <h2>Safety</h2>
        <ul>
          <li>No registry item is executed. The CLI writes files and delegates installs to your package manager.</li>
          <li>Absolute targets and <code>..</code> segments are rejected before any write.</li>
          <li><code>--dry-run</code> performs no writes and no installs.</li>
          <li>Registry dependencies are resolved with cycle detection, dependencies first.</li>
        </ul>

        <h2>Registry compatibility</h2>
        <p>
          The generated registry uses the shadcn registry schema, so the shadcn CLI can install
          the same items today. The Aback CLI reads the same schema and can install from another
          compatible registry with <code>--registry</code>. Aliases declared under{" "}
          <code>registries</code> in <code>components.json</code> work in both directions, for
          example <code>@aback/button</code>.
        </p>

        <h2>Next</h2>
        <ul>
          <li>
            <Link href="/docs/installation">Installation guide</Link> for the supported path today.
          </li>
          <li>
            <Link href="/docs/registry">How the registry is built and validated.</Link>
          </li>
          <li>
            <Link href="/docs/components">Components</Link> for the full catalogue.
          </li>
        </ul>
      </div>
    </div>
  );
}
