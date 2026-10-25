import type { Metadata } from "next";
import Link from "next/link";

import { ThemeToggle } from "@aback-ui/ui";

import { Code } from "@/components/code";
import { DocsPage, DocsPageHeader, DocsSection, type TocItem } from "@/components/docs-page";
import { Callout, DocsStep, DocsSteps, GuidePager } from "@/components/docs-ui";
import { PackageCommand } from "@/components/package-command";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Dark mode",
  description:
    "Add light, dark, and system themes to an Aback UI project with ThemeScript, ThemeToggle, and useTheme, without a flash on load.",
  alternates: { canonical: "/docs/dark-mode" },
};

const toc: TocItem[] = [
  { id: "how-it-works", title: "How it works" },
  { id: "setup", title: "Set it up" },
  { id: "add-the-components", title: "Add the components", depth: 2 },
  { id: "apply-before-paint", title: "Apply before paint", depth: 2 },
  { id: "add-a-toggle", title: "Add a toggle", depth: 2 },
  { id: "use-theme", title: "Build your own control" },
  { id: "other-frameworks", title: "Other frameworks" },
];

export default function DarkModePage() {
  return (
    <DocsPage toc={toc}>
      <DocsPageHeader
        eyebrow="Foundations"
        title="Dark mode"
        description="A dark class on the html element switches every component. Three pieces make it production quality: apply the stored choice before paint, offer a toggle, and follow the system setting by default."
        crumbs={[{ label: "Docs", href: "/docs" }, { label: "Dark mode" }]}
      />

      <div className="mt-10 flex flex-col gap-14">
        <DocsSection id="how-it-works" title="How it works">
          <div className="flex flex-wrap items-center gap-4 border border-border bg-card p-5">
            <ThemeToggle />
            <p className="min-w-0 flex-1 text-sm leading-relaxed text-muted-foreground">
              This is the shipped <code className="bg-muted px-1 font-mono text-[0.9em] text-foreground">ThemeToggle</code>.
              It switches this page and remembers the choice.
            </p>
          </div>
          <div className="prose-docs">
            <ul>
              <li>
                The theme&apos;s <code>.dark</code> block holds every dark value. Adding the{" "}
                <code>dark</code> class to <code>&lt;html&gt;</code> switches them all at once.
              </li>
              <li>
                The choice is stored in <code>localStorage</code> under <code>theme</code> as{" "}
                <code>light</code>, <code>dark</code>, or <code>system</code>. With nothing stored,
                the operating system decides. While a toggle or <code>useTheme</code> is on the
                page, a change to the system setting is followed immediately.
              </li>
              <li>Other open tabs follow a change, and so does every component using the hook.</li>
            </ul>
          </div>
        </DocsSection>

        <DocsSection id="setup" title="Set it up">
          <DocsSteps>
            <DocsStep id="add-the-components" title="Add the components">
              <PackageCommand args={`${site.cli} add theme-toggle`} />
              <p>
                With the npm package, <code>ThemeScript</code>, <code>ThemeToggle</code>, and{" "}
                <code>useTheme</code> are already exported from <code>@aback-ui/ui</code>.
              </p>
            </DocsStep>

            <DocsStep id="apply-before-paint" title="Apply the stored theme before paint">
              <p>
                Render <code>ThemeScript</code> in the root layout. It is a tiny inline script that
                sets the class before the first paint, so a dark-mode visitor never sees a white
                flash.
              </p>
              <Code
                language="tsx"
                filename="app/layout.tsx"
                code={`import { ThemeScript } from "@/components/ui/theme-toggle";

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
              <Callout type="note">
                <code>suppressHydrationWarning</code> is needed because the script changes the{" "}
                <code>html</code> class before React hydrates. Pass <code>nonce</code> when your
                Content Security Policy requires one.
              </Callout>
            </DocsStep>

            <DocsStep id="add-a-toggle" title="Add a toggle">
              <Code
                language="tsx"
                filename="components/site-header.tsx"
                code={`import { ThemeToggle } from "@/components/ui/theme-toggle";

export function SiteHeader() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-separator px-4">
      <a href="/">Home</a>
      <ThemeToggle />
    </header>
  );
}`}
              />
              <p>
                It is an icon button with an accessible name that says what it will do, such as
                &quot;Switch to dark theme&quot;. Rename it with <code>toDarkLabel</code> and{" "}
                <code>toLightLabel</code>.
              </p>
            </DocsStep>
          </DocsSteps>
        </DocsSection>

        <DocsSection
          id="use-theme"
          title="Build your own control"
          description="useTheme reads and writes the same stored choice, for a menu or a settings page."
        >
          <Code
            language="tsx"
            filename="components/theme-select.tsx"
            code={`"use client";

import { useTheme } from "@/components/ui/theme-toggle";

export function ThemeSelect() {
  const { theme, setTheme } = useTheme();
  return (
    <select value={theme} onChange={(event) => setTheme(event.target.value as typeof theme)}>
      <option value="system">System</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  );
}`}
          />
          <div className="prose-docs">
            <p>
              <code>theme</code> is the stored choice, including <code>system</code>.{" "}
              <code>resolvedTheme</code> is what is on screen. During the server render it is{" "}
              <code>light</code>, so read it only for things that can change after hydration.
            </p>
          </div>
        </DocsSection>

        <DocsSection id="other-frameworks" title="Other frameworks">
          <div className="prose-docs">
            <p>
              Nothing here depends on Next.js. In Vite or any single-page app, put the{" "}
              <code>ThemeScript</code> markup in <code>index.html</code>, or render the component
              before your app root. Prefer a different storage key? Pass the same{" "}
              <code>storageKey</code> to <code>ThemeScript</code>, <code>ThemeToggle</code>, and{" "}
              <code>useTheme</code>.
            </p>
            <p>
              The colours themselves are covered in <Link href="/docs/theming">Theming</Link>.
            </p>
          </div>
        </DocsSection>

        <GuidePager href="/docs/dark-mode" />
      </div>
    </DocsPage>
  );
}
