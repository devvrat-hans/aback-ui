import { describe, expect, it } from "vitest";

import { diffLines, trimDiff } from "./diff.js";

describe("diffLines", () => {
  it("returns only context for identical files", () => {
    const lines = diffLines("a\nb\n", "a\nb\n");
    expect(lines.every((line) => line.type === "context")).toBe(true);
  });

  it("marks removed and added lines", () => {
    const lines = diffLines("a\nold\nc\n", "a\nnew\nc\n");
    expect(lines).toContainEqual({ type: "remove", text: "old" });
    expect(lines).toContainEqual({ type: "add", text: "new" });
  });

  it("handles an empty file", () => {
    const lines = diffLines("", "a\n");
    expect(lines.filter((line) => line.type === "add")).toHaveLength(1);
  });
});

describe("trimDiff", () => {
  it("keeps context around changes and marks the skipped region", () => {
    const before = Array.from({ length: 20 }, (_, index) => `line ${index}`).join("\n");
    const after = before.replace("line 10", "changed");
    const trimmed = trimDiff(diffLines(before, after));

    expect(trimmed).toContain("gap");
    expect(trimmed).toContainEqual({ type: "remove", text: "line 10" });
    expect(trimmed).toContainEqual({ type: "add", text: "changed" });
  });

  it("returns the diff unchanged when it is small", () => {
    const trimmed = trimDiff(diffLines("a", "b"));
    expect(trimmed).not.toContain("gap");
  });
});
