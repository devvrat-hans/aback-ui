import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { DatePicker, DateRangePicker } from "./date-picker.js";

const OCTOBER = new Date(2026, 9, 1);

describe("DatePicker", () => {
  it("opens the calendar and sets a date", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    function Example() {
      const [date, setDate] = React.useState<Date | undefined>();
      return (
        <DatePicker
          value={date}
          onChange={(next) => {
            setDate(next);
            onChange(next);
          }}
          defaultMonth={OCTOBER}
          locale="en-US"
        />
      );
    }

    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Pick a date" }));

    expect(await screen.findByRole("dialog", { name: "Choose a date" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Monday, October 12th, 2026" }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0]?.[0]?.toDateString()).toBe("Mon Oct 12 2026");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: /Oct 12, 2026/ })).toBeInTheDocument();
  });

  it("clears a selected date", async () => {
    const user = userEvent.setup();

    function Example() {
      const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 9, 12));
      return (
        <DatePicker value={date} onChange={setDate} defaultMonth={OCTOBER} locale="en-US" />
      );
    }

    render(<Example />);
    await user.click(screen.getByRole("button", { name: /Oct 12, 2026/ }));
    await user.click(await screen.findByRole("button", { name: "Clear date" }));

    expect(screen.getByRole("button", { name: "Pick a date" })).toBeInTheDocument();
  });

  it("rejects dates outside min and max", async () => {
    const user = userEvent.setup();
    render(
      <DatePicker
        min={new Date(2026, 9, 10)}
        max={new Date(2026, 9, 20)}
        defaultMonth={OCTOBER}
        locale="en-US"
      />,
    );

    await user.click(screen.getByRole("button", { name: "Pick a date" }));
    expect(screen.getByRole("button", { name: "Friday, October 9th, 2026" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Wednesday, October 21st, 2026" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Monday, October 12th, 2026" })).toBeEnabled();
  });

  it("submits a hidden ISO value for native forms", () => {
    const { container } = render(
      <DatePicker
        name="startDate"
        value={new Date(2026, 0, 5)}
        defaultMonth={OCTOBER}
        locale="en-US"
      />,
    );
    const input = container.querySelector('input[name="startDate"]');
    expect(input).toHaveValue("2026-01-05");
    expect(input).toHaveAttribute("type", "hidden");
  });

  it("has no detectable accessibility violations while open", async () => {
    const user = userEvent.setup();
    render(<DatePicker defaultMonth={OCTOBER} locale="en-US" />);
    await user.click(screen.getByRole("button", { name: "Pick a date" }));
    const dialog = await screen.findByRole("dialog", { name: "Choose a date" });
    await expectNoA11yViolations(dialog);
  });
});

describe("DateRangePicker", () => {
  it("keeps the calendar open until both ends are chosen", async () => {
    const user = userEvent.setup();

    function Example() {
      const [range, setRange] = React.useState<
        { from: Date | undefined; to?: Date | undefined } | undefined
      >();
      return (
        <DateRangePicker
          value={range}
          onChange={setRange}
          defaultMonth={OCTOBER}
          locale="en-US"
        />
      );
    }

    render(<Example />);
    await user.click(screen.getByRole("button", { name: "Pick a date range" }));
    await user.click(await screen.findByRole("button", { name: "Monday, October 5th, 2026" }));

    expect(screen.getByRole("dialog", { name: "Choose a date range" })).toBeInTheDocument();
    // The first click anchors the range; the popover stays open for the end.
    expect(screen.getByRole("button", { name: "Oct 5, 2026" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Friday, October 9th, 2026" }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(
      screen.getByRole("button", { name: "Oct 5, 2026 – Oct 9, 2026" }),
    ).toBeInTheDocument();
  });
});
