import type { Metadata } from "next";

import { A } from "@/components/prose";
import { ToolPage } from "@/components/tool-page";
import { TailwindColorGenerator } from "@/components/tools/tailwind-color-generator";
import { getTool } from "@/data/tools";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata("/tools/tailwind-color-generator");

const faq = [
  {
    question: "How do I add a custom colour scale in Tailwind CSS v4?",
    answer:
      "Declare it as theme variables in your CSS: @theme { --color-brand-500: oklch(...); } and so on for each shade. Tailwind v4 then generates bg-brand-500, text-brand-500, border-brand-500, and the rest automatically. There is no tailwind.config.js entry to add.",
  },
  {
    question: "Does the generator keep my exact brand colour?",
    answer:
      "Yes. Your colour is placed unchanged at the shade whose lightness is closest to it, marked Base. The other ten shades are generated around it with the same hue.",
  },
  {
    question: "Why does the scale use OKLCH instead of HSL?",
    answer:
      "OKLCH lightness is perceptual, so evenly spaced lightness values look evenly spaced, and changing lightness does not shift the apparent hue the way HSL often does with blues and purples. Tailwind CSS v4 defines its own default palette in OKLCH for the same reason.",
  },
  {
    question: "Can I use the output with Tailwind CSS v3?",
    answer:
      "Yes. Choose the Tailwind v3 tab to get a theme.extend.colors object for tailwind.config.js with HEX values, or the CSS variables tab for plain custom properties.",
  },
];

export default function TailwindColorGeneratorPage() {
  const tool = getTool("tailwind-color-generator")!;
  return (
    <ToolPage
      path="/tools/tailwind-color-generator"
      title="Tailwind CSS colour scale generator"
      lead="Turn one brand colour into an 11-step palette from 50 to 950, generated in OKLCH, with the contrast of every shade shown and exports for Tailwind v4, Tailwind v3, and plain CSS."
      crumbs={[{ label: "Tools", href: "/tools" }, { label: "Tailwind colour generator" }]}
      features={tool.features}
      faq={faq}
      tool={<TailwindColorGenerator />}
    >
      <h2 id="how-to-use">How to use the generator</h2>
      <ol>
        <li>Enter your brand colour. It stays exactly as it is at the shade it is closest to.</li>
        <li>Name the colour. The name becomes the utility prefix, so <code>brand</code> gives you <code>bg-brand-500</code>.</li>
        <li>Check the contrast under each shade. The first ratio is on white, the second on a near-black <code>#0a0a0a</code>.</li>
        <li>Copy the export for your setup and paste it into your global stylesheet or Tailwind config.</li>
      </ol>

      <h2 id="how-it-works">How the scale is built</h2>
      <p>
        Each shade has a target OKLCH lightness, from about 97.5% at 50 down to about 25.5% at 950, close
        to the spacing of Tailwind&apos;s own default palette. Every shade takes your colour&apos;s hue. Chroma
        follows a curve that peaks around 500 and eases off at both ends, so the palest and deepest shades
        do not turn neon or muddy. Where a shade would fall outside what an sRGB screen can display, its
        chroma is reduced at the same lightness and hue until it fits.
      </p>

      <h2 id="choosing-shades">Choosing shades for text and backgrounds</h2>
      <p>
        A practical rule for light themes: shades from 50 to 200 work as tinted backgrounds, 500 and 600
        work for icons and borders that need 3:1, and text usually needs 700 or darker to reach 4.5:1 on
        white. Dark themes invert that. The ratios under each swatch tell you for certain; for a full set
        of roles picked automatically, use the <A href="/themes">theme generator</A>, and to test a
        specific pair use the <A href="/tools/contrast-checker">contrast checker</A>.
      </p>

      <h2 id="v4-vs-v3">Tailwind CSS v4 versus v3 output</h2>
      <p>
        Tailwind v4 is configured in CSS. Colours declared as <code>--color-*</code> variables inside{" "}
        <code>@theme</code> become utilities and are also available as CSS variables at runtime. Tailwind v3
        reads colours from <code>tailwind.config.js</code> instead, which is what the v3 tab writes. Read{" "}
        <A href="/blog/tailwind-css-v4-design-tokens">Design tokens in Tailwind CSS v4</A> for how to layer
        semantic roles on top of a scale like this one.
      </p>
    </ToolPage>
  );
}
