"use client";

import { useState } from "react";

import { Slider } from "@/components/ui/slider";

export function SliderExample() {
  const [budget, setBudget] = useState([2400]);
  const [threshold, setThreshold] = useState([65]);

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <div>
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <span className="text-sm font-medium text-foreground">Monthly budget</span>
          <span className="text-sm tabular-nums text-muted-foreground">
            ${budget[0]?.toLocaleString("en-US")}
          </span>
        </div>
        <Slider
          label="Monthly budget"
          min={500}
          max={5000}
          step={100}
          value={budget}
          onValueChange={setBudget}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Arrow keys move in $100 steps. Home and End jump to the range edges.
        </p>
      </div>

      <div>
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <span className="text-sm font-medium text-foreground">Alert threshold</span>
          <span className="text-sm tabular-nums text-muted-foreground">{threshold[0]}%</span>
        </div>
        <Slider
          label="Alert threshold"
          value={threshold}
          onValueChange={setThreshold}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          Warn me when usage passes {threshold[0]}% of the budget.
        </p>
      </div>
    </div>
  );
}
