import type { Logger } from "../logger.js";
import { DEFAULT_REGISTRY, RegistryClient } from "../registry.js";
import type { RegistryFetch } from "../types.js";

export interface ViewCommandOptions {
  item: string;
  registry?: string;
  json?: boolean;
  logger: Logger;
  fetchImpl?: RegistryFetch;
}

export async function runView(options: ViewCommandOptions): Promise<number> {
  const client = new RegistryClient({
    registry: options.registry ?? process.env.ABACK_UI_REGISTRY ?? DEFAULT_REGISTRY,
    fetchImpl: options.fetchImpl,
  });

  const item = await client.item(options.item);
  if (options.json) {
    options.logger.raw(JSON.stringify(item, null, 2));
    return 0;
  }

  const { logger } = options;
  logger.raw(item.title ?? item.name);
  logger.dim(`${item.name} · ${item.type}`);
  logger.raw("");
  logger.raw(item.description ?? "No description.");
  logger.raw("");

  const sections: Array<[string, string]> = [];
  if (item.categories?.length) sections.push(["Categories", item.categories.join(", ")]);
  if (item.dependencies?.length) sections.push(["Dependencies", item.dependencies.join(", ")]);
  if (item.devDependencies?.length) {
    sections.push(["Dev dependencies", item.devDependencies.join(", ")]);
  }
  if (item.registryDependencies?.length) {
    sections.push(["Registry dependencies", item.registryDependencies.join(", ")]);
  }
  if (item.meta?.status) sections.push(["Status", String(item.meta.status)]);
  if (item.docs) sections.push(["Docs", item.docs]);

  for (const [label, value] of sections) {
    logger.raw(`${label.padEnd(20)} ${value}`);
  }

  logger.raw("");
  logger.raw("Files");
  for (const file of item.files) {
    logger.raw(`  ${file.target ?? file.path}`);
  }

  return 0;
}
