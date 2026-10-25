import { spawnSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { ensureDirectory, existsPath } from "./config.js";
import type { Logger } from "./logger.js";
import { relativeImport, resolveTargetPath, toPosix } from "./paths.js";
import type { Prompter } from "./prompt.js";
import type {
  FileWriteResult,
  InstallDirs,
  OverwriteMode,
  PackageManager,
  RegistryItem,
} from "./types.js";

export interface WriteOptions {
  items: RegistryItem[];
  projectRoot: string;
  dirs: InstallDirs;
  overwrite?: OverwriteMode;
  dryRun?: boolean;
  log: Logger;
  prompt: Prompter;
}

/**
 * Write every registry file into the project. Existing files are kept unless
 * the caller explicitly allows overwriting, so a local edit is never lost
 * silently.
 */
export async function writeItemFiles({
  items,
  projectRoot,
  dirs,
  overwrite = "prompt",
  dryRun = false,
  log,
  prompt,
}: WriteOptions): Promise<FileWriteResult[]> {
  const results: FileWriteResult[] = [];

  for (const item of items) {
    for (const file of item.files) {
      const target = file.target ?? file.path;
      const absolutePath = resolveTargetPath(target, dirs, projectRoot);
      const display = toPosix(path.relative(projectRoot, absolutePath));

      let existing: string | null = null;
      if (await existsPath(absolutePath)) {
        existing = await readFile(absolutePath, "utf8");
      }

      if (existing === file.content) {
        results.push({ item: item.name, target: display, absolutePath, status: "unchanged" });
        continue;
      }

      if (existing !== null) {
        if (dryRun) {
          log.warn(`${display} already exists; a real run would ask before replacing it.`);
          results.push({ item: item.name, target: display, absolutePath, status: "skipped" });
          continue;
        }

        if (overwrite === "never") {
          log.warn(`Kept existing ${display}.`);
          results.push({ item: item.name, target: display, absolutePath, status: "skipped" });
          continue;
        }

        if (overwrite === "prompt") {
          const confirmed = await prompt.confirm(
            `${display} already exists. Replace it with the registry version?`,
            false,
          );
          if (!confirmed) {
            log.warn(`Kept existing ${display}.`);
            results.push({ item: item.name, target: display, absolutePath, status: "skipped" });
            continue;
          }
        }
      }

      if (dryRun) {
        log.info(`Would write ${display}`);
        results.push({ item: item.name, target: display, absolutePath, status: "written" });
        continue;
      }

      await ensureDirectory(path.dirname(absolutePath));
      await writeFile(absolutePath, file.content, "utf8");
      log.success(`Wrote ${display}`);
      results.push({ item: item.name, target: display, absolutePath, status: "written" });
    }
  }

  return results;
}

export interface DependencyCommand {
  command: string;
  args: string[];
}

export function dependencyCommand(
  packageManager: PackageManager,
  packages: string[],
  dev: boolean,
): DependencyCommand {
  switch (packageManager) {
    case "bun":
      return { command: "bun", args: ["add", ...(dev ? ["-d"] : []), ...packages] };
    case "pnpm":
      return { command: "pnpm", args: ["add", ...(dev ? ["-D"] : []), ...packages] };
    case "yarn":
      return { command: "yarn", args: ["add", ...(dev ? ["-D"] : []), ...packages] };
    case "npm":
    default:
      return { command: "npm", args: ["install", ...(dev ? ["--save-dev"] : []), ...packages] };
  }
}

type CommandRunner = (
  command: string,
  args: string[],
  options: { cwd: string; stdio: "inherit" },
) => { status: number | null };

export interface InstallDependenciesOptions {
  cwd: string;
  packageManager: PackageManager;
  dependencies?: string[];
  devDependencies?: string[];
  noInstall?: boolean;
  dryRun?: boolean;
  log: Logger;
  runner?: CommandRunner;
}

export async function installDependencies({
  cwd,
  packageManager,
  dependencies = [],
  devDependencies = [],
  noInstall = false,
  dryRun = false,
  log,
  runner = spawnSync,
}: InstallDependenciesOptions): Promise<void> {
  const groups: Array<{ packages: string[]; dev: boolean }> = [
    { packages: [...new Set(dependencies)].sort(), dev: false },
    { packages: [...new Set(devDependencies)].sort(), dev: true },
  ];

  for (const group of groups) {
    if (group.packages.length === 0) continue;
    const { command, args } = dependencyCommand(packageManager, group.packages, group.dev);
    const printable = `${command} ${args.join(" ")}`;

    if (noInstall || dryRun) {
      log.info(`Install dependencies with: ${printable}`);
      continue;
    }

    log.step(`Installing ${group.packages.length} package(s) with ${packageManager}`);
    const result = runner(command, args, { cwd, stdio: "inherit" });
    if (result.status !== 0) {
      throw new Error(
        `Dependency installation failed (${printable}). Run it manually to see the full output.`,
      );
    }
  }
}

export interface ThemeImportOptions {
  cssFile: string;
  themeFile: string;
  dryRun?: boolean;
  log: Logger;
}

/**
 * Insert the theme import directly after the Tailwind import so theme
 * variables exist before any utility is generated.
 */
export async function ensureThemeImport({
  cssFile,
  themeFile,
  dryRun = false,
  log,
}: ThemeImportOptions): Promise<"added" | "present" | "missing"> {
  if (!(await existsPath(cssFile))) return "missing";

  const content = await readFile(cssFile, "utf8");
  const specifier = relativeImport(cssFile, themeFile);
  if (content.includes(specifier) || content.includes("aback.css")) return "present";

  const importLine = `@import "${specifier}";`;
  const tailwind = /^[ \t]*@import\s+["']tailwindcss(?:\/[^"']*)?["'];?[^\n]*\n?/m.exec(content);

  let next: string;
  if (tailwind) {
    const index = tailwind.index + tailwind[0].length;
    next = `${content.slice(0, index)}${importLine}\n${content.slice(index)}`;
  } else {
    next = `${importLine}\n${content}`;
  }

  if (!dryRun) await writeFile(cssFile, next, "utf8");
  log.success(
    `${dryRun ? "Would add" : "Added"} the Aback theme import to ${toPosix(path.basename(cssFile))}`,
  );
  return "added";
}
