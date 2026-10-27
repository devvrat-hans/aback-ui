/**
 * Questions people ask about Aback UI, with answers that are true of the
 * current release. Answers are plain text because they also go into the
 * FAQPage structured data and llms.txt. `home` marks the ones the home page
 * shows.
 */
export interface FaqItem {
  question: string;
  answer: string;
  /** A page that covers the answer in depth. */
  href?: string;
  home?: boolean;
}

export interface FaqGroup {
  title: string;
  items: FaqItem[];
}

export const faqGroups: FaqGroup[] = [
  {
    title: "General",
    items: [
      {
        question: "What is Aback UI?",
        answer:
          "Aback UI is an open-source React component library and design system from Aback Group. It ships accessible components, composed blocks, and semantic design tokens for Tailwind CSS v4. You can copy each component's source into your project with the aback-ui CLI, or import the same components from the @aback-ui/ui npm package.",
        href: "/docs",
        home: true,
      },
      {
        question: "Is Aback UI free to use in commercial projects?",
        answer:
          "Yes. The code is MIT licensed, so you can use, modify, and ship it in personal and commercial projects without paying or creating an account. The Aback name and logo are trademarks and are not part of that licence.",
        home: true,
      },
      {
        question: "Is Aback UI stable?",
        answer:
          "Aback UI is pre-1.0. Components used in Aback products are marked stable on their pages; the rest are beta, and their APIs may still change before 1.0. Each release lists what changed in the changelog.",
        href: "/docs/changelog",
      },
      {
        question: "What does Aback UI look like?",
        answer:
          "Square corners everywhere, one-pixel hairline borders, neutral ink buttons, and Aback Blue (#009bf9) used as a signal for links, focus, and selection rather than as the default fill. It uses the Geist and Geist Mono typefaces and has a light and a dark theme.",
        href: "/docs/tokens",
      },
    ],
  },
  {
    title: "Installing",
    items: [
      {
        question: "What do I need to use Aback UI?",
        answer:
          "React 19, Tailwind CSS v4, and a @/ path alias in your tsconfig. The CLI needs Node.js 20.9 or later. The theme relies on Tailwind v4's @theme inline, so aback-ui init stops if it finds Tailwind CSS v3.",
        href: "/docs/installation",
        home: true,
      },
      {
        question: "Should I use the CLI or the npm package?",
        answer:
          "Use the CLI (npx aback-ui@latest add button) when you want to own and edit each component's source in your repository. Use the @aback-ui/ui package when you would rather import components and take updates by bumping a version. Both install the same canonical components, and you can mix them in one project.",
        href: "/blog/copy-paste-components-vs-npm-package",
        home: true,
      },
      {
        question: "Which frameworks does Aback UI support?",
        answer:
          "Any React 19 framework that uses Tailwind CSS v4. The installation guides cover Next.js and Vite step by step. The CLI also recognizes Remix and Astro projects when it picks defaults.",
        href: "/docs/installation",
        home: true,
      },
      {
        question: "Does the CLI download code from the internet?",
        answer:
          "No. The component source ships inside the aback-ui npm package, so the files you install always match the CLI version you ran. Your package manager still installs each component's npm dependencies, such as Radix primitives. You can point the CLI at a mirror with --registry.",
        href: "/docs/cli",
      },
      {
        question: "How do I update components I copied with the CLI?",
        answer:
          "Run npx aback-ui@latest diff --all to compare your installed files with the current registry, then re-add the components you want with add. The CLI asks before replacing any file whose contents differ, and --dry-run reports what would change without writing.",
        href: "/docs/cli",
      },
    ],
  },
  {
    title: "Design and theming",
    items: [
      {
        question: "How do I change the brand colour?",
        answer:
          "Override the brand roles (--link, --focus-ring, --brand-fill, and the rest) and the --color-primary-50 to 950 ramp in your own stylesheet after the theme import. The theme generator at abackui.com/themes builds the whole set from one colour and checks each role's contrast for you.",
        href: "/themes",
        home: true,
      },
      {
        question: "Does Aback UI support dark mode?",
        answer:
          "Yes. Every colour is a CSS variable with a light and a dark value, and the dark theme is the dark class on the html element. ThemeScript applies the saved choice before the first paint so there is no flash, ThemeToggle switches between light, dark, and system, and useTheme reads the current theme.",
        href: "/docs/dark-mode",
      },
      {
        question: "Can I use rounded corners?",
        answer:
          "The Aback design is square by intent: the theme sets every Tailwind radius token to zero. Because components install as source and the radius is a token, a project can change those tokens or the classes in its own copies, but the components are designed and reviewed square.",
        href: "/docs/theming",
      },
    ],
  },
  {
    title: "Accessibility",
    items: [
      {
        question: "Are Aback UI components accessible?",
        answer:
          "They are built to be: native elements where they fit, Radix primitives for complex widgets such as dialogs and menus, visible focus rings, and documented keyboard behavior on every component page. Component tests include automated axe checks. Automated checks do not prove full WCAG conformance, so the accessibility page also lists what has not been verified.",
        href: "/docs/accessibility",
        home: true,
      },
      {
        question: "Do the colours meet WCAG contrast requirements?",
        answer:
          "Foreground, muted, link, and status text roles reach at least 4.5:1 on the page and card backgrounds in both themes, and focus rings reach at least 3:1. These pairs are checked by a test in the repository. If you change the palette, check your new values with the contrast checker, or use the theme generator, which picks shades that pass and flags any role that cannot.",
        href: "/tools/contrast-checker",
      },
    ],
  },
];

export const faqItems: FaqItem[] = faqGroups.flatMap((group) => group.items);
export const homeFaq: FaqItem[] = faqItems.filter((item) => item.home);
