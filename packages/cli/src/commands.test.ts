import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { runAdd } from "./commands/add.js";
import { runDiff } from "./commands/diff.js";
import { runDoctor } from "./commands/doctor.js";
import { runInit } from "./commands/init.js";
import { runList } from "./commands/list.js";
import { runView } from "./commands/view.js";
import type { InstallDependenciesOptions } from "./install.js";
import type { RegistryFetch } from "./types.js";
import {
  acceptPrompter,
  captureLogger,
  createProject,
  createRegistry,
  denyPrompter,
  type CreatedProject,
  type CreatedRegistry,
} from "./test-utils/fixtures.js";

let project: CreatedProject;
let registry: CreatedRegistry;

beforeEach(async () => {
  project = await createProject({ withConfig: false });
  registry = await createRegistry();
});

afterEach(async () => {
  await project.cleanup();
  await registry.cleanup();
});

async function read(file: string): Promise<string> {
  return readFile(path.join(project.root, file), "utf8");
}

const neverFetch: RegistryFetch = async () => {
  throw new Error("network should not be used in tests");
};

describe("init", () => {
  it("writes config, theme, utilities, and the stylesheet import", async () => {
    const { logger, lines } = captureLogger();
    const installs: InstallDependenciesOptions[] = [];

    const code = await runInit({
      cwd: project.root,
      registry: registry.dir,
      logger,
      prompter: denyPrompter,
      fetchImpl: neverFetch,
      installPackages: async (options) => {
        installs.push(options);
      },
    });

    expect(code).toBe(0);

    const config = JSON.parse(await read("components.json")) as {
      aliases: { ui: string };
      tailwind: { css: string };
      registries: Record<string, string>;
    };
    expect(config.aliases.ui).toBe("@/components/ui");
    expect(config.tailwind.css).toBe("src/app/globals.css");
    expect(config.registries["@aback"]).toContain("{name}");

    expect(await read("src/lib/utils.ts")).toContain("export function cn");
    expect(await read("styles/aback.css")).toContain("--color-brand");
    expect(await read("src/app/globals.css")).toBe(
      '@import "tailwindcss";\n@import "../../styles/aback.css";\n\n:root { color-scheme: light; }\n',
    );

    expect(installs[0]?.dependencies).toEqual(["clsx", "tailwind-merge"]);
    expect(lines.some((line) => line.includes("Aback UI is ready"))).toBe(true);
  });

  it("does nothing when components.json already exists", async () => {
    const { logger, lines } = captureLogger();
    const withConfig = await createProject({ withConfig: true });
    try {
      const code = await runInit({
        cwd: withConfig.root,
        registry: registry.dir,
        logger,
        prompter: denyPrompter,
        installPackages: async () => {},
      });
      expect(code).toBe(0);
      expect(lines.some((line) => line.includes("already exists"))).toBe(true);
    } finally {
      await withConfig.cleanup();
    }
  });

  it("refuses a project without Tailwind", async () => {
    const plain = await createProject({ withConfig: false });
    try {
      await writeFile(
        path.join(plain.root, "package.json"),
        JSON.stringify({ name: "plain", dependencies: { react: "19.0.0" } }),
      );
      const { logger } = captureLogger();
      await expect(
        runInit({
          cwd: plain.root,
          registry: registry.dir,
          logger,
          prompter: denyPrompter,
          installPackages: async () => {},
        }),
      ).rejects.toThrow(/Tailwind/);
    } finally {
      await plain.cleanup();
    }
  });
});

describe("add", () => {
  beforeEach(async () => {
    await project.cleanup();
    project = await createProject({ withConfig: true });
  });

  it("writes the component and its registry dependency", async () => {
    const { logger } = captureLogger();
    const installs: InstallDependenciesOptions[] = [];

    const code = await runAdd({
      cwd: project.root,
      items: ["button"],
      registry: registry.dir,
      logger,
      prompter: denyPrompter,
      noInstall: true,
      installPackages: async (options) => {
        installs.push(options);
      },
    });

    expect(code).toBe(0);
    expect(await read("src/components/ui/button.tsx")).toContain("export const button");
    expect(await read("src/lib/utils.ts")).toContain("export function cn");
    expect(installs[0]?.dependencies).toEqual([
      "class-variance-authority",
      "clsx",
      "radix-ui",
      "tailwind-merge",
    ]);
  });

  it("installs a block into components/blocks", async () => {
    const { logger } = captureLogger();
    await runAdd({
      cwd: project.root,
      items: ["sign-in"],
      registry: registry.dir,
      logger,
      prompter: denyPrompter,
      noInstall: true,
      installPackages: async () => {},
    });

    expect(await read("src/components/blocks/sign-in.tsx")).toContain("SignInBlock");
  });

  it("keeps a local edit unless overwrite is explicit", async () => {
    const { logger } = captureLogger();
    const base = {
      cwd: project.root,
      items: ["button"],
      registry: registry.dir,
      logger,
      installPackages: async () => {},
    };

    await runAdd({ ...base, prompter: denyPrompter });
    await writeFile(path.join(project.root, "src/components/ui/button.tsx"), "// local\n");

    await runAdd({ ...base, prompter: denyPrompter });
    expect(await read("src/components/ui/button.tsx")).toBe("// local\n");

    await runAdd({ ...base, prompter: acceptPrompter, overwrite: true });
    expect(await read("src/components/ui/button.tsx")).toContain("export const button");
  });

  it("changes nothing on a dry run", async () => {
    const { logger } = captureLogger();
    await runAdd({
      cwd: project.root,
      items: ["button"],
      registry: registry.dir,
      logger,
      prompter: denyPrompter,
      dryRun: true,
      installPackages: async () => {},
    });

    await expect(read("src/components/ui/button.tsx")).rejects.toThrow();
  });

  it("rejects a target that escapes the project", async () => {
    const { logger } = captureLogger();
    await expect(
      runAdd({
        cwd: project.root,
        items: ["escape"],
        registry: registry.dir,
        logger,
        prompter: denyPrompter,
        installPackages: async () => {},
      }),
    ).rejects.toThrow(/outside the project root|traversal/);
  });

  it("requires components.json", async () => {
    const plain = await createProject({ withConfig: false });
    try {
      const { logger } = captureLogger();
      await expect(
        runAdd({
          cwd: plain.root,
          items: ["button"],
          registry: registry.dir,
          logger,
          prompter: denyPrompter,
          installPackages: async () => {},
        }),
      ).rejects.toThrow(/aback-ui init/);
    } finally {
      await plain.cleanup();
    }
  });
});

describe("diff", () => {
  beforeEach(async () => {
    await project.cleanup();
    project = await createProject({ withConfig: true });
  });

  it("reports unchanged files after an install", async () => {
    await runAdd({
      cwd: project.root,
      items: ["button"],
      registry: registry.dir,
      logger: captureLogger().logger,
      prompter: denyPrompter,
      installPackages: async () => {},
    });

    const { logger, lines } = captureLogger();
    await runDiff({ cwd: project.root, items: ["button"], registry: registry.dir, logger });
    expect(lines.join("\n")).toContain("match the registry");
  });

  it("prints the local and registry lines for a modified file", async () => {
    const target = path.join(project.root, "src/components/ui/button.tsx");
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, "// local edit\n");

    const { logger, lines } = captureLogger();
    await runDiff({ cwd: project.root, items: ["button"], registry: registry.dir, logger });
    const output = lines.join("\n");
    expect(output).toContain("// local edit");
    expect(output).toContain("differ");
  });

  it("reports a file that is not installed", async () => {
    const { logger, lines } = captureLogger();
    await runDiff({ cwd: project.root, items: ["utils"], registry: registry.dir, logger });
    expect(lines.join("\n")).toContain("missing");
  });

  it("supports json output", async () => {
    const { logger, lines } = captureLogger();
    await runDiff({
      cwd: project.root,
      items: ["utils"],
      registry: registry.dir,
      logger,
      json: true,
    });
    const parsed = JSON.parse(lines.join("\n")) as Array<{ status: string }>;
    expect(parsed[0]?.status).toBe("missing");
  });
});

describe("doctor", () => {
  beforeEach(async () => {
    await project.cleanup();
    project = await createProject({ withConfig: true });
  });

  it("reports warnings for a configured but incomplete project", async () => {
    const { logger, lines } = captureLogger();
    const code = await runDoctor({ cwd: project.root, logger });
    const output = lines.join("\n");

    expect(code).toBe(0);
    expect(output).toContain("Aback UI doctor");
    expect(output).toContain("utils");
    expect(output).toContain("warning");
  });

  it("passes after init installs the theme and utilities", async () => {
    await runInit({
      cwd: project.root,
      registry: registry.dir,
      force: true,
      yes: true,
      logger: captureLogger().logger,
      prompter: denyPrompter,
      installPackages: async () => {},
    });

    const { logger, lines } = captureLogger();
    const code = await runDoctor({ cwd: project.root, logger });

    expect(code).toBe(0);
    expect(lines.join("\n")).toContain("0 errors");
    expect(lines.join("\n")).toContain("Everything checks out.");
  });

  it("fails when components.json is missing", async () => {
    const plain = await createProject({ withConfig: false });
    try {
      const { logger, lines } = captureLogger();
      const code = await runDoctor({ cwd: plain.root, logger });

      expect(code).toBe(1);
      expect(lines.join("\n")).toContain("components.json");
      expect(lines.join("\n")).toContain("aback-ui init");
    } finally {
      await plain.cleanup();
    }
  });

  it("supports json output", async () => {
    const { logger, lines } = captureLogger();
    await runDoctor({ cwd: project.root, logger, json: true });
    const report = JSON.parse(lines.join("\n")) as {
      summary: { warnings: number; errors: number };
      checks: Array<{ id: string }>;
    };

    expect(report.summary.errors).toBe(0);
    expect(report.summary.warnings).toBeGreaterThan(0);
    expect(report.checks.some((check) => check.id === "tailwind")).toBe(true);
  });
});

describe("list and view", () => {
  it("lists registry items and supports json output", async () => {
    const { logger, lines } = captureLogger();
    await runList({ registry: registry.dir, logger });
    expect(lines.join("\n")).toContain("button");

    const json = captureLogger();
    await runList({ registry: registry.dir, logger: json.logger, json: true, query: "button" });
    const parsed = JSON.parse(json.lines.join("\n")) as Array<{ name: string }>;
    expect(parsed[0]?.name).toBe("button");
  });

  it("prints item details", async () => {
    const { logger, lines } = captureLogger();
    await runView({ item: "button", registry: registry.dir, logger });
    expect(lines).toContain("Files");
    expect(lines.join("\n")).toContain("components/ui/button.tsx");
  });
});
