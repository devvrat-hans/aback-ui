import { Code } from "@/components/code";
import { Callout } from "@/components/docs-ui";
import { A, KeyTakeaways } from "@/components/prose";

export const toc = [
  { id: "what-is-oklch", title: "What is OKLCH?" },
  { id: "oklch-vs-hex-hsl", title: "OKLCH vs HEX and HSL" },
  { id: "why-tailwind-uses-it", title: "Why does Tailwind CSS v4 use OKLCH?" },
  { id: "gamut", title: "Wide gamut and out-of-range colours" },
  { id: "building-a-scale", title: "How to build an even scale from one brand colour" },
  { id: "in-practice", title: "Using OKLCH in a design system today" },
];

export const faq = [
  {
    question: "Is OKLCH supported in all browsers?",
    answer:
      "The oklch() function is supported in current versions of all major browsers. Check MDN's compatibility data for the exact versions if you support older browsers, and provide a HEX fallback where needed.",
  },
  {
    question: "Is OKLCH lightness the same as WCAG contrast?",
    answer:
      "No. OKLCH lightness is perceptual and correlates with contrast, but the WCAG contrast ratio uses a different luminance formula. Two colours with the same OKLCH lightness can have slightly different contrast ratios, so always check the actual pairs.",
  },
  {
    question: "Should I convert my whole palette from HEX to OKLCH?",
    answer:
      "Not necessarily. HEX values still work and are the safest choice for sRGB colours. OKLCH helps most when you generate or adjust a scale, or when you want colours outside sRGB on wide-gamut displays.",
  },
  {
    question: "What is the maximum chroma in OKLCH?",
    answer:
      "There is no fixed maximum. How much chroma a colour can have depends on its lightness, its hue, and the target gamut. Very light and very dark colours can hold much less chroma than mid tones.",
  },
];

export default function Post() {
  return (
    <>
      <p>
        OKLCH is a CSS colour format that describes a colour by perceptual lightness (L), chroma (C),
        and hue (H). Unlike HSL, equal lightness values look about equally light across hues, which
        makes it far easier to build even colour scales and predictable light and dark themes.
        Tailwind CSS v4 defines its default palette in OKLCH, and every major browser supports{" "}
        <code>oklch()</code>.
      </p>

      <KeyTakeaways
        items={[
          <>
            <code>oklch(L C H)</code>: lightness from 0 to 1 (or 0% to 100%), chroma from 0 upward,
            hue as an angle in degrees.
          </>,
          "HSL lightness is not perceptual: pure yellow and pure blue are both 50% in HSL but very different in OKLCH.",
          "To build a scale, hold the hue, set target lightness per step, and reduce chroma at the light and dark ends.",
          "OKLCH can describe colours outside sRGB; browsers map them to what the display can show.",
          "OKLCH lightness is not WCAG luminance. Still check contrast.",
        ]}
      />

      <h2 id="what-is-oklch">What is OKLCH?</h2>
      <p>
        OKLCH is the polar form of the Oklab colour space, published by Björn Ottosson in 2020 and
        included in CSS Color Level 4. Oklab was designed so that numeric distances track perceived
        differences more closely than older models. OKLCH expresses the same space with three
        intuitive axes:
      </p>
      <ul>
        <li>
          <strong>L, lightness:</strong> 0 is black, 1 (or 100%) is white.
        </li>
        <li>
          <strong>C, chroma:</strong> how colourful it is. 0 is grey. Practical values for screen
          colours stay below about 0.4.
        </li>
        <li>
          <strong>H, hue:</strong> an angle from 0 to 360 degrees around the colour wheel.
        </li>
      </ul>
      <Code
        language="css"
        code={`:root {
  /* Aback Blue, #009bf9, written in OKLCH */
  --brand: oklch(66.99% 0.1748 246.65);

  /* With alpha */
  --brand-wash: oklch(66.99% 0.1748 246.65 / 0.1);
}`}
      />
      <p>
        The <A href="https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch">MDN
        reference for oklch()</A> covers the syntax in full. To convert an existing colour, paste it
        into the <A href="/tools/color-converter">colour converter</A>, which outputs HEX, RGB, HSL,
        and OKLCH.
      </p>

      <h2 id="oklch-vs-hex-hsl">OKLCH vs HEX and HSL</h2>
      <p>
        HEX and RGB describe how much red, green, and blue light a display emits. They are exact,
        compact, and universally supported, but you cannot read lightness or hue from them, and
        adjusting one channel changes everything at once.
      </p>
      <p>
        HSL looks like a fix: it has a lightness axis. The problem is that HSL lightness is a simple
        function of the RGB channels, not of how the eye perceives brightness. Pure colours at the
        same HSL lightness look very different:
      </p>
      <table>
        <thead>
          <tr>
            <th>Colour</th>
            <th>HSL</th>
            <th>OKLCH lightness</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>#ffff00</code> yellow
            </td>
            <td>hsl(60 100% 50%)</td>
            <td>96.8%</td>
          </tr>
          <tr>
            <td>
              <code>#00ff00</code> green
            </td>
            <td>hsl(120 100% 50%)</td>
            <td>86.6%</td>
          </tr>
          <tr>
            <td>
              <code>#0000ff</code> blue
            </td>
            <td>hsl(240 100% 50%)</td>
            <td>45.2%</td>
          </tr>
        </tbody>
      </table>
      <p>
        All three are 50% in HSL. In OKLCH, yellow is almost white and blue is darker than mid-grey,
        which matches what you see. If you build two colour scales in HSL with the same lightness
        steps, a yellow 500 and a blue 500 will not look like the same weight, and their contrast
        against white will differ widely.
      </p>
      <table>
        <thead>
          <tr>
            <th>Format</th>
            <th>Perceptual lightness</th>
            <th>Easy to adjust by hand</th>
            <th>Beyond sRGB</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>HEX / RGB</td>
            <td>No</td>
            <td>No</td>
            <td>No</td>
          </tr>
          <tr>
            <td>HSL</td>
            <td>No</td>
            <td>Yes</td>
            <td>No</td>
          </tr>
          <tr>
            <td>OKLCH</td>
            <td>Approximately</td>
            <td>Yes</td>
            <td>Yes</td>
          </tr>
        </tbody>
      </table>

      <h2 id="why-tailwind-uses-it">Why does Tailwind CSS v4 use OKLCH?</h2>
      <p>
        Tailwind CSS v4 redefined its default colour palette in OKLCH. The{" "}
        <A href="https://tailwindcss.com/docs/colors">Tailwind colours documentation</A> lists every
        value as an <code>oklch()</code> colour. Two practical reasons stand out:
      </p>
      <ul>
        <li>
          <strong>More vivid colours on capable displays.</strong> OKLCH can express colours in wider
          gamuts such as Display P3, so the palette can use more saturated colours on screens that
          support them.
        </li>
        <li>
          <strong>Consistent steps.</strong> A predictable lightness axis makes it easier to keep a
          500 in one hue visually comparable to a 500 in another.
        </li>
      </ul>
      <p>
        Your own theme does not have to use OKLCH just because Tailwind does. Theme variables accept
        any CSS colour, and Aback UI&apos;s theme defines its roles in HEX. What matters is that the
        values you pick are deliberate and checked.
      </p>

      <h2 id="gamut">Wide gamut and out-of-range colours</h2>
      <p>
        Not every OKLCH value can be displayed. sRGB, the gamut of HEX colours and most monitors, is
        smaller than Display P3, which is smaller than what OKLCH can describe. When a colour falls
        outside the display&apos;s gamut, the browser maps it to the nearest colour it can show.
      </p>
      <p>Three practical rules follow:</p>
      <ol>
        <li>
          <strong>Chroma limits depend on lightness and hue.</strong> A blue can hold far more chroma
          at mid lightness than near white or near black. A scale that keeps the same chroma at every
          step will push its lightest and darkest steps out of gamut.
        </li>
        <li>
          <strong>Do not rely on out-of-gamut colours for meaning.</strong> On an sRGB display, two
          vivid P3 colours can map to nearly the same visible colour.
        </li>
        <li>
          <strong>Check contrast on the colour people actually see.</strong> A contrast checker
          should convert to sRGB first. The <A href="/tools/color-converter">colour converter</A>{" "}
          gamut-maps OKLCH colours that fall outside sRGB.
        </li>
      </ol>

      <h2 id="building-a-scale">How to build an even scale from one brand colour</h2>
      <p>
        A Tailwind-style scale has eleven steps, from 50 to 950. In OKLCH the recipe is
        straightforward:
      </p>
      <ol>
        <li>Convert the brand colour to OKLCH and note its hue and chroma.</li>
        <li>Give each step a target lightness, from near white at 50 to near black at 950.</li>
        <li>Keep the hue fixed.</li>
        <li>
          Scale chroma down toward the ends, where less colourfulness is displayable and pale tints
          look cleaner.
        </li>
        <li>
          Place the original brand colour at the step whose lightness is closest, unchanged, so the
          brand value appears exactly in the scale.
        </li>
        <li>Convert each step back to sRGB, reducing chroma further if it is out of gamut.</li>
      </ol>
      <p>
        The <A href="/tools/tailwind-color-generator">Tailwind colour scale generator</A> on this site
        follows this recipe. Its lightness targets are close to the Tailwind CSS v4 default palette:
      </p>
      <table>
        <thead>
          <tr>
            <th>Step</th>
            <th>50</th>
            <th>100</th>
            <th>200</th>
            <th>300</th>
            <th>400</th>
            <th>500</th>
            <th>600</th>
            <th>700</th>
            <th>800</th>
            <th>900</th>
            <th>950</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>L</td>
            <td>0.975</td>
            <td>0.94</td>
            <td>0.885</td>
            <td>0.81</td>
            <td>0.72</td>
            <td>0.64</td>
            <td>0.555</td>
            <td>0.47</td>
            <td>0.395</td>
            <td>0.33</td>
            <td>0.255</td>
          </tr>
          <tr>
            <td>Chroma share</td>
            <td>12%</td>
            <td>26%</td>
            <td>48%</td>
            <td>72%</td>
            <td>90%</td>
            <td>100%</td>
            <td>96%</td>
            <td>86%</td>
            <td>74%</td>
            <td>62%</td>
            <td>46%</td>
          </tr>
        </tbody>
      </table>
      <p>
        It exports the result as a Tailwind CSS v4 <code>@theme</code> block, a v3 config, or plain
        CSS variables. For Aback Blue, <code>#009bf9</code>, the <code>@theme</code> output is:
      </p>
      <Code
        language="css"
        code={`@theme {
  --color-brand-50: oklch(97.5% 0.0125 246.61);
  --color-brand-100: oklch(94% 0.0304 246.63);
  --color-brand-200: oklch(88.5% 0.0596 246.64);
  --color-brand-300: oklch(81% 0.1013 246.64);
  --color-brand-400: oklch(72% 0.1545 246.65);
  --color-brand-500: oklch(66.99% 0.1748 246.65);
  --color-brand-600: oklch(55.5% 0.1449 246.67);
  --color-brand-700: oklch(47% 0.1227 246.68);
  --color-brand-800: oklch(39.51% 0.1032 246.7);
  --color-brand-900: oklch(33.01% 0.0863 246.74);
  --color-brand-950: oklch(25.51% 0.0668 246.84);
}`}
      />
      <p>
        The hue stays within a fraction of a degree, lightness follows the targets, and the 500 step
        is the input colour unchanged. The 50 step has less chroma than its 12% share would give,
        because the generator reduces chroma where sRGB cannot show it.
      </p>
      <Callout type="note" title="A ramp defined in HEX can drift">
        A scale picked by eye or by HSL steps often drifts in hue. Converting Aback UI&apos;s own
        Aback Blue ramp to OKLCH shows the hue moving from about 232 degrees at 50 to about 247 at
        500. That is not wrong, since the ramp is a design decision, but OKLCH makes the drift
        visible and controllable. The ramp is listed on the <A href="/colors">colors</A> page in
        every format.
      </Callout>

      <h2 id="in-practice">Using OKLCH in a design system today</h2>
      <p>
        You can adopt OKLCH gradually. A few patterns are useful even if your stored tokens stay in
        HEX:
      </p>
      <h3>Mix in OKLCH</h3>
      <p>
        <code>color-mix()</code> takes a colour space argument. Mixing in OKLCH avoids the muddy,
        greyish midpoints that mixing in sRGB can produce:
      </p>
      <Code
        language="css"
        code={`.selected-row {
  background-color: color-mix(in oklch, var(--link) 12%, var(--background));
}`}
      />
      <h3>Derive variants with relative colour syntax</h3>
      <p>
        Relative colour syntax reads the channels of an existing colour so you can adjust one of
        them. Check browser support on MDN before relying on it:
      </p>
      <Code
        language="css"
        code={`.button-brand:hover {
  /* Same hue and chroma, slightly darker */
  background-color: oklch(from var(--brand-fill) calc(l - 0.06) c h);
}`}
      />
      <h3>Keep roles semantic</h3>
      <p>
        OKLCH changes how you choose values, not how components use them. Components should still
        read roles such as <code>--link</code> and <code>--brand-fill</code>, and the role decides
        which step of the scale applies in each theme. Aback UI&apos;s link role, for example, uses
        the 700 step in the light theme and the 400 step in the dark theme, because those are the
        steps that pass text contrast on each background. The pattern is explained in{" "}
        <A href="/blog/tailwind-css-v4-design-tokens">Design tokens in Tailwind CSS v4 with @theme</A>
        , and the thresholds in <A href="/blog/wcag-color-contrast-guide">WCAG colour contrast for
        UI developers</A>.
      </p>
      <p>
        To go from one brand colour to a complete set of light and dark roles, use the{" "}
        <A href="/themes">theme generator</A>, then apply the output as described in the{" "}
        <A href="/docs/theming">theming guide</A>.
      </p>
    </>
  );
}
