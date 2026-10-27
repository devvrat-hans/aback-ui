import type { Metadata } from "next";
import Link from "next/link";
import { IconArrowRight, IconColorSwatch, IconContrast2, IconPalette, IconTransform } from "@tabler/icons-react";

import { Breadcrumbs } from "@aback-ui/ui";

import { JsonLd } from "@/components/json-ld";
import { tools } from "@/data/tools";
import { itemListSchema, routeGraph } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/tools");

const icons: Record<string, typeof IconPalette> = {
  "contrast-checker": IconContrast2,
  "color-converter": IconTransform,
  "tailwind-color-generator": IconColorSwatch,
};

const items = [
  ...tools.map((tool) => ({
    title: tool.title,
    href: `/tools/${tool.slug}`,
    description: tool.description,
    icon: icons[tool.slug] ?? IconPalette,
  })),
  {
    title: "Theme generator",
    href: "/themes",
    description:
      "Pick a brand colour and get a complete, contrast-checked Aback UI theme for light and dark, previewed on real components.",
    icon: IconPalette,
  },
];

const crumbs = [{ label: "Tools" }];

export default function ToolsPage() {
  return (
    <div className="container-page pb-24 pt-10 lg:pt-14">
      <JsonLd data={routeGraph("/tools", crumbs, [itemListSchema(items.map((item) => ({ name: item.title, path: item.href })))])} />
      <header className="flex flex-col gap-3 border-b border-border pb-10">
        <p className="text-xs font-medium uppercase tracking-wide text-link">Free tools</p>
        <h1 className="text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
          Tools for building interfaces
        </h1>
        <Breadcrumbs items={[{ label: "Home", href: "/" }, ...crumbs]} />
        <p className="mt-1 max-w-[68ch] text-base leading-relaxed text-pretty text-muted-foreground sm:text-lg">
          Colour and accessibility utilities we use while building Aback UI. They are free, need no
          account, and run entirely in your browser.
        </p>
      </header>

      <ul className="mt-10 grid gap-px border border-border bg-border md:grid-cols-2">
        {items.map((item) => (
          <li key={item.href} className="bg-background">
            <Link
              href={item.href}
              className="group flex h-full flex-col gap-3 p-6 outline-none transition-colors duration-200 hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring"
            >
              <item.icon aria-hidden="true" className="size-6 text-brand-icon" />
              <span className="flex items-center justify-between text-lg font-semibold text-foreground group-hover:text-link">
                {item.title}
                <IconArrowRight
                  aria-hidden="true"
                  className="size-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-link motion-reduce:transition-none"
                />
              </span>
              <span className="text-sm leading-relaxed text-muted-foreground">{item.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
