import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { SectionHeading } from "./section-heading.js";

describe("SectionHeading", () => {
  it("renders an h2 by default with its eyebrow and description", () => {
    render(
      <SectionHeading
        eyebrow="Catalogue"
        title="Every product we ship"
        description="Live, in beta, and on the way."
      />,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Every product we ship" })).toBeInTheDocument();
    expect(screen.getByText("Catalogue")).toBeInTheDocument();
    expect(screen.getByText("Live, in beta, and on the way.")).toBeInTheDocument();
  });

  it("supports another level, an id, and an action", () => {
    render(
      <section aria-labelledby="tools-heading">
        <SectionHeading
          as="h3"
          headingId="tools-heading"
          title="Popular tools"
          action={<a href="/tools">View all</a>}
        />
      </section>,
    );
    expect(screen.getByRole("heading", { level: 3 })).toHaveAttribute("id", "tools-heading");
    expect(screen.getByRole("region", { name: "Popular tools" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View all" })).toBeInTheDocument();
  });

  it("centres the content when asked", () => {
    const { container } = render(<SectionHeading title="Pricing" align="center" />);
    expect(container.firstChild).toHaveClass("text-center", "items-center");
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(<SectionHeading eyebrow="FAQ" title="Questions" />);
    await expectNoA11yViolations(container);
  });
});
