# Aback UI

**The building blocks behind better applications.**

Aback UI is the shared interface foundation for Aback Group products and an open-source React component library for everyone else: 57 accessible components, 16 page blocks, one set of design tokens, and its own CLI. Every component started as a pattern in a shipping Aback product: [Aback Tools](https://abacktools.com), [Aback Launch](https://abacklaunch.com), or [Aback Group](https://aback.group).

- **Documentation:** [abackui.com](https://abackui.com)
- **Status:** pre-1.0. APIs may change before the first stable release.
- **License:** MIT

## Use it

Copy components into your project with the `aback-ui` CLI. The files are yours to edit:

```bash
npx aback-ui@latest init
npx aback-ui@latest add button dialog
```

Or install the npm package and import components:

```bash
npm install @aback-ui/ui @aback-ui/tokens
```

```css
@import "tailwindcss";
@import "@aback-ui/tokens/tokens.css";
/* Required: Tailwind v4 does not scan node_modules. */
@source "../node_modules/@aback-ui/ui/dist";
```

```tsx
import { Button } from "@aback-ui/ui";
```

> **Not on npm yet.** `aback-ui`, `@aback-ui/ui`, and `@aback-ui/tokens` are built and tested from their packed tarballs on every check, but the first release has not been published. See [`docs/release-process.md`](docs/release-process.md).

## Repository layout

Everything published to npm lives in `packages/`. The website only consumes it.

| Path | npm | Purpose |
| --- | --- | --- |
| `packages/ui` | `@aback-ui/ui` | Canonical component source and the package built from it |
| `packages/tokens` | `@aback-ui/tokens` | The theme: semantic colour roles, the Aback Blue ramp, geometry |
| `packages/cli` | `aback-ui` | The CLI: `init`, `add`, `diff`, `doctor`, `list`, `view`. Its build bundles the registry |
| `registry/` | not published | `registry.json` (which items exist) and `blocks/` (block source) |
| `website/` | not published | abackui.com: docs, live previews, and the hosted registry at `/r` |
| `tests/consumer` | not published | Installs the packed tarballs into a clean project and uses them |
| `docs/` | not published | Architecture, component status, provenance, accessibility, releases |
| `scripts/` | not published | Registry build and bundling, publish guards, package checks |

## How the CLI gets components

`bun run build:registry` turns `registry/registry.json` and the canonical source into one JSON file per item in `website/public/r`. The CLI build copies those files into the package, so `npx aback-ui add button` installs the source that shipped with that CLI version. It downloads no code from a website and works if abackui.com is unreachable. Mirrors can be used with `--registry`.

## Local development

Requires [Bun](https://bun.sh) 1.4 or newer.

```bash
bun install
bun run dev              # the website on http://localhost:3000
bun run build:registry   # regenerate website/public/r after changing an item
bun run build:cli        # build the CLI with the registry bundled
```

Before a change is done:

```bash
bun run check   # typecheck, lint, tests, registry freshness, packed-package tests
bun run build   # packages, registry, CLI, and the website
```

`bun run test:consumer` is the check that matters for a release. It packs all three packages with `npm pack`, installs the tarballs into `tests/consumer`, typechecks the shipped declarations, renders components from the packed entry points, compiles a Tailwind v4 stylesheet against them, and runs `aback-ui init` and `add` from the packed CLI with the network blocked.

## Design authority

[`DESIGN.md`](DESIGN.md) is the normative design contract: colour roles, the Aback Blue ramp, typography, square geometry, borders, motion, and component specifications. [`AGENTS.md`](AGENTS.md) is the engineering contract. Read both before changing a component.

## Component status

Every component page states its maturity. The maintained catalogue lives in [`docs/component-status.md`](docs/component-status.md).

## Contributing

Read [`CONTRIBUTING.md`](CONTRIBUTING.md). By participating you agree to the [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md). Component proposals need a real repeated use case, a typed API, tests, documentation, accessibility notes, and a provenance review.

## Security

Do not open a public issue for a vulnerability. Email the maintainers at `security@abackgroup.com` with reproduction details.

## Trademarks

The Aback name, the Aback mark, and the Aback Blue colour are trademarks of Aback Group. The MIT license covers the code, not the brand. Do not imply endorsement or use the mark as your own product identity.
