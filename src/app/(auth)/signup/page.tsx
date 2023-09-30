import Link from "next/link";
import React from "react";

import { SignupForm } from "./SignupForm";

export default async function Login({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const name =
    typeof searchParams.name === "string" ? searchParams.name : undefined;
  const email =
    typeof searchParams.email === "string" ? searchParams.email : undefined;

  return (
    <>
      <h1 className="mb-6 text-center text-4xl font-bold">Registrieren</h1>
      <SignupForm name={name} email={email} />
      <div className="mt-6 text-center text-sm">
        <p className="text-muted-foreground">Du hast bereits einen Account?</p>
        <Link href="/login" className="underline hover:no-underline">
          Anmelden
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
