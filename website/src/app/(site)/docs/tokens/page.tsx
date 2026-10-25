import type { Metadata } from "next";

import { DocsPage, DocsPageHeader, type TocItem } from "@/components/docs-page";
import { GuidePager } from "@/components/docs-ui";

export const metadata: Metadata = {
  title: "Design tokens",
  description:
    "The Aback UI color roles, Aback Blue ramp, typography scale, spacing, control heights, and square geometry.",
  alternates: { canonical: "/docs/tokens" },
};

const semanticRoles = [
  { name: "Canvas", variable: "--background", utility: "bg-background", light: "#ffffff", dark: "#0a0a0a" },
  { name: "Surface", variable: "--card", utility: "bg-card", light: "#ffffff", dark: "#171717" },
  { name: "Muted", variable: "--muted", utility: "bg-muted", light: "#f5f5f5", dark: "#262626" },
  { name: "Ink", variable: "--foreground", utility: "text-foreground", light: "#0a0a0a", dark: "#fafafa" },
  { name: "Mute", variable: "--muted-foreground", utility: "text-muted-foreground", light: "#737373", dark: "#a1a1a1" },
  { name: "Action", variable: "--primary", utility: "bg-primary", light: "#171717", dark: "#e5e5e5" },
  { name: "On action", variable: "--primary-foreground", utility: "text-primary-foreground", light: "#fafafa", dark: "#171717" },
  { name: "Hairline", variable: "--border", utility: "border-border", light: "#e5e5e5", dark: "white 10%" },
  { name: "Separator", variable: "--separator", utility: "border-separator", light: "#d7d7d7", dark: "white 15%" },
  { name: "Input", variable: "--input", utility: "border-input", light: "#e5e5e5", dark: "white 15%" },
  { name: "Link", variable: "--link", utility: "text-link", light: "#005d95", dark: "#33b7ff" },
  { name: "Brand icon", variable: "--brand-icon", utility: "text-brand-icon", light: "#007cc7", dark: "#33b7ff" },
  { name: "Brand chip", variable: "--brand-chip", utility: "bg-brand-chip", light: "#ccedff", dark: "#001f32" },
  { name: "Brand wash", variable: "--brand-wash", utility: "bg-brand-wash", light: "#e6f6ff", dark: "primary-900 30%" },
  { name: "Brand fill", variable: "--brand-fill", utility: "bg-brand-fill", light: "#005d95", dark: "#33b7ff" },
  { name: "On brand fill", variable: "--on-brand-fill", utility: "text-on-brand-fill", light: "#ffffff", dark: "#000f19" },
  { name: "Focus ring", variable: "--focus-ring", utility: "ring-focus-ring", light: "#007cc7", dark: "#33b7ff" },
  { name: "Destructive", variable: "--destructive", utility: "bg-destructive", light: "#e7000b", dark: "#ff6467" },
  { name: "Success", variable: "--success", utility: "text-success", light: "#008236", dark: "#05df72" },
  { name: "Warning", variable: "--warning", utility: "text-warning", light: "#bb4d00", dark: "#fbbf24" },
  { name: "Danger", variable: "--danger", utility: "text-danger", light: "#c10007", dark: "#ff6467" },
];

const ramp = [
  { step: 50, hex: "#e6f6ff", role: "Active wash, selected rows" },
  { step: 100, hex: "#ccedff", role: "Icon chips, active tool rows" },
  { step: 200, hex: "#99dbff", role: "Tinted borders, callouts" },
  { step: 300, hex: "#66c9ff", role: "Hover borders, dark link hover" },
  { step: 400, hex: "#33b7ff", role: "Dark links, icons, focus" },
  { step: 500, hex: "#009bf9", role: "Brand anchor, accents, progress" },
  { step: 600, hex: "#007cc7", role: "Brand icons, light focus ring" },
  { step: 700, hex: "#005d95", role: "Light links, brand fill" },
  { step: 800, hex: "#003e63", role: "Link and brand hover" },
  { step: 900, hex: "#001f32", role: "Dark icon chips" },
  { step: 950, hex: "#000f19", role: "Text on brand fill in dark" },
];

const typeScale = [
  { token: "display-lg", className: "text-4xl font-bold tracking-tight", sample: "The building blocks", note: "36 / 40, 700" },
  { token: "heading-xl", className: "text-3xl font-bold tracking-tight", sample: "Page title", note: "30 / 36, 700" },
  { token: "heading-lg", className: "text-2xl font-bold tracking-tight", sample: "Article section", note: "24 / 32, 700" },
  { token: "heading-md", className: "text-xl font-semibold", sample: "Free-standing section", note: "20 / 28, 600" },
  { token: "heading-sm", className: "text-lg font-semibold", sample: "Card title", note: "18 / 28, 600" },
  { token: "title-md", className: "text-base font-medium", sample: "Item title", note: "16 / 24, 500" },
  { token: "body-lg", className: "text-base", sample: "Page description", note: "16 / 24, 400" },
  { token: "body-md", className: "text-sm", sample: "Default interface text", note: "14 / 20, 400" },
  { token: "body-sm", className: "text-xs", sample: "Meta, captions, helper text", note: "12 / 16, 400" },
  { token: "eyebrow", className: "text-xs font-medium uppercase tracking-wide", sample: "Option group", note: "12 / 16, 500" },
  { token: "overline", className: "text-[11px] font-semibold uppercase tracking-wider", sample: "Column title", note: "11 / 16, 600" },
  { token: "micro-caps", className: "text-[10px] font-bold uppercase tracking-[0.12em]", sample: "Group header", note: "10 / 12, 700" },
  { token: "code", className: "font-mono text-sm", sample: "const aback = true;", note: "14 / 20, 400" },
];

const spacing = [4, 8, 16, 24, 32, 40, 48, 64];

const toc: TocItem[] = [
  { id: "color-heading", title: "Semantic color" },
  { id: "ramp-heading", title: "Aback Blue ramp" },
  { id: "type-heading", title: "Typography" },
  { id: "spacing-heading", title: "Spacing and layout" },
  { id: "shape-heading", title: "Shape" },
];

export default function TokensPage() {
  return (
    <DocsPage toc={toc} className="flex flex-col gap-14">
      <DocsPageHeader
        eyebrow="Foundations"
        title="Design tokens"
        description="Semantic roles, one Aback Blue ramp, a compact type scale, and square geometry. These are the values components read."
        crumbs={[{ label: "Docs", href: "/docs" }, { label: "Design tokens" }]}
      />

      <section className="flex flex-col gap-4" aria-labelledby="color-heading">
        <div>
          <h2 id="color-heading" className="scroll-mt-20 text-xl font-semibold tracking-tight text-foreground">
            Semantic color
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Each role resolves to a light and a dark value. The two halves of a swatch show the
            same role in each theme.
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          {semanticRoles.map((role) => (
            <div key={role.variable} className="flex items-stretch gap-3 border border-border bg-card p-2">
              <div className="flex w-16 shrink-0 flex-col">
                <span
                  className="h-5 border-b border-black/10"
                  style={{ backgroundColor: role.light }}
                  aria-hidden="true"
                />
                <span
                  className="h-5 border border-white/10"
                  style={{ backgroundColor: role.dark }}
                  aria-hidden="true"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-medium text-foreground">{role.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">{role.utility}</span>
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  {role.light} / {role.dark}
                </span>
                <span className="font-mono text-xs text-muted-foreground">{role.variable}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4" aria-labelledby="ramp-heading">
        <div>
          <h2 id="ramp-heading" className="scroll-mt-20 text-xl font-semibold tracking-tight text-foreground">
            Aback Blue ramp
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            One hue, eleven steps. 500 is the anchor. 700 carries light text links and brand fills,
            and 400 carries those roles in dark.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-px overflow-hidden border border-border bg-border sm:grid-cols-4 lg:grid-cols-6">
          {ramp.map((color) => (
            <div key={color.step} className="bg-card p-3">
              <div
                className="mb-2 h-10 border border-black/5"
                style={{ backgroundColor: color.hex }}
                aria-hidden="true"
              />
              <p className="text-xs font-semibold text-foreground">{color.step}</p>
              <p className="font-mono text-xs text-muted-foreground">{color.hex}</p>
              <p className="mt-1 text-xs leading-snug text-muted-foreground">{color.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4" aria-labelledby="type-heading">
        <div>
          <h2 id="type-heading" className="scroll-mt-20 text-xl font-semibold tracking-tight text-foreground">
            Typography
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Geist Sans for the interface and prose, Geist Mono for code and data. Readable content
            never drops below 12px; 10 and 11 are reserved for uppercase labels.
          </p>
        </div>

        <div className="divide-y divide-border border border-border">
          {typeScale.map((type) => (
            <div
              key={type.token}
              className="flex flex-col gap-1 p-4 sm:flex-row sm:items-baseline sm:justify-between"
            >
              <span className={type.className}>{type.sample}</span>
              <span className="shrink-0 font-mono text-xs text-muted-foreground">
                {type.token} · {type.note}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4" aria-labelledby="spacing-heading">
        <div>
          <h2 id="spacing-heading" className="scroll-mt-20 text-xl font-semibold tracking-tight text-foreground">
            Spacing and layout
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            A 4px base unit. Page blocks use 24px, marketing sections use 32px, and controls share a
            36px height.
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-3 border border-border p-4">
          {spacing.map((value) => (
            <div key={value} className="flex flex-col items-center gap-1">
              <span className="bg-primary-100 dark:bg-primary-900" style={{ width: value, height: value }} />
              <span className="font-mono text-xs text-muted-foreground">{value}</span>
            </div>
          ))}
        </div>

        <div className="grid gap-2 sm:grid-cols-4">
          {[
            { label: "Control xs", value: "24px" },
            { label: "Control sm", value: "32px" },
            { label: "Control md", value: "36px" },
            { label: "Control lg", value: "40px" },
          ].map((control) => (
            <div key={control.label} className="border border-border p-3">
              <div className="mb-2 flex h-10 items-end">
                <span
                  className="w-full bg-muted"
                  style={{ height: control.value }}
                  aria-hidden="true"
                />
              </div>
              <p className="text-xs font-medium text-foreground">{control.label}</p>
              <p className="font-mono text-xs text-muted-foreground">{control.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4" aria-labelledby="shape-heading">
        <div>
          <h2 id="shape-heading" className="scroll-mt-20 text-xl font-semibold tracking-tight text-foreground">
            Shape
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            Every radius is zero: cards, controls, avatars, dialogs, status dots, and switches. The
            only rounded element is the native scrollbar thumb.
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {["Card", "Control", "Dialog"].map((label) => (
            <div key={label} className="border border-border bg-card p-6 text-center">
              <p className="text-sm font-medium text-foreground">{label}</p>
              <p className="mt-1 font-mono text-xs text-muted-foreground">border-radius: 0</p>
            </div>
          ))}
        </div>
      </section>
      <GuidePager href="/docs/tokens" />
    </DocsPage>
  );
}
