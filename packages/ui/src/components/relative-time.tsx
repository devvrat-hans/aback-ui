"use client";

import * as React from "react";

const UNITS: ReadonlyArray<[Intl.RelativeTimeFormatUnit, number]> = [
  ["year", 31_536_000],
  ["month", 2_592_000],
  ["week", 604_800],
  ["day", 86_400],
  ["hour", 3_600],
  ["minute", 60],
];

function toDate(value: Date | string | number) {
  return value instanceof Date ? value : new Date(value);
}

/**
 * "3 hours ago", "yesterday", "in 2 days", localized by Intl. Differences
 * under 45 seconds read as "now". Counts are truncated, so 2 h 50 min is
 * "2 hours ago", never a rounded-up time that has not happened yet.
 */
function formatRelativeTime(
  value: Date | string | number,
  now: number = Date.now(),
  locale?: string,
) {
  const date = toDate(value);
  const seconds = (date.getTime() - now) / 1000;
  const format = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
  if (Math.abs(seconds) < 45) return format.format(0, "second");
  for (const [unit, size] of UNITS) {
    if (Math.abs(seconds) >= size) return format.format(Math.trunc(seconds / size), unit);
  }
  return format.format(Math.trunc(seconds / 60) || (seconds < 0 ? -1 : 1), "minute");
}

interface Clock {
  now: number;
  listeners: Set<() => void>;
  timer?: ReturnType<typeof setInterval>;
}

// One shared clock per refresh interval, so a list of a hundred timestamps
// re-renders on one timer instead of a hundred. Nothing runs until a
// component subscribes, and the timer stops with the last subscriber.
const clocks = new Map<number, Clock>();

function clockFor(interval: number) {
  let clock = clocks.get(interval);
  if (!clock) {
    clock = { now: Date.now(), listeners: new Set() };
    clocks.set(interval, clock);
  }
  return clock;
}

function subscribeClock(interval: number, listener: () => void) {
  const clock = clockFor(interval);
  clock.listeners.add(listener);
  if (!clock.timer && interval > 0) {
    clock.timer = setInterval(() => {
      clock.now = Date.now();
      clock.listeners.forEach((notify) => notify());
    }, interval);
  }
  return () => {
    clock.listeners.delete(listener);
    if (clock.listeners.size === 0) {
      if (clock.timer) clearInterval(clock.timer);
      clocks.delete(interval);
    }
  };
}

export interface RelativeTimeProps
  extends Omit<React.ComponentProps<"time">, "dateTime" | "children"> {
  /** The moment to describe. Accepts a Date, an ISO string, or a timestamp. */
  date: Date | string | number;
  /** BCP 47 locale. Defaults to the browser's language. */
  locale?: string;
  /** How often the text updates, in milliseconds. 0 renders once. */
  refreshInterval?: number;
  /** Format of the server render and the hover title. */
  absoluteFormat?: Intl.DateTimeFormatOptions;
}

const DEFAULT_ABSOLUTE: Intl.DateTimeFormatOptions = {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "UTC",
};

/**
 * A relative timestamp that is safe on cached and server-rendered pages. The
 * server and the first client render show the absolute date, so hydration
 * matches; the relative phrase replaces it after mount. The absolute date
 * stays available as the title and in the machine-readable `dateTime`.
 */
function RelativeTime({
  date,
  locale,
  refreshInterval = 60_000,
  absoluteFormat = DEFAULT_ABSOLUTE,
  title,
  ...props
}: RelativeTimeProps) {
  const subscribe = React.useCallback(
    (listener: () => void) => subscribeClock(refreshInterval, listener),
    [refreshInterval],
  );
  const now = React.useSyncExternalStore<number | null>(
    subscribe,
    () => clockFor(refreshInterval).now,
    () => null,
  );

  const value = toDate(date);
  if (Number.isNaN(value.getTime())) return null;

  const absolute = new Intl.DateTimeFormat(locale ?? "en-US", absoluteFormat).format(value);

  return (
    <time
      data-slot="relative-time"
      dateTime={value.toISOString()}
      title={title ?? absolute}
      {...props}
    >
      {now === null ? absolute : formatRelativeTime(value, now, locale)}
    </time>
  );
}

export { RelativeTime, formatRelativeTime };
