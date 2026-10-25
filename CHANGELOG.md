# Changelog

All notable changes are recorded here. The project is pre-1.0; minor versions may include API changes with migration notes.

## 0.2.0 - October 2026

The first release published to npm: `@aback-ui/tokens`, `@aback-ui/ui`, and the `aback-ui` CLI.

### Added

- Sixteen components drawn from patterns in Aback Tools, Aback Launch, and Aback Group, each with behavior tests, an axe check, a live example, API, keyboard, and accessibility notes, and a registry item: Copy Button, Input Group, Dropzone, Rating, Stat and Stat Grid, Description List, Relative Time, Steps, Code Block, Layout (Container, Stack, Group, Grid), Section Heading, Theme Toggle (with `useTheme` and `ThemeScript`), Skip Link, Table of Contents, Reading Progress, and Share Buttons.
- `Badge` gained soft `danger` and `info` variants and a `dot` prop. `AvatarGroup` overlaps avatars and collapses the rest into an announced "+N". Both are additive.
- Twelve blocks: Site header, Site footer, Hero, Feature grid, Pricing, FAQ (with escaped FAQPage structured data), Newsletter signup, Call to action, Cookie consent, Not found, Contact form, and Article layout. Previews live in a separate docs file, so an installed block contains only the pattern.
- Block pages preview each block in a frame at desktop, tablet (768 px), and mobile (375 px) widths, so media queries, sticky headers, and fixed banners behave as they would on a real page. Frames are served from `/view/blocks/{name}` and kept out of search.
- Install commands show npm, pnpm, yarn, and bun; the choice is remembered per browser and every command on the page switches together.
- The component catalogue filters by text and category, with a live result count and an empty state.
- `/llms.txt` and `/llms-full.txt` are generated from the registry and the component docs, replacing a hand-written file that listed 24 components. The full file carries every API, keyboard, and accessibility note.
- The docs site uses the real Aback mark from the product sites, a web app manifest, and app icons.
- Block tests (`bun run test:blocks`): submission, validation, and consent behavior, structured-data escaping, an axe check on every block preview, and a catalogue test that fails when a component lacks a category, example, or API entry.
- The consumer test now compiles a Tailwind v4 stylesheet against the packed packages and proves the `@source` line the npm setup needs.

- `Calendar`, `DatePicker`, and `DateRangePicker`, built on react-day-picker with Aback token styling: single, multiple, and range selection, bounded dates, locale-aware labels via `Intl.DateTimeFormat`, a hidden ISO input for native forms, and and a range flow that stays open until the two ends are chosen. Includes behaviour tests, axe checks, live examples, API/accessibility notes, and registry items.
- `Combobox`, a searchable single-select built from the library's own Popover and Command: filtering by label or hidden keywords, disabled options, check-marked selection, hidden form input, and full keyboard operation. Includes tests, axe checks, an example, documentation, and a registry item.
- `aback-ui doctor`, a read-only project diagnosis with human and `--json` output: Node, framework, Tailwind v4, aback-ui.json, style, path aliases, `cn()` utility, theme import, `styles/aback.css`, registry template, installed components, and lockfile conflicts. Errors exit non-zero; warnings do not.
- `Toast` and `Toaster`, an Aback-themed sonner surface: token-driven status colours, square geometry, tabler icons, a themed close button, and light/dark following. `toast` is re-exported so consumers do not depend on sonner directly. Includes four behaviour tests, the docs example, API/accessibility notes, and a registry item.
- `Dashboard shell` block: persistent sidebar, mobile sheet navigation, top bar, optional search/sign-out, and page header. Navigation is real anchors with `aria-current`; optional controls are omitted rather than rendered dead.
- The documentation search now uses the library's own `Command` component instead of a hand-rolled listbox, giving it cmdk's combobox semantics, filtering, and roving selection.
- `CommandDialog` gained `showCloseButton`, so a search palette can omit the corner close control without hiding the dialog title from assistive technology.
- `aback-ui`, the Aback UI CLI (`npx aback-ui@latest add button`): `init`, `add`, `diff`, `list`, and `view`, with project detection, dependency-graph resolution, dry runs, a guarded overwrite policy, and path-traversal protection.
- Seven components: Alert Dialog, Avatar, Popover, Progress, Radio Group, Sheet, and Toggle Group, each with behavior tests, an axe structural check, a live documentation example, API and accessibility notes, and a validated registry item.
- A CLI documentation page at `/docs/cli`, CLI entries in the docs navigation, sitemap, and the component installation section, plus a component status update for the seven beta items.
- `packages/cli` tests for argument parsing, target safety, registry ordering and cycles, init/add behavior, overwrite protection, dry runs, block installs, and command dispatch.
- Three components: Command (cmdk, with a labelled combobox and a dialog palette), Slider, and ScrollArea, each with tests, docs, and a registry item.
- `registry:block` support in the registry build and CLI, with `components/blocks` install targets, registry-dependency validation for composed imports, and a `registry:block` item type.
- Three components: Pagination (button and link modes, collapsing ranges), Collapsible, and Hover Card, each with tests, docs, and a registry item.
- Three blocks: Users table (search, role filtering, sorting, row actions, empty state, and pagination over a provided member list), Sign in, and Settings section. Each has a live documentation page, catalogue and navigation entries, install commands, customization and accessibility notes, and a sitemap entry. Blocks live at `registry/blocks` so the preview and the installed source are identical.
- `aback-ui diff [items...] --all --json`, which compares installed files with the registry, prints a contextual line diff, and never writes. CI can use the JSON output to detect drift.

### Fixed

- `Calendar` day buttons are now named "Sunday, November 1, 2026" instead of react-day-picker's "Sunday, November 1st, 2026", so each name contains the visible day number (WCAG 2.5.3, Label in Name). Days outside the current month no longer use reduced-opacity text, which fell below 4.5:1. Pass `labels` to override the names.
- `AvatarFallback` initials use ink instead of muted text; muted text on the muted fill measured 4.34:1.
- The `CodeBlock` language label uses ink; muted text on the caption bar measured 4.34:1.
- `TableOfContents` reads the active section from the scroll position once per frame instead of waiting for intersection changes, so a fast scroll that jumps past a section no longer leaves the wrong entry marked. At the bottom of the page the last entry is marked. The props are unchanged.
- Calendar was missing from the catalogue, sidebar, and search because its registry category was spelled "Data display". The registry build now rejects unknown component categories.
- The package README said npm consumers need no Tailwind configuration. Tailwind v4 does not scan `node_modules`; the README and installation guide now document `@source "../node_modules/@aback-ui/ui/dist"`.
- The docs site kept private copies of CopyButton, CodeBlock, ThemeToggle, and ThemeScript. It now uses the library components it documents.
- The dashboard shell preview used metric numbers as headings, skipping a heading level; it now uses Stat tiles.

- A custom or local registry now resolves `https://abackui.com/r/*.json` dependencies against the active registry. Previously a local preview install still reached the production host, which broke offline installs and self-hosted mirrors. Third-party registry URLs are left untouched.

### Changed

- Aback UI installs with its own CLI. Every install command on the site and in the READMEs is `npx aback-ui@latest …`; the shadcn CLI is no longer documented or needed.
  - The CLI package is named `aback-ui` (was `@aback-ui/cli`), so `npx aback-ui` works without a scope.
  - The CLI ships the whole registry inside its npm package and installs from it by default: no code is downloaded from a website, and the files always match the CLI version. `--registry`, `ABACK_UI_REGISTRY`, or a custom `@aback` entry still select a mirror.
  - The project config is `aback-ui.json` (was `components.json`), with a published schema at `abackui.com/schema/aback-ui.json`. Registry items and the index point at `abackui.com/schema/registry-item.json` and `registry.json` instead of shadcn's schemas.
  - The release workflow publishes the CLI after the two library packages, and the consumer test runs `init` and `add` from the packed CLI tarball with the network blocked.
- The repository separates what ships from the website: npm packages in `packages/`, item definitions and block source in `registry/` (a private workspace), and abackui.com in `website/` (was `apps/docs`).
- The documentation is reorganized into Get started, Foundations, Components, Blocks, and Resources, with rewritten Introduction, Installation, CLI, Theming, and Registry format guides, and new npm package, Dark mode, Contributing, and Changelog pages. Guides use numbered steps, callouts, and previous and next links, and component pages show CLI, npm package, and manual install tabs.
- Root `typecheck`, `test`, and `build` now include the CLI; CI builds the CLI binary before the documentation site.
- The documentation site was redesigned:
  - One page width is shared by the header, footer, home page, and docs.
  - The docs sidebar now shows from 768 pixels. Previously there was no navigation between 768 and 1024 pixels.
  - Below 768 pixels, a left drawer carries the same navigation tree, Blocks included.
  - Docs pages gain a sticky "On this page" rail, linkable section headings, and previous and next links.
  - Component pages open with Preview and Code tabs. They also gain an import snippet built from the installed file's exports, Kbd key combinations, and a "Copy as Markdown" action.
  - Block pages render the desktop preview at a true 1280 pixel viewport scaled to the column, start at phone width on small screens, and list the components each block installs.
  - The blocks gallery and the home page show live, inert thumbnails of each block.
  - The home page was rebuilt around a wall of working components.
  - Code samples are highlighted with Shiki at build time; no highlighter ships to the browser.
  - An axe scan of 16 pages in both themes reports no violations.

## 0.1.0 - October 2026

Initial public foundation.

### Added

- Semantic token package with light and dark themes, the Aback Blue ramp, square geometry, status colors, scrollbars, and reduced-motion handling.
- 24 accessible React components: Accordion, Alert, Badge, Breadcrumbs, Button, Card, Checkbox, Dialog, Dropdown Menu, Empty State, Field, Input, Kbd, Label, Page Header, Select, Separator, Skeleton, Spinner, Switch, Table, Tabs, Textarea, and Tooltip.
- A validated source-copy registry with a theme item, shared class utility, and per-component npm and registry dependencies.
- abackui.com documentation app with live previews, copyable install commands, a component catalogue, design token reference, registry guide, accessibility notes, dark mode, and keyboard search.
- Production usage documentation for Aback Tools and Aback Launch.
- Behavior tests for interactive components, axe structural checks, registry validation, and a package export smoke test.

### Added

- npm publishing readiness for `@aback-ui/ui` and `@aback-ui/tokens`: repository, homepage, bugs, author, engines, and `./package.json` export entries, plus a shipped MIT LICENSE and README in each tarball.
- `scripts/verify-publishable.mjs`, wired into `prepublishOnly`. It refuses to publish if an `exports` entry points at a missing file, a `files` entry does not exist, the tarball is empty, the LICENSE is absent, test source or build caches would ship, or the built output contains a localhost URL, a monorepo path, or an absolute developer path.
- `tests/consumer` and `bun run test:consumer`, which pack both packages with `npm pack`, install the tarballs, typecheck the shipped declarations, and render eight component scenarios from the packed entry points.
- `.github/workflows/release.yml`, which re-runs every check on a version tag, verifies the tag matches both package versions, and publishes tokens then UI to npm.

### Fixed

- The UI build wrote `dist/.tsbuildinfo` into the publishable output. The build info file now lives outside `dist`.

### Known limitations

- The npm packages are built, guarded, and verified against packed tarballs, but not published to a registry yet. The release workflow is ready and waits on an `NPM_TOKEN` secret.
- Blocks are not shipped.
- Automated visual regression and manual screen-reader review are not complete.
