import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { Step, Steps } from "./steps.js";

function Onboarding() {
  return (
    <Steps aria-label="Workspace setup">
      <Step status="complete" title="Create the workspace" description="Name and region." />
      <Step status="current" title="Invite your team" />
      <Step title="Connect a domain" />
    </Steps>
  );
}

describe("Steps", () => {
  it("is an ordered list with one item per step", () => {
    render(<Onboarding />);
    const list = screen.getByRole("list", { name: "Workspace setup" });
    expect(list.tagName).toBe("OL");
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("marks the current step and announces each status in text", () => {
    render(<Onboarding />);
    const [complete, current, upcoming] = screen.getAllByRole("listitem");
    expect(current).toHaveAttribute("aria-current", "step");
    expect(complete).not.toHaveAttribute("aria-current");
    expect(complete).toHaveTextContent("Completed: Create the workspace");
    expect(current).toHaveTextContent("Current step: Invite your team");
    expect(upcoming).toHaveTextContent("Not started: Connect a domain");
  });

  it("accepts a localized status label and extra content", () => {
    render(
      <Steps>
        <Step status="current" statusLabel="Paso actual" title="Pagar">
          <button type="button">Continuar</button>
        </Step>
      </Steps>,
    );
    expect(screen.getByRole("listitem")).toHaveTextContent("Paso actual: Pagar");
    expect(screen.getByRole("button", { name: "Continuar" })).toBeInTheDocument();
  });

  it("supports a horizontal layout", () => {
    const { container } = render(
      <Steps orientation="horizontal">
        <Step title="One" />
      </Steps>,
    );
    expect(container.querySelector("ol")).toHaveAttribute("data-orientation", "horizontal");
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(<Onboarding />);
    await expectNoA11yViolations(container);
  });
});
