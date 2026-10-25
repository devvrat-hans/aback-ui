import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group.js";

function PriceField() {
  return (
    <div>
      <label htmlFor="price">Monthly price</label>
      <InputGroup>
        <InputGroupAddon>$</InputGroupAddon>
        <InputGroupInput id="price" inputMode="decimal" aria-describedby="price-unit" />
        <InputGroupAddon id="price-unit" align="end">
          per month
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

describe("InputGroup", () => {
  it("renders the control with its label and described unit", () => {
    render(<PriceField />);
    const input = screen.getByRole("textbox", { name: "Monthly price" });
    expect(input).toHaveAccessibleDescription("per month");
  });

  it("focuses the control when a text addon is pressed", () => {
    render(<PriceField />);
    fireEvent.mouseDown(screen.getByText("$"));
    expect(screen.getByRole("textbox", { name: "Monthly price" })).toHaveFocus();
  });

  it("leaves interactive addon content alone", async () => {
    const user = userEvent.setup();
    let cleared = false;
    render(
      <InputGroup>
        <InputGroupInput aria-label="Search" defaultValue="tokens" />
        <InputGroupAddon align="end" variant="inline">
          <button type="button" onClick={() => (cleared = true)}>
            Clear
          </button>
        </InputGroupAddon>
      </InputGroup>,
    );
    await user.click(screen.getByRole("button", { name: "Clear" }));
    expect(cleared).toBe(true);
    expect(screen.getByRole("button", { name: "Clear" })).toHaveFocus();
  });

  it("places an end addon after the control", () => {
    const { container } = render(<PriceField />);
    const slots = [...container.querySelectorAll("[data-slot]")].map((node) =>
      node.getAttribute("data-slot"),
    );
    expect(slots).toEqual([
      "input-group",
      "input-group-addon",
      "input-group-control",
      "input-group-addon",
    ]);
    expect(container.querySelector("[data-align='end']")).toHaveClass("order-last");
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(<PriceField />);
    await expectNoA11yViolations(container);
  });
});
