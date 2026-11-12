import type * as React from "react";
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

  it("shows a spinner, reports busy, and ignores clicks while loading", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    const { container, rerender } = render(
      <Button loading onClick={onClick}>
        Save changes
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Save changes" });
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toHaveAttribute("aria-disabled", "true");
    expect(button).not.toBeDisabled();
    expect(container.querySelector("[data-slot='button-spinner']")).toBeInTheDocument();

    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();

    rerender(<Button onClick={onClick}>Save changes</Button>);
    expect(button).not.toHaveAttribute("aria-busy");
    expect(container.querySelector("[data-slot='button-spinner']")).not.toBeInTheDocument();

    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("swaps the label for loadingText and keeps focus", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Button loadingText="Saving">Save changes</Button>);

    await user.tab();
    const button = screen.getByRole("button", { name: "Save changes" });
    expect(button).toHaveFocus();

    rerender(
      <Button loading loadingText="Saving">
        Save changes
      </Button>,
    );
    expect(screen.getByRole("button", { name: "Saving" })).toHaveFocus();
  });

  it("does not submit a form while loading", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault());

    render(
      <form onSubmit={onSubmit}>
        <Button type="submit" loading>
          Send
        </Button>
      </form>,
    );

    await user.click(screen.getByRole("button", { name: "Send" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("puts the spinner inside the child when asChild is set", () => {
    render(
      <Button asChild loading>
        <a href="/export">Export</a>
      </Button>,
    );

    const link = screen.getByRole("link", { name: "Export" });
    expect(link).toHaveAttribute("aria-busy", "true");
    expect(link.querySelector("[data-slot='button-spinner']")).toBeInTheDocument();
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(
      <div>
        <Button>Primary action</Button>
        <Button variant="outline" size="icon" aria-label="Open settings">
          <svg aria-hidden="true" />
        </Button>
        <Button loading loadingText="Saving">
          Save
        </Button>
      </div>,
    );

    await expectNoA11yViolations(container);
  });
});
