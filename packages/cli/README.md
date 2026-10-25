# aback-ui

The Aback UI command line. It sets up a React project and copies accessible components and blocks into it as source you own.

```bash
# Set up the project once
npx aback-ui@latest init

# Add components or blocks by name
npx aback-ui@latest add button dialog
npx aback-ui@latest add sign-in
```

Every component's source ships inside this package. Installing never downloads code from a website, and the files always match the CLI version you ran. Your package manager still installs npm dependencies such as Radix UI.

Requirements: Node.js 20.9 or newer, a React 19 project, Tailwind CSS v4, and a `@/` path alias.

Documentation: [abackui.com/docs/cli](https://abackui.com/docs/cli)

## Commands

| Command | What it does |
| --- | --- |
| `init` | Checks for Tailwind v4, finds the stylesheet and path alias, writes `aback-ui.json`, `styles/aback.css`, and `lib/utils.ts`, imports the theme, and installs `clsx` and `tailwind-merge`. |
| `add <items...>` | Resolves each item and the items it builds on, writes the files in dependency order, and installs the npm packages they import. |
| `diff [items...]` | Prints a line diff for each installed file that differs from this version. Never writes. `--all` checks every installed component and block. |
| `doctor` | Checks the setup without writing: Node, framework, Tailwind, config, aliases, utilities, stylesheet, theme, registry, installed files, and lockfiles. Exits non-zero on errors. |
| `list [query]` | Lists installable items, grouped by category. |
| `view <item>` | Shows an item's description, dependencies, and file targets. |

## Options

| Option | Effect |
| --- | --- |
| `--yes`, `-y` | Accept defaults. Existing files are kept. |
| `--overwrite` | Replace existing files without asking. |
| `--no-overwrite` | Keep every existing file. |
| `--dry-run` | Print the plan without writing or installing. |
| `--no-install` | Write files but skip the package manager. |
| `--cwd <dir>` | Project directory. Defaults to the current directory. |
| `--css <file>` | The global stylesheet for `init`, when it cannot be found. |
| `--force` | Let `init` rewrite an existing `aback-ui.json`. |
| `--registry <url>` | Install from a mirror or a local directory. Also `ABACK_UI_REGISTRY`. |
| `--json` | Machine-readable output for `diff`, `doctor`, `list`, and `view`. |
| `--all` | With `diff`: compare every installed item. |

## Safety

- Install targets must stay inside the project. Absolute paths and `..` segments are rejected before anything is written.
- Existing files are compared by content. Identical files are left alone; a different file needs confirmation, `--overwrite`, or `--no-overwrite`.
- No registry file is executed. The CLI writes files and hands dependency installation to the project's package manager.
- `--dry-run` performs no writes and no installs.

## Configuration

`init` writes `aback-ui.json` ([schema](https://abackui.com/schema/aback-ui.json)):

```json
{
  "$schema": "https://abackui.com/schema/aback-ui.json",
  "style": "aback",
  "rsc": true,
  "tsx": true,
  "tailwind": { "css": "app/globals.css" },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "registries": { "@aback": "https://abackui.com/r/{name}.json" }
}
```

The standard `@aback` entry means the registry bundled with the CLI. Any other template is used as a mirror.

## Development

From the repository root:

```bash
bun run build:registry   # regenerate the registry
bun run build:cli        # compile and bundle it into packages/cli/registry
node packages/cli/dist/index.js --help
```
