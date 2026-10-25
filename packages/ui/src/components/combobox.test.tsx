import * as React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { Combobox, type ComboboxOption } from "./combobox.js";

const OPTIONS: ComboboxOption[] = [
  { value: "next", label: "Next.js", description: "React framework" },
  { value: "remix", label: "Remix", description: "Web framework" },
  { value: "sveltekit", label: "SvelteKit", description: "Svelte framework" },
  { value: "astro", label: "Astro", description: "Content sites" },
];

function trigger() {
  return screen.getByRole("button", { name: "Framework" });
}

function search() {
  return screen.getByRole("combobox", { name: "Framework" });
}

describe("Combobox", () => {
  it("selects an option and shows its label", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    function Example() {
      const [value, setValue] = React.useState<string | undefined>();
      return (
        <Combobox
          aria-label="Framework"
          options={OPTIONS}
          value={value}
          onValueChange={(next) => {
            setValue(next);
            onValueChange(next);
          }}
        />
      );
    }

    render(<Example />);
    expect(trigger()).toHaveTextContent("Select an option");

    await user.click(trigger());
    await user.click(await screen.findByRole("option", { name: /SvelteKit/ }));

    expect(onValueChange).toHaveBeenCalledWith("sveltekit");
    expect(trigger()).toHaveTextContent("SvelteKit");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("filters by label and keywords", async () => {
    const user = userEvent.setup();
    render(
      <Combobox
        aria-label="Framework"
        options={[...OPTIONS, { value: "qwik", label: "Qwik", keywords: ["resumable"] }]}
      />,
    );

    await user.click(trigger());
    await user.type(search(), "resumable");

    expect(await screen.findByRole("option", { name: /Qwik/ })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /Astro/ })).not.toBeInTheDocument();
  });

  it("shows an empty state when nothing matches", async () => {
    const user = userEvent.setup();
    render(
      <Combobox aria-label="Framework" options={OPTIONS} emptyMessage="Nothing here." />,
    );

    await user.click(trigger());
    await user.type(search(), "zzz");
    expect(await screen.findByText("Nothing here.")).toBeInTheDocument();
  });

  it("moves through options with the arrow keys", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Combobox aria-label="Framework" options={OPTIONS} onValueChange={onValueChange} />,
    );

    await user.click(trigger());
    // The first option is active as soon as the list opens, so one arrow moves
    // to the second option and Enter commits it.
    await user.keyboard("{ArrowDown}{Enter}");

    expect(onValueChange).toHaveBeenCalledWith("remix");
  });

  it("closes with Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<Combobox aria-label="Framework" options={OPTIONS} />);

    await user.click(trigger());
    await screen.findByRole("dialog", { name: "Framework" });
    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(trigger()).toHaveFocus();
  });

  it("has no detectable accessibility violations while open", async () => {
    const user = userEvent.setup();
    render(<Combobox aria-label="Framework" options={OPTIONS} />);
    await user.click(trigger());
    const dialog = await screen.findByRole("dialog", { name: "Framework" });
    await expectNoA11yViolations(dialog);
  });
});
