import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { CopyButton } from "./copy-button.js";

function mockClipboard(writeText: (value: string) => Promise<void>) {
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
}

describe("CopyButton", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("writes the value and confirms it in place", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn(() => Promise.resolve());
    const onCopy = vi.fn();
    render(<CopyButton value="npm install @aback-ui/ui" onCopy={onCopy} />);
    mockClipboard(writeText);

    await user.click(screen.getByRole("button", { name: "Copy" }));

    expect(writeText).toHaveBeenCalledWith("npm install @aback-ui/ui");
    expect(onCopy).toHaveBeenCalledWith("npm install @aback-ui/ui");
    expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Copied to clipboard");
  });

  it("returns to the idle label after the timeout", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    mockClipboard(() => Promise.resolve());
    render(<CopyButton value="abc" timeout={1000} showLabel />);

    await user.click(screen.getByRole("button", { name: "Copy" }));
    expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1100);
    });
    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
  });

  it("reports a refused write instead of claiming success", async () => {
    const user = userEvent.setup();
    const onCopyError = vi.fn();
    render(<CopyButton value="abc" onCopyError={onCopyError} />);
    mockClipboard(() => Promise.reject(new Error("denied")));

    await user.click(screen.getByRole("button", { name: "Copy" }));

    expect(onCopyError).toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Copy failed" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Copy failed");
  });

  it("is disabled when there is nothing to copy", () => {
    render(<CopyButton value="" label="Copy output" />);
    expect(screen.getByRole("button", { name: "Copy output" })).toBeDisabled();
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(
      <div>
        <CopyButton value="abc" label="Copy token" />
        <CopyButton value="abc" showLabel />
      </div>,
    );
    await expectNoA11yViolations(container);
  });
});
