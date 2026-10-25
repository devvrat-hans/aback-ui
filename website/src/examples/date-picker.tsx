"use client";

import { useState } from "react";

import { formatCalendarDate, type DateRange } from "@/components/ui/calendar";
import { DatePicker, DateRangePicker } from "@/components/ui/date-picker";

export function DatePickerExample() {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 9, 24));
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(2026, 9, 1),
    to: new Date(2026, 9, 24),
  });

  return (
    <div className="grid w-full max-w-lg gap-5 sm:grid-cols-2">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-foreground">Report date</span>
        <DatePicker value={date} onChange={setDate} locale="en-US" />
        <span className="text-xs text-muted-foreground" aria-live="polite">
          {date ? formatCalendarDate(date, "en-US") : "No date selected"}
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-foreground">Billing period</span>
        <DateRangePicker
          value={range}
          onChange={setRange}
          locale="en-US"
          placeholder="Choose a period"
        />
        <span className="text-xs text-muted-foreground" aria-live="polite">
          {range?.from
            ? range.to
              ? `${formatCalendarDate(range.from, "en-US")} to ${formatCalendarDate(range.to, "en-US")}`
              : "Select an end date"
            : "No period selected"}
        </span>
      </div>
    </div>
  );
}
