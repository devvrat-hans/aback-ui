"use client";

import { useState } from "react";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const plans = [
  { value: "starter", name: "Starter", price: "$0", detail: "One project, community support" },
  { value: "team", name: "Team", price: "$24", detail: "Unlimited projects, shared components" },
  { value: "scale", name: "Scale", price: "Custom", detail: "SSO, audit log, priority support" },
];

export function RadioGroupExample() {
  const [plan, setPlan] = useState("team");

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <RadioGroup value={plan} onValueChange={setPlan} aria-label="Plan">
        {plans.map((item) => (
          <div
            key={item.value}
            className="flex items-start gap-3 border border-border p-3 data-[selected=true]:border-primary"
            data-selected={plan === item.value}
          >
            <RadioGroupItem
              id={`plan-${item.value}`}
              value={item.value}
              className="mt-0.5"
            />
            <label htmlFor={`plan-${item.value}`} className="flex-1 cursor-pointer">
              <span className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-medium text-foreground">{item.name}</span>
                <span className="text-sm tabular-nums text-foreground">{item.price}</span>
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {item.detail}
              </span>
            </label>
          </div>
        ))}
      </RadioGroup>

      <p className="text-sm text-muted-foreground">
        Selected plan: <span className="font-medium text-foreground">{plan}</span>
      </p>
    </div>
  );
}
