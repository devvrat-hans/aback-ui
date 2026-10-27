import { Code } from "@/components/code";
import { Callout } from "@/components/docs-ui";
import { A, KeyTakeaways } from "@/components/prose";

export const toc = [
  { id: "at-a-glance", title: "Aback UI and shadcn/ui at a glance" },
  { id: "what-they-share", title: "What do they have in common?" },
  { id: "design-language", title: "Design language" },
  { id: "install-model", title: "Install model and CLI" },
  { id: "package-option", title: "The npm package option" },
  { id: "primitives-and-scope", title: "Primitives, catalogue, and maturity" },
  { id: "when-shadcn", title: "When is shadcn/ui the better choice?" },
  { id: "when-aback", title: "When is Aback UI the better choice?" },
];

export const faq = [
  {
    question: "Is Aback UI a fork of shadcn/ui?",
    answer:
      "No. Aback UI follows the same copy-the-source idea and builds on Radix UI and Tailwind CSS, but it has its own components, its own design language, its own aback-ui CLI, and its own registry.",
  },
  {
    question: "Can I install Aback UI components with the shadcn CLI?",
    answer:
      "Use the aback-ui CLI: npx aback-ui@latest add <name>. Aback UI does not claim compatibility with the shadcn CLI, and its documentation only covers its own tooling.",
  },
  {
    question: "Are both free and open source?",
    answer:
      "Yes. shadcn/ui is MIT licensed, and Aback UI's code is MIT licensed. The Aback name, mark, and Aback Blue are trademarks of Aback Group.",
  },
  {
    question: "Can I use Aback UI and shadcn/ui in the same project?",
    answer:
      "It is possible but rarely worth it. Both write components into a components/ui folder and both theme through global CSS variables, so file names and theme values can collide. Pick one as the base of each app.",
  },
];

export default function Post() {
  return (
    <>
      <p>
        shadcn/ui and Aback UI both copy accessible React components into your project as source,
        styled with Tailwind CSS. shadcn/ui is the larger, more established, and more flexible
        option, with a much bigger catalogue and ecosystem. Aback UI is smaller and pre-1.0, with a
        fixed square, neutral design language, its own <code>aback-ui</code> CLI, and a versioned
        npm package for teams that would rather update than own the code.
      </p>

      <KeyTakeaways
        items={[
          "Both: components copied as source, Tailwind-based, MIT licensed.",
          "shadcn/ui: larger catalogue, charts, a choice of primitive libraries, a theme and project builder, and a community registry directory.",
          "Aback UI: square corners, neutral-ink actions with Aback Blue as a signal, and an optional @aback-ui/ui npm package.",
          "Aback UI requires React 19, Tailwind CSS v4, and a @/ path alias.",
          "If you want the widest choice and ecosystem, choose shadcn/ui. If the Aback design language fits, or you want a package option, consider Aback UI.",
        ]}
      />

      <h2 id="at-a-glance">Aback UI and shadcn/ui at a glance</h2>
      <p>
        The shadcn/ui details below were observed on ui.shadcn.com at the time of writing (October
        2026). Both projects change quickly, so check the current documentation before deciding.
      </p>
      <table>
        <thead>
          <tr>
            <th>Aspect</th>
            <th>shadcn/ui</th>
            <th>Aback UI</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Install command</td>
            <td>
              <code>npx shadcn add</code>
            </td>
            <td>
              <code>npx aback-ui@latest add</code>
            </td>
          </tr>
          <tr>
            <td>Project config</td>
            <td>
              <code>components.json</code>
            </td>
            <td>
              <code>aback-ui.json</code>
            </td>
          </tr>
          <tr>
            <td>Components as source</td>
            <td>Yes</td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>Versioned npm package</td>
            <td>No; components are distributed as source</td>
            <td>
              Yes, <code>@aback-ui/ui</code> and <code>@aback-ui/tokens</code>
            </td>
          </tr>
          <tr>
            <td>Primitive libraries</td>
            <td>Radix, Base UI, or React Aria variants (Base UI default)</td>
            <td>Radix UI</td>
          </tr>
          <tr>
            <td>Design language</td>
            <td>A themeable starting point</td>
            <td>Fixed: zero radius, neutral ink actions, Aback Blue accents</td>
          </tr>
          <tr>
            <td>Blocks</td>
            <td>Yes</td>
            <td>Yes, 16 at the time of writing</td>
          </tr>
          <tr>
            <td>Charts</td>
            <td>Yes (Recharts)</td>
            <td>No</td>
          </tr>
          <tr>
            <td>Theme tooling</td>
            <td>A /create theme and project builder</td>
            <td>
              A <A href="/themes">theme generator</A> for brand roles
            </td>
          </tr>
          <tr>
            <td>Other docs</td>
            <td>Community registry directory, MCP server, RTL, forms guides</td>
            <td>
              <A href="/docs/registry">Registry format</A>,{" "}
              <A href="/docs/accessibility">accessibility status</A>
            </td>
          </tr>
          <tr>
            <td>Maturity</td>
            <td>Very widely used</td>
            <td>Pre-1.0, 57 components</td>
          </tr>
          <tr>
            <td>License</td>
            <td>MIT</td>
            <td>MIT</td>
          </tr>
        </tbody>
      </table>

      <h2 id="what-they-share">What do they have in common?</h2>
      <p>
        shadcn/ui, created by shadcn, popularised the idea that a component library can be a set of
        files you own rather than a dependency you import. Aback UI follows that model. In both, a
        CLI reads a registry, writes component source into your project, and installs the npm
        dependencies those files need. After that, the component is your code to change.
      </p>
      <p>
        Both are styled with Tailwind CSS and theme through CSS variables, so a component reads a
        role such as a background or border colour instead of a hard-coded value. If you have used
        one, the other&apos;s file layout will feel familiar. The trade-offs of the copy model itself
        are covered in{" "}
        <A href="/blog/copy-paste-components-vs-npm-package">
          Copy-paste components vs an npm component library
        </A>
        .
      </p>

      <h2 id="design-language">Design language</h2>
      <p>
        This is the clearest difference. shadcn/ui is designed as a starting point that you theme,
        and its /create builder exists to help you shape that starting point into your own look.
      </p>
      <p>
        Aback UI ships one specific design language, the one used across Aback Group products:
      </p>
      <ul>
        <li>
          <strong>Square geometry.</strong> Every radius token resolves to zero, so cards, inputs,
          dialogs, avatars, and switches have square corners. Even a <code>rounded-lg</code> class
          renders square.
        </li>
        <li>
          <strong>Neutral ink actions.</strong> The default button is near-black in light mode and
          near-white in dark mode. Brand colour is not the default fill for every action.
        </li>
        <li>
          <strong>Aback Blue as a signal.</strong> The brand blue, <code>#009bf9</code>, and its ramp
          appear through specific roles: links, focus rings, selection, and an explicit{" "}
          <code>brand</code> button variant.
        </li>
      </ul>
      <Code
        language="tsx"
        code={`import { Button } from "@/components/ui/button";

export function Actions() {
  return (
    <>
      {/* Neutral ink: the default */}
      <Button>Save changes</Button>
      {/* Aback Blue: an explicit, sparing choice */}
      <Button variant="brand">Get started</Button>
    </>
  );
}`}
      />
      <p>
        You can override Aback UI&apos;s colour roles, as the <A href="/docs/theming">theming
        guide</A> shows, and the copied source is yours to edit. But if your product needs rounded,
        soft, or highly customised visuals, you would be working against the system. The tokens are
        listed on the <A href="/docs/tokens">design tokens</A> page and the <A href="/colors">colors</A>{" "}
        page.
      </p>

      <h2 id="install-model">Install model and CLI</h2>
      <p>The everyday commands look similar:</p>
      <Code
        language="bash"
        code={`# shadcn/ui
npx shadcn add button

# Aback UI
npx aback-ui@latest init
npx aback-ui@latest add button`}
      />
      <p>
        Aback UI&apos;s CLI is its own tool with its own registry. Use <code>aback-ui</code> commands
        for Aback UI components; compatibility with the shadcn CLI is not claimed. Its commands are{" "}
        <code>init</code>, <code>add</code>, <code>diff</code>, <code>doctor</code>,{" "}
        <code>list</code>, and <code>view</code>. A few behaviours worth knowing:
      </p>
      <ul>
        <li>
          <strong>The registry ships inside the CLI package.</strong> By default,{" "}
          <code>add</code> does not download component code from a website, and the files always
          match the CLI version. npm dependencies still come from your package manager. A{" "}
          <code>--registry</code> option points it at a mirror or a local build.
        </li>
        <li>
          <strong>Existing files are not overwritten silently.</strong> <code>add</code> asks before
          replacing a file, and <code>--dry-run</code> reports what would change without writing.
        </li>
        <li>
          <strong>Updates are compared, not guessed.</strong> <code>aback-ui diff --all</code>{" "}
          compares every installed component and block with the current registry version.
        </li>
        <li>
          <strong>The setup can be checked.</strong> <code>aback-ui doctor</code> checks the
          Tailwind version, aliases, theme import, and installed files.
        </li>
      </ul>
      <p>
        Aback UI&apos;s requirements are narrower: React 19, Tailwind CSS v4, and a <code>@/</code>{" "}
        path alias. <code>init</code> stops if it finds Tailwind CSS v3. Every command and flag is in
        the <A href="/docs/cli">CLI reference</A>, and setup is in the{" "}
        <A href="/docs/installation">installation guide</A>.
      </p>

      <h2 id="package-option">The npm package option</h2>
      <p>
        shadcn/ui distributes its components as source. Aback UI also publishes the same components as a
        package, for teams that want to update with a version bump:
      </p>
      <Code language="bash" code={`npm install @aback-ui/ui @aback-ui/tokens`} />
      <Code
        language="css"
        filename="app/globals.css"
        code={`@import "tailwindcss";
@import "@aback-ui/tokens/tokens.css";
@source "../node_modules/@aback-ui/ui/dist";`}
      />
      <Code
        language="tsx"
        code={`import { Button, Dialog, DialogContent, DialogTitle } from "@aback-ui/ui";`}
      />
      <p>
        A project can mix both paths: import stable components from the package and copy the ones you
        need to change. Blocks are available through the CLI only. The{" "}
        <A href="/docs/package">package guide</A> covers setup, and the <code>@source</code> line is
        required because Tailwind CSS v4 does not scan <code>node_modules</code>.
      </p>
      <Callout type="note" title="Pre-1.0 means APIs can change">
        At the time of writing (October 2026), Aback UI is pre-1.0. A minor release can change an
        API, and the <A href="/docs/changelog">changelog</A> lists changes with migration notes.
      </Callout>

      <h2 id="primitives-and-scope">Primitives, catalogue, and maturity</h2>
      <p>
        shadcn/ui offers its component documentation in Radix, Base UI, and React Aria variants, with
        Base UI as the default, so you can choose the primitive library that fits your project.
        Aback UI builds its overlays and form primitives on Radix UI only.
      </p>
      <p>
        On scope, shadcn/ui is broader. It has blocks, charts built on Recharts, forms guides, RTL
        documentation, an MCP server page, and a directory of community registries, along with a
        very large user base and the third-party examples and answers that come with it.
      </p>
      <p>
        Aback UI, at the time of writing, has 57 components and 16 blocks, from{" "}
        <A href="/docs/components/button">Button</A> and <A href="/docs/components/dialog">Dialog</A>{" "}
        to <A href="/docs/components/combobox">Combobox</A>,{" "}
        <A href="/docs/components/date-picker">Date Picker</A>, and blocks such as{" "}
        <A href="/docs/blocks/sign-in">sign-in</A> and{" "}
        <A href="/docs/blocks/dashboard-shell">dashboard shell</A>. It has no chart components.
        Its <A href="/docs/accessibility">accessibility page</A> states what has been tested,
        including automated behaviour tests and axe checks, and what has not, such as manual
        screen-reader sessions across NVDA, JAWS, and VoiceOver.
      </p>

      <h2 id="when-shadcn">When is shadcn/ui the better choice?</h2>
      <ul>
        <li>
          <strong>You want your own visual identity.</strong> shadcn/ui is built to be themed into
          your look, and its /create builder helps you do that.
        </li>
        <li>
          <strong>You need breadth.</strong> Charts, a larger catalogue, and community registries
          mean you are less likely to build something yourself.
        </li>
        <li>
          <strong>You want to choose the primitives.</strong> Radix, Base UI, and React Aria
          variants give you options Aback UI does not.
        </li>
        <li>
          <strong>You value ecosystem and maturity.</strong> Wide adoption means more examples,
          more answers to common questions, and more people who already know it.
        </li>
        <li>
          <strong>Your project cannot move to React 19 or Tailwind CSS v4 yet.</strong> Aback UI
          requires both.
        </li>
      </ul>

      <h2 id="when-aback">When is Aback UI the better choice?</h2>
      <ul>
        <li>
          <strong>The design language fits.</strong> If you want square, restrained, neutral
          interfaces with a single brand accent, Aback UI ships that system complete, with tokens for
          both themes.
        </li>
        <li>
          <strong>You want a package option.</strong> Import from <code>@aback-ui/ui</code> and
          update with a version bump, or mix package imports with copied source.
        </li>
        <li>
          <strong>You want installs that do not fetch code from a website.</strong> The registry ships
          inside the CLI package, and a mirror or local registry is one flag away.
        </li>
        <li>
          <strong>You are building Aback Group products.</strong> Aback UI is the shared foundation
          for them.
        </li>
      </ul>
      <p>
        If you are still unsure, try both on a small screen of your real product. Browse the{" "}
        <A href="/docs/components">Aback UI component catalogue</A>, compare it with the shadcn/ui
        documentation, and pick the one whose defaults you would change least.
      </p>
    </>
  );
}
