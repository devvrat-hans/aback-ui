"use client";

import { useState } from "react";
import { IconSearch, IconX } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

export function InputGroupExample() {
  const [query, setQuery] = useState("dialog");

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Field htmlFor="ig-search" label="Search components">
        <InputGroup>
          <InputGroupAddon variant="inline">
            <IconSearch aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            id="ig-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Button, dialog, table"
            className="[&::-webkit-search-cancel-button]:appearance-none"
          />
          {query ? (
            <InputGroupAddon align="end" variant="inline">
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                aria-label="Clear search"
                onClick={() => setQuery("")}
              >
                <IconX aria-hidden="true" />
              </Button>
            </InputGroupAddon>
          ) : null}
        </InputGroup>
      </Field>

      <Field htmlFor="ig-price" label="Monthly price" description="Charged on the first of each month.">
        <InputGroup>
          <InputGroupAddon>$</InputGroupAddon>
          <InputGroupInput
            id="ig-price"
            inputMode="decimal"
            defaultValue="29.00"
            className="tabular-nums"
            aria-describedby="ig-price-unit ig-price-description"
          />
          <InputGroupAddon id="ig-price-unit" align="end">
            USD / month
          </InputGroupAddon>
        </InputGroup>
      </Field>

      <Field htmlFor="ig-domain" label="Custom domain" error="Use a domain name without the protocol.">
        <InputGroup>
          <InputGroupAddon>https://</InputGroupAddon>
          <InputGroupInput
            id="ig-domain"
            defaultValue="https://abacktools.com"
            aria-invalid="true"
            aria-describedby="ig-domain-error"
          />
        </InputGroup>
      </Field>
    </div>
  );
}
