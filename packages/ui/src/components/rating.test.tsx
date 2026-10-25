import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { Rating } from "./rating.js";

describe("Rating", () => {
  it("exposes a named radio group with one option per star", () => {
    render(<Rating aria-label="Rate this release" />);
    expect(screen.getByRole("radiogroup", { name: "Rate this release" })).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(5);
    expect(screen.getByRole("radio", { name: "1 star" })).not.toBeChecked();
  });

  it("selects with a click and moves with arrow keys", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Rating aria-label="Rating" onValueChange={onValueChange} />);

    await user.click(screen.getByRole("radio", { name: "3 stars" }));
    expect(screen.getByRole("radio", { name: "3 stars" })).toBeChecked();
    expect(onValueChange).toHaveBeenLastCalledWith(3);

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "4 stars" })).toBeChecked();
    expect(onValueChange).toHaveBeenLastCalledWith(4);
  });

  it("clears on a second press when clearable", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Rating aria-label="Rating" defaultValue={2} clearable onValueChange={onValueChange} />);

    await user.click(screen.getByRole("radio", { name: "2 stars" }));
    expect(onValueChange).toHaveBeenLastCalledWith(0);
    expect(screen.getByRole("radio", { name: "2 stars" })).not.toBeChecked();
  });

  it("submits the value with a native form", async () => {
    const user = userEvent.setup();
    render(
      <form data-testid="form">
        <Rating aria-label="Rating" name="score" />
      </form>,
    );
    await user.click(screen.getByRole("radio", { name: "5 stars" }));
    const data = new FormData(screen.getByTestId("form") as HTMLFormElement);
    expect(data.get("score")).toBe("5");
  });

  it("renders a read-only value as an image with a text alternative", () => {
    render(<Rating readOnly value={4.5} />);
    expect(screen.getByRole("img", { name: "Rated 4.5 out of 5" })).toBeInTheDocument();
    expect(screen.queryByRole("radio")).not.toBeInTheDocument();
  });

  it("disables every option", () => {
    render(<Rating aria-label="Rating" disabled />);
    for (const radio of screen.getAllByRole("radio")) expect(radio).toBeDisabled();
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(
      <div>
        <Rating aria-label="Rate the documentation" defaultValue={3} />
        <Rating readOnly value={3.5} />
      </div>,
    );
    await expectNoA11yViolations(container);
  });
});
