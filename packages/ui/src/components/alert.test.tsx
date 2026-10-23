import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { Alert, AlertDescription, AlertTitle } from "./alert.js";

describe("Alert", () => {
  it("renders as an info alert by default", () => {
    render(<Alert>Heads up</Alert>);

    const alert = screen.getByText("Heads up");
    expect(alert).toHaveAttribute("data-slot", "alert");
    expect(alert).toHaveAttribute("data-variant", "info");
  });

  it("supports the success, warning, destructive, and muted variants", () => {
    render(
      <>
        <Alert variant="success">Saved</Alert>
        <Alert variant="warning">Careful</Alert>
        <Alert variant="destructive">Failed</Alert>
        <Alert variant="muted">Note</Alert>
      </>,
    );

    expect(screen.getByText("Saved")).toHaveAttribute("data-variant", "success");
    expect(screen.getByText("Careful")).toHaveAttribute("data-variant", "warning");
    expect(screen.getByText("Failed")).toHaveAttribute("data-variant", "destructive");
    expect(screen.getByText("Note")).toHaveAttribute("data-variant", "muted");
  });

  it("renders title and description in their own slots", () => {
    render(
      <Alert>
        <AlertTitle>Upload complete</AlertTitle>
        <AlertDescription>Your file is ready to download.</AlertDescription>
      </Alert>,
    );

    expect(screen.getByText("Upload complete")).toHaveAttribute(
      "data-slot",
      "alert-title",
    );
    expect(screen.getByText("Your file is ready to download.")).toHaveAttribute(
      "data-slot",
      "alert-description",
    );
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(
      <Alert variant="destructive">
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>Check your card details and try again.</AlertDescription>
      </Alert>,
    );

    await expectNoA11yViolations(container);
  });
});
