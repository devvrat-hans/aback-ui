"use client";

import { useId, useState, type FormEvent, type ReactNode } from "react";
import { IconAlertCircle, IconCircleCheck, IconMail } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export interface NewsletterResult {
  ok: boolean;
  /** Shown to the visitor. Say what happens next, such as "Check your inbox to confirm." */
  message: string;
}

export interface NewsletterBlockProps {
  title?: ReactNode;
  description?: ReactNode;
  /** Your subscribe call. The block shows its result and never claims success on its own. */
  onSubscribe: (email: string) => Promise<NewsletterResult>;
  buttonLabel?: string;
  /** What you send and how to leave, shown under the form. */
  consent?: ReactNode;
  /** "card" is a bordered panel; "inline" sits in a sidebar or footer. */
  variant?: "card" | "inline";
}

type Status = { state: "idle" } | { state: "submitting" } | { state: "done"; result: NewsletterResult };

/**
 * An email signup with real submission states. It validates with the
 * browser's email type, disables itself while submitting, and announces the
 * result your `onSubscribe` returns.
 */
export function NewsletterBlock({
  title = "Get product updates",
  description = "One email when something ships. No tracking pixels.",
  onSubscribe,
  buttonLabel = "Subscribe",
  consent,
  variant = "card",
}: NewsletterBlockProps) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const submitting = status.state === "submitting";
  const result = status.state === "done" ? status.result : null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ state: "submitting" });
    try {
      const outcome = await onSubscribe(email.trim());
      setStatus({ state: "done", result: outcome });
      if (outcome.ok) setEmail("");
    } catch {
      setStatus({
        state: "done",
        result: { ok: false, message: "Something went wrong. Try again in a moment." },
      });
    }
  }

  return (
    <section
      aria-labelledby={`${id}-title`}
      className={cn(
        "flex flex-col gap-4",
        variant === "card" && "border border-border bg-card p-6 sm:p-8",
      )}
    >
      <div className="flex flex-col gap-1.5">
        <h2 id={`${id}-title`} className={cn("font-semibold text-foreground", variant === "card" ? "text-xl" : "text-sm")}>
          {title}
        </h2>
        {description ? (
          <p className={cn("text-muted-foreground", variant === "card" ? "text-sm" : "text-xs")}>{description}</p>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor={`${id}-email`} className="sr-only">
          Email address
        </label>
        <InputGroup className="flex-1">
          <InputGroupAddon variant="inline">
            <IconMail aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            id={`${id}-email`}
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            placeholder="you@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={submitting}
            aria-invalid={result && !result.ok ? true : undefined}
            aria-describedby={result ? `${id}-result` : undefined}
          />
        </InputGroup>
        <Button type="submit" disabled={submitting} className="sm:w-auto">
          {submitting ? <Spinner aria-hidden="true" size="sm" className="text-current" /> : null}
          {submitting ? "Subscribing" : buttonLabel}
        </Button>
      </form>

      <div role="status" id={`${id}-result`}>
        {result ? (
          <p
            className={cn(
              "flex items-start gap-2 border p-3 text-sm",
              result.ok
                ? "border-success/30 bg-success-soft text-success-strong"
                : "border-danger/30 bg-danger-soft text-danger-strong",
            )}
          >
            {result.ok ? (
              <IconCircleCheck aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            ) : (
              <IconAlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            )}
            {result.message}
          </p>
        ) : null}
      </div>

      {consent ? <p className="text-xs leading-relaxed text-muted-foreground">{consent}</p> : null}
    </section>
  );
}
