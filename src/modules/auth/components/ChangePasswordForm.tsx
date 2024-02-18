"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { changePassword } from "@/modules/users/actions";

const formSchema = z.object({
  password: z
    .string()
    .min(6, { message: "Passwort muss mindestens 6 Zeichen lang sein." }),
});

export function ChangePasswordForm() {
  const [loading, startTransition] = useTransition();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  if (isSubmitted) {
    return (
      <p>
        Dein Passwort wurde erfolgreich geändert. Du kannst dich das nächste mal
        mit deinem neuen Passwort anmelden.
      </p>
    );
  }

  async function handleSubmit({ password }: z.infer<typeof formSchema>) {
    startTransition(async () => {
      try {
        await changePassword(password);
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
          name="password"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormLabel>Passwort ändern</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Input
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    {...field}
                  />
                  {showPassword ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0"
                      aria-label="Passwort verstecken"
                      onClick={() => setShowPassword(false)}
                    >
                      <EyeIcon className="h-6 w-6" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="shrink-0"
                      aria-label="Passwort anzeigen"
                      onClick={() => setShowPassword(true)}
                    >
                      <EyeOffIcon className="h-6 w-6" />
                    </Button>
                  )}
                </div>
              </FormControl>
              <FormMessage />
              <FormDescription>
                Dein Passwort muss mindestens 6 Zeichen lang sein.
              </FormDescription>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          Passwort ändern
        </Button>
      </form>
    </Form>
  );
}
