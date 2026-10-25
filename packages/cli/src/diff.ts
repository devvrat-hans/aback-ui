import { readFile } from "node:fs/promises";
import path from "node:path";

import { existsPath } from "./config.js";
import { resolveTargetPath, toPosix } from "./paths.js";
import type { InstallDirs, RegistryItem } from "./types.js";

export type DiffLineType = "add" | "remove" | "context";

export interface DiffLine {
  type: DiffLineType;
  text: string;
}

export type DiffStatus = "unchanged" | "modified" | "missing";

export interface FileDiff {
  item: string;
  target: string;
  absolutePath: string;
  status: DiffStatus;
  lines: DiffLine[];
}

/** A line-based longest-common-subsequence diff; enough for source files. */
export function diffLines(before: string, after: string): DiffLine[] {
  const a = before.split("\n");
  const b = after.split("\n");
  const n = a.length;
  const m = b.length;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));

  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      dp[i]![j] =
        a[i] === b[j] ? dp[i + 1]![j + 1]! + 1 : Math.max(dp[i + 1]![j]!, dp[i]![j + 1]!);
    }
  }

  const lines: DiffLine[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) {
      lines.push({ type: "context", text: a[i] ?? "" });
      i += 1;
      j += 1;
    } else if (dp[i + 1]![j]! >= dp[i]![j + 1]!) {
      lines.push({ type: "remove", text: a[i] ?? "" });
      i += 1;
    } else {
      lines.push({ type: "add", text: b[j] ?? "" });
      j += 1;
    }
  }
  while (i < n) {
    lines.push({ type: "remove", text: a[i] ?? "" });
    i += 1;
  }
  while (j < m) {
    lines.push({ type: "add", text: b[j] ?? "" });
    j += 1;
  }
  return lines;
}

export interface DiffItemsOptions {
  projectRoot: string;
  dirs: InstallDirs;
  items: RegistryItem[];
}

/**
 * Compare the files currently on disk with the registry version. The diff is
 * written from the installed file (`-`) to the registry file (`+`), so it says
 * what reinstalling would change.
 */
export async function diffItems({
  projectRoot,
  dirs,
  items,
}: DiffItemsOptions): Promise<FileDiff[]> {
  const results: FileDiff[] = [];

  for (const item of items) {
    for (const file of item.files) {
      const target = file.target ?? file.path;
      const absolutePath = resolveTargetPath(target, dirs, projectRoot);
      const display = toPosix(path.relative(projectRoot, absolutePath));

      if (!(await existsPath(absolutePath))) {
        results.push({
          item: item.name,
          target: display,
          absolutePath,
          status: "missing",
          lines: [],
        });
        continue;
      }

      const installed = await readFile(absolutePath, "utf8");
      if (installed === file.content) {
        results.push({
          item: item.name,
          target: display,
          absolutePath,
          status: "unchanged",
          lines: [],
        });
        continue;
      }

      results.push({
        item: item.name,
        target: display,
        absolutePath,
        status: "modified",
        lines: diffLines(installed, file.content),
      });
    }
  }

  return results;
}

/** Keep two context lines around each change and cap very large diffs. */
export function trimDiff(lines: DiffLine[], context = 2, maxLines = 120): Array<DiffLine | "gap"> {
  const keep = new Set<number>();
  lines.forEach((line, index) => {
    if (line.type === "context") return;
    for (let offset = -context; offset <= context; offset += 1) {
      const target = index + offset;
      if (target >= 0 && target < lines.length) keep.add(target);
    }
  });

  const output: Array<DiffLine | "gap"> = [];
  let gap = false;
  for (let index = 0; index < lines.length; index += 1) {
    if (!keep.has(index)) {
      gap = true;
      continue;
    }
    if (gap && output.length > 0) output.push("gap");
    gap = false;
    output.push(lines[index]!);
  }

  if (gap) output.push("gap");

  if (output.length > maxLines) {
    return [...output.slice(0, maxLines), "gap"];
  }
  return output;
}
