# Contributing to Aback UI

Aback UI exists to make real applications easier to build. Contributions are judged on reuse, clarity, accessibility, and maintainability, not on component count.

## Before you start

1. Read [`AGENTS.md`](AGENTS.md) and [`DESIGN.md`](DESIGN.md).
2. Search the [component catalogue](https://abackui.com/docs/components) and the open issues.
3. Open a proposal for a new component or a public API change. Small fixes can go straight to a pull request.

## Local setup

```bash
bun install
bun run dev              # the website on http://localhost:3000
bun run build:registry   # regenerate the registry after changing an item
bun run build:cli        # build the CLI with the registry bundled
```

## Where things live

Everything published to npm is in `packages/`: `packages/ui` (`@aback-ui/ui`), `packages/tokens` (`@aback-ui/tokens`), and `packages/cli` (`aback-ui`). `registry/` holds `registry.json` and the block source. `website/` is abackui.com and is never published to npm.

## Checks

Run these before opening a pull request:

```bash
bun run check
bun run build
```

`bun run check` runs typecheck, lint, tests, the registry freshness check, and the consumer test. `bun run test:consumer` packs all three packages with `npm pack`, installs the tarballs into `tests/consumer`, typechecks the shipped declarations, renders from the packed entry points, and runs `aback-ui init` and `add` from the packed CLI with the network blocked, so a broken exports map, a dependency that only resolves through a workspace alias, or a CLI without its registry cannot land.

## Adding or changing a component

A component is ready to merge when all of the following are true:

- It solves a repeated interface problem, not a one-off layout.
- The canonical source lives in `packages/ui/src/components`.
- It uses semantic tokens from `packages/tokens`; no raw hex values in chrome.
- It is typed, forwards refs where the DOM pattern expects it, and has sensible defaults.
- It has a documented keyboard model and uses semantic HTML first.
- It passes the tests that cover its behavior, including keyboard and focus where applicable.
- It has a live example in `website/src/examples` and a documentation entry in `website/src/data/component-docs.ts`. The page under `/docs/components` is generated; `website/src/data/catalog.test.ts` fails if either piece is missing.
- Its registry category is one of the catalogue categories. The registry build rejects anything else.
- Its registry entry in `registry/registry.json` is valid and generated output is committed.
- It has reviewed provenance and dependency implications.
- Light and dark themes, long content, and a 375px viewport were checked.

## Adding or changing a block

- The block source lives at `registry/blocks/{name}.tsx`. It imports installed aliases (`@/components/ui/*`, `@/lib/utils`) and declares each one as a registry dependency.
- Keep example content out of the block file. Put the preview in `website/src/block-previews/previews.tsx` and label example data as example data.
- Blocks own no routing, auth, network calls, or product data. Take callbacks such as `onSubmit` and show the result they return; never claim success on your own.
- Use `useId` for ids so two instances can share a page.
- Add behavior tests to `website/src/block-previews/blocks.test.tsx`. Every preview already gets an axe check.
- Check the preview at all three widths on its docs page.

## Public API changes

Component names, props, CSS variables, token names, registry identifiers, and package paths are public contracts once released.

- Prefer additive changes.
- Do not rename or remove a prop without a migration note.
- Add a changelog entry for anything a consumer can observe.
- Mark experimental work clearly instead of shipping it as stable.

## Commit and pull request

Keep a pull request to one coherent change. Describe the user problem, the approach, the accessibility behavior, and the checks you ran. Include screenshots for visual changes when it helps review.

Do not include secrets, customer data, or copied third-party code without a license review.

## Code of conduct

Be direct, generous, and specific. Critique the work, not the person.
