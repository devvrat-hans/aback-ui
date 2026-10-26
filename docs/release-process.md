# Release process

Aback UI is pre-1.0. Until the first stable release, minor versions may include API changes; every breaking change needs a migration note.

## Versioning

- The repository follows semantic versioning once 1.0 ships.
- `@aback-ui/ui`, `@aback-ui/tokens`, and `aback-ui` (the CLI) are versioned together: components depend on the theme contract, and the CLI carries a copy of the registry built from the same source.
- Registry identifiers are public contracts. A component may be renamed only with a compatibility item or a documented migration.

## Checklist

1. Confirm the intended branch and a clean working tree.
2. Review the full diff, especially public props, token names, and registry identifiers.
3. Run `bun run typecheck`.
4. Run `bun run lint`.
5. Run `bun run test`.
6. Run `bun run build:ui`, `bun run build:cli`, and `bun run smoke:package`.
7. Run `bun run test:consumer`. This packs the three packages with `npm pack`, installs the tarballs into `tests/consumer`, typechecks the shipped declarations, renders from the packed entry points, and runs `aback-ui init` and `add` from the packed CLI with the network blocked. It is the only check that catches a broken exports map, a dependency that only resolves through a workspace alias, or a CLI shipped without its registry.
8. Run `bun run check:registry`; commit regenerated output if a component changed.
9. Install at least one component from the built registry into a clean fixture app and confirm it renders in light and dark themes.
10. Build the website with `bun run --filter @aback-ui/website build`.
11. Review the changelog and version.
12. Update `docs/component-status.md` and any changed accessibility notes.
13. Publish only through the approved workflow, with credentials supplied by the release environment.
14. Verify the published artifact and the live install command.
15. Record known issues and the rollback procedure.

Do not publish packages, deploy the public site, or push tags without explicit owner authorization.

## Publishing

`bun run build` runs `scripts/verify-publishable.mjs` through each package's `prepublishOnly`. The guard refuses to publish if an entry point in `exports` is missing, a `files` entry does not exist, the tarball is empty, the MIT LICENSE is absent, test source or build caches would ship, or the built output contains a localhost URL, a monorepo path, or an absolute developer path.

Tagged pushes run `.github/workflows/release.yml`. It re-runs every check, then verifies the tag matches the three package versions before publishing to npm. Publish order is tokens, then UI, then the CLI, because UI depends on the theme contract and the CLI carries the registry built from the same source.

The workflow uses npm trusted publishing (OIDC): it declares `id-token: write`, runs Node 24 with npm 11, and stores no npm token. Each package needs a trusted publisher on npmjs.com (package Settings, Trusted Publisher, GitHub Actions) with owner `devvrat-hans`, repository `aback-ui`, and workflow `release.yml`. npm only allows this for packages that already exist, so the first release is published by hand.

## First release

Done for 0.2.0 and 0.2.1 in October 2026, by hand from the owner's npm account. Kept here for reference; none of these steps can be done from the repository alone.

1. Create the free `aback-ui` organization on npmjs.com, so the `@aback-ui/*` scope exists. The unscoped `aback-ui` name is for the CLI.
2. Run `npm login` and keep two-factor authentication on for publishing.
3. Run `bun run check` and `bun run build`.
4. Publish `packages/tokens`, then `packages/ui`, then `packages/cli` with `npm publish --access public` from each directory. Use npm, not `bun publish`, so `prepublishOnly` runs the checks and the publish guard.
5. Add a trusted publisher to each of the three packages, as described above, before the next tagged release. An unused trusted publisher configuration expires after two days.
6. Set `npmPublished: true` in `website/src/data/site.ts` and redeploy the website, so the install pages stop showing the "Not on npm yet" notice.
7. Make the GitHub repository public, so the package `repository` links and the docs' source links resolve and npm can attach provenance.

## Current distribution status

- npm: `@aback-ui/tokens`, `@aback-ui/ui`, and `aback-ui` are published at 0.2.1. `aback-ui@0.2.0` is deprecated, because its `init` failed in new Next.js apps.
- CLI: installs from the registry bundled in its package; `npx aback-ui@latest init` and `add` were verified in a fresh `create-next-app` project against the published 0.2.1.
- Registry: also hosted at https://abackui.com/r for mirrors and tools.
- Site: live at https://abackui.com (also https://aback-ui.aback-projects.workers.dev).
- Trusted publishing: not configured yet. Configure it right before the next tagged release (see "Publishing").

## Deploying the website

The website is a Next.js static export (`output: "export"`) served by a Cloudflare Workers static-assets Worker named `aback-ui`, configured in `website/wrangler.jsonc`. There is no server code; response headers live in `website/public/_headers`.

```bash
bun run deploy:website   # next build, then wrangler deploy
```

Wrangler needs a Cloudflare login (`bunx wrangler login`) with Workers write access to the Aback account. Deploy only with owner authorization.

## Rollback

Registry files are static JSON. Revert the commit that changed `registry/` and `website/public/r`, then redeploy the website and release a CLI patch version, since the CLI carries its own copy. Package rollback uses the previous tagged version; never republish an existing version.
