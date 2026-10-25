# Aback UI

**The building blocks behind better applications.**

Aback UI is the shared interface foundation for Aback Group products and an open-source React component library for everyone else. It is a design system, 57 accessible components, 16 page blocks, and a source-copy registry you own after installing. Every component started as a pattern in a shipping Aback product: [Aback Tools](https://abacktools.com), [Aback Launch](https://abacklaunch.com), or [Aback Group](https://aback.group).

- **Documentation:** [abackui.com](https://abackui.com)
- **Registry:** `https://abackui.com/r/{component}.json`
- **Status:** pre-1.0. APIs may change before the first stable release.
- **License:** MIT

## What is here

| Path | Purpose |
| --- | --- |
| `apps/docs` | The abackui.com documentation site, live component catalogue, and block sources (`src/blocks`) |
| `packages/ui` | Canonical React component source |
| `packages/tokens` | The Aback theme: semantic color, type, spacing, and motion tokens |
| `packages/cli` | The `@aback-ui/cli` source, with `init`, `add`, `diff`, `doctor`, `list`, and `view` |
| `registry/` | Registry item definitions that turn canonical source into installable JSON |
| `apps/docs/public/r` | Generated registry output served at `abackui.com/r/*.json` |
| `docs/` | Architecture, component status, provenance, accessibility, and release notes |
| `scripts/` | Registry build, validation, and package smoke checks |

## What ships

- **Components (57):** foundation controls, forms (Input Group, Dropzone, Rating, Combobox, Date Picker), overlays, navigation (Table of Contents, Skip Link), feedback, data display (Stat, Description List, Steps, Relative Time, Code Block), layout primitives, and application patterns (Section Heading, Theme Toggle, Share Buttons).
- **Blocks (16):** site header, site footer, hero, feature grid, pricing, FAQ, newsletter signup, call to action, cookie consent, not found, contact form, article layout, sign in, settings section, dashboard shell, and users table.
- **Docs site:** live previews of the real source, block previews at desktop, tablet, and phone widths, npm/pnpm/yarn/bun install commands, a filterable catalogue, keyboard search, dark mode, and generated [`llms.txt`](https://abackui.com/llms.txt) and [`llms-full.txt`](https://abackui.com/llms-full.txt) for AI agents.

## Install a component

Aback UI installs by copying source into your project. You own the file and can edit it. [shadcn's CLI](https://ui.shadcn.com/docs/cli) understands the registry format.

```bash
npx shadcn@latest add https://abackui.com/r/theme.json
npx shadcn@latest add https://abackui.com/r/button.json
```

Then import the theme once in your global stylesheet:

```css
@import "tailwindcss";
@import "./styles/aback.css";
```

## Or use the npm package

`@aback-ui/ui` (components) and `@aback-ui/tokens` (theme) are built from the same source and verified from packed tarballs on every check. **They are not published to npm yet.** Once they are, the setup is:

```css
@import "tailwindcss";
@import "@aback-ui/tokens/tokens.css";
/* Required: Tailwind v4 does not scan node_modules. */
@source "../node_modules/@aback-ui/ui/dist";
```

```tsx
import { Button, CopyButton } from "@aback-ui/ui";
```

The consumer test compiles exactly this stylesheet against the packed package and checks that the component classes are generated, and that they are missing without the `@source` line. See [`docs/release-process.md`](docs/release-process.md) for publishing.

See the [installation guide](https://abackui.com/docs/installation) for the complete setup, or read [`docs/architecture.md`](docs/architecture.md) for how the canonical source and registry fit together.

### First-party CLI

[`packages/cli`](packages/cli) implements `@aback-ui/cli` with project detection, dependency-graph resolution, a dry run, and a guarded overwrite policy. It is built and tested in this repository but **not published to npm yet**, so the site does not advertise a command that would fail. Run it from the workspace:

```bash
bun --filter @aback-ui/cli build
node packages/cli/dist/index.js init
node packages/cli/dist/index.js add button dialog calendar
node packages/cli/dist/index.js diff --all
node packages/cli/dist/index.js doctor
node packages/cli/dist/index.js list
```

It reads and writes the same `components.json` and registry schema as the shadcn CLI, so either client installs identical source.

## Local development

Requires [Bun](https://bun.sh) 1.4 or newer. Every repository script runs on Bun: the registry build, the package build, TypeScript, ESLint, and Vitest. Node.js is only needed by consumers running the shadcn CLI.

```bash
bun install
bun run build:registry   # generate apps/docs/public/r
bun run build:cli        # emit packages/cli/dist
bun run dev              # http://localhost:3000
```

Full verification before a change is done:

```bash
bun run check           # typecheck, lint, test, registry, consumer test
bun run build
```

`bun run test` covers the components (`packages/ui`), the CLI (`packages/cli`), and the blocks and docs catalogue (`apps/docs`).

`bun run test:consumer` is the check that matters for a release. It packs both packages with `npm pack`, installs the tarballs into `tests/consumer`, typechecks the shipped declarations, renders from the packed entry points, and compiles a Tailwind v4 stylesheet against them. That is how a broken exports map, a dependency that only resolves through a workspace alias, or a missing Tailwind source gets caught before it reaches npm.

## Design authority

[`DESIGN.md`](DESIGN.md) is the normative design contract for Aback UI: semantic color roles, the Aback Blue ramp, typography, square-corner geometry, borders, elevation, motion, and component specifications. [`AGENTS.md`](AGENTS.md) is the engineering contract. Read both before changing a component.

## Component status

Every component page states its maturity. The maintained catalogue lives in [`docs/component-status.md`](docs/component-status.md).

## Contributing

Read [`CONTRIBUTING.md`](CONTRIBUTING.md). By participating you agree to the
[`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md). Component proposals need a real repeated use case, a typed API, tests, documentation, accessibility notes, and a provenance review.

## Security

Do not open a public issue for a vulnerability. Email the maintainers at `security@abackgroup.com` with reproduction details.

## Trademarks

The Aback name, the Aback mark, and the Aback Blue color are trademarks of Aback Group. The MIT license covers the code, not the brand. Do not imply endorsement or use the mark as your own product identity.
