"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/actions/auth";
import { FormField } from "@/components/shared/form-field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const initialState: LoginState = {};

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="grid gap-4">
      <input type="hidden" name="next" value={next} />
      <FormField label="Email" htmlFor="login-email">
        <Input id="login-email" name="email" type="email" required autoComplete="username" />
      </FormField>
      <FormField label="Password" htmlFor="login-password">
        <Input id="login-password" name="password" type="password" required autoComplete="current-password" />
      </FormField>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" size="lg" disabled={isPending} className="mt-2 rounded-full">
        {isPending ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
