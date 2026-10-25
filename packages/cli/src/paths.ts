import path from "node:path";

import type { InstallDirs } from "./types.js";

export class PathSafetyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PathSafetyError";
  }
}

/** Resolve a project-relative path and refuse anything that escapes the root. */
export function safeJoin(root: string, relative: string): string {
  if (relative.includes("\0")) {
    throw new PathSafetyError(`Invalid path: ${JSON.stringify(relative)}`);
  }
  if (path.isAbsolute(relative)) {
    throw new PathSafetyError(
      `Refusing absolute install target "${relative}". Targets must be project-relative.`,
    );
  }

  const absolute = path.resolve(root, relative);
  const check = path.relative(root, absolute);
  if (check === ".." || check.startsWith(`..${path.sep}`) || path.isAbsolute(check)) {
    throw new PathSafetyError(
      `Refusing install target "${relative}": it resolves outside the project root.`,
    );
  }
  return absolute;
}

const TARGET_PREFIXES = [
  "components/ui",
  "components/blocks",
  "components",
  "lib",
  "hooks",
  "styles",
] as const;

/**
 * Map a registry `target` to a file inside the consumer project.
 *
 * `components/ui/button.tsx` -> the configured ui alias,
 * `lib/utils.ts` -> the configured lib alias,
 * `~/styles/aback.css` -> the project styles directory.
 */
export function resolveTargetPath(
  target: string,
  dirs: InstallDirs,
  projectRoot: string,
): string {
  if (!target || target.trim().length === 0) {
    throw new PathSafetyError("Registry item contains a file with an empty target.");
  }

  const normalized = target.replace(/^~\//, "").replace(/^@\//, "").replace(/\\/g, "/");
  if (normalized.split("/").includes("..")) {
    throw new PathSafetyError(`Refusing install target "${target}": path traversal segment.`);
  }

  for (const prefix of TARGET_PREFIXES) {
    if (normalized === prefix) {
      throw new PathSafetyError(`Refusing install target "${target}": expected a file, not a directory.`);
    }
    if (normalized.startsWith(`${prefix}/`)) {
      const rest = normalized.slice(prefix.length + 1);
      const base =
        prefix === "components/ui"
          ? dirs.ui
          : prefix === "components/blocks"
            ? dirs.blocks
            : prefix === "components"
              ? dirs.components
              : prefix === "lib"
                ? dirs.lib
                : prefix === "hooks"
                  ? dirs.hooks
                  : dirs.styles;
      return safeJoin(base, rest);
    }
  }

  return safeJoin(projectRoot, normalized);
}

export function toPosix(value: string): string {
  return value.split(path.sep).join("/");
}

/** A relative import specifier from one file to another, always with `./`. */
export function relativeImport(fromFile: string, toFile: string): string {
  const relative = toPosix(path.relative(path.dirname(fromFile), toFile));
  return relative.startsWith(".") ? relative : `./${relative}`;
}
