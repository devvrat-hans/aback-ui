import { describe, expect, it } from "vitest";

import { runCli } from "./cli.js";
import { captureLogger, denyPrompter } from "./test-utils/fixtures.js";

function context() {
  const { logger, lines } = captureLogger();
  return { logger, lines, prompter: denyPrompter, cwd: process.cwd() };
}

describe("runCli", () => {
  it("prints help when no command is given", async () => {
    const testContext = context();
    expect(await runCli([], testContext)).toBe(0);
    expect(testContext.lines.join("\n")).toContain("aback-ui <command>");
    expect(testContext.lines.join("\n")).toContain("doctor");
  });

  it("prints the version", async () => {
    const testContext = context();
    expect(await runCli(["--version"], testContext)).toBe(0);
    expect(testContext.lines).toEqual(["0.2.2"]);
  });

  it("returns a failure code for an unknown command", async () => {
    const testContext = context();
    expect(await runCli(["publish-everything"], testContext)).toBe(1);
    expect(testContext.lines.join("\n")).toContain("Unknown command");
  });

  it("rejects an unknown option before running a command", async () => {
    const testContext = context();
    expect(await runCli(["add", "button", "--nope"], testContext)).toBe(1);
    expect(testContext.lines.join("\n")).toContain("Unknown option");
  });
});
