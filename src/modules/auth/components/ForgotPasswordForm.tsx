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
import { useToast } from "@/components/ui/use-toast";
import { forgotPassword } from "@/modules/auth/actions";

const formSchema = z.object({
  email: z.string().email({ message: "Ungültige Email" }),
});

export function ForgotPasswordForm() {
  const [loading, startTransition] = useTransition();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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

  async function handleSubmit({ email }: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        await forgotPassword(email);
        setIsSubmitted(true);
      } catch {
        toast({
          title: "Fehler",
          description:
            "Dein Passwort konnte nicht geändert werden. Versuch es später nochmal.",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
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
