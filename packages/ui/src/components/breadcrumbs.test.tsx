import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { Breadcrumbs } from "./breadcrumbs.js";

describe("Breadcrumbs", () => {
  it("renders a labelled navigation landmark", () => {
    render(<Breadcrumbs items={[{ label: "Home" }]} />);

    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
  });

  it("marks the last item as the current page", () => {
    render(
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Docs", href: "/docs" },
          { label: "Button" },
        ]}
      />,
    );

    const current = screen.getByText("Button");
    expect(current).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Docs" })).toHaveAttribute(
      "href",
      "/docs",
    );
  });

  it("does not render the current page as a link", () => {
    render(
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Button" }]} />,
    );

    expect(screen.queryByRole("link", { name: "Button" })).not.toBeInTheDocument();
  });

  it("hides the separators from assistive technology", () => {
    const { container } = render(
      <Breadcrumbs
        items={[{ label: "Home", href: "/" }, { label: "Button" }]}
      />,
    );

    const hiddenIcons = container.querySelectorAll("svg[aria-hidden='true']");
    expect(hiddenIcons.length).toBeGreaterThan(0);
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Components", href: "/docs/components" },
          { label: "Breadcrumbs" },
        ]}
      />,
    );

    await expectNoA11yViolations(container);
  });
});
