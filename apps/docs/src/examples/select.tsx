"use client";

import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";

export function SelectExample() {
  return (
    <div className="flex max-w-md flex-col gap-6">
      <Field htmlFor="select-plan" label="Plan" description="Change at any time.">
        <Select id="select-plan" defaultValue="pro">
          <option value="free">Free</option>
          <option value="pro">Pro</option>
          <option value="team">Team</option>
          <option value="enterprise">Enterprise</option>
        </Select>
      </Field>

      <Field htmlFor="select-region" label="Region">
        <Select id="select-region" defaultValue="eu">
          <option value="us">United States</option>
          <option value="eu">European Union</option>
          <option value="ap">Asia Pacific</option>
        </Select>
      </Field>

      <Field htmlFor="select-disabled" label="Workspace type">
        <Select id="select-disabled" disabled defaultValue="personal">
          <option value="personal">Personal</option>
        </Select>
      </Field>
    </div>
  );
}
