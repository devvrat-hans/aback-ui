import type { Metadata } from "next";
import Link from "next/link";
import { IconBox, IconLayoutGrid, IconMoon, IconPackage } from "@tabler/icons-react";

import { Code } from "@/components/code";
import { DocsPage, DocsPageHeader, DocsSection, type TocItem } from "@/components/docs-page";
import { Callout, DocsStep, DocsSteps, GuidePager, LinkCards, PreReleaseNotice } from "@/components/docs-ui";
import { PackageCommand } from "@/components/package-command";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/docs/installation");

const toc: TocItem[] = [
  { id: "requirements", title: "Requirements" },
  { id: "setup", title: "Set up a project" },
  { id: "create-a-project", title: "Create a project", depth: 2 },
  { id: "run-init", title: "Run init", depth: 2 },
  { id: "add-a-component", title: "Add a component", depth: 2 },
  { id: "use-it", title: "Use it", depth: 2 },
  { id: "what-init-changes", title: "What init changes" },
  { id: "everyday-commands", title: "Everyday commands" },
  { id: "next", title: "Where to next" },
];

export default function InstallationPage() {
  return (
    <DocsPage toc={toc}>
      <DocsPageHeader
        path="/docs/installation"
        eyebrow="Get started"
        title="Installation"
        description="Two commands: init sets up the theme once, add copies a component into your project. The files are yours to edit."
        crumbs={[{ label: "Docs", href: "/docs" }, { label: "Installation" }]}
      />

      <div className="mt-10 flex flex-col gap-14">
        <PreReleaseNotice />

        <DocsSection id="requirements" title="Requirements">
          <ul className="grid gap-px border border-border bg-border sm:grid-cols-3">
            {[
              { title: "React 19", body: "The components are written and tested against React 19." },
              { title: "Tailwind CSS v4", body: "The theme uses v4's @theme inline. init stops on v3." },
              { title: "A @/ path alias", body: "Installed files import @/components/ui and @/lib/utils." },
            ].map((item) => (
              <li key={item.title} className="flex flex-col gap-1 bg-card p-4">
                <span className="text-sm font-semibold text-foreground">{item.title}</span>
                <span className="text-sm leading-relaxed text-muted-foreground">{item.body}</span>
              </li>
            ))}
          </ul>
          <p className="max-w-[68ch] text-sm leading-relaxed text-muted-foreground">
            Any React framework works. The CLI recognizes Next.js, Vite, Remix, and Astro and picks
            sensible defaults for each. Step-by-step guides:{" "}
            <Link href="/docs/installation/next" className="font-medium text-link underline underline-offset-4">
              Next.js
            </Link>{" "}
            and{" "}
            <Link href="/docs/installation/vite" className="font-medium text-link underline underline-offset-4">
              Vite
            </Link>
            .
          </p>
        </DocsSection>

        <DocsSection id="setup" title="Set up a project">
          <DocsSteps>
            <DocsStep id="create-a-project" title="Create a project">
              <p>
                Skip this step for an existing project. A new Next.js app comes with TypeScript,
                Tailwind CSS v4, and the <code>@/</code> alias already configured:
              </p>
              <PackageCommand args="create-next-app@latest my-app --yes" />
            </DocsStep>

            <DocsStep id="run-init" title="Run init">
              <p>Run this once, in the project root:</p>
              <PackageCommand args={`${site.cli} init`} />
              <p>
                It finds your global stylesheet, adds the Aback theme, and installs the two packages
                the class helper needs. <a href="#what-init-changes">See exactly what it changes</a>.
              </p>
            </DocsStep>

            <DocsStep id="add-a-component" title="Add a component">
              <PackageCommand args={`${site.cli} add button`} />
              <p>
                The source lands in <code>components/ui/button.tsx</code>, under <code>src/</code> if
                your project has one. Components that build on
                others bring them along: <code>add dialog</code> also installs Button. Add several at
                once with <code>add button dialog field</code>.
              </p>
            </DocsStep>

            <DocsStep id="use-it" title="Use it">
              <Code
                language="tsx"
                filename="app/page.tsx"
                code={`import { Button } from "@/components/ui/button";

export default function Page() {
  return <Button>Save changes</Button>;
}`}
              />
              <p>
                The default button is neutral ink. Use <code>variant=&quot;brand&quot;</code> for a
                brand action, and keep one primary action per surface.
              </p>
            </DocsStep>
          </DocsSteps>
        </DocsSection>

        <DocsSection
          id="what-init-changes"
          title="What init changes"
          description="Nothing outside this list is touched. Add --dry-run to see the plan without writing."
        >
          <div className="overflow-x-auto border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">File</th>
                  <th className="px-4 py-2.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["aback-ui.json", "New. Records your aliases and stylesheet so later commands know where files go."],
                  ["styles/aback.css", "New. The theme: colour roles for light and dark, the Aback Blue ramp, and square geometry."],
                  ["lib/utils.ts", "New. The cn() class helper every component imports."],
                  ["Your global stylesheet", "One line added after the Tailwind import: @import of styles/aback.css."],
                  ["package.json", "clsx and tailwind-merge added, through the package manager your lockfile uses."],
                ].map(([file, change]) => (
                  <tr key={file}>
                    <td className="whitespace-nowrap px-4 py-3 align-top font-mono text-xs text-foreground">{file}</td>
                    <td className="px-4 py-3 text-sm leading-relaxed text-muted-foreground">{change}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Code
            language="css"
            filename="app/globals.css"
            code={`@import "tailwindcss";
@import "../styles/aback.css";`}
          />
          <Callout type="note">
            If init cannot find your stylesheet, name it: <code>npx {site.cli} init --css src/index.css</code>.
            Files that already exist are kept unless you confirm the overwrite.
          </Callout>
        </DocsSection>

        <DocsSection id="everyday-commands" title="Everyday commands">
          <div className="grid gap-px border border-border bg-border md:grid-cols-2">
            {[
              { command: "add sign-in", body: "Install a block. It lands in components/blocks with every component it uses." },
              { command: "list forms", body: "Search what you can install, grouped by category." },
              { command: "diff --all", body: "See how your copies differ from the current version before you update." },
              { command: "doctor", body: "Check the setup: Tailwind, aliases, theme import, and installed files." },
            ].map((item) => (
              <div key={item.command} className="flex flex-col gap-2 bg-card p-4">
                <code className="font-mono text-sm font-semibold text-foreground">aback-ui {item.command}</code>
                <span className="text-sm leading-relaxed text-muted-foreground">{item.body}</span>
              </div>
            ))}
          </div>
          <p className="max-w-[68ch] text-sm leading-relaxed text-muted-foreground">
            Every command and option is in the <Link href="/docs/cli" className="font-medium text-link underline underline-offset-4">CLI reference</Link>.
          </p>
        </DocsSection>

        <DocsSection id="next" title="Where to next">
          <LinkCards
            items={[
              {
                title: "Browse components",
                description: "Live previews, props, and keyboard behavior for each one.",
                href: "/docs/components",
                icon: IconBox,
              },
              {
                title: "Start from a block",
                description: "Sign-in, pricing, settings, and dashboard sections.",
                href: "/docs/blocks",
                icon: IconLayoutGrid,
              },
              {
                title: "Add dark mode",
                description: "A theme toggle that remembers the choice without a flash.",
                href: "/docs/dark-mode",
                icon: IconMoon,
              },
              {
                title: "Prefer a package?",
                description: "Import from @aback-ui/ui instead of copying files.",
                href: "/docs/package",
                icon: IconPackage,
              },
            ]}
          />
        </DocsSection>

        <GuidePager href="/docs/installation" />
      </div>
    </DocsPage>
  );
}
