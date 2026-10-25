import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { RadioGroup, RadioGroupItem } from "./radio-group.js";

function Example() {
  return (
    <RadioGroup defaultValue="starter" aria-label="Plan">
      {[
        { value: "starter", label: "Starter" },
        { value: "team", label: "Team" },
        { value: "scale", label: "Scale" },
      ].map(({ value, label }) => (
        <div key={value} className="flex items-center gap-2">
          <RadioGroupItem id={`plan-${value}`} value={value} />
          <label htmlFor={`plan-${value}`} className="text-sm">
            {label}
          </label>
        </div>
      ))}
    </RadioGroup>
  );
}

describe("RadioGroup", () => {
  it("marks the default value as checked", () => {
    render(<Example />);
    expect(screen.getByRole("radio", { name: "Starter" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Team" })).not.toBeChecked();
  });

  it("selects with a click and arrow keys", async () => {
    const user = userEvent.setup();
    render(<Example />);

    const team = screen.getByRole("radio", { name: "Team" });
    await user.click(team);
    expect(team).toBeChecked();

    screen.getByRole("radio", { name: "Starter" }).focus();
    await user.keyboard("{ArrowDown}");
    expect(team).toHaveFocus();
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(<Example />);
    await expectNoA11yViolations(container);
  });
});
