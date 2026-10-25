"use client";

import { useState } from "react";

import { Rating } from "@/components/ui/rating";

export function RatingExample() {
  const [value, setValue] = useState(0);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span id="rating-label" className="text-sm font-medium text-foreground">
          How useful was this page?{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </span>
        <Rating
          aria-labelledby="rating-label"
          name="usefulness"
          value={value}
          onValueChange={setValue}
          clearable
          size="lg"
        />
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {value ? `You rated it ${value} out of 5. Press the same star to clear.` : "Not rated yet."}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Rating readOnly value={4.6} size="sm" />
        <span className="text-sm font-semibold tabular-nums">4.6</span>
        <span className="text-xs text-muted-foreground">from 128 example reviews</span>
      </div>

      <Rating aria-label="Rating unavailable" defaultValue={3} disabled />
    </div>
  );
}
