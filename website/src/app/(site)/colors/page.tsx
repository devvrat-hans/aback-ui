import type { Metadata } from "next";

import { Breadcrumbs } from "@aback-ui/ui";

import { JsonLd } from "@/components/json-ld";
import { A, Prose } from "@/components/prose";
import { PaletteSwatches, type SwatchGroup } from "@/components/tools/palette-swatches";
import { readPalette } from "@/lib/palette";
import { routeGraph } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/colors");

const crumbs = [{ label: "Colors" }];

/** Semantic roles grouped the way the theming guide explains them. */
const roleGroups: { title: string; description: string; names: string[] }[] = [
  {
    title: "Surfaces and text",
    description: "Page, card, and popover backgrounds with the text that sits on them.",
    names: ["--background", "--foreground", "--card", "--muted", "--muted-foreground", "--border", "--separator", "--input"],
  },
  {
    title: "Actions",
    description: "The default action is neutral ink. Brand blue is reserved for the brand variant.",
    names: ["--primary", "--primary-foreground", "--secondary", "--accent", "--destructive", "--ring"],
  },
  {
    title: "Brand roles",
    description: "Where Aback Blue appears: links, focus, icons, tints, and the brand fill.",
    names: ["--link", "--link-hover", "--focus-ring", "--brand-icon", "--brand-chip", "--brand-wash", "--brand-fill", "--on-brand-fill"],
  },
  {
    title: "Status",
    description: "Success, warning, danger, and info, each with a soft background and a strong text shade.",
    names: [
      "--success",
      "--success-soft",
      "--success-strong",
      "--warning",
      "--warning-soft",
      "--warning-strong",
      "--danger",
      "--danger-soft",
      "--danger-strong",
      "--info",
      "--info-soft",
    ],
  },
];

export default function ColorsPage() {
  const { ramp, light, dark } = readPalette();

  const groups: SwatchGroup[] = [
    {
      title: "Aback Blue",
      description: "The brand ramp. 500 (#009bf9) is the anchor in both themes; the roles below pick from it.",
      swatches: ramp.map((token) => ({ ...token, label: token.name.replace("--color-primary-", "primary-") })),
    },
    ...roleGroups.flatMap((group) =>
      (["light", "dark"] as const).map((mode) => {
        const values = mode === "light" ? light : dark;
        return {
          title: `${group.title} (${mode})`,
          description: group.description,
          dark: mode === "dark",
          swatches: group.names
            .map((name) => values.find((token) => token.name === name))
            .filter((token) => token !== undefined)
            .map((token) => ({ ...token, label: token.name.slice(2) })),
        };
      }),
    ),
  ];

  return (
    <div className="container-page pb-24 pt-10 lg:pt-14">
      <JsonLd data={routeGraph("/colors", crumbs)} />
      <header className="flex flex-col gap-3 border-b border-border pb-10">
        <p className="text-xs font-medium uppercase tracking-wide text-link">Colors</p>
        <h1 className="text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">The Aback UI palette</h1>
        <Breadcrumbs items={[{ label: "Home", href: "/" }, ...crumbs]} />
        <p className="mt-1 max-w-[68ch] text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
          Every colour in the theme, read from the tokens package at build time. Pick a format and click a
          swatch to copy it. Translucent values are shown over the theme&apos;s own background.
        </p>
      </header>

      <div className="mt-10">
        <PaletteSwatches groups={groups} />
      </div>

      <Prose className="mt-20">
        <h2 id="use-roles">Use the role, not the swatch</h2>
        <p>
          In components, reach for the semantic role, such as <code>text-link</code> or{" "}
          <code>bg-brand-wash</code>, rather than a ramp step like <code>text-primary-700</code>. Roles
          change between light and dark; ramp steps do not. The <A href="/docs/theming">theming guide</A>{" "}
          explains each role, and <A href="/docs/tokens">design tokens</A> lists type, spacing, and shape.
        </p>
        <h2 id="your-brand">Want your own brand colour?</h2>
        <p>
          The <A href="/themes">theme generator</A> rebuilds the ramp and brand roles from any colour and
          checks their contrast. For a scale on its own, use the{" "}
          <A href="/tools/tailwind-color-generator">Tailwind colour scale generator</A>.
        </p>
      </Prose>
    </div>
  );
}
