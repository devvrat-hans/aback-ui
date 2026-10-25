import type { Logger } from "../logger.js";
import { RegistryClient, defaultRegistry } from "../registry.js";
import type { RegistryFetch, RegistryIndexItem } from "../types.js";

export interface ListCommandOptions {
  registry?: string;
  query?: string;
  json?: boolean;
  logger: Logger;
  fetchImpl?: RegistryFetch;
}

export async function runList(options: ListCommandOptions): Promise<number> {
  const client = new RegistryClient({
    registry: options.registry ?? process.env.ABACK_UI_REGISTRY ?? defaultRegistry(),
    fetchImpl: options.fetchImpl,
  });

  const index = await client.index();
  const term = options.query?.trim().toLowerCase() ?? "";
  const items = index.items.filter((item) => {
    if (!term) return true;
    const haystack = `${item.name} ${item.title} ${item.description} ${(item.categories ?? []).join(" ")}`;
    return haystack.toLowerCase().includes(term);
  });

  if (options.json) {
    options.logger.raw(JSON.stringify(items, null, 2));
    return 0;
  }

  if (items.length === 0) {
    options.logger.warn(`No registry items matched "${options.query}".`);
    return 1;
  }

  const width = Math.min(
    30,
    Math.max(...items.map((item) => item.name.length)),
  );

  const groups = new Map<string, RegistryIndexItem[]>();
  for (const item of items) {
    const group = item.categories?.[0] ?? (item.type === "registry:ui" ? "Components" : "Other");
    const list = groups.get(group) ?? [];
    list.push(item);
    groups.set(group, list);
  }

  for (const group of [...groups.keys()].sort((a, b) => a.localeCompare(b))) {
    const list = groups.get(group) ?? [];
    options.logger.raw(`${group} (${list.length})`);
    for (const item of list.sort((a, b) => a.title.localeCompare(b.title))) {
      options.logger.raw(`  ${item.name.padEnd(width)}  ${item.description}`);
    }
    options.logger.raw("");
  }

  options.logger.dim(`Install with: aback-ui add <name>`);
  return 0;
}
