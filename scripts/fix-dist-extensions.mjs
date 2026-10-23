#!/usr/bin/env node

/**
 * The canonical source uses extensionless relative imports so the docs app and
 * bundlers can resolve it directly. Node ESM requires extensions, so the built
 * dist gets `.js` appended to relative specifiers. This runs after tsc.
 */

import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "packages", "ui", "dist");

const IMPORT_PATTERN =
  /((?:\bfrom\s*|\bimport\s*)(["']))(\.{1,2}\/[^"']+)(\2)/g;

function withExtension(specifier) {
  if (/\.(?:js|mjs|cjs|json|css)$/i.test(specifier)) return specifier;
  return `${specifier}.js`;
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      await walk(absolute);
    } else if (/\.(?:js|d\.ts)$/.test(entry.name)) {
      const source = await readFile(absolute, "utf8");
      const output = source.replace(
        IMPORT_PATTERN,
        (_match, prefix, quote, specifier, closingQuote) =>
          `${prefix}${withExtension(specifier)}${closingQuote ?? quote}`,
      );
      if (output !== source) await writeFile(absolute, output, "utf8");
    }
  }
}

await walk(dist);
console.log("Normalized relative import extensions in packages/ui/dist.");
