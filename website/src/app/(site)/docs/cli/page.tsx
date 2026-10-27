import type { Metadata } from "next";
import Link from "next/link";

import { Code } from "@/components/code";
import { DocsPage, DocsPageHeader, DocsSection, type TocItem } from "@/components/docs-page";
import { Callout, GuidePager, PreReleaseNotice } from "@/components/docs-ui";
import { PackageCommand } from "@/components/package-command";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/docs/cli");

const commands = [
  {
    id: "init",
    usage: "aback-ui init",
    summary: "Set up a project once.",
    body: "Checks for Tailwind CSS v4, finds your global stylesheet and path alias, then writes aback-ui.json, styles/aback.css, and lib/utils.ts, imports the theme in your stylesheet, and installs clsx and tailwind-merge. If aback-ui.json already exists it does nothing; pass --force to rewrite it.",
    example: "aback-ui init --css src/index.css",
  },
  {
    id: "add",
    usage: "aback-ui add <items...>",
    summary: "Copy components or blocks into the project.",
    body: "Resolves each item and every item it builds on, writes them in dependency order, and installs the npm packages they import. Components go to components/ui and blocks to components/blocks, following your aliases.",
    example: "aback-ui add dialog dropdown-menu sign-in",
  },
  {
    id: "diff",
    usage: "aback-ui diff [items...]",
    summary: "Compare your copies with the current version.",
    body: "Prints a line diff for each file that differs from the version this CLI ships. It never writes. --all checks every installed component and block; --json is for CI.",
    example: "aback-ui diff --all",
  },
  {
    id: "doctor",
    usage: "aback-ui doctor",
    summary: "Check the setup without changing anything.",
    body: "Checks Node, the framework, Tailwind v4, aback-ui.json, path aliases, the class helper, the theme file and its import, the registry entry, installed components, and conflicting lockfiles. Errors exit with a non-zero code; warnings do not.",
    example: "aback-ui doctor --json",
  },
  {
    id: "list",
    usage: "aback-ui list [query]",
    summary: "See what you can install.",
    body: "Lists every component and block grouped by category. A query filters by name, title, description, and category.",
    example: "aback-ui list date",
  },
  {
    id: "view",
    usage: "aback-ui view <item>",
    summary: "Inspect one item before installing it.",
    body: "Shows the description, npm dependencies, the components it builds on, and where each file will be written.",
    example: "aback-ui view sign-in",
  },
];

const options = [
  ["--yes, -y", "Accept defaults and keep every existing file. For scripts and CI."],
  ["--overwrite", "Replace existing files without asking."],
  ["--no-overwrite", "Keep every existing file without asking."],
  ["--dry-run", "Show what would be written and installed, then stop."],
  ["--no-install", "Write files but skip installing npm packages."],
  ["--cwd <dir>", "Run against another project directory."],
  ["--css <file>", "The global stylesheet for init, when it cannot be found."],
  ["--force", "Let init rewrite an existing aback-ui.json."],
  ["--registry <url>", "Install from a mirror or a local registry build instead of the bundled one."],
  ["--json", "Machine-readable output for diff, doctor, list, and view."],
  ["--all", "With diff: compare every installed item."],
  ["--version, -v", "Print the CLI version."],
  ["--help, -h", "Print the help text."],
];

const toc: TocItem[] = [
  { id: "usage", title: "Usage" },
  { id: "commands", title: "Commands" },
  ...commands.map((command) => ({ id: command.id, title: command.id, depth: 2 as const })),
  { id: "options", title: "Options" },
  { id: "overwrites", title: "Existing files" },
  { id: "config", title: "aback-ui.json" },
  { id: "registry", title: "Where components come from" },
];

export default function CliPage() {
  return (
    <DocsPage toc={toc}>
      <DocsPageHeader
        path="/docs/cli"
        eyebrow="Get started"
        title="CLI"
        description="aback-ui sets up a project and copies components into it as source you own. There is nothing to install globally and no account."
        crumbs={[{ label: "Docs", href: "/docs" }, { label: "CLI" }]}
      />

      <div className="mt-10 flex flex-col gap-14">
        <PreReleaseNotice />

        <DocsSection
          id="usage"
          title="Usage"
          description="Run it with your package manager's one-off runner. @latest makes sure you get the newest components."
        >
          <PackageCommand args={`${site.cli} <command> [options]`} />
        </DocsSection>

        <DocsSection id="commands" title="Commands">
          <div className="flex flex-col divide-y divide-border border border-border">
            {commands.map((command) => (
              <section key={command.id} aria-labelledby={command.id} className="flex flex-col gap-3 p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 id={command.id} className="scroll-mt-20 font-mono text-base font-semibold text-foreground">
                    {command.usage}
                  </h3>
                  <span className="text-sm text-muted-foreground">{command.summary}</span>
                </div>
                <p className="max-w-[72ch] text-sm leading-relaxed text-muted-foreground">{command.body}</p>
                <code className="block w-fit max-w-full overflow-x-auto whitespace-nowrap border border-border bg-code px-3 py-1.5 font-mono text-xs text-foreground">
                  $ npx {command.example.replace(/^aback-ui/, site.cli)}
                </code>
              </section>
            ))}
          </div>
        </DocsSection>

        <DocsSection id="options" title="Options">
          <div className="overflow-x-auto border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Option</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">What it does</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {options.map(([flag, description]) => (
                  <tr key={flag}>
                    <td className="whitespace-nowrap px-4 py-2.5 align-top font-mono text-xs font-semibold text-link">{flag}</td>
                    <td className="px-4 py-2.5 text-sm leading-relaxed text-muted-foreground">{description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DocsSection>

        <DocsSection
          id="overwrites"
          title="Existing files"
          description="The CLI never replaces a file silently."
        >
          <div className="prose-docs">
            <ul>
              <li>Interactively, it asks before replacing each file that already exists.</li>
              <li>
                <code>--yes</code> and <code>--no-overwrite</code> keep your files;{" "}
                <code>--overwrite</code> replaces them.
              </li>
              <li>
                Before updating a component you have edited, run <code>aback-ui diff</code> to see
                both versions side by side.
              </li>
              <li>
                Files are only ever written inside the project. An item that names a path outside it
                is refused.
              </li>
            </ul>
          </div>
        </DocsSection>

        <DocsSection
          id="config"
          title="aback-ui.json"
          description="Written by init and read by every other command. Edit it to change where files go."
        >
          <Code
            language="json"
            filename="aback-ui.json"
            code={`{
  "$schema": "https://abackui.com/schema/aback-ui.json",
  "style": "aback",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "css": "app/globals.css"
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "registries": {
    "@aback": "https://abackui.com/r/{name}.json"
  },
  "framework": "next"
}`}
          />
          <div className="overflow-x-auto border border-border">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border">
                {[
                  ["tailwind.css", "The global stylesheet init added the theme import to."],
                  ["aliases", "Import aliases from your tsconfig paths. They decide where files are written."],
                  ["rsc", "True for React Server Components projects, such as the Next.js App Router."],
                  ["registries", "Where items come from. The @aback entry above means the copy bundled with the CLI."],
                ].map(([field, description]) => (
                  <tr key={field}>
                    <td className="whitespace-nowrap px-4 py-2.5 align-top font-mono text-xs font-semibold text-link">{field}</td>
                    <td className="px-4 py-2.5 text-sm leading-relaxed text-muted-foreground">{description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DocsSection>

        <DocsSection id="registry" title="Where components come from">
          <div className="prose-docs">
            <p>
              The source of every component and block ships inside the <code>aback-ui</code> npm
              package. Installing does not download code from a website, the files always match the
              CLI version you ran, and it keeps working if abackui.com is unreachable. Your package
              manager still installs npm dependencies such as Radix UI.
            </p>
          </div>
          <Callout type="tip" title="Mirrors and private forks">
            Point the CLI at your own copy with <code>--registry https://ui.example.com/r</code>, the{" "}
            <code>ABACK_UI_REGISTRY</code> environment variable, or the <code>@aback</code> entry in{" "}
            <code>aback-ui.json</code>. The <Link href="/docs/registry">registry format</Link> page
            describes the files a registry serves.
          </Callout>
        </DocsSection>

        <GuidePager href="/docs/cli" />
      </div>
    </DocsPage>
  );
}
