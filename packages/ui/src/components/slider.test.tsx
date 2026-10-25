import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { Slider } from "./slider.js";

describe("Slider", () => {
  it("exposes its name and value", () => {
    render(<Slider label="Volume" defaultValue={[40]} />);
    const slider = screen.getByRole("slider", { name: "Volume" });

    expect(slider).toHaveAttribute("aria-valuenow", "40");
    expect(slider).toHaveAttribute("aria-valuemin", "0");
    expect(slider).toHaveAttribute("aria-valuemax", "100");
  });

  it("changes value with the arrow keys", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Slider label="Opacity" defaultValue={[50]} onValueChange={onValueChange} />);

    const slider = screen.getByRole("slider", { name: "Opacity" });
    slider.focus();
    await user.keyboard("{ArrowRight}");

    expect(onValueChange).toHaveBeenCalledWith([51]);
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(<Slider label="Budget" defaultValue={[30]} />);
    await expectNoA11yViolations(container);
  });
});
