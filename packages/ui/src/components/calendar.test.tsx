import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { Calendar } from "./calendar.js";

const OCTOBER = new Date(2026, 9, 1);

function SingleExample() {
  const [date, setDate] = React.useState<Date | undefined>();
  return (
    <>
      <Calendar mode="single" selected={date} onSelect={setDate} defaultMonth={OCTOBER} />
      <p>{date ? date.toDateString() : "No date selected"}</p>
    </>
  );
}

describe("Calendar", () => {
  it("renders a labelled month grid and selects a day", async () => {
    const user = userEvent.setup();
    render(<SingleExample />);

    expect(screen.getByRole("grid", { name: "October 2026" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Monday, October 12th, 2026" }));

    expect(screen.getByText("Mon Oct 12 2026")).toBeInTheDocument();
  });

  it("moves focus between days with the arrow keys", async () => {
    const user = userEvent.setup();
    render(
      <Calendar
        mode="single"
        selected={new Date(2026, 9, 12)}
        defaultMonth={OCTOBER}
        autoFocus
      />,
    );

    const day = screen.getByRole("button", { name: /Monday, October 12th, 2026/ });
    await waitFor(() => expect(day).toHaveFocus());

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("button", { name: "Tuesday, October 13th, 2026" })).toHaveFocus();

    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("button", { name: "Tuesday, October 20th, 2026" })).toHaveFocus();
  });

  it("disables dates matched by the disabled prop", () => {
    render(
      <Calendar
        mode="single"
        defaultMonth={OCTOBER}
        disabled={{ dayOfWeek: [0] }}
      />,
    );

    expect(screen.getByRole("button", { name: "Sunday, October 4th, 2026" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Monday, October 5th, 2026" })).toBeEnabled();
  });

  it("supports range selection", async () => {
    const user = userEvent.setup();
    function RangeExample() {
      const [range, setRange] = React.useState<
        { from: Date | undefined; to?: Date | undefined } | undefined
      >();
      return (
        <>
          <Calendar
            mode="range"
            selected={range}
            onSelect={setRange}
            defaultMonth={OCTOBER}
            numberOfMonths={2}
          />
          <p>
            {range?.from ? range.from.toDateString() : "No start"} /{" "}
            {range?.to ? range.to.toDateString() : "No end"}
          </p>
        </>
      );
    }

    render(<RangeExample />);
    await user.click(screen.getByRole("button", { name: "Monday, October 5th, 2026" }));
    await user.click(screen.getByRole("button", { name: "Friday, October 9th, 2026" }));

    expect(screen.getByText("Mon Oct 05 2026 / Fri Oct 09 2026")).toBeInTheDocument();
  });

  it("has no detectable accessibility violations", async () => {
    render(<Calendar mode="single" defaultMonth={OCTOBER} />);
    await expectNoA11yViolations(document.body);
  });
});
