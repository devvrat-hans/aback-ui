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
7. Run `bun run check:registry`; commit regenerated output if a component changed.
8. Install at least one component from the built registry into a clean fixture app and confirm it renders in light and dark themes.
9. Build the docs site with `bun run --filter @aback-ui/docs build`.
10. Review the changelog and version.
11. Update `docs/component-status.md` and any changed accessibility notes.
12. Publish only through the approved workflow, with credentials supplied by the release environment.
13. Verify the published artifact and the live install command.
14. Record known issues and the rollback procedure.

Do not publish packages, deploy the public site, or push tags without explicit owner authorization.

## Current distribution status

- Registry: implemented and validated locally. Public availability depends on deploying `apps/docs`.
- Package: builds and is smoke-tested in the workspace. Not published to a registry yet.
- Site: builds locally. Not deployed.

## Rollback

Registry files are static JSON. Revert the commit that changed `registry/` and `apps/docs/public/r`, then redeploy the docs site. Package rollback uses the previous tagged version; never republish an existing version.
