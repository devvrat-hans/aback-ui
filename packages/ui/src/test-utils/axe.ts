import axe from "axe-core";
import { expect } from "vitest";

/**
 * Runs axe against a rendered container. Color contrast is disabled because
 * jsdom does not compute layout or paint; contrast is verified from the
 * documented token pairs in DESIGN.md.
 */
export async function expectNoA11yViolations(container: HTMLElement) {
  const results = await axe.run(container, {
    rules: {
      "color-contrast": { enabled: false },
      region: { enabled: false },
    },
  });

  expect(results.violations).toEqual([]);
}
