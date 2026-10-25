import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import {
  DescriptionList,
  DescriptionListDetails,
  DescriptionListItem,
  DescriptionListTerm,
} from "./description-list.js";

function Breakdown() {
  return (
    <DescriptionList aria-label="Invoice breakdown">
      <DescriptionListItem>
        <DescriptionListTerm>Subtotal</DescriptionListTerm>
        <DescriptionListDetails>$120.00</DescriptionListDetails>
      </DescriptionListItem>
      <DescriptionListItem>
        <DescriptionListTerm>Discount</DescriptionListTerm>
        <DescriptionListDetails tone="success">-$12.00</DescriptionListDetails>
      </DescriptionListItem>
      <DescriptionListItem emphasis>
        <DescriptionListTerm>Total</DescriptionListTerm>
        <DescriptionListDetails>$108.00</DescriptionListDetails>
      </DescriptionListItem>
    </DescriptionList>
  );
}

describe("DescriptionList", () => {
  it("renders terms and details in a description list", () => {
    const { container } = render(<Breakdown />);
    expect(container.querySelector("dl")).toBeInTheDocument();
    expect(container.querySelectorAll("dt")).toHaveLength(3);
    expect(container.querySelectorAll("dd")).toHaveLength(3);
  });

  it("applies tone and emphasis to the right parts", () => {
    const { container } = render(<Breakdown />);
    expect(screen.getByText("-$12.00")).toHaveClass("text-success");
    expect(container.querySelector("[data-emphasis]")).toHaveClass("font-semibold");
  });

  it("can drop the outer border and use mono terms", () => {
    const { container } = render(
      <DescriptionList bordered={false}>
        <DescriptionListItem>
          <DescriptionListTerm mono>content-type</DescriptionListTerm>
          <DescriptionListDetails>text/html</DescriptionListDetails>
        </DescriptionListItem>
      </DescriptionList>,
    );
    expect(container.querySelector("dl")).not.toHaveClass("border");
    expect(screen.getByText("content-type")).toHaveClass("font-mono");
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(<Breakdown />);
    await expectNoA11yViolations(container);
  });
});
