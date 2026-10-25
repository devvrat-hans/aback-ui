import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { Toaster, toast } from "./toaster.js";

afterEach(() => {
  toast.dismiss();
});

describe("Toaster", () => {
  it("renders a toast from a plain call", async () => {
    render(<Toaster />);

    act(() => {
      toast("Workspace saved");
    });

    expect(await screen.findByText("Workspace saved")).toBeInTheDocument();
  });

  it("renders a description and an action that runs once", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Toaster />);

    act(() => {
      toast.success("Invite sent", {
        description: "ada@example.com can join the workspace.",
        action: { label: "Undo", onClick },
      });
    });

    expect(await screen.findByText("Invite sent")).toBeInTheDocument();
    expect(screen.getByText("ada@example.com can join the workspace.")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Undo" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("dismisses from the close button", async () => {
    const user = userEvent.setup();
    render(<Toaster />);

    act(() => {
      toast.error("Could not publish");
    });

    await screen.findByText("Could not publish");
    await user.click(screen.getByRole("button", { name: "Close toast" }));

    await waitFor(() => {
      expect(screen.queryByText("Could not publish")).not.toBeInTheDocument();
    });
  });

  it("has no detectable accessibility violations while open", async () => {
    render(<Toaster />);

    act(() => {
      toast.warning("Usage at 90%", { description: "Requests reset on the first." });
    });

    await screen.findByText("Usage at 90%");
    await expectNoA11yViolations(document.body);
  });
});
