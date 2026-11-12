import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { expectNoA11yViolations } from "../test-utils/axe.js";
import { Field } from "./field.js";
import {
  Listbox,
  ListboxContent,
  ListboxGroup,
  ListboxItem,
  ListboxLabel,
  ListboxSeparator,
  ListboxTrigger,
  ListboxValue,
} from "./listbox.js";

function Example(props: Partial<React.ComponentProps<typeof Listbox>>) {
  return (
    <Listbox aria-label="Plan" {...props}>
      <ListboxTrigger>
        <ListboxValue placeholder="Choose a plan" />
      </ListboxTrigger>
      <ListboxContent>
        <ListboxGroup>
          <ListboxLabel>Self serve</ListboxLabel>
          <ListboxItem value="starter">Starter</ListboxItem>
          <ListboxItem value="launch">Launch</ListboxItem>
        </ListboxGroup>
        <ListboxSeparator />
        <ListboxItem value="scale" disabled>
          Scale
        </ListboxItem>
      </ListboxContent>
    </Listbox>
  );
}

describe("Listbox", () => {
  it("shows the placeholder on a named, collapsed trigger", () => {
    render(<Example />);

    const trigger = screen.getByRole("combobox", { name: "Plan" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveTextContent("Choose a plan");
    expect(trigger).toHaveAttribute("data-placeholder");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("opens, lists grouped options, and selects one", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Example onValueChange={onValueChange} />);

    await user.click(screen.getByRole("combobox", { name: "Plan" }));

    const listbox = await screen.findByRole("listbox");
    expect(within(listbox).getByRole("group", { name: "Self serve" })).toBeInTheDocument();
    expect(within(listbox).getAllByRole("option")).toHaveLength(3);
    expect(within(listbox).getByRole("option", { name: "Scale" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    await user.click(within(listbox).getByRole("option", { name: "Launch" }));

    expect(onValueChange).toHaveBeenCalledWith("launch");
    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
    expect(screen.getByRole("combobox", { name: "Plan" })).toHaveTextContent("Launch");
  });

  it("is operable from the keyboard and marks the chosen option", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Example defaultValue="starter" onValueChange={onValueChange} />);

    await user.tab();
    const trigger = screen.getByRole("combobox", { name: "Plan" });
    expect(trigger).toHaveFocus();

    await user.keyboard("{Enter}");
    const listbox = await screen.findByRole("listbox");
    expect(within(listbox).getByRole("option", { name: "Starter" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    await user.keyboard("{ArrowDown}{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("launch");
    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });

  it("closes with Escape without changing the value", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Example defaultValue="starter" onValueChange={onValueChange} />);

    await user.click(screen.getByRole("combobox", { name: "Plan" }));
    await screen.findByRole("listbox");
    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    });
    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.getByRole("combobox", { name: "Plan" })).toHaveTextContent("Starter");
  });

  it("does not open while disabled", async () => {
    const user = userEvent.setup();
    render(<Example disabled />);

    const trigger = screen.getByRole("combobox", { name: "Plan" });
    expect(trigger).toBeDisabled();
    await user.click(trigger);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("takes its label, hint, and error from a Field", () => {
    render(
      <Field label="Data region" description="Where new records are stored." error="Choose a region." required>
        <Listbox>
          <ListboxTrigger>
            <ListboxValue placeholder="Choose a region" />
          </ListboxTrigger>
          <ListboxContent>
            <ListboxItem value="eu">European Union</ListboxItem>
          </ListboxContent>
        </Listbox>
      </Field>,
    );

    const trigger = screen.getByRole("combobox", { name: /Data region/ });
    expect(trigger).toHaveAccessibleDescription("Where new records are stored. Choose a region.");
    expect(trigger).toHaveAttribute("aria-invalid", "true");
    expect(trigger).toHaveAttribute("aria-required", "true");
  });

  it("submits its value with a native form", () => {
    const { container } = render(
      <form>
        <Example name="plan" defaultValue="launch" />
      </form>,
    );

    const form = container.querySelector("form")!;
    expect(new FormData(form).get("plan")).toBe("launch");
  });

  it("has no detectable accessibility violations when closed", async () => {
    const { container } = render(<Example defaultValue="starter" />);
    await expectNoA11yViolations(container);
  });

  it("has no detectable accessibility violations when open", async () => {
    const user = userEvent.setup();
    render(<Example defaultValue="starter" />);

    await user.click(screen.getByRole("combobox", { name: "Plan" }));
    const listbox = await screen.findByRole("listbox");
    await expectNoA11yViolations(listbox);
  });
});
