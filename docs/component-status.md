# Component status

Last reviewed: November 2026.

| Component | Layer | Status | Used in |
| --- | --- | --- | --- |
| Accordion | Navigation | Stable | Aback Tools |
| Alert | Feedback | Stable | Aback Launch |
| Alert Dialog | Overlay | Beta | New shared pattern |
| Avatar | Data display | Beta | Aback Launch |
| Badge | Foundation | Stable | Aback Tools, Aback Launch, Aback Group |
| Breadcrumbs | Navigation | Stable | Aback Tools, Aback Launch |
| Button | Foundation | Stable | Aback Tools, Aback Launch, Aback Group |
| Calendar | Data display | Beta | New shared pattern |
| Card | Foundation | Stable | Aback Tools, Aback Launch, Aback Group |
| Checkbox | Forms | Stable | Aback Tools, Aback Launch |
| Code Block | Data display | Beta | Aback Tools |
| Collapsible | Navigation | Beta | New shared pattern |
| Combobox | Forms | Beta | New shared pattern |
| Command | Overlay | Beta | Aback Launch, Aback Group |
| Copy Button | Foundation | Beta | Aback Tools, Aback Launch |
| Date Picker | Forms | Beta | New shared pattern |
| Description List | Data display | Beta | Aback Tools |
| Dialog | Overlay | Stable | Aback Launch, Aback Group |
| Dropdown Menu | Overlay | Stable | Aback Launch, Aback Group |
| Dropzone | Forms | Beta | Aback Tools |
| Empty State | Application | Stable | Aback Tools, Aback Launch |
| Field | Forms | Stable | Aback Tools, Aback Launch |
| Hover Card | Overlay | Beta | New shared pattern |
| Input | Forms | Stable | Aback Tools, Aback Launch |
| Input Group | Forms | Beta | Aback Tools, Aback Launch |
| Item | Data display | Beta | Aback Tools, Aback Launch |
| Kbd | Foundation | Stable | Aback Tools, Aback Launch |
| Label | Forms | Stable | Aback Tools, Aback Launch |
| Layout | Layout | Beta | Aback Tools, Aback Launch |
| Listbox | Forms | Beta | Aback Launch |
| Meter | Data display | Beta | Aback Tools, Aback Launch |
| Page Header | Application | Stable | Aback Tools, Aback Launch |
| Pagination | Navigation | Beta | New shared pattern |
| Panel | Layout | Beta | Aback Tools |
| Popover | Overlay | Beta | New shared pattern |
| Progress | Feedback | Beta | New shared pattern |
| Prose | Foundation | Beta | Aback Tools, Aback Launch |
| Radio Group | Forms | Beta | New shared pattern |
| Rating | Forms | Beta | Aback Tools, Aback Launch |
| Reading Progress | Feedback | Beta | Aback Tools, Aback Launch |
| Relative Time | Data display | Beta | Aback Tools, Aback Launch |
| Scroll Area | Layout | Beta | New shared pattern |
| Section Heading | Application | Beta | Aback Tools, Aback Launch, Aback Group |
| Select | Forms | Stable | Aback Tools, Aback Launch |
| Separator | Foundation | Stable | Aback Launch, Aback Group |
| Share Buttons | Application | Beta | Aback Tools, Aback Launch |
| Sheet | Overlay | Beta | Aback Tools, Aback Launch, Aback Group |
| Skeleton | Feedback | Stable | Aback Launch |
| Skip Link | Navigation | Beta | Aback Tools, Aback Launch, Aback Group |
| Slider | Forms | Beta | New shared pattern |
| Spinner | Feedback | Stable | Aback Tools, Aback Launch |
| Stat | Data display | Beta | Aback Tools, Aback Launch |
| Steps | Data display | Beta | Aback Launch |
| Switch | Forms | Stable | Aback Tools, Aback Launch |
| Table | Data display | Stable | Aback Launch |
| Table of Contents | Navigation | Beta | Aback Tools, Aback Launch |
| Tabs | Navigation | Stable | New shared pattern |
| Textarea | Forms | Stable | Aback Tools, Aback Launch |
| Theme Toggle | Application | Beta | Aback Tools, Aback Launch, Aback Group |
| Toast | Feedback | Beta | New shared pattern |
| Toggle Group | Forms | Beta | New shared pattern |
| Tooltip | Overlay | Stable | New shared pattern |

## Blocks

| Block | Status | Components | Pattern from |
| --- | --- | --- | --- |
| Article layout | Beta | Avatar, Badge, Breadcrumbs, Collapsible, Reading Progress, Share Buttons, Table Of Contents | Aback Tools, Aback Launch |
| Call to action | Beta | Button | Aback Launch |
| Contact form | Beta | Alert, Button, Field, Input, Select, Spinner, Textarea | Aback Launch |
| Cookie consent | Beta | Button | Aback Launch |
| Dashboard shell | Beta | Avatar, Button, Dropdown Menu, Sheet | New shared pattern |
| FAQ | Beta | Accordion, Section Heading | Aback Tools, Aback Launch, Aback Group |
| Feature grid | Beta | Section Heading | Aback Tools, Aback Launch |
| Hero | Beta | Button | Aback Launch, Aback Group |
| Newsletter signup | Beta | Button, Input Group, Spinner | Aback Tools, Aback Launch |
| Not found | Beta | Badge, Button | Aback Tools, Aback Launch, Aback Group |
| Pricing | Beta | Badge, Button, Section Heading, Toggle Group | Aback Launch |
| Settings section | Beta | Alert Dialog, Button, Card, Field, Input, Label, Switch | New shared pattern |
| Sign in | Beta | Button, Card, Checkbox, Field, Input, Label | New shared pattern |
| Site footer | Beta | None | Aback Tools, Aback Launch, Aback Group |
| Site header | Beta | Button, Kbd, Sheet, Theme Toggle | Aback Tools, Aback Launch, Aback Group |
| Users table | Beta | Avatar, Badge, Button, Dropdown Menu, Empty State, Input, Pagination, Table | New shared pattern |

## Status definitions

- **Experimental:** API or behavior may change; limited validation.
- **Beta:** useful and tested, with known gaps or expected API evolution.
- **Stable:** public API, behavior, docs, tests, theme support, and accessibility notes are maintained under the compatibility policy.
- **Deprecated:** a replacement and removal path are documented.
- **Removed:** no longer shipped; migration guidance remains.

Stable does not mean "audited for every assistive technology." See [`accessibility.md`](accessibility.md) for what was and was not verified.

## Not yet shipped

No placeholder routes or fake catalogue entries are published. Candidate work that has not shipped is tracked in the changelog and repository issues rather than listed as a component: form helpers for schema-validated forms, a data-table block with column visibility, a toast-free page-level error pattern, and primitives no Aback product uses yet (context menu, menubar, navigation menu, resizable panels, carousel, input OTP).

Charts are the largest pattern the products use that Aback UI does not ship. Aback Launch has hand-written bar, line, donut, and horizontal bar charts in its admin area, and Aback Audit draws its own line chart and defines five chart colours locally. A chart set needs chart colour tokens in the theme first, so it is a design decision for the owner rather than a drop-in component.

"Used in" means the pattern exists in that product's source today. It does not mean the product imports Aback UI yet; migrating the products onto these components is the next integration step.

Aback Audit is the first product that imports the published packages (`@aback-ui/ui` and `@aback-ui/tokens` 0.2.2). In November 2026 it imported only Card, Breadcrumbs, and Badge and wrote the rest as class strings, including buttons, alerts, tables, and score bars that the library already covers or now covers with Meter. It is not listed in the "Used in" column or on the Built with page yet.
