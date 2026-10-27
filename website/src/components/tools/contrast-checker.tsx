"use client";

import { useState } from "react";
import { IconArrowsExchange, IconCheck, IconX } from "@tabler/icons-react";

import { Button, CopyButton, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@aback-ui/ui";

import { ColorField } from "@/components/tools/color-field";
import {
  type Rgb,
  contrastRatio,
  flatten,
  formatRatio,
  oklchToRgb,
  parseColor,
  rgbToHex,
  rgbToOklch,
  wcag,
} from "@/lib/color";

/**
 * The nearest colour to `foreground`, by OKLCH lightness at the same hue and
 * chroma, that reaches `target` against `background`. Null when no lightness
 * gets there, which only happens for mid-grey backgrounds at 7:1.
 */
function nearestPassing(foreground: Rgb, background: Rgb, target: number): Rgb | null {
  const base = rgbToOklch(foreground);
  let best: Rgb | null = null;
  let bestDistance = Infinity;
  for (let step = 0; step <= 200; step += 1) {
    const l = step / 200;
    const candidate = oklchToRgb({ ...base, l });
    if (contrastRatio(candidate, background) >= target) {
      const distance = Math.abs(l - base.l);
      if (distance < bestDistance) {
        best = candidate;
        bestDistance = distance;
      }
    }
  }
  return best;
}

function Verdict({ pass }: { pass: boolean }) {
  return pass ? (
    <span className="inline-flex items-center gap-1.5 font-medium text-success">
      <IconCheck aria-hidden="true" className="size-4" />
      Pass
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 font-medium text-danger">
      <IconX aria-hidden="true" className="size-4" />
      Fail
    </span>
  );
}

export function ContrastChecker() {
  const [foregroundText, setForeground] = useState("#005d95");
  const [backgroundText, setBackground] = useState("#ffffff");
  const parsedForeground = parseColor(foregroundText);
  const parsedBackground = parseColor(backgroundText);

  // A translucent background is shown over white, the way most pages render it.
  const background = parsedBackground ? flatten(parsedBackground, { r: 1, g: 1, b: 1 }) : null;
  const foreground = parsedForeground;
  const result = foreground && background ? wcag(foreground, background) : null;
  const visibleForeground = foreground && background ? rgbToHex(flatten(foreground, background)) : undefined;
  const visibleBackground = background ? rgbToHex(background) : undefined;

  const suggestions =
    foreground && background && result
      ? [
          { label: "AA (4.5:1)", target: 4.5, needed: !result.aaNormal },
          { label: "AAA (7:1)", target: 7, needed: !result.aaaNormal },
        ]
          .filter((item) => item.needed)
          .map((item) => ({ ...item, color: nearestPassing({ ...foreground, alpha: undefined }, background, item.target) }))
      : [];

  const rows = result
    ? [
        { level: "AA", use: "Normal text", required: "4.5:1", pass: result.aaNormal },
        { level: "AA", use: "Large text (24px, or 18.66px bold)", required: "3:1", pass: result.aaLarge },
        { level: "AA", use: "UI components and graphics (SC 1.4.11)", required: "3:1", pass: result.nonText },
        { level: "AAA", use: "Normal text", required: "7:1", pass: result.aaaNormal },
        { level: "AAA", use: "Large text", required: "4.5:1", pass: result.aaaLarge },
      ]
    : [];

  return (
    <div className="flex flex-col gap-8">
      <div className="grid items-end gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <ColorField id="contrast-foreground" label="Text colour" value={foregroundText} onChange={setForeground} />
        <Button
          variant="outline"
          size="icon"
          className="mb-6 justify-self-center"
          onClick={() => {
            setForeground(backgroundText);
            setBackground(foregroundText);
          }}
          aria-label="Swap text and background colours"
        >
          <IconArrowsExchange aria-hidden="true" />
        </Button>
        <ColorField id="contrast-background" label="Background colour" value={backgroundText} onChange={setBackground} />
      </div>

      <div className="grid gap-px border border-border bg-border lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div
          className="flex min-h-56 flex-col justify-center gap-4 p-6 sm:p-8"
          style={{ backgroundColor: visibleBackground, color: visibleForeground }}
        >
          <p className="text-[24px] font-semibold leading-tight">Large text at 24px</p>
          <p className="text-base leading-relaxed">
            Normal body text at 16px. The quick brown fox jumps over the lazy dog, and every reader
            should be able to follow along.
          </p>
          <p className="flex items-center gap-3 text-sm">
            <span aria-hidden="true" className="inline-block size-8 border-2" style={{ borderColor: visibleForeground }} />
            A 2px border and icon in the text colour
          </p>
        </div>
        <div className="flex flex-col justify-center gap-2 bg-card p-6" aria-live="polite">
          <p className="text-sm text-muted-foreground">Contrast ratio</p>
          <p className="font-mono text-5xl font-bold tabular-nums tracking-tight text-foreground">
            {result ? formatRatio(result.ratio) : "—"}
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {result
              ? result.aaaNormal
                ? "Passes AAA for all text."
                : result.aaNormal
                  ? "Passes AA for all text."
                  : result.aaLarge
                    ? "Passes AA for large text and UI only."
                    : "Fails WCAG AA at every size."
              : "Enter two valid colours."}
          </p>
        </div>
      </div>

      {result ? (
        <Table containerProps={{ "aria-label": "WCAG 2.2 contrast results" }}>
          <TableHeader>
            <TableRow>
              <TableHead>Level</TableHead>
              <TableHead>Applies to</TableHead>
              <TableHead>Required</TableHead>
              <TableHead>Result</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={`${row.level}-${row.use}`}>
                <TableCell className="font-medium">{row.level}</TableCell>
                <TableCell className="text-muted-foreground">{row.use}</TableCell>
                <TableCell className="font-mono text-xs">{row.required}</TableCell>
                <TableCell>
                  <Verdict pass={row.pass} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : null}

      {suggestions.length ? (
        <div className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-foreground">Nearest passing text colour</h2>
          <p className="text-sm text-muted-foreground">
            Same hue and chroma, with the lightness moved just far enough to pass on this background.
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {suggestions.map((item) => (
              <li key={item.label} className="flex items-center gap-3 border border-border p-3">
                {item.color ? (
                  <>
                    <span aria-hidden="true" className="size-10 shrink-0 border border-border" style={{ backgroundColor: rgbToHex(item.color) }} />
                    <span className="flex min-w-0 flex-col">
                      <span className="text-sm font-medium text-foreground">{item.label}</span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {rgbToHex(item.color)} · {formatRatio(contrastRatio(item.color, background!))}
                      </span>
                    </span>
                    <span className="ml-auto flex gap-1">
                      <Button variant="outline" size="sm" onClick={() => setForeground(rgbToHex(item.color!))}>
                        Use
                      </Button>
                      <CopyButton value={rgbToHex(item.color)} variant="ghost" size="sm" label={`Copy ${item.label} colour`} />
                    </span>
                  </>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No shade of this hue reaches {item.label} on this background. Change the background instead.
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
