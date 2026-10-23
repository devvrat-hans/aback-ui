import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { Input } from "./input.js";
import { Label } from "./label.js";

describe("Label", () => {
  it("labels a control through htmlFor", () => {
    render(
      <>
        <Label htmlFor="workspace">Workspace</Label>
        <Input id="workspace" />
      </>,
    );

    expect(screen.getByLabelText("Workspace")).toBeInTheDocument();
  });

  it("forwards its ref to the underlying label element", () => {
    const ref = { current: null };

    render(<Label ref={ref}>Name</Label>);

    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(
      <div>
        <Label htmlFor="api-key">API key</Label>
        <Input id="api-key" type="password" />
      </div>,
    );

    await expectNoA11yViolations(container);
  });
});
