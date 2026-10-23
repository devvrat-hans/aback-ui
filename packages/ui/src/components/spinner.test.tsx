import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { Spinner } from "./spinner.js";

describe("Spinner", () => {
  it("announces itself as a status with the default label", () => {
    render(<Spinner />);

    // jsdom's accessible-name computation does not read content for role="status",
    // so assert the role and the announced text separately.
    const status = screen.getByRole("status");
    expect(status).toHaveTextContent("Loading");
  });

  it("accepts a custom label", () => {
    render(<Spinner label="Installing component" />);

    expect(screen.getByRole("status")).toHaveTextContent("Installing component");
  });

  it("hides the icon from assistive technology", () => {
    const { container } = render(<Spinner />);

    expect(container.querySelector("svg[aria-hidden='true']")).toBeInTheDocument();
  });

  it("supports the sm, md, and lg sizes", () => {
    const { container, rerender } = render(<Spinner size="sm" />);
    expect(container.querySelector("svg")).toHaveClass("size-4");

    rerender(<Spinner size="md" />);
    expect(container.querySelector("svg")).toHaveClass("size-5");

    rerender(<Spinner size="lg" />);
    expect(container.querySelector("svg")).toHaveClass("size-6");
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(<Spinner label="Saving" />);

    await expectNoA11yViolations(container);
  });
});
