import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { Kbd } from "./kbd.js";

describe("Kbd", () => {
  it("renders a real kbd element", () => {
    render(<Kbd>Ctrl</Kbd>);

    const kbd = screen.getByText("Ctrl");
    expect(kbd.tagName).toBe("KBD");
    expect(kbd).toHaveAttribute("data-slot", "kbd");
  });

  it("renders multiple keys side by side", () => {
    render(
      <span>
        <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd>
      </span>,
    );

    expect(screen.getByText("Ctrl")).toBeInTheDocument();
    expect(screen.getByText("K")).toBeInTheDocument();
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(<Kbd>Shift</Kbd>);

    await expectNoA11yViolations(container);
  });
});
