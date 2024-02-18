"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { forgotPassword } from "@/modules/auth/actions";

export const loginSchema = z.object({
  email: z.string().email({ message: "Ungültige Email" }),
});

export function ForgotPasswordForm() {
  const [loading, startTransition] = useTransition();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  });

  if (isSubmitted) {
    return (
      <p className="text-center text-muted-foreground">
        Wenn die Email Adresse gültig ist, erhältst du in Kürze eine Email mit
        den Anweisungen zum Zurücksetzen deines Passworts. Du kannst diese Seite
        jetzt schließen.
      </p>
    );
  }

  return (
    <Form {...form}>
      <form
        className="space-y-6"
        onSubmit={form.handleSubmit(
          async ({ email }: z.infer<typeof loginSchema>) => {
            startTransition(async () => {
              await forgotPassword(email);
              setIsSubmitted(true);
            });
          },
        )}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          Passwort zurücksetzen
        </Button>
      </form>
    </Form>
  );
}
