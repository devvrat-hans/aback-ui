import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { ScrollArea } from "./scroll-area.js";

describe("ScrollArea", () => {
  it("renders its children in a labelled region", () => {
    render(
      <ScrollArea aria-label="Deployments" className="h-40">
        <ul>
          <li>Deploy one</li>
          <li>Deploy two</li>
        </ul>
      </ScrollArea>,
    );

    expect(screen.getByText("Deploy one")).toBeInTheDocument();
    expect(screen.getByLabelText("Deployments")).toBeInTheDocument();
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(
      <ScrollArea aria-label="Recent activity" className="h-40">
        <p>Activity</p>
      </ScrollArea>,
    );
    await expectNoA11yViolations(container);
  });
});
