"use client";

import { useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const notifications = [
  { id: "product", label: "Product updates", description: "New components and releases." },
  { id: "security", label: "Security alerts", description: "Sign-ins and permission changes." },
  { id: "billing", label: "Billing receipts", description: "Invoices and payment confirmations." },
];

export function CheckboxExample() {
  const [selected, setSelected] = useState<string[]>(["product", "security"]);

  function toggle(id: string, checked: boolean) {
    setSelected((current) =>
      checked ? [...current, id] : current.filter((item) => item !== id),
    );
  }

  return (
    <fieldset className="flex max-w-md flex-col gap-3">
      <legend className="mb-1 text-sm font-medium text-foreground">Email notifications</legend>
      {notifications.map((item) => (
        <div key={item.id} className="flex items-start gap-3">
          <Checkbox
            id={`checkbox-${item.id}`}
            checked={selected.includes(item.id)}
            onCheckedChange={(checked) => toggle(item.id, checked === true)}
            className="mt-0.5"
          />
          <div className="flex flex-col gap-0.5">
            <Label htmlFor={`checkbox-${item.id}`} className="font-normal">
              {item.label}
            </Label>
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </div>
        </div>
      ))}
    </fieldset>
  );
}
