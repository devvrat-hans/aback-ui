import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { Label } from "./label.js";
import { Textarea } from "./textarea.js";

describe("Textarea", () => {
  it("accepts typed text", async () => {
    const user = userEvent.setup();
    render(<Textarea aria-label="Release notes" />);

    await user.type(
      screen.getByRole("textbox", { name: "Release notes" }),
      "Registry install verified.",
    );

    expect(screen.getByRole("textbox", { name: "Release notes" })).toHaveValue(
      "Registry install verified.",
    );
  });

  it("forwards its ref to the underlying textarea element", () => {
    const ref = { current: null };

    render(<Textarea ref={ref} aria-label="Notes" />);

    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it("does not accept text while disabled", async () => {
    const user = userEvent.setup();
    render(<Textarea aria-label="Disabled notes" disabled />);

    await user.type(screen.getByRole("textbox", { name: "Disabled notes" }), "nope");

    expect(screen.getByRole("textbox", { name: "Disabled notes" })).toHaveValue("");
  });

  it("connects to its label", () => {
    render(
      <>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" />
      </>,
    );

    expect(screen.getByLabelText("Description")).toBeInTheDocument();
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(
      <div>
        <Label htmlFor="notes-axe">Notes</Label>
        <Textarea id="notes-axe" placeholder="What changed?" />
        <Textarea aria-label="Disabled textarea" disabled />
      </div>,
    );

    await expectNoA11yViolations(container);
  });
});
