import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { Progress } from "./progress.js";

describe("Progress", () => {
  it("exposes the value, maximum, and accessible name", () => {
    render(<Progress value={40} label="Upload progress" showValue />);
    const bar = screen.getByRole("progressbar", { name: "Upload progress" });

    expect(bar).toHaveAttribute("aria-valuenow", "40");
    expect(bar).toHaveAttribute("aria-valuemax", "100");
    expect(screen.getByText("40%")).toBeInTheDocument();
  });

  it("clamps values to the declared range", () => {
    render(<Progress value={140} max={100} label="Import" />);
    expect(screen.getByRole("progressbar", { name: "Import" })).toHaveAttribute(
      "aria-valuenow",
      "100",
    );
  });

  it("supports an indeterminate state", () => {
    render(<Progress value={null} label="Preparing" />);
    const bar = screen.getByRole("progressbar", { name: "Preparing" });
    expect(bar).not.toHaveAttribute("aria-valuenow");
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(<Progress value={64} label="Indexing files" showValue />);
    await expectNoA11yViolations(container);
  });
});
