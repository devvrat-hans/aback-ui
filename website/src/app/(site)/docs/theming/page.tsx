import type { Metadata } from "next";
import Link from "next/link";

import { Code } from "@/components/code";
import { DocsPage, DocsPageHeader, DocsSection, type TocItem } from "@/components/docs-page";
import { Callout, GuidePager } from "@/components/docs-ui";

export const metadata: Metadata = {
  title: "Theming",
  description:
    "How the Aback theme works: semantic CSS variables for light and dark, the brand roles, and how to override them safely.",
  alternates: { canonical: "/docs/theming" },
};

const toc: TocItem[] = [
  { id: "how-it-works", title: "How it works" },
  { id: "colour-roles", title: "Colour roles" },
  { id: "customize", title: "Customize the theme" },
  { id: "rules", title: "Rules that keep it working" },
];

// Each swatch is painted with the live variable, so it follows the theme
// switch in the header.
const roles = [
  { group: "Surfaces", items: [
    { name: "background", utility: "bg-background", use: "The page canvas." },
    { name: "card", utility: "bg-card", use: "Cards, panels, and popovers." },
    { name: "muted", utility: "bg-muted", use: "Quiet fills: table headers, code, hover rows." },
  ] },
  { group: "Text", items: [
    { name: "foreground", utility: "text-foreground", use: "Body text and headings." },
    { name: "muted-foreground", utility: "text-muted-foreground", use: "Secondary text. The lowest readable tier." },
    { name: "link", utility: "text-link", use: "Text links and selected navigation." },
  ] },
  { group: "Actions", items: [
    { name: "primary", utility: "bg-primary", use: "The default button. Neutral ink, not blue." },
    { name: "brand-fill", utility: "bg-brand-fill", use: "Brand buttons and step markers." },
    { name: "destructive", utility: "bg-destructive", use: "Delete and other irreversible actions." },
  ] },
  { group: "Lines and focus", items: [
    { name: "border", utility: "border-border", use: "Cards, dividers, and table rules." },
    { name: "input", utility: "border-input", use: "Text fields, selects, and checkboxes." },
    { name: "focus-ring", utility: "ring-focus-ring", use: "The keyboard focus indicator." },
  ] },
] as const;

export default function ThemingPage() {
  return (
    <DocsPage toc={toc}>
      <DocsPageHeader
        eyebrow="Foundations"
        title="Theming"
        description="Components never use a raw colour. They read semantic roles from CSS variables, so the whole interface follows light, dark, and your overrides from one file."
        crumbs={[{ label: "Docs", href: "/docs" }, { label: "Theming" }]}
      />

      <div className="mt-10 flex flex-col gap-14">
        <DocsSection id="how-it-works" title="How it works">
          <div className="prose-docs">
            <p>
              The theme is one stylesheet. <code>aback-ui init</code> writes it to{" "}
              <code>styles/aback.css</code>; the npm package ships the same file as{" "}
              <code>@aback-ui/tokens/tokens.css</code>. It holds three things:
            </p>
            <ol>
              <li>
                An <code>@theme inline</code> block that turns each variable into Tailwind
                utilities, so <code>--card</code> becomes <code>bg-card</code>.
              </li>
              <li>A <code>:root</code> block with the light values.</li>
              <li>
                A <code>.dark</code> block with the dark values, used when <code>&lt;html&gt;</code> has
                the <code>dark</code> class. See <Link href="/docs/dark-mode">Dark mode</Link>.
              </li>
            </ol>
          </div>
          <Code
            language="css"
            filename="styles/aback.css"
            code={`@theme inline {
  --color-background: var(--background);
  --color-card: var(--card);
  --color-link: var(--link);
  /* one line per role */
}

:root {
  --background: #ffffff;
  --card: #ffffff;
  --link: #005d95;
}

.dark {
  --background: #0a0a0a;
  --card: #171717;
  --link: #33b7ff;
}`}
          />
        </DocsSection>

        <DocsSection
          id="colour-roles"
          title="Colour roles"
          description="Build with the role, not the hex. The swatches below use the live variables; switch the theme in the header to see both sets."
        >
          <div className="grid gap-6 lg:grid-cols-2">
            {roles.map((group) => (
              <div key={group.group} className="flex flex-col gap-2">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{group.group}</h3>
                <ul className="divide-y divide-border border border-border">
                  {group.items.map((role) => (
                    <li key={role.name} className="flex items-center gap-4 p-3">
                      <span
                        aria-hidden="true"
                        className="size-10 shrink-0 border border-border"
                        style={{ background: `var(--${role.name})` }}
                      />
                      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className="flex flex-wrap items-baseline justify-between gap-x-3">
                          <code className="font-mono text-sm font-semibold text-foreground">{role.utility}</code>
                          <code className="font-mono text-xs text-muted-foreground">--{role.name}</code>
                        </span>
                        <span className="text-sm text-muted-foreground">{role.use}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="max-w-[68ch] text-sm leading-relaxed text-muted-foreground">
            Status colours, the full Aback Blue ramp, and every hex value are on the{" "}
            <Link href="/docs/tokens" className="font-medium text-link underline underline-offset-4">
              Design tokens
            </Link>{" "}
            page.
          </p>
        </DocsSection>

        <DocsSection
          id="customize"
          title="Customize the theme"
          description="Override variables after the theme import. Every component that reads the role changes with it."
        >
          <Code
            language="css"
            filename="app/globals.css"
            code={`@import "tailwindcss";
@import "../styles/aback.css";

/* Your brand, replacing Aback Blue */
:root {
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
          <Callout type="warning" title="Check contrast after every override">
            Body text and links need 4.5:1 against their background, and the focus ring needs 3:1
            against what surrounds it. Change light and dark together, then check every status
            surface.
          </Callout>
          <div className="prose-docs">
            <p>
              With the CLI, you can also edit <code>styles/aback.css</code> directly: it is your
              file. Overriding in your own stylesheet keeps the change obvious when you compare
              against a newer theme with <code>aback-ui diff theme</code>.
            </p>
          </div>
        </DocsSection>

        <DocsSection id="rules" title="Rules that keep it working">
          <ul className="grid gap-px border border-border bg-border sm:grid-cols-2">
            {[
              ["Use roles in components", "Write bg-card and text-link, never a hex value or bg-blue-600."],
              ["Keep primary neutral", "The default button is ink. Brand blue is for brand actions, links, and selection."],
              ["No opacity on text", "Faded text fails contrast. Use text-muted-foreground instead."],
              ["Square corners", "Every radius is zero. Do not add rounded corners or gradient buttons."],
            ].map(([title, body]) => (
              <li key={title} className="flex flex-col gap-1 bg-card p-4">
                <span className="text-sm font-semibold text-foreground">{title}</span>
                <span className="text-sm leading-relaxed text-muted-foreground">{body}</span>
              </li>
            ))}
          </ul>
        </DocsSection>

        <GuidePager href="/docs/theming" />
      </div>
    </DocsPage>
  );
}
