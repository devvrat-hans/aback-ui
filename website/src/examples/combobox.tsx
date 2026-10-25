"use client";

import { useState } from "react";

import { Combobox, type ComboboxOption } from "@/components/ui/combobox";

const reviewers: ComboboxOption[] = [
  { value: "ada", label: "Ada Lovelace", description: "Platform" },
  { value: "grace", label: "Grace Hopper", description: "Infrastructure" },
  { value: "alan", label: "Alan Turing", description: "Security" },
  { value: "katherine", label: "Katherine Johnson", description: "Data" },
  { value: "linus", label: "Linus Torvalds", description: "Tooling", disabled: true },
];

export function ComboboxExample() {
  const [reviewer, setReviewer] = useState<string | undefined>("grace");
  const selected = reviewers.find((option) => option.value === reviewer);

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <span id="reviewer-label" className="text-xs font-medium text-foreground">
        Review owner
      </span>
      <Combobox
        id="reviewer"
        options={reviewers}
        value={reviewer}
        onValueChange={setReviewer}
        placeholder="Choose a reviewer"
        searchPlaceholder="Search people…"
        emptyMessage="No one matches that search."
        aria-labelledby="reviewer-label"
      />
      <p className="text-xs text-muted-foreground" aria-live="polite">
        {selected ? `${selected.label} · ${selected.description}` : "No reviewer assigned"}
      </p>
    </div>
  );
}
