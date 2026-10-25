import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card.js";

function Example() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button type="button" className="underline">
          @aditi
        </button>
      </HoverCardTrigger>
      <HoverCardContent aria-label="Profile details">
        <p className="text-sm font-medium">Aditi Rao</p>
        <p className="text-xs text-muted-foreground">Design lead · Joined 2024</p>
      </HoverCardContent>
    </HoverCard>
  );
}

describe("HoverCard", () => {
  it("opens on hover", async () => {
    const user = userEvent.setup();
    render(<Example />);

    expect(screen.queryByText("Aditi Rao")).not.toBeInTheDocument();
    await user.hover(screen.getByRole("button", { name: "@aditi" }));

    expect(await screen.findByText("Aditi Rao")).toBeInTheDocument();
  });

  it("closes when the pointer leaves", async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.hover(screen.getByRole("button", { name: "@aditi" }));
    await screen.findByText("Aditi Rao");
    await user.unhover(screen.getByRole("button", { name: "@aditi" }));

    await waitFor(() => {
      expect(screen.queryByText("Aditi Rao")).not.toBeInTheDocument();
    });
  });

  it("has no detectable accessibility violations while open", async () => {
    render(
      <HoverCard defaultOpen>
        <HoverCardTrigger>@aditi</HoverCardTrigger>
        <HoverCardContent aria-label="Profile details">
          <p>Aditi Rao</p>
        </HoverCardContent>
      </HoverCard>,
    );

    await screen.findByText("Aditi Rao");
    await expectNoA11yViolations(document.body);
  });
});
