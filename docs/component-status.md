# Component status

Last reviewed: October 2026.

| Component | Layer | Status | Used in |
| --- | --- | --- | --- |
| Accordion | Composed | Stable | Aback Tools |
| Alert | Composed | Stable | Aback Launch |
| Badge | Foundation | Stable | Aback Tools, Aback Launch |
| Breadcrumbs | Application | Stable | Aback Tools, Aback Launch |
| Button | Foundation | Stable | Aback Tools, Aback Launch |
| Card | Foundation | Stable | Aback Tools, Aback Launch |
| Checkbox | Foundation | Stable | Aback Tools, Aback Launch |
| Dialog | Overlay | Stable | Aback Launch |
| Dropdown Menu | Overlay | Stable | Aback Launch |
| Empty State | Application | Stable | Aback Tools, Aback Launch |
| Field | Composed | Stable | New shared form pattern |
| Input | Foundation | Stable | Aback Tools, Aback Launch |
| Kbd | Foundation | Stable | Aback Tools, Aback Launch |
| Label | Foundation | Stable | Aback Tools, Aback Launch |
| Page Header | Application | Stable | Aback Tools, Aback Launch |
| Select | Foundation | Stable | Aback Tools, Aback Launch |
| Separator | Foundation | Stable | Aback Launch |
| Skeleton | Foundation | Stable | Aback Launch |
| Spinner | Foundation | Stable | Aback Tools, Aback Launch |
| Switch | Foundation | Stable | Aback Tools, Aback Launch |
| Table | Data display | Stable | Aback Launch |
| Tabs | Composed | Stable | New shared navigation pattern |
| Textarea | Foundation | Stable | Aback Tools, Aback Launch |
| Tooltip | Overlay | Stable | New shared affordance |

## Status definitions

- **Experimental:** API or behavior may change; limited validation.
- **Beta:** useful and tested, with known gaps or expected API evolution.
- **Stable:** public API, behavior, docs, tests, theme support, and accessibility notes are maintained under the compatibility policy.
- **Deprecated:** a replacement and removal path are documented.
- **Removed:** no longer shipped; migration guidance remains.

Stable does not mean "audited for every assistive technology." See [`accessibility.md`](accessibility.md) for what was and was not verified.

## Not yet shipped

Blocks (full settings pages, onboarding flows, dashboard shells) are intentionally deferred until the component layer and registry install path are proven in a real consumer. No placeholder routes or fake catalogue entries are published.
