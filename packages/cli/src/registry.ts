import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { RegistryFetch, RegistryIndex, RegistryItem } from "./types.js";

/**
 * The canonical address of the Aback UI registry. Item files reference each
 * other by URLs under it, and a project's aback-ui.json names it as "@aback".
 */
export const DEFAULT_REGISTRY = "https://abackui.com/r";

/**
 * The registry copy shipped inside this package, at `<package>/registry`.
 * Installing from it needs no network and always matches the CLI version.
 * Returns null when running from source before `bun run build`.
 */
export function bundledRegistry(): string | null {
  const directory = fileURLToPath(new URL("../registry", import.meta.url));
  return existsSync(path.join(directory, "index.json")) ? directory : null;
}

/** The bundled registry when present, otherwise the hosted one. */
export function defaultRegistry(): string {
  return bundledRegistry() ?? DEFAULT_REGISTRY;
}
const NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class RegistryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "RegistryError";
  }
}

export interface RegistryClientOptions {
  /** Registry base URL or a local directory containing `{name}.json` files. */
  registry?: string;
  /** Working directory used for local file specifiers. */
  cwd?: string;
  /** Named registry templates from aback-ui.json. */
  registries?: Record<string, string>;
  fetchImpl?: RegistryFetch;
}

function isUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

function isLocalBase(base: string): boolean {
  return !isUrl(base);
}

export class RegistryClient {
  private readonly base: string;
  private readonly cwd: string;
  private readonly registries: Record<string, string>;
  private readonly fetchImpl: RegistryFetch;
  private readonly items = new Map<string, RegistryItem>();
  private indexCache: RegistryIndex | null = null;

  constructor(options: RegistryClientOptions = {}) {
    this.base = (options.registry ?? DEFAULT_REGISTRY).replace(/\/$/, "");
    this.cwd = options.cwd ?? process.cwd();
    this.registries = options.registries ?? {};
    this.fetchImpl =
      options.fetchImpl ?? ((url) => fetch(url, { signal: AbortSignal.timeout(20_000) }));
  }

  async index(): Promise<RegistryIndex> {
    if (this.indexCache) return this.indexCache;
    const target = isUrl(this.base)
      ? `${this.base}/index.json`
      : path.join(this.base, "index.json");
    const raw = await this.readJson(target);
    if (!raw || typeof raw !== "object" || !Array.isArray((raw as RegistryIndex).items)) {
      throw new RegistryError(`Registry index at ${target} is missing an items array.`);
    }
    this.indexCache = raw as RegistryIndex;
    return this.indexCache;
  }

  async item(specifier: string): Promise<RegistryItem> {
    const { target, label } = this.resolveSpecifier(specifier);
    const cached = this.items.get(label);
    if (cached) return cached;

    const raw = await this.readJson(target);
    const item = validateItem(raw, label);
    this.items.set(item.name, item);
    this.items.set(label, item);
    return item;
  }

  /** Resolve a set of items and their dependencies, dependencies first. */
  async collect(specifiers: string[]): Promise<RegistryItem[]> {
    const ordered: RegistryItem[] = [];
    const done = new Set<string>();
    const visiting = new Set<string>();

    const visit = async (specifier: string): Promise<void> => {
      const item = await this.item(specifier);
      if (done.has(item.name)) return;
      if (visiting.has(item.name)) {
        throw new RegistryError(`Circular registry dependency detected at "${item.name}".`);
      }
      visiting.add(item.name);
      for (const dependency of item.registryDependencies ?? []) {
        await visit(dependency);
      }
      visiting.delete(item.name);
      done.add(item.name);
      ordered.push(item);
    };

    for (const specifier of specifiers) {
      await visit(specifier);
    }
    return ordered;
  }

  private resolveSpecifier(specifier: string): { target: string; label: string } {
    const trimmed = specifier.trim();
    if (!trimmed) throw new RegistryError("Empty registry item name.");

    if (isUrl(trimmed)) {
      // Registry items carry absolute dependency URLs generated for the
      // production registry. When a mirror, a staging host, or a local build
      // is configured, resolve those same items against the active registry
      // instead of reaching back out to abackui.com.
      return { target: this.localiseDependency(trimmed), label: trimmed };
    }

    if (trimmed.startsWith("@")) {
      const separator = trimmed.indexOf("/");
      if (separator === -1) {
        throw new RegistryError(`Registry alias "${trimmed}" must look like @aback/button.`);
      }
      const scope = trimmed.slice(0, separator);
      const name = trimmed.slice(separator + 1);
      const template = this.registries[scope];
      if (!template) {
        throw new RegistryError(
          `Unknown registry alias "${scope}". Add it to aback-ui.json under "registries".`,
        );
      }
      const expanded = template.replace("{name}", name);
      return this.resolveSpecifier(expanded);
    }

    if (trimmed.endsWith(".json")) {
      const file = path.resolve(this.cwd, trimmed);
      if (existsSync(file)) return { target: file, label: trimmed };
    }

    const name = trimmed.replace(/\.json$/, "");
    if (!NAME_PATTERN.test(name)) {
      throw new RegistryError(
        `Invalid item name "${specifier}". Use a lowercase kebab-case name, a URL, or @scope/name.`,
      );
    }

    if (isLocalBase(this.base)) {
      return { target: path.join(this.base, `${name}.json`), label: name };
    }
    return { target: `${this.base}/${name}.json`, label: name };
  }

  /**
   * Map an abackui.com item URL onto the active registry base. Returns the
   * input unchanged when the URL belongs to another registry or the default
   * production registry is already in use.
   */
  private localiseDependency(url: string): string {
    if (this.base === DEFAULT_REGISTRY) return url;
    // The bundled copy and any mirror serve the same file names.

    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return url;
    }

    const production = new URL(DEFAULT_REGISTRY);
    if (parsed.origin !== production.origin || !parsed.pathname.startsWith("/r/")) {
      return url;
    }

    const file = parsed.pathname.slice("/r/".length);
    if (!file.endsWith(".json")) return url;
    const name = file.slice(0, -5);
    if (!NAME_PATTERN.test(name)) return url;

    return isLocalBase(this.base) ? path.join(this.base, file) : `${this.base}/${file}`;
  }

  private async readJson(target: string): Promise<unknown> {
    if (isUrl(target)) {
      let response: Awaited<ReturnType<RegistryFetch>>;
      try {
        response = await this.fetchImpl(target);
      } catch (error) {
        throw new RegistryError(`Could not reach ${target}: ${(error as Error).message}`);
      }
      if (!response.ok) {
        throw new RegistryError(
          response.status === 404
            ? `Registry item not found: ${target}`
            : `Registry request failed (${response.status}): ${target}`,
        );
      }
      try {
        return await response.json();
      } catch {
        throw new RegistryError(`Registry response at ${target} is not valid JSON.`);
      }
    }

    if (!existsSync(target)) {
      throw new RegistryError(`Registry item not found: ${target}`);
    }
    try {
      return JSON.parse(await readFile(target, "utf8"));
    } catch (error) {
      throw new RegistryError(`Could not parse ${target}: ${(error as Error).message}`);
    }
  }
}

export function validateItem(raw: unknown, source: string): RegistryItem {
  if (!raw || typeof raw !== "object") {
    throw new RegistryError(`Registry item at ${source} is not an object.`);
  }
  const item = raw as Partial<RegistryItem>;

  if (!item.name || !NAME_PATTERN.test(item.name)) {
    throw new RegistryError(`Registry item at ${source} has an invalid name.`);
  }
  if (!Array.isArray(item.files) || item.files.length === 0) {
    throw new RegistryError(`Registry item "${item.name}" has no files.`);
  }
  for (const file of item.files) {
    if (!file || typeof file.content !== "string" || typeof file.target !== "string") {
      throw new RegistryError(
        `Registry item "${item.name}" has a file without string content and target.`,
      );
    }
  }
  return item as RegistryItem;
}
