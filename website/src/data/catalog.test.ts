import { describe, expect, it } from "vitest";

import { blockPreviewMap } from "@/block-previews";
import { exampleMap } from "@/examples";
import { blockDocs, blocks } from "./blocks";
import { componentDocs } from "./component-docs";
import { componentGroups, components } from "./component-catalog";
import { registryItems } from "./registry.generated";

// The docs pages 404 when any of these pieces is missing, so a new registry
// item without its example or API notes fails here instead of in production.
describe("documentation catalogue", () => {
  it("lists every component in exactly one category group", () => {
    const grouped = componentGroups.flatMap((group) => group.items.map((item) => item.name));
    expect(grouped.sort()).toEqual(components.map((item) => item.name).sort());
  });

  it("has an example and API docs for every component", () => {
    for (const item of components) {
      expect(exampleMap[item.name], `${item.name} example`).toBeDefined();
      expect(componentDocs[item.name], `${item.name} docs`).toBeDefined();
      expect(componentDocs[item.name]!.api.length, `${item.name} API rows`).toBeGreaterThan(0);
    }
  });

  it("has a preview and notes for every block", () => {
    for (const block of blocks) {
      expect(blockPreviewMap[block.name], `${block.name} preview`).toBeDefined();
      expect(blockDocs[block.name], `${block.name} docs`).toBeDefined();
    }
  });

  it("links related components that exist", () => {
    const names = new Set(registryItems.map((item) => item.name));
    for (const [name, doc] of Object.entries(componentDocs)) {
      for (const related of doc.related) expect(names.has(related), `${name} -> ${related}`).toBe(true);
    }
    for (const [name, doc] of Object.entries(blockDocs)) {
      for (const related of doc.related) expect(names.has(related), `${name} -> ${related}`).toBe(true);
    }
  });
});
