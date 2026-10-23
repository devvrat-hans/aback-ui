import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Field } from "./field.js";
import { Input } from "./input.js";

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
});
