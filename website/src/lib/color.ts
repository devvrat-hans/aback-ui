/**
 * Colour math for the palette, the theme generator, and the free tools.
 * Everything here is pure and runs in the browser or at build time.
 *
 * sRGB channels are 0 to 1. OKLCH follows Björn Ottosson's OKLab
 * (https://bottosson.github.io/posts/oklab/): L 0 to 1, C from 0 to about
 * 0.37, H in degrees.
 */

export interface Rgb {
  r: number;
  g: number;
  b: number;
  /** 0 to 1. Omitted means opaque. */
  alpha?: number;
}

export interface Hsl {
  h: number;
  s: number;
  l: number;
}

export interface Oklch {
  l: number;
  c: number;
  h: number;
}

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const round = (value: number, digits = 0) => {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
};

/* ------------------------------------------------------------------ parse */

function parseHex(input: string): Rgb | null {
  const match = /^#?([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(input.trim());
  if (!match) return null;
  let hex = match[1]!;
  if (hex.length <= 4) hex = [...hex].map((char) => char + char).join("");
  const value = (index: number) => parseInt(hex.slice(index, index + 2), 16) / 255;
  return { r: value(0), g: value(2), b: value(4), alpha: hex.length === 8 ? value(6) : undefined };
}

/** Reads a number or percentage; `scale` is what 100% means. */
function parseNumber(token: string, scale: number): number | null {
  const trimmed = token.trim();
  if (trimmed === "none") return 0;
  const percent = trimmed.endsWith("%");
  const value = Number.parseFloat(percent ? trimmed.slice(0, -1) : trimmed);
  if (!Number.isFinite(value)) return null;
  return percent ? (value / 100) * scale : value;
}

function parseHue(token: string): number | null {
  const match = /^(-?[\d.]+)(deg|turn|rad|grad)?$/.exec(token.trim());
  if (!match) return null;
  const value = Number.parseFloat(match[1]!);
  if (!Number.isFinite(value)) return null;
  const unit = match[2] ?? "deg";
  const degrees =
    unit === "turn" ? value * 360 : unit === "rad" ? (value * 180) / Math.PI : unit === "grad" ? value * 0.9 : value;
  return ((degrees % 360) + 360) % 360;
}

/** Splits `rgb(1 2 3 / 50%)` or `rgb(1, 2, 3, 0.5)` into channels and alpha. */
function splitArgs(body: string): { parts: string[]; alpha?: string } | null {
  const [main, slashAlpha] = body.split("/");
  const parts = main!.split(/[\s,]+/).filter(Boolean);
  if (slashAlpha !== undefined) return { parts, alpha: slashAlpha.trim() };
  if (parts.length === 4) return { parts: parts.slice(0, 3), alpha: parts[3] };
  return parts.length === 3 ? { parts } : null;
}

function parseAlpha(token: string | undefined): number | undefined | null {
  if (token === undefined) return undefined;
  const value = parseNumber(token, 1);
  return value === null ? null : clamp(value);
}

/**
 * Parses HEX (#rgb, #rgba, #rrggbb, #rrggbbaa), rgb(), rgba(), hsl(), hsla(),
 * and oklch() in modern or legacy comma syntax. Returns null for anything else.
 */
export function parseColor(input: string): Rgb | null {
  const value = input.trim().toLowerCase();
  if (!value) return null;
  if (value.startsWith("#") || /^[0-9a-f]{3,8}$/.test(value)) return parseHex(value);

  const fn = /^(rgba?|hsla?|oklch)\((.*)\)$/.exec(value);
  if (!fn) return null;
  const args = splitArgs(fn[2]!);
  if (!args) return null;
  const alpha = parseAlpha(args.alpha);
  if (alpha === null) return null;
  const [a, b, c] = args.parts as [string, string, string];

  if (fn[1]!.startsWith("rgb")) {
    const r = parseNumber(a, 255);
    const g = parseNumber(b, 255);
    const bl = parseNumber(c, 255);
    if (r === null || g === null || bl === null) return null;
    return { r: clamp(r / 255), g: clamp(g / 255), b: clamp(bl / 255), alpha };
  }

  if (fn[1]!.startsWith("hsl")) {
    const h = parseHue(a);
    const s = parseNumber(b.endsWith("%") ? b : `${b}%`, 1);
    const l = parseNumber(c.endsWith("%") ? c : `${c}%`, 1);
    if (h === null || s === null || l === null) return null;
    return { ...hslToRgb({ h, s: clamp(s), l: clamp(l) }), alpha };
  }

  const l = parseNumber(a, 1);
  const ch = parseNumber(b, 0.4);
  const h = parseHue(c);
  if (l === null || ch === null || h === null) return null;
  // oklch() lightness may be written 0 to 1 or 0% to 100%.
  return { ...oklchToRgb({ l: clamp(l), c: Math.max(0, ch), h }), alpha };
}

/* ---------------------------------------------------------- conversions */

export function rgbToHex({ r, g, b, alpha }: Rgb) {
  const channel = (value: number) => Math.round(clamp(value) * 255).toString(16).padStart(2, "0");
  const hex = `#${channel(r)}${channel(g)}${channel(b)}`;
  return alpha === undefined || alpha >= 1 ? hex : `${hex}${channel(alpha)}`;
}

export function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  if (d === 0) return { h: 0, s: 0, l };
  const s = d / (1 - Math.abs(2 * l - 1));
  let h: number;
  if (max === r) h = ((g - b) / d) % 6;
  else if (max === g) h = (b - r) / d + 2;
  else h = (r - g) / d + 4;
  return { h: ((h * 60) + 360) % 360, s, l };
}

export function hslToRgb({ h, s, l }: Hsl): Rgb {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r, g, b] =
    h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return { r: r + m, g: g + m, b: b + m };
}

const toLinear = (value: number) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
const fromLinear = (value: number) => (value <= 0.0031308 ? value * 12.92 : 1.055 * value ** (1 / 2.4) - 0.055);

export function rgbToOklch({ r, g, b }: Rgb): Oklch {
  const lr = toLinear(r);
  const lg = toLinear(g);
  const lb = toLinear(b);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  const c = Math.sqrt(A * A + B * B);
  const h = c < 1e-4 ? 0 : ((Math.atan2(B, A) * 180) / Math.PI + 360) % 360;
  return { l: L, c, h };
}

/** OKLCH to linear-light sRGB, unclamped, so callers can test the gamut. */
function oklchToLinear({ l: L, c, h }: Oklch) {
  const A = c * Math.cos((h * Math.PI) / 180);
  const B = c * Math.sin((h * Math.PI) / 180);
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3;
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3;
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3;
  return {
    r: 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  };
}

export function inSrgbGamut(color: Oklch, epsilon = 1e-4) {
  const { r, g, b } = oklchToLinear(color);
  return [r, g, b].every((value) => value >= -epsilon && value <= 1 + epsilon);
}

/** Converts to sRGB, reducing chroma at fixed lightness and hue until the colour fits. */
export function oklchToRgb(color: Oklch): Rgb {
  let fitted = color;
  if (!inSrgbGamut(color)) {
    let low = 0;
    let high = color.c;
    for (let step = 0; step < 24; step += 1) {
      const mid = (low + high) / 2;
      if (inSrgbGamut({ ...color, c: mid })) low = mid;
      else high = mid;
    }
    fitted = { ...color, c: low };
  }
  const { r, g, b } = oklchToLinear(fitted);
  return { r: clamp(fromLinear(r)), g: clamp(fromLinear(g)), b: clamp(fromLinear(b)) };
}

/* ------------------------------------------------------------ formatting */

export function formatRgb(color: Rgb) {
  const channels = [color.r, color.g, color.b].map((value) => Math.round(clamp(value) * 255)).join(" ");
  return color.alpha === undefined || color.alpha >= 1
    ? `rgb(${channels})`
    : `rgb(${channels} / ${round(color.alpha, 3)})`;
}

export function formatHsl(color: Rgb) {
  const { h, s, l } = rgbToHsl(color);
  const body = `${round(h, 1)} ${round(s * 100, 1)}% ${round(l * 100, 1)}%`;
  return color.alpha === undefined || color.alpha >= 1 ? `hsl(${body})` : `hsl(${body} / ${round(color.alpha, 3)})`;
}

export function formatOklch(color: Rgb) {
  const { l, c, h } = rgbToOklch(color);
  const body = `${round(l * 100, 2)}% ${round(c, 4)} ${round(h, 2)}`;
  return color.alpha === undefined || color.alpha >= 1 ? `oklch(${body})` : `oklch(${body} / ${round(color.alpha, 3)})`;
}

/* -------------------------------------------------------------- contrast */

/** WCAG 2.x relative luminance of an opaque sRGB colour. */
export function relativeLuminance({ r, g, b }: Rgb) {
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/** Composites a translucent foreground over an opaque background. */
export function flatten(foreground: Rgb, background: Rgb): Rgb {
  const alpha = foreground.alpha ?? 1;
  return {
    r: foreground.r * alpha + background.r * (1 - alpha),
    g: foreground.g * alpha + background.g * (1 - alpha),
    b: foreground.b * alpha + background.b * (1 - alpha),
  };
}

/** WCAG 2.x contrast ratio, 1 to 21. A translucent foreground is flattened onto the background first. */
export function contrastRatio(foreground: Rgb, background: Rgb) {
  const a = relativeLuminance(flatten(foreground, background));
  const b = relativeLuminance(background);
  const [light, dark] = a > b ? [a, b] : [b, a];
  return (light + 0.05) / (dark + 0.05);
}

export interface WcagResult {
  ratio: number;
  /** Normal text, AA: 4.5:1. */
  aaNormal: boolean;
  /** Large text (24px, or 18.66px bold), AA: 3:1. */
  aaLarge: boolean;
  /** Normal text, AAA: 7:1. */
  aaaNormal: boolean;
  /** Large text, AAA: 4.5:1. */
  aaaLarge: boolean;
  /** Non-text contrast for UI components and graphics, SC 1.4.11: 3:1. */
  nonText: boolean;
}

export function wcag(foreground: Rgb, background: Rgb): WcagResult {
  // Compare the unrounded ratio, as the WCAG thresholds are exact.
  const ratio = contrastRatio(foreground, background);
  return {
    ratio,
    aaNormal: ratio >= 4.5,
    aaLarge: ratio >= 3,
    aaaNormal: ratio >= 7,
    aaaLarge: ratio >= 4.5,
    nonText: ratio >= 3,
  };
}

/** Rounds down to two decimals, so 4.499 never displays as a passing 4.50. */
export function formatRatio(ratio: number) {
  return `${(Math.floor(ratio * 100) / 100).toFixed(2)}:1`;
}

/* ----------------------------------------------------------------- scale */

export const SCALE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
export type ScaleStep = (typeof SCALE_STEPS)[number];

/** Target OKLCH lightness for each step, close to the Tailwind CSS v4 default palette. */
const STEP_LIGHTNESS = [0.975, 0.94, 0.885, 0.81, 0.72, 0.64, 0.555, 0.47, 0.395, 0.33, 0.255];
/** Share of the base chroma kept at each step: pale and deep ends are calmer. */
const STEP_CHROMA = [0.12, 0.26, 0.48, 0.72, 0.9, 1, 0.96, 0.86, 0.74, 0.62, 0.46];

export interface ScaleColor {
  step: ScaleStep;
  rgb: Rgb;
  hex: string;
  oklch: Oklch;
  /** The step that holds the input colour unchanged. */
  anchor: boolean;
}

/**
 * An 11-step scale (50 to 950) from one colour. The input keeps its exact
 * value at the step whose lightness is nearest to it; the other steps take
 * fixed OKLCH lightness targets with the input's hue, and chroma reduced
 * where sRGB cannot show it.
 */
export function generateScale(base: Rgb): ScaleColor[] {
  const source = rgbToOklch(base);
  let anchorIndex = 0;
  STEP_LIGHTNESS.forEach((target, index) => {
    if (Math.abs(target - source.l) < Math.abs(STEP_LIGHTNESS[anchorIndex]! - source.l)) anchorIndex = index;
  });
  // The anchor sits within half a step of its target lightness, so the scale stays monotonic.
  return SCALE_STEPS.map((step, index) => {
    if (index === anchorIndex) {
      const rgb = { r: base.r, g: base.g, b: base.b };
      return { step, rgb, hex: rgbToHex(rgb), oklch: source, anchor: true };
    }
    const target: Oklch = { l: STEP_LIGHTNESS[index]!, c: source.c * STEP_CHROMA[index]!, h: source.h };
    const rgb = oklchToRgb(target);
    return { step, rgb, hex: rgbToHex(rgb), oklch: rgbToOklch(rgb), anchor: false };
  });
}

/* ----------------------------------------------------------------- theme */

export const WHITE: Rgb = { r: 1, g: 1, b: 1 };
/** The Aback light and dark backgrounds, #ffffff and #0a0a0a. */
export const LIGHT_BACKGROUND: Rgb = WHITE;
export const DARK_BACKGROUND: Rgb = { r: 10 / 255, g: 10 / 255, b: 10 / 255 };

export interface ThemeRole {
  name: string;
  value: string;
  /** The background the role is checked against, and the ratio it needs. */
  check?: { against: string; ratio: number; required: number };
}

export interface GeneratedTheme {
  scale: ScaleColor[];
  light: ThemeRole[];
  dark: ThemeRole[];
  css: string;
}

function stepColor(scale: ScaleColor[], step: ScaleStep) {
  return scale.find((item) => item.step === step)!;
}

/** The first step in `order` that reaches `required` against `background`, else the last one. */
function pick(scale: ScaleColor[], order: ScaleStep[], background: Rgb, required: number) {
  for (const step of order) {
    if (contrastRatio(stepColor(scale, step).rgb, background) >= required) return stepColor(scale, step);
  }
  return stepColor(scale, order.at(-1)!);
}

/**
 * A complete brand theme in the Aback role structure: the ramp plus link,
 * focus, icon, chip, wash, and fill roles for light and dark. Each text role
 * takes the lightest (or, in dark, darkest) step that still reaches WCAG AA,
 * so the output is accessible by construction rather than by luck.
 */
export function generateTheme(base: Rgb): GeneratedTheme {
  const scale = generateScale(base);
  const ratio = (color: ScaleColor, background: Rgb) => contrastRatio(color.rgb, background);

  const lightLink = pick(scale, [600, 700, 800, 900, 950], LIGHT_BACKGROUND, 4.5);
  const lightLinkHover = stepColor(scale, Math.min(950, lightLink.step + 100) as ScaleStep);
  const lightFocus = pick(scale, [500, 600, 700, 800], LIGHT_BACKGROUND, 3);
  const lightFill = pick(scale, [500, 600, 700, 800, 900], WHITE, 4.5);

  const darkLink = pick(scale, [300, 400, 200, 100, 50], DARK_BACKGROUND, 4.5);
  const darkLinkHover = stepColor(scale, Math.max(50, darkLink.step - 100) as ScaleStep);
  const darkFocus = pick(scale, [400, 300, 200], DARK_BACKGROUND, 3);
  const darkFill = darkLink;
  const darkOnFill = stepColor(scale, 950);

  const light: ThemeRole[] = [
    { name: "--link", value: lightLink.hex, check: { against: "#ffffff", ratio: ratio(lightLink, LIGHT_BACKGROUND), required: 4.5 } },
    { name: "--link-hover", value: lightLinkHover.hex, check: { against: "#ffffff", ratio: ratio(lightLinkHover, LIGHT_BACKGROUND), required: 4.5 } },
    { name: "--focus-ring", value: lightFocus.hex, check: { against: "#ffffff", ratio: ratio(lightFocus, LIGHT_BACKGROUND), required: 3 } },
    { name: "--brand-icon", value: lightFocus.hex, check: { against: "#ffffff", ratio: ratio(lightFocus, LIGHT_BACKGROUND), required: 3 } },
    { name: "--brand-chip", value: stepColor(scale, 100).hex },
    { name: "--brand-wash", value: stepColor(scale, 50).hex },
    { name: "--brand-fill", value: lightFill.hex, check: { against: "#ffffff text", ratio: contrastRatio(WHITE, lightFill.rgb), required: 4.5 } },
    { name: "--on-brand-fill", value: "#ffffff" },
    { name: "--info", value: lightLink.hex },
    { name: "--info-soft", value: stepColor(scale, 50).hex },
  ];

  const deep = stepColor(scale, 900).rgb;
  const wash = formatRgb({ ...deep, alpha: 0.3 });
  const dark: ThemeRole[] = [
    { name: "--link", value: darkLink.hex, check: { against: "#0a0a0a", ratio: ratio(darkLink, DARK_BACKGROUND), required: 4.5 } },
    { name: "--link-hover", value: darkLinkHover.hex, check: { against: "#0a0a0a", ratio: ratio(darkLinkHover, DARK_BACKGROUND), required: 4.5 } },
    { name: "--focus-ring", value: darkFocus.hex, check: { against: "#0a0a0a", ratio: ratio(darkFocus, DARK_BACKGROUND), required: 3 } },
    { name: "--brand-icon", value: darkFocus.hex, check: { against: "#0a0a0a", ratio: ratio(darkFocus, DARK_BACKGROUND), required: 3 } },
    { name: "--brand-chip", value: stepColor(scale, 900).hex },
    { name: "--brand-wash", value: wash },
    { name: "--brand-fill", value: darkFill.hex, check: { against: `${darkOnFill.hex} text`, ratio: contrastRatio(darkOnFill.rgb, darkFill.rgb), required: 4.5 } },
    { name: "--on-brand-fill", value: darkOnFill.hex },
    { name: "--info", value: darkLinkHover.hex },
    { name: "--info-soft", value: wash },
  ];

  const ramp = scale.map((item) => `  --color-primary-${item.step}: ${item.hex};`).join("\n");
  const block = (roles: ThemeRole[]) => roles.map((role) => `  ${role.name}: ${role.value};`).join("\n");
  const css = `/* Generated at https://abackui.com/themes. Paste after the Aback theme import. */
@theme inline {
${ramp}
}

:root {
${block(light)}
}

.dark {
${block(dark)}
}
`;

  return { scale, light, dark, css };
}

/** A Tailwind CSS v4 @theme block for a named scale, e.g. `--color-brand-500`. */
export function scaleToTailwindCss(name: string, scale: ScaleColor[], format: "hex" | "oklch" = "oklch") {
  const lines = scale.map(
    (item) => `  --color-${name}-${item.step}: ${format === "hex" ? item.hex : formatOklch(item.rgb)};`,
  );
  return `@theme {\n${lines.join("\n")}\n}\n`;
}

/** The same scale as CSS custom properties on :root, for projects without Tailwind. */
export function scaleToCssVariables(name: string, scale: ScaleColor[]) {
  return `:root {\n${scale.map((item) => `  --${name}-${item.step}: ${item.hex};`).join("\n")}\n}\n`;
}

/** A Tailwind CSS v3 `theme.extend.colors` entry, for projects that have not moved to v4. */
export function scaleToTailwindConfig(name: string, scale: ScaleColor[]) {
  const lines = scale.map((item) => `      ${item.step}: "${item.hex}",`);
  return `// tailwind.config.js (Tailwind CSS v3)\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        "${name}": {\n${lines.map((line) => `  ${line}`).join("\n")}\n        },\n      },\n    },\n  },\n};\n`;
}
