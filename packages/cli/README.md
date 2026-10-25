# @aback-ui/cli

The Aback UI command line. It configures a React project and installs component
source from the [Aback UI registry](https://abackui.com/r).

The registry is also compatible with the shadcn CLI. Use whichever fits your
workflow; both install the same canonical source.

```bash
# Configure the project once
npx @aback-ui/cli init

# Install components or blocks by name
npx @aback-ui/cli add button dialog
npx @aback-ui/cli add sign-in

# Or by URL, or through a named registry from components.json
npx @aback-ui/cli add https://abackui.com/r/table.json
npx @aback-ui/cli add @aback/tooltip
```

## Commands

| Command | What it does |
| --- | --- |
| `init` | Detects Next.js/Vite, Tailwind v4, the stylesheet, and path aliases. Writes `components.json`, the theme at `styles/aback.css`, `lib/utils.ts`, and the stylesheet import. Installs `clsx` and `tailwind-merge`. |
| `add <items...>` | Resolves the item and its registry dependencies, writes source files, and installs declared npm packages. |
| `diff [items...]` | Compares installed files with the registry and prints what a reinstall would change. `--all` covers every UI and block item. |
| `doctor` | Checks the project setup without writing: config, aliases, utilities, stylesheet, theme, Tailwind, registry, and installed files. Exits non-zero on errors. |
| `list [query]` | Lists registry items, grouped by category. `--json` for tooling. |
| `view <item>` | Shows metadata, dependencies, and file targets for one item. |

## Options

| Option | Effect |
| --- | --- |
| `--cwd <dir>` | Project directory. Defaults to the current directory. |
| `--registry <url>` | Registry base URL or a local directory. Also `ABACK_UI_REGISTRY`. |
| `--yes`, `-y` | Accept defaults. Existing files are kept. |
| `--overwrite` | Replace existing files without prompting. |
| `--no-overwrite` | Keep every existing file. |
| `--no-install` | Write files but skip the package manager. |
| `--dry-run` | Print the plan without writing anything. |
| `--json` | Machine-readable output for `diff`, `list`, `view`, and `doctor`. |
| `--all` | Compare every installed UI and block item in `diff`. |

## Safety

- Install targets must stay inside the project. Absolute paths and `..`
  segments are rejected before anything is written.
- Existing files are compared by content. Identical files are left alone; a
  different file needs confirmation, `--overwrite`, or `--no-overwrite`.
- No registry file is executed. The CLI writes files and delegates dependency
  installation to the project's detected package manager.
- `--dry-run` performs no writes and no installs.

## Configuration

`init` writes a shadcn-compatible `components.json`:

```json
{
  "style": "aback",
  "tailwind": { "css": "app/globals.css", "cssVariables": true },
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui",
    "utils": "@/lib/utils"
  },
  "registries": { "@aback": "https://abackui.com/r/{name}.json" }
}
```

Because the file is compatible, the shadcn CLI can install from the same
registry and this CLI can install from any shadcn-compatible registry.

## Development

```bash
bun run build
bun run typecheck
bun run test
node dist/index.js --help

# After installing an item, prove you have the registry version
node dist/index.js diff button --registry apps/docs/public/r
node dist/index.js doctor
```

Run the built CLI against the repository registry without a network:

```bash
node packages/cli/dist/index.js list --registry apps/docs/public/r
node packages/cli/dist/index.js view button --registry apps/docs/public/r
```
