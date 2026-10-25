import { writeFile } from "node:fs/promises";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { RegistryClient, RegistryError } from "./registry.js";
import { createRegistry, type CreatedRegistry } from "./test-utils/fixtures.js";

let registry: CreatedRegistry;

beforeEach(async () => {
  registry = await createRegistry();
});

afterEach(async () => {
  await registry.cleanup();
});

function client() {
  return new RegistryClient({ registry: registry.dir, cwd: registry.dir });
}

describe("RegistryClient", () => {
  it("resolves dependencies before the items that need them", async () => {
    const items = await client().collect(["button"]);
    expect(items.map((item) => item.name)).toEqual(["utils", "button"]);
  });

  it("deduplicates repeated items", async () => {
    const items = await client().collect(["button", "utils", "button"]);
    expect(items.filter((item) => item.name === "utils")).toHaveLength(1);
    expect(items).toHaveLength(2);
  });

  it("loads an item from an absolute file path", async () => {
    const item = await client().item(path.join(registry.dir, "button.json"));
    expect(item.name).toBe("button");
  });

  it("rejects circular dependencies", async () => {
    await expect(client().collect(["cyclic-a"])).rejects.toThrow(RegistryError);
    await expect(client().collect(["cyclic-a"])).rejects.toThrow(/Circular/);
  });

  it("rejects an item without files", async () => {
    await expect(client().item("missing")).rejects.toThrow(/not found/);
  });

  it("reads the registry index", async () => {
    const index = await client().index();
    expect(index.items.map((item) => item.name)).toContain("button");
  });

  it("resolves production dependency URLs against a local registry", async () => {
    await writeFile(
      path.join(registry.dir, "remote-button.json"),
      JSON.stringify({
        name: "remote-button",
        type: "registry:ui",
        files: [
          {
            path: "components/ui/remote-button.tsx",
            target: "components/ui/remote-button.tsx",
            content: "export const remote = true;\n",
          },
        ],
        registryDependencies: ["https://abackui.com/r/utils.json"],
      }),
      "utf8",
    );

    const items = await client().collect(["remote-button"]);
    expect(items.map((item) => item.name)).toEqual(["utils", "remote-button"]);
  });

  it("leaves third-party registry dependency URLs untouched", async () => {
    await writeFile(
      path.join(registry.dir, "third-party.json"),
      JSON.stringify({
        name: "third-party",
        type: "registry:ui",
        files: [
          {
            path: "components/ui/third-party.tsx",
            target: "components/ui/third-party.tsx",
            content: "export const thirdParty = true;\n",
          },
        ],
        registryDependencies: ["https://example.com/r/other.json"],
      }),
      "utf8",
    );

    const offline = new RegistryClient({
      registry: registry.dir,
      cwd: registry.dir,
      fetchImpl: async () => {
        throw new Error("offline test");
      },
    });
    await expect(offline.collect(["third-party"])).rejects.toThrow(
      /Could not reach https:\/\/example\.com\/r\/other\.json/,
    );
  });
});
