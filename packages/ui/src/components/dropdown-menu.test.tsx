import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./button.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu.js";

function Example({ onSelect }: { onSelect: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Project</DropdownMenuLabel>
        <DropdownMenuItem onSelect={onSelect}>Duplicate</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Delete project</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

describe("DropdownMenu", () => {
  it("opens with a labelled menu and selects an item", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<Example onSelect={onSelect} />);

    await user.click(screen.getByRole("button", { name: "Open menu" }));

    const menu = await screen.findByRole("menu");
    expect(menu).toBeInTheDocument();
    expect(screen.getByText("Project")).toBeInTheDocument();

    await user.click(screen.getByRole("menuitem", { name: "Duplicate" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("closes with Escape", async () => {
    const user = userEvent.setup();
    render(<Example onSelect={() => {}} />);

    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await screen.findByRole("menu");

    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    });
  });
});
