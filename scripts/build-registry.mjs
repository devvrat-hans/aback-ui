#!/usr/bin/env node

import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const registryPath = path.join(root, "registry", "registry.json");
const outDir = path.join(root, "website", "public", "r");
const generatedTsPath = path.join(root, "website", "src", "data", "registry.generated.ts");
const check = process.argv.includes("--check");
const PRODUCTION_BASE = "https://abackui.com";
const baseUrlArgument = process.argv.find((argument) =>
  argument.startsWith("--base-url="),
);
const runtimeBase = baseUrlArgument
  ? baseUrlArgument.slice("--base-url=".length).replace(/\/$/, "")
  : PRODUCTION_BASE;

function resolveRegistryDependencies(dependencies) {
  if (!dependencies) return undefined;
  return dependencies.map((dependency) =>
    dependency.startsWith(`${PRODUCTION_BASE}/r/`)
      ? `${runtimeBase}${dependency.slice(PRODUCTION_BASE.length)}`
      : dependency,
  );
}

const ITEM_TYPES = new Set([
  "registry:ui",
  "registry:lib",
  "registry:file",
  "registry:style",
  "registry:block",
]);
const TARGET_PREFIXES = ["components/ui/", "components/blocks/", "lib/", "styles/"];
const PEER_PACKAGES = new Set(["react", "react-dom"]);
const NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// Must match CATEGORY_ORDER in website/src/data/component-catalog.ts. A
// component outside these is silently left out of the catalogue and search.
const UI_CATEGORIES = new Set([
  "Foundation",
  "Layout",
  "Forms",
  "Feedback",
  "Overlays",
  "Navigation",
  "Data Display",
  "Application",
]);

const errors = [];

function fail(message) {
  errors.push(message);
}

function securityIssues(content, filePath) {
  const patterns = [
    /(?:api[_-]?key|secret|access[_-]?token|private[_-]?key)\s*[:=]\s*["'][A-Za-z0-9_\-/+=]{16,}["']/i,
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    /sk_live_[A-Za-z0-9]{16,}/,
  ];
  if (patterns.some((pattern) => pattern.test(content))) {
    fail(`${filePath}: possible secret committed in registry source`);
  }
}

function transformForConsumer(content, itemName) {
  let output = content;

  // Canonical source uses a relative import so the package build is plain ESM.
  // The copied file lives at components/ui and imports the installed lib alias.
  output = output.replaceAll('from "../lib/utils.js"', 'from "@/lib/utils"');
  output = output.replaceAll('from "../lib/utils"', 'from "@/lib/utils"');
  output = output.replaceAll("from '../lib/utils.js'", 'from "@/lib/utils"');
  output = output.replaceAll("from '../lib/utils'", 'from "@/lib/utils"');

  // Composed components import siblings with a relative path so the package
  // build resolves them. The installed copy must use the consumer alias and
  // declare the sibling as a registry dependency instead.
  output = output.replace(
    /(from\s+["'])(\.\/([a-z0-9-]+))(["'])/g,
    (match, prefix, relative, name, closing) => {
      const sibling = path.join(root, "packages", "ui", "src", "components", `${name}.tsx`);
      return existsSync(sibling) ? `${prefix}@/components/ui/${name}${closing}` : match;
    },
  );

  if (output.includes("../lib/utils")) {
    fail(`${itemName}: could not rewrite the lib/utils import`);
  }

  return output;
}

function validateImports(content, item, filePath) {
  const dependencies = new Set(item.dependencies ?? []);
  const registryDependencies = new Set(item.registryDependencies ?? []);
  const hasUtilsDependency =
    item.name === "utils" ||
    [...registryDependencies].some(
      (dependency) => dependency === "utils" || dependency.endsWith("/r/utils.json"),
    );

  const importPattern = /(?:from\s+|import\s*)["']([^"']+)["']/g;
  for (const match of content.matchAll(importPattern)) {
    const specifier = match[1];
    if (!specifier) continue;

    if (specifier.startsWith(".")) {
      fail(
        `${filePath}: relative import "${specifier}" would break after installation. Use the installed alias instead.`,
      );
      continue;
    }

    if (specifier === "@/lib/utils") {
      if (!hasUtilsDependency) {
        fail(`${filePath}: imports @/lib/utils but the item does not depend on the utils item`);
      }
      continue;
    }

    if (specifier.startsWith("@/components/ui/")) {
      const sibling = specifier.slice("@/components/ui/".length);
      const declared = [...registryDependencies].some(
        (dependency) => dependency === sibling || dependency.endsWith(`/r/${sibling}.json`),
      );
      if (!declared) {
        fail(
          `${filePath}: imports ${specifier} but the item does not declare the "${sibling}" registry dependency`,
        );
      }
      continue;
    }

    if (specifier.startsWith("@/")) {
      fail(`${filePath}: unresolved path alias "${specifier}"`);
      continue;
    }

    if (specifier.startsWith("node:") || specifier === "fs" || specifier === "path") {
      fail(`${filePath}: Node built-in "${specifier}" is not allowed in component source`);
      continue;
    }

    if (PEER_PACKAGES.has(specifier)) continue;

    const packageName = specifier.startsWith("@")
      ? specifier.split("/").slice(0, 2).join("/")
      : specifier.split("/")[0];

    if (!dependencies.has(packageName)) {
      fail(
        `${filePath}: imports "${specifier}" but "${packageName}" is missing from dependencies`,
      );
    }
  }
}

function toSummary(item) {
  return {
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    ...(item.categories ? { categories: item.categories } : {}),
    ...(item.docs ? { docs: item.docs } : {}),
    ...(item.dependencies ? { dependencies: item.dependencies } : {}),
    ...(item.registryDependencies ? { registryDependencies: item.registryDependencies } : {}),
    ...(item.meta ? { meta: item.meta } : {}),
  };
}

function serialise(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

async function main() {
  const config = JSON.parse(await readFile(registryPath, "utf8"));
  const names = new Set();
  const outputFiles = new Map();
  const items = [];

  if (!Array.isArray(config.items) || config.items.length === 0) {
    throw new Error("registry/registry.json has no items");
  }

  for (const item of config.items) {
    if (!item.name || !NAME_PATTERN.test(item.name)) {
      fail(`invalid item name: ${JSON.stringify(item.name)}`);
      continue;
    }
    if (names.has(item.name)) {
      fail(`duplicate item name: ${item.name}`);
    }
    names.add(item.name);

    if (!ITEM_TYPES.has(item.type)) {
      fail(`${item.name}: unsupported type "${item.type}"`);
    }
    if (!item.title || !item.description) {
      fail(`${item.name}: title and description are required`);
    }
    if (item.type === "registry:ui") {
      const category = item.categories?.[0];
      if (!category || !UI_CATEGORIES.has(category)) {
        fail(`${item.name}: category "${category}" is not one of ${[...UI_CATEGORIES].join(", ")}`);
      }
    }
    if (!Array.isArray(item.files) || item.files.length === 0) {
      fail(`${item.name}: at least one file is required`);
      continue;
    }

    const files = [];
    for (const file of item.files) {
      if (!file.path || !file.target) {
        fail(`${item.name}: every file needs a path and target`);
        continue;
      }
      const normalizedTarget = file.target.replace(/^~\//, "");
      if (!TARGET_PREFIXES.some((prefix) => normalizedTarget.startsWith(prefix))) {
        fail(`${item.name}: target "${file.target}" is outside the allowed install directories`);
      }
      if (normalizedTarget.includes("..")) {
        fail(`${item.name}: target "${file.target}" contains a path traversal segment`);
      }

      const absolutePath = path.join(root, file.path);
      if (!existsSync(absolutePath)) {
        fail(`${item.name}: source file does not exist at ${file.path}`);
        continue;
      }

      const raw = await readFile(absolutePath, "utf8");
      securityIssues(raw, file.path);
      const isCss = /\.css$/i.test(file.path);
      const content = isCss ? raw : transformForConsumer(raw, item.name);
      if (!isCss) validateImports(content, item, file.path);

      files.push({
        path: file.target,
        content,
        type: file.type ?? item.type,
        target: file.target,
      });
    }

    const builtItem = {
      $schema: "https://abackui.com/schema/registry-item.json",
      name: item.name,
      type: item.type,
      title: item.title,
      description: item.description,
      ...(item.author ? { author: item.author } : {}),
      ...(item.dependencies ? { dependencies: item.dependencies } : {}),
      ...(item.devDependencies ? { devDependencies: item.devDependencies } : {}),
      ...(item.registryDependencies
        ? { registryDependencies: resolveRegistryDependencies(item.registryDependencies) }
        : {}),
      ...(item.categories ? { categories: item.categories } : {}),
      ...(item.docs ? { docs: item.docs } : {}),
      ...(item.meta ? { meta: item.meta } : {}),
      files,
    };

    outputFiles.set(`${item.name}.json`, serialise(builtItem));
    items.push(builtItem);
  }

  const index = {
    $schema: "https://abackui.com/schema/registry.json",
    name: config.name,
    homepage: config.homepage,
    items: items.map(toSummary),
  };
  outputFiles.set("index.json", serialise(index));

  const summaries = items.map((item) => ({
    name: item.name,
    type: item.type,
    title: item.title,
    description: item.description,
    ...(item.categories ? { categories: item.categories } : {}),
    ...(item.docs ? { docs: item.docs } : {}),
    ...(item.dependencies ? { dependencies: item.dependencies } : {}),
    ...(item.registryDependencies
      ? { registryDependencies: item.registryDependencies }
      : {}),
    ...(item.meta ? { meta: item.meta } : {}),
    files: item.files.map((file) => file.path),
  }));

  const generatedTs = `// Generated by scripts/build-registry.mjs. Do not edit by hand.\n\nexport interface RegistryItemSummary {\n  name: string;\n  type: string;\n  title: string;\n  description: string;\n  categories?: string[];\n  docs?: string;\n  dependencies?: string[];\n  registryDependencies?: string[];\n  meta?: {\n    status?: string;\n    usedIn?: string[];\n  };\n  files: string[];\n}\n\nexport const registryItems: RegistryItemSummary[] = ${JSON.stringify(summaries, null, 2)};\n`;

  if (errors.length > 0) {
    console.error(`Registry validation failed with ${errors.length} error(s):\n`);
    for (const error of errors) console.error(`  - ${error}`);
    process.exit(1);
  }

  if (check) {
    const stale = [];
    for (const [fileName, expected] of outputFiles) {
      const absolute = path.join(outDir, fileName);
      if (!existsSync(absolute)) {
        stale.push(`${fileName} (missing)`);
        continue;
      }
      const actual = await readFile(absolute, "utf8");
      if (actual !== expected) stale.push(`${fileName} (out of date)`);
    }

    const generatedActual = existsSync(generatedTsPath)
      ? await readFile(generatedTsPath, "utf8")
      : null;
    if (generatedActual !== generatedTs) {
      stale.push("website/src/data/registry.generated.ts (out of date)");
    }

    if (stale.length > 0) {
      console.error("Registry output is stale. Run `bun run build:registry`:\n");
      for (const entry of stale) console.error(`  - ${entry}`);
      process.exit(1);
    }

    console.log(`Registry is up to date (${items.length} items).`);
    return;
  }

  await mkdir(outDir, { recursive: true });
  await mkdir(path.dirname(generatedTsPath), { recursive: true });

  const existing = await readdir(outDir);
  const expectedNames = new Set(outputFiles.keys());
  for (const fileName of existing) {
    if (fileName.endsWith(".json") && !expectedNames.has(fileName)) {
      console.warn(`note: ${fileName} exists in public/r but is not generated by the registry`);
    }
  }

  for (const [fileName, content] of outputFiles) {
    await writeFile(path.join(outDir, fileName), content, "utf8");
  }
  await writeFile(generatedTsPath, generatedTs, "utf8");

  console.log(
    `Built ${items.length} registry items -> website/public/r (${outputFiles.size} files).`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
