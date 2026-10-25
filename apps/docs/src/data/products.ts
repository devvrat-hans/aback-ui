export interface Product {
  slug: "aback-tools" | "aback-launch" | "aback-group";
  name: string;
  url: string;
  tagline: string;
  description: string;
  detail: string;
}

export const products: Product[] = [
  {
    slug: "aback-tools",
    name: "Aback Tools",
    url: "https://abacktools.com",
    tagline: "Free tools that run in your browser.",
    description:
      "A library of browser-based utilities for files, images, data, and text. The dense tool workbench and square-corner chrome shaped the foundation components.",
    detail: "Component patterns proven across thousands of tool pages.",
  },
  {
    slug: "aback-launch",
    name: "Aback Launch",
    url: "https://abacklaunch.com",
    tagline: "Launch once. Get found for years.",
    description:
      "A launch and discovery platform for products. Its forms, dialogs, data tables, and status surfaces shaped the overlay and feedback components.",
    detail: "Overlay, form, and data patterns from a production product.",
  },
  {
    slug: "aback-group",
    name: "Aback Group",
    url: "https://aback.group",
    tagline: "Software, tools, and technology products.",
    description:
      "The umbrella site and product directory for the Aback ecosystem. Its header, command menu, section headings, and status badges shaped the application patterns.",
    detail: "Directory, navigation, and status patterns from the group site.",
  },
];

export function productName(slug: string) {
  return products.find((product) => product.slug === slug)?.name ?? slug;
}
