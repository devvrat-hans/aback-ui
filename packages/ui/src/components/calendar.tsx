"use client";

import * as React from "react";
import {
  DateLib,
  DayPicker,
  type ClassNames,
  type CustomComponents,
  type DayPickerProps,
  type Labels,
} from "react-day-picker";
import { IconChevronDown, IconChevronLeft, IconChevronRight, IconChevronUp } from "@tabler/icons-react";

import { cn } from "../lib/utils";

/** The `{ from, to }` shape used by range mode, re-exported so consumers do not need a direct dependency. */
export type { DateRange } from "react-day-picker";

export type CalendarProps = DayPickerProps & {
  className?: string;
  /**
   * Override individual slots. Slots you omit keep the Aback styling, so a
   * consumer can adjust one element without restyling the whole calendar.
   */
  classNames?: Partial<ClassNames>;
};

const DEFAULT_FORMAT: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  year: "numeric",
};

/** Format a date in the visitor's locale, without pulling in a date library. */
export function formatCalendarDate(
  date: Date,
  locale?: string,
  options: Intl.DateTimeFormatOptions = DEFAULT_FORMAT,
): string {
  return new Intl.DateTimeFormat(locale, options).format(date);
}

const navButton =
  "absolute top-0 z-10 inline-flex size-8 items-center justify-center border border-transparent text-muted-foreground transition-colors " +
  "hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring " +
  "disabled:pointer-events-none disabled:opacity-40";

const defaultClassNames: Partial<ClassNames> = {
  root: "relative w-fit",
  months: "flex flex-col gap-4 sm:flex-row sm:gap-6",
  month: "relative flex flex-col gap-3",
  month_caption: "flex h-8 items-center justify-center px-9",
  caption_label: "text-sm font-semibold text-foreground",
  nav: "contents",
  button_previous: cn(navButton, "left-0"),
  button_next: cn(navButton, "right-0"),
  chevron: "size-4",
  month_grid: "w-full border-collapse",
  weekdays: "",
  weekday:
    "h-8 w-9 p-0 text-[11px] font-medium uppercase tracking-wide text-muted-foreground",
  week: "",
  day: "p-0 text-center align-middle",
  day_button:
    "mx-auto flex size-9 items-center justify-center text-sm font-normal text-foreground transition-colors " +
    "hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-focus-ring " +
    "disabled:pointer-events-none disabled:opacity-40",
  selected:
    "[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary [&>button]:font-medium",
  today: "[&:not([data-selected=true])>button]:font-semibold [&:not([data-selected=true])>button]:text-brand",
  outside: "[&>button]:text-muted-foreground [&>button]:hover:text-foreground",
  disabled: "[&>button]:text-muted-foreground/40 [&>button]:line-through",
  hidden: "invisible",
  range_middle:
    "[&[data-selected=true].rdp-range_middle>button]:bg-muted " +
    "[&[data-selected=true].rdp-range_middle>button]:text-foreground " +
    "[&[data-selected=true].rdp-range_middle>button]:hover:bg-muted",
  dropdowns: "flex items-center justify-center gap-2 px-9",
  dropdown_root: "relative inline-flex items-center",
  dropdown:
    "h-8 appearance-none border border-input bg-background px-2 pr-6 text-sm text-foreground outline-none " +
    "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-focus-ring",
  footer: "border-t border-border px-2 pt-3 text-xs text-muted-foreground",
};

// A day button shows only its number, so its accessible name must contain that
// number as a word (WCAG 2.5.3, Label in Name). The library default reads
// "November 1st", which does not; this reads "Sunday, November 1, 2026".
const defaultLabels: Partial<Labels> = {
  labelDayButton: (date, modifiers, options, dateLib) => {
    let label = (dateLib ?? new DateLib(options)).format(date, "EEEE, MMMM d, yyyy");
    if (modifiers.today) label = `Today, ${label}`;
    if (modifiers.selected) label = `${label}, selected`;
    return label;
  },
};

const defaultComponents: Partial<CustomComponents> = {
  Chevron: ({ orientation = "left", className, size = 16 }) => {
    const Icon =
      orientation === "left"
        ? IconChevronLeft
        : orientation === "right"
          ? IconChevronRight
          : orientation === "up"
            ? IconChevronUp
            : IconChevronDown;
    return <Icon aria-hidden="true" className={cn("size-4", className)} size={size} />;
  },
};

/**
 * A month calendar with single, multiple, and range selection.
 *
 * The calendar is a composed control: use it on its own, inside a `Popover`
 * (see `DatePicker`), or inside a dialog. Every date is a real button inside a
 * `grid`, so arrow-key navigation, Home/End, Page Up/Page Down, and the
 * announced selected state come from react-day-picker's accessible grid.
 */
function Calendar({
  className,
  classNames,
  components,
  labels,
  showOutsideDays = true,
  navLayout = "around",
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      navLayout={navLayout}
      className={cn("w-fit bg-background p-3 text-foreground", className)}
      classNames={{ ...defaultClassNames, ...classNames }}
      components={{ ...defaultComponents, ...components }}
      labels={{ ...defaultLabels, ...labels }}
      {...props}
    />
  );
}

export { Calendar };
