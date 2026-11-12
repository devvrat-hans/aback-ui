import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { Prose } from "./prose.js";

describe("Prose", () => {
  it("wraps plain elements without changing their semantics", () => {
    const { container } = render(
      <Prose>
        <h2 id="setup">Set up the theme</h2>
        <p>
          Import the tokens once, then read the <a href="/docs/theming">theming guide</a>.
        </p>
        <ul>
          <li>Light</li>
          <li>Dark</li>
        </ul>
      </Prose>,
    );

    const prose = container.querySelector("[data-slot='prose']")!;
    expect(prose.tagName).toBe("DIV");
    expect(prose).toHaveAttribute("data-size", "default");
    expect(screen.getByRole("heading", { level: 2, name: "Set up the theme" })).toHaveAttribute(
      "id",
      "setup",
    );
    expect(screen.getByRole("link", { name: "theming guide" })).toHaveAttribute("href", "/docs/theming");
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("styles descendants with zero-specificity selectors", () => {
    const { container } = render(
      <Prose>
        <p>Body</p>
      </Prose>,
    );

    const prose = container.firstElementChild!;
    expect(prose).toHaveClass("text-sm", "text-muted-foreground");
    expect(prose).toHaveClass("[:where(&_h2)]:text-2xl");
    expect(prose).toHaveClass("[:where(&_a)]:underline");
  });

  it("switches to the reading size", () => {
    const { container } = render(
      <Prose size="lg">
        <p>Body</p>
      </Prose>,
    );

    const prose = container.firstElementChild!;
    expect(prose).toHaveAttribute("data-size", "lg");
    expect(prose).toHaveClass("text-[17px]");
    expect(prose).not.toHaveClass("text-sm");
  });

  it("lets a class from the caller replace a default", () => {
    const { container } = render(
      <Prose className="max-w-none">
        <p>Body</p>
      </Prose>,
    );

    const prose = container.firstElementChild!;
    expect(prose).toHaveClass("max-w-none");
    expect(prose).not.toHaveClass("max-w-[72ch]");
  });

  it("renders its child element with asChild", () => {
    render(
      <Prose asChild>
        <article aria-label="Release notes">
          <p>Body</p>
        </article>
      </Prose>,
    );

    const article = screen.getByRole("article", { name: "Release notes" });
    expect(article).toHaveAttribute("data-slot", "prose");
  });

  it("accepts HTML rendered elsewhere", () => {
    render(<Prose dangerouslySetInnerHTML={{ __html: "<h2>From Markdown</h2><p>Rendered.</p>" }} />);

    expect(screen.getByRole("heading", { level: 2, name: "From Markdown" })).toBeInTheDocument();
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(
      <main>
        <h1>Guide</h1>
        <Prose>
          <h2>Section</h2>
          <p>
            Text with <strong>emphasis</strong>, <code>code</code>, and a <a href="/docs">link</a>.
          </p>
          <table>
            <thead>
              <tr>
                <th scope="col">Level</th>
                <th scope="col">Ratio</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>AA</td>
                <td>4.5:1</td>
              </tr>
            </tbody>
          </table>
          <blockquote>A quoted line.</blockquote>
        </Prose>
      </main>,
    );

    await expectNoA11yViolations(container);
  });
});
