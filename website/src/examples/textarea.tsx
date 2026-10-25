"use client";

import { Field } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

export function TextareaExample() {
  return (
    <div className="flex max-w-md flex-col gap-6">
      <Field
        htmlFor="example-notes"
        label="Release notes"
        description="Shown on the changelog after you publish."
      >
        <Textarea id="example-notes" rows={4} placeholder="Describe what changed in this release." />
      </Field>

      <Field htmlFor="example-disabled-notes" label="Internal notes">
        <Textarea id="example-disabled-notes" rows={3} disabled readOnly value="Only admins can edit this." />
      </Field>
    </div>
  );
}
