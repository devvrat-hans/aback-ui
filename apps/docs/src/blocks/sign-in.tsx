"use client";

import { useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface SignInValues {
  email: string;
  password: string;
  remember: boolean;
}

export interface SignInBlockProps {
  onSubmit?: (values: SignInValues) => void;
  signUpHref?: string;
  forgotHref?: string;
  title?: string;
  description?: string;
}

/**
 * A complete sign-in card. It owns no authentication: pass `onSubmit` to call
 * your auth client, and swap the anchors for your router's link component.
 */
export function SignInBlock({
  onSubmit,
  signUpHref = "#",
  forgotHref = "#",
  title = "Sign in",
  description = "Use the email you signed up with to continue to your workspace.",
}: SignInBlockProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit?.({ email, password, remember });
  }

  return (
    <section aria-labelledby="sign-in-title" className="mx-auto w-full max-w-sm">
      <div
        aria-hidden="true"
        className="mb-6 flex size-9 items-center justify-center bg-primary text-sm font-bold text-primary-foreground"
      >
        A
      </div>

      <Card>
        <CardHeader>
          <CardTitle as="h2" id="sign-in-title" className="text-xl">
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field htmlFor="sign-in-email" label="Email" required>
              <Input
                id="sign-in-email"
                name="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="you@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </Field>

            <Field htmlFor="sign-in-password" label="Password" required>
              <Input
                id="sign-in-password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </Field>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="sign-in-remember"
                  name="remember"
                  checked={remember}
                  onCheckedChange={(checked) => setRemember(checked === true)}
                />
                <Label htmlFor="sign-in-remember" className="font-normal">
                  Remember me
                </Label>
              </div>
              <a
                href={forgotHref}
                className="text-xs font-medium text-link underline-offset-4 hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <Button type="submit" className="w-full">
              Sign in
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center border-t border-border pt-4 text-sm text-muted-foreground">
          New to Aback?{" "}
          <a
            href={signUpHref}
            className="ml-1 font-medium text-link underline-offset-4 hover:underline"
          >
            Create an account
          </a>
        </CardFooter>
      </Card>
    </section>
  );
}
