import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs, PageHeader } from "@aback-ui/ui";

import { CodeBlock } from "@/components/code-block";
import { InstallCommand } from "@/components/install-command";

export const metadata: Metadata = {
  title: "Installation",
  description:
    "Add the Aback theme, configure the registry, and copy your first component into a React project.",
  alternates: { canonical: "/docs/installation" },
};

const themeCommand = "npx shadcn@latest add https://abackui.com/r/theme.json";
const buttonCommand = "npx shadcn@latest add https://abackui.com/r/button.json";

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
        <InstallCommand command={themeCommand} />
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
        <InstallCommand command={buttonCommand} />
        <p>
          The file lands at <code>components/ui/button.tsx</code>, or under your source root
          (for example <code>src/components/ui/button.tsx</code>) if the project uses one. Edit it
          like any other file in your project.
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
        <InstallCommand command="npx shadcn@latest add @aback/button" />

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

        <h2>About the npm package</h2>
        <p>
          The repository also builds <code>@aback-ui/ui</code> and{" "}
          <code>@aback-ui/tokens</code>, and both are exercised in the workspace. They are not
          published to npm yet. Until they are, the registry is the supported path and this site
          does not show an install command that would fail.
        </p>
      </div>
    </div>
  );
}
