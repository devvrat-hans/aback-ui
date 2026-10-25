import type { Metadata } from "next";

import { Breadcrumbs, CodeBlock, PageHeader } from "@aback-ui/ui";

export const metadata: Metadata = {
  title: "Theming",
  description:
    "How the Aback theme works: semantic CSS variables, light and dark values, brand roles, and safe overrides.",
  alternates: { canonical: "/docs/theming" },
};

const darkScript = `(function () {
  try {
    var stored = localStorage.getItem("theme");
    var dark =
      stored === "dark" ||
      ((!stored || stored === "system") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
  } catch (error) {
    // Storage can be blocked. Fall back to the light theme.
  }
})();`;

export default function ThemingPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <PageHeader
          eyebrow="Getting started"
          title="Theming"
          description="One CSS file owns color, geometry, and base element styles. Components read semantic roles, never raw swatches."
        />
        <Breadcrumbs items={[{ label: "Docs", href: "/docs" }, { label: "Theming" }]} />
      </div>

      <div className="prose-docs">
        <h2>How the theme is structured</h2>
        <p>
          <code>styles/aback.css</code> contains three things: an{" "}
          <code>@theme inline</code> map that turns CSS variables into Tailwind utilities, a{" "}
          <code>:root</code> block with the light values, and a <code>.dark</code> block with the
          dark values. There are no component-level palettes.
        </p>
        <CodeBlock
          language="css"
          filename="styles/aback.css"
          code={`@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-brand-fill: var(--brand-fill);
  /* ... */
}

:root {
  --background: #ffffff;
  --foreground: #0a0a0a;
  --brand-fill: #005d95;
}

.dark {
  --background: #0a0a0a;
  --foreground: #fafafa;
  --brand-fill: #33b7ff;
}`}
        />

        <h2>Semantic roles, not swatches</h2>
        <p>
          Build with the role, not the hex. A card uses <code>bg-card</code>, a link uses{" "}
          <code>text-link</code>, and a brand icon uses <code>text-brand-icon</code>. That is what
          allows light and dark to stay correct without a second component.
        </p>
        <ul>
          <li>
            <code>primary</code> is neutral ink, not Aback Blue. The default Button is an ink
            button.
          </li>
          <li>
            <code>brand-fill</code> is the filled Aback Blue action. It is reserved for brand
            actions, not every button.
          </li>
          <li>
            <code>link</code> is the accessible text link color, using the 700 step in light and
            the 400 step in dark.
          </li>
          <li>
            <code>separator</code> is page chrome only. Control outlines use{" "}
            <code>border-input</code> and content dividers use <code>border-border</code>.
          </li>
        </ul>

        <h2>Dark mode</h2>
        <p>
          Dark mode is the <code>dark</code> class on <code>&lt;html&gt;</code>. Store the
          preference under <code>theme</code> with the values <code>light</code>,{" "}
          <code>dark</code>, or <code>system</code>. Run a small inline script before first paint
          so the correct theme is applied without a flash:
        </p>
        <CodeBlock language="html" filename="app/layout.tsx" code={darkScript} />
        <p>
          The docs site uses exactly this script. The toggle writes the preference and updates the
          class. Respect the operating system when the preference is missing or set to{" "}
          <code>system</code>.
        </p>

        <h2>Safe overrides</h2>
        <p>
          Override semantic variables, not individual component classes. Keep the relationship
          between a surface and its text, and re-check contrast after any change.
        </p>
        <CodeBlock
          language="css"
          filename="app/globals.css"
          code={`:root {
  --brand-fill: #6d28d9;
  --on-brand-fill: #ffffff;
  --link: #5b21b6;
  --focus-ring: #7c3aed;
}

.dark {
  --brand-fill: #c4b5fd;
  --on-brand-fill: #1e1b4b;
  --link: #c4b5fd;
  --focus-ring: #a78bfa;
}`}
        />
        <p>
          The example above is illustrative, not a recommendation. If you replace the brand ramp,
          verify text contrast at AA or better, keep the focus ring at 3:1 against adjacent colors,
          and check every status surface.
        </p>

        <h2>Shape and motion</h2>
        <p>
          Every radius token is zero. This is the most recognizable part of the brand, not an
          accident. The theme also stops non-essential animation under{" "}
          <code>prefers-reduced-motion</code>, and components use color or transform transitions
          only.
        </p>

        <h2>What not to do</h2>
        <ul>
          <li>Do not add a second palette inside a component.</li>
          <li>Do not hardcode a brand hex in component classes.</li>
          <li>Do not put white text on the 500 brand step. It fails AA.</li>
          <li>Do not apply opacity to readable text. Use the muted text token instead.</li>
          <li>Do not add rounded corners, gradient buttons, or colored shadows.</li>
        </ul>
      </div>
    </div>
  );
}
