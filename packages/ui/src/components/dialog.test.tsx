import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { Button } from "./button.js";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog.js";

function Example() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Edit profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>Update the name shown on your account.</DialogDescription>
        </DialogHeader>
        <label className="flex flex-col gap-1.5 text-sm">
          Display name
          <input className="border p-2" defaultValue="Aback" />
        </label>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

describe("Dialog", () => {
  it("opens from the trigger with an accessible name and description", async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.click(screen.getByRole("button", { name: "Edit profile" }));

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAccessibleName("Edit profile");
    expect(dialog).toHaveAccessibleDescription("Update the name shown on your account.");
  });

  it("closes with Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<Example />);

    const trigger = screen.getByRole("button", { name: "Edit profile" });
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

    await user.click(screen.getByRole("button", { name: "Edit profile" }));
    const dialog = await screen.findByRole("dialog");

    await expectNoA11yViolations(dialog);
  });
});
