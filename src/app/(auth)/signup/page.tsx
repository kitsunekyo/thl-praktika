import Link from "next/link";
import React from "react";

import { SignupForm } from "@/modules/auth/components/SignupForm";

export default async function Signup({
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
    </>
  );
}
