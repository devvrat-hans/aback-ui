# Release process

Aback UI is pre-1.0. Until the first stable release, minor versions may include API changes; every breaking change needs a migration note.

## Versioning

- The repository follows semantic versioning once 1.0 ships.
- `@aback-ui/ui` and `@aback-ui/tokens` are versioned together because components depend on the theme contract.
- Registry identifiers are public contracts. A component may be renamed only with a compatibility item or a documented migration.

## Checklist

1. Confirm the intended branch and a clean working tree.
2. Review the full diff, especially public props, token names, and registry identifiers.
3. Run `bun run typecheck`.
4. Run `bun run lint`.
5. Run `bun run test`.
6. Run `bun run build:ui` and `bun run smoke:package`.
7. Run `bun run test:consumer`. This packs both packages with `npm pack`, installs the tarballs into `tests/consumer`, typechecks the shipped declarations, and renders from the packed entry points. It is the only check that catches a broken exports map or a dependency that only resolves through a workspace alias.
8. Run `bun run check:registry`; commit regenerated output if a component changed.
9. Install at least one component from the built registry into a clean fixture app and confirm it renders in light and dark themes.
10. Build the docs site with `bun run --filter @aback-ui/docs build`.
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

1. Create the free `aback-ui` organization on npmjs.com, so the `@aback-ui/*` scope exists. As of October 2026, `@aback-ui/ui`, `@aback-ui/tokens`, `@aback-ui/cli`, and the unscoped `aback-ui` are all unclaimed on npm.
2. Add the `NPM_TOKEN` repository secret described above.
3. Make the GitHub repository public, so the package `repository` links and the docs' source links resolve.
4. Deploy `apps/docs` to `abackui.com`, so the registry URLs and install commands work.
5. Push a `v0.2.0` tag (after bumping both package versions) to run the release workflow.
6. Set `npmPublished: true` in `apps/docs/src/data/site.ts`, so the installation guide shows the npm install command.

The CLI (`@aback-ui/cli`) is not in the release workflow yet. Add it once its install command and output paths are reviewed for a public release.

## Current distribution status

- Registry: implemented and validated locally. Public availability depends on deploying `apps/docs`.
- Package: builds, passes the publish guard, and is verified against packed tarballs by `bun run test:consumer`. Not published to a registry yet; the release workflow is ready and waits on an `NPM_TOKEN` secret.
- Site: builds locally. Not deployed.

## Rollback

Registry files are static JSON. Revert the commit that changed `registry/` and `apps/docs/public/r`, then redeploy the docs site. Package rollback uses the previous tagged version; never republish an existing version.
