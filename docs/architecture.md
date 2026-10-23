# Architecture

## One canonical source

A component exists once, in `packages/ui/src/components`. Every distribution format is derived from it:

```
packages/ui/src/components/button.tsx        canonical source
        │
        ├── packages/ui/dist                  package build (tsc, ESM + types, node-ready extensions)
        ├── registry/registry.json             item metadata (files, deps, targets)
        └── apps/docs                          live previews import the same source
                    │
                    └── scripts/build-registry.mjs
                                │
                                └── apps/docs/public/r/button.json   installable copy
```

The docs site imports `@aback-ui/ui` through a workspace path alias, so a preview cannot drift from the component a consumer installs. The registry build copies the canonical source and rewrites only the `../lib/utils` import to the installed `@/lib/utils` alias. It does not fork or rewrite implementations.

## Boundaries

| Layer | May depend on | Must not depend on |
| --- | --- | --- |
| `@aback-ui/tokens` | Nothing | Components, docs |
| `@aback-ui/ui` | Tokens (CSS contract), Radix, Tabler, utility libraries | Docs, registry, product apps |
| `apps/docs` | UI, tokens, examples | Product apps, private services |
| Registry build | UI source, item metadata | Docs runtime, a live Aback service |

Components contain no Aback product routing, auth, billing, tenant, or data-model logic.

## Registry format

`registry/registry.json` is the source of truth for installable items. Each item declares:

- `name`: public identifier, used in `https://abackui.com/r/{name}.json`
- `type`: `registry:ui`, `registry:lib`, `registry:file`, or `registry:style`
- `files`: `path` relative to the repository root, plus the consumer `target`
- `dependencies`: npm packages the copied file imports
- `registryDependencies`: other registry items required first
- `docs`: documentation URL shown by the CLI

`scripts/build-registry.mjs` inlines file contents and writes the shadcn-compatible JSON to `apps/docs/public/r`. It also validates the registry while building: every file path must exist, every import must have a declared dependency, identifiers and targets must be unique, and the source is scanned for committed secrets. `--check` fails if committed output is stale.

The registry is intentionally independent of the docs app. A copied component works after installation because it imports `@/lib/utils` and declared npm packages, never a monorepo alias or private endpoint.

## Theme distribution

The theme ships as `styles/aback.css`, installed by the `theme` registry item. It contains the `@theme inline` mapping, light and dark semantic values, base element styles, scrollbars, and reduced-motion handling. Consumers import it once after Tailwind. The package equivalent is `@aback-ui/tokens/tokens.css`.

## Why a monorepo

The tokens, components, registry build, and documentation share one release cadence and one source of truth. A monorepo keeps those boundaries explicit without adding an application framework dependency to the component package. There are only two packages because only two have a real independent consumer: the theme and the components.

## Deliberate constraints

- **Copy-source first.** The registry is the supported public install path today. The npm package is built and validated but is not published yet; the docs do not claim otherwise.
- **No Tailwind config requirement.** Components use standard Tailwind utilities plus the published CSS variables. Consumers do not need a specific Tailwind configuration beyond importing the theme.
- **No global side effects.** Importing a component never writes to `document`, installs a listener, or injects a stylesheet.
- **Portals inherit the theme.** Radix portals mount to `body`, where the theme variables already live.
- **Server-compatible.** Components are client components only when they own interaction. Static surfaces render on the server.

## Generated artifacts

| Artifact | Generator | Checked in |
| --- | --- | --- |
| `apps/docs/public/r/*.json` | `scripts/build-registry.mjs` | Yes, so the deployed site and docs work without a build-order dependency |
| `packages/ui/dist` | `tsc` + `scripts/fix-dist-extensions.mjs` | No |
| `apps/docs/.next` | Next.js | No |

CI runs `bun run check:registry` to detect stale registry output.
