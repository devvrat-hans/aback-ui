import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { Skeleton } from "./skeleton.js";

describe("Skeleton", () => {
  it("renders a hidden placeholder block", () => {
    const { container } = render(<Skeleton className="h-4 w-40" />);

    const skeleton = container.querySelector("[data-slot='skeleton']");
    expect(skeleton).toHaveAttribute("aria-hidden", "true");
    expect(skeleton).toHaveClass("animate-pulse", "bg-muted");
  });

  it("accepts custom sizing classes", () => {
    const { container } = render(<Skeleton className="h-24 w-full" />);

    expect(container.querySelector("[data-slot='skeleton']")).toHaveClass("h-24", "w-full");
  });

  it("is hidden from assistive technology", () => {
    const { container } = render(<Skeleton />);

    expect(container.querySelector("[data-slot='skeleton']")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(
      <div>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-20 w-full" />
      </div>,
    );

    await expectNoA11yViolations(container);
  });
});
