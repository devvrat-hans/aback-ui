import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { Avatar, AvatarFallback, AvatarGroup } from "./avatar.js";

describe("Avatar", () => {
  it("renders fallback initials", () => {
    render(
      <Avatar>
        <AvatarFallback>AH</AvatarFallback>
      </Avatar>,
    );
    expect(screen.getByText("AH")).toBeInTheDocument();
  });

  it("applies the requested size", () => {
    const { container } = render(
      <Avatar size="xl" data-testid="avatar">
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>,
    );
    expect(container.querySelector("[data-slot='avatar']")).toHaveAttribute("data-size", "xl");
  });

  it("collapses extra avatars into a counted overflow", () => {
    render(
      <AvatarGroup aria-label="Reviewers" max={2}>
        <Avatar>
          <AvatarFallback>AR</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>BK</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarFallback>CW</AvatarFallback>
        </Avatar>
      </AvatarGroup>,
    );

    const group = screen.getByRole("group", { name: "Reviewers" });
    expect(group).toHaveTextContent("AR");
    expect(group).not.toHaveTextContent("CW");
    expect(screen.getByText("and 1 more")).toBeInTheDocument();
  });

  it("counts people beyond the rendered avatars with total", () => {
    render(
      <AvatarGroup aria-label="Founders" total={40}>
        <Avatar>
          <AvatarFallback>AR</AvatarFallback>
        </Avatar>
      </AvatarGroup>,
    );
    expect(screen.getByText("and 39 more")).toBeInTheDocument();
  });

  it("has no detectable accessibility violations", async () => {
    const { container } = render(
      <div>
        <Avatar>
          <AvatarFallback aria-label="Aback Group">AG</AvatarFallback>
        </Avatar>
      </div>,
    );
    await expectNoA11yViolations(container);
  });
});
