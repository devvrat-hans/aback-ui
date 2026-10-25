import path from "node:path";

import {
  createConfig,
  detectAlias,
  detectCssFile,
  detectFramework,
  detectPackageManager,
  detectTailwindMajor,
  findProjectRoot,
  loadConfig,
  readPackageJson,
  readTsconfig,
  resolveInstallDirs,
  writeConfig,
} from "../config.js";
import {
  ensureThemeImport,
  installDependencies,
  writeItemFiles,
  type InstallDependenciesOptions,
} from "../install.js";
import type { Logger } from "../logger.js";
import { safeJoin } from "../paths.js";
import type { Prompter } from "../prompt.js";
import { DEFAULT_REGISTRY, RegistryClient } from "../registry.js";
import type { RegistryFetch } from "../types.js";
import { commandError } from "../errors.js";

export interface InitCommandOptions {
  cwd: string;
  yes?: boolean;
  force?: boolean;
  css?: string;
  noInstall?: boolean;
  dryRun?: boolean;
  registry?: string;
  logger: Logger;
  prompter: Prompter;
  fetchImpl?: RegistryFetch;
  installPackages?: (options: InstallDependenciesOptions) => Promise<void>;
}

export async function runInit(options: InitCommandOptions): Promise<number> {
  const { logger } = options;

  const projectRoot = await findProjectRoot(options.cwd);
  if (!projectRoot) {
    throw commandError(
      `No package.json found from ${options.cwd}. Run this inside a React project.`,
    );
  }

  const existingConfig = await loadConfig(projectRoot);
  if (existingConfig && !options.force) {
    logger.info("components.json already exists. Nothing to do.");
    logger.dim("Use `aback-ui add <component>` to install a component, or --force to rewrite the config.");
    return 0;
  }

  const pkg = await readPackageJson(projectRoot);
  const tailwindMajor = detectTailwindMajor(pkg);
  if (tailwindMajor === null) {
    throw commandError(
      "Tailwind CSS is not installed. Aback UI needs Tailwind CSS v4; install it before running init.",
    );
  }
  if (tailwindMajor < 4) {
    throw commandError(
      `Tailwind CSS v${tailwindMajor} detected. The Aback theme uses Tailwind v4 directives (@theme inline); upgrade to v4 first.`,
    );
  }

  const framework = detectFramework(pkg);
  const tsconfig = await readTsconfig(projectRoot);
  const alias = detectAlias(tsconfig, projectRoot);
  if (!alias) {
    logger.warn(
      "No path alias found in tsconfig.json. Writing components with @/… aliases; add \"@/*\": [\"./src/*\"] to compilerOptions.paths if your build cannot resolve them.",
    );
  }

  const cssRelative = options.css ?? existingConfig?.tailwind?.css ?? (await detectCssFile(projectRoot));
  if (!cssRelative) {
    throw commandError(
      "Could not find your global stylesheet. Pass it explicitly, for example --css app/globals.css.",
    );
  }
  const cssFile = safeJoin(projectRoot, cssRelative.replace(/^\.\//, ""));

  const config = createConfig({
    aliasPrefix: alias?.prefix ?? "@",
    css: cssRelative.replace(/^\.\//, ""),
    rsc: framework === "next",
    tsx: true,
    framework,
  });

  const registryBase =
    options.registry ?? process.env.ABACK_UI_REGISTRY ?? DEFAULT_REGISTRY;
  const client = new RegistryClient({
    registry: registryBase,
    cwd: projectRoot,
    registries: config.registries,
    fetchImpl: options.fetchImpl,
  });

  logger.step("Fetching the theme and shared utilities from the registry");
  const items = await client.collect(["utils", "theme"]);

  const dirs = await resolveInstallDirs(projectRoot, config);
  const themeFile = path.join(dirs.styles, "aback.css");

  if (!options.dryRun) {
    await writeConfig(projectRoot, config);
    logger.success("Wrote components.json");
  } else {
    logger.info("Would write components.json");
  }

  await writeItemFiles({
    items,
    projectRoot,
    dirs,
    overwrite: options.yes ? "never" : "prompt",
    dryRun: options.dryRun,
    log: logger,
    prompt: options.prompter,
  });

  const themeImport = await ensureThemeImport({
    cssFile,
    themeFile,
    dryRun: options.dryRun,
    log: logger,
  });
  if (themeImport === "missing") {
    logger.warn(`Stylesheet ${cssRelative} does not exist. Add the theme import manually.`);
  }

  const install = options.installPackages ?? installDependencies;
  await install({
    cwd: projectRoot,
    packageManager: await detectPackageManager(projectRoot),
    dependencies: items.flatMap((item) => item.dependencies ?? []),
    noInstall: options.noInstall,
    dryRun: options.dryRun,
    log: logger,
  });

  logger.raw("");
  logger.success("Aback UI is ready.");
  logger.info("Next steps:");
  logger.dim("  aback-ui add button");
  logger.dim("  aback-ui list");
  return 0;
}
