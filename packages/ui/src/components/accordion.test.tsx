import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion.js";

function Example() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="shipping">
        <AccordionTrigger>How long does shipping take?</AccordionTrigger>
        <AccordionContent>Orders ship within two business days.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="returns">
        <AccordionTrigger>What is the return window?</AccordionTrigger>
        <AccordionContent>Returns are accepted for 30 days.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

describe("Accordion", () => {
  it("exposes a button per header and starts collapsed", () => {
    render(<Example />);

    const trigger = screen.getByRole("button", { name: "How long does shipping take?" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByText("Orders ship within two business days.")).not.toBeInTheDocument();
  });

  it("opens and closes the panel with the keyboard", async () => {
    const user = userEvent.setup();
    render(<Example />);

    const trigger = screen.getByRole("button", { name: "How long does shipping take?" });
    trigger.focus();
    await user.keyboard("{Enter}");

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Orders ship within two business days.")).toBeVisible();

    await user.keyboard("{Enter}");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps one panel open in single mode", async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.click(screen.getByRole("button", { name: "How long does shipping take?" }));
    await user.click(screen.getByRole("button", { name: "What is the return window?" }));

    expect(
      screen.getByRole("button", { name: "How long does shipping take?" }),
    ).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.getByRole("button", { name: "What is the return window?" }),
    ).toHaveAttribute("aria-expanded", "true");
  });
});
