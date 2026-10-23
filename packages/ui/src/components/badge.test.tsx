import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { Badge } from "./badge.js";

describe("Badge", () => {
  it("renders as a secondary badge by default", () => {
    render(<Badge>Stable</Badge>);

    const badge = screen.getByText("Stable");
    expect(badge).toHaveAttribute("data-slot", "badge");
    expect(badge).toHaveAttribute("data-variant", "secondary");
  });

  it("supports the brand, success, warning, and outline variants", () => {
    render(
      <>
        <Badge variant="brand">Aback</Badge>
        <Badge variant="success">Passing</Badge>
        <Badge variant="warning">Draft</Badge>
        <Badge variant="outline">Beta</Badge>
      </>,
    );

    expect(screen.getByText("Aback")).toHaveAttribute("data-variant", "brand");
    expect(screen.getByText("Passing")).toHaveAttribute("data-variant", "success");
    expect(screen.getByText("Draft")).toHaveAttribute("data-variant", "warning");
    expect(screen.getByText("Beta")).toHaveAttribute("data-variant", "outline");
  });

  it("renders as a span so it can sit inside text and buttons", () => {
    const { container } = render(<Badge>v0.1</Badge>);

    const badge = container.querySelector("[data-slot='badge']");
    expect(badge?.tagName).toBe("SPAN");
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(
      <div>
        <Badge variant="brand">New</Badge>
        <Badge variant="destructive">Failed</Badge>
        <Badge variant="muted">Archived</Badge>
      </div>,
    );

    await expectNoA11yViolations(container);
  });
});
