import { describe, expect, it } from "vitest";

import {
  DARK_BACKGROUND,
  WHITE,
  contrastRatio,
  formatHsl,
  formatOklch,
  formatRatio,
  formatRgb,
  generateScale,
  generateTheme,
  parseColor,
  rgbToHex,
  rgbToOklch,
} from "./color";
import { readPalette } from "./palette";

describe("parseColor", () => {
  it("reads every HEX length", () => {
    expect(rgbToHex(parseColor("#fff")!)).toBe("#ffffff");
    expect(rgbToHex(parseColor("009bf9")!)).toBe("#009bf9");
    expect(parseColor("#00000080")!.alpha).toBeCloseTo(0.5, 2);
    expect(parseColor("#0008")!.alpha).toBeCloseTo(0.533, 2);
  });

  it("reads modern and legacy function syntax", () => {
    expect(rgbToHex(parseColor("rgb(0 155 249)")!)).toBe("#009bf9");
    expect(rgbToHex(parseColor("rgba(0, 155, 249, 0.5)")!)).toBe("#009bf980");
    expect(rgbToHex(parseColor("hsl(0 100% 50%)")!)).toBe("#ff0000");
    expect(rgbToHex(parseColor("hsl(120, 100%, 25%)")!)).toBe("#008000");
    expect(parseColor("rgb(0 31 50 / 0.3)")!.alpha).toBeCloseTo(0.3);
  });

  it("round-trips through OKLCH", () => {
    const blue = parseColor("#009bf9")!;
    expect(rgbToHex(parseColor(formatOklch(blue))!)).toBe("#009bf9");
    expect(rgbToHex(parseColor("oklch(0.628 0.2577 29.23)")!)).toBe("#ff0000");
  });

  it("rejects what it cannot read", () => {
    for (const input of ["", "blue", "#12", "rgb(1 2)", "hsl(x 1% 1%)", "oklch(1 2)"]) {
      expect(parseColor(input)).toBeNull();
    }
  });
});

describe("formatting", () => {
  it("prints CSS colour syntax", () => {
    const blue = parseColor("#009bf9")!;
    expect(formatRgb(blue)).toBe("rgb(0 155 249)");
    expect(formatHsl(blue)).toMatch(/^hsl\(202\.\d 100% 48\.\d%\)$/);
    expect(formatOklch(blue)).toMatch(/^oklch\(\d+\.?\d*% 0\.\d+ \d+\.?\d*\)$/);
  });

  it("never rounds a failing ratio up to a pass", () => {
    expect(formatRatio(4.4999)).toBe("4.49:1");
    expect(formatRatio(21)).toBe("21.00:1");
  });
});

describe("contrastRatio", () => {
  it("matches the WCAG reference values", () => {
    expect(contrastRatio(parseColor("#000")!, WHITE)).toBeCloseTo(21, 5);
    expect(contrastRatio(WHITE, WHITE)).toBe(1);
    expect(contrastRatio(parseColor("#777777")!, WHITE)).toBeCloseTo(4.48, 2);
  });

  it("flattens translucent text onto the background", () => {
    const half = parseColor("rgb(0 0 0 / 0.5)")!;
    expect(contrastRatio(half, WHITE)).toBeCloseTo(contrastRatio(parseColor("#808080")!, WHITE), 1);
  });
});

describe("generateScale", () => {
  it("keeps the input exactly at one step and stays monotonic", () => {
    for (const hex of ["#009bf9", "#7c3aed", "#f97316", "#fefce8", "#111827", "#808080"]) {
      const scale = generateScale(parseColor(hex)!);
      expect(scale).toHaveLength(11);
      expect(scale.filter((item) => item.anchor).map((item) => item.hex)).toEqual([hex]);
      const lightness = scale.map((item) => rgbToOklch(item.rgb).l);
      for (let index = 1; index < lightness.length; index += 1) {
        expect(lightness[index]!).toBeLessThan(lightness[index - 1]!);
      }
    }
  });
});

describe("generateTheme", () => {
  it("passes every contrast check for typical brand colours", () => {
    for (const hex of ["#009bf9", "#7c3aed", "#059669", "#e11d48", "#0d9488"]) {
      const theme = generateTheme(parseColor(hex)!);
      for (const role of [...theme.light, ...theme.dark]) {
        if (role.check) expect(role.check.ratio, `${hex} ${role.name}`).toBeGreaterThanOrEqual(role.check.required);
      }
      expect(theme.css).toContain("--color-primary-500");
      expect(theme.css).toContain(".dark {");
    }
  });
});

describe("Aback tokens", () => {
  const { light, dark } = readPalette();
  const value = (tokens: typeof light, name: string) => parseColor(tokens.find((token) => token.name === name)!.value)!;

  // These pairs back the accessibility claims on /faq and /tools/contrast-checker.
  const textRoles = ["--foreground", "--muted-foreground", "--link", "--success", "--warning", "--danger", "--info"];

  it.each([
    ["light", light],
    ["dark", dark],
  ] as const)("%s text roles reach 4.5:1 on the background and card", (_mode, tokens) => {
    for (const surface of ["--background", "--card"]) {
      for (const role of textRoles) {
        expect(contrastRatio(value(tokens, role), value(tokens, surface)), `${role} on ${surface}`).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it("focus rings reach 3:1 in both themes", () => {
    expect(contrastRatio(value(light, "--focus-ring"), WHITE)).toBeGreaterThanOrEqual(3);
    expect(contrastRatio(value(dark, "--focus-ring"), DARK_BACKGROUND)).toBeGreaterThanOrEqual(3);
  });
});
