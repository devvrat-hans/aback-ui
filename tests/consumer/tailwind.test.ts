// @vitest-environment node
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import tailwind from "@tailwindcss/postcss";
import postcss from "postcss";
import { describe, expect, it } from "vitest";

// Compiles a consumer stylesheet against the installed tarballs, the way a
// Tailwind v4 app would. It proves the documented setup works and that the
// @source line is required: Tailwind does not scan node_modules on its own.
//
// The stylesheet compiles from an empty directory. Tailwind's automatic source
// detection scans the base directory, and this test file names the classes it
// looks for, so compiling from the fixture root would find them here instead.
const fixtureDir = path.dirname(fileURLToPath(import.meta.url));
const workDir = path.join(fixtureDir, ".tailwind-check");
const from = path.join(workDir, "app.css");

async function compile(css: string) {
  mkdirSync(workDir, { recursive: true });
  const result = await postcss([tailwind({ base: workDir })]).process(css, { from });
  return result.css;
}

const documented = `@import "tailwindcss";
@import "@aback-ui/tokens/tokens.css";
@source "../node_modules/@aback-ui/ui/dist";`;

describe("Tailwind v4 with the packed packages", () => {
  it("generates the classes the components use", async () => {
    const css = await compile(documented);
    // Button's brand variant, Badge's info variant, and Dropzone's drag state.
    expect(css).toContain(".bg-brand-fill");
    expect(css).toContain(".bg-info-soft");
    expect(css).toContain(".border-dashed");
    // Steps numbers itself with a CSS counter.
    expect(css).toContain("counter-reset: step");
  });

  it("includes the theme tokens from @aback-ui/tokens", async () => {
    const css = await compile(documented);
    expect(css).toContain("--brand-fill: #005d95");
    expect(css).toContain(".dark");
  });

  it("misses component classes without the @source line", async () => {
    const css = await compile(`@import "tailwindcss";
@import "@aback-ui/tokens/tokens.css";`);
    expect(css).not.toContain(".bg-info-soft");
  });
});
