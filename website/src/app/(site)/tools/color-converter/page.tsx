import type { Metadata } from "next";

import { A } from "@/components/prose";
import { ToolPage } from "@/components/tool-page";
import { ColorConverter } from "@/components/tools/color-converter";
import { getTool } from "@/data/tools";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/tools/color-converter");

const faq = [
  {
    question: "How do I convert HEX to OKLCH?",
    answer:
      "Paste the HEX value into the converter and copy the OKLCH row. Under the hood the HEX is decoded to sRGB, linearized, converted to OKLab with Björn Ottosson's matrices, and then expressed as lightness, chroma, and hue.",
  },
  {
    question: "Why do some OKLCH colours change when converted to HEX?",
    answer:
      "OKLCH can describe colours that sRGB screens and HEX cannot show. When that happens the converter keeps the lightness and hue and lowers the chroma until the colour fits, and it tells you it did so.",
  },
  {
    question: "Which browsers support oklch() in CSS?",
    answer:
      "All current versions of Chrome, Edge, Firefox, and Safari support oklch() in CSS. If you need to support much older browsers, keep a HEX or rgb() fallback declared before the oklch() value.",
  },
  {
    question: "Is HSL lightness the same as OKLCH lightness?",
    answer:
      "No. HSL lightness is a simple average of the channels and does not match how bright colours look: yellow and blue at 50% HSL lightness look very different. OKLCH lightness is perceptual, so equal values look about equally bright across hues.",
  },
];

export default function ColorConverterPage() {
  const tool = getTool("color-converter")!;
  return (
    <ToolPage
      path="/tools/color-converter"
      title="Colour converter: HEX, RGB, HSL, OKLCH"
      lead="Paste any CSS colour and copy it back as HEX, rgb(), hsl(), or oklch(), with alpha kept and modern CSS syntax ready to use."
      crumbs={[{ label: "Tools", href: "/tools" }, { label: "Colour converter" }]}
      features={tool.features}
      faq={faq}
      tool={<ColorConverter />}
    >
      <h2 id="formats">The four formats, briefly</h2>
      <ul>
        <li>
          <strong>HEX</strong> (<code>#009bf9</code>) is the red, green, and blue channels in base 16. It is
          compact and universal, and an optional fourth pair adds alpha.
        </li>
        <li>
          <strong>RGB</strong> (<code>rgb(0 155 249)</code>) is the same three channels in decimal. Modern
          CSS separates them with spaces and writes alpha after a slash.
        </li>
        <li>
          <strong>HSL</strong> (<code>hsl(203 100% 49%)</code>) describes hue, saturation, and lightness.
          It is easy to reason about, but its lightness does not match what you see.
        </li>
        <li>
          <strong>OKLCH</strong> (<code>oklch(65% 0.18 240)</code>) describes perceptual lightness, chroma,
          and hue. It is the format Tailwind CSS v4 uses for its default palette.
        </li>
      </ul>

      <h2 id="why-oklch">Why design systems are moving to OKLCH</h2>
      <p>
        In OKLCH, changing only the lightness gives you a lighter or darker version of the same colour
        that still looks like the same hue, and two colours with the same lightness look about equally
        bright. That makes it a better space for generating shade scales and for predicting contrast than
        HSL. The trade-off is that OKLCH can describe colours a typical sRGB screen cannot show, so tools
        have to map them back into gamut. <A href="/blog/oklch-colors-css-design-systems">OKLCH colours in CSS
        for design systems</A> covers this in depth.
      </p>

      <h2 id="how-it-converts">How this converter works</h2>
      <p>
        Everything runs in your browser; nothing is sent anywhere. The converter parses HEX in all four
        lengths and the <code>rgb()</code>, <code>hsl()</code>, and <code>oklch()</code> functions in both
        modern space-separated and legacy comma syntax. OKLCH values use the OKLab definition by Björn
        Ottosson, and out-of-gamut colours are reduced in chroma at constant lightness and hue. The values
        are rounded for display: OKLCH to two decimals of lightness and four of chroma, which is far below
        what the eye can distinguish.
      </p>

      <h2 id="next-steps">Next steps</h2>
      <p>
        Turn a converted colour into a full 50 to 950 scale with the{" "}
        <A href="/tools/tailwind-color-generator">Tailwind colour scale generator</A>, check it against its
        background with the <A href="/tools/contrast-checker">contrast checker</A>, or see how Aback UI names
        its colours by role on the <A href="/colors">colours page</A>.
      </p>
    </ToolPage>
  );
}
