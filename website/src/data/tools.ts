/** The free browser tools under /tools. Each has a page and a client component of the same slug. */
export interface Tool {
  slug: string;
  /** Short name for cards and navigation. */
  title: string;
  /** The <title>, written for the search it answers. */
  seoTitle: string;
  description: string;
  keywords: string[];
  /** What the tool does, for the WebApplication featureList. */
  features: string[];
}

export const tools: Tool[] = [
  {
    slug: "contrast-checker",
    title: "Contrast checker",
    seoTitle: "WCAG colour contrast checker",
    description:
      "Check the contrast ratio of any two colours against WCAG 2.2 AA and AAA for normal text, large text, and UI components. Free, private, in your browser.",
    keywords: ["contrast checker", "WCAG contrast checker", "color contrast ratio", "accessibility color checker"],
    features: [
      "WCAG 2.2 contrast ratio for any two colours",
      "AA and AAA results for normal and large text",
      "Non-text contrast (SC 1.4.11) for borders, icons, and focus rings",
      "Accepts HEX, RGB, HSL, and OKLCH, including transparency",
      "Suggests the nearest passing colour",
    ],
  },
  {
    slug: "color-converter",
    title: "Colour converter",
    seoTitle: "HEX to OKLCH, RGB, and HSL colour converter",
    description:
      "Convert any colour between HEX, RGB, HSL, and OKLCH instantly, with alpha support and CSS-ready output you can copy. Free and runs in your browser.",
    keywords: ["hex to oklch", "oklch converter", "hex to rgb", "hex to hsl", "color converter"],
    features: [
      "Converts between HEX, RGB, HSL, and OKLCH",
      "Keeps alpha transparency",
      "Modern CSS colour syntax ready to paste",
      "Gamut-maps OKLCH colours outside sRGB",
    ],
  },
  {
    slug: "tailwind-color-generator",
    title: "Tailwind colour scale generator",
    seoTitle: "Tailwind CSS colour scale generator (50–950)",
    description:
      "Turn one brand colour into an 11-step Tailwind CSS palette from 50 to 950, built in OKLCH, and export it for Tailwind v4 @theme, v3 config, or CSS.",
    keywords: ["tailwind color generator", "tailwind palette generator", "tailwind color scale", "tailwind v4 colors"],
    features: [
      "Generates 50 to 950 shades from one colour",
      "Even lightness steps in OKLCH",
      "Exports Tailwind CSS v4 @theme, v3 config, or plain CSS variables",
      "Shows the WCAG contrast of every shade on white and black",
    ],
  },
];

export function getTool(slug: string) {
  return tools.find((tool) => tool.slug === slug);
}
