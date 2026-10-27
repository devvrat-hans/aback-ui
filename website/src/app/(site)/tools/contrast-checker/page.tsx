import type { Metadata } from "next";

import { A } from "@/components/prose";
import { ToolPage } from "@/components/tool-page";
import { ContrastChecker } from "@/components/tools/contrast-checker";
import { getTool } from "@/data/tools";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/tools/contrast-checker");

const faq = [
  {
    question: "What contrast ratio does WCAG require?",
    answer:
      "WCAG 2.2 Level AA requires at least 4.5:1 for normal text and 3:1 for large text (24px, or 18.66px and bold). Level AAA raises those to 7:1 and 4.5:1. Borders, icons, focus indicators, and other graphics that are needed to understand or operate the interface need 3:1 against adjacent colours (success criterion 1.4.11).",
  },
  {
    question: "Is 4.49:1 close enough to pass?",
    answer:
      "No. The thresholds are exact, so 4.49:1 fails 4.5:1. This checker compares the unrounded ratio and rounds the displayed value down, so it never shows a passing number for a failing pair.",
  },
  {
    question: "Does contrast apply to disabled buttons and placeholder text?",
    answer:
      "Disabled controls are exempt from the WCAG contrast requirements. Placeholder text is not exempt: if it conveys information, it needs 4.5:1 like any other text, which is one reason to keep instructions in a visible label or description rather than the placeholder.",
  },
  {
    question: "How does the checker handle transparent colours?",
    answer:
      "A translucent text colour is blended onto the background before the ratio is calculated, which is what the reader actually sees. A translucent background is blended onto white first.",
  },
];

export default function ContrastCheckerPage() {
  const tool = getTool("contrast-checker")!;
  return (
    <ToolPage
      path="/tools/contrast-checker"
      title="Colour contrast checker"
      lead="Check any text and background pair against WCAG 2.2: AA and AAA for normal and large text, plus non-text contrast for borders, icons, and focus rings. Nothing leaves your browser."
      crumbs={[{ label: "Tools", href: "/tools" }, { label: "Contrast checker" }]}
      features={tool.features}
      faq={faq}
      tool={<ContrastChecker />}
    >
      <h2 id="how-to-use">How to use the contrast checker</h2>
      <ol>
        <li>Enter the text colour and the background colour as HEX, rgb(), hsl(), or oklch(), or pick them with the swatches.</li>
        <li>Read the ratio and the five results. Each one says which content it applies to, so you can tell whether a pair is fine for a heading but not for body text.</li>
        <li>If the pair fails, use one of the suggested colours. They keep your hue and chroma and only move the lightness, so the colour still looks like yours.</li>
      </ol>

      <h2 id="what-the-ratio-means">What the contrast ratio measures</h2>
      <p>
        The ratio compares the relative luminance of the lighter colour with the darker one, using the
        formula in WCAG: <code>(L1 + 0.05) / (L2 + 0.05)</code>. It runs from 1:1 (the same colour twice)
        to 21:1 (black on white). Luminance weights green much more heavily than blue, which is why a
        saturated blue can pass on white while a yellow of the same lightness in HSL fails badly.
      </p>
      <p>
        The 4.5:1 threshold for normal text accounts for the contrast loss that comes with moderately
        low vision. Large text is easier to read, so it only needs 3:1. WCAG counts text as large from
        24px, or from 18.66px when it is bold.
      </p>

      <h2 id="non-text-contrast">Non-text contrast is easy to miss</h2>
      <p>
        Success criterion 1.4.11 asks for 3:1 for the parts of a control you need to see to use it: the
        border of a text field, the outline of an unchecked checkbox, an icon-only button, and the focus
        indicator. A light grey input border on white is the most common failure in design systems.
        In Aback UI the focus ring on every interactive control reaches at least 3:1 in both themes; see{" "}
        <A href="/docs/accessibility">the accessibility notes</A> for how each component handles focus and
        keyboard use.
      </p>

      <h2 id="wcag-3">What about APCA and WCAG 3?</h2>
      <p>
        APCA is a newer contrast model being explored for a future WCAG 3. It is still a draft and not a
        conformance requirement, so audits and legal standards today test against the WCAG 2.x ratio this
        tool calculates. For a longer walkthrough of the rules and the mistakes that fail audits, read{" "}
        <A href="/blog/wcag-color-contrast-guide">WCAG colour contrast for UI developers</A>.
      </p>

      <h2 id="build-a-palette">Building a palette that passes</h2>
      <p>
        Checking pairs one at a time works for a fix. For a whole palette, generate the shades first and
        check them together: the <A href="/tools/tailwind-color-generator">Tailwind colour scale generator</A>{" "}
        shows the ratio of every shade on white and black, and the <A href="/themes">theme generator</A> only
        assigns text roles to shades that pass.
      </p>
    </ToolPage>
  );
}
