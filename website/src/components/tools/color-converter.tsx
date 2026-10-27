"use client";

import { useState } from "react";

import { CopyButton } from "@aback-ui/ui";

import { ColorField } from "@/components/tools/color-field";
import {
  DARK_BACKGROUND,
  WHITE,
  contrastRatio,
  formatHsl,
  formatOklch,
  formatRatio,
  formatRgb,
  inSrgbGamut,
  parseColor,
  rgbToHex,
  rgbToOklch,
} from "@/lib/color";

/** True when the typed oklch() value had to be reduced in chroma to fit sRGB. */
function wasGamutMapped(input: string) {
  const match = /^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)(%?)\s+([\d.]+)/i.exec(input.trim());
  if (!match) return false;
  const l = Number(match[1]) / (match[2] ? 100 : 1);
  const c = Number(match[3]) * (match[4] ? 0.004 : 1);
  return !inSrgbGamut({ l, c, h: Number(match[5]) });
}

export function ColorConverter() {
  const [input, setInput] = useState("#009bf9");
  const color = parseColor(input);

  const formats = color
    ? [
        { name: "HEX", value: rgbToHex(color) },
        { name: "RGB", value: formatRgb(color) },
        { name: "HSL", value: formatHsl(color) },
        { name: "OKLCH", value: formatOklch(color) },
        { name: "CSS variable", value: `--brand: ${formatOklch(color)};` },
        { name: "Tailwind class", value: `bg-[${rgbToHex(color)}]` },
      ]
    : [];
  const oklch = color ? rgbToOklch(color) : null;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_14rem]">
        <ColorField
          id="converter-input"
          label="Colour"
          value={input}
          onChange={setInput}
          description="Paste HEX (3, 4, 6, or 8 digits), rgb(), hsl(), or oklch(), with or without alpha."
        />
        <div
          aria-hidden="true"
          className="min-h-24 border border-border"
          style={{ backgroundColor: color ? rgbToHex(color) : "transparent" }}
        />
      </div>

      {color ? (
        <>
          {wasGamutMapped(input) ? (
            <p className="border border-warning/30 bg-warning-soft px-4 py-3 text-sm text-warning-strong">
              This OKLCH colour is outside the sRGB gamut, so HEX, RGB, and HSL show the nearest
              displayable colour at the same lightness and hue.
            </p>
          ) : null}
          <ul className="flex flex-col divide-y divide-border border border-border" aria-label="Converted values">
            {formats.map((format) => (
              <li key={format.name} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
                <span className="w-32 shrink-0 text-sm font-medium text-foreground">{format.name}</span>
                <code className="min-w-0 flex-1 break-all font-mono text-sm text-foreground">{format.value}</code>
                <CopyButton value={format.value} variant="ghost" size="sm" label={`Copy ${format.name}`} />
              </li>
            ))}
          </ul>

          <dl className="grid gap-px border border-border bg-border text-sm sm:grid-cols-4">
            {[
              { term: "Lightness", value: `${(oklch!.l * 100).toFixed(1)}%` },
              { term: "Chroma", value: oklch!.c.toFixed(4) },
              { term: "Hue", value: `${oklch!.h.toFixed(1)}°` },
              {
                term: "Contrast on white / #0a0a0a",
                value: `${formatRatio(contrastRatio(color, WHITE))} / ${formatRatio(contrastRatio(color, DARK_BACKGROUND))}`,
              },
            ].map((item) => (
              <div key={item.term} className="flex flex-col gap-1 bg-card p-4">
                <dt className="text-xs text-muted-foreground">{item.term}</dt>
                <dd className="font-mono font-medium tabular-nums text-foreground">{item.value}</dd>
              </div>
            ))}
          </dl>
        </>
      ) : null}
    </div>
  );
}
