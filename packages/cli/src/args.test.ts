import { describe, expect, it } from "vitest";

import { flagBoolean, flagString, parseArgs } from "./args.js";

describe("parseArgs", () => {
  it("reads the command, positionals, and boolean flags", () => {
    const args = parseArgs(["add", "button", "dialog", "--yes", "--dry-run"]);
    expect(args.command).toBe("add");
    expect(args.positionals).toEqual(["button", "dialog"]);
    expect(flagBoolean(args, "yes")).toBe(true);
    expect(flagBoolean(args, "dry-run")).toBe(true);
  });

  it("reads flag values in both forms", () => {
    expect(flagString(parseArgs(["list", "--registry", "http://localhost:3000/r"]), "registry")).toBe(
      "http://localhost:3000/r",
    );
    expect(flagString(parseArgs(["list", "--registry=http://x/r"]), "registry")).toBe("http://x/r");
  });

  it("supports short aliases and reports unknown options", () => {
    const args = parseArgs(["init", "-y", "--nonsense"]);
    expect(flagBoolean(args, "yes")).toBe(true);
    expect(args.unknown).toEqual(["--nonsense"]);
  });

  it("treats everything after -- as positionals", () => {
    const args = parseArgs(["add", "--", "--looks-like-a-flag"]);
    expect(args.positionals).toEqual(["--looks-like-a-flag"]);
  });

  it("keeps `--no-install` as its own flag", () => {
    const args = parseArgs(["add", "button", "--no-install"]);
    expect(flagBoolean(args, "no-install")).toBe(true);
  });
});
