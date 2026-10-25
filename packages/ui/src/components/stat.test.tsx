import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { Stat, StatGrid } from "./stat.js";

describe("Stat", () => {
  it("pairs the label and the value in a description list", () => {
    const { container } = render(<Stat label="Monthly visitors" value="12,480" />);

    expect(container.querySelector("dt")).toHaveTextContent("Monthly visitors");
    expect(container.querySelector("dd[data-slot='stat-value']")).toHaveTextContent("12,480");
  });

  it("renders the unit, hint, and trend as text", () => {
    render(
      <Stat
        label="Uptime"
        value="99.98"
        unit="%"
        hint="Last 30 days"
        trend={{ direction: "up", label: "+0.4% vs last month" }}
      />,
    );

    expect(screen.getByText("%")).toBeInTheDocument();
    expect(screen.getByText("Last 30 days")).toBeInTheDocument();
    const trend = screen.getByText("+0.4% vs last month");
    expect(trend).toHaveAttribute("data-direction", "up");
    expect(trend).toHaveClass("text-success");
  });

  it("uses the tone for the value and the surface when emphasised", () => {
    const { container } = render(<Stat label="Errors" value="3" tone="danger" emphasis />);

    expect(container.querySelector("[data-slot='stat']")).toHaveClass("bg-danger-soft");
    expect(container.querySelector("[data-slot='stat-value']")).toHaveClass("text-danger");
  });

  it("lays stats out in a responsive grid", () => {
    const { container } = render(
      <StatGrid columns={4} joined>
        <Stat label="A" value="1" />
        <Stat label="B" value="2" />
      </StatGrid>,
    );
    const grid = container.querySelector("[data-slot='stat-grid']");
    expect(grid).toHaveClass("xl:grid-cols-4", "gap-px");
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(
      <StatGrid>
        <Stat label="Launches" value="32" icon={<svg />} />
        <Stat label="Revenue" value="$4,210" trend={{ direction: "down", label: "-3% this week" }} />
      </StatGrid>,
    );
    await expectNoA11yViolations(container);
  });
});
