"use client";

import { type FormEvent, useId, useRef, useState } from "react";
import { IconCircleCheck } from "@tabler/icons-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

export interface ContactValues {
  name: string;
  email: string;
  topic: string;
  message: string;
}

export interface ContactResult {
  ok: boolean;
  /** Shown after submission: when you reply, or what went wrong. */
  message: string;
}

export interface ContactFormBlockProps {
  /** Send the message. Validate again on the server; this form only checks the shape. */
  onSubmit: (values: ContactValues) => Promise<ContactResult>;
  topics?: { value: string; label: string }[];
  title?: string;
  description?: string;
  maxLength?: number;
}

type Errors = Partial<Record<keyof ContactValues, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: ContactValues, maxLength: number): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Enter your name.";
  if (!values.email.trim()) errors.email = "Enter your email address.";
  else if (!EMAIL.test(values.email.trim())) errors.email = "Enter an email address like you@company.com.";
  if (!values.topic) errors.topic = "Choose what your message is about.";
  if (values.message.trim().length < 10) errors.message = "Write at least 10 characters.";
  else if (values.message.length > maxLength) errors.message = `Keep it under ${maxLength} characters.`;
  return errors;
}

const FIELD_ORDER: (keyof ContactValues)[] = ["name", "email", "topic", "message"];

/**
 * A contact form with field-level errors, a character count, and real
 * submission states. On an invalid submit it focuses the first field with an
 * error; on success it replaces the form with your confirmation.
 */
export function ContactFormBlock({
  onSubmit,
  topics = [
    { value: "support", label: "Product support" },
    { value: "sales", label: "Sales and pricing" },
    { value: "press", label: "Press" },
    { value: "other", label: "Something else" },
  ],
  title = "Contact us",
  description = "We reply within two working days.",
  maxLength = 2000,
}: ContactFormBlockProps) {
  const headingId = useId();
  const [values, setValues] = useState<ContactValues>({ name: "", email: "", topic: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ContactResult | null>(null);
  const form = useRef<HTMLFormElement>(null);

  function update<K extends keyof ContactValues>(key: K, value: ContactValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(values, maxLength);
    setErrors(found);
    const first = FIELD_ORDER.find((key) => found[key]);
    if (first) {
      form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setSubmitting(true);
    setResult(null);
    try {
      setResult(await onSubmit({ ...values, name: values.name.trim(), email: values.email.trim() }));
    } catch {
      setResult({ ok: false, message: "Your message could not be sent. Try again in a moment." });
    } finally {
      setSubmitting(false);
    }
  }

  const describedBy = (key: keyof ContactValues, extra?: string) =>
    [errors[key] ? `contact-${key}-error` : null, extra].filter(Boolean).join(" ") || undefined;

  if (result?.ok) {
    return (
      <section aria-labelledby={headingId} className="mx-auto w-full max-w-xl px-4 py-12 md:px-6">
        <div role="status" className="flex flex-col items-center gap-3 border border-border bg-card p-8 text-center">
          <span aria-hidden="true" className="flex size-12 items-center justify-center bg-success-soft text-success">
            <IconCircleCheck className="size-6" />
          </span>
          <h2 id={headingId} className="text-xl font-semibold text-foreground">
            Message sent
          </h2>
          <p className="text-sm text-muted-foreground">{result.message}</p>
          <Button variant="outline" size="sm" onClick={() => {
            setValues({ name: "", email: "", topic: "", message: "" });
            setResult(null);
          }}>
            Send another message
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby={headingId} className="mx-auto w-full max-w-xl px-4 py-12 md:px-6">
      <div className="mb-6 flex flex-col gap-1.5">
        <h2 id={headingId} className="text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <form ref={form} onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field htmlFor="contact-name" label="Name" required error={errors.name}>
            <Input
              id="contact-name"
              name="name"
              autoComplete="name"
              value={values.name}
              onChange={(event) => update("name", event.target.value)}
              aria-invalid={errors.name ? true : undefined}
              aria-describedby={describedBy("name")}
              required
            />
          </Field>
          <Field htmlFor="contact-email" label="Email" required error={errors.email}>
            <Input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={values.email}
              onChange={(event) => update("email", event.target.value)}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={describedBy("email")}
              required
            />
          </Field>
        </div>

        <Field htmlFor="contact-topic" label="Topic" required error={errors.topic}>
          <Select
            id="contact-topic"
            name="topic"
            value={values.topic}
            onChange={(event) => update("topic", event.target.value)}
            aria-invalid={errors.topic ? true : undefined}
            aria-describedby={describedBy("topic")}
            required
          >
            <option value="" disabled>
              Choose a topic
            </option>
            {topics.map((topic) => (
              <option key={topic.value} value={topic.value}>
                {topic.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          htmlFor="contact-message"
          label="Message"
          required
          error={errors.message}
          description={`${values.message.length} of ${maxLength} characters`}
        >
          <Textarea
            id="contact-message"
            name="message"
            rows={6}
            value={values.message}
            onChange={(event) => update("message", event.target.value)}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={describedBy("message", "contact-message-description")}
            required
          />
        </Field>

        {result && !result.ok ? (
          <Alert variant="destructive" role="alert">
            <AlertDescription>{result.message}</AlertDescription>
          </Alert>
        ) : null}

        <Button type="submit" disabled={submitting} className="self-start">
          {submitting ? <Spinner aria-hidden="true" size="sm" className="text-current" /> : null}
          {submitting ? "Sending" : "Send message"}
        </Button>
      </form>
    </section>
  );
}
