/**
 * Blog posts, newest first. Each post's body is a component in
 * src/content/blog/<slug>.tsx; this list holds what the index, the sitemap,
 * the RSS feed, llms.txt, and the structured data need.
 */
export interface Post {
  slug: string;
  /** The h1 and <title>. Keep it under about 60 characters. */
  title: string;
  /** Meta description and index summary, 120 to 160 characters. */
  description: string;
  /** ISO date (YYYY-MM-DD) the post was first published. */
  published: string;
  /** Approximate reading time in minutes, rounded up. */
  minutes: number;
  tags: string[];
  /** Search phrases the post is written to answer. */
  keywords: string[];
}

export const posts: Post[] = [
  {
    slug: "copy-paste-components-vs-npm-package",
    title: "Copy-paste components vs an npm component library",
    description:
      "When to copy component source into your React project and when to install a versioned package: ownership, upgrades, bundle size, and how to use both.",
    published: "2026-10-28",
    minutes: 8,
    tags: ["Architecture", "React"],
    keywords: ["copy paste components", "React component library", "npm component library", "component registry"],
  },
  {
    slug: "tailwind-css-v4-design-tokens",
    title: "Design tokens in Tailwind CSS v4 with @theme",
    description:
      "How to build a semantic token layer in Tailwind CSS v4: @theme, @theme inline, CSS variables for light and dark, and naming roles instead of colours.",
    published: "2026-10-28",
    minutes: 9,
    tags: ["Tailwind CSS", "Design tokens"],
    keywords: ["Tailwind CSS v4 design tokens", "Tailwind @theme", "@theme inline", "CSS variables Tailwind"],
  },
  {
    slug: "dark-mode-without-flash-react",
    title: "Dark mode in React and Next.js without a flash",
    description:
      "Why the wrong theme flashes on load and how to fix it: a blocking script before paint, the class strategy, system preference, and hydration warnings.",
    published: "2026-10-28",
    minutes: 7,
    tags: ["Dark mode", "Next.js"],
    keywords: ["dark mode flash", "Next.js dark mode", "React dark mode", "prefers-color-scheme", "FOUC theme"],
  },
  {
    slug: "accessible-react-dialog-checklist",
    title: "Accessible modal dialogs in React: a checklist",
    description:
      "Everything an accessible React dialog has to do: role and labelling, focus entry, focus trap, Escape, focus return, scroll lock, and how to test each one.",
    published: "2026-10-28",
    minutes: 8,
    tags: ["Accessibility", "React"],
    keywords: ["accessible modal React", "dialog focus trap", "aria-modal", "React dialog accessibility"],
  },
  {
    slug: "wcag-color-contrast-guide",
    title: "WCAG colour contrast for UI developers",
    description:
      "The WCAG 2.2 contrast rules in practice: 4.5:1 and 3:1, large text, non-text contrast for borders and focus rings, and the mistakes that fail audits.",
    published: "2026-10-28",
    minutes: 7,
    tags: ["Accessibility", "Color"],
    keywords: ["WCAG contrast ratio", "color contrast requirements", "4.5:1 contrast", "non-text contrast"],
  },
  {
    slug: "oklch-colors-css-design-systems",
    title: "OKLCH colours in CSS for design systems",
    description:
      "What OKLCH is, why Tailwind CSS v4 uses it, how it compares with HEX and HSL, and how to build an even colour scale from one brand colour.",
    published: "2026-10-28",
    minutes: 8,
    tags: ["Color", "CSS"],
    keywords: ["OKLCH CSS", "OKLCH vs HSL", "Tailwind v4 OKLCH", "color scale generator"],
  },
  {
    slug: "aback-ui-vs-shadcn-ui",
    title: "Aback UI vs shadcn/ui: an honest comparison",
    description:
      "How Aback UI and shadcn/ui differ in design language, install model, package option, theming, and scope, and when each one is the better choice.",
    published: "2026-10-28",
    minutes: 7,
    tags: ["Comparison"],
    keywords: ["shadcn/ui alternative", "Aback UI vs shadcn", "React component library comparison"],
  },
];

export function getPost(slug: string) {
  return posts.find((post) => post.slug === slug);
}
