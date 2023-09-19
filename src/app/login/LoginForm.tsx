"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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

export const loginSchema = z.object({
  email: z.string().email({ message: "Ungültige Email" }),
  password: z.string().min(1, { message: "Passwort darf nicht leer sein" }),
});

export function LoginForm() {
  const [loading, setLoading] = useState(false);

  const search = useSearchParams();
  const error = search.get("error");

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      {!!error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Fehler</AlertTitle>
          <AlertDescription>Email oder Passwort sind falsch.</AlertDescription>
        </Alert>
      )}
      <form
        className="space-y-6"
        onSubmit={form.handleSubmit(
          async ({ email, password }: z.infer<typeof loginSchema>) => {
            setLoading(true);
            try {
              signIn("credentials", { email, password });
            } catch {
              setLoading(false);
            }
          },
        )}
      >
        <GoogleSignInButton />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="good@pup.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Passwort</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          Anmelden
        </Button>
      </form>
    </Form>
  );
}

function GoogleSignInButton() {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      type="button"
      className="w-full bg-[#4285F4] hover:bg-[#4074c7]"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        try {
          await signIn("google");
        } catch {
          setLoading(false);
        }
      }}
    >
      <svg
        className="mr-2 h-4 w-4"
        aria-hidden="true"
        focusable="false"
        data-prefix="fab"
        data-icon="google"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 488 512"
      >
        <path
          fill="currentColor"
          d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
        ></path>
      </svg>
      Mit Google anmelden
    </Button>
  );
}
