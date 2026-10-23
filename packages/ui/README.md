# @aback-ui/ui

Accessible, square-cornered React components for the Aback design system.

The supported install path today is the source-copy registry at [abackui.com](https://abackui.com). This package is built and smoke-tested in the repository but is not published to npm yet.

## Registry

```bash
npx shadcn@latest add https://abackui.com/r/theme.json
npx shadcn@latest add https://abackui.com/r/button.json
```

Then import the theme after Tailwind:

```css
@import "tailwindcss";
@import "./styles/aback.css";
```

Only `@aback-ui/tokens/tokens.css` and standard Tailwind classes are required. Consumers do not need a custom Tailwind configuration.

## Components

Accordion, Alert, Badge, Breadcrumbs, Button, Card, Checkbox, Dialog, Dropdown Menu, Empty State, Field, Input, Kbd, Label, Page Header, Select, Separator, Skeleton, Spinner, Switch, Table, Tabs, Textarea, Tooltip.

## Building the package

```bash
bun run build
```

`tsc` emits ESM and declarations into `dist`. A post-build step appends `.js` to relative import specifiers so the output is valid for Node ESM as well as bundlers.

## Boundaries

- `@aback-ui/ui` does not import the docs app, a product app, or any Aback service.
- Interactive components carry `"use client"`; presentational components can render on the server.
- Radix UI supplies the accessible behavior for overlays and form primitives.
- The Aback name, mark, and Aback Blue are trademarks of Aback Group. The MIT license covers the code.

See the [documentation](https://abackui.com/docs) and the repository `AGENTS.md` before changing a public API.
