import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table.js";

function Example() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Component</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Button</TableCell>
          <TableCell>Stable</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Card</TableCell>
          <TableCell>Beta</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

describe("Table", () => {
  it("renders a table with column headers scoped to columns", () => {
    render(<Example />);

    const columnHeaders = screen.getAllByRole("columnheader");
    expect(columnHeaders).toHaveLength(2);
    for (const header of columnHeaders) {
      expect(header).toHaveAttribute("scope", "col");
    }
  });

  it("renders body rows and cells", () => {
    render(<Example />);

    expect(screen.getAllByRole("row")).toHaveLength(3);
    expect(screen.getByRole("cell", { name: "Button" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Stable" })).toBeInTheDocument();
  });

  it("makes the scroll container keyboard focusable by default", () => {
    const { container } = render(<Example />);

    const scrollContainer = container.querySelector("[data-slot='table-container']");
    expect(scrollContainer).toHaveAttribute("tabindex", "0");
  });

  it("lets the consumer override the container tabindex", () => {
    const { container } = render(
      <Table containerProps={{ tabIndex: -1 }}>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
      </Table>,
    );

    expect(container.querySelector("[data-slot='table-container']")).toHaveAttribute(
      "tabindex",
      "-1",
    );
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(<Example />);

    await expectNoA11yViolations(container);
  });
});
