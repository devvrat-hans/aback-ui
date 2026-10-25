import { act, render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { ThemeScript, ThemeToggle, useTheme } from "./theme-toggle.js";

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("switches the dark class, stores the choice, and renames itself", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);

    await user.click(screen.getByRole("button", { name: "Switch to dark theme" }));
    expect(document.documentElement).toHaveClass("dark");
    expect(localStorage.getItem("theme")).toBe("dark");
    expect(screen.getByRole("button", { name: "Switch to light theme" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Switch to light theme" }));
    expect(document.documentElement).not.toHaveClass("dark");
    expect(localStorage.getItem("theme")).toBe("light");
  });

  it("keeps every toggle on the page in sync", async () => {
    const user = userEvent.setup();
    render(
      <>
        <ThemeToggle data-testid="a" />
        <ThemeToggle data-testid="b" />
      </>,
    );
    await user.click(screen.getByTestId("a"));
    expect(screen.getByTestId("b")).toHaveAccessibleName("Switch to light theme");
  });

  it("uses a custom storage key", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle storageKey="docs-theme" />);
    await user.click(screen.getByRole("button"));
    expect(localStorage.getItem("docs-theme")).toBe("dark");
    expect(localStorage.getItem("theme")).toBeNull();
  });

  it("exposes the preference through useTheme", () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("system");
    act(() => result.current.setTheme("dark"));
    expect(result.current.theme).toBe("dark");
    expect(result.current.resolvedTheme).toBe("dark");
  });

  it("renders a light, hydration-safe label on the server", () => {
    const html = renderToString(<ThemeToggle />);
    expect(html).toContain('aria-label="Switch to dark theme"');
  });

  it("escapes the storage key inside the inline script", () => {
    const html = renderToString(<ThemeScript storageKey={'x"</script><script>alert(1)'} nonce="abc" />);
    expect(html).not.toContain("</script><script>");
    expect(html).toContain('nonce="abc"');
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(<ThemeToggle />);
    await expectNoA11yViolations(container);
  });
});
