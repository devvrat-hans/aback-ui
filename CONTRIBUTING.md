# Contributing to Aback UI

Aback UI exists to make real applications easier to build. Contributions are judged on reuse, clarity, accessibility, and maintainability, not on component count.

## Before you start

1. Read [`AGENTS.md`](AGENTS.md) and [`DESIGN.md`](DESIGN.md).
2. Search the [component catalogue](https://abackui.com/docs/components) and the open issues.
3. Open a proposal for a new component or a public API change. Small fixes can go straight to a pull request.

## Local setup

```bash
bun install
bun run build:registry
bun run dev
```

## Checks

Run these before opening a pull request:

```bash
bun run typecheck
bun run lint
bun run test
bun run check:registry
bun run build
```

`bun run check` runs the first four.

## Adding or changing a component

A component is ready to merge when all of the following are true:

- It solves a repeated interface problem, not a one-off layout.
- The canonical source lives in `packages/ui/src/components`.
- It uses semantic tokens from `packages/tokens`; no raw hex values in chrome.
- It is typed, forwards refs where the DOM pattern expects it, and has sensible defaults.
- It has a documented keyboard model and uses semantic HTML first.
- It passes the tests that cover its behavior, including keyboard and focus where applicable.
- It has a live example in `apps/docs/src/examples`, a documentation entry in `apps/docs/src/data/components.ts`, and a page under `/docs/components`.
- Its registry entry in `registry/registry.json` is valid and generated output is committed.
- It has reviewed provenance and dependency implications.
- Light and dark themes, long content, and a 375px viewport were checked.

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
