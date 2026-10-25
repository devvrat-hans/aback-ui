import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs, CodeBlock, PageHeader } from "@aback-ui/ui";

import { PackageCommand } from "@/components/package-command";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Installation",
  description:
    "Add the Aback theme, configure the registry, and copy your first component into a React project.",
  alternates: { canonical: "/docs/installation" },
};

const themeCommand = "shadcn@latest add https://abackui.com/r/theme.json";
const buttonCommand = "shadcn@latest add https://abackui.com/r/button.json";

export default function InstallationPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <PageHeader
          eyebrow="Getting started"
          title="Installation"
          description="One CSS import, one registry command, and the component source is in your project."
        />
        <Breadcrumbs
          items={[{ label: "Docs", href: "/docs" }, { label: "Installation" }]}
        />
      </div>

      <div className="prose-docs">
        <h2>Requirements</h2>
        <ul>
          <li>React 19 or newer. The package declares React 19 as a peer dependency.</li>
          <li>Tailwind CSS v4. The theme uses CSS variables and the v4 <code>@theme inline</code> directive.</li>
          <li>
            The <a href="https://ui.shadcn.com/docs/cli">shadcn CLI</a> for registry installation. It
            runs on Node.js 20.9 or newer.
          </li>
          <li>A path alias for <code>@/</code>, which the standard shadcn setup creates.</li>
        </ul>
        <p>
          Aback UI does not require Next.js. The registry copies React and TypeScript source, so
          any React framework with Tailwind v4 works.
        </p>

        <h2>1. Install the theme</h2>
        <p>
          The theme is a CSS file. This command writes it to{" "}
          <code>styles/aback.css</code> without changing your existing global stylesheet.
        </p>
        <PackageCommand args={themeCommand} />
        <p>
          Import it once, after Tailwind, in the stylesheet that your app already loads:
        </p>
        <CodeBlock
          language="css"
          filename="app/globals.css"
          code={`@import "tailwindcss";
@import "../styles/aback.css";`}
        />
        <p>
          The CLI writes the theme to <code>styles/aback.css</code> at the project root. Adjust the
          relative path if your global stylesheet is not at <code>app/globals.css</code>. The import
          must come after Tailwind so the theme can extend it.
        </p>

        <h2>2. Add a component</h2>
        <p>
          Every component is installed by its registry URL. This copies the source, installs its npm
          dependencies, and adds the shared <code>lib/utils.ts</code> helper on first use.
        </p>
        <PackageCommand args={buttonCommand} />
        <p>
          The file lands at <code>components/ui/button.tsx</code>, or under your source root
          (for example <code>src/components/ui/button.tsx</code>) if the project uses one. Edit it
          like any other file in your project.
        </p>

        <h2>2b. Optional: the Aback CLI</h2>
        <p>
          The repository also ships a first-party CLI at <code>packages/cli</code>. It performs the
          same install with project detection, a dry run, and dependency-graph resolution. It is
          built and tested but <strong>not published to npm yet</strong>, so it is a preview rather
          than the supported path today. Build it and run it from the workspace:
        </p>
        <CodeBlock
          language="bash"
          filename="terminal"
          code={`bun --filter @aback-ui/cli build
node packages/cli/dist/index.js init
node packages/cli/dist/index.js add button`}
        />
        <p>
          See the <Link href="/docs/cli">CLI documentation</Link> for commands, flags, and the
          overwrite policy. Both clients read the same <code>components.json</code> and install the
          same source.
        </p>

        <h2>3. Optional: use a short namespace</h2>
        <p>
          If you install several components, add Aback UI as a named registry in{" "}
          <code>components.json</code>:
        </p>
        <CodeBlock
          language="json"
          filename="components.json"
          code={`{
  "registries": {
    "@aback": "https://abackui.com/r/{name}.json"
  }
}`}
        />
        <p>Then the command becomes:</p>
        <PackageCommand args="shadcn@latest add @aback/button" />

        <h2>4. Use the component</h2>
        <p>
          Import from the path the CLI wrote. If you changed your component alias, use that alias
          instead.
        </p>
        <CodeBlock
          language="tsx"
          filename="app/settings/save-button.tsx"
          code={`import { Button } from "@/components/ui/button";

export function SaveButton() {
  return <Button>Save changes</Button>;
}`}
        />
        <p>
          The default Button is neutral ink. Use <code>variant="brand"</code> for a brand action,
          and keep one primary action per surface.
        </p>

        <h2>5. Check both themes</h2>
        <p>
          The theme is light by default. Add the <code>dark</code> class to{" "}
          <code>&lt;html&gt;</code> for dark mode. See{" "}
          <Link href="/docs/theming">Theming</Link> for the persisted preference script and the
          token contract.
        </p>

        <h2>Updating a component</h2>
        <p>
          Copied source is intentionally yours. Run the registry command again to receive the
          current version, review the diff, and keep any local changes. There is no automatic
          overwrite of a file you have edited without a prompt.
        </p>

        <h2 id="npm">Or use the npm package</h2>
        <p>
          Copying source suits components you want to edit. When you would rather take updates with
          a version bump, use the packages instead: <code>@aback-ui/ui</code> for the components
          and <code>@aback-ui/tokens</code> for the theme. They contain the same canonical source,
          compiled to ESM with type declarations.
        </p>
        {site.npmPublished ? (
          <PackageCommand kind="install" args="@aback-ui/ui @aback-ui/tokens" />
        ) : (
          <p className="border-l-2 border-primary-300 bg-muted/20 px-3 py-2 text-xs dark:border-primary-500">
            <strong>Not on npm yet.</strong> Both packages are built, packed, and tested from their
            tarballs in CI, but the first release has not been published. This page will show the
            install command when it has; until then, use the registry above.
          </p>
        )}
        <p>
          Import the theme after Tailwind, and point Tailwind at the package. Tailwind v4 does not
          scan <code>node_modules</code>, so without the <code>@source</code> line the classes the
          components use are never generated:
        </p>
        <CodeBlock
          language="css"
          filename="app/globals.css"
          code={`@import "tailwindcss";
@import "@aback-ui/tokens/tokens.css";
@source "../node_modules/@aback-ui/ui/dist";`}
        />
        <p>
          The <code>@source</code> path is relative to the stylesheet; adjust it if your CSS lives
          elsewhere. Then import components from the package root:
        </p>
        <CodeBlock
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
          The package targets React 19 and declares React and React DOM as peer dependencies.
          Interactive components carry <code>&quot;use client&quot;</code>, so they work from
          React Server Components in Next.js.
        </p>
      </div>
    </div>
  );
}
