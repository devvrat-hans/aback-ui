#!/usr/bin/env node

import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageDir = path.join(root, "packages", "ui");
const dist = path.join(packageDir, "dist");

const requiredExports = [
  "Accordion",
  "AccordionContent",
  "AccordionItem",
  "AccordionTrigger",
  "Alert",
  "AlertDescription",
  "AlertTitle",
  "Badge",
  "Breadcrumbs",
  "Button",
  "Card",
  "CardContent",
  "CardDescription",
  "CardFooter",
  "CardHeader",
  "CardTitle",
  "Checkbox",
  "Dialog",
  "DialogContent",
  "DropdownMenu",
  "DropdownMenuContent",
  "EmptyState",
  "Field",
  "Input",
  "Kbd",
  "Label",
  "PageHeader",
  "Select",
  "Separator",
  "Skeleton",
  "Spinner",
  "Switch",
  "Table",
  "Tabs",
  "Textarea",
  "Tooltip",
  "cn",
];

function fail(message) {
  console.error(`Package check failed: ${message}`);
  process.exit(1);
}

if (!existsSync(path.join(dist, "index.js"))) fail("dist/index.js is missing. Run build:ui.");
if (!existsSync(path.join(dist, "index.d.ts"))) fail("dist/index.d.ts is missing.");
if (existsSync(path.join(dist, "test-utils"))) fail("test utilities were published in dist.");
if (existsSync(path.join(dist, "components", "button.test.js"))) fail("tests were published in dist.");

const module = await import(pathToFileURL(path.join(dist, "index.js")).href);
for (const name of requiredExports) {
  if (!(name in module)) fail(`missing export: ${name}`);
}

const clientComponents = ["dialog", "dropdown-menu", "tabs", "accordion", "checkbox", "switch", "tooltip"];
for (const component of clientComponents) {
  const source = await readFile(path.join(dist, "components", `${component}.js`), "utf8");
  if (!source.startsWith('"use client";')) {
    fail(`dist/components/${component}.js does not preserve the use client directive`);
  }
}

const files = await readdir(dist, { recursive: true });
for (const file of files) {
  if (!/\.(js|d\.ts)$/.test(file)) continue;
  const source = await readFile(path.join(dist, file), "utf8");
  if (/(?:from|import)\s*["']\.{1,2}\/[^"']*(?<!\.js)(?<!\.json)["']/.test(source)) {
    fail(`dist/${file} contains a relative import without a file extension`);
  }
}

const pkg = JSON.parse(await readFile(path.join(packageDir, "package.json"), "utf8"));
if (!pkg.exports?.["."]?.import || !pkg.exports?.["."]?.types) {
  fail("package.json exports are incomplete");
}

console.log(`UI package smoke test passed: ${requiredExports.length} public exports, ${clientComponents.length} client modules checked.`);
