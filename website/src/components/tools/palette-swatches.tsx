"use client";

import { useState } from "react";
import { IconCheck, IconCopy } from "@tabler/icons-react";

import { ToggleGroup, ToggleGroupItem, copyToClipboard } from "@aback-ui/ui";

import { WHITE, contrastRatio, flatten, formatHsl, formatOklch, formatRgb, parseColor, rgbToHex } from "@/lib/color";

type Format = "hex" | "rgb" | "hsl" | "oklch" | "var";

export interface Swatch {
  /** The CSS variable, such as --link or --color-primary-500. */
  name: string;
  value: string;
  /** Short label shown on the card, such as 500 or link. */
  label: string;
}

export interface SwatchGroup {
  title: string;
  description: string;
  swatches: Swatch[];
  /** Render the group on a dark surface. */
  dark?: boolean;
}

function formatValue(swatch: Swatch, format: Format) {
  if (format === "var") return `var(${swatch.name})`;
  const color = parseColor(swatch.value);
  if (!color) return swatch.value;
  if (format === "hex") return rgbToHex(color);
  if (format === "rgb") return formatRgb(color);
  if (format === "hsl") return formatHsl(color);
  return formatOklch(color);
}

/**
 * The palette as copyable swatches. One click copies the value in the chosen
 * format; the copied state is announced through the button's own label.
 */
export function PaletteSwatches({ groups }: { groups: SwatchGroup[] }) {
  const [format, setFormat] = useState<Format>("hex");
  const [copied, setCopied] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-wrap items-center gap-3">
        <span id="format-label" className="text-sm font-medium text-foreground">
          Copy as
        </span>
        <ToggleGroup
          type="single"
          value={format}
          onValueChange={(value) => value && setFormat(value as Format)}
          aria-labelledby="format-label"
          variant="outline"
          size="sm"
        >
          <ToggleGroupItem value="hex">HEX</ToggleGroupItem>
          <ToggleGroupItem value="rgb">RGB</ToggleGroupItem>
          <ToggleGroupItem value="hsl">HSL</ToggleGroupItem>
          <ToggleGroupItem value="oklch">OKLCH</ToggleGroupItem>
          <ToggleGroupItem value="var">CSS variable</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {groups.map((group) => {
        const surface = group.dark ? { r: 10 / 255, g: 10 / 255, b: 10 / 255 } : WHITE;
        return (
          <section key={group.title} aria-labelledby={`group-${group.title}`} className="flex flex-col gap-4">
            <div>
              <h2 id={`group-${group.title}`} className="text-xl font-semibold tracking-tight text-foreground">
                {group.title}
              </h2>
              <p className="mt-1 max-w-[68ch] text-sm leading-relaxed text-muted-foreground">{group.description}</p>
            </div>
            <ul className="grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
              {group.swatches.map((swatch) => {
                const value = formatValue(swatch, format);
                const key = `${group.title}:${swatch.name}`;
                const color = parseColor(swatch.value);
                const visible = color ? flatten(color, surface) : null;
                const textOn = visible && contrastRatio(visible, WHITE) >= contrastRatio(visible, { r: 0, g: 0, b: 0 }) ? "#ffffff" : "#0a0a0a";
                return (
                  <li key={swatch.name} className="bg-card">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await copyToClipboard(value);
                        } catch {
                          return;
                        }
                        setCopied(key);
                        window.setTimeout(() => setCopied((current) => (current === key ? null : current)), 1600);
                      }}
                      className="group flex w-full flex-col text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring"
                    >
                      <span
                        className="flex h-20 items-start justify-end p-2"
                        style={{ backgroundColor: visible ? rgbToHex(visible) : swatch.value, color: textOn }}
                      >
                        {copied === key ? (
                          <IconCheck aria-hidden="true" className="size-4" />
                        ) : (
                          <IconCopy aria-hidden="true" className="size-4 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" />
                        )}
                      </span>
                      <span className="flex flex-col gap-0.5 p-2.5">
                        <span className="text-xs font-semibold text-foreground">{swatch.label}</span>
                        <span className="truncate font-mono text-[11px] text-muted-foreground">{value}</span>
                        <span className="sr-only">{copied === key ? "Copied" : "Copy"}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
      <p aria-live="polite" className="sr-only">
        {copied ? "Copied to clipboard" : ""}
      </p>
    </div>
  );
}
