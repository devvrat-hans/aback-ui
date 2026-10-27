import { Code } from "@/components/code";
import { Callout } from "@/components/docs-ui";
import { A, KeyTakeaways } from "@/components/prose";

export const toc = [
  { id: "what-theme-does", title: "What does @theme do in Tailwind CSS v4?" },
  { id: "primitive-vs-semantic", title: "Primitive tokens and semantic tokens" },
  { id: "light-and-dark", title: "Light and dark values with plain CSS variables" },
  { id: "theme-inline", title: "Why semantic tokens need @theme inline" },
  { id: "naming-roles", title: "How to name roles instead of colours" },
  { id: "other-namespaces", title: "Radius, fonts, and other namespaces" },
  { id: "sharing-tokens", title: "Sharing a token layer across projects" },
];

export const faq = [
  {
    question: "What is the difference between @theme and @theme inline in Tailwind CSS v4?",
    answer:
      "With @theme, a utility references the theme variable, for example var(--color-card), which is resolved where that variable is defined. With @theme inline, the utility uses the variable's value directly, for example var(--card), so it resolves on the element that uses the class. Use inline when a theme variable points at another variable that can change, such as a light or dark value.",
  },
  {
    question: "Can I put @theme inside a .dark selector or a media query?",
    answer:
      "No. Tailwind CSS v4 requires @theme at the top level. Define the utilities once with @theme, and switch the underlying values with ordinary CSS variables in :root and .dark blocks.",
  },
  {
    question: "Do I still need tailwind.config.js for design tokens in v4?",
    answer:
      "No. Tailwind CSS v4 is configured in CSS. Theme variables declared with @theme in your stylesheet generate the corresponding utilities.",
  },
  {
    question: "Should token names describe colours or roles?",
    answer:
      "Components should use roles, such as background, foreground, border, link, and destructive. Keep colour names like blue-500 for the primitive palette that roles point at.",
  },
];

export default function Post() {
  return (
    <>
      <p>
        In Tailwind CSS v4, design tokens live in your CSS. Variables declared in an{" "}
        <code>@theme</code> block become utilities, so <code>--color-card</code> gives you{" "}
        <code>bg-card</code>. For a semantic, themeable token layer, point those theme variables at
        ordinary CSS variables with <code>@theme inline</code>, then change the ordinary variables in{" "}
        <code>:root</code> and <code>.dark</code>.
      </p>

      <KeyTakeaways
        items={[
          <>
            <code>@theme</code> turns CSS variables in known namespaces, such as{" "}
            <code>--color-*</code>, into utilities.
          </>,
          <>
            <code>@theme</code> must be top-level, so light and dark values belong in plain{" "}
            <code>:root</code> and <code>.dark</code> blocks.
          </>,
          <>
            Use <code>@theme inline</code> when a theme variable references another variable, so
            the utility resolves where it is used.
          </>,
          "Name tokens after roles (card, link, destructive), not after colours (blue, gray-2).",
        ]}
      />

      <h2 id="what-theme-does">What does @theme do in Tailwind CSS v4?</h2>
      <p>
        Tailwind CSS v4 moved configuration from <code>tailwind.config.js</code> into CSS. A theme
        variable is a CSS custom property declared inside <code>@theme</code>. Its namespace decides
        which utilities Tailwind generates from it:
      </p>
      <Code
        language="css"
        filename="app/globals.css"
        code={`@import "tailwindcss";

@theme {
  --color-brand-500: #009bf9;
  --font-display: "Geist", ui-sans-serif, system-ui, sans-serif;
}`}
      />
      <p>
        <code>--color-brand-500</code> sits in the <code>--color-*</code> namespace, so you can now
        write <code>bg-brand-500</code>, <code>text-brand-500</code>,{" "}
        <code>border-brand-500</code>, and every other colour utility. <code>--font-display</code>{" "}
        gives you <code>font-display</code>. The{" "}
        <A href="https://tailwindcss.com/docs/theme">Tailwind theme variables documentation</A> lists
        every namespace.
      </p>
      <p>
        This is already a token system, but a flat one: a colour called <code>brand-500</code> means
        the same thing in light mode and dark mode, on a card and on a page background. A design
        system needs one more layer.
      </p>

      <h2 id="primitive-vs-semantic">Primitive tokens and semantic tokens</h2>
      <p>Most token systems separate two kinds of value:</p>
      <ul>
        <li>
          <strong>Primitive tokens</strong> are the raw palette: <code>primary-50</code> to{" "}
          <code>primary-950</code>, a grey scale, a type scale. They describe what a value is.
        </li>
        <li>
          <strong>Semantic tokens</strong> are roles: <code>background</code>,{" "}
          <code>foreground</code>, <code>border</code>, <code>link</code>,{" "}
          <code>destructive</code>. They describe what a value is for, and they can resolve to
          different primitives in different themes.
        </li>
      </ul>
      <p>
        Components should only use semantic tokens. A card written as <code>bg-card</code> works in
        both themes; a card written as <code>bg-white dark:bg-neutral-900</code> hardcodes a theme
        decision into every component that repeats it.
      </p>

      <h2 id="light-and-dark">Light and dark values with plain CSS variables</h2>
      <p>
        Tailwind requires <code>@theme</code> at the top level of the stylesheet. You cannot nest it
        inside <code>.dark</code> or a media query. The theme values therefore have to live
        somewhere else: in ordinary CSS variables that you are free to redefine.
      </p>
      <p>
        This is how the Aback UI theme is structured. A trimmed version of{" "}
        <code>tokens.css</code>:
      </p>
      <Code
        language="css"
        filename="styles/aback.css"
        code={`@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-border: var(--border);
  --color-link: var(--link);
  --color-focus-ring: var(--focus-ring);
}

:root {
  color-scheme: light;
  --background: #ffffff;
  --foreground: #0a0a0a;
  --card: #ffffff;
  --border: #e5e5e5;
  --link: #005d95;
  --focus-ring: #007cc7;
}

.dark {
  color-scheme: dark;
  --background: #0a0a0a;
  --foreground: #fafafa;
  --card: #171717;
  --border: rgb(255 255 255 / 0.1);
  --link: #33b7ff;
  --focus-ring: #33b7ff;
}`}
      />
      <p>Three pieces do three jobs:</p>
      <ol>
        <li>
          The <code>@theme inline</code> block registers the utilities: <code>bg-card</code>,{" "}
          <code>text-link</code>, <code>ring-focus-ring</code>.
        </li>
        <li>
          <code>:root</code> holds the light values, and <code>.dark</code> overrides them when the{" "}
          <code>dark</code> class is present.
        </li>
        <li>
          <code>@custom-variant</code> makes Tailwind&apos;s <code>dark:</code> variant follow the
          class instead of the default <code>prefers-color-scheme</code> media query, for the
          occasional case where a component needs a different utility, not just a different value.
        </li>
      </ol>
      <p>
        Because <code>bg-card</code> reads <code>--card</code>, switching the theme changes every
        component at once with no <code>dark:</code> classes in component code. Setting that class
        without a flash on page load is its own problem, covered in{" "}
        <A href="/blog/dark-mode-without-flash-react">Dark mode in React and Next.js without a flash</A>.
      </p>

      <h2 id="theme-inline">Why semantic tokens need @theme inline</h2>
      <p>
        The difference between <code>@theme</code> and <code>@theme inline</code> is where the
        variable is resolved.
      </p>
      <p>
        With plain <code>@theme</code>, Tailwind emits the theme variable and makes the utility
        reference it:
      </p>
      <Code
        language="css"
        code={`/* @theme { --color-card: var(--card); } produces roughly: */
:root { --color-card: var(--card); }
.bg-card { background-color: var(--color-card); }`}
      />
      <p>
        A custom property that references another custom property is resolved on the element where
        it is declared, here <code>:root</code>, and descendants inherit the result. If you redefine{" "}
        <code>--card</code> on a nested element, for example a section with its own theme,{" "}
        <code>bg-card</code> inside it still shows the root value.
      </p>
      <p>With <code>@theme inline</code>, the utility uses the value directly:</p>
      <Code
        language="css"
        code={`/* @theme inline { --color-card: var(--card); } produces roughly: */
.bg-card { background-color: var(--card); }`}
      />
      <p>
        Now <code>var(--card)</code> is resolved on the element that has the class, so any override
        in scope applies. The{" "}
        <A href="https://tailwindcss.com/docs/theme">Tailwind documentation</A> recommends{" "}
        <code>inline</code> for exactly this case: theme variables that reference other variables.
        Static primitives, such as a fixed brand ramp, can live in either block.
      </p>

      <h2 id="naming-roles">How to name roles instead of colours</h2>
      <p>
        A role name should survive a rebrand. <code>link</code> is still correct if the brand moves
        from blue to purple; <code>blue-link</code> is not. A few conventions keep a role set small
        and predictable:
      </p>
      <ul>
        <li>
          <strong>Pair surfaces with their text.</strong> <code>card</code> and{" "}
          <code>card-foreground</code>, <code>primary</code> and <code>primary-foreground</code>.
          Whoever uses one knows which text colour is safe on it.
        </li>
        <li>
          <strong>Separate structure from status.</strong> <code>border</code>, <code>input</code>,
          and <code>ring</code> are structural. <code>success</code>, <code>warning</code>, and{" "}
          <code>danger</code> communicate state.
        </li>
        <li>
          <strong>Give status families a few strengths.</strong> A soft background, a text colour,
          and a strong variant cover most alerts and badges without inventing new names.
        </li>
        <li>
          <strong>Do not let the brand colour become the default.</strong> In Aback UI,{" "}
          <code>primary</code> is neutral ink, and Aback Blue appears through dedicated brand roles.
        </li>
      </ul>
      <table>
        <thead>
          <tr>
            <th>Role</th>
            <th>Utility</th>
            <th>Light</th>
            <th>Dark</th>
            <th>Use</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>--primary</code>
            </td>
            <td>
              <code>bg-primary</code>
            </td>
            <td>#171717</td>
            <td>#e5e5e5</td>
            <td>Default action fill (neutral ink)</td>
          </tr>
          <tr>
            <td>
              <code>--muted-foreground</code>
            </td>
            <td>
              <code>text-muted-foreground</code>
            </td>
            <td>#737373</td>
            <td>#a1a1a1</td>
            <td>Secondary text</td>
          </tr>
          <tr>
            <td>
              <code>--link</code>
            </td>
            <td>
              <code>text-link</code>
            </td>
            <td>#005d95</td>
            <td>#33b7ff</td>
            <td>Links and brand text</td>
          </tr>
          <tr>
            <td>
              <code>--brand-fill</code>
            </td>
            <td>
              <code>bg-brand-fill</code>
            </td>
            <td>#005d95</td>
            <td>#33b7ff</td>
            <td>Explicit brand actions</td>
          </tr>
          <tr>
            <td>
              <code>--focus-ring</code>
            </td>
            <td>
              <code>ring-focus-ring</code>
            </td>
            <td>#007cc7</td>
            <td>#33b7ff</td>
            <td>Keyboard focus indicator</td>
          </tr>
          <tr>
            <td>
              <code>--destructive</code>
            </td>
            <td>
              <code>bg-destructive</code>
            </td>
            <td>#e7000b</td>
            <td>#ff6467</td>
            <td>Destructive actions</td>
          </tr>
        </tbody>
      </table>
      <p>
        The full set, with swatches for both themes, is on the{" "}
        <A href="/docs/tokens">design tokens</A> page and the <A href="/colors">colors</A> page.
        Note that the link role is not the brand anchor <code>#009bf9</code>: that shade has about a
        3:1 contrast ratio on white, too low for body-size text, so the light theme uses the darker
        700 step. <A href="/blog/wcag-color-contrast-guide">WCAG colour contrast for UI developers</A>{" "}
        explains the thresholds.
      </p>

      <h3>Should components get their own tokens?</h3>
      <p>
        It is tempting to add a token per component: <code>--button-bg</code>,{" "}
        <code>--card-border</code>, <code>--dialog-shadow</code>. Each one looks harmless, but the
        set grows with every component, and a rebrand then means updating dozens of values that all
        meant the same thing. Start with roles shared across components, and let a component read
        them directly. Add a component-level token only when a component genuinely needs to diverge
        from the shared role, and point it at a role by default:
      </p>
      <Code
        language="css"
        code={`:root {
  /* Defaults to the shared role; override only when needed */
  --sidebar-background: var(--muted);
}`}
      />
      <p>
        Whatever you name, write it down. A short table of each role, its light and dark values, and
        where it may be used is what lets other developers pick the right token without guessing.
      </p>

      <h2 id="other-namespaces">Radius, fonts, and other namespaces</h2>
      <p>
        Colour is only one namespace. The same approach works for <code>--font-*</code>,{" "}
        <code>--text-*</code>, <code>--spacing</code>, <code>--radius-*</code>,{" "}
        <code>--shadow-*</code>, <code>--breakpoint-*</code>, <code>--ease-*</code>, and{" "}
        <code>--animate-*</code>.
      </p>
      <p>
        Overriding a default namespace is a way to enforce a design decision. Aback UI uses square
        corners, so its theme sets every radius token to zero:
      </p>
      <Code
        language="css"
        code={`@theme inline {
  --radius-sm: 0px;
  --radius-md: 0px;
  --radius-lg: 0px;
  --radius-xl: 0px;
  /* and the remaining steps */
}`}
      />
      <p>
        A <code>rounded-lg</code> pasted from elsewhere now renders square instead of quietly
        breaking the design language. To remove a default namespace entirely, for example
        Tailwind&apos;s built-in colour palette, reset it with <code>--color-*: initial;</code> inside{" "}
        <code>@theme</code> and declare only your own values.
      </p>
      <Callout type="tip" title="Keep tokens deliberate">
        Add a role when a real, repeated need appears, and define its light and dark values together.
        A token created for one screen tends to become a second name for an existing role.
      </Callout>

      <h2 id="sharing-tokens">Sharing a token layer across projects</h2>
      <p>
        Because the whole theme is a stylesheet, sharing it is a matter of shipping one CSS file.
        Aback UI distributes the same theme two ways: <code>npx aback-ui@latest init</code> writes it
        into your project as <code>styles/aback.css</code>, and the{" "}
        <code>@aback-ui/tokens</code> package exports it as <code>tokens.css</code>.
      </p>
      <Code
        language="css"
        filename="app/globals.css"
        code={`@import "tailwindcss";
@import "@aback-ui/tokens/tokens.css";

/* Your overrides come after the import */
:root {
  --link: #5b21b6;
  --focus-ring: #7c3aed;
}
.dark {
  --link: #c4b5fd;
  --focus-ring: #a78bfa;
}`}
      />
      <p>
        Override roles after the import rather than editing the shared file, so the change is easy to
        find when the theme updates. Re-check contrast for every override in both themes. The{" "}
        <A href="/docs/theming">theming guide</A> covers the details, and the{" "}
        <A href="/themes">theme generator</A> builds a full set of brand roles from one colour. If you
        are choosing the values themselves, <A href="/blog/oklch-colors-css-design-systems">OKLCH
        colours in CSS</A> explains how to build an even scale, and the{" "}
        <A href="/tools/tailwind-color-generator">Tailwind colour scale generator</A> exports one as
        a ready-made <code>@theme</code> block.
      </p>
    </>
  );
}
