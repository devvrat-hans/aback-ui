import { Code } from "@/components/code";
import { Callout } from "@/components/docs-ui";
import { A, KeyTakeaways } from "@/components/prose";

export const toc = [
  { id: "what-is-the-difference", title: "What is the difference?" },
  { id: "when-to-copy", title: "When should you copy component source?" },
  { id: "when-to-install", title: "When is an npm package the better choice?" },
  { id: "side-by-side", title: "Ownership, upgrades, and bundle size side by side" },
  { id: "updating-copied-code", title: "How do you update code you copied?" },
  { id: "using-both", title: "Can you use both in one project?" },
  { id: "decision-checklist", title: "A short decision checklist" },
];

export const faq = [
  {
    question: "Are copy-paste components smaller than an npm component library?",
    answer:
      "Not inherently. A tree-shakeable ESM package ships only the components you import, and copied source still depends on the same npm packages, such as Radix UI. The bundle mostly reflects which components you use, not how you installed them.",
  },
  {
    question: "Do copied components ever get updates?",
    answer:
      "Only when you pull them in. With Aback UI, npx aback-ui@latest diff shows how your copy differs from the current registry version, and add asks before replacing a file you already have.",
  },
  {
    question: "Can I mix copied components and package imports?",
    answer:
      "Yes. A common pattern is to copy the few components you need to change and import the rest from the package. Use one theme file, and avoid having two implementations of the same component in the same app.",
  },
  {
    question: "Why does the npm package need a Tailwind @source line?",
    answer:
      "Tailwind CSS v4 does not scan node_modules for class names. The @source directive tells it to scan the package's built files so the classes the components use are generated.",
  },
];

export default function Post() {
  return (
    <>
      <p>
        Copying component source into your project gives you full ownership: you can change any
        line, but you also own every future update. Installing a versioned npm package gives you
        updates with a version bump, but you can only customise what the package exposes. Copy the
        components you expect to change, install the ones you want maintained for you, and know
        that you can combine both.
      </p>

      <KeyTakeaways
        items={[
          "Copied source is your code: edit freely, update deliberately.",
          "A package is someone else's code: update with a version bump, customise through props, classes, and tokens.",
          "Bundle size depends on what you import, not on how you installed it.",
          "Blocks and heavily customised components suit copying; stable primitives used unchanged suit a package.",
          <>
            Aback UI supports both: the <code>aback-ui</code> CLI copies source, and{" "}
            <code>@aback-ui/ui</code> is the same components as a package.
          </>,
        ]}
      />

      <h2 id="what-is-the-difference">What is the difference?</h2>
      <p>
        A traditional React component library is a dependency. You run your package manager, import
        a component, and the implementation lives in <code>node_modules</code>. You never edit it;
        you upgrade it.
      </p>
      <p>
        The copy-paste model, popularised by shadcn/ui, treats components as source you add to your
        repository. A command-line tool reads a registry, writes files such as{" "}
        <code>components/ui/button.tsx</code> into your project, and installs any npm dependencies
        those files need. After that, the file is yours. There is no runtime package for that
        component to upgrade.
      </p>
      <p>
        With Aback UI, the two paths look like this. Copying the source:
      </p>
      <Code
        language="bash"
        code={`npx aback-ui@latest init
npx aback-ui@latest add button dialog`}
      />
      <Code
        language="tsx"
        filename="app/page.tsx"
        code={`import { Button } from "@/components/ui/button";`}
      />
      <p>Installing the package:</p>
      <Code language="bash" code={`npm install @aback-ui/ui @aback-ui/tokens`} />
      <Code
        language="tsx"
        filename="app/page.tsx"
        code={`import { Button } from "@aback-ui/ui";`}
      />
      <p>
        Both give you the same component, built from the same canonical source. The difference is
        who owns the file after installation. The <A href="/docs/installation">installation guide</A>{" "}
        covers the CLI path and the <A href="/docs/package">npm package guide</A> covers the
        package path.
      </p>

      <h2 id="when-to-copy">When should you copy component source?</h2>
      <p>Copying is the better choice when you expect to change the component itself.</p>
      <ul>
        <li>
          <strong>You need to change markup or behaviour.</strong> Adding a slot, changing the DOM
          structure, or wiring in product-specific logic is a one-line edit in your own file. With a
          package you would need a prop that the maintainers anticipated, or a fork.
        </li>
        <li>
          <strong>You are starting from a block.</strong> A sign-in page, a settings section, or a
          dashboard shell is a starting point, not a finished product. You will rename fields, swap
          data sources, and restructure the layout. Aback UI ships{" "}
          <A href="/docs/blocks">blocks</A> such as <A href="/docs/blocks/sign-in">sign-in</A> and{" "}
          <A href="/docs/blocks/settings-section">settings-section</A> through the CLI only, for
          exactly this reason.
        </li>
        <li>
          <strong>You want to read the code you ship.</strong> Source in your repository shows up in
          code review, search, and your editor&apos;s go-to-definition, with nothing hidden behind a
          compiled build.
        </li>
        <li>
          <strong>You do not want upstream changes arriving unannounced.</strong> A copied file only
          changes when you change it.
        </li>
      </ul>
      <p>
        The cost is maintenance. Bug fixes and accessibility improvements upstream do not reach your
        copy until you pull them in, and the more you have edited a file, the more work that merge
        becomes.
      </p>

      <h2 id="when-to-install">When is an npm package the better choice?</h2>
      <p>A package is the better choice when you want the component maintained for you.</p>
      <ul>
        <li>
          <strong>You use the component as designed.</strong> If you only pass props and class
          names, a copied file is code you maintain for no benefit.
        </li>
        <li>
          <strong>You maintain several apps.</strong> One version bump updates every app that
          depends on the package. Keeping a dozen copies of a dialog in sync by hand is the problem a
          shared library exists to solve.
        </li>
        <li>
          <strong>You want a clear upgrade record.</strong> A version number in{" "}
          <code>package.json</code> and a changelog tell you exactly which release you are on. A
          copied file has no version of its own.
        </li>
      </ul>
      <p>
        The cost is flexibility. You customise through the API the package exposes: props, class
        names, CSS variables, and composition. For Aback UI that is a reasonable surface, since the
        components accept <code>className</code> and read their colours from{" "}
        <A href="/docs/theming">semantic CSS variables</A>, but it is still a boundary.
      </p>
      <Callout type="warning" title="One Tailwind detail for packages">
        Tailwind CSS v4 does not scan <code>node_modules</code>. When a package&apos;s components use
        Tailwind classes, you must point Tailwind at the built files with <code>@source</code>, or
        the components render unstyled. Copied source lives in your project, so Tailwind finds it
        automatically.
      </Callout>
      <Code
        language="css"
        filename="app/globals.css"
        code={`@import "tailwindcss";
@import "@aback-ui/tokens/tokens.css";
@source "../node_modules/@aback-ui/ui/dist";`}
      />

      <h2 id="side-by-side">Ownership, upgrades, and bundle size side by side</h2>
      <table>
        <thead>
          <tr>
            <th>Concern</th>
            <th>Copied source</th>
            <th>npm package</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Who owns the code</td>
            <td>You, after installation</td>
            <td>The package maintainers</td>
          </tr>
          <tr>
            <td>Changing markup or behaviour</td>
            <td>Edit the file</td>
            <td>Only through props, classes, tokens, or composition</td>
          </tr>
          <tr>
            <td>Getting fixes</td>
            <td>Compare and merge by hand</td>
            <td>Bump the version</td>
          </tr>
          <tr>
            <td>Knowing what changed</td>
            <td>
              A diff against the registry (<code>aback-ui diff</code>)
            </td>
            <td>The changelog</td>
          </tr>
          <tr>
            <td>Import path</td>
            <td>
              <code>@/components/ui/button</code>
            </td>
            <td>
              <code>@aback-ui/ui</code>
            </td>
          </tr>
          <tr>
            <td>Tailwind setup</td>
            <td>Nothing extra</td>
            <td>
              An <code>@source</code> line for the package
            </td>
          </tr>
          <tr>
            <td>Bundle size</td>
            <td>What you import</td>
            <td>What you import (if the package is tree-shakeable)</td>
          </tr>
        </tbody>
      </table>
      <p>
        Bundle size deserves a closer look, because it is often cited as a reason to copy. A copied
        dialog still imports its primitives from npm, so the dependency weight is the same. A
        package published as ES modules with <code>&quot;sideEffects&quot;: false</code>, as{" "}
        <code>@aback-ui/ui</code> is, lets your bundler drop every component you do not import. In
        both cases you ship roughly what you use. Measure your own build before treating either model
        as the lighter one.
      </p>

      <h2 id="updating-copied-code">How do you update code you copied?</h2>
      <p>
        The usual failure of the copy-paste model is not the first install; it is month six, when
        the upstream component has had three fixes and nobody remembers which local edits were
        intentional. Good tooling makes that comparison explicit.
      </p>
      <p>
        The Aback UI CLI compares your installed files with the current registry version, without
        writing anything:
      </p>
      <Code
        language="bash"
        code={`# One component
npx aback-ui@latest diff button

# Every installed component and block
npx aback-ui@latest diff --all`}
      />
      <p>
        When you decide to take the new version, run <code>add</code> again. The CLI asks before it
        replaces a file that already exists. <code>--dry-run</code> reports what would change without
        writing, and <code>--no-overwrite</code> keeps every existing file. The full list of options
        is in the <A href="/docs/cli">CLI reference</A>.
      </p>
      <Code
        language="bash"
        code={`# See the plan first
npx aback-ui@latest add button --dry-run

# Then apply it, confirming each overwrite
npx aback-ui@latest add button`}
      />
      <p>Two habits make this easier:</p>
      <ol>
        <li>
          <strong>Keep edits small and commented.</strong> A comment explaining why a line differs
          from upstream turns a confusing diff into a quick decision.
        </li>
        <li>
          <strong>Prefer wrapping to editing.</strong> If you only need different defaults, write a{" "}
          <code>SaveButton</code> that renders <code>Button</code> with your props. The copied file
          stays identical to upstream and updates cleanly.
        </li>
      </ol>
      <p>
        For packages, the equivalent step is reading the changelog before a version bump. Aback UI is
        pre-1.0 at the time of writing (October 2026), so a minor release can change an API; the{" "}
        <A href="/docs/changelog">changelog</A> lists changes with migration notes.
      </p>

      <h2 id="using-both">Can you use both in one project?</h2>
      <p>
        Yes, and for many teams it is the best arrangement: import the stable primitives from the
        package, and copy the handful of components and blocks you need to reshape. A few rules keep
        a mixed setup predictable:
      </p>
      <ul>
        <li>
          <strong>Load one theme.</strong> <code>aback-ui init</code> writes{" "}
          <code>styles/aback.css</code>, and the package ships the same theme as{" "}
          <code>@aback-ui/tokens/tokens.css</code>. Import one of them, not both, so there is a
          single place to override <A href="/docs/tokens">tokens</A>.
        </li>
        <li>
          <strong>One implementation per component.</strong> If you copy <code>dialog</code>, import
          it from <code>@/components/ui/dialog</code> everywhere. Two dialogs that look the same but
          behave differently are worse than either model on its own.
        </li>
        <li>
          <strong>Keep the @source line</strong> while anything is still imported from the package.
        </li>
      </ul>

      <h2 id="decision-checklist">A short decision checklist</h2>
      <p>For each component or block, ask:</p>
      <ol>
        <li>Will we change its markup or behaviour, not just its props? Copy it.</li>
        <li>Is it a page-level starting point, such as a sign-in form or dashboard shell? Copy it.</li>
        <li>Do several apps need it to stay identical? Install the package.</li>
        <li>Will we use it exactly as documented? Install the package.</li>
        <li>Unsure? Start with the package. Copying later is one command; un-forking is not.</li>
      </ol>
      <p>
        If you want a broader comparison of tools that use the copy model, see{" "}
        <A href="/blog/aback-ui-vs-shadcn-ui">Aback UI vs shadcn/ui</A>. To try both paths, browse
        the <A href="/docs/components">component catalogue</A>: each component page shows the CLI
        command and, for components in the package, the package import.
      </p>
    </>
  );
}
