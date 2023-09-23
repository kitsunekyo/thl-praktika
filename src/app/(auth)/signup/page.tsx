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
      <div className="mt-12 text-center">
        <p>Du hast bereits einen Account?</p>
        <p>
          <Link href="/login" className="font-semibold underline">
            Anmelden
          </Link>
        </p>
      </div>
    </>
  );
}
