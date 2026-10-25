import { act, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { ReadingProgress } from "./reading-progress.js";

function setScroll({ top, height, client }: { top: number; height: number; client: number }) {
  const root = document.documentElement;
  Object.defineProperty(root, "scrollHeight", { configurable: true, value: height });
  Object.defineProperty(root, "clientHeight", { configurable: true, value: client });
  Object.defineProperty(root, "scrollTop", { configurable: true, value: top });
}

describe("ReadingProgress", () => {
  it("is hidden from assistive technology", () => {
    const { container } = render(<ReadingProgress />);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });

  it("scales the bar with the document scroll position", () => {
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      callback(0);
      return 1;
    });
    setScroll({ top: 0, height: 2000, client: 1000 });
    const { container } = render(<ReadingProgress />);
    const bar = container.querySelector<HTMLElement>("[data-slot='reading-progress-bar']")!;
    expect(bar.style.transform).toBe("scaleX(0)");

    setScroll({ top: 500, height: 2000, client: 1000 });
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(bar.style.transform).toBe("scaleX(0.5)");

    setScroll({ top: 1200, height: 2000, client: 1000 });
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(bar.style.transform).toBe("scaleX(1)");
  });

  it("removes its listeners on unmount", () => {
    const remove = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(<ReadingProgress />);
    unmount();
    expect(remove).toHaveBeenCalledWith("scroll", expect.any(Function));
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(<ReadingProgress />);
    await expectNoA11yViolations(container);
  });
});
