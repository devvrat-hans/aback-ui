import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { AbackConfig, InstallDirs, PackageManager } from "./types.js";

export interface PackageJson {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  packageManager?: string;
  [key: string]: unknown;
}

export interface TsconfigPaths {
  baseUrl?: string;
  paths: Record<string, string[]>;
}

export interface AliasInfo {
  /** The alias prefix, including the trailing slash, for example `@/`. */
  prefix: string;
  /** Absolute directory the alias resolves to. */
  base: string;
  /** Every raw path mapping from tsconfig, for custom alias lookups. */
  paths: Record<string, string[]>;
}

export class ConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}

async function exists(file: string): Promise<boolean> {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

export async function existsPath(file: string): Promise<boolean> {
  return exists(file);
}

/** Walk upward from `start` until a package.json is found. */
export async function findProjectRoot(start: string): Promise<string | null> {
  let current = path.resolve(start);
  for (;;) {
    if (await exists(path.join(current, "package.json"))) return current;
    const parent = path.dirname(current);
    if (parent === current) return null;
    current = parent;
  }
}

export async function readPackageJson(root: string): Promise<PackageJson> {
  const file = path.join(root, "package.json");
  try {
    return JSON.parse(await readFile(file, "utf8")) as PackageJson;
  } catch (error) {
    throw new ConfigError(`Could not read ${file}: ${(error as Error).message}`);
  }
}

export async function detectPackageManager(root: string): Promise<PackageManager> {
  if ((await exists(path.join(root, "bun.lock"))) || (await exists(path.join(root, "bun.lockb")))) {
    return "bun";
  }
  if (await exists(path.join(root, "pnpm-lock.yaml"))) return "pnpm";
  if (await exists(path.join(root, "yarn.lock"))) return "yarn";
  if (await exists(path.join(root, "package-lock.json"))) return "npm";

  try {
    const pkg = await readPackageJson(root);
    if (pkg.packageManager?.startsWith("bun")) return "bun";
    if (pkg.packageManager?.startsWith("pnpm")) return "pnpm";
    if (pkg.packageManager?.startsWith("yarn")) return "yarn";
  } catch {
    // Fall through to npm.
  }
  return "npm";
}

export function detectFramework(pkg: PackageJson): "next" | "vite" | "remix" | "astro" | "unknown" {
  const dependencies = { ...pkg.dependencies, ...pkg.devDependencies };
  if (dependencies.next) return "next";
  if (dependencies["@remix-run/react"]) return "remix";
  if (dependencies.astro) return "astro";
  if (dependencies.vite) return "vite";
  return "unknown";
}

/** Major version of the installed Tailwind package, or null when absent. */
export function detectTailwindMajor(pkg: PackageJson): number | null {
  const version = pkg.devDependencies?.tailwindcss ?? pkg.dependencies?.tailwindcss;
  if (!version) return null;
  const match = /(\d+)/.exec(version);
  return match?.[1] ? Number(match[1]) : null;
}

export async function detectSrcDir(root: string): Promise<string> {
  const candidates = ["src/app", "src/pages", "src/components", "src/lib", "src/routes"];
  for (const candidate of candidates) {
    if (await exists(path.join(root, candidate))) return "src";
  }
  return "";
}

/**
 * Strip comments and trailing commas from a JSON-with-comments file. The scan
 * skips over strings, because tsconfig paths such as "@/*" and "**\/*.ts"
 * look like comment markers.
 */
export function parseJsonc(source: string): unknown {
  let output = "";
  let index = 0;
  while (index < source.length) {
    const char = source[index];
    const next = source[index + 1];
    if (char === '"') {
      let end = index + 1;
      while (end < source.length && source[end] !== '"') {
        end += source[end] === "\\" ? 2 : 1;
      }
      output += source.slice(index, end + 1);
      index = end + 1;
    } else if (char === "/" && next === "/") {
      while (index < source.length && source[index] !== "\n") index += 1;
    } else if (char === "/" && next === "*") {
      const end = source.indexOf("*/", index + 2);
      index = end === -1 ? source.length : end + 2;
    } else if (char === "}" || char === "]") {
      output = output.replace(/,\s*$/, "");
      output += char;
      index += 1;
    } else {
      output += char;
      index += 1;
    }
  }
  return JSON.parse(output);
}

export async function readTsconfig(root: string): Promise<TsconfigPaths> {
  for (const name of ["tsconfig.json", "jsconfig.json"]) {
    const file = path.join(root, name);
    if (!(await exists(file))) continue;
    try {
      const parsed = parseJsonc(await readFile(file, "utf8")) as {
        compilerOptions?: { baseUrl?: string; paths?: Record<string, string[]> };
      };
      return {
        baseUrl: parsed.compilerOptions?.baseUrl,
        paths: parsed.compilerOptions?.paths ?? {},
      };
    } catch (error) {
      throw new ConfigError(`Could not read ${name}: ${(error as Error).message}`);
    }
  }
  return { paths: {} };
}

function isInside(root: string, candidate: string): boolean {
  const relative = path.relative(root, candidate);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

/**
 * Resolve a path alias such as `@/components/ui` against the tsconfig paths.
 * Returns null when the alias has no mapping or escapes the project.
 */
export function resolveAlias(
  alias: string,
  tsconfig: TsconfigPaths,
  root: string,
): { absolute: string; prefix: string } | null {
  let best: { key: string; target: string } | null = null;

  for (const [key, targets] of Object.entries(tsconfig.paths)) {
    const target = targets[0];
    if (!target) continue;
    if (key.endsWith("/*")) {
      const keyPrefix = key.slice(0, -1); // keep the trailing slash
      if (!alias.startsWith(keyPrefix)) continue;
      if (best && best.key.length >= key.length) continue;
      best = { key, target };
    } else if (key === alias) {
      best = { key, target };
    }
  }

  if (!best) return null;

  const targetBase = best.target.replace(/\*$/, "");
  const remainder = best.key.endsWith("/*")
    ? alias.slice(best.key.length - 1) // drop the wildcard, keep the slash
    : "";
  const baseDirectory = tsconfig.baseUrl
    ? path.resolve(root, tsconfig.baseUrl)
    : root;
  const resolved = path.resolve(baseDirectory, `${targetBase}${remainder}`);

  if (!isInside(root, resolved)) return null;
  return { absolute: resolved, prefix: alias };
}

/** Best-effort alias from the tsconfig: prefer `@/*`, otherwise the first wildcard. */
export function detectAlias(tsconfig: TsconfigPaths, root: string): AliasInfo | null {
  const preferred = tsconfig.paths["@/*"]?.[0];
  if (preferred) {
    const resolved = resolveAlias("@/__aback_probe__", tsconfig, root);
    if (resolved) {
      return {
        prefix: "@/",
        base: path.dirname(resolved.absolute),
        paths: tsconfig.paths,
      };
    }
  }

  for (const key of Object.keys(tsconfig.paths)) {
    if (!key.endsWith("/*")) continue;
    const prefix = key.slice(0, -1);
    const resolved = resolveAlias(`${prefix}__aback_probe__`, tsconfig, root);
    if (resolved) {
      return {
        prefix,
        base: path.dirname(resolved.absolute),
        paths: tsconfig.paths,
      };
    }
  }

  return null;
}

const CSS_CANDIDATES = [
  "app/globals.css",
  "src/app/globals.css",
  "styles/globals.css",
  "src/styles/globals.css",
  "src/index.css",
  "src/styles/index.css",
  "app/globals.scss",
];

export async function detectCssFile(root: string): Promise<string | null> {
  for (const candidate of CSS_CANDIDATES) {
    if (await exists(path.join(root, candidate))) return candidate;
  }
  return null;
}

/** The project configuration file `aback-ui init` writes. */
export const CONFIG_FILE = "aback-ui.json";

export async function loadConfig(root: string): Promise<AbackConfig | null> {
  const file = path.join(root, CONFIG_FILE);
  if (!(await exists(file))) return null;
  try {
    return JSON.parse(await readFile(file, "utf8")) as AbackConfig;
  } catch (error) {
    throw new ConfigError(`${CONFIG_FILE} is not valid JSON: ${(error as Error).message}`);
  }
}

export async function writeConfig(root: string, config: AbackConfig): Promise<void> {
  await writeFile(path.join(root, CONFIG_FILE), `${JSON.stringify(config, null, 2)}\n`, "utf8");
}

export interface ConfigInput {
  aliasPrefix: string;
  css: string;
  rsc: boolean;
  tsx: boolean;
  framework: ReturnType<typeof detectFramework>;
}

export function createConfig({ aliasPrefix, css, rsc, tsx, framework }: ConfigInput): AbackConfig {
  return {
    $schema: "https://abackui.com/schema/aback-ui.json",
    style: "aback",
    rsc,
    tsx,
    tailwind: {
      css,
    },
    aliases: {
      components: `${aliasPrefix}components`,
      utils: `${aliasPrefix}lib/utils`,
      ui: `${aliasPrefix}components/ui`,
      lib: `${aliasPrefix}lib`,
      hooks: `${aliasPrefix}hooks`,
    },
    registries: {
      "@aback": "https://abackui.com/r/{name}.json",
    },
    framework,
  };
}

/** Project directories for each alias, resolved against the project root. */
export async function resolveInstallDirs(
  root: string,
  config: AbackConfig,
): Promise<InstallDirs> {
  const tsconfig = await readTsconfig(root);
  const alias = detectAlias(tsconfig, root);
  const base = alias?.base ?? path.join(root, await detectSrcDir(root));

  function resolve(aliasValue: string | undefined, fallback: string): string {
    if (!aliasValue) return path.join(base, fallback);
    const resolved = resolveAlias(aliasValue, tsconfig, root);
    return resolved?.absolute ?? path.join(base, fallback);
  }

  const components = resolve(config.aliases?.components, "components");

  return {
    components,
    ui: resolve(config.aliases?.ui, "components/ui"),
    blocks: path.join(components, "blocks"),
    lib: resolve(config.aliases?.lib, "lib"),
    hooks: resolve(config.aliases?.hooks, "hooks"),
    styles: path.join(root, "styles"),
  };
}

export async function ensureDirectory(directory: string): Promise<void> {
  await mkdir(directory, { recursive: true });
}
