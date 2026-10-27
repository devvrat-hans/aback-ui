import { blocks } from "./blocks";
import { components } from "./component-catalog";
import { posts } from "./posts";
import { guides } from "./site";
import { tools } from "./tools";

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

const resourceItems: SearchItem[] = [
  {
    title: "Theme generator",
    description: "Build a contrast-checked brand theme from one colour.",
    href: "/themes",
    group: "Tools",
  },
  {
    title: "Colors",
    description: "Every Aback UI colour as HEX, RGB, HSL, and OKLCH.",
    href: "/colors",
    group: "Tools",
  },
  ...tools.map((tool) => ({ title: tool.title, description: tool.description, href: `/tools/${tool.slug}`, group: "Tools" })),
  ...posts.map((post) => ({ title: post.title, description: post.description, href: `/blog/${post.slug}`, group: "Blog" })),
  { title: "About", description: "Why Aback UI exists and how it is maintained.", href: "/about", group: "Docs" },
];

export const searchItems: SearchItem[] = [...docItems, ...blockItems, ...componentItems, ...resourceItems];
