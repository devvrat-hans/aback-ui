import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { Button } from "./button.js";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet.js";

function Example() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open filters</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Narrow the list by owner and status.</SheetDescription>
        </SheetHeader>
        <p className="text-sm text-muted-foreground">Filters would appear here.</p>
      </SheetContent>
    </Sheet>
  );
}

describe("Sheet", () => {
  it("opens as a dialog with a name and description", async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.click(screen.getByRole("button", { name: "Open filters" }));
    const dialog = await screen.findByRole("dialog");

    expect(dialog).toHaveAccessibleName("Filters");
    expect(dialog).toHaveAccessibleDescription("Narrow the list by owner and status.");
    expect(dialog).toHaveAttribute("data-side", "right");
  });

  it("closes with Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<Example />);

    const trigger = screen.getByRole("button", { name: "Open filters" });
    await user.click(trigger);
    await screen.findByRole("dialog");

    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });

  it("has no detectable accessibility violations while open", async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.click(screen.getByRole("button", { name: "Open filters" }));
    const dialog = await screen.findByRole("dialog");

    await expectNoA11yViolations(dialog);
  });
});
