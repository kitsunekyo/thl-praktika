import Image from "next/image";
import Link from "next/link";
import React from "react";

import { validateInvitation } from "./actions";
import { SignupForm } from "./SignupForm";

export default async function Signup({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const name =
    typeof searchParams.name === "string" ? searchParams.name : undefined;
  const email =
    typeof searchParams.email === "string" ? searchParams.email : undefined;
  const id = typeof searchParams.id === "string" ? searchParams.id : undefined;

  if (!id) {
    return <InvalidInvitation />;
  }
  const isValid = await validateInvitation(id);
  if (!isValid) {
    return <InvalidInvitation />;
  }

  return (
    <>
      <h1 className="mb-6 text-center text-4xl font-bold">Registrieren</h1>
      <SignupForm name={name} email={email} />
      <div className="mt-6 text-center text-sm">
        <p className="text-muted-foreground">Du hast bereits einen Account?</p>
        <Link href="/login" className="underline hover:no-underline">
          Anmelden
        </Link>
      </div>
    </>
  );
}

function InvalidInvitation() {
  return (
    <div className="text-center">
      <Image
        src="/img/dog-bucket.svg"
        className="mx-auto h-56"
        width={196}
        height={224}
        alt="Hund mit Eimer am Kopf"
      />

      <h1 className="mb-3 mt-6 text-2xl font-bold">
        Einladung abgelaufen oder ungültig
      </h1>

      <p className="text-muted-foreground">
        Die Einladung ist leider abgelaufen oder ungültig. Schick eine email an
        hi@mostviertel.tech um eine neue Einladung zu erhalten.
      </p>
    </div>
  );
}
