export const CLI_VERSION = "0.2.2";

export const HELP = `Aback UI — copy accessible React components into your project

Usage
  aback-ui <command> [options]

Commands
  init                 Configure a project, add the theme, and install utilities
  add <items...>       Copy component or block source into the project
  diff [items...]      Compare installed files with the registry (or --all)
  doctor               Check the project setup, theme, aliases, and dependencies
  list [query]         List installable items
  view <item>          Show an item's metadata, dependencies, and files

Options
  --cwd <dir>          Project directory to operate on
  --registry <url>     Install from another registry (a URL or a local directory)
  --css <file>         Global stylesheet for init, when it cannot be detected
  --force              Let init rewrite an existing aback-ui.json
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
  npx aback-ui init
  npx aback-ui add button dialog
  npx aback-ui add sign-in
  npx aback-ui list forms
  npx aback-ui view button
  npx aback-ui diff --all
  npx aback-ui doctor

Registry
  Component source ships inside this package, so installing never downloads
  code from a website and the files always match the CLI version. npm
  dependencies still come from your package manager. --registry or
  ABACK_UI_REGISTRY point the CLI at a mirror or a local build instead.

Environment
  ABACK_UI_REGISTRY    Overrides the registry used by every command.
`;
