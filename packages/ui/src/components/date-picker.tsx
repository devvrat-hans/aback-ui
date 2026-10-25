"use client";

import * as React from "react";
import { IconCalendar, IconX } from "@tabler/icons-react";
import type { DateRange } from "react-day-picker";

import { cn } from "../lib/utils";
import { Button } from "./button";
import { Calendar, formatCalendarDate } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function selectionBounds(min?: Date, max?: Date) {
  const matchers = [];
  if (min) matchers.push({ before: min });
  if (max) matchers.push({ after: max });
  return matchers.length > 0 ? matchers : undefined;
}

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  /** Reject dates before this day. */
  min?: Date;
  /** Reject dates after this day. */
  max?: Date;
  disabled?: boolean;
  /** Show the "Clear" action inside the calendar. Defaults to `true`. */
  clearable?: boolean;
  /** Locale used for the trigger label, for example `en-GB`. */
  locale?: string;
  /** Replace the default `Oct 24, 2026` label. */
  format?: (date: Date) => string;
  /** Month shown before the visitor picks a date. */
  defaultMonth?: Date;
  id?: string;
  /** Renders a hidden input so the value submits with a native form. */
  name?: string;
  className?: string;
  align?: "start" | "center" | "end";
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  "aria-labelledby"?: string;
}

/**
 * A date field: a button that opens a calendar in a popover.
 *
 * The trigger is a real button, so the field is reachable and operable by
 * keyboard. Selecting a day closes the popover and returns focus to the
 * trigger; Escape closes without changing the value. When `name` is set, a
 * hidden input carries the `yyyy-mm-dd` value into native form submission.
 */
function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  min,
  max,
  disabled,
  clearable = true,
  locale,
  format,
  defaultMonth,
  id,
  name,
  className,
  align = "start",
  "aria-describedby": ariaDescribedBy,
  "aria-invalid": ariaInvalid,
  "aria-labelledby": ariaLabelledBy,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  const label = value ? (format ? format(value) : formatCalendarDate(value, locale)) : placeholder;

  function select(date: Date | undefined) {
    onChange?.(date);
    if (date) setOpen(false);
  }

  return (
    <div data-slot="date-picker" className={cn("relative w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-describedby={ariaDescribedBy}
            aria-invalid={ariaInvalid}
            aria-labelledby={ariaLabelledBy}
            className={cn(
              "w-full justify-start gap-2 font-normal",
              !value && "text-muted-foreground",
            )}
          >
            <IconCalendar aria-hidden="true" className="size-4 shrink-0" />
            <span className="truncate">{label}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align={align} aria-label="Choose a date" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value}
            onSelect={select}
            defaultMonth={value ?? defaultMonth}
            disabled={selectionBounds(min, max)}
            autoFocus
          />
          {clearable && value ? (
            <div className="border-t border-border p-1">
              <button
                type="button"
                className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring"
                onClick={() => {
                  onChange?.(undefined);
                  setOpen(false);
                }}
              >
                <IconX aria-hidden="true" className="size-3.5" />
                Clear date
              </button>
            </div>
          ) : null}
        </PopoverContent>
      </Popover>
      {name ? <input type="hidden" name={name} value={value ? toIsoDate(value) : ""} /> : null}
    </div>
  );
}

export interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
  min?: Date;
  max?: Date;
  disabled?: boolean;
  clearable?: boolean;
  locale?: string;
  format?: (date: Date) => string;
  /** Number of months shown side by side on wide screens. Defaults to `1`. */
  numberOfMonths?: number;
  defaultMonth?: Date;
  id?: string;
  className?: string;
  align?: "start" | "center" | "end";
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

/**
 * A range field for reports, filters, and booking windows.
 *
 * The popover stays open until both ends are chosen, so the visitor can see
 * the in-progress range. A completed range is announced through the calendar
 * grid's `aria-multiselectable` and per-day selected state.
 */
function DateRangePicker({
  value,
  onChange,
  placeholder = "Pick a date range",
  min,
  max,
  disabled,
  clearable = true,
  locale,
  format,
  numberOfMonths = 1,
  defaultMonth,
  id,
  className,
  align = "start",
  "aria-describedby": ariaDescribedBy,
  "aria-labelledby": ariaLabelledBy,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);
  const formatOne = (date: Date) =>
    format ? format(date) : formatCalendarDate(date, locale);

  const sameDay =
    value?.from && value.to ? value.from.toDateString() === value.to.toDateString() : false;
  const label = value?.from
    ? value.to && !sameDay
      ? `${formatOne(value.from)} – ${formatOne(value.to)}`
      : formatOne(value.from)
    : placeholder;

  function select(range: DateRange | undefined) {
    onChange?.(range);
    // A first click in react-day-picker produces a one-day range. Keeping the
    // calendar open lets the visitor finish the second end; a range that spans
    // two different days is complete and closes the popover.
    if (range?.from && range.to && range.from.toDateString() !== range.to.toDateString()) {
      setOpen(false);
    }
  }

  return (
    <div data-slot="date-range-picker" className={cn("relative w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-describedby={ariaDescribedBy}
            aria-labelledby={ariaLabelledBy}
            className={cn(
              "w-full justify-start gap-2 font-normal",
              !value?.from && "text-muted-foreground",
            )}
          >
            <IconCalendar aria-hidden="true" className="size-4 shrink-0" />
            <span className="truncate">{label}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align={align} aria-label="Choose a date range" className="w-auto p-0">
          <Calendar
            mode="range"
            selected={value}
            onSelect={select}
            defaultMonth={value?.from ?? defaultMonth}
            numberOfMonths={numberOfMonths}
            disabled={selectionBounds(min, max)}
            autoFocus
          />
          {clearable && value?.from ? (
            <div className="border-t border-border p-1">
              <button
                type="button"
                className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring"
                onClick={() => {
                  onChange?.(undefined);
                  setOpen(false);
                }}
              >
                <IconX aria-hidden="true" className="size-3.5" />
                Clear range
              </button>
            </div>
          ) : null}
        </PopoverContent>
      </Popover>
    </div>
  );
}

export { DatePicker, DateRangePicker };
