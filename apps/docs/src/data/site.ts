export const site = {
  name: "Aback UI",
  url: "https://abackui.com",
  title: "Aback UI",
  description:
    "The building blocks behind better applications. Accessible React components, design tokens, and a source-copy registry from Aback Group.",
  tagline: "The building blocks behind better applications.",
  registry: "https://abackui.com/r",
  registryCommand: "npx shadcn@latest add",
  author: "Aback Group",
} as const;

export interface NavItem {
  title: string;
  href: string;
  description?: string;
  external?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const gettingStartedNav: NavSection = {
  title: "Getting started",
  items: [
    {
      title: "Introduction",
      href: "/docs",
      description: "What Aback UI is and how it is built.",
    },
    {
      title: "Installation",
      href: "/docs/installation",
      description: "Add the theme and copy your first component.",
    },
    {
      title: "Theming",
      href: "/docs/theming",
      description: "Semantic tokens, light and dark, and brand overrides.",
    },
    {
      title: "Design tokens",
      href: "/docs/tokens",
      description: "Color roles, type, spacing, and geometry.",
    },
    {
      title: "Registry",
      href: "/docs/registry",
      description: "How source-copy installation works.",
    },
    {
      title: "Accessibility",
      href: "/docs/accessibility",
      description: "Keyboard behavior and what has been verified.",
    },
  ],
};

export const footerNav: NavSection[] = [
  {
    title: "Product",
    items: [
      { title: "Components", href: "/docs/components" },
      { title: "Design tokens", href: "/docs/tokens" },
      { title: "Registry", href: "/docs/registry" },
      { title: "Built with Aback UI", href: "/built-with" },
    ],
  },
  {
    title: "Developers",
    items: [
      { title: "Installation", href: "/docs/installation" },
      { title: "Theming", href: "/docs/theming" },
      { title: "Accessibility", href: "/docs/accessibility" },
      { title: "Contributing", href: "/docs#contributing" },
    ],
  },
  {
    title: "Aback Group",
    items: [
      { title: "Aback Tools", href: "https://abacktools.com", external: true },
      { title: "Aback Launch", href: "https://abacklaunch.com", external: true },
    ],
  },
];
