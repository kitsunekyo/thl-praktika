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
    </>
  );
}
