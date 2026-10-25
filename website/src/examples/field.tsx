"use client";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

export function FieldExample() {
  return (
    <div className="flex max-w-md flex-col gap-6">
      <Field
        htmlFor="example-workspace"
        label="Workspace name"
        description="Visible to everyone on your team."
        required
      >
        <Input id="example-workspace" placeholder="Aback Group" />
      </Field>

      <Field
        htmlFor="example-region"
        label="Data region"
        description="Choose where new records are stored."
      >
        <Select id="example-region" defaultValue="eu">
          <option value="us">United States</option>
          <option value="eu">European Union</option>
          <option value="ap">Asia Pacific</option>
        </Select>
      </Field>

      <Field
        htmlFor="example-domain"
        label="Custom domain"
        error="This domain is already connected to another workspace."
      >
        <Input
          id="example-domain"
          defaultValue="abacktools.com"
          aria-invalid="true"
          aria-describedby="example-domain-error"
        />
      </Field>
    </div>
  );
}
