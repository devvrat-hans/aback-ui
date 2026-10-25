# @aback-ui/ui

Accessible, square-cornered React components for the Aback design system: 57 components, from Button and Dialog to Dropzone, Rating, Stat, Steps, and Table of Contents.

- Documentation and live previews: [abackui.com](https://abackui.com)
- Status: pre-1.0. APIs may change before the first stable release.
- Requires React 19 and Tailwind CSS v4.

> This package is built and tested from its packed tarball, but it is **not published to npm yet**. Until the first release, install components with the source-copy registry below.

## Two ways to install

### Copy the source (registry)

You own the file and can edit it.

```bash
npx shadcn@latest add https://abackui.com/r/theme.json
npx shadcn@latest add https://abackui.com/r/button.json
```

```css
@import "tailwindcss";
@import "../styles/aback.css";
```

### Use the package

Take updates with a version bump instead of editing source. Install `@aback-ui/ui` and `@aback-ui/tokens`, then add the theme and point Tailwind at the package:

```css
@import "tailwindcss";
@import "@aback-ui/tokens/tokens.css";
@source "../node_modules/@aback-ui/ui/dist";
```

The `@source` line is required. Tailwind v4 does not scan `node_modules`, so without it the classes the components use are never generated. The path is relative to the stylesheet. The repository's consumer test compiles this exact stylesheet against the packed tarballs and checks both cases.

```tsx
import { Button, CopyButton } from "@aback-ui/ui";

export function SaveBar({ token }: { token: string }) {
  return (
    <div className="flex gap-2">
      <CopyButton value={token} showLabel label="Copy token" />
      <Button>Save changes</Button>
    </div>
  );
}
```

## Dark mode

The theme is light by default; a `dark` class on `<html>` switches it. `ThemeToggle`, `useTheme`, and `ThemeScript` (which applies the stored choice before first paint) ship in this package.

## Components

The live catalogue at [abackui.com/docs/components](https://abackui.com/docs/components) is the authoritative list, with examples, props, keyboard behavior, and accessibility notes for every entry.

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
