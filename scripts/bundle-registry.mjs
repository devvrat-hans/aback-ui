#!/usr/bin/env node

// Copies the generated registry into the CLI package so `npx aback-ui add`
// installs from the files shipped with that CLI version, with no website in
// the path. The source is website/public/r, which `bun run check:registry`
// keeps in step with registry/registry.json.

import { existsSync } from "node:fs";
import { copyFile, mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "website", "public", "r");
const target = path.join(root, "packages", "cli", "registry");

if (!existsSync(path.join(source, "index.json"))) {
  console.error(`No registry at ${path.relative(root, source)}. Run \`bun run build:registry\` first.`);
  process.exit(1);
}

await rm(target, { recursive: true, force: true });
await mkdir(target, { recursive: true });
const files = (await readdir(source)).filter((file) => file.endsWith(".json"));
for (const file of files) {
  await copyFile(path.join(source, file), path.join(target, file));
}
console.log(`Bundled ${files.length} registry files into packages/cli/registry.`);
