import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { Label } from "./label.js";
import { Select } from "./select.js";

function Example(props: { onValueChange?: (value: string) => void; disabled?: boolean }) {
  return (
    <>
      <Label htmlFor="plan-select">Plan</Label>
      <Select
        id="plan-select"
        defaultValue="starter"
        disabled={props.disabled}
        onChange={(event) => props.onValueChange?.(event.target.value)}
      >
        <option value="starter">Starter</option>
        <option value="launch">Launch</option>
        <option value="scale">Scale</option>
      </Select>
    </>
  );
}

describe("Select", () => {
  it("renders each option", () => {
    render(<Example />);

    const select = screen.getByLabelText("Plan");
    expect(select).toHaveValue("starter");
    expect(screen.getByRole("option", { name: "Launch" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Scale" })).toBeInTheDocument();
  });

  it("fires onChange with the new value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Example onValueChange={onValueChange} />);

    await user.selectOptions(screen.getByLabelText("Plan"), "scale");

    expect(onValueChange).toHaveBeenCalledWith("scale");
    expect(screen.getByLabelText("Plan")).toHaveValue("scale");
  });

  it("does not change while disabled", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Example onValueChange={onValueChange} disabled />);

    await user.selectOptions(screen.getByLabelText("Plan"), "scale");

    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Plan")).toHaveValue("starter");
  });

  it("hides its chevron from assistive technology", () => {
    const { container } = render(<Example />);

    const hiddenIcons = container.querySelectorAll("svg[aria-hidden='true']");
    expect(hiddenIcons.length).toBeGreaterThan(0);
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(<Example />);

    await expectNoA11yViolations(container);
  });
});
