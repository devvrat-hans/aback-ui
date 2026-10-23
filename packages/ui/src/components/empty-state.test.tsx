import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { Button } from "./button.js";
import { EmptyState } from "./empty-state.js";

describe("EmptyState", () => {
  it("renders the required title", () => {
    render(<EmptyState title="No builds yet" />);

    expect(screen.getByText("No builds yet")).toBeInTheDocument();
  });

  it("renders the description and action when provided", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <EmptyState
        title="No builds yet"
        description="Run a build to see it here."
        action={<Button onClick={onClick}>Run a build</Button>}
      />,
    );

    expect(
      screen.getByText("Run a build to see it here."),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Run a build" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("omits the description and action slots when they are not provided", () => {
    const { container } = render(<EmptyState title="Nothing here" />);

    expect(container.querySelectorAll("[data-slot='empty-state'] p")).toHaveLength(1);
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(
      <EmptyState
        title="No results"
        description="Try a different search term."
        action={<Button>Clear search</Button>}
      />,
    );

    await expectNoA11yViolations(container);
  });
});
