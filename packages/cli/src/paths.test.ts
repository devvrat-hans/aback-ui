import path from "node:path";
import { describe, expect, it } from "vitest";

import { PathSafetyError, relativeImport, resolveTargetPath, safeJoin } from "./paths.js";
import type { InstallDirs } from "./types.js";

const root = path.resolve("/tmp/aback-project");
const dirs: InstallDirs = {
  components: path.join(root, "src/components"),
  ui: path.join(root, "src/components/ui"),
  blocks: path.join(root, "src/components/blocks"),
  lib: path.join(root, "src/lib"),
  hooks: path.join(root, "src/hooks"),
  styles: path.join(root, "styles"),
};

describe("safeJoin", () => {
  it("keeps project-relative paths inside the root", () => {
    expect(safeJoin(root, "app/globals.css")).toBe(path.join(root, "app/globals.css"));
  });

  it("rejects absolute paths and traversal", () => {
    expect(() => safeJoin(root, "/etc/passwd")).toThrow(PathSafetyError);
    expect(() => safeJoin(root, "../escape.ts")).toThrow(PathSafetyError);
    expect(() => safeJoin(root, "a/../../escape.ts")).toThrow(PathSafetyError);
  });
});

describe("resolveTargetPath", () => {
  it("maps registry targets to configured aliases", () => {
    expect(resolveTargetPath("components/ui/button.tsx", dirs, root)).toBe(
      path.join(root, "src/components/ui/button.tsx"),
    );
    expect(resolveTargetPath("components/blocks/sign-in.tsx", dirs, root)).toBe(
      path.join(root, "src/components/blocks/sign-in.tsx"),
    );
    expect(resolveTargetPath("lib/utils.ts", dirs, root)).toBe(
      path.join(root, "src/lib/utils.ts"),
    );
    expect(resolveTargetPath("~/styles/aback.css", dirs, root)).toBe(
      path.join(root, "styles/aback.css"),
    );
  });

  it("refuses traversal and directory targets", () => {
    expect(() => resolveTargetPath("../../escape.ts", dirs, root)).toThrow(PathSafetyError);
    expect(() => resolveTargetPath("components/ui/../../escape.ts", dirs, root)).toThrow(
      PathSafetyError,
    );
    expect(() => resolveTargetPath("components/ui", dirs, root)).toThrow(PathSafetyError);
  });
});

describe("relativeImport", () => {
  it("produces a dot-relative specifier", () => {
    expect(relativeImport("/tmp/p/src/app/globals.css", "/tmp/p/styles/aback.css")).toBe(
      "../../styles/aback.css",
    );
  });
});
