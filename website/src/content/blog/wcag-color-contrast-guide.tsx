import { Code } from "@/components/code";
import { Callout } from "@/components/docs-ui";
import { A, KeyTakeaways } from "@/components/prose";

export const toc = [
  { id: "the-numbers", title: "What contrast ratios does WCAG 2.2 require?" },
  { id: "how-the-ratio-works", title: "How is the contrast ratio calculated?" },
  { id: "large-text", title: "What counts as large text?" },
  { id: "non-text-contrast", title: "Non-text contrast: borders, icons, and focus rings" },
  { id: "exemptions", title: "What is exempt?" },
  { id: "common-failures", title: "Mistakes that fail audits" },
  { id: "checking-a-palette", title: "Checking a design system palette" },
];

export const faq = [
  {
    question: "What contrast ratio does WCAG 2.2 AA require for text?",
    answer:
      "At least 4.5:1 for normal text and 3:1 for large text, under success criterion 1.4.3 Contrast (Minimum). Level AAA, criterion 1.4.6, raises these to 7:1 and 4.5:1.",
  },
  {
    question: "Can I round 4.47:1 up to 4.5:1?",
    answer:
      "No. The thresholds are minimums, and a ratio just below 4.5:1 fails. Report ratios with enough precision to see which side of the threshold they fall on.",
  },
  {
    question: "Do disabled buttons need to meet contrast requirements?",
    answer:
      "No. WCAG exempts text and components that are part of an inactive user interface component. They should still be recognisable as disabled, and that state should not rely on colour alone.",
  },
  {
    question: "Is APCA required for WCAG compliance?",
    answer:
      "No. WCAG 2.2 measures contrast with the contrast ratio formula. APCA is an alternative method that has been explored for a future WCAG version, which is not a published standard.",
  },
];

export default function Post() {
  return (
    <>
      <p>
        WCAG 2.2 Level AA requires a contrast ratio of at least 4.5:1 for normal text, 3:1 for large
        text, and 3:1 for the visual parts of interface components and meaningful graphics, such as
        input borders, icons, and focus indicators. Level AAA raises text to 7:1 and 4.5:1. The
        ratios are minimums with no rounding, and they apply in every theme you ship.
      </p>

      <KeyTakeaways
        items={[
          "Normal text: 4.5:1 (AA), 7:1 (AAA). Large text: 3:1 (AA), 4.5:1 (AAA).",
          "Large text means at least 24px, or at least about 18.66px when bold.",
          "Non-text contrast (SC 1.4.11): 3:1 for component boundaries, icons, states, and focus indicators that carry meaning.",
          "4.48:1 fails. Never round up.",
          "Check dark mode, hover, and tinted surfaces separately; a colour that passes on white can fail elsewhere.",
        ]}
      />

      <h2 id="the-numbers">What contrast ratios does WCAG 2.2 require?</h2>
      <table>
        <thead>
          <tr>
            <th>Content</th>
            <th>Success criterion</th>
            <th>Level</th>
            <th>Minimum ratio</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Normal text and images of text</td>
            <td>1.4.3 Contrast (Minimum)</td>
            <td>AA</td>
            <td>4.5:1</td>
          </tr>
          <tr>
            <td>Large text</td>
            <td>1.4.3 Contrast (Minimum)</td>
            <td>AA</td>
            <td>3:1</td>
          </tr>
          <tr>
            <td>Normal text</td>
            <td>1.4.6 Contrast (Enhanced)</td>
            <td>AAA</td>
            <td>7:1</td>
          </tr>
          <tr>
            <td>Large text</td>
            <td>1.4.6 Contrast (Enhanced)</td>
            <td>AAA</td>
            <td>4.5:1</td>
          </tr>
          <tr>
            <td>UI components and graphical objects</td>
            <td>1.4.11 Non-text Contrast</td>
            <td>AA</td>
            <td>3:1</td>
          </tr>
        </tbody>
      </table>
      <p>
        Most product teams and most accessibility requirements target Level AA. The criteria and
        their exceptions are defined in the{" "}
        <A href="https://www.w3.org/TR/WCAG22/">WCAG 2.2 specification</A>, and the W3C&apos;s{" "}
        <A href="https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html">
          Understanding 1.4.3
        </A>{" "}
        page explains the intent behind them.
      </p>

      <h2 id="how-the-ratio-works">How is the contrast ratio calculated?</h2>
      <p>
        The ratio compares the relative luminance of the lighter colour (L1) with the darker colour
        (L2):
      </p>
      <Code language="ts" code={`contrast = (L1 + 0.05) / (L2 + 0.05)`} />
      <p>
        Relative luminance is computed from linearised sRGB channels, weighted by how sensitive the
        eye is to each: green counts most and blue least. The result ranges from 1:1 (identical
        colours) to 21:1 (black on white).
      </p>
      <p>Some consequences worth knowing:</p>
      <ul>
        <li>
          <strong>Hue barely matters; luminance does.</strong> A saturated blue and a grey can have
          the same ratio against white.
        </li>
        <li>
          <strong>Brand colours are often mid-luminance.</strong> Aback Blue, <code>#009bf9</code>,
          is 2.98:1 on white. It cannot carry body text in the light theme, so Aback UI uses the
          darker <code>#005d95</code> for links, which is 7.00:1. In the dark theme, links use{" "}
          <code>#33b7ff</code>, which is 8.82:1 on the <code>#0a0a0a</code> background.
        </li>
        <li>
          <strong>Transparency must be flattened first.</strong> A colour with alpha has no fixed
          contrast until you composite it over the actual background.
        </li>
      </ul>
      <p>
        You do not need to compute this by hand. The{" "}
        <A href="/tools/contrast-checker">contrast checker</A> accepts HEX, RGB, HSL, and OKLCH,
        handles transparency, and reports AA and AAA results for text and non-text contrast.
      </p>

      <h2 id="large-text">What counts as large text?</h2>
      <p>
        WCAG defines large text in points: at least 18pt, or at least 14pt when bold. In CSS pixels
        that is 24px for regular weight and about 18.66px for bold. A few clarifications:
      </p>
      <ul>
        <li>
          A 16px or 18px semibold label is not large text, even if it looks prominent. It needs
          4.5:1.
        </li>
        <li>
          &quot;Bold&quot; means a heavy weight, typically 700. A 500 or 600 weight is safer treated
          as regular.
        </li>
        <li>
          Thin, decorative, or very condensed fonts can be harder to read than their size suggests.
          The ratio is a minimum, not a guarantee of legibility.
        </li>
      </ul>

      <h2 id="non-text-contrast">Non-text contrast: borders, icons, and focus rings</h2>
      <p>
        Success criterion 1.4.11 asks for 3:1 against adjacent colours for visual information that
        is needed to identify a component or its state, and for parts of graphics needed to
        understand them. In practice:
      </p>
      <table>
        <thead>
          <tr>
            <th>Element</th>
            <th>Needs 3:1?</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>A text input whose border is the only thing showing where it is</td>
            <td>Yes, the border</td>
          </tr>
          <tr>
            <td>A button with a filled background and a text label</td>
            <td>The text needs 4.5:1; the fill boundary is not required if the label identifies it</td>
          </tr>
          <tr>
            <td>Checkbox, radio, and switch outlines and their checked states</td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>Icon-only buttons</td>
            <td>Yes, the icon</td>
          </tr>
          <tr>
            <td>Focus indicators</td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>Chart lines and segments that carry data</td>
            <td>Yes, or provide the data another way</td>
          </tr>
          <tr>
            <td>Decorative dividers and card borders</td>
            <td>No, if nothing depends on them</td>
          </tr>
        </tbody>
      </table>
      <p>
        Focus indicators deserve extra care. A focus ring has to be visible against whatever it sits
        on, in every theme. Aback UI&apos;s light-theme focus ring, <code>#007cc7</code>, is 4.46:1
        on white: comfortably above 3:1 for a ring, but just below 4.5:1, which is why the same blue
        is not used for body-size text. WCAG 2.2 also adds 2.4.11 Focus Not Obscured (Minimum) at
        Level AA, which requires that a focused element is not entirely hidden by sticky headers or
        other author-created content, and 2.4.13 Focus Appearance at Level AAA, which sets a minimum
        size and contrast change for the indicator.
      </p>

      <h2 id="exemptions">What is exempt?</h2>
      <ul>
        <li>
          <strong>Inactive components.</strong> Disabled controls and their text are exempt. Make the
          disabled state recognisable by more than colour, for example with reduced emphasis plus the
          native <code>disabled</code> attribute.
        </li>
        <li>
          <strong>Incidental text.</strong> Text that is pure decoration, not visible, or part of a
          picture with significant other content.
        </li>
        <li>
          <strong>Logotypes.</strong> Text that is part of a logo or brand name has no contrast
          requirement.
        </li>
      </ul>
      <p>
        Placeholder text is not exempt. If it is visible and conveys information, it is text and
        needs 4.5:1, which is one more reason not to use a placeholder as a label.
      </p>

      <h2 id="common-failures">Mistakes that fail audits</h2>
      <h3>Rounding up</h3>
      <p>
        <code>#777777</code> on white is 4.48:1 and fails. <code>#767676</code> is 4.54:1 and passes.
        The thresholds are exact; a tool that shows &quot;4.5:1&quot; for both is hiding the answer.
      </p>
      <h3>Opacity on text</h3>
      <p>
        Fading text with opacity lowers its contrast in a way that is easy to miss in a design
        file. Near-black <code>#0a0a0a</code> at 50% opacity on white composites to about{" "}
        <code>#858585</code>, which is 3.69:1 and fails for normal text. Use a dedicated muted text
        colour that has been checked, such as Aback UI&apos;s <code>text-muted-foreground</code>,
        rather than a transparency utility.
      </p>
      <h3>Checking only against white</h3>
      <p>
        Muted text is usually checked against the page background and then placed on a tinted
        surface. <code>#737373</code> is 4.74:1 on <code>#ffffff</code> but 4.35:1 on{" "}
        <code>#f5f5f5</code>. Check secondary text against every surface it appears on: cards,
        table stripes, sidebars, selected rows, and hover states.
      </p>
      <h3>Forgetting dark mode</h3>
      <p>
        Every pair needs checking in each theme. Dark themes tend to fail on muted text, on links
        that reuse the light theme&apos;s brand shade, and on focus rings. Pick dark values
        separately rather than inverting the light ones.
      </p>
      <h3>Colour as the only signal</h3>
      <p>
        Passing contrast is not enough when colour carries meaning. A red border alone does not
        communicate an error to someone who cannot distinguish red; add an icon or message. That is
        a separate criterion, 1.4.1 Use of Color.
      </p>
      <h3>Text over images and gradients</h3>
      <p>
        Contrast must hold at the worst point under the text. Add a solid or scrimmed background
        behind the text rather than hoping the image cooperates.
      </p>

      <h2 id="checking-a-palette">Checking a design system palette</h2>
      <p>
        In a design system, check pairs of roles once instead of checking every screen. List each
        foreground role with each background role it is allowed on, in both themes, and record the
        ratios:
      </p>
      <table>
        <thead>
          <tr>
            <th>Pair (light theme)</th>
            <th>Ratio</th>
            <th>Normal text AA</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>#0a0a0a</code> on <code>#ffffff</code>
            </td>
            <td>19.80:1</td>
            <td>Pass</td>
          </tr>
          <tr>
            <td>
              <code>#737373</code> on <code>#ffffff</code>
            </td>
            <td>4.74:1</td>
            <td>Pass</td>
          </tr>
          <tr>
            <td>
              <code>#005d95</code> on <code>#ffffff</code>
            </td>
            <td>7.00:1</td>
            <td>Pass</td>
          </tr>
          <tr>
            <td>
              <code>#009bf9</code> on <code>#ffffff</code>
            </td>
            <td>2.98:1</td>
            <td>Fail</td>
          </tr>
        </tbody>
      </table>
      <p>
        These are values from Aback UI&apos;s <A href="/docs/tokens">design tokens</A>; the full
        palette, with each colour in HEX, RGB, HSL, and OKLCH, is on the <A href="/colors">colors</A>{" "}
        page. When you change a brand colour, the <A href="/themes">theme generator</A> derives link,
        focus, and fill roles from it and checks their contrast for light and dark together, and the{" "}
        <A href="/docs/theming">theming guide</A> shows where to apply the overrides.
      </p>
      <Callout type="warning" title="Automated checks are a start, not a verdict">
        Contrast is one of the few accessibility properties a tool can measure precisely, but tools
        only see the pairs you give them. Hover states, focus states, and text over images still need
        a person to check them.
      </Callout>
      <p>
        If you are building the scale itself, <A href="/blog/oklch-colors-css-design-systems">OKLCH
        colours in CSS</A> explains why perceptual lightness makes contrast more predictable from one
        step to the next, and the <A href="/tools/tailwind-color-generator">Tailwind colour scale
        generator</A> shows the contrast of every shade on white and black.
      </p>
    </>
  );
}
