# Provenance

Aback UI is built for Aback Group products first, then engineered for reuse. This record covers the origin of the initial source.

## Source review

| Source | What was reviewed | Outcome |
| --- | --- | --- |
| Aback Tools (`abacktools.com`) | `src/components/ui`, `src/components/common`, `src/app/globals.css`, `DESIGN.md` | Patterns and tokens were reviewed, product logic removed, and components reimplemented for a general API. |
| Aback Launch (`abacklaunch.com`) | `src/components/ui`, `src/app/globals.css`, component usage across the launch, blog, and account surfaces | Overlay, alert, data display, and form patterns informed the shared implementations. No auth, billing, or launch-specific code was copied. |

No Aback product's API clients, internal endpoints, tenant or account assumptions, billing rules, analytics payloads, or customer data are part of this repository. Components are independent of Aback product backends.

## Third-party software

| Dependency | License | Use |
| --- | --- | --- |
| React | MIT | Component runtime |
| Radix UI (`radix-ui`) | MIT | Accessible dialog, menu, tooltip, tabs, accordion, checkbox, switch, label, separator, slot primitives |
| Tabler Icons | MIT | Interface icons |
| Tailwind CSS | MIT | Styling primitives |
| class-variance-authority | Apache-2.0 | Variant APIs |
| clsx | MIT | Class composition |
| tailwind-merge | MIT | Class conflict resolution |
| Geist (font) | SIL Open Font License 1.1 | Typeface, self-hosted through the `geist` package |

No third-party component source was copied verbatim. Behavior follows the public WAI-ARIA Authoring Practices and each primitive's documented API.

The Aback mark and Aback Blue color are brand assets of Aback Group. The MIT license covers the code, not the trademarks.

## Additions

Add a row here when a component is adapted from another repository or a third-party source, including the source path, commit or date, license, required notices, and a summary of what changed. Do not publish extracted code while ownership or license is unclear.
