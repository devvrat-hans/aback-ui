import { lastModified } from "@/lib/last-modified";

import { blocks } from "./blocks";
import { components } from "./component-catalog";
import { posts } from "./posts";
import { tools } from "./tools";

export type RouteKind = "home" | "guide" | "catalog" | "component" | "block" | "post" | "tool" | "page";

/**
 * One indexable page. This list is the single source for page titles,
 * descriptions, the sitemap, the social cards in app/og, and the structured
 * data, so a page cannot be in one of them and missing from another.
 */
export interface SiteRoute {
  path: string;
  /** The <title> before the " | Aback UI" suffix. Aim for 60 characters with the suffix. */
  title: string;
  /** The meta description. Aim for 120 to 160 characters. */
  description: string;
  kind: RouteKind;
  /** The small label above the title on the social card. */
  eyebrow: string;
  /** Repository files the page is built from; their newest commit is the page's lastModified. */
  sources: string[];
  keywords?: string[];
  /** ISO date a post was first published. */
  published?: string;
  /** ISO date of the newest commit to `sources`. Filled in below. */
  lastModified?: string;
  /** A Markdown version of the page for agents, when one exists. */
  markdown?: string;
}

const app = (file: string) => `website/src/app/(site)/${file}`;

type RouteInput = Omit<SiteRoute, "lastModified">;

const staticRoutes: RouteInput[] = [
  {
    path: "/",
    title: "Aback UI: accessible React components and design system",
    description:
      "Open-source React components, blocks, and design tokens for Tailwind CSS v4. Copy the source with the aback-ui CLI or import @aback-ui/ui from npm. MIT licensed.",
    kind: "home",
    eyebrow: "Aback UI",
    sources: [app("page.tsx"), "website/src/components/home-showcase.tsx"],
    keywords: ["React component library", "React components", "Tailwind CSS components", "design system", "accessible components"],
  },
  {
    path: "/docs",
    title: "Introduction to Aback UI",
    description:
      "Aback UI is an open-source React design system: accessible components, blocks, semantic tokens, a CLI that copies source into your project, and an npm package.",
    kind: "guide",
    eyebrow: "Docs",
    sources: [app("docs/page.tsx")],
  },
  {
    path: "/docs/installation",
    title: "Installation: add Aback UI to a React project",
    description:
      "Set up Aback UI in a Next.js, Vite, or other React project with Tailwind CSS v4, then add your first component with npx aback-ui@latest add.",
    kind: "guide",
    eyebrow: "Get started",
    sources: [app("docs/installation/page.tsx")],
    keywords: ["install React components", "Tailwind CSS v4 setup", "aback-ui CLI"],
  },
  {
    path: "/docs/installation/next",
    title: "Install Aback UI in Next.js",
    description:
      "Step-by-step setup for Aback UI in a Next.js App Router project: create the app, run aback-ui init, add components, and wire up dark mode without a flash.",
    kind: "guide",
    eyebrow: "Installation",
    sources: [app("docs/installation/next/page.tsx")],
    keywords: ["Next.js component library", "Next.js Tailwind CSS v4", "Next.js UI components"],
  },
  {
    path: "/docs/installation/vite",
    title: "Install Aback UI in Vite + React",
    description:
      "Set up Aback UI in a Vite React TypeScript project: Tailwind CSS v4 plugin, the @/ path alias in tsconfig and vite.config, then aback-ui init and add.",
    kind: "guide",
    eyebrow: "Installation",
    sources: [app("docs/installation/vite/page.tsx")],
    keywords: ["Vite React components", "Vite Tailwind CSS v4", "Vite path alias"],
  },
  {
    path: "/docs/package",
    title: "Use the @aback-ui/ui npm package",
    description:
      "Install @aback-ui/ui and @aback-ui/tokens from npm, set up Tailwind CSS v4, and import Aback UI components instead of copying their source.",
    kind: "guide",
    eyebrow: "Get started",
    sources: [app("docs/package/page.tsx")],
  },
  {
    path: "/docs/cli",
    title: "aback-ui CLI reference",
    description:
      "Reference for the aback-ui command line: init, add, diff, doctor, list, and view, every option, and the aback-ui.json configuration file.",
    kind: "guide",
    eyebrow: "Get started",
    sources: [app("docs/cli/page.tsx")],
  },
  {
    path: "/docs/components",
    title: "React components",
    description:
      "Every Aback UI React component, grouped by layer, with live previews, copyable source, API references, keyboard tables, and accessibility notes.",
    kind: "catalog",
    eyebrow: "Docs",
    sources: [app("docs/components/page.tsx"), "registry/registry.json"],
    keywords: ["React components", "React UI components", "Tailwind CSS components"],
  },
  {
    path: "/docs/blocks",
    title: "React and Tailwind CSS blocks",
    description:
      "Composed Aback UI sections: site headers, footers, hero, pricing, FAQ, sign-in, settings, dashboards, and tables that install with their component dependencies.",
    kind: "catalog",
    eyebrow: "Docs",
    sources: [app("docs/blocks/page.tsx"), "registry/registry.json"],
    keywords: ["Tailwind CSS blocks", "React page sections", "landing page components"],
  },
  {
    path: "/docs/theming",
    title: "Theming with CSS variables",
    description:
      "How the Aback theme works: semantic CSS variables for light and dark, the brand roles, and how to override them safely in Tailwind CSS v4.",
    kind: "guide",
    eyebrow: "Foundations",
    sources: [app("docs/theming/page.tsx")],
  },
  {
    path: "/docs/dark-mode",
    title: "Dark mode without a flash",
    description:
      "Add light, dark, and system themes to an Aback UI project with ThemeScript, ThemeToggle, and useTheme, without a flash of the wrong theme on load.",
    kind: "guide",
    eyebrow: "Foundations",
    sources: [app("docs/dark-mode/page.tsx")],
  },
  {
    path: "/docs/tokens",
    title: "Design tokens",
    description:
      "The Aback UI colour roles, Aback Blue ramp, typography scale, spacing, control heights, and square geometry, with the CSS variable for each.",
    kind: "guide",
    eyebrow: "Foundations",
    sources: [app("docs/tokens/page.tsx"), "packages/tokens/src/tokens.css"],
  },
  {
    path: "/docs/accessibility",
    title: "Accessibility",
    description:
      "The Aback UI accessibility contract, keyboard behavior for each component, the automated axe checks, and what has not been verified yet.",
    kind: "guide",
    eyebrow: "Foundations",
    sources: [app("docs/accessibility/page.tsx")],
  },
  {
    path: "/docs/registry",
    title: "Registry format",
    description:
      "The item JSON the aback-ui CLI installs, its JSON schema, the supporting theme and utils items, and how to host your own mirror of the registry.",
    kind: "guide",
    eyebrow: "Resources",
    sources: [app("docs/registry/page.tsx")],
  },
  {
    path: "/docs/contributing",
    title: "Contributing",
    description:
      "How the Aback UI repository is organized, how to run it locally, and what a new component or block needs before it can merge.",
    kind: "guide",
    eyebrow: "Resources",
    sources: [app("docs/contributing/page.tsx")],
  },
  {
    path: "/docs/changelog",
    title: "Changelog",
    description: "Every change to Aback UI's components, CLI, tokens, and documentation, release by release, newest first.",
    kind: "guide",
    eyebrow: "Resources",
    sources: [app("docs/changelog/page.tsx"), "CHANGELOG.md"],
  },
  {
    path: "/built-with",
    title: "Built with Aback UI",
    description:
      "The Aback Group products whose interfaces shaped Aback UI, and which components and blocks each of them uses in production.",
    kind: "page",
    eyebrow: "Showcase",
    sources: [app("built-with/page.tsx"), "website/src/data/products.ts"],
  },
  {
    path: "/colors",
    title: "Colors: the Aback UI palette",
    description:
      "Every Aback UI colour as HEX, RGB, HSL, and OKLCH: the Aback Blue ramp and the light and dark semantic roles. Click any swatch to copy the value.",
    kind: "page",
    eyebrow: "Colors",
    sources: [app("colors/page.tsx"), "website/src/components/tools/palette-swatches.tsx", "packages/tokens/src/tokens.css"],
    keywords: ["color palette", "Tailwind CSS colors", "OKLCH colors", "UI color palette"],
  },
  {
    path: "/themes",
    title: "Theme generator for Tailwind CSS v4",
    description:
      "Pick a brand colour and get a complete Aback UI theme: an 11-step ramp and contrast-checked link, focus, and fill roles for light and dark, as CSS.",
    kind: "tool",
    eyebrow: "Themes",
    sources: [app("themes/page.tsx"), "website/src/components/tools/theme-generator.tsx", "website/src/lib/color.ts"],
    keywords: ["Tailwind theme generator", "CSS variables theme", "brand color theme", "Tailwind CSS v4 theme"],
  },
  {
    path: "/blog",
    title: "Blog",
    description:
      "Guides from the Aback UI team on React components, Tailwind CSS v4, design tokens, accessibility, and shipping a design system across products.",
    kind: "catalog",
    eyebrow: "Blog",
    sources: [app("blog/page.tsx"), "website/src/data/posts.ts"],
  },
  {
    path: "/tools",
    title: "Free tools for UI developers",
    description:
      "Free browser-based tools from Aback UI: a WCAG contrast checker, a HEX, RGB, HSL, and OKLCH converter, and a Tailwind CSS colour scale generator.",
    kind: "catalog",
    eyebrow: "Tools",
    sources: [app("tools/page.tsx"), "website/src/data/tools.ts"],
    keywords: ["free developer tools", "color tools", "design tools"],
  },
  {
    path: "/faq",
    title: "Frequently asked questions",
    description:
      "Answers about Aback UI: licensing, React and Tailwind CSS versions, the CLI versus the npm package, frameworks, dark mode, accessibility, and updates.",
    kind: "page",
    eyebrow: "FAQ",
    sources: [app("faq/page.tsx"), "website/src/data/faq.ts"],
  },
  {
    path: "/about",
    title: "About the project",
    description:
      "Why Aback Group built Aback UI, the principles behind it, how it is maintained, and how it relates to the Aback products that use it.",
    kind: "page",
    eyebrow: "About",
    sources: [app("about/page.tsx")],
  },
];

/** Keep a meta description to a sentence boundary under about 160 characters. */
function clampDescription(text: string, max = 160) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const sentence = cut.lastIndexOf(". ");
  if (sentence > 80) return cut.slice(0, sentence + 1);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

const componentRoutes: RouteInput[] = components.map((item) => {
  const source = item.files.find((file) => file.startsWith("components/ui/"));
  return {
    path: `/docs/components/${item.name}`,
    title: `React ${item.title} component`,
    description: clampDescription(
      `${item.description.replace(/\.$/, "")}. An accessible React ${item.title.toLowerCase()} for Tailwind CSS v4 with a live preview, API reference, and keyboard notes.`,
    ),
    kind: "component",
    eyebrow: "Component",
    sources: [
      app("docs/components/[slug]/page.tsx"),
      "website/src/data/component-docs.ts",
      `website/src/examples/${item.name}.tsx`,
      ...(source ? [`packages/ui/src/components/${source.slice("components/ui/".length)}`] : []),
    ],
    keywords: [`React ${item.title.toLowerCase()}`, `${item.title.toLowerCase()} component`, `Tailwind ${item.title.toLowerCase()}`],
  };
});

const blockRoutes: RouteInput[] = blocks.map((block) => ({
  path: `/docs/blocks/${block.name}`,
  title: `${block.title} block for React and Tailwind CSS`,
  description: clampDescription(
    `${block.description.replace(/\.$/, "")}. A copyable React and Tailwind CSS v4 block with a live preview and full source.`,
  ),
  kind: "block",
  eyebrow: "Block",
  sources: [app("docs/blocks/[slug]/page.tsx"), "website/src/data/blocks.ts", `registry/blocks/${block.name}.tsx`],
  keywords: [`${block.title.toLowerCase()} block`, `React ${block.title.toLowerCase()}`, `Tailwind ${block.title.toLowerCase()}`],
}));

const postRoutes: RouteInput[] = posts.map((post) => ({
  path: `/blog/${post.slug}`,
  title: post.title,
  description: post.description,
  kind: "post",
  eyebrow: "Blog",
  sources: [`website/src/content/blog/${post.slug}.tsx`],
  keywords: post.keywords,
  published: post.published,
}));

const toolRoutes: RouteInput[] = tools.map((tool) => ({
  path: `/tools/${tool.slug}`,
  title: tool.seoTitle,
  description: tool.description,
  kind: "tool",
  eyebrow: "Free tool",
  sources: [app(`tools/${tool.slug}/page.tsx`), `website/src/components/tools/${tool.slug}.tsx`, "website/src/lib/color.ts"],
  keywords: tool.keywords,
}));

export const routes: SiteRoute[] = [
  ...staticRoutes,
  ...componentRoutes,
  ...blockRoutes,
  ...postRoutes,
  ...toolRoutes,
].map((route) => ({ ...route, lastModified: lastModified(route.sources) }));

const byPath = new Map(routes.map((route) => [route.path, route]));

export function getRoute(path: string) {
  return byPath.get(path);
}
