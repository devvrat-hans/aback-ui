import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import { Checkbox } from "./checkbox.js";

function Example() {
  const [checked, setChecked] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id="terms"
        checked={checked}
        onCheckedChange={(value) => setChecked(value === true)}
      />
      <label htmlFor="terms">Accept the terms</label>
    </div>
  );
}

describe("Checkbox", () => {
  it("toggles with the mouse and reports state", async () => {
    const user = userEvent.setup();
    render(<Example />);

    const checkbox = screen.getByRole("checkbox", { name: "Accept the terms" });
    expect(checkbox).toHaveAttribute("aria-checked", "false");

    await user.click(checkbox);
    expect(checkbox).toHaveAttribute("aria-checked", "true");

    await user.click(checkbox);
    expect(checkbox).toHaveAttribute("aria-checked", "false");
  });

  it("toggles from its label", async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.click(screen.getByText("Accept the terms"));
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "true");
  });
});
