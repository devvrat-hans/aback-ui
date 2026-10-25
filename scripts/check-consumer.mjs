#!/usr/bin/env node

/**
 * Consumer test. Proves the npm packages work for someone who installs them
 * from the registry, in a directory with no access to this monorepo's source.
 *
 * It packs both packages with `npm pack`, installs the tarballs into
 * `tests/consumer`, then runs that fixture's tests against the packed output.
 * This is the only check that catches a broken exports map, a missing
 * dependency, a stale dist, or a type declaration that only resolves because
 * of a workspace path alias.
 *
 * Usage: bun run test:consumer
 */

import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const fixtureDir = path.join(root, "tests", "consumer");
const tarballDir = path.join(fixtureDir, "tarballs");
const packages = [
  { dir: "packages/ui", tarball: "aback-ui-ui.tgz" },
  { dir: "packages/tokens", tarball: "aback-ui-tokens.tgz" },
];

const fail = (message) => {
  console.error(`\n✗ ${message}`);
  process.exit(1);
};

console.log("Packing packages…");
rmSync(tarballDir, { recursive: true, force: true });
mkdirSync(tarballDir, { recursive: true });

for (const { dir, tarball } of packages) {
  const packageDir = path.join(root, dir);
  const packed = execFileSync("npm", ["pack", "--pack-destination", tarballDir, "--json"], {
    cwd: packageDir,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  // npm writes aback-ui-ui-0.1.0.tgz; the fixture depends on a stable name.
  const produced = JSON.parse(packed)[0].filename;
  cpSync(path.join(tarballDir, produced), path.join(tarballDir, tarball));
  console.log(`  ${dir} -> ${tarball}`);
}

console.log("\nInstalling into tests/consumer…");
const install = spawnSync("bun", ["install", "--no-save"], {
  cwd: fixtureDir,
  stdio: "inherit",
});
if (install.status !== 0) fail("bun install in tests/consumer failed");

console.log("\nTypechecking the packed declarations…");
const typecheck = spawnSync("bunx", ["tsc", "--noEmit"], { cwd: fixtureDir, stdio: "inherit" });
if (typecheck.status !== 0) fail("type declarations from the packed tarballs do not compile");

console.log("\nRendering from the packed entry points…");
const test = spawnSync("bunx", ["vitest", "run"], { cwd: fixtureDir, stdio: "inherit" });
if (test.status !== 0) fail("consumer render tests failed");

if (!existsSync(path.join(fixtureDir, "node_modules", "@aback-ui", "ui", "dist", "index.js"))) {
  fail("the installed package is missing dist/index.js");
}

console.log("\n✓ Packed packages install and render outside the monorepo");
