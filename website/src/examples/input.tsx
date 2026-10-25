"use client";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function InputExample() {
  return (
    <div className="flex max-w-md flex-col gap-6">
      <Field htmlFor="example-email" label="Work email" description="We only use this for receipts.">
        <Input id="example-email" type="email" placeholder="you@company.com" />
      </Field>

      <Field
        htmlFor="example-billing-email"
        label="Billing email"
        error="Enter a valid email address."
        required
      >
        <Input
          id="example-billing-email"
          type="email"
          defaultValue="not-an-email"
          aria-invalid="true"
          aria-describedby="example-billing-email-error"
        />
      </Field>

      <Field htmlFor="example-disabled" label="Workspace slug">
        <Input id="example-disabled" value="aback" disabled readOnly />
      </Field>
    </div>
  );
}
