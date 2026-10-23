import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { Button } from "./button.js";

describe("Button", () => {
  it("renders a real button with the ink action by default", () => {
    render(<Button>Save changes</Button>);

    const button = screen.getByRole("button", { name: "Save changes" });
    expect(button).toHaveAttribute("data-variant", "default");
    expect(button).toHaveAttribute("data-size", "default");
    expect(button).toHaveClass("bg-primary");
  });

  it("supports brand, outline, ghost, destructive, and link variants", () => {
    render(
      <>
        <Button variant="brand">Brand</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Delete</Button>
        <Button variant="link">Link</Button>
      </>,
    );

    expect(screen.getByRole("button", { name: "Brand" })).toHaveClass("bg-brand-fill");
    expect(screen.getByRole("button", { name: "Outline" })).toHaveClass("border-input");
    expect(screen.getByRole("button", { name: "Ghost" })).toHaveClass("hover:bg-muted");
    expect(screen.getByRole("button", { name: "Delete" })).toHaveClass("bg-destructive");
    expect(screen.getByRole("button", { name: "Link" })).toHaveClass("text-link");
  });

  it("renders as its child when asChild is set", () => {
    render(
      <Button asChild>
        <a href="/docs">Read the docs</a>
      </Button>,
    );

    const link = screen.getByRole("link", { name: "Read the docs" });
    expect(link).toHaveAttribute("href", "/docs");
    expect(link).toHaveAttribute("data-slot", "button");
  });

  it("does not fire while disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button disabled onClick={onClick}>
        Disabled
      </Button>,
    );

    await user.click(screen.getByRole("button", { name: "Disabled" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(
      <div>
        <Button>Primary action</Button>
        <Button variant="outline" size="icon" aria-label="Open settings">
          <svg aria-hidden="true" />
        </Button>
      </div>,
    );

    await expectNoA11yViolations(container);
  });
});
