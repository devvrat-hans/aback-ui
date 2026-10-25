import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { SkipLink } from "./skip-link.js";

describe("SkipLink", () => {
  it("is the first tab stop and points at the main content", async () => {
    const user = userEvent.setup();
    render(
      <>
        <SkipLink />
        <header>
          <a href="/docs">Docs</a>
        </header>
        <main id="main-content" tabIndex={-1}>
          Content
        </main>
      </>,
    );

    await user.tab();
    const link = screen.getByRole("link", { name: "Skip to content" });
    expect(link).toHaveFocus();
    expect(link).toHaveAttribute("href", "#main-content");
    expect(link).toHaveClass("sr-only", "focus:not-sr-only");
  });

  it("accepts a custom target and label", () => {
    render(<SkipLink href="#results">Skip to results</SkipLink>);
    expect(screen.getByRole("link", { name: "Skip to results" })).toHaveAttribute("href", "#results");
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(<SkipLink />);
    await expectNoA11yViolations(container);
  });
});
