import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { Container, Grid, Group, Stack } from "./layout.js";

describe("layout primitives", () => {
  it("maps props to literal Tailwind classes", () => {
    const { container } = render(
      <Container size="md">
        <Stack gap="lg">
          <Group gap="xs" justify="between" align="start" wrap={false}>
            <span>a</span>
          </Group>
          <Grid columns={4} gap="sm">
            <span>b</span>
          </Grid>
        </Stack>
      </Container>,
    );

    expect(container.querySelector("[data-slot='container']")).toHaveClass("max-w-4xl", "px-4", "md:px-6");
    expect(container.querySelector("[data-slot='stack']")).toHaveClass("flex-col", "gap-6");
    const group = container.querySelector("[data-slot='group']");
    expect(group).toHaveClass("gap-1", "justify-between", "items-start");
    expect(group).not.toHaveClass("flex-wrap");
    expect(container.querySelector("[data-slot='grid']")).toHaveClass("lg:grid-cols-4", "gap-2");
  });

  it("renders the child element with asChild", () => {
    render(
      <Container asChild>
        <main aria-label="Content">Page</main>
      </Container>,
    );
    const main = screen.getByRole("main", { name: "Content" });
    expect(main).toHaveAttribute("data-slot", "container");
    expect(main).toHaveClass("mx-auto");
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(
      <Stack>
        <Group>
          <button type="button">Save</button>
        </Group>
      </Stack>,
    );
    await expectNoA11yViolations(container);
  });
});
