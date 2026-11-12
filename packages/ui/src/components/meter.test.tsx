import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { Meter } from "./meter.js";

function indicator(container: HTMLElement) {
  return container.querySelector<HTMLElement>("[data-slot='meter-indicator']")!;
}

describe("Meter", () => {
  it("exposes the reading as a named meter", () => {
    const { container } = render(<Meter label="Performance" value={82} />);

    const meter = screen.getByRole("meter", { name: "Performance" });
    expect(meter).toHaveAttribute("aria-valuenow", "82");
    expect(meter).toHaveAttribute("aria-valuemin", "0");
    expect(meter).toHaveAttribute("aria-valuemax", "100");
    expect(indicator(container)).toHaveStyle({ width: "82%" });
  });

  it("scales a custom range and clamps values outside it", () => {
    const { container, rerender } = render(
      <Meter aria-label="Storage" value={7.5} min={5} max={10} />,
    );
    expect(indicator(container)).toHaveStyle({ width: "50%" });

    rerender(<Meter aria-label="Storage" value={40} min={5} max={10} />);
    expect(screen.getByRole("meter", { name: "Storage" })).toHaveAttribute("aria-valuenow", "10");
    expect(indicator(container)).toHaveStyle({ width: "100%" });

    rerender(<Meter aria-label="Storage" value={Number.NaN} min={5} max={10} />);
    expect(screen.getByRole("meter", { name: "Storage" })).toHaveAttribute("aria-valuenow", "5");
    expect(indicator(container)).toHaveStyle({ width: "0%" });
  });

  it("does not divide by zero when the range is empty", () => {
    const { container } = render(<Meter aria-label="Empty" value={3} min={3} max={3} />);
    expect(indicator(container)).toHaveStyle({ width: "0%" });
  });

  it("shows the percentage only when asked", () => {
    const { rerender } = render(<Meter label="Readability" value={64.4} />);
    expect(screen.queryByText("64%")).not.toBeInTheDocument();

    rerender(<Meter label="Readability" value={64.4} showValue />);
    expect(screen.getByText("64%")).toBeInTheDocument();
  });

  it("shows a value label and reads it instead of the raw number", () => {
    render(<Meter label="Storage" value={7.2} max={10} valueLabel="7.2 of 10 GB" />);

    expect(screen.getByText("7.2 of 10 GB")).toBeInTheDocument();
    expect(screen.getByRole("meter", { name: "Storage" })).toHaveAttribute(
      "aria-valuetext",
      "7.2 of 10 GB",
    );
  });

  it("prefers an explicit valueText", () => {
    render(
      <Meter label="Password" value={1} max={4} valueLabel={<strong>Weak</strong>} valueText="Weak, 1 of 4" />,
    );

    expect(screen.getByRole("meter", { name: "Password" })).toHaveAttribute(
      "aria-valuetext",
      "Weak, 1 of 4",
    );
  });

  it("colours the fill by tone", () => {
    const { container, rerender } = render(<Meter aria-label="Score" value={95} tone="success" />);
    expect(indicator(container)).toHaveClass("bg-success");
    expect(container.querySelector("[data-slot='meter']")).toHaveAttribute("data-tone", "success");

    rerender(<Meter aria-label="Score" value={40} tone="danger" />);
    expect(indicator(container)).toHaveClass("bg-danger");
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(
      <div>
        <Meter label="Performance" value={82} tone="warning" valueLabel="82 / 100" />
        <Meter aria-label="Accessibility score" value={96} tone="success" size="sm" />
      </div>,
    );

    await expectNoA11yViolations(container);
  });
});
