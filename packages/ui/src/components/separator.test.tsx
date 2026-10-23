import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { Separator } from "./separator.js";

describe("Separator", () => {
  it("renders horizontally by default and stays decorative", () => {
    const { container } = render(<Separator />);

    const separator = container.querySelector("[data-slot='separator']");
    expect(separator).toHaveAttribute("data-orientation", "horizontal");
    expect(separator).toHaveClass("data-[orientation=horizontal]:h-px");
  });

  it("renders vertically when asked", () => {
    const { container } = render(<Separator orientation="vertical" />);

    expect(container.querySelector("[data-slot='separator']")).toHaveAttribute(
      "data-orientation",
      "vertical",
    );
  });

  it("is hidden from assistive technology while decorative", () => {
    render(<Separator />);

    expect(screen.queryByRole("separator")).not.toBeInTheDocument();
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(
      <div>
        <p>Above</p>
        <Separator />
        <p>Below</p>
      </div>,
    );

    await expectNoA11yViolations(container);
  });
});
