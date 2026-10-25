import { act, render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { RelativeTime, formatRelativeTime } from "./relative-time.js";

const NOW = Date.UTC(2026, 9, 25, 12, 0, 0);

describe("formatRelativeTime", () => {
  it("chooses the largest whole unit and truncates", () => {
    expect(formatRelativeTime(NOW - 10_000, NOW, "en")).toBe("now");
    expect(formatRelativeTime(NOW - 5 * 60_000, NOW, "en")).toBe("5 minutes ago");
    expect(formatRelativeTime(NOW - (2 * 3600 + 50 * 60) * 1000, NOW, "en")).toBe("2 hours ago");
    expect(formatRelativeTime(NOW - 86_400_000, NOW, "en")).toBe("yesterday");
    expect(formatRelativeTime(NOW + 3 * 86_400_000, NOW, "en")).toBe("in 3 days");
    expect(formatRelativeTime(NOW - 400 * 86_400_000, NOW, "en")).toBe("last year");
  });

  it("localizes through Intl", () => {
    expect(formatRelativeTime(NOW - 2 * 3_600_000, NOW, "de")).toBe("vor 2 Stunden");
  });
});

describe("RelativeTime", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the absolute date on the server", () => {
    const html = renderToString(<RelativeTime date="2026-10-25T09:00:00Z" />);
    expect(html).toContain('dateTime="2026-10-25T09:00:00.000Z"');
    expect(html).toContain("Oct 25, 2026");
    expect(html).not.toContain("ago");
  });

  it("shows the relative phrase on the client and keeps the exact date as the title", () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    render(<RelativeTime date={NOW - 3 * 3_600_000} locale="en" />);

    const time = screen.getByText("3 hours ago");
    expect(time.tagName).toBe("TIME");
    expect(time).toHaveAttribute("title", "Oct 25, 2026, 9:00 AM");
  });

  it("updates on the refresh interval", () => {
    vi.useFakeTimers();
    vi.setSystemTime(NOW);
    render(<RelativeTime date={NOW - 60_000} locale="en" refreshInterval={60_000} />);
    expect(screen.getByText("1 minute ago")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(screen.getByText("2 minutes ago")).toBeInTheDocument();
  });

  it("renders nothing for an invalid date", () => {
    const { container } = render(<RelativeTime date="not a date" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(
      <p>
        Updated <RelativeTime date={Date.now() - 3_600_000} />
      </p>,
    );
    await expectNoA11yViolations(container);
  });
});
