import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import { Switch } from "./switch.js";

function Example() {
  const [enabled, setEnabled] = useState(false);
  return (
    <div className="flex items-center gap-2">
      <Switch id="updates" checked={enabled} onCheckedChange={setEnabled} aria-label="Product updates" />
      <label htmlFor="updates">Product updates</label>
    </div>
  );
}

describe("Switch", () => {
  it("exposes switch semantics and toggles with Space", async () => {
    const user = userEvent.setup();
    render(<Example />);

    const toggle = screen.getByRole("switch", { name: "Product updates" });
    expect(toggle).toHaveAttribute("aria-checked", "false");

    toggle.focus();
    await user.keyboard(" ");
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });
});
