import type { Metadata } from "next";

import { A } from "@/components/prose";
import { ToolPage } from "@/components/tool-page";
import { ThemeGenerator } from "@/components/tools/theme-generator";
import { readPalette } from "@/lib/palette";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/themes");

const features = [
  "Generates an 11-step brand ramp from one colour",
  "Assigns link, focus, icon, chip, wash, and fill roles for light and dark",
  "Checks every text and focus role against WCAG 2.2",
  "Live preview with real Aback UI components",
  "Exports CSS for Tailwind CSS v4",
];

const faq = [
  {
    question: "Where do I paste the generated CSS?",
    answer:
      "In your global stylesheet, after the line that imports the Aback theme (styles/aback.css from aback-ui init, or @aback-ui/tokens/tokens.css for the npm package). Later declarations win, so your roles and ramp replace the Aback Blue defaults.",
  },
  {
    question: "Why are buttons not filled with my brand colour?",
    answer:
      "In Aback UI the default action is neutral ink and the brand colour is a signal: links, focus, selection, and the brand button variant. That keeps the brand colour meaningful. Use variant=\"brand\" on Button where you want a filled brand action.",
  },
  {
    question: "What if a role fails its contrast check?",
    answer:
      "The generator picks the best shade it can, but some hues, such as bright yellows, cannot reach 4.5:1 on white at any shade that still looks like the hue. If a row fails, choose a deeper brand colour or keep the brand colour for decoration and use ink for text.",
  },
  {
    question: "Does this work without Aback UI?",
    answer:
      "The ramp works in any Tailwind CSS v4 project as --color-primary-* theme variables. The role names (--link, --focus-ring, --brand-fill, and the rest) are the ones Aback UI components read, so they only take effect with Aback UI or a theme that uses the same names.",
  },
];

export default function ThemesPage() {
  const { light, dark } = readPalette();
  return (
    <ToolPage
      path="/themes"
      title="Theme generator"
      lead="Choose a brand colour and get a complete Aback UI theme: an 11-step ramp and contrast-checked link, focus, and fill roles for light and dark, previewed on real components and ready to paste as CSS."
      crumbs={[{ label: "Themes" }]}
      features={features}
      faq={faq}
      tool={<ThemeGenerator light={light} dark={dark} />}
    >
      <h2 id="how-it-works">How the theme is generated</h2>
      <p>
        The generator builds a 50 to 950 ramp from your colour in OKLCH, the same way the{" "}
        <A href="/tools/tailwind-color-generator">Tailwind colour scale generator</A> does. It then fills the
        brand roles Aback UI components read. For each text role it walks the ramp from the middle outward
        and takes the first shade that reaches 4.5:1 on the theme&apos;s background, white in light and{" "}
        <code>#0a0a0a</code> in dark. Focus rings and icons need 3:1. The filled brand button checks its
        label colour against the fill instead.
      </p>

      <h2 id="roles">What each role controls</h2>
      <ul>
        <li><strong>--link</strong> and <strong>--link-hover</strong>: inline links and link buttons.</li>
        <li><strong>--focus-ring</strong>: the keyboard focus outline on every interactive component.</li>
        <li><strong>--brand-icon</strong>: icons that carry the brand, such as feature icons.</li>
        <li><strong>--brand-chip</strong> and <strong>--brand-wash</strong>: tinted backgrounds for badges, selected rows, and callouts.</li>
        <li><strong>--brand-fill</strong> and <strong>--on-brand-fill</strong>: the brand button and its label.</li>
        <li><strong>--info</strong> and <strong>--info-soft</strong>: informational alerts and badges.</li>
      </ul>
      <p>
        Neutral roles such as background, foreground, border, and the ink primary button are not changed,
        and neither are the success, warning, and danger colours. <A href="/docs/theming">Theming</A>{" "}
        explains every role and the rules that keep overrides working.
      </p>

      <h2 id="after">After you paste it</h2>
      <p>
        Check the theme in both modes on your real pages, not only in this preview: long text, small
        text, and disabled states are where problems show. The <A href="/tools/contrast-checker">contrast
        checker</A> is there for any pair you add yourself, and <A href="/docs/dark-mode">dark mode</A>{" "}
        covers switching themes without a flash on load.
      </p>
    </ToolPage>
  );
}
