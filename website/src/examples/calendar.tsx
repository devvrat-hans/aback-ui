"use client";

import { useState } from "react";

import { Calendar, formatCalendarDate } from "@/components/ui/calendar";

export function CalendarExample() {
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 9, 24));

  return (
    <div className="flex flex-col gap-3">
      <div className="w-fit border border-border bg-card">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </div>
      <p className="text-xs text-muted-foreground" aria-live="polite">
        {date ? `Selected ${formatCalendarDate(date, "en-US")}` : "No date selected"}
      </p>
    </div>
  );
}
