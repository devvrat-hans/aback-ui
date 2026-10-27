import { Code } from "@/components/code";
import { Callout } from "@/components/docs-ui";
import { A, KeyTakeaways } from "@/components/prose";

export const toc = [
  { id: "why-it-flashes", title: "Why does the wrong theme flash?" },
  { id: "blocking-script", title: "The fix: set the class before first paint" },
  { id: "class-strategy", title: "The class strategy and CSS variables" },
  { id: "system-preference", title: "Following the system preference" },
  { id: "hydration-warnings", title: "Avoiding hydration warnings" },
  { id: "toggle", title: "Building the toggle" },
  { id: "alternatives", title: "Other approaches and their trade-offs" },
];

export const faq = [
  {
    question: "Why does my Next.js app flash white before switching to dark mode?",
    answer:
      "The server sends HTML without the dark class because it cannot read localStorage. If the class is added in a useEffect, the browser has already painted the light theme. An inline script in the head that sets the class before the body renders removes the flash.",
  },
  {
    question: "Why do I get a hydration warning on the html element?",
    answer:
      "The inline theme script changes the class attribute on html before React hydrates, so the client DOM no longer matches the server HTML. Add suppressHydrationWarning to the html element. It applies only to that element's own attributes, one level deep.",
  },
  {
    question: "Should dark mode follow prefers-color-scheme by default?",
    answer:
      "Usually yes. Treat 'system' as the default choice, resolve it with matchMedia('(prefers-color-scheme: dark)'), and only store an explicit light or dark choice when the visitor makes one.",
  },
  {
    question: "Can I avoid the inline script entirely?",
    answer:
      "If you only follow the system setting, CSS media queries alone avoid the flash. If you store the choice in a cookie, the server can render the right class, but the page then depends on per-request rendering. A stored client-side choice needs the inline script.",
  },
];

export default function Post() {
  return (
    <>
      <p>
        The wrong theme flashes because the page is painted before your JavaScript reads the stored
        preference. Fix it with a small inline script in <code>&lt;head&gt;</code> that reads the
        preference and sets a <code>dark</code> class on <code>&lt;html&gt;</code> before the body
        renders, then add <code>suppressHydrationWarning</code> to <code>&lt;html&gt;</code> so
        React accepts the changed class.
      </p>

      <KeyTakeaways
        items={[
          "Effects run after paint, so a theme applied in useEffect always arrives too late.",
          <>
            A synchronous inline script in <code>&lt;head&gt;</code> runs before the body is
            painted.
          </>,
          <>
            Put the theme on one class and drive every colour from CSS variables, so the class is the
            only thing the script must set.
          </>,
          <>
            Store <code>light</code>, <code>dark</code>, or <code>system</code>, and resolve{" "}
            <code>system</code> with <code>prefers-color-scheme</code>.
          </>,
          "Never render theme-dependent markup on the server; let CSS decide what is visible.",
        ]}
      />

      <h2 id="why-it-flashes">Why does the wrong theme flash?</h2>
      <p>
        With server rendering or static generation, the HTML is produced without access to the
        visitor&apos;s browser. The server cannot read <code>localStorage</code>, so it renders the
        default theme. A typical first attempt looks like this:
      </p>
      <Code
        language="tsx"
        code={`"use client";
import { useEffect } from "react";

export function ThemeLoader() {
  useEffect(() => {
    // Too late: the page has already been painted.
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, []);
  return null;
}`}
      />
      <p>
        The browser receives the HTML, downloads the CSS, and paints the light page. Only then does
        the JavaScript bundle load, React hydrates, and the effect runs. For a visitor who chose dark
        mode, that sequence is a white flash on every full page load. Moving the code to{" "}
        <code>useLayoutEffect</code> does not help, because hydration itself happens after first
        paint.
      </p>

      <h2 id="blocking-script">The fix: set the class before first paint</h2>
      <p>
        A classic <code>&lt;script&gt;</code> without <code>async</code>, <code>defer</code>, or{" "}
        <code>type=&quot;module&quot;</code> blocks HTML parsing while it runs. Placed in{" "}
        <code>&lt;head&gt;</code>, an inline script runs before the browser reaches the body, so the
        class is already on <code>&lt;html&gt;</code> when the first frame is painted. Keep it tiny
        and wrap it in <code>try</code>, because <code>localStorage</code> can throw in some privacy
        modes and sandboxed frames:
      </p>
      <Code
        language="html"
        filename="index.html"
        code={`<script>
  (function () {
    try {
      var stored = localStorage.getItem("theme");
      var dark =
        stored === "dark" ||
        ((!stored || stored === "system") &&
          window.matchMedia("(prefers-color-scheme: dark)").matches);
      document.documentElement.classList.toggle("dark", dark);
    } catch (e) {}
  })();
</script>`}
      />
      <p>
        In a Vite or other single-page app, this goes directly into <code>index.html</code>. In a
        Next.js App Router project, render it from the root layout. Aback UI ships this exact logic
        as the <code>ThemeScript</code> component:
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
      <p>
        Add it with <code>npx aback-ui@latest add theme-toggle</code>, or import it from{" "}
        <code>@aback-ui/ui</code> if you use the package. It accepts a <code>storageKey</code> and a{" "}
        <code>nonce</code> for a Content Security Policy that does not allow unmarked inline scripts.
        The setup is documented in the <A href="/docs/dark-mode">dark mode guide</A>.
      </p>
      <Callout type="note" title="Keep the script small">
        This script blocks rendering, so it should do one thing: set a class. Do not fetch, import
        modules, or read large data in it.
      </Callout>

      <h2 id="class-strategy">The class strategy and CSS variables</h2>
      <p>
        The script can only stay small if the theme is controlled by one switch. Put every colour in
        a CSS variable, give <code>:root</code> the light values and <code>.dark</code> the dark
        values, and have components read the variables:
      </p>
      <Code
        language="css"
        filename="styles/theme.css"
        code={`:root {
  color-scheme: light;
  --background: #ffffff;
  --foreground: #0a0a0a;
}

.dark {
  color-scheme: dark;
  --background: #0a0a0a;
  --foreground: #fafafa;
}

body {
  background-color: var(--background);
  color: var(--foreground);
}`}
      />
      <p>
        The <code>color-scheme</code> property matters too: it tells the browser to draw native form
        controls and scrollbars in the matching scheme, which a variable cannot do. See{" "}
        <A href="https://developer.mozilla.org/en-US/docs/Web/CSS/color-scheme">color-scheme on MDN</A>.
      </p>
      <p>
        Tailwind CSS v4&apos;s <code>dark:</code> variant follows <code>prefers-color-scheme</code> by
        default. To make it follow your class, redefine the variant. The Aback UI theme does it with
        one line:
      </p>
      <Code language="css" code={`@custom-variant dark (&:is(.dark *));`} />
      <p>
        With semantic utilities such as <code>bg-background</code> and <code>text-foreground</code>,
        most components never need a <code>dark:</code> class at all. The full pattern is in{" "}
        <A href="/blog/tailwind-css-v4-design-tokens">Design tokens in Tailwind CSS v4 with @theme</A>.
      </p>

      <h2 id="system-preference">Following the system preference</h2>
      <p>
        Most visitors never touch a theme toggle, so the default should be their operating system
        setting. Store three values rather than two:
      </p>
      <table>
        <thead>
          <tr>
            <th>Stored value</th>
            <th>Meaning</th>
            <th>Resolved theme</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>(nothing)</td>
            <td>No choice made yet</td>
            <td>
              From <code>prefers-color-scheme</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>system</code>
            </td>
            <td>Explicitly follow the OS</td>
            <td>
              From <code>prefers-color-scheme</code>
            </td>
          </tr>
          <tr>
            <td>
              <code>light</code>
            </td>
            <td>Explicit choice</td>
            <td>Light</td>
          </tr>
          <tr>
            <td>
              <code>dark</code>
            </td>
            <td>Explicit choice</td>
            <td>Dark</td>
          </tr>
        </tbody>
      </table>
      <p>
        The inline script handles the first paint. After that, listen for changes so the page follows
        the OS when it switches at sunset, but only while the stored value is <code>system</code>:
      </p>
      <Code
        language="ts"
        code={`const media = window.matchMedia("(prefers-color-scheme: dark)");

media.addEventListener("change", (event) => {
  const stored = localStorage.getItem("theme");
  if (stored && stored !== "system") return;
  document.documentElement.classList.toggle("dark", event.matches);
});`}
      />
      <p>
        Aback UI&apos;s <code>useTheme</code> hook does this while any component using it is mounted.
        It also listens for the <code>storage</code> event, so a change in one tab is applied in the
        others.
      </p>

      <h2 id="hydration-warnings">Avoiding hydration warnings</h2>
      <p>
        Two separate problems produce hydration warnings in themed apps.
      </p>
      <p>
        <strong>The class on html.</strong> The inline script changes the <code>class</code>{" "}
        attribute before React hydrates, so the DOM no longer matches the server HTML. Adding{" "}
        <code>suppressHydrationWarning</code> to <code>&lt;html&gt;</code> tells React to accept the
        difference. As the{" "}
        <A href="https://react.dev/reference/react-dom/components/common">React documentation</A>{" "}
        notes, it only works one level deep: it covers that element&apos;s attributes, not mismatches
        in its children.
      </p>
      <p>
        <strong>Theme-dependent rendering.</strong> If a component renders a sun icon when the theme
        is dark and a moon when it is light, the server picks one and the client may pick the other.
        Avoid the branch in JavaScript and let CSS choose:
      </p>
      <Code
        language="tsx"
        code={`<button type="button" aria-label="Toggle theme">
  <MoonIcon aria-hidden="true" className="dark:hidden" />
  <SunIcon aria-hidden="true" className="hidden dark:block" />
</button>`}
      />
      <p>
        Both icons are in the server HTML, and the <code>dark</code> class set by the script decides
        which one is visible, so the toggle is correct before hydration. If you need the theme as a
        value in JavaScript, read it with <code>useSyncExternalStore</code> and give it a stable
        server snapshot. <code>useTheme</code> returns <code>light</code> as{" "}
        <code>resolvedTheme</code> during the server render, so use that value only for things that
        can update after hydration.
      </p>

      <h2 id="toggle">Building the toggle</h2>
      <p>A theme toggle is a small control with a few accessibility requirements:</p>
      <ul>
        <li>
          It is a <code>&lt;button type=&quot;button&quot;&gt;</code>, not a clickable{" "}
          <code>div</code>.
        </li>
        <li>
          An icon-only button needs an accessible name. A name that says what will happen, such as
          &quot;Switch to dark theme&quot;, is clearer than a bare &quot;Theme&quot;.
        </li>
        <li>The icons are decorative, so they carry <code>aria-hidden</code>.</li>
        <li>
          The focus indicator must be visible in both themes. Check it with the{" "}
          <A href="/tools/contrast-checker">contrast checker</A>; WCAG asks for 3:1 against adjacent
          colours.
        </li>
      </ul>
      <p>
        The <A href="/docs/components/theme-toggle">ThemeToggle component</A> follows these rules and
        lets you rename its labels with <code>toDarkLabel</code> and <code>toLightLabel</code>. For a
        three-way control on a settings page, build your own with <code>useTheme</code>:
      </p>
      <Code
        language="tsx"
        filename="components/theme-select.tsx"
        code={`"use client";

import { useTheme } from "@/components/ui/theme-toggle";

export function ThemeSelect() {
  const { theme, setTheme } = useTheme();
  return (
    <label>
      Theme
      <select value={theme} onChange={(event) => setTheme(event.target.value as typeof theme)}>
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  );
}`}
      />

      <h2 id="alternatives">Other approaches and their trade-offs</h2>
      <table>
        <thead>
          <tr>
            <th>Approach</th>
            <th>Flash-free</th>
            <th>User choice</th>
            <th>Trade-off</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              CSS only (<code>prefers-color-scheme</code>)
            </td>
            <td>Yes</td>
            <td>No</td>
            <td>Visitors cannot override their OS setting</td>
          </tr>
          <tr>
            <td>
              Inline script + <code>localStorage</code>
            </td>
            <td>Yes</td>
            <td>Yes</td>
            <td>
              Needs <code>suppressHydrationWarning</code> and a CSP nonce if your policy requires one
            </td>
          </tr>
          <tr>
            <td>Cookie read on the server</td>
            <td>Yes, for explicit choices</td>
            <td>Yes</td>
            <td>Requires per-request rendering; &quot;system&quot; still needs client detection</td>
          </tr>
          <tr>
            <td>
              Effect after hydration (<code>useEffect</code>)
            </td>
            <td>No</td>
            <td>Yes</td>
            <td>Flashes on every full page load</td>
          </tr>
        </tbody>
      </table>
      <p>
        For a statically generated documentation site or marketing page, the inline script is
        usually the right choice, because it keeps pages cacheable. For an app that already renders
        per request and has a user session, a cookie avoids the script for visitors who made an
        explicit choice.
      </p>
      <h3>How to confirm the flash is gone</h3>
      <p>
        A flash that lasts one frame on a fast machine can last much longer on a slow phone, so test
        under poor conditions rather than trusting your laptop:
      </p>
      <ol>
        <li>Choose dark mode on the site, so the stored value is <code>dark</code>.</li>
        <li>
          In your browser&apos;s developer tools, enable network and CPU throttling and disable the
          cache.
        </li>
        <li>
          Reload a page that is served as static HTML, and watch the first frames. A performance
          recording with screenshots makes a single light frame easy to spot.
        </li>
        <li>
          Repeat with the stored value set to <code>system</code> and the operating system set to
          dark, then again with storage cleared.
        </li>
        <li>Open the console and confirm there is no hydration warning.</li>
      </ol>
      <p>
        If a light frame still appears, check that the script is in <code>&lt;head&gt;</code>, that
        it is not marked <code>async</code> or <code>defer</code>, and that your Content Security
        Policy is not blocking it.
      </p>
      <p>
        Whichever you choose, check both themes for contrast, not just the one you design in. Dark
        themes often fail on muted text and focus rings. The{" "}
        <A href="/blog/wcag-color-contrast-guide">WCAG colour contrast guide</A> covers what to
        check, and the <A href="/themes">theme generator</A> produces light and dark brand roles that
        are contrast-checked as a set.
      </p>
    </>
  );
}
