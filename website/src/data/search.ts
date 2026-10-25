import { blocks } from "./blocks";
import { components } from "./component-catalog";
import { guides } from "./site";

export interface SearchItem {
  title: string;
  description: string;
  href: string;
  group: string;
}

const docItems: SearchItem[] = [
  ...guides.map((item) => ({
    title: item.title,
    description: item.description ?? "",
    href: item.href,
    group: "Docs",
  })),
  {
    title: "Components",
    description: "Browse every Aback UI component with live previews and API notes.",
    href: "/docs/components",
    group: "Docs",
  },
  {
    title: "Blocks",
    description: "Complete sections: headers, pricing, FAQ, sign-in, settings, and more.",
    href: "/docs/blocks",
    group: "Docs",
  },
];

const componentItems: SearchItem[] = components.map((item) => ({
  title: item.title,
  description: item.description,
  href: `/docs/components/${item.name}`,
  group: item.categories?.[0] ?? "Components",
}));

const blockItems: SearchItem[] = blocks.map((block) => ({
  title: block.title,
  description: block.description,
  href: `/docs/blocks/${block.name}`,
  group: "Blocks",
}));

export const searchItems: SearchItem[] = [...docItems, ...blockItems, ...componentItems];
