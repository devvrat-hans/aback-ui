import path from "node:path";

import { findProjectRoot, loadConfig, resolveInstallDirs, detectPackageManager } from "../config.js";
import { commandError } from "../errors.js";
import {
  installDependencies,
  writeItemFiles,
  type DependencyCommand,
  type InstallDependenciesOptions,
} from "../install.js";
import type { Logger } from "../logger.js";
import type { Prompter } from "../prompt.js";
import { DEFAULT_REGISTRY, RegistryClient } from "../registry.js";
import type { OverwriteMode, RegistryFetch } from "../types.js";

export interface AddCommandOptions {
  cwd: string;
  items: string[];
  yes?: boolean;
  overwrite?: boolean;
  noOverwrite?: boolean;
  noInstall?: boolean;
  dryRun?: boolean;
  registry?: string;
  logger: Logger;
  prompter: Prompter;
  fetchImpl?: RegistryFetch;
  installPackages?: (options: InstallDependenciesOptions) => Promise<void>;
}

const REGISTRY_TEMPLATE = /\/?\{name\}\.json$/;

export function registryBaseFromConfig(config: { registries?: Record<string, string> }): string {
  const template = config.registries?.["@aback"];
  if (!template) return DEFAULT_REGISTRY;
  return template.replace(REGISTRY_TEMPLATE, "");
}

export async function runAdd(options: AddCommandOptions): Promise<number> {
  const { logger } = options;
  if (options.items.length === 0) {
    throw commandError("Name at least one component, for example: aback-ui add button");
  }

  const projectRoot = await findProjectRoot(options.cwd);
  if (!projectRoot) {
    throw commandError(
      `No package.json found from ${options.cwd}. Run this inside the project you want to edit.`,
    );
  }

  const config = await loadConfig(projectRoot);
  if (!config) {
    throw commandError("No components.json found. Run `aback-ui init` first.");
  }

  const client = new RegistryClient({
    registry: options.registry ?? process.env.ABACK_UI_REGISTRY ?? registryBaseFromConfig(config),
    cwd: projectRoot,
    registries: config.registries,
    fetchImpl: options.fetchImpl,
  });

  logger.step(`Resolving ${options.items.length} item(s)`);
  const items = await client.collect(options.items);
  const dirs = await resolveInstallDirs(projectRoot, config);

  const overwrite: OverwriteMode = options.overwrite
    ? "always"
    : options.noOverwrite || options.yes
      ? "never"
      : "prompt";

  const results = await writeItemFiles({
    items,
    projectRoot,
    dirs,
    overwrite,
    dryRun: options.dryRun,
    log: logger,
    prompt: options.prompter,
  });

  const install = options.installPackages ?? installDependencies;
  await install({
    cwd: projectRoot,
    packageManager: await detectPackageManager(projectRoot),
    dependencies: [...new Set(items.flatMap((item) => item.dependencies ?? []))].sort(),
    devDependencies: [...new Set(items.flatMap((item) => item.devDependencies ?? []))].sort(),
    noInstall: options.noInstall,
    dryRun: options.dryRun,
    log: logger,
  });

  const written = results.filter((result) => result.status === "written").length;
  const kept = results.filter((result) => result.status === "skipped").length;

  logger.raw("");
  if (options.dryRun) {
    logger.info(`Dry run: ${items.length} item(s), ${results.length} file(s), ${written} new.`);
    return 0;
  }

  logger.success(
    `Installed ${items.map((item) => item.name).join(", ")} (${written} file${written === 1 ? "" : "s"} written${kept ? `, ${kept} kept` : ""}).`,
  );

  for (const item of items) {
    if (item.docs) logger.dim(`  ${item.docs.replace("https://abackui.com", "")}`);
  }

  return 0;
}

export function describeInstallCommand(command: DependencyCommand): string {
  return `${path.basename(command.command)} ${command.args.join(" ")}`;
}
