import Link from "next/link";
import React from "react";

import { LoginForm } from "./LoginForm";

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
      <div className="mt-6 space-x-4 text-center text-sm">
        <Link href="/forgot-password" className="underline hover:no-underline">
          Passwort vergessen
        </Link>
        <Link
          href="/about"
          className="mt-4 block text-muted-foreground underline hover:no-underline"
        >
          Über diese App
        </Link>
      </div>
    </>
  );
}
