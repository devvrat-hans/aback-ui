export const CLI_VERSION = "0.1.0";

export const HELP = `Aback UI — the component source registry

Usage
  aback-ui <command> [options]

Commands
  init                 Configure a project, add the theme, and install utilities
  add <items...>       Install component or block source from the registry
  diff [items...]      Compare installed files with the registry (or --all)
  doctor               Check the project setup, theme, aliases, and dependencies
  list [query]         List installable items
  view <item>          Show an item's metadata, dependencies, and files

Options
  --cwd <dir>          Project directory to operate on
  --registry <url>     Registry base URL or a local directory
  --yes, -y            Accept defaults and keep existing files
  --overwrite          Replace existing files without prompting
  --no-overwrite       Keep every existing file
  --no-install         Write files but skip package installation
  --dry-run            Report what would change without writing
  --json               Print machine-readable output (diff, list, view, doctor)
  --all                Compare every installed UI and block item (diff)
  --version, -v        Print the CLI version
  --help, -h           Print this help

Examples
  npx @aback-ui/cli init
  npx @aback-ui/cli add button dialog
  npx @aback-ui/cli add sign-in
  npx @aback-ui/cli add @aback/dropdown-menu
  npx @aback-ui/cli add https://abackui.com/r/table.json
  npx @aback-ui/cli diff button
  npx @aback-ui/cli diff --all
  npx @aback-ui/cli doctor
  npx @aback-ui/cli doctor --json
  npx @aback-ui/cli list forms
  npx @aback-ui/cli view button

Environment
  ABACK_UI_REGISTRY    Overrides the registry base used by every command.
`;
