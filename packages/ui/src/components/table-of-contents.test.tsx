import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { TableOfContents } from "./table-of-contents.js";

type ObserverCallback = (entries: Array<{ isIntersecting: boolean; target: Element }>) => void;

let observerCallback: ObserverCallback | null = null;
const observed: Element[] = [];

class FakeObserver {
  constructor(callback: ObserverCallback) {
    observerCallback = callback;
  }
  observe(element: Element) {
    observed.push(element);
  }
  disconnect() {}
  unobserve() {}
}

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
    observed.length = 0;
    vi.stubGlobal("IntersectionObserver", FakeObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("is a labelled navigation landmark of anchor links", () => {
    render(<Page />);
    const nav = screen.getByRole("navigation", { name: "On this page" });
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Usage" })).toHaveAttribute("href", "#usage");
  });

  it("marks the section in view as the current location", () => {
    render(<Page />);
    expect(observed.map((element) => element.id)).toEqual(["install", "usage", "props"]);

    act(() => {
      observerCallback?.([{ isIntersecting: true, target: document.getElementById("usage")! }]);
    });
    expect(screen.getByRole("link", { name: "Usage" })).toHaveAttribute("aria-current", "location");
    expect(screen.getByRole("link", { name: "Installation" })).not.toHaveAttribute("aria-current");
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
