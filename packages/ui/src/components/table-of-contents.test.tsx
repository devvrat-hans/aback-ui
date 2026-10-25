import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { TableOfContents } from "./table-of-contents.js";

const items = [
  { id: "install", title: "Installation" },
  { id: "usage", title: "Usage" },
  { id: "props", title: "Props", depth: 2 as const },
];

function Page() {
  return (
    <>
      <TableOfContents items={items} />
      <h2 id="install">Installation</h2>
      <h2 id="usage">Usage</h2>
      <h3 id="props">Props</h3>
    </>
  );
}

describe("TableOfContents", () => {
  beforeEach(() => {
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      callback(0);
      return 1;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("is a labelled navigation landmark of anchor links", () => {
    render(<Page />);
    const nav = screen.getByRole("navigation", { name: "On this page" });
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Usage" })).toHaveAttribute("href", "#usage");
  });

  it("marks the last section scrolled past the offset as the current location", () => {
    render(<Page />);
    const tops: Record<string, number> = { install: -400, usage: 40, props: 600 };
    for (const id of Object.keys(tops)) {
      vi.spyOn(document.getElementById(id)!, "getBoundingClientRect").mockReturnValue({
        top: tops[id],
      } as DOMRect);
    }

    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });
    expect(screen.getByRole("link", { name: "Usage" })).toHaveAttribute("aria-current", "location");
    expect(screen.getByRole("link", { name: "Installation" })).not.toHaveAttribute("aria-current");
  });

  it("stops listening when it unmounts", () => {
    const remove = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(<Page />);
    unmount();
    expect(remove).toHaveBeenCalledWith("scroll", expect.any(Function));
  });

  it("marks a clicked entry immediately", async () => {
    const user = userEvent.setup();
    render(<Page />);
    await user.click(screen.getByRole("link", { name: "Props" }));
    expect(screen.getByRole("link", { name: "Props" })).toHaveAttribute("aria-current", "location");
  });

  it("renders nothing without items", () => {
    const { container } = render(<TableOfContents items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(<Page />);
    await expectNoA11yViolations(container);
  });
});
