"use client";

import { type ReactNode, useId, useState } from "react";
import { IconCheck, IconMinus } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

export type BillingPeriod = "monthly" | "yearly";

export interface PricingFeature {
  text: string;
  included: boolean;
}

export interface PricingPlan {
  name: string;
  description: string;
  /** Price per month for each period, in the currency's main unit. 0 renders as Free. */
  price: Record<BillingPeriod, number>;
  features: PricingFeature[];
  cta: { label: string; href: string };
  /** Highlights the plan and shows the badge. */
  highlighted?: boolean;
  badge?: string;
}

export interface PricingBlockProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  plans: PricingPlan[];
  /** ISO 4217 code for Intl.NumberFormat. */
  currency?: string;
  locale?: string;
  defaultPeriod?: BillingPeriod;
  /** Label for the yearly option, such as "Yearly, save 20%". Keep the saving accurate. */
  yearlyLabel?: string;
  /** A sentence under the plans: taxes, trials, or refunds. */
  footnote?: ReactNode;
}

/**
 * Plan cards with a monthly or yearly switch. Prices are formatted with Intl,
 * features list what is and is not included in words, and every card's call
 * to action lines up on one baseline.
 */
export function PricingBlock({
  eyebrow,
  title,
  description,
  plans,
  currency = "USD",
  locale = "en-US",
  defaultPeriod = "monthly",
  yearlyLabel = "Yearly",
  footnote,
}: PricingBlockProps) {
  const headingId = useId();
  const [period, setPeriod] = useState<BillingPeriod>(defaultPeriod);
  const format = new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

  return (
    <section aria-labelledby={headingId} className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 lg:py-20">
      <SectionHeading
        align="center"
        eyebrow={eyebrow}
        title={title}
        description={description}
        headingId={headingId}
      />

      <div className="mt-8 flex justify-center">
        <ToggleGroup
          type="single"
          variant="outline"
          aria-label="Billing period"
          value={period}
          onValueChange={(value) => {
            if (value === "monthly" || value === "yearly") setPeriod(value);
          }}
        >
          <ToggleGroupItem value="monthly">Monthly</ToggleGroupItem>
          <ToggleGroupItem value="yearly">{yearlyLabel}</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <ul className={cn("mt-10 grid gap-6", plans.length >= 3 ? "lg:grid-cols-3" : "md:grid-cols-2")}>
        {plans.map((plan) => {
          const amount = plan.price[period];
          return (
            <li
              key={plan.name}
              className={cn(
                "relative flex flex-col border p-6 sm:p-8",
                plan.highlighted ? "border-primary-500 bg-brand-wash" : "border-border bg-card",
              )}
            >
              {plan.badge ? (
                <Badge variant={plan.highlighted ? "brand" : "outline"} className="absolute -top-3 left-6">
                  {plan.badge}
                </Badge>
              ) : null}
              <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
              <p className="mt-2 min-h-10 text-sm text-muted-foreground">{plan.description}</p>

              <p className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tight tabular-nums text-foreground">
                  {amount === 0 ? "Free" : format.format(amount)}
                </span>
                {amount === 0 ? null : (
                  <span className="text-sm text-muted-foreground">
                    per month{period === "yearly" ? ", billed yearly" : ""}
                  </span>
                )}
              </p>

              <ul className="mt-8 flex flex-1 flex-col gap-3" aria-label={`${plan.name} features`}>
                {plan.features.map((feature) => (
                  <li key={feature.text} className="flex items-start gap-3 text-sm">
                    {feature.included ? (
                      <IconCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-icon" />
                    ) : (
                      <IconMinus aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    )}
                    <span className={feature.included ? "text-foreground" : "text-muted-foreground"}>
                      {feature.included ? null : <span className="sr-only">Not included: </span>}
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Button asChild size="lg" variant={plan.highlighted ? "default" : "outline"} className="mt-8 w-full">
                <a href={plan.cta.href}>
                  {plan.cta.label}
                  <span className="sr-only">, {plan.name} plan</span>
                </a>
              </Button>
            </li>
          );
        })}
      </ul>

      {footnote ? <p className="mt-6 text-center text-xs text-muted-foreground">{footnote}</p> : null}
    </section>
  );
}
