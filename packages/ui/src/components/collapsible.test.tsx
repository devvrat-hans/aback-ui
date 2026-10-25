import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./collapsible.js";

function Example() {
  return (
    <Collapsible>
      <CollapsibleTrigger>Advanced settings</CollapsibleTrigger>
      <CollapsibleContent>
        <p>Retries use exponential backoff.</p>
      </CollapsibleContent>
    </Collapsible>
  );
}

describe("Collapsible", () => {
  it("toggles the content from the trigger", async () => {
    const user = userEvent.setup();
    render(<Example />);

    const trigger = screen.getByRole("button", { name: "Advanced settings" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Retries use exponential backoff.")).toBeVisible();
  });

  it("has no detectable accessibility violations while open", async () => {
    const user = userEvent.setup();
    const { container } = render(<Example />);
    await user.click(screen.getByRole("button", { name: "Advanced settings" }));
    await expectNoA11yViolations(container);
  });
});
