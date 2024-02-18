import Link from "next/link";
import React from "react";

import { LoginForm } from "@/modules/auth/components/LoginForm";

export default async function Login({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const email =
    typeof searchParams.email === "string" ? searchParams.email : undefined;

  return (
    <>
      <h1 className="mb-6 text-center text-4xl font-bold">Anmelden</h1>
      <LoginForm email={email} />
      <div className="mt-6 space-y-2 text-center text-sm">
        <div>
          <Link href="/forgot-password" className="hover:underline">
            Passwort vergessen
          </Link>
        </div>
        <div>
          <span className="mr-1 text-muted-foreground">
            Du hast noch kein Konto?
          </span>
          <Link href="/signup" className="underline hover:no-underline">
            Registrieren
          </Link>
        </div>
      </div>
    </>
  );
}
