import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group.js";

function Example() {
  return (
    <ToggleGroup type="multiple" defaultValue={["bold"]} aria-label="Text formatting">
      <ToggleGroupItem value="bold" aria-label="Bold">
        B
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        I
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        U
      </ToggleGroupItem>
    </ToggleGroup>
  );
}

describe("ToggleGroup", () => {
  it("reflects the default selection", () => {
    render(<Example />);
    expect(screen.getByRole("button", { name: "Bold" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Italic" })).toHaveAttribute("aria-pressed", "false");
  });

  it("toggles items on click", async () => {
    const user = userEvent.setup();
    render(<Example />);

    const italic = screen.getByRole("button", { name: "Italic" });
    await user.click(italic);
    expect(italic).toHaveAttribute("aria-pressed", "true");

    await user.click(italic);
    expect(italic).toHaveAttribute("aria-pressed", "false");
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(<Example />);
    await expectNoA11yViolations(container);
  });
});
