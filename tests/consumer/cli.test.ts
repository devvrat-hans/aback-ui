// @vitest-environment node
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

const here = path.dirname(new URL(import.meta.url).pathname);
const bin = path.join(here, "node_modules", "aback-ui", "dist", "index.js");
const noNetwork = path.join(here, "no-network.mjs");

let project: string;

function cli(...args: string[]) {
  // No registry override: the CLI must use the copy bundled in its package.
  const env = { ...process.env };
  delete env.ABACK_UI_REGISTRY;
  const result = spawnSync("node", ["--import", noNetwork, bin, ...args, "--cwd", project], {
    encoding: "utf8",
    env,
  });
  return { code: result.status, output: `${result.stdout}${result.stderr}` };
}

beforeAll(async () => {
  project = await mkdtemp(path.join(tmpdir(), "aback-ui-consumer-"));
  const files: Record<string, string> = {
    "package.json": JSON.stringify({
      name: "consumer-app",
      private: true,
      dependencies: { next: "16.0.0", react: "19.0.0", "react-dom": "19.0.0" },
      devDependencies: { tailwindcss: "^4.3.3", typescript: "^5.9.3" },
    }),
    "tsconfig.json": JSON.stringify({ compilerOptions: { baseUrl: ".", paths: { "@/*": ["./src/*"] } } }),
    "src/app/globals.css": '@import "tailwindcss";\n',
  };
  for (const [file, content] of Object.entries(files)) {
    await mkdir(path.dirname(path.join(project, file)), { recursive: true });
    await writeFile(path.join(project, file), content);
  }
});

afterAll(async () => {
  await rm(project, { recursive: true, force: true });
});

describe("the packed aback-ui CLI", () => {
  it("initializes a project from its bundled registry with the network blocked", () => {
    const result = cli("init", "--yes", "--no-install");
    expect(result.output).not.toContain("network blocked");
    expect(result.code).toBe(0);
    expect(existsSync(path.join(project, "aback-ui.json"))).toBe(true);
    expect(existsSync(path.join(project, "styles", "aback.css"))).toBe(true);
    expect(existsSync(path.join(project, "src", "lib", "utils.ts"))).toBe(true);
  });

  it("adds a component and a block with their dependencies", async () => {
    const result = cli("add", "dialog", "sign-in", "--yes", "--no-install");
    expect(result.output).not.toContain("network blocked");
    expect(result.code).toBe(0);
    for (const file of ["dialog.tsx", "button.tsx", "field.tsx", "input.tsx"]) {
      expect(existsSync(path.join(project, "src", "components", "ui", file))).toBe(true);
    }
    const block = await readFile(path.join(project, "src", "components", "blocks", "sign-in.tsx"), "utf8");
    expect(block).toContain('from "@/components/ui/button"');
  });

  it("writes its own config file, not a shadcn one", async () => {
    expect(existsSync(path.join(project, "components.json"))).toBe(false);
    const config = JSON.parse(await readFile(path.join(project, "aback-ui.json"), "utf8")) as { $schema: string };
    expect(config.$schema).toBe("https://abackui.com/schema/aback-ui.json");
    expect(await readFile(path.join(project, "src", "app", "globals.css"), "utf8")).toContain("aback.css");
  });
});
