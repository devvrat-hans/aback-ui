import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { Checkbox } from "./checkbox.js";
import { Field } from "./field.js";
import { Input } from "./input.js";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group.js";
import { Switch } from "./switch.js";

describe("Field", () => {
  it("associates its label with the control", () => {
    render(
      <Field htmlFor="email" label="Work email" description="We only use this for receipts.">
        <Input id="email" type="email" aria-describedby="email-description" />
      </Field>,
    );

    const input = screen.getByLabelText("Work email");
    expect(input).toHaveAttribute("id", "email");
    expect(input).toHaveAccessibleDescription("We only use this for receipts.");
  });

  it("announces an error and marks the control invalid", () => {
    render(
      <Field
        htmlFor="email"
        label="Work email"
        error="Enter a valid email address."
        required
      >
        <Input
          id="email"
          type="email"
          aria-invalid="true"
          aria-describedby="email-error"
        />
      </Field>,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid email address.");
    expect(screen.getByLabelText(/Work email/)).toHaveAttribute("aria-invalid", "true");
  });

  it("wires a single control without any ids in the calling code", () => {
    render(
      <Field label="Workspace name" description="Visible to your team." required>
        <Input />
      </Field>,
    );

    const input = screen.getByRole("textbox", { name: /Workspace name/ });
    expect(input).toHaveAttribute("id");
    expect(input).toHaveAccessibleDescription("Visible to your team.");
    expect(input).toHaveAttribute("aria-required", "true");
    expect(input).not.toHaveAttribute("aria-invalid");
  });

  it("links the hint and the error, and marks the control invalid", () => {
    render(
      <Field label="Custom domain" description="Without the protocol." error="Already connected.">
        <Input defaultValue="abacktools.com" />
      </Field>,
    );

    const input = screen.getByRole("textbox", { name: "Custom domain" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Without the protocol. Already connected.");
  });

  it("uses the control's own id and keeps what the control already sets", () => {
    render(
      <>
        <p id="format-note">Lowercase letters only.</p>
        <Field label="Slug" description="Shown in the address.">
          <Input id="slug" aria-describedby="format-note" aria-invalid={false} />
        </Field>
      </>,
    );

    const input = screen.getByLabelText("Slug");
    expect(input).toHaveAttribute("id", "slug");
    expect(input).toHaveAttribute("aria-describedby", "format-note slug-description");
    expect(input).toHaveAttribute("aria-invalid", "false");
  });

  it("fills in a missing description link when htmlFor matches the control", () => {
    render(
      <Field htmlFor="region" label="Data region" description="Where new records are stored.">
        <Input id="region" />
      </Field>,
    );

    expect(screen.getByLabelText("Data region")).toHaveAccessibleDescription(
      "Where new records are stored.",
    );
  });

  it("leaves a child alone when htmlFor names a different element", () => {
    render(
      <Field htmlFor="amount" label="Amount" error="Enter an amount.">
        <div data-testid="wrapper">
          <Input id="amount" aria-invalid="true" aria-describedby="amount-error" />
        </div>
      </Field>,
    );

    const wrapper = screen.getByTestId("wrapper");
    expect(wrapper).not.toHaveAttribute("id");
    expect(wrapper).not.toHaveAttribute("aria-invalid");
    expect(screen.getByLabelText("Amount")).toHaveAccessibleDescription("Enter an amount.");
  });

  it("hands the attributes to a function child for a wrapped control", () => {
    render(
      <Field label="Monthly budget" description="Before tax.">
        {(control) => (
          <InputGroup>
            <InputGroupAddon>$</InputGroupAddon>
            <InputGroupInput inputMode="decimal" {...control} />
          </InputGroup>
        )}
      </Field>,
    );

    const input = screen.getByRole("textbox", { name: "Monthly budget" });
    expect(input).toHaveAccessibleDescription("Before tax.");
    expect(input.closest("[data-slot='input-group']")).not.toHaveAttribute("id");
  });

  it("lays a checkbox or switch beside its label and toggles from the label", async () => {
    const user = userEvent.setup();
    render(
      <>
        <Field orientation="horizontal" label="First row is a header" description="Use it for column names.">
          <Switch />
        </Field>
        <Field orientation="horizontal" label="Email me the report">
          <Checkbox />
        </Field>
      </>,
    );

    const toggle = screen.getByRole("switch", { name: "First row is a header" });
    expect(toggle).toHaveAccessibleDescription("Use it for column names.");
    expect(toggle.closest("[data-slot='field']")).toHaveAttribute("data-orientation", "horizontal");

    await user.click(screen.getByText("First row is a header"));
    expect(toggle).toBeChecked();

    const checkbox = screen.getByRole("checkbox", { name: "Email me the report" });
    await user.click(screen.getByText("Email me the report"));
    expect(checkbox).toBeChecked();
  });

  it("renders an action at the end of the label row", () => {
    render(
      <Field label="Password" action={<a href="/reset">Forgot password?</a>}>
        <Input type="password" />
      </Field>,
    );

    expect(screen.getByRole("link", { name: "Forgot password?" })).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toHaveAttribute("type", "password");
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(
      <form>
        <Field label="Work email" description="For receipts." required>
          <Input type="email" />
        </Field>
        <Field label="Custom domain" error="Already connected.">
          <Input defaultValue="abacktools.com" />
        </Field>
        <Field orientation="horizontal" label="Keep me signed in" description="On this device.">
          <Checkbox />
        </Field>
      </form>,
    );

    await expectNoA11yViolations(container);
  });
});
