import { blocks } from "./blocks";
import { components } from "./component-catalog";
import { gettingStartedNav } from "./site";

export interface SearchItem {
  title: string;
  description: string;
  href: string;
  group: string;
}

const docItems: SearchItem[] = [
  ...gettingStartedNav.items.map((item) => ({
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
    title: "Built with Aback UI",
    description: "The Aback products whose interfaces shaped these components.",
    href: "/built-with",
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
