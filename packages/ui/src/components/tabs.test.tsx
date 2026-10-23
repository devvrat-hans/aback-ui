import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs.js";

function Example() {
  return (
    <Tabs defaultValue="account">
      <TabsList aria-label="Settings sections">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Account settings</TabsContent>
      <TabsContent value="notifications">Notification settings</TabsContent>
      <TabsContent value="billing">Billing settings</TabsContent>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("shows the selected panel and hides the others", () => {
    render(<Example />);

    expect(screen.getByRole("tab", { name: "Account" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("Account settings")).toBeVisible();
    expect(screen.queryByText("Billing settings")).not.toBeInTheDocument();
  });

  it("moves between tabs with the arrow keys", async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.click(screen.getByRole("tab", { name: "Account" }));
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("tab", { name: "Notifications" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("Notification settings")).toBeVisible();
  });

  it("supports Home and End", async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.click(screen.getByRole("tab", { name: "Notifications" }));
    await user.keyboard("{End}");
    expect(screen.getByRole("tab", { name: "Billing" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    await user.keyboard("{Home}");
    expect(screen.getByRole("tab", { name: "Account" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });
});
