import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * The Aback palette, read from the tokens package at build time so the
 * colours page and the theme generator can never disagree with the CSS that
 * ships. Server-only: it reads the file system.
 */
const tokensFile = path.join(process.cwd(), "..", "packages", "tokens", "src", "tokens.css");

export interface TokenValue {
  name: string;
  value: string;
}

function block(css: string, selector: string) {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) throw new Error(`tokens.css has no ${selector} block`);
  return css.slice(start, css.indexOf("\n}", start));
}

function declarations(source: string): TokenValue[] {
  return [...source.matchAll(/^\s*(--[\w-]+):\s*([^;]+);/gm)].map((match) => ({
    name: match[1]!,
    value: match[2]!.trim(),
  }));
}

export function readPalette() {
  const css = readFileSync(tokensFile, "utf8");
  const ramp = declarations(block(css, "@theme inline")).filter((token) => /^--color-primary-\d+$/.test(token.name));
  // Only colours: radius and other non-colour roles are left out.
  const isColor = (token: TokenValue) => /^(#|rgb|hsl|oklch)/.test(token.value);
  const light = declarations(block(css, ":root")).filter(isColor);
  const dark = declarations(block(css, ".dark")).filter(isColor);
  return { ramp, light, dark };
}
