import { execFileSync } from "node:child_process";
import path from "node:path";

/** The repository root. Builds and tests run from website/. */
const root = path.resolve(process.cwd(), "..");
const cache = new Map<string, number | null>();

function commitTime(file: string): number | null {
  if (cache.has(file)) return cache.get(file) ?? null;
  let time: number | null = null;
  try {
    const output = execFileSync("git", ["log", "-1", "--format=%ct", "--", file], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    time = output ? Number(output) * 1000 : null;
  } catch {
    time = null;
  }
  cache.set(file, time);
  return time;
}

/**
 * When a page last changed: the newest commit date among the files it is
 * built from, as an ISO string. Uncommitted files and builds outside a git
 * checkout fall back to the build time, so sitemap dates never go backwards.
 */
export function lastModified(sources: readonly string[]): string {
  const times = sources.map(commitTime);
  if (times.length === 0 || times.some((time) => time === null)) return new Date().toISOString();
  return new Date(Math.max(...(times as number[]))).toISOString();
}
