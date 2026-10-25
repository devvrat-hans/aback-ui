# Architecture

## One canonical source

A component exists once, in `packages/ui/src/components`. Every distribution format is derived from it:

```
packages/ui/src/components/button.tsx        canonical source
        │
        ├── packages/ui/dist                  @aback-ui/ui on npm (tsc, ESM + types)
        ├── website                           live previews import the same source
        └── registry/registry.json             item metadata (files, deps, targets)
                    │
                    └── scripts/build-registry.mjs
                                │
                                └── website/public/r/button.json      item JSON, hosted at abackui.com/r
                                            │
                                            └── scripts/bundle-registry.mjs
                                                        │
                                                        └── packages/cli/registry   shipped inside aback-ui on npm
```

Everything published to npm lives in `packages/`. `registry/` holds item definitions and block source and is never published on its own. `website/` is abackui.com and is never published to npm.

The website imports `@aback-ui/ui` through a workspace path alias, so a preview cannot drift from the component a consumer installs. The registry build copies the canonical source and rewrites only the `../lib/utils` import to the installed `@/lib/utils` alias. It does not fork or rewrite implementations.

## Boundaries

| Layer | May depend on | Must not depend on |
| --- | --- | --- |
| `@aback-ui/tokens` | Nothing | Components, docs |
| `@aback-ui/ui` | Tokens (CSS contract), Radix, Tabler, utility libraries | Docs, registry, product apps |
| `aback-ui` (CLI) | Node.js built-ins, the registry JSON it bundles | UI runtime, website runtime, the network for item source |
| `registry/blocks` | UI components through installed aliases | Website code, product apps |
| `website` | UI, tokens, registry blocks, examples | Product apps, private services |
| Registry build | UI source, item metadata | Docs runtime, a live Aback service |

Components contain no Aback product routing, auth, billing, tenant, or data-model logic.

## Registry format

`registry/registry.json` is the source of truth for installable items. Each item declares:

- `name`: public identifier, used in `https://abackui.com/r/{name}.json`
- `type`: `registry:ui`, `registry:block`, `registry:lib`, `registry:file`, or `registry:style`
- `files`: `path` relative to the repository root, plus the consumer `target`
- `dependencies`: npm packages the copied file imports
- `registryDependencies`: other registry items required first
- `docs`: documentation URL shown by the CLI

`scripts/build-registry.mjs` inlines file contents and writes the item JSON to `website/public/r`, validated against the schemas at `website/public/schema`. It also validates the registry while building: every file path must exist, every import must have a declared npm or registry dependency, identifiers and targets must be unique, and the source is scanned for committed secrets. `--check` fails if committed output is stale.

Blocks live at `registry/blocks`, a small private workspace with exactly the dependencies blocks import. The website imports them for previews through the `@registry/*` alias, so the documentation preview and the installed copy are the same file. A block imports installed aliases (`@/components/ui/*`), declares each one as a registry dependency, and installs into `components/blocks`. A composed component that needs a sibling imports it relatively in canonical source; the registry build rewrites that import to the consumer alias and requires the matching registry dependency.

The CLI build copies the item JSON into the package (`scripts/bundle-registry.mjs`), so `npx aback-ui add` installs the source that shipped with that CLI version, without fetching code from abackui.com. `--registry`, `ABACK_UI_REGISTRY`, or a non-default `@aback` entry in `aback-ui.json` point it at a mirror instead.

The registry is intentionally independent of the website. A copied component works after installation because it imports `@/lib/utils` and declared npm packages, never a monorepo alias or private endpoint.

## Website

The website is a static export (`output: "export"` in `website/next.config.ts`): every route, including `llms.txt`, the sitemap, and the registry JSON, is a file in `website/out`. Cloudflare Workers static assets serves it (`website/wrangler.jsonc`), with headers from `website/public/_headers`.

| Path | Purpose |
| --- | --- |
| `src/app/layout.tsx` | The document only: fonts, `ThemeScript`, metadata. No site chrome. |
| `src/app/(site)/` | Every documentation page, wrapped in the header, footer, and skip link by `(site)/layout.tsx`. |
| `src/app/view/blocks/[slug]` | A chrome-free page per block, loaded in the block page's preview frame. It reports its height to the parent with `postMessage` (same origin only) and is disallowed in `robots.txt`. |
| `src/app/llms.txt`, `src/app/llms-full.txt` | Plain-text indexes generated from the registry summary and the component docs at build time. |
| `src/block-previews/` | Docs-only preview content for each block, and the block behavior tests. The block source itself is in `registry/blocks`. |
| `src/examples/` | One live example per component; the Code tab on its page shows this file's source. |
| `src/components/docs-page.tsx` | The page frame: header with breadcrumbs, linkable sections, the "On this page" rail, and previous and next links. |
| `src/components/code.tsx` | Documentation code samples. Shiki highlights them on the server at build time with both themes as CSS variables, so no highlighter ships to the browser. It is a docs dependency only; the library's `CodeBlock` stays highlighter-free. |
| `src/data/` | Catalogue data. `registry.generated.ts` is written by the registry build. |

The site imports the library through workspace path aliases, including `@/components/ui/*`, `@/lib/utils`, and `@registry/*`, so the docs, the block previews, and the installed copies run the same files. The site has no private copies of library components.

## Theme distribution

The theme ships as `styles/aback.css`, installed by the `theme` registry item. It contains the `@theme inline` mapping, light and dark semantic values, base element styles, scrollbars, and reduced-motion handling. Consumers import it once after Tailwind. The package equivalent is `@aback-ui/tokens/tokens.css`.

## Why a monorepo

The tokens, components, CLI, registry build, and documentation share one release cadence and one source of truth. A monorepo keeps those boundaries explicit without adding an application framework dependency to the component package. There are three packages because each has a real independent consumer: the theme, the components, and the command line.

## Deliberate constraints

- **Copy-source first.** The registry is the supported public install path today. The npm package is built and validated but is not published yet; the docs do not claim otherwise.
- **No Tailwind config requirement.** Components use standard Tailwind utilities plus the published CSS variables. Consumers do not need a specific Tailwind configuration beyond importing the theme.
- **No global side effects.** Importing a component never writes to `document`, installs a listener, or injects a stylesheet.
- **Portals inherit the theme.** Radix portals mount to `body`, where the theme variables already live.
- **Server-compatible.** Components are client components only when they own interaction. Static surfaces render on the server.

## Generated artifacts

| Artifact | Generator | Checked in |
| --- | --- | --- |
| `website/public/r/*.json` | `scripts/build-registry.mjs` | Yes, so the deployed site and docs work without a build-order dependency |
| `packages/cli/registry/*.json` | `scripts/bundle-registry.mjs`, run by the CLI build | No |
| `packages/ui/dist`, `packages/cli/dist` | `tsc` (+ `scripts/fix-dist-extensions.mjs` for UI) | No |
| `website/.next` | Next.js | No |

CI runs `bun run check:registry` to detect stale registry output.
