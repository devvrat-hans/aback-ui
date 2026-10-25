# Registry

`registry.json` is the source of truth for installable items, and `blocks/` holds the block source. The build script inlines the canonical source into one JSON file per item at `website/public/r` (schema: `website/public/schema/registry-item.json`). The CLI build then copies those files into `packages/cli/registry`, so the published `aback-ui` package carries every item.

This folder is a private workspace with only the dependencies blocks import. It is never published on its own.

## Build

```bash
bun run build:registry
bun run check:registry
```

`--check` fails when the committed output is stale. `scripts/build-registry.mjs` also validates item names, allowed targets, declared dependencies, unresolved aliases, and possible secrets in source.

For a local end-to-end test, build against a running docs server:

```bash
bun run dev
bun scripts/build-registry.mjs --base-url=http://localhost:3000
```

In a throwaway project, run `node <repo>/packages/cli/dist/index.js add button --registry http://localhost:3000/r`, confirm the files and dependencies, then rebuild without the flag before committing.

## Adding an item

1. Add the canonical component to `packages/ui/src/components`.
2. Add an item to `registry/registry.json` with a `registry:ui` type, target under `components/ui`, npm dependencies, and the full URL to the `utils` item.
3. Add the example, documentation entry, and tests.
4. Run `bun run build:registry` and commit the generated output.

Components must not import product code, private endpoints, or a monorepo alias. The only rewrite the build performs is the local `../lib/utils` import becoming `@/lib/utils`, the path the CLI installs.
