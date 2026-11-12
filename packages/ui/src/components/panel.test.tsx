import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { Panel } from "./panel.js";

describe("Panel", () => {
  it("names the group with its title", () => {
    render(
      <Panel title="Image options">
        <label>
          Width <input type="number" />
        </label>
      </Panel>,
    );

    const group = screen.getByRole("group", { name: "Image options" });
    expect(group).toHaveAttribute("data-slot", "panel");
    expect(screen.getByRole("heading", { level: 3, name: "Image options" })).toBeInTheDocument();
    expect(screen.getByLabelText("Width")).toBeInTheDocument();
  });

  it("is a plain container without a title", () => {
    const { container } = render(<Panel>Result</Panel>);

    expect(screen.queryByRole("group")).not.toBeInTheDocument();
    expect(container.querySelector("[data-slot='panel-header']")).not.toBeInTheDocument();
    expect(container.firstElementChild).toHaveTextContent("Result");
  });

  it("renders the heading level, description, and actions it is given", () => {
    render(
      <Panel
        as="h4"
        title="Output"
        description="Copied values keep their formatting."
        actions={<button type="button">Copy</button>}
      >
        <p>42</p>
      </Panel>,
    );

    expect(screen.getByRole("heading", { level: 4, name: "Output" })).toBeInTheDocument();
    expect(screen.getByText("Copied values keep their formatting.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
  });

  it("keeps an explicit accessible name", () => {
    render(
      <Panel title="Options" aria-label="Compression options">
        <p>Quality</p>
      </Panel>,
    );

    expect(screen.getByRole("group", { name: "Compression options" })).toBeInTheDocument();
  });

  it("supports the nested card variant and the small size", () => {
    const { container } = render(
      <Panel variant="card" size="sm">
        Nested
      </Panel>,
    );

    const panel = container.firstElementChild!;
    expect(panel).toHaveAttribute("data-variant", "card");
    expect(panel).toHaveClass("bg-card", "p-3");
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(
      <Panel title="Options" description="Applied to every file." actions={<button type="button">Reset</button>}>
        <Panel variant="card" title="Advanced" as="h4">
          <p>Strip metadata</p>
        </Panel>
      </Panel>,
    );

    await expectNoA11yViolations(container);
  });
});
