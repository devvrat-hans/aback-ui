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

Tagged pushes run `.github/workflows/release.yml`. It re-runs every check, then verifies the tag matches both package versions before publishing to npm. Publish order is tokens first, then UI, because UI depends on the theme contract.

The workflow needs one repository secret:

| Secret | Purpose |
| --- | --- |
| `NPM_TOKEN` | Automation token with publish rights for the `aback-ui` npm scope. Use a granular token limited to that scope. |

The workflow authenticates to npm with `NODE_AUTH_TOKEN` and declares `id-token: write`, so it also supports trusted publishing if the npm package is configured for it.

## First release prerequisites

These are owner actions; none of them can be done from the repository alone.

1. Create the free `aback-ui` organization on npmjs.com, so the `@aback-ui/*` scope exists, and claim the unscoped `aback-ui` name for the CLI. As of October 2026, `@aback-ui/ui`, `@aback-ui/tokens`, and `aback-ui` were all unclaimed on npm.
2. Add the `NPM_TOKEN` repository secret described above.
3. Make the GitHub repository public, so the package `repository` links and the docs' source links resolve.
4. Point `abackui.com` at the website. It is deployed (see "Deploying the website" below) but only on `aback-ui.aback-projects.workers.dev`, because the `abackui.com` zone is not in the Cloudflare account yet. Add the domain to Cloudflare, then attach it to the `aback-ui` Worker as a custom domain. The CLI does not need the site to install components, but the docs, the schema URLs, and mirrors do.
5. Push a `v0.2.0` tag (after bumping the three package versions and `CLI_VERSION` in `packages/cli/src/help.ts`) to run the release workflow. It publishes `@aback-ui/tokens`, `@aback-ui/ui`, and `aback-ui`, in that order.
6. Set `npmPublished: true` in `website/src/data/site.ts`, so the install pages stop showing the "Not on npm yet" notice.

## Current distribution status

- CLI: builds with the registry bundled, passes the publish guard, and installs components from its packed tarball with the network blocked in `bun run test:consumer`. Not published yet.
- Registry: implemented and validated locally. The hosted copy depends on deploying `website`.
- Package: builds, passes the publish guard, and is verified against packed tarballs by `bun run test:consumer`. Not published to a registry yet; the release workflow is ready and waits on an `NPM_TOKEN` secret.
- Site: deployed to https://aback-ui.aback-projects.workers.dev. Not on `abackui.com` yet.

## Deploying the website

The website is a Next.js static export (`output: "export"`) served by a Cloudflare Workers static-assets Worker named `aback-ui`, configured in `website/wrangler.jsonc`. There is no server code; response headers live in `website/public/_headers`.

```bash
bun run deploy:website   # next build, then wrangler deploy
```

Wrangler needs a Cloudflare login (`bunx wrangler login`) with Workers write access to the Aback account. Deploy only with owner authorization.

## Rollback

Registry files are static JSON. Revert the commit that changed `registry/` and `website/public/r`, then redeploy the website and release a CLI patch version, since the CLI carries its own copy. Package rollback uses the previous tagged version; never republish an existing version.
