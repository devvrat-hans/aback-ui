import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card.js";

function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Plan usage</CardTitle>
        <CardDescription>How much of your plan you have used.</CardDescription>
        <CardAction>
          <button type="button">Upgrade</button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>128 of 500 builds used.</p>
      </CardContent>
      <CardFooter>
        <p>Resets on the 1st of each month.</p>
      </CardFooter>
    </Card>
  );
}

describe("Card", () => {
  it("composes header, content, and footer sections", () => {
    render(<Example />);

    expect(screen.getByText("Plan usage")).toHaveAttribute("data-slot", "card-title");
    expect(screen.getByText("How much of your plan you have used.")).toHaveAttribute(
      "data-slot",
      "card-description",
    );
    expect(
      screen.getByText("128 of 500 builds used.").closest("[data-slot='card-content']"),
    ).not.toBeNull();
    expect(
      screen
        .getByText("Resets on the 1st of each month.")
        .closest("[data-slot='card-footer']"),
    ).not.toBeNull();
  });

  it("renders the title as an h3 by default", () => {
    render(<Example />);

    expect(screen.getByRole("heading", { level: 3, name: "Plan usage" })).toBeInTheDocument();
  });

  it("lets the title change its heading level", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle as="h2">Usage</CardTitle>
        </CardHeader>
      </Card>,
    );

    expect(screen.getByRole("heading", { level: 2, name: "Usage" })).toBeInTheDocument();
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(<Example />);

    await expectNoA11yViolations(container);
  });
});
