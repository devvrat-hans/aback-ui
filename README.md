# Aback UI

**The building blocks behind better applications.**

Aback UI is the shared interface foundation for Aback Group products and an open-source React component library for everyone else. It is a design system, a set of accessible components, and a source-copy registry you own after installing.

- **Documentation:** [abackui.com](https://abackui.com)
- **Registry:** `https://abackui.com/r/{component}.json`
- **Status:** pre-1.0. APIs may change before the first stable release.
- **License:** MIT

## What is here

| Path | Purpose |
| --- | --- |
| `apps/docs` | The abackui.com documentation site and live component catalogue |
| `packages/ui` | Canonical React component source |
| `packages/tokens` | The Aback theme: semantic color, type, spacing, and motion tokens |
| `registry/` | Registry item definitions that turn canonical source into installable JSON |
| `apps/docs/public/r` | Generated registry output served at `abackui.com/r/*.json` |
| `docs/` | Architecture, component status, provenance, accessibility, and release notes |
| `scripts/` | Registry build, validation, and package smoke checks |

## Install a component

Aback UI installs by copying source into your project. You own the file and can edit it. [shadcn's CLI](https://ui.shadcn.com/docs/cli) understands the registry format.

```bash
npx shadcn@latest add https://abackui.com/r/button.json
```

Then import the theme once in your global stylesheet:

```css
@import "tailwindcss";
@import "./styles/aback.css";
```

See the [installation guide](https://abackui.com/docs/installation) for the complete setup, or read [`docs/architecture.md`](docs/architecture.md) for how the canonical source and registry fit together.

## Local development

Requires [Bun](https://bun.sh) 1.4 or newer. Every repository script runs on Bun: the registry build, the package build, TypeScript, ESLint, and Vitest. Node.js is only needed by consumers running the shadcn CLI.

```bash
bun install
bun run build:registry   # generate apps/docs/public/r
bun run dev              # http://localhost:3000
```

Full verification before a change is done:

```bash
bun run typecheck
bun run lint
bun run test
bun run check:registry
bun run build
```

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
