import type { Metadata } from "next";
import Link from "next/link";
import { IconBox, IconLayoutGrid, IconMoon, IconPalette } from "@tabler/icons-react";

import { Code } from "@/components/code";
import { DocsPage, DocsPageHeader, DocsSection, type TocItem } from "@/components/docs-page";
import { Callout, DocsStep, DocsSteps, GuidePager, LinkCards } from "@/components/docs-ui";
import { PackageCommand } from "@/components/package-command";
import { site } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/docs/installation/vite");

const toc: TocItem[] = [
  { id: "create-the-app", title: "Create the app" },
  { id: "add-tailwind", title: "Add Tailwind CSS" },
  { id: "add-the-alias", title: "Add the @/ alias" },
  { id: "run-init", title: "Run init" },
  { id: "add-components", title: "Add components" },
  { id: "dark-mode", title: "Add dark mode" },
  { id: "next", title: "Where to next" },
];

const inline = "bg-muted px-1 font-mono text-[0.9em] text-foreground";

export default function ViteInstallationPage() {
  return (
    <DocsPage toc={toc}>
      <DocsPageHeader
        path="/docs/installation/vite"
        eyebrow="Installation"
        title="Vite"
        description="Set up Aback UI in a Vite React TypeScript app. Verified with the react-ts template on Vite 8, React 19, and Tailwind CSS v4."
        crumbs={[
          { label: "Docs", href: "/docs" },
          { label: "Installation", href: "/docs/installation" },
          { label: "Vite" },
        ]}
      />

      <div className="mt-10 flex flex-col gap-14">
        <DocsSteps>
          <DocsStep id="create-the-app" title="Create the app">
            <PackageCommand args="create-vite@latest my-app --template react-ts" />
            <p>
              Then <code>cd my-app</code> and install dependencies with your package manager.
            </p>
          </DocsStep>

          <DocsStep id="add-tailwind" title="Add Tailwind CSS">
            <PackageCommand kind="install" args="tailwindcss @tailwindcss/vite" />
            <p>
              Replace everything in <code>src/index.css</code> with the Tailwind import. The template&apos;s
              starter styles would otherwise fight the Aback theme:
            </p>
            <Code language="css" filename="src/index.css" code={`@import "tailwindcss";`} />
          </DocsStep>

          <DocsStep id="add-the-alias" title="Add the @/ alias">
            <p>
              Installed components import <code>@/components/ui</code> and <code>@/lib/utils</code>, so the
              alias has to resolve in three places. The template splits TypeScript settings across files:
              add <code>paths</code> to <code>tsconfig.json</code>, which the CLI and editors read, and to{" "}
              <code>tsconfig.app.json</code>, which the build type-checks with.
            </p>
            <Code
              language="json"
              filename="tsconfig.json"
              code={`{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}`}
            />
            <Code
              language="json"
              filename="tsconfig.app.json"
              code={`{
  "compilerOptions": {
    // ...keep the template's options
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}`}
            />
            <p>Then teach Vite the same alias and add the Tailwind plugin:</p>
            <PackageCommand kind="install" args="-D @types/node" />
            <Code
              language="ts"
              filename="vite.config.ts"
              code={`import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});`}
            />
          </DocsStep>

          <DocsStep id="run-init" title="Run init">
            <PackageCommand args={`${site.cli} init`} />
            <p>
              init detects Vite, finds <code>src/index.css</code>, and adds the theme import after
              Tailwind. It writes <code>src/lib/utils.ts</code>, <code>styles/aback.css</code>, and{" "}
              <code>aback-ui.json</code>, and installs <code>clsx</code> and <code>tailwind-merge</code>.
            </p>
            <Code
              language="css"
              filename="src/index.css"
              code={`@import "tailwindcss";
@import "../styles/aback.css";`}
            />
          </DocsStep>

          <DocsStep id="add-components" title="Add components">
            <PackageCommand args={`${site.cli} add button dialog`} />
            <Code
              language="tsx"
              filename="src/App.tsx"
              code={`import { Button } from "@/components/ui/button";

export default function App() {
  return <Button>Save changes</Button>;
}`}
            />
            <p>
              Run <code>npm run build</code> to confirm the alias resolves in both TypeScript and Vite.
            </p>
          </DocsStep>
        </DocsSteps>

        <DocsSection id="dark-mode" title="Add dark mode">
          <PackageCommand args={`${site.cli} add theme-toggle`} />
          <p className="max-w-[68ch] text-sm leading-relaxed text-muted-foreground">
            A Vite app has no server-rendered layout, so apply the saved theme with an inline script in{" "}
            <code className={inline}>index.html</code>, before your bundle loads. It is the same code{" "}
            <code className={inline}>ThemeScript</code> renders, reading the default{" "}
            <code className={inline}>theme</code> storage key that <code className={inline}>ThemeToggle</code> writes:
          </p>
          <Code
            language="html"
            filename="index.html"
            code={`<head>
  <!-- ...the template's tags -->
  <script>
    (function(){try{var t=localStorage.getItem("theme");var d=t==="dark"||((!t||t==="system")&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();
  </script>
</head>`}
          />
          <p className="max-w-[68ch] text-sm leading-relaxed text-muted-foreground">
            Then render <code className={inline}>&lt;ThemeToggle /&gt;</code> wherever you want the switch.
            The{" "}
            <Link href="/docs/dark-mode" className="font-medium text-link underline underline-offset-4">
              dark mode guide
            </Link>{" "}
            covers <code className={inline}>useTheme</code> and custom labels.
          </p>
          <Callout type="note">
            If you set a Content Security Policy that blocks inline scripts, allow this one by hash, or
            leave it out: the app still works, and a visitor who chose dark sees the light theme until the
            bundle runs.
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

        <GuidePager href="/docs/installation/vite" />
      </div>
    </DocsPage>
  );
}
