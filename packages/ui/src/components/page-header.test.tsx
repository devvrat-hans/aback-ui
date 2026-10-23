import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { PageHeader } from "./page-header.js";

describe("PageHeader", () => {
  it("renders the title as the page h1 by default", () => {
    render(<PageHeader eyebrow="Workspace" title="API keys" description="Manage access." />);

    expect(screen.getByRole("heading", { level: 1, name: "API keys" })).toBeInTheDocument();
    expect(screen.getByText("Workspace")).toBeInTheDocument();
    expect(screen.getByText("Manage access.")).toBeInTheDocument();
  });

  it("renders a lower heading level when the header introduces a section", () => {
    render(<PageHeader as="h2" title="API keys" />);

    expect(screen.getByRole("heading", { level: 2, name: "API keys" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
  });

  it("keeps actions in keyboard order and passes extra props to the header", () => {
    render(
      <PageHeader
        title="API keys"
        data-testid="header"
        actions={
          <>
            <button type="button">Create key</button>
            <button type="button">Read the docs</button>
          </>
        }
      />,
    );

    expect(screen.getByTestId("header").tagName).toBe("HEADER");
    const buttons = screen.getAllByRole("button");
    expect(buttons.map((button) => button.textContent)).toEqual(["Create key", "Read the docs"]);
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(
      <PageHeader title="API keys" description="Manage access." eyebrow="Workspace" />,
    );

    await expectNoA11yViolations(container);
  });
});
