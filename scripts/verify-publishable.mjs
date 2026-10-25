#!/usr/bin/env node

/**
 * Publish guard. Runs from `prepublishOnly` in each package.
 *
 * npm will happily publish an empty or broken tarball. This script refuses to
 * let that happen by inspecting what `npm pack` would actually ship: entry
 * points must resolve, the declared LICENSE must be present, and nothing may
 * leak a monorepo path, a localhost URL, or test source.
 */

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

// npm runs lifecycle scripts with cwd set to the package directory, which is
// what we want to inspect. An explicit path argument overrides that for manual
// runs, for example `node scripts/verify-publishable.mjs packages/ui`.
const packageDir = process.argv[2] ?? process.cwd();
const pkg = JSON.parse(readFileSync(path.join(packageDir, "package.json"), "utf8"));

const errors = [];

function fail(message) {
  errors.push(message);
}

// 1. Entry points named in `exports` must exist on disk.
for (const [specifier, target] of Object.entries(pkg.exports ?? {})) {
  if (typeof target === "string") {
    if (!existsSync(path.join(packageDir, target))) {
      fail(`exports["${specifier}"] points at a missing file: ${target}`);
    }
  } else if (target?.import && !existsSync(path.join(packageDir, target.import))) {
    fail(`exports["${specifier}"].import points at a missing file: ${target.import}`);
  }
}

// 2. Every path in `files` must exist, so the tarball is never accidentally empty.
for (const entry of pkg.files ?? []) {
  if (!existsSync(path.join(packageDir, entry))) {
    fail(`files entry "${entry}" does not exist, the tarball would be incomplete`);
  }
}

// 3. The tarball listing, straight from npm. This is the real answer to
//    "what would ship", not what package.json claims.
let packed = "";
try {
  packed = execFileSync("npm", ["pack", "--dry-run", "--json"], {
    cwd: packageDir,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  });
} catch (error) {
  fail(`npm pack --dry-run failed: ${error.message}`);
}

if (packed) {
  const listing = JSON.parse(packed)[0];
  const names = listing.files.map((file) => file.path);

  if (names.length === 0) fail("the tarball is empty");

  if (!names.includes("LICENSE")) {
    fail("LICENSE is not in the tarball; MIT requires the notice to ship");
  }

  if (!names.includes("package.json")) {
    fail("package.json is not in the tarball");
  }

  for (const name of names) {
    if (/\.(test|spec)\.[cm]?[jt]sx?$/.test(name)) {
      fail(`test source would ship: ${name}`);
    }
    if (name.startsWith("src/") && name.endsWith(".test.tsx")) {
      fail(`test source would ship: ${name}`);
    }
    if (name.includes("test-setup") || name.includes("test-utils")) {
      fail(`test helper would ship: ${name}`);
    }
    if (name.endsWith(".tsbuildinfo")) {
      fail(`build cache would ship: ${name}`);
    }
  }

  // 4. No leaked internals in the shipped JavaScript or types.
  const leakPatterns = [
    { pattern: /localhost:\d+/, reason: "a localhost URL would ship" },
    { pattern: /from\s+["']\.\.\/\.\.\//, reason: "a relative path escapes the package root" },
    { pattern: /@aback-ui\/(website|ui|tokens)\/src/, reason: "a monorepo source path would ship" },
    { pattern: /\/Users\/[a-z-]+\//i, reason: "an absolute developer path would ship" },
    { pattern: /\.work\//, reason: "a scratch fixture path would ship" },
  ];

  for (const name of names) {
    if (!/\.(js|d\.ts|json|css)$/.test(name)) continue;
    const content = readFileSync(path.join(packageDir, name), "utf8");
    for (const { pattern, reason } of leakPatterns) {
      if (pattern.test(content)) fail(`${name}: ${reason}`);
    }
  }

  console.log(`  ${pkg.name} would publish ${names.length} files (${listing.size} bytes)`);
}

if (errors.length > 0) {
  console.error(`\n✗ ${pkg.name} is not publishable:`);
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`✓ ${pkg.name} is publishable`);
