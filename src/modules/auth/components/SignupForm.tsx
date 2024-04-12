"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, EyeIcon, EyeOffIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { signup } from "@/modules/auth/actions";

const formSchema = z.object({
  email: z.string().email({ message: "Ungültige Email" }),
  password: z
    .string()
    .min(6, { message: "Passwort entspricht nicht den Kritieren" }),
  name: z.string(),
});

export function SignupForm({ name, email }: { name?: string; email?: string }) {
  const [loading, startTransition] = useTransition();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const search = useSearchParams();
  const error = search.get("error");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email,
      name,
      password: "",
    },
  });

  const handleSubmit = async ({
    email,
    password,
    name,
  }: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      try {
        await signup({ email, password, name });
        setIsLoggingIn(true);
        signIn("credentials", {
          email,
          password,
        });
      } catch {
        toast({
          title: "Registrierung fehlgeschlagen",
          description:
            "Hast du dich mit der bei THL hinterlegten E-Mail registriert? Wenn du eine andere E-Mail-Adresse verwenden möchtest, kontaktiere mich bitte unter hi@mostviertel.tech.",
          variant: "destructive",
        });
      }
    });
  };

  if (isLoggingIn) {
    return (
      <>
        <Loader2Icon className="mx-auto mb-4 h-6 w-6 animate-spin" />
        <p className="text-center">
          Erfolgreich registriert! Du wirst gleich angemeldet{" "}
        </p>
      </>
    );
  }

  return (
    <Form {...form}>
      {!!error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Fehler</AlertTitle>
          <AlertDescription>Email oder Passwort sind falsch.</AlertDescription>
        </Alert>
      )}
      <form className="space-y-6" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email*</FormLabel>
              <FormControl>
                <Input type="email" required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" data-1p-ignore {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="flex-grow">
              <FormLabel>Passwort*</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Input
                    type={showPassword ? "text" : "password"}
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
              <FormDescription>Mindestens 6 Zeichen.</FormDescription>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          Registrieren
        </Button>
      </form>
      <div className="my-8 flex items-center gap-4">
        <Separator className="shrink" />
        <span className="text-sm">oder</span>
        <Separator className="shrink" />
      </div>
      <GoogleSignupButton />
      <p className="my-6 text-center text-xs text-muted-foreground">
        Du musst die bei THL hinterlegte E-Mail Adresse, oder die aus deiner
        Einladung verwenden, um dich registrieren zu können. Wenn du eine andere
        E-Mail Adresse verwenden möchtest, kontaktiere mich bitte unter{" "}
        <a href="mailto:hi@mostviertel.tech">hi@mostviertel.tech</a>.
      </p>
      <div className="mt-6 text-center text-sm">
        <span className="mr-1 text-muted-foreground">
          Du hast bereits einen Account?
        </span>
        <Link href="/login" className="underline hover:no-underline">
          Anmelden
        </Link>
      </div>
    </Form>
  );
}

function GoogleSignupButton() {
  const [loading, startTransition] = useTransition();

  return (
    <Button
      type="button"
      className="w-full bg-[#4285F4] hover:bg-[#4074c7]"
      disabled={loading}
      onClick={() =>
        startTransition(() => {
          signIn("google");
        })
      }
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
