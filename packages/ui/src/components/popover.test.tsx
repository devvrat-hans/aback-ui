import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { Button } from "./button.js";
import { Popover, PopoverContent, PopoverTrigger } from "./popover.js";

function Example() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Filters</Button>
      </PopoverTrigger>
      <PopoverContent aria-label="Filters">
        <p className="text-sm">Filter results by owner or status.</p>
      </PopoverContent>
    </Popover>
  );
}

describe("Popover", () => {
  it("opens from the trigger", async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.click(screen.getByRole("button", { name: "Filters" }));
    expect(await screen.findByText("Filter results by owner or status.")).toBeInTheDocument();
  });

  it("closes with Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<Example />);

    const trigger = screen.getByRole("button", { name: "Filters" });
    await user.click(trigger);
    await screen.findByText("Filter results by owner or status.");

    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByText("Filter results by owner or status.")).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });

  it("has no detectable accessibility violations while open", async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.click(screen.getByRole("button", { name: "Filters" }));
    const panel = await screen.findByRole("dialog", { name: "Filters" });

    await expectNoA11yViolations(panel);
  });
});
