import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { Pagination, getPageItems } from "./pagination.js";

describe("Pagination", () => {
  it("marks the current page and calls onPageChange", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(<Pagination page={2} pageCount={5} onPageChange={onPageChange} />);

    expect(screen.getByText("2")).toHaveAttribute("aria-current", "page");
    await user.click(screen.getByRole("button", { name: "Next" }));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("renders links when hrefFor is provided", () => {
    render(<Pagination page={2} pageCount={4} hrefFor={(page) => `/items?page=${page}`} />);
    expect(screen.getByRole("link", { name: "Go to page 3" })).toHaveAttribute(
      "href",
      "/items?page=3",
    );
  });

  it("does not offer a previous page at the start", () => {
    render(<Pagination page={1} pageCount={3} />);
    expect(screen.queryByRole("button", { name: "Previous" })).not.toBeInTheDocument();
    expect(screen.getByText("Previous")).toHaveAttribute("aria-disabled", "true");
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(<Pagination page={4} pageCount={12} />);
    await expectNoA11yViolations(container);
  });
});

describe("getPageItems", () => {
  it("collapses long ranges around the current page", () => {
    expect(getPageItems(6, 12)).toEqual([1, "ellipsis", 5, 6, 7, "ellipsis", 12]);
  });

  it("shows every page when the range is small", () => {
    expect(getPageItems(2, 5)).toEqual([1, 2, 3, 4, 5]);
  });
});
