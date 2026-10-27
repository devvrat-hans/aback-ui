import type { Metadata } from "next";
import Link from "next/link";
import { IconBox, IconLayoutGrid, IconMoon, IconPalette } from "@tabler/icons-react";

import { Code } from "@/components/code";
import { DocsPage, DocsPageHeader, DocsSection, type TocItem } from "@/components/docs-page";
import { Callout, DocsStep, DocsSteps, GuidePager, LinkCards } from "@/components/docs-ui";
import { PackageCommand } from "@/components/package-command";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/docs/installation/next");

const toc: TocItem[] = [
  { id: "create-the-app", title: "Create the app" },
  { id: "run-init", title: "Run init" },
  { id: "remove-starter-styles", title: "Remove the starter styles" },
  { id: "add-components", title: "Add components" },
  { id: "dark-mode", title: "Add dark mode" },
  { id: "server-components", title: "Server Components" },
  { id: "next", title: "Where to next" },
];

const link = "font-medium text-link underline underline-offset-4";

export default function NextInstallationPage() {
  return (
    <DocsPage toc={toc}>
      <DocsPageHeader
        path="/docs/installation/next"
        eyebrow="Installation"
        title="Next.js"
        description="Set up Aback UI in a Next.js App Router project. Verified with create-next-app on Next.js 16, React 19, and Tailwind CSS v4."
        crumbs={[
          { label: "Docs", href: "/docs" },
          { label: "Installation", href: "/docs/installation" },
          { label: "Next.js" },
        ]}
      />

      <div className="mt-10 flex flex-col gap-14">
        <DocsSteps>
          <DocsStep id="create-the-app" title="Create the app">
            <p>
              Skip this for an existing app that already uses Tailwind CSS v4 and the <code>@/</code>{" "}
              alias. The default options include TypeScript, Tailwind CSS v4, the App Router, and an{" "}
              <code>@/*</code> path alias:
            </p>
            <PackageCommand args="create-next-app@latest my-app --yes" />
          </DocsStep>

          <DocsStep id="run-init" title="Run init">
            <p>In the project root:</p>
            <PackageCommand args={`${site.cli} init`} />
            <p>
              init finds <code>app/globals.css</code>, writes <code>styles/aback.css</code>,{" "}
              <code>lib/utils.ts</code>, and <code>aback-ui.json</code>, and adds one import after the
              Tailwind import:
            </p>
            <Code
              language="css"
              filename="app/globals.css"
              code={`@import "tailwindcss";
@import "../styles/aback.css";`}
            />
          </DocsStep>

          <DocsStep id="remove-starter-styles" title="Remove the starter styles">
            <p>
              The <code>globals.css</code> that create-next-app writes declares its own{" "}
              <code>--background</code> and <code>--foreground</code>, a <code>@theme inline</code> block,
              a dark-mode media query, and a <code>body</code> rule. Because they come after the Aback
              import, they override the theme: the page background ignores the Aback values and follows
              the operating system instead of your theme toggle. Delete everything after the two imports,
              so the file is just:
            </p>
            <Code
              language="css"
              filename="app/globals.css"
              code={`@import "tailwindcss";
@import "../styles/aback.css";`}
            />
            <p>
              The Aback theme already sets the page background, text colour, and the Geist font stacks.
              The <code>--font-geist-sans</code> and <code>--font-geist-mono</code> variables that the
              starter layout creates with <code>next/font</code> are picked up as they are.
            </p>
          </DocsStep>

          <DocsStep id="add-components" title="Add components">
            <PackageCommand args={`${site.cli} add button dialog`} />
            <p>
              The files land in <code>components/ui</code>. Import them with the alias:
            </p>
            <Code
              language="tsx"
              filename="app/page.tsx"
              code={`import { Button } from "@/components/ui/button";

export default function Page() {
  return <Button>Save changes</Button>;
}`}
            />
          </DocsStep>
        </DocsSteps>

        <DocsSection id="dark-mode" title="Add dark mode">
          <PackageCommand args={`${site.cli} add theme-toggle`} />
          <p className="max-w-[68ch] text-sm leading-relaxed text-muted-foreground">
            Render <code className="bg-muted px-1 font-mono text-[0.9em] text-foreground">ThemeScript</code> in
            the root layout&apos;s head so the saved theme is applied before the first paint, and add{" "}
            <code className="bg-muted px-1 font-mono text-[0.9em] text-foreground">suppressHydrationWarning</code>{" "}
            to <code className="bg-muted px-1 font-mono text-[0.9em] text-foreground">html</code>, because the
            script sets its class before React hydrates.
          </p>
          <Code
            language="tsx"
            filename="app/layout.tsx"
            code={`import { ThemeScript } from "@/components/ui/theme-toggle";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>{children}</body>
    </html>
  );
}`}
          />
          <p className="max-w-[68ch] text-sm leading-relaxed text-muted-foreground">
            Then place <code className="bg-muted px-1 font-mono text-[0.9em] text-foreground">&lt;ThemeToggle /&gt;</code>{" "}
            in your header. The <Link href="/docs/dark-mode" className={link}>dark mode guide</Link> covers{" "}
            <code className="bg-muted px-1 font-mono text-[0.9em] text-foreground">useTheme</code>, labels, and
            Content Security Policy nonces.
          </p>
        </DocsSection>

        <DocsSection id="server-components" title="Server Components">
          <p className="max-w-[68ch] text-sm leading-relaxed text-muted-foreground">
            Components that need state or event handlers, such as Dialog, Tabs, and ThemeToggle, start
            with <code className="bg-muted px-1 font-mono text-[0.9em] text-foreground">&quot;use client&quot;</code>,
            so you can import them from Server Components without adding the directive yourself. Pass
            them serializable props; event handlers have to come from a Client Component.
          </p>
          <Callout type="tip" title="Static export works">
            abackui.com itself is a Next.js app built with <code>output: &quot;export&quot;</code> and the
            same components, so a fully static build is a supported setup.
          </Callout>
        </DocsSection>

        <DocsSection id="next" title="Where to next">
          <LinkCards
            items={[
              { title: "Browse components", description: "Live previews, props, and keyboard tables.", href: "/docs/components", icon: IconBox },
              { title: "Start from a block", description: "Sign-in, pricing, settings, and dashboards.", href: "/docs/blocks", icon: IconLayoutGrid },
              { title: "Dark mode", description: "Light, dark, and system without a flash.", href: "/docs/dark-mode", icon: IconMoon },
              { title: "Make it your brand", description: "Generate a theme from one colour.", href: "/themes", icon: IconPalette },
            ]}
          />
        </DocsSection>

        <GuidePager href="/docs/installation/next" />
      </div>
    </DocsPage>
  );
}
