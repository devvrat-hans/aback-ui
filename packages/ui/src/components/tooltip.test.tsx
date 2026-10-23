import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Button } from "./button.js";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip.js";

function Example() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon" aria-label="Copy link">
          <svg aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Copy a shareable link</TooltipContent>
    </Tooltip>
  );
}

describe("Tooltip", () => {
  it("does not render content until the trigger is revealed", () => {
    render(<Example />);
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("reveals on keyboard focus and hides on blur", async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.tab();
    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toHaveTextContent("Copy a shareable link");

    await user.tab();
    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
    });
  });
});
