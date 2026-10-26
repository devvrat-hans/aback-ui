export const site = {
  name: "Aback UI",
  url: "https://abackui.com",
  title: "Aback UI",
  description:
    "The building blocks behind better applications. Accessible React components, design tokens, and a source-copy registry from Aback Group.",
  tagline: "The building blocks behind better applications.",
  registry: "https://abackui.com/r",
  /** The CLI as it is run with npx. Pinning @latest keeps the bundled registry current. */
  cli: "aback-ui@latest",
  author: "Aback Group",
  repository: "https://github.com/devvrat-hans/aback-ui",
  /**
   * Whether aback-ui, @aback-ui/ui, and @aback-ui/tokens are on npm. While
   * false, install pages say the packages are not on npm yet, so nobody
   * mistakes a failing command for a broken setup.
   */
  npmPublished: true,
} as const;

export interface NavItem {
  title: string;
  href: string;
  description?: string;
  external?: boolean;
  /** A static file or route handler, linked with a plain anchor instead of the router. */
  file?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

/** The header links. `exact` marks links whose children are other sections. */
export const mainNav: { title: string; href: string; exact: boolean }[] = [
  { title: "Docs", href: "/docs", exact: true },
  { title: "Components", href: "/docs/components", exact: false },
  { title: "Blocks", href: "/docs/blocks", exact: false },
  { title: "Theming", href: "/docs/theming", exact: true },
  { title: "Changelog", href: "/docs/changelog", exact: true },
];

/**
 * The written guides, in reading order. The sidebar, search, the pager at the
 * foot of each guide, and llms.txt all read this list. Components and blocks
 * are listed from the registry instead.
 */
export const guideNav: NavSection[] = [
  {
    title: "Get started",
    items: [
      {
        title: "Introduction",
        href: "/docs",
        description: "What Aback UI is, what is in it, and the two ways to use it.",
      },
      {
        title: "Installation",
        href: "/docs/installation",
        description: "Set up a project and add your first component with the aback-ui CLI.",
      },
      {
        title: "npm package",
        href: "/docs/package",
        description: "Install @aback-ui/ui and import components instead of copying them.",
      },
      {
        title: "CLI",
        href: "/docs/cli",
        description: "Every aback-ui command, option, and the aback-ui.json reference.",
      },
    ],
  },
  {
    title: "Foundations",
    items: [
      {
        title: "Theming",
        href: "/docs/theming",
        description: "Semantic colour roles and how to override them safely.",
      },
      {
        title: "Dark mode",
        href: "/docs/dark-mode",
        description: "Light, dark, and system themes without a flash on load.",
      },
      {
        title: "Design tokens",
        href: "/docs/tokens",
        description: "Every colour, the Aback Blue ramp, type, spacing, and shape.",
      },
      {
        title: "Accessibility",
        href: "/docs/accessibility",
        description: "Keyboard behavior by component and what has been verified.",
      },
    ],
  },
  {
    title: "Resources",
    items: [
      {
        title: "Registry format",
        href: "/docs/registry",
        description: "The item JSON the CLI installs, its schema, and self-hosting.",
      },
      {
        title: "Contributing",
        href: "/docs/contributing",
        description: "How the repository is organized and how to propose a component.",
      },
      {
        title: "Changelog",
        href: "/docs/changelog",
        description: "What changed in each release.",
      },
      {
        title: "Built with Aback UI",
        href: "/built-with",
        description: "The Aback products whose interfaces shaped the system.",
      },
    ],
  },
];

/** Every guide in reading order, for search and previous and next links. */
export const guides: NavItem[] = guideNav.flatMap((section) => section.items);

export const footerNav: NavSection[] = [
  {
    title: "Get started",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Installation", href: "/docs/installation" },
      { title: "npm package", href: "/docs/package" },
      { title: "CLI", href: "/docs/cli" },
    ],
  },
  {
    title: "Library",
    items: [
      { title: "Components", href: "/docs/components" },
      { title: "Blocks", href: "/docs/blocks" },
      { title: "Theming", href: "/docs/theming" },
      { title: "Design tokens", href: "/docs/tokens" },
      { title: "Accessibility", href: "/docs/accessibility" },
    ],
  },
  {
    title: "For AI agents",
    items: [
      { title: "llms.txt", href: "/llms.txt", file: true },
      { title: "llms-full.txt", href: "/llms-full.txt", file: true },
      { title: "Registry index", href: "/r/index.json", file: true },
    ],
  },
  {
    title: "Aback Group",
    items: [
      { title: "Aback Tools", href: "https://abacktools.com", external: true },
      { title: "Aback Launch", href: "https://abacklaunch.com", external: true },
      { title: "Aback Group", href: "https://aback.group", external: true },
    ],
  },
];
