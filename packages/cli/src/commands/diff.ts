import { findProjectRoot, loadConfig, resolveInstallDirs } from "../config.js";
import { commandError } from "../errors.js";
import { diffItems, trimDiff, type FileDiff } from "../diff.js";
import type { Logger } from "../logger.js";
import { DEFAULT_REGISTRY, RegistryClient } from "../registry.js";
import type { RegistryFetch } from "../types.js";

export interface DiffCommandOptions {
  cwd: string;
  items: string[];
  all?: boolean;
  json?: boolean;
  registry?: string;
  logger: Logger;
  fetchImpl?: RegistryFetch;
}

export async function runDiff(options: DiffCommandOptions): Promise<number> {
  if (options.items.length === 0 && !options.all) {
    throw commandError(
      "Name the items to compare, or pass --all to compare every installed item, for example: aback-ui diff button",
    );
  }

  const projectRoot = await findProjectRoot(options.cwd);
  if (!projectRoot) {
    throw commandError(`No package.json found from ${options.cwd}.`);
  }
  const config = await loadConfig(projectRoot);
  if (!config) {
    throw commandError("No components.json found. Run `aback-ui init` first.");
  }

  const client = new RegistryClient({
    registry: options.registry ?? process.env.ABACK_UI_REGISTRY ?? DEFAULT_REGISTRY,
    cwd: projectRoot,
    registries: config.registries,
    fetchImpl: options.fetchImpl,
  });

  let specifiers = options.items;
  if (options.all) {
    const index = await client.index();
    specifiers = index.items
      .filter((item) => item.type === "registry:ui" || item.type === "registry:block")
      .map((item) => item.name);
  }

  if (!options.json) {
    options.logger.step(`Comparing ${specifiers.length} item(s) with the registry`);
  }
  const items = [];
  for (const specifier of specifiers) {
    items.push(await client.item(specifier));
  }

  const dirs = await resolveInstallDirs(projectRoot, config);
  const results = await diffItems({ projectRoot, dirs, items });

  if (options.json) {
    options.logger.raw(
      JSON.stringify(
        results.map((result) => ({
          item: result.item,
          target: result.target,
          status: result.status,
          changes: result.lines.filter((line) => line.type !== "context").length,
        })),
        null,
        2,
      ),
    );
    return 0;
  }

  const changed = results.filter((result) => result.status !== "unchanged");
  if (changed.length === 0) {
    options.logger.success("Installed files match the registry.");
    return 0;
  }

  for (const result of results) {
    if (result.status === "unchanged") continue;
    options.logger.raw("");
    options.logger.raw(
      `${result.target}${result.status === "missing" ? " (missing)" : ""}`,
    );

    if (result.status === "missing") {
      options.logger.warn("The registry file is not installed. Run `aback-ui add` to add it.");
      continue;
    }

    printDiff(result, options.logger);
  }

  options.logger.raw("");
  options.logger.info(
    `${changed.length} of ${results.length} file(s) differ. "−" is your file, "+" is the registry version.`,
  );
  return 0;
}

function printDiff(result: FileDiff, logger: Logger) {
  for (const line of trimDiff(result.lines)) {
    if (line === "gap") {
      logger.dim("  …");
    } else if (line.type === "add") {
      logger.raw(`  + ${line.text}`);
    } else if (line.type === "remove") {
      logger.raw(`  - ${line.text}`);
    } else {
      logger.dim(`    ${line.text}`);
    }
  }
}
