import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { ShareButtons, shareUrl } from "./share-buttons.js";

const url = "https://abackui.com/docs/components/button?ref=a&b=c";

describe("ShareButtons", () => {
  it("renders a named group of share links with encoded URLs", () => {
    render(<ShareButtons url={url} title="Aback UI button" networks={["x", "linkedin", "email"]} />);

    expect(screen.getByRole("group", { name: "Share" })).toBeInTheDocument();
    const x = screen.getByRole("link", { name: "Share on X" });
    expect(x).toHaveAttribute(
      "href",
      `https://x.com/intent/post?url=${encodeURIComponent(url)}&text=Aback%20UI%20button`,
    );
    expect(x).toHaveAttribute("target", "_blank");
    expect(x).toHaveAttribute("rel", "noopener noreferrer");

    const email = screen.getByRole("link", { name: "Share by email" });
    expect(email.getAttribute("href")).toMatch(/^mailto:\?subject=/);
    expect(email).not.toHaveAttribute("target");
  });

  it("includes a copy-link button by default", () => {
    render(<ShareButtons url={url} />);
    expect(screen.getByRole("button", { name: "Copy link" })).toBeInTheDocument();
  });

  it("shows visible labels when asked", () => {
    render(<ShareButtons url={url} networks={["reddit"]} copyLink={false} showLabels />);
    expect(screen.getByRole("link", { name: "Reddit" })).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("builds network URLs without touching the DOM", () => {
    expect(shareUrl("whatsapp", "https://a.b", "Hi")).toBe("https://wa.me/?text=Hi%20https%3A%2F%2Fa.b");
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(
      <ShareButtons url={url} networks={["x", "linkedin", "facebook", "whatsapp", "reddit", "email"]} />,
    );
    await expectNoA11yViolations(container);
  });
});
