"use client";

import { useState } from "react";
import { IconCheck, IconInfoCircle, IconX } from "@tabler/icons-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Checkbox,
  Input,
  Label,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@aback-ui/ui";

import { ColorField } from "@/components/tools/color-field";
import { CodeOutput } from "@/components/tools/tailwind-color-generator";
import { type ThemeRole, formatRatio, generateTheme, parseColor } from "@/lib/color";

const presets = [
  { name: "Aback Blue", value: "#009bf9" },
  { name: "Violet", value: "#7c3aed" },
  { name: "Emerald", value: "#059669" },
  { name: "Orange", value: "#f97316" },
  { name: "Rose", value: "#e11d48" },
  { name: "Teal", value: "#0d9488" },
];

export interface TokenValue {
  name: string;
  value: string;
}

/** Inline custom properties for a preview pane. Components read the roles, so they restyle live. */
function roleStyle(base: TokenValue[], roles: ThemeRole[]) {
  return Object.fromEntries([...base, ...roles].map((role) => [role.name, role.value])) as React.CSSProperties;
}

/**
 * Real components, rendered with the generated roles applied to this subtree
 * only. Each pane also sets its theme's neutral roles inline, so the light
 * pane stays light while the site itself is in dark mode.
 */
function Preview({ base, roles, dark }: { base: TokenValue[]; roles: ThemeRole[]; dark: boolean }) {
  const id = dark ? "dark" : "light";
  return (
    <div
      className={`${dark ? "dark" : ""} flex flex-col gap-5 border border-border bg-background p-5 text-foreground sm:p-6`}
      style={{ ...roleStyle(base, roles), colorScheme: dark ? "dark" : "light" }}
    >
      <p className="text-sm font-semibold">{dark ? "Dark" : "Light"} theme</p>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Links like{" "}
        <a href="#theme-css" className="font-medium text-link underline underline-offset-4 hover:text-link-hover">
          this one
        </a>{" "}
        use the link role. Tab to the field to see the focus ring.
      </p>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`preview-email-${id}`}>Email</Label>
        <Input id={`preview-email-${id}`} placeholder="you@example.com" />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Checkbox id={`preview-check-${id}`} defaultChecked />
          <Label htmlFor={`preview-check-${id}`}>Remember me</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id={`preview-switch-${id}`} defaultChecked />
          <Label htmlFor={`preview-switch-${id}`}>Notifications</Label>
        </div>
      </div>
      <Alert variant="info">
        <IconInfoCircle aria-hidden="true" />
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>Informational alerts use the info role.</AlertDescription>
      </Alert>
      <div className="flex flex-wrap gap-2">
        <Button variant="brand">Brand action</Button>
        <Button>Primary</Button>
        <Button variant="outline">Outline</Button>
      </div>
    </div>
  );
}

function RoleTable({ title, roles }: { title: string; roles: ThemeRole[] }) {
  return (
    <Table containerProps={{ "aria-label": `${title} roles and contrast` }}>
      <TableHeader>
        <TableRow>
          <TableHead>{title} role</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Contrast</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {roles.map((role) => (
          <TableRow key={role.name}>
            <TableCell className="font-mono text-xs font-semibold">{role.name}</TableCell>
            <TableCell>
              <span className="flex items-center gap-2 font-mono text-xs">
                <span aria-hidden="true" className="size-4 shrink-0 border border-border" style={{ backgroundColor: role.value }} />
                {role.value}
              </span>
            </TableCell>
            <TableCell className="text-xs">
              {role.check ? (
                <span className={`inline-flex items-center gap-1.5 ${role.check.ratio >= role.check.required ? "text-success" : "text-danger"}`}>
                  {role.check.ratio >= role.check.required ? (
                    <IconCheck aria-hidden="true" className="size-3.5" />
                  ) : (
                    <IconX aria-hidden="true" className="size-3.5" />
                  )}
                  <span className="font-mono">{formatRatio(role.check.ratio)}</span>
                  <span className="text-muted-foreground">
                    on {role.check.against}, needs {role.check.required}:1
                    <span className="sr-only">{role.check.ratio >= role.check.required ? ", passes" : ", fails"}</span>
                  </span>
                </span>
              ) : (
                <span className="text-muted-foreground">Decorative</span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function ThemeGenerator({ light, dark }: { light: TokenValue[]; dark: TokenValue[] }) {
  const [input, setInput] = useState("#7c3aed");
  const color = parseColor(input);
  const theme = color ? generateTheme({ ...color, alpha: undefined }) : null;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-4">
        <ColorField id="theme-brand" label="Brand colour" value={input} onChange={setInput} />
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Example brand colours">
          {presets.map((preset) => (
            <Button key={preset.value} variant="outline" size="sm" onClick={() => setInput(preset.value)}>
              <span aria-hidden="true" className="size-3 border border-border" style={{ backgroundColor: preset.value }} />
              {preset.name}
            </Button>
          ))}
        </div>
      </div>

      {theme ? (
        <>
          <section aria-labelledby="theme-ramp" className="flex flex-col gap-3">
            <h2 id="theme-ramp" className="text-lg font-semibold text-foreground">
              Ramp
            </h2>
            <ol className="grid grid-cols-4 gap-px border border-border bg-border sm:grid-cols-11">
              {theme.scale.map((item) => (
                <li key={item.step} className="flex flex-col bg-card">
                  <span aria-hidden="true" className="h-12" style={{ backgroundColor: item.hex }} />
                  <span className="px-1.5 py-1 text-[11px]">
                    <span className="block font-semibold text-foreground">
                      {item.step}
                      {item.anchor ? " ·" : ""}
                      {item.anchor ? <span className="sr-only"> your colour</span> : null}
                    </span>
                    <span className="block font-mono text-muted-foreground">{item.hex}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="theme-preview" className="flex flex-col gap-3">
            <h2 id="theme-preview" className="text-lg font-semibold text-foreground">
              Preview with real components
            </h2>
            <p className="max-w-[68ch] text-sm leading-relaxed text-muted-foreground">
              The preview applies the generated roles live. Utilities that read ramp steps directly, such
              as <code className="bg-muted px-1 font-mono text-[0.9em] text-foreground">bg-primary-500</code>,
              change once the CSS is compiled into your project.
            </p>
            <div className="grid gap-4 lg:grid-cols-2">
              <Preview base={light} roles={theme.light} dark={false} />
              <Preview base={dark} roles={theme.dark} dark />
            </div>
          </section>

          <section aria-labelledby="theme-roles" className="flex flex-col gap-3">
            <h2 id="theme-roles" className="text-lg font-semibold text-foreground">
              Roles and contrast
            </h2>
            <p className="max-w-[68ch] text-sm leading-relaxed text-muted-foreground">
              Each text role takes the shade nearest the middle of the ramp that still reaches WCAG AA
              (4.5:1) on its background; focus rings and icons need 3:1. A failing row means no shade of
              this hue gets there, so pick a different colour.
            </p>
            <div className="grid gap-4 xl:grid-cols-2">
              <RoleTable title="Light" roles={theme.light} />
              <RoleTable title="Dark" roles={theme.dark} />
            </div>
          </section>

          <section aria-labelledby="theme-css" className="flex flex-col gap-3">
            <h2 id="theme-css" className="scroll-mt-24 text-lg font-semibold text-foreground">
              CSS
            </h2>
            <p className="max-w-[68ch] text-sm leading-relaxed text-muted-foreground">
              Paste this into your global stylesheet after the Aback theme import (styles/aback.css from{" "}
              <code className="bg-muted px-1 font-mono text-[0.9em] text-foreground">aback-ui init</code>, or
              @aback-ui/tokens). It replaces the Aback Blue ramp and brand roles; neutrals and status colours
              stay as they are.
            </p>
            <CodeOutput label="theme CSS" code={theme.css} />
          </section>
        </>
      ) : null}
    </div>
  );
}
