# Security

Report a vulnerability privately to `security@abackgroup.com`. Include the affected component or route, reproduction steps, the impact, and any suggested fix. Do not open a public issue for an unpatched vulnerability.

## Scope

Aback UI is a component library, a static registry, and a documentation site. The most relevant risks are:

- Unsafe HTML injection in a component.
- A registry item that writes outside the intended project directory or includes a secret.
- A dependency with a known critical vulnerability.
- A documentation example that encourages an insecure pattern.

## What we do

- The registry build rejects targets outside `components/ui`, `lib`, and `styles`, rejects path traversal, scans for common secret patterns, and requires every import to have a declared dependency.
- Components do not use `eval`, `new Function`, or remote code execution.
- Examples use synthetic data and no credentials.
- Dependency and license implications are reviewed before a component is added.

## Disclosure

We will acknowledge a report, confirm the affected versions, prepare a fix, and credit the reporter unless they ask to remain anonymous. Do not test against production accounts or data you do not own.
