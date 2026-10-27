"use client";

import { useState } from "react";

import { CopyButton, Field, Input, Tabs, TabsContent, TabsList, TabsTrigger } from "@aback-ui/ui";

import { ColorField } from "@/components/tools/color-field";
import {
  DARK_BACKGROUND,
  WHITE,
  contrastRatio,
  formatRatio,
  generateScale,
  parseColor,
  scaleToCssVariables,
  scaleToTailwindConfig,
  scaleToTailwindCss,
} from "@/lib/color";

/** A CSS-safe colour name: lowercase letters, digits, and dashes. */
function slugify(name: string) {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "brand"
  );
}

export function CodeOutput({ code, label }: { code: string; label: string }) {
  return (
    <div className="relative border border-border bg-muted/40">
      <div className="absolute right-2 top-2">
        <CopyButton value={code} variant="outline" size="sm" showLabel label={`Copy ${label}`} />
      </div>
      <pre className="overflow-x-auto p-4 pr-28 font-mono text-[13px] leading-relaxed text-foreground">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function TailwindColorGenerator() {
  const [input, setInput] = useState("#009bf9");
  const [nameInput, setName] = useState("brand");
  const color = parseColor(input);
  const name = slugify(nameInput);
  const scale = color ? generateScale({ ...color, alpha: undefined }) : null;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <ColorField
          id="scale-input"
          label="Base colour"
          value={input}
          onChange={setInput}
          description="Kept exactly at the shade whose lightness is closest."
        />
        <Field htmlFor="scale-name" label="Colour name" description={`Used as --color-${name}-500 and bg-${name}-500.`}>
          <Input
            id="scale-name"
            value={nameInput}
            onChange={(event) => setName(event.target.value)}
            aria-describedby="scale-name-description"
            spellCheck={false}
            autoComplete="off"
            className="font-mono"
          />
        </Field>
      </div>

      {scale ? (
        <>
          <ol className="grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4 lg:grid-cols-11" aria-label={`${name} scale`}>
            {scale.map((item) => {
              const onWhite = contrastRatio(item.rgb, WHITE);
              const onBlack = contrastRatio(item.rgb, DARK_BACKGROUND);
              return (
                <li key={item.step} className="flex flex-col bg-card">
                  <span
                    aria-hidden="true"
                    className="flex h-20 items-end p-2 text-xs font-semibold lg:h-28"
                    style={{ backgroundColor: item.hex, color: onWhite >= onBlack ? "#ffffff" : "#0a0a0a" }}
                  >
                    {item.anchor ? "Base" : null}
                  </span>
                  <span className="flex flex-col gap-0.5 p-2 text-xs">
                    <span className="font-semibold text-foreground">
                      {item.step}
                      {item.anchor ? <span className="sr-only"> (your base colour)</span> : null}
                    </span>
                    <span className="font-mono text-muted-foreground">{item.hex}</span>
                    <span className="font-mono text-[11px] text-muted-foreground" title="Contrast on white and on #0a0a0a">
                      <span className="sr-only">Contrast on white </span>
                      {formatRatio(onWhite)}
                      <span aria-hidden="true"> · </span>
                      <span className="sr-only">, on black </span>
                      {formatRatio(onBlack)}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>

          <Tabs defaultValue="v4" className="gap-0">
            <TabsList aria-label="Export format" className="h-auto flex-wrap justify-start">
              <TabsTrigger value="v4">Tailwind v4 (OKLCH)</TabsTrigger>
              <TabsTrigger value="v4-hex">Tailwind v4 (HEX)</TabsTrigger>
              <TabsTrigger value="v3">Tailwind v3</TabsTrigger>
              <TabsTrigger value="css">CSS variables</TabsTrigger>
            </TabsList>
            <TabsContent value="v4">
              <CodeOutput label="Tailwind v4 theme" code={scaleToTailwindCss(name, scale, "oklch")} />
            </TabsContent>
            <TabsContent value="v4-hex">
              <CodeOutput label="Tailwind v4 theme" code={scaleToTailwindCss(name, scale, "hex")} />
            </TabsContent>
            <TabsContent value="v3">
              <CodeOutput label="Tailwind v3 config" code={scaleToTailwindConfig(name, scale)} />
            </TabsContent>
            <TabsContent value="css">
              <CodeOutput label="CSS variables" code={scaleToCssVariables(name, scale)} />
            </TabsContent>
          </Tabs>
        </>
      ) : null}
    </div>
  );
}
