import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { Input } from "./input.js";
import { Label } from "./label.js";

describe("Input", () => {
  it("accepts typed text", async () => {
    const user = userEvent.setup();
    render(<Input aria-label="Email" />);

    await user.type(screen.getByRole("textbox", { name: "Email" }), "dev@aback.com");

    expect(screen.getByRole("textbox", { name: "Email" })).toHaveValue("dev@aback.com");
  });

  it("forwards its ref to the underlying input element", () => {
    const ref = { current: null };

    render(<Input ref={ref} aria-label="Name" />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("does not accept text while disabled", async () => {
    const user = userEvent.setup();
    render(<Input aria-label="Disabled" disabled />);

    await user.type(screen.getByRole("textbox", { name: "Disabled" }), "nope");

    expect(screen.getByRole("textbox", { name: "Disabled" })).toHaveValue("");
  });

  it("connects to its label", () => {
    render(
      <>
        <Label htmlFor="plan">Plan</Label>
        <Input id="plan" />
      </>,
    );

    expect(screen.getByLabelText("Plan")).toBeInTheDocument();
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(
      <div>
        <Label htmlFor="email-axe">Email</Label>
        <Input id="email-axe" type="email" placeholder="dev@aback.com" />
        <Input aria-label="Disabled input" disabled />
      </div>,
    );

    await expectNoA11yViolations(container);
  });
});
