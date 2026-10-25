import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "./command.js";

function Example({ onRun }: { onRun?: (value: string) => void }) {
  return (
    <Command label="Command menu">
      <CommandInput placeholder="Search commands" />
      <CommandList>
        <CommandEmpty>No commands found.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem value="save" onSelect={() => onRun?.("save")}>
            Save changes
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
          <CommandItem value="deploy" onSelect={() => onRun?.("deploy")}>
            Deploy
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

describe("Command", () => {
  it("names the input from the command label", () => {
    render(<Example />);
    expect(screen.getByRole("combobox", { name: "Command menu" })).toBeInTheDocument();
  });

  it("filters results and runs the keyboard-selected item", async () => {
    const user = userEvent.setup();
    const onRun = vi.fn();
    render(<Example onRun={onRun} />);

    await user.type(screen.getByRole("combobox", { name: "Command menu" }), "deploy");
    await user.keyboard("{ArrowDown}{Enter}");

    expect(onRun).toHaveBeenCalledWith("deploy");
  });

  it("shows an empty state when nothing matches", async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.type(screen.getByRole("combobox", { name: "Command menu" }), "zzz");
    expect(await screen.findByText("No commands found.")).toBeInTheDocument();
  });

  it("has no detectable accessibility violations", async () => {
    render(<Example />);
    await expectNoA11yViolations(document.body);
  });
});

describe("CommandDialog", () => {
  it("opens with an accessible name and closes with Escape", async () => {
    const user = userEvent.setup();
    render(
      <CommandDialog defaultOpen>
        <CommandInput placeholder="Search" />
        <CommandList>
          <CommandGroup heading="Actions">
            <CommandItem>Deploy</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>,
    );

    const dialog = await screen.findByRole("dialog", { name: "Command palette" });
    expect(dialog).toHaveAccessibleDescription("Search for a command to run.");

    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
